<script lang="ts">
  import { onMount } from 'svelte';

  let connectionStatus = $state<any>(null);
  let uploadResult = $state<any>(null);
  let loading = $state(false);
  let selectedFile = $state<File | null>(null);
  let previewUrl = $state<string>('');

  async function testConnection() {
    loading = true;
    try {
      const response = await fetch('/api/test-cloudinary');
      connectionStatus = await response.json();
    } catch (error) {
      connectionStatus = { success: false, error: String(error) };
    }
    loading = false;
  }

  async function testUpload() {
    loading = true;
    try {
      const response = await fetch('/api/test-cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-upload' })
      });
      uploadResult = await response.json();
    } catch (error) {
      uploadResult = { success: false, error: String(error) };
    }
    loading = false;
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadCustomImage() {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    loading = true;
    uploadResult = null;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        const response = await fetch('/api/test-cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upload-custom',
            file: base64,
            filename: selectedFile!.name
          })
        });

        uploadResult = await response.json();
        loading = false;
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      uploadResult = { success: false, error: String(error) };
      loading = false;
    }
  }

  onMount(() => {
    testConnection();
  });
</script>

<div class="container mx-auto p-8 max-w-4xl">
  <h1 class="text-3xl font-bold mb-8">Cloudinary Connection Test</h1>

  <!-- Connection Status -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Connection Status</h2>

      <button
        class="btn btn-primary"
        onclick={testConnection}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {#if connectionStatus}
        <div class="mt-4 p-4 rounded-lg {connectionStatus.success ? 'bg-success/20' : 'bg-error/20'}">
          <div class="flex items-center gap-2 mb-2">
            {#if connectionStatus.success}
              <span class="text-2xl">✓</span>
              <span class="font-bold text-success">Connected!</span>
            {:else}
              <span class="text-2xl">✗</span>
              <span class="font-bold text-error">Connection Failed</span>
            {/if}
          </div>
          <pre class="text-sm overflow-auto mt-2">{JSON.stringify(connectionStatus, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>

  <!-- Test Upload -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Test Upload (1x1 Test Image)</h2>
      <p class="text-sm text-base-content/70">
        This will upload a tiny test image and immediately delete it
      </p>

      <button
        class="btn btn-success"
        onclick={testUpload}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Upload & Delete'}
      </button>

      {#if uploadResult}
        <div class="mt-4 p-4 rounded-lg {uploadResult.success ? 'bg-success/20' : 'bg-error/20'}">
          {#if uploadResult.success}
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">✓</span>
              <span class="font-bold text-success">Upload Successful!</span>
            </div>
            {#if uploadResult.uploadedUrl}
              <div class="mt-2">
                <p class="text-sm font-semibold">Uploaded URL:</p>
                <a
                  href={uploadResult.uploadedUrl}
                  target="_blank"
                  class="text-primary text-sm break-all hover:underline"
                >
                  {uploadResult.uploadedUrl}
                </a>
              </div>
            {/if}
          {:else}
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">✗</span>
              <span class="font-bold text-error">Upload Failed</span>
            </div>
          {/if}
          <pre class="text-sm overflow-auto mt-2">{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>

  <!-- Custom Image Upload -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Upload Custom Image</h2>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Select an image file</span>
        </label>
        <input
          type="file"
          accept="image/*"
          class="file-input file-input-bordered"
          onchange={handleFileSelect}
        />
      </div>

      {#if previewUrl}
        <div class="mt-4">
          <p class="text-sm font-semibold mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            class="max-w-md max-h-64 rounded-lg border border-base-300"
          />
        </div>
      {/if}

      <button
        class="btn btn-primary mt-4"
        onclick={uploadCustomImage}
        disabled={loading || !selectedFile}
      >
        {loading ? 'Uploading...' : 'Upload to Cloudinary'}
      </button>
    </div>
  </div>

  <!-- Summary -->
  <div class="alert alert-info">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div>
      <h3 class="font-bold">Cloudinary Test Summary</h3>
      <ul class="list-disc list-inside text-sm mt-2">
        <li>Connection test verifies API credentials and lists existing resources</li>
        <li>Upload test creates and deletes a tiny test image</li>
        <li>Custom upload lets you test with your own images</li>
      </ul>
    </div>
  </div>
</div>
