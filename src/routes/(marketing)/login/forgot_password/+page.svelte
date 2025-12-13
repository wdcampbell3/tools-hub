<script lang="ts">
  import { auth } from "$lib/firebase"
  import { sendPasswordResetEmail } from "firebase/auth"

  let email = $state("")
  let loading = $state(false)
  let errorMessage = $state("")
  let successMessage = $state("")

  async function handleResetPassword() {
    loading = true
    errorMessage = ""
    successMessage = ""

    try {
      await sendPasswordResetEmail(auth, email)
      successMessage = "Password reset email sent! Check your inbox."
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === "auth/user-not-found") {
        errorMessage = "No account found with this email"
      } else {
        errorMessage = (error as Error).message || "Failed to send reset email"
      }
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Forgot Password</h1>

{#if errorMessage}
  <div role="alert" class="alert alert-error mb-4">
    <span>{errorMessage}</span>
  </div>
{/if}

{#if successMessage}
  <div role="alert" class="alert alert-success mb-4">
    <span>{successMessage}</span>
  </div>
{/if}

<form
  onsubmit={(e) => {
    e.preventDefault()
    handleResetPassword()
  }}
  class="space-y-4"
>
  <div class="form-control">
    <label class="label" for="email">
      <span class="label-text">Email</span>
    </label>
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="you@example.com"
      class="input input-bordered w-full"
      required
    />
  </div>

  <button type="submit" class="btn btn-primary w-full" disabled={loading}>
    {#if loading}
      <span class="loading loading-spinner loading-sm"></span>
    {:else}
      Send Reset Email
    {/if}
  </button>
</form>

<div class="text-l text-slate-800 mt-4">
  Remember your password? <a class="underline" href="/login/sign_in">Sign in</a
  >.
</div>
