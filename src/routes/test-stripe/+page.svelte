<script lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { onMount } from "svelte"

  let connectionStatus = $state<any>(null)
  let products = $state<any>(null)
  let prices = $state<any>(null)
  let customers = $state<any>(null)
  let loading = $state(false)

  async function testConnection() {
    loading = true
    try {
      const response = await fetch("/api/test-stripe")
      connectionStatus = await response.json()
    } catch (error) {
      connectionStatus = { success: false, error: String(error) }
    }
    loading = false
  }

  async function listProducts() {
    loading = true
    try {
      const response = await fetch("/api/test-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-products" }),
      })
      products = await response.json()
    } catch (error) {
      products = { success: false, error: String(error) }
    }
    loading = false
  }

  async function listPrices() {
    loading = true
    try {
      const response = await fetch("/api/test-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-prices" }),
      })
      prices = await response.json()
    } catch (error) {
      prices = { success: false, error: String(error) }
    }
    loading = false
  }

  async function listCustomers() {
    loading = true
    try {
      const response = await fetch("/api/test-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-customers" }),
      })
      customers = await response.json()
    } catch (error) {
      customers = { success: false, error: String(error) }
    }
    loading = false
  }

  onMount(() => {
    testConnection()
  })
</script>

<div class="container mx-auto p-8 max-w-6xl">
  <h1 class="text-3xl font-bold mb-8">Stripe Connection Test</h1>

  <!-- Connection Status -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Connection Status</h2>

      <button
        class="btn btn-primary"
        onclick={testConnection}
        disabled={loading}
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>

      {#if connectionStatus}
        <div
          class="mt-4 p-4 rounded-lg {connectionStatus.success
            ? 'bg-success/20'
            : 'bg-error/20'}"
        >
          <div class="flex items-center gap-2 mb-2">
            {#if connectionStatus.success}
              <span class="text-2xl">✓</span>
              <span class="font-bold text-success">Connected!</span>
              {#if connectionStatus.mode === "LIVE"}
                <div class="badge badge-error">LIVE MODE</div>
              {:else}
                <div class="badge badge-warning">TEST MODE</div>
              {/if}
            {:else}
              <span class="text-2xl">✗</span>
              <span class="font-bold text-error">Connection Failed</span>
            {/if}
          </div>

          {#if connectionStatus.success}
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p class="text-sm font-semibold">Key Type:</p>
                <p class="text-sm">{connectionStatus.keyType}</p>
              </div>
              {#if connectionStatus.account}
                <div>
                  <p class="text-sm font-semibold">Account ID:</p>
                  <p class="text-sm">{connectionStatus.account.id}</p>
                </div>
                <div>
                  <p class="text-sm font-semibold">Email:</p>
                  <p class="text-sm">
                    {connectionStatus.account.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-semibold">Country:</p>
                  <p class="text-sm">{connectionStatus.account.country}</p>
                </div>
              {/if}
              {#if connectionStatus.balance}
                <div>
                  <p class="text-sm font-semibold">Available Balance:</p>
                  <p class="text-sm">
                    ${(connectionStatus.balance.available[0]?.amount || 0) /
                      100}
                    {connectionStatus.balance.currency.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-semibold">Pending Balance:</p>
                  <p class="text-sm">
                    ${(connectionStatus.balance.pending[0]?.amount || 0) / 100}
                    {connectionStatus.balance.currency.toUpperCase()}
                  </p>
                </div>
              {/if}
            </div>
          {/if}

          <details class="mt-4">
            <summary class="cursor-pointer text-sm font-semibold"
              >Raw Response</summary
            >
            <pre class="text-xs overflow-auto mt-2">{JSON.stringify(
                connectionStatus,
                null,
                2,
              )}</pre>
          </details>
        </div>
      {/if}
    </div>
  </div>

  <!-- Products -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Products</h2>

      <button class="btn btn-primary" onclick={listProducts} disabled={loading}>
        {loading ? "Loading..." : "List Products"}
      </button>

      {#if products}
        <div class="mt-4">
          {#if products.success}
            <p class="font-semibold mb-2">
              Found {products.productCount} products:
            </p>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {#each products.products as product}
                    <tr>
                      <td class="font-semibold">{product.name}</td>
                      <td class="text-sm">{product.description || "N/A"}</td>
                      <td>
                        <div
                          class="badge {product.active
                            ? 'badge-success'
                            : 'badge-error'}"
                        >
                          {product.active ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td class="text-xs"
                        >{new Date(product.created).toLocaleDateString()}</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="alert alert-error">
              <span>{products.error}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Prices -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Prices</h2>

      <button class="btn btn-primary" onclick={listPrices} disabled={loading}>
        {loading ? "Loading..." : "List Prices"}
      </button>

      {#if prices}
        <div class="mt-4">
          {#if prices.success}
            <p class="font-semibold mb-2">Found {prices.priceCount} prices:</p>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Recurring</th>
                    <th>Product ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {#each prices.prices as price}
                    <tr>
                      <td class="font-semibold">
                        ${(price.unitAmount / 100).toFixed(2)}
                      </td>
                      <td>{price.currency.toUpperCase()}</td>
                      <td>
                        {#if price.recurring}
                          <div class="badge badge-info">
                            {price.recurring.interval}
                          </div>
                        {:else}
                          One-time
                        {/if}
                      </td>
                      <td class="text-xs">{price.productId}</td>
                      <td>
                        <div
                          class="badge {price.active
                            ? 'badge-success'
                            : 'badge-error'}"
                        >
                          {price.active ? "Active" : "Inactive"}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="alert alert-error">
              <span>{prices.error}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Customers -->
  <div class="card bg-base-200 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">Customers</h2>

      <button
        class="btn btn-primary"
        onclick={listCustomers}
        disabled={loading}
      >
        {loading ? "Loading..." : "List Customers"}
      </button>

      {#if customers}
        <div class="mt-4">
          {#if customers.success}
            <p class="font-semibold mb-2">
              Found {customers.customerCount} customers:
            </p>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Customer ID</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {#each customers.customers as customer}
                    <tr>
                      <td class="font-semibold">{customer.name || "N/A"}</td>
                      <td>{customer.email || "N/A"}</td>
                      <td class="text-xs">{customer.id}</td>
                      <td class="text-xs"
                        >{new Date(customer.created).toLocaleDateString()}</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="alert alert-error">
              <span>{customers.error}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Warning -->
  <div class="alert alert-warning">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      ></path>
    </svg>
    <div>
      <h3 class="font-bold">LIVE MODE WARNING</h3>
      <p class="text-sm">
        You are using a LIVE Stripe API key. Real transactions can be processed.
        For testing, consider using a TEST mode API key (starts with sk_test_ or
        rk_test_).
      </p>
    </div>
  </div>
</div>
