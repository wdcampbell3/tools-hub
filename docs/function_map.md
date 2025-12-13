# Function Map

This document maps key functions and modules in the codebase to help navigation.

## Core Services (`src/lib/`)

| Module                     | Function                     | Purpose                                                                                 |
| -------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `firebase.ts`              | `default`                    | Initializes Firebase Client SDK. Exports `auth`, `db`.                                  |
| `firebase-admin.server.ts` | `adminAuth`                  | **Server-only**. Firebase Admin Auth instance for verifying cookies and managing users. |
| `firestore.server.ts`      | `getProfile(uid)`            | Fetches user profile from Firestore `profiles`.                                         |
|                            | `updateProfile(uid, data)`   | Updates user profile.                                                                   |
|                            | `createContactRequest(data)` | Saves contact form submission.                                                          |
|                            | `getStripeCustomer(uid)`     | Gets Stripe ID for a user.                                                              |
| `mailer.ts`                | `sendAdminEmail`             | Sends notification to site admin (via Resend).                                          |
|                            | `sendUserEmail`              | Sends transactional email to user (checks unsubscribed status first).                   |
| `build_index.ts`           | `buildSearchIndex`           | Scrapes prerendered HTML to build a Fuse.js search index (JSON).                        |
| `server/cloudinary.ts`     | `uploadToCloudinary`         | Uploads a buffer to Cloudinary. Returns result with `public_id`.                        |
| `theme-defaults.ts`        | `default`                    | Constants for default Light/Dark theme colors. Used by Theme Editor.                    |

## Authentication (`src/routes/`)

| File                                   | Type | Purpose                                                                          |
| -------------------------------------- | ---- | -------------------------------------------------------------------------------- |
| `hooks.server.ts`                      | Hook | Middleware. intercept requests, verifies `__session` cookie, sets `locals.user`. |
| `(marketing)/auth/session/+server.ts`  | API  | POST: Login (creates cookie). DELETE: Logout (clears cookie).                    |
| `(marketing)/auth/callback/+server.ts` | API  | Handles OAuth redirects (less used now as Popup flow is preferred).              |

## Account Management (`src/routes/(admin)/account/`)

| File/Module                      | Function                | Purpose                                                                                      |
| -------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `subscription_helpers.server.ts` | `getOrCreateCustomerId` | Ensures user has Stripe ID.                                                                  |
|                                  | `fetchSubscription`     | Gets active Stripe subscription details.                                                     |
| `api/+page.server.ts`            | Actions                 | Handles form actions for: `updateProfile`, `updateEmail`, `updatePassword`, `deleteAccount`. |

## Key Layouts

- `src/routes/+layout.svelte`: Global layout (navbar, footer).
- `src/routes/(admin)/account/+layout.server.ts`: Protected layout. Checks for `locals.user`, fetches `profile`, forces login if missing.
