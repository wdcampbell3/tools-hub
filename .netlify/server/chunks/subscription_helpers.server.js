import { d as private_env } from "./shared-server.js";
import { b as building } from "./environment.js";
import Stripe from "stripe";
import { p as pricingPlans } from "./pricing_plans.js";
import { a as getStripeCustomer, g as getProfile, c as createStripeCustomer } from "./firestore.server.js";
const stripe = building ? {} : new Stripe(private_env.PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });
const getOrCreateCustomerId = async ({ user }) => {
  const existingCustomer = await getStripeCustomer(user.id);
  if (existingCustomer?.stripe_customer_id) {
    return { customerId: existingCustomer.stripe_customer_id };
  }
  const profile = await getProfile(user.id);
  let customer;
  try {
    customer = await stripe.customers.create({
      email: user.email ?? void 0,
      name: profile?.full_name ?? "",
      metadata: {
        user_id: user.id,
        company_name: profile?.company_name ?? "",
        website: profile?.website ?? ""
      }
    });
  } catch (e) {
    return { error: e };
  }
  if (!customer.id) {
    return { error: "Unknown stripe user creation error" };
  }
  try {
    await createStripeCustomer(user.id, customer.id);
  } catch (e) {
    return { error: e };
  }
  return { customerId: customer.id };
};
const fetchSubscription = async ({
  customerId
}) => {
  let stripeSubscriptions;
  try {
    stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: "all"
    });
  } catch (e) {
    return { error: e };
  }
  const primaryStripeSubscription = stripeSubscriptions.data.find((x) => {
    return x.status === "active" || x.status === "trialing" || x.status === "past_due";
  });
  let appSubscription = null;
  if (primaryStripeSubscription) {
    const productId = primaryStripeSubscription?.items?.data?.[0]?.price.product ?? "";
    appSubscription = pricingPlans.find((x) => {
      return x.stripe_product_id === productId;
    });
    if (!appSubscription) {
      return {
        error: "Stripe subscription does not have matching app subscription in pricing_plans.ts (via product id match)"
      };
    }
  }
  let primarySubscription = null;
  if (primaryStripeSubscription && appSubscription) {
    primarySubscription = {
      stripeSubscription: primaryStripeSubscription,
      appSubscription
    };
  }
  const hasEverHadSubscription = stripeSubscriptions.data.length > 0;
  return {
    primarySubscription,
    hasEverHadSubscription
  };
};
export {
  fetchSubscription as f,
  getOrCreateCustomerId as g
};
