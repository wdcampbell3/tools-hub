<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings_module.svelte"
  import { auth } from "$lib/firebase"
  import { sendPasswordResetEmail } from "firebase/auth"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()
  let { user } = data

  // For Firebase, we always use password reset email flow
  let hasPassword = true

  let sendBtnDisabled = $state(false)
  let sendBtnText = $state("Send Set Password Email")
  let sentEmail = $state(false)
  let sendForgotPassword = async () => {
    sendBtnDisabled = true
    sendBtnText = "Sending..."

    const email = user?.email
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email)
        sentEmail = true
      } catch (error) {
        sentEmail = false
      }
      sendBtnDisabled = false
      sendBtnText = "Send Forgot Password Email"
    }
  }
</script>

<svelte:head>
  <title>Change Password</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Change Password</h1>

{#if hasPassword}
  <SettingsModule
    title="Change Password"
    editable={true}
    saveButtonTitle="Change Password"
    successTitle="Password Changed"
    successBody="On next sign in, use your new password."
    formTarget="/account/api?/updatePassword"
    fields={[
      {
        id: "newPassword1",
        label: "New Password",
        initialValue: "",
        inputType: "password",
      },
      {
        id: "newPassword2",
        label: "Confirm New Password",
        initialValue: "",
        inputType: "password",
      },
    ]}
  />
{:else}
  <div
    class="card p-6 pb-7 mt-8 max-w-xl flex flex-col md:flex-row shadow-sm max-w-md"
  >
    <div class="flex flex-col gap-y-4">
      <div class="font-bold">Change Password By Email</div>
      <div>
        The button below will send you an email at {user?.email} which will allow
        you to set your password.
      </div>
      <button
        class="btn btn-outline btn-wide {sentEmail ? 'hidden' : ''}"
        disabled={sendBtnDisabled}
        onclick={sendForgotPassword}
      >
        {sendBtnText}
      </button>
      <div class="success alert alert-success {sentEmail ? '' : 'hidden'}">
        Sent email! Please check your inbox and use the link to set your
        password.
      </div>
    </div>
  </div>
{/if}
