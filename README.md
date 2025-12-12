# Freshbase SaaS Kit: A SvelteKit Boilerplate

- **Feature Rich**: user auth, user dashboard, marketing site, blog engine, billing/subscriptions, pricing page, search, emails, and more.
- **Lightning Performance**: fast pre-rendered pages which score 100/100 on Google PageSpeed.
- **Delightful Developer Experience**: tools you'll love working with, including SvelteKit, Tailwind, DaisyUI, and Firebase.
- **Extensible**: all the tools you need to make additional marketing pages, UI components, user dashboards, admin portals, database backends, API endpoints, and more.
- **MIT Open Source**: Free to use and modify.

## Features

Everything you need to get started for a SaaS company:

- **User Authentication**: Sign up, sign out, forgot password, email verification, and OAuth. Powered by Firebase Auth.
- **Marketing Page**: SEO optimization and Sitemap.
- **Blog Engine**: Rich formatting, RSS, and SEO optimization.
- **User Dashboard**: User profile, settings, billing management.
- **Subscriptions**: Powered by Stripe Checkout.
- **Pricing Page**: Customizable pricing tiers.
- **Emails**: Send transactional emails to users.
- **Search**: Lightning fast site search.
- **Contact Form**: Integrated contact request handling.
- **Style Toolkit**: Theming and UI components via DaisyUI.
- **Extensible Architecture**: Easy to add new features and endpoints.

## Tech Stack

- **Web Framework**: SvelteKit
- **Styling**: TailwindCSS, DaisyUI
- **Hosting**: Netlify (recommended)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe Checkout & Portal

## Quick Start

### 1. Setup Local Development

```bash
git clone [Your Repo URL]
cd CMSaasStarter
npm install

# Create environment file
cp .env.example .env.local

# Run locally
npm run dev -- --open
```

### 2. Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Enable **Authentication** (Email/Password and Google providers).
3. Create a **Firestore Database** in production mode.
4. Get your credentials:
   - **Client-side**: Project Settings → General → Your apps → Web app.
   - **Server-side**: Project Settings → Service accounts → Generate new private key.
5. Update `.env.local` with these values (see `.env.example` for the required fields).

### 3. Setup Stripe

1. Create a [Stripe account](https://stripe.com).
2. Get your [Secret API key](https://dashboard.stripe.com/test/apikeys) and add it to `PRIVATE_STRIPE_API_KEY` in `.env.local`.
3. Create your products in Stripe Dashboard.
4. Update `src/routes/(marketing)/pricing/pricing_plans.ts` with your Stripe product/price IDs.

### 4. Deploy to Netlify

1. Push your code to a GitHub repository.
2. Log in to [Netlify](https://www.netlify.com).
3. Click "Add new site" → "Import an existing project".
4. Select your GitHub repository.
5. In "Build settings", the defaults (Base directory: `/`, Build command: `npm run build`, Publish directory: `build` or `public`) usually work, but SvelteKit's adapter-auto handles this.
6. **Crucial**: Add your environment variables in Netlify (Site configuration → Environment variables). Add all keys from your `.env.local`.

## Performance

The selected tech stack creates lightning fast websites:
- Pre-rendering for marketing pages.
- Edge-ready deployment.
- Svelte and Tailwind optimization.

## Sponsor: Kiln AI

CMSaasStarter is sponsored by [Kiln AI](https://getkiln.ai): the easiest way to build AI products.
