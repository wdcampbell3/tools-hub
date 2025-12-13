# AI Context & Coding Guidelines

This file provides context for AI coding assistants (Gemini, Claude, Copilot, etc.) to understand the project architecture, tech stack, and coding conventions.


**Start here**: Before writing any code, review the documentation in the **`docs/`** directory. It contains the data schema, function map, roadmap, and style guide. The information in `docs/` is the source of truth for the project's architecture.

## Project Overview

**SaaS Starter** is a SvelteKit boilerplate designed for SaaS applications. It has been migrated from Supabase to **Firebase**.

## Tech Stack

- **Framework**: SvelteKit (TypeScript)
- **Styling**: TailwindCSS + DaisyUI
- **Authentication**: Firebase Auth (Session Cookie based)
- **Database**: Firebase Firestore (NoSQL)
- **Payments**: Stripe (Checkout & Billing Portal)
- **Hosting**: Netlify (Adapter Auto)
- **Email**: Resend (Transactional emails)
- **File Storage (Public)**: Cloudinary (Images/Avatars) - Optimized & transformed
- **File Storage (Private)**: Firebase Storage (Docs/Receipts) - Secure & raw

## Architecture & patterns

### 1. Authentication (Firebase)
- **Mechanism**: We use session cookies (`__session`) for server-side authentication, not client-side tokens.
- **Client-side**: `src/lib/firebase.ts` initializes the app.
- **Server-side**: `src/lib/firebase-admin.server.ts` uses `firebase-admin` to verify cookies and manage users.
- **Flow**:
    1. User logs in via client SDK (`signInWithEmailAndPassword` or `signInWithPopup`).
    2. Client POSTs the ID token to `/auth/session`.
    3. Server creates a session cookie and sets it.
    4. Subequent requests are authenticated via the cookie in `hooks.server.ts`.

### 2. Database (Firestore)
- **Helper Module**: Always use `src/lib/firestore.server.ts` for database interactions. Do not use the raw Firestore SDK in routes if a helper exists.
- **Collections**:
    - `profiles`: `{ id (uid), full_name, company_name, website, unsubscribed, updated_at }`
    - `stripe_customers`: `{ user_id, stripe_customer_id, updated_at }`
    - `contact_requests`: `{ first_name, last_name, email, message_body, ... }`
- **Data Fetching**:
    - Fetch data in `+page.server.ts` or `+layout.server.ts`.
    - Pass data to the client via the `load` function.

### 3. Payments (Stripe)
- **Integration**: We map Firebase `uid` to Stripe Customer IDs in the `stripe_customers` collection.
- **Subscription Helpers**: Use `src/routes/(admin)/account/subscription_helpers.server.ts` for:
    - `getOrCreateCustomerId`: Ensures a stripe customer exists for the user.
    - `fetchSubscription`: Gets current subscription status.

### 4. Storage Strategy (Hybrid)
- **Public Images (Cloudinary)**:
    - **Use for**: User avatars, post images, marketing assets.
    - **Why**: Bandwidth optimization, auto-format (WebP/AVIF), on-the-fly resizing.
    - **Protocol**: Upload via `src/lib/server/cloudinary.ts`. Store `public_id` in Firestore. Generate URLs on client using `src/lib/cloudinary-client.ts`.
- **Private Files (Firebase Storage)**:
    - **Use for**: PDFs, invoices, backup archives, sensitive user docs.
    - **Why**: Strict security rules, cost-effective for raw storage.
    - **Protocol**: Use `storage` from `src/lib/firebase.ts` directly.

### 5. Styling (DaisyUI)
- Use DaisyUI component classes (e.g., `btn`, `card`, `input`, `alert`) instead of raw Tailwind utility piles where possible.
- Theme information is in `app.css` and `tailwind.config.js`.

## Critical Rules for AI

1.  **NO SUPABASE**: This project previously used Supabase. **Do not** introduce Supabase packages, types, or environment variables. If you see old code patterns (e.g. `supabase.auth.getUser()`), refactor them to Firebase.
2.  **Server-Side Logic**: Sensitive operations (database writes, admin auth) MUST happen in `+page.server.ts` actions or `+server.ts` endpoints, never in `+page.svelte`.
3.  **Environment Variables**:
    - Client-side: `PUBLIC_FIREBASE_*` (safe to expose).
    - Server-side: `PRIVATE_FIREBASE_*`, `PRIVATE_STRIPE_KEY` (secrets).
4.  **Types**: Use types from `src/app.d.ts` (App.Locals, App.PageData).
5.  **Documentation Maintenance**:
    - You MUST keep the files in the `docs/` directory up to date as the project evolves.
    - If you change the database schema, update `docs/data_schema.md`.
    - If you add new key features or endpoints, update `docs/function_map.md`.
    - If you complete a major milestone, update `docs/roadmap.md`.
6.  **Git Usage**:
    - **NEVER** automatically push changes to GitHub.
    - You may commit changes locally if needed, but pushing requires explicit user request.
7.  **Consult Documentation**:
    - Always check `docs/data_schema.md` before writing database queries.
    - Always check `docs/style_guide.md` before creating new UI components.

## Project Structure

```
src/
├── lib/
│   ├── firebase.ts          # Client SDK init
│   ├── firebase-admin.server.ts # Admin SDK init (Server-only)
│   ├── firestore.server.ts  # Database helpers (Server-only)
│   ├── mailer.ts            # Email sending logic
├── routes/
│   ├── (marketing)/         # Public landing pages
│   ├── (admin)/account/     # Protected user dashboard
│   ├── api/                 # API endpoints
│   └── +hooks.server.ts     # Auth middleware
```
