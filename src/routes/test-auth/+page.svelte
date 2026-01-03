<script lang="ts">
  import { onMount } from 'svelte';

  let serverStatus = $state<any>(null);
  let authTestResult = $state<any>(null);
  let loading = $state(false);
  let testEmail = $state('');
  let testPassword = $state('');
  let clientAuthStatus = $state<any>(null);

  async function checkServerAuth() {
    loading = true;
    try {
      const response = await fetch('/api/test-auth');
      authTestResult = await response.json();
    } catch (error) {
      authTestResult = { success: false, error: String(error) };
    }
    loading = false;
  }

  async function createTestUser() {
    loading = true;
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-test-user',
          email: testEmail || undefined,
          password: testPassword || undefined
        })
      });
      const result = await response.json();
      authTestResult = result;

      if (result.success && result.credentials) {
        testEmail = result.credentials.email;
        testPassword = result.credentials.password;
      }
    } catch (error) {
      authTestResult = { success: false, error: String(error) };
    }
    loading = false;
  }

  async function deleteTestUser() {
    if (!testEmail) {
      alert('Please enter an email address');
      return;
    }
    loading = true;
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-test-user',
          email: testEmail
        })
      });
      authTestResult = await response.json();
    } catch (error) {
      authTestResult = { success: false, error: String(error) };
    }
    loading = false;
  }

  async function testClientAuth() {
    loading = true;
    try {
      // Dynamically import Firebase client SDK
      const { initializeApp } = await import('firebase/app');
      const { getAuth, signInWithEmailAndPassword, signOut } = await import('firebase/auth');

      const firebaseConfig = {
        apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
        authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
        measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
      };

      const app = initializeApp(firebaseConfig, 'test-app');
      const auth = getAuth(app);

      if (!testEmail || !testPassword) {
        clientAuthStatus = { success: false, error: 'Please enter email and password' };
        loading = false;
        return;
      }

      // Try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);

      clientAuthStatus = {
        success: true,
        message: 'Client-side authentication successful!',
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified
        }
      };

      // Sign out
      await signOut(auth);
    } catch (error: any) {
      clientAuthStatus = {
        success: false,
        error: error.message || String(error),
        code: error.code
      };
    }
    loading = false;
  }

  onMount(async () => {
    await checkServerAuth();
  });
</script>

<div class="container mx-auto p-8 max-w-4xl">
  <h1 class="text-3xl font-bold mb-8">Firebase Authentication Test</h1>

  <!-- Server-side Auth Test -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Server-side Authentication (Admin SDK)</h2>

      <button
        class="btn btn-primary"
        onclick={checkServerAuth}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Check Server Auth Status'}
      </button>

      {#if authTestResult}
        <div class="mt-4 p-4 bg-base-300 rounded-lg">
          <pre class="text-sm overflow-auto">{JSON.stringify(authTestResult, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>

  <!-- Create Test User -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Create Test User</h2>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Email (optional - will auto-generate if empty)</span>
        </label>
        <input
          type="email"
          placeholder="test@example.com"
          class="input input-bordered"
          bind:value={testEmail}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Password (optional - defaults to TestPassword123!)</span>
        </label>
        <input
          type="password"
          placeholder="TestPassword123!"
          class="input input-bordered"
          bind:value={testPassword}
        />
      </div>

      <div class="flex gap-2 mt-4">
        <button
          class="btn btn-success"
          onclick={createTestUser}
          disabled={loading}
        >
          Create Test User
        </button>

        <button
          class="btn btn-error"
          onclick={deleteTestUser}
          disabled={loading || !testEmail}
        >
          Delete Test User
        </button>
      </div>
    </div>
  </div>

  <!-- Client-side Auth Test -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Client-side Authentication Test</h2>
      <p class="text-sm text-base-content/70 mb-4">
        This tests the Firebase client SDK authentication (what users will use)
      </p>

      <button
        class="btn btn-primary"
        onclick={testClientAuth}
        disabled={loading || !testEmail || !testPassword}
      >
        {loading ? 'Testing...' : 'Test Client Sign In'}
      </button>

      {#if clientAuthStatus}
        <div class="mt-4 p-4 rounded-lg {clientAuthStatus.success ? 'bg-success/20' : 'bg-error/20'}">
          <pre class="text-sm overflow-auto">{JSON.stringify(clientAuthStatus, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>

  <!-- Instructions -->
  <div class="alert alert-info">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div>
      <h3 class="font-bold">Testing Steps:</h3>
      <ol class="list-decimal list-inside text-sm mt-2">
        <li>Click "Check Server Auth Status" to verify admin SDK</li>
        <li>Click "Create Test User" to create a test account</li>
        <li>Click "Test Client Sign In" to test client-side authentication</li>
        <li>Clean up by clicking "Delete Test User" when done</li>
      </ol>
    </div>
  </div>
</div>
