import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../../config"
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "$lib/firestore.server"
import { adminAuth } from "$lib/firebase-admin.server"

export const actions = {
  toggleEmailSubscription: async ({ locals }) => {
    const { user } = await locals.getSession()

    if (!user) {
      redirect(303, "/login")
    }

    const currentProfile = await getProfile(user.id)
    const newUnsubscribedStatus = !currentProfile?.unsubscribed

    try {
      await updateProfile(user.id, { unsubscribed: newUnsubscribedStatus })
    } catch (error) {
      console.error("Error updating subscription status", error)
      return fail(500, { message: "Failed to update subscription status" })
    }

    return {
      unsubscribed: newUnsubscribedStatus,
    }
  },

  updateEmail: async ({ request, locals }) => {
    const { user } = await locals.getSession()
    if (!user) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const email = formData.get("email") as string

    let validationError
    if (!email || email === "") {
      validationError = "An email address is required"
    } else if (!email.includes("@")) {
      validationError = "A valid email address is required"
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["email"],
        email,
      })
    }

    try {
      await adminAuth.updateUser(user.id, { email })
    } catch (error) {
      console.error("Error updating email", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        email,
      })
    }

    return {
      email,
    }
  },

  updatePassword: async ({ request, locals }) => {
    const { user } = await locals.getSession()
    if (!user) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const newPassword1 = formData.get("newPassword1") as string
    const newPassword2 = formData.get("newPassword2") as string

    let validationError
    const errorFields = []
    if (!newPassword1) {
      validationError = "You must type a new password"
      errorFields.push("newPassword1")
    }
    if (!newPassword2) {
      validationError = "You must type the new password twice"
      errorFields.push("newPassword2")
    }
    if (newPassword1.length < 6) {
      validationError = "The new password must be at least 6 characters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1.length > 72) {
      validationError = "The new password can be at most 72 characters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1 != newPassword2) {
      validationError = "The passwords don't match"
      errorFields.push("newPassword1")
      errorFields.push("newPassword2")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)],
        newPassword1,
        newPassword2,
      })
    }

    try {
      await adminAuth.updateUser(user.id, { password: newPassword1 })
    } catch (error) {
      console.error("Error updating password", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        newPassword1,
        newPassword2,
      })
    }

    return {
      newPassword1,
      newPassword2,
    }
  },

  deleteAccount: async ({ locals }) => {
    const { user } = await locals.getSession()
    if (!user) {
      redirect(303, "/login")
    }

    try {
      // Delete profile from Firestore
      await deleteProfile(user.id)

      // Delete user from Firebase Auth
      await adminAuth.deleteUser(user.id)

      // Clear session cookie
      locals.clearSessionCookie()
    } catch (error) {
      console.error("Error deleting user", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
      })
    }

    redirect(303, "/")
  },

  updateProfile: async ({ request, locals }) => {
    const { user } = await locals.getSession()
    if (!user) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const fullName = formData.get("fullName") as string
    const companyName = formData.get("companyName") as string
    const website = formData.get("website") as string

    let validationError
    const fieldMaxTextLength = 50
    const errorFields = []
    if (!fullName) {
      validationError = "Name is required"
      errorFields.push("fullName")
    } else if (fullName.length > fieldMaxTextLength) {
      validationError = `Name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("fullName")
    }
    if (!companyName) {
      validationError =
        "Company name is required. If this is a hobby project or personal app, please put your name."
      errorFields.push("companyName")
    } else if (companyName.length > fieldMaxTextLength) {
      validationError = `Company name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("companyName")
    }
    if (!website) {
      validationError =
        "Company website is required. An app store URL is a good alternative if you don't have a website."
      errorFields.push("website")
    } else if (website.length > fieldMaxTextLength) {
      validationError = `Company website must be less than ${fieldMaxTextLength} characters`
      errorFields.push("website")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields,
        fullName,
        companyName,
        website,
      })
    }

    // Check if profile exists
    const priorProfile = await getProfile(user.id)
    const isNewProfile = !priorProfile || priorProfile.updated_at === null

    try {
      if (priorProfile) {
        await updateProfile(user.id, {
          full_name: fullName,
          company_name: companyName,
          website: website,
        })
      } else {
        await createProfile(user.id, {
          full_name: fullName,
          company_name: companyName,
          website: website,
          unsubscribed: false,
        })
      }
    } catch (error) {
      console.error("Error updating profile", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        fullName,
        companyName,
        website,
      })
    }

    // If the profile was just created, send emails
    if (isNewProfile) {
      await sendAdminEmail({
        subject: "Profile Created",
        body: `Profile created by ${user.email}\nFull name: ${fullName}\nCompany name: ${companyName}\nWebsite: ${website}`,
      })

      await sendUserEmail({
        user: { email: user.email ?? "", id: user.id },
        subject: "Welcome!",
        from_email: "no-reply@saasstarter.work",
        template_name: "welcome_email",
        template_properties: {
          companyName: "SaaS Starter",
          WebsiteBaseUrl: WebsiteBaseUrl,
        },
      })
    }

    return {
      fullName,
      companyName,
      website,
    }
  },

  signout: async ({ locals }) => {
    const { user } = await locals.getSession()
    if (user) {
      locals.clearSessionCookie()
    }
    redirect(303, "/")
  },
}
