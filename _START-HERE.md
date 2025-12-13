# Welcome to the Freshbase SaaS Kit!

This kit is designed to give you a massive head start on your next SaaS project. We’ve handled the boring stuff—auth, billing, SEO, emails—so you can focus on building what makes your app unique.

**Why you'll love it:**

- **Feature Rich**: Comes with marketing splash page, user auth, dashboard, blog, billing/subscriptions, pricing pages, and more.
- **Lightning Fast**: Pre-rendered pages that hit 100/100 on Google PageSpeed.
- **Developer Friendly**: Built with industry-standard secure tools: SvelteKit, Tailwind, DaisyUI, Firebase, Stripe, and Netlify.
- **Extensible**: A solid foundation that grows with you. Add new pages, components, and endpoints easily.
- **MIT Open Source**: 100% free to use and modify. It's yours.

---

## What's Included?

Everything you need to launch:

- **User Authentication**: Secure sign up, login, password reset.
- **User Dashboard**: A complete portal for users to manage their profiles and settings.
- **Subscriptions & Billing**: Regular and recurring encrypted payments and customer portal.
- **Marketing Site**: SEO-optimized landing pages to convert visitors.
- **Blog Engine**: A built-in blog to share updates and improve your search ranking.
- **Theme Editor**: A visual tool to customize your look for both Light and Dark modes.
- **Email System**: Transactional emails to welcome users and keep them in the loop.
- **Site Search**: Instant, zero-latency search for your content.
- **Contact Form**: Integrated request handling to capture leads.

---

## Tech Stack

We picked a modern, robust stack that scales from day one:

- **Framework**: SvelteKit (Fast, easy, powerful)
- **Styling**: TailwindCSS + DaisyUI (Beautiful UI, fast)
- **Auth & DB**: Firebase (Reliable, serverless, scales infinitely)
- **Payments**: Stripe (The gold standard for SaaS billing)
- **Hosting**: Netlify (Recommended for easiest deployment)

---

## Quick Start Guide

### 0. Reference for AI Models (Important!)

**Using an AI assistant like Antigravity or Cursor?**
For anything beyond basic tweaks it's good practice to reference the `_AI-CONTEXT.md` file to your AI at the start of a chat.

- It contains the "brain" of the project: architecture rules, tech stack details, and coding conventions.
- Giving this context helps the AI write perfect code for _this_ specific project and avoids outdated patterns.

### 1. Prerequisites

You'll need a code editor. We highly recommend **[Antigravity](https://antigravity.google/)** or **[Cursor](https://cursor.com)** for the best AI-assisted experience, but **[VS Code](https://code.visualstudio.com)** works great too if you're more technical!

### 2. Understand the Documentation

Before jumping in, check out the `docs/` folder. It's your roadmap to the codebase:

- **`docs/roadmap.md`**: **(MUST READ)** The "Vibe Coder's Guide". A complete playbook for building and launching your app from scratch using AI.
- **`docs/data_schema.md`**: Understand your database structure - very important for AI models as they need to know how to interact with your data without creating unnecessary or duplicate fields.
- **`docs/function_map.md`**: Find key functions and API endpoints quickly. (Advanced)

### 3. Clone & Run

1. Create a new folder for your project.
2. Open it in your editor.
3. Ask your AI to "Clone the repo from https://github.com/wdcampbell3/Freshbase-SAAS-Kit".
4. Let it install dependencies.
5. Ask it to "Run the dev server" (`npm run dev`).
6. Open `localhost:5173` to see your new app preview!

### 4. Set up Firebase (Your Backend)

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. **Enable Auth**: Go to Build → Authentication. Enable "Email/Password" and "Google".
3. **Enable Database**: Go to Build → Firestore Database. Create one in **Production mode**.
4. **Get Credentials**:
   - **Client**: Project Settings → General → "Add App" (Web). Copy the config keys.
   - **Server**: Project Settings → Service Accounts → "Generate new private key".
5. Update your `.env.local` file with these values (check `.env.example` as a guide).

### 5. Set up Cloudinary (Optional)

_Great for optimizing user uploads and marketing images._

1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Go to API Keys and click "Generate new API Key".
3. Get your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
4. Update `.env.local` with the provided environment variables (see `.env.example` for the required fields).

### 6. Set up Stripe (Optional)

_Ready to make money?_

1. Create a free account at [Stripe](https://stripe.com).
2. Get your **Secret API Key** (Test mode) and add it to `.env.local`.
3. Create your subscription products in the Stripe Dashboard.
4. Update `src/routes/(marketing)/pricing/pricing_plans.ts` with your new Product IDs.

### 7. Deploy to Netlify (Optional)

_Time to go live!_

1. Push your code to a GitHub repository. (Create the repo on GitHub first, then just ask the AI to push the code to the repo by providing the repo URL)
2. Log in to [Netlify](https://www.netlify.com) with your GitHub login for easiest set up.
   3 Click "Add new project" → "Import an existing project" → "GitHub"
3. Select your repo. NOTE: In "Build settings", the defaults (Base directory: `/`, Build command: `npm run build`, Publish directory: `build` or `public`) usually work, but SvelteKit's adapter-auto handles this.
4. **Crucial**: Add your final environment variables in Netlify (Site configuration → Environment variables). NOTE: you can copy the values from your `.env.local` file and paste them into Netlify. Just remove any comments, just keep the key-value pairs. ALSO, after importing make sure to that the "Secret values" box is checked for all PRIVATE variables.

### 8. Make it Yours

1. This kit includes a powerful **Theme Editor** to customize your app's look.
2. Navigate to `http://localhost:5173/styles` in your browser.
3. You can edit the color palette for both **Light** and **Dark** modes to ensure both look great, with changes previewed in real-time.
4. Click **Save** to instantly update your app's global styles.
5. Use **Restore Defaults** if you ever need to reset to the original look.

Happy building! 🚀
