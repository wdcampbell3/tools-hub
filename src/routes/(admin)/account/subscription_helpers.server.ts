import { env } from "$env/dynamic/private"
import { building } from "$app/environment"
import Stripe from "stripe"
import { pricingPlans } from "../../(marketing)/pricing/pricing_plans"
import {
  getProfile,
  getStripeCustomer,
  createStripeCustomer,
  type AppUser,
} from "$lib/firestore.server"

const stripe = building
  ? ({} as Stripe)
  : new Stripe(env.PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

export const getOrCreateCustomerId = async ({ user }: { user: AppUser }) => {
  // Check if customer already exists
  const existingCustomer = await getStripeCustomer(user.id)

  if (existingCustomer?.stripe_customer_id) {
    return { customerId: existingCustomer.stripe_customer_id }
  }

  // Fetch profile data for customer creation
  const profile = await getProfile(user.id)

  // Create a stripe customer
  let customer
  try {
    customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: profile?.full_name ?? "",
      metadata: {
        user_id: user.id,
        company_name: profile?.company_name ?? "",
        website: profile?.website ?? "",
      },
    })
  } catch (e) {
    return { error: e }
  }

  if (!customer.id) {
    return { error: "Unknown stripe user creation error" }
  }

  // Save to Firestore
  try {
    await createStripeCustomer(user.id, customer.id)
  } catch (e) {
    return { error: e }
  }

  return { customerId: customer.id }
}

export const fetchSubscription = async ({
  customerId,
}: {
  customerId: string
}) => {
  // Fetch user's subscriptions
  let stripeSubscriptions
  try {
    stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: "all",
    })
  } catch (e) {
    return { error: e }
  }

  // find "primary". The user may have several old ones, we want an active one (including trials, and past_due in grace period).
  const primaryStripeSubscription = stripeSubscriptions.data.find((x) => {
    return (
      x.status === "active" ||
      x.status === "trialing" ||
      x.status === "past_due"
    )
  })
  let appSubscription = null
  if (primaryStripeSubscription) {
    const productId =
      primaryStripeSubscription?.items?.data?.[0]?.price.product ?? ""
    appSubscription = pricingPlans.find((x) => {
      return x.stripe_product_id === productId
    })
    if (!appSubscription) {
      return {
        error:
          "Stripe subscription does not have matching app subscription in pricing_plans.ts (via product id match)",
      }
    }
  }
  let primarySubscription = null
  if (primaryStripeSubscription && appSubscription) {
    primarySubscription = {
      stripeSubscription: primaryStripeSubscription,
      appSubscription: appSubscription,
    }
  }

  const hasEverHadSubscription = stripeSubscriptions.data.length > 0

  return {
    primarySubscription,
    hasEverHadSubscription,
  }
}
