import { j as json } from "../../../../chunks/index2.js";
import { d as private_env } from "../../../../chunks/shared-server.js";
const GET = async () => {
  try {
    const stripeApiKey = private_env.PRIVATE_STRIPE_API_KEY;
    if (!stripeApiKey) {
      return json(
        {
          success: false,
          error: "Stripe API key not configured",
          configured: false
        },
        { status: 500 }
      );
    }
    if (stripeApiKey.includes("000000") || stripeApiKey.includes("your_")) {
      return json(
        {
          success: false,
          error: "Stripe API key appears to be a placeholder value",
          configured: false
        },
        { status: 500 }
      );
    }
    const keyType = stripeApiKey.startsWith("sk_live_") ? "live" : stripeApiKey.startsWith("sk_test_") ? "test" : stripeApiKey.startsWith("rk_live_") ? "restricted_live" : stripeApiKey.startsWith("rk_test_") ? "restricted_test" : "unknown";
    const response = await fetch("https://api.stripe.com/v1/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stripeApiKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Stripe API request failed";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        errorMessage = errorText;
      }
      return json(
        {
          success: false,
          error: errorMessage,
          status: response.status,
          keyType,
          configured: true
        },
        { status: 500 }
      );
    }
    const balanceData = await response.json();
    const accountResponse = await fetch("https://api.stripe.com/v1/account", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stripeApiKey}`
      }
    });
    let accountInfo = null;
    if (accountResponse.ok) {
      accountInfo = await accountResponse.json();
    }
    return json({
      success: true,
      message: "Stripe connection successful!",
      keyType,
      mode: keyType.includes("live") ? "LIVE" : "TEST",
      balance: {
        available: balanceData.available,
        pending: balanceData.pending,
        currency: balanceData.available?.[0]?.currency || "usd"
      },
      account: accountInfo ? {
        id: accountInfo.id,
        email: accountInfo.email,
        country: accountInfo.country,
        defaultCurrency: accountInfo.default_currency,
        chargesEnabled: accountInfo.charges_enabled,
        payoutsEnabled: accountInfo.payouts_enabled
      } : null,
      connectionTest: "passed"
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: String(error)
      },
      { status: 500 }
    );
  }
};
const POST = async ({ request }) => {
  try {
    const { action } = await request.json();
    const stripeApiKey = private_env.PRIVATE_STRIPE_API_KEY;
    if (!stripeApiKey) {
      return json(
        {
          success: false,
          error: "Stripe API key not configured"
        },
        { status: 500 }
      );
    }
    if (action === "list-products") {
      const response = await fetch(
        "https://api.stripe.com/v1/products?limit=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stripeApiKey}`
          }
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        return json(
          {
            success: false,
            error: "Failed to list products",
            details: errorText
          },
          { status: 500 }
        );
      }
      const data = await response.json();
      return json({
        success: true,
        productCount: data.data.length,
        products: data.data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          active: p.active,
          created: new Date(p.created * 1e3).toISOString()
        }))
      });
    }
    if (action === "list-prices") {
      const response = await fetch(
        "https://api.stripe.com/v1/prices?limit=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stripeApiKey}`
          }
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        return json(
          {
            success: false,
            error: "Failed to list prices",
            details: errorText
          },
          { status: 500 }
        );
      }
      const data = await response.json();
      return json({
        success: true,
        priceCount: data.data.length,
        prices: data.data.map((p) => ({
          id: p.id,
          productId: p.product,
          unitAmount: p.unit_amount,
          currency: p.currency,
          recurring: p.recurring,
          active: p.active
        }))
      });
    }
    if (action === "list-customers") {
      const response = await fetch(
        "https://api.stripe.com/v1/customers?limit=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stripeApiKey}`
          }
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        return json(
          {
            success: false,
            error: "Failed to list customers",
            details: errorText
          },
          { status: 500 }
        );
      }
      const data = await response.json();
      return json({
        success: true,
        customerCount: data.data.length,
        customers: data.data.map((c) => ({
          id: c.id,
          email: c.email,
          name: c.name,
          created: new Date(c.created * 1e3).toISOString()
        }))
      });
    }
    return json(
      {
        success: false,
        error: "Invalid action"
      },
      { status: 400 }
    );
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: String(error)
      },
      { status: 500 }
    );
  }
};
export {
  GET,
  POST
};
