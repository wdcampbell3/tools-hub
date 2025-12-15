# Email Setup 📧

Freshbase comes with a built-in email system to send:

1.  **Welcome Emails** (when a user signs up).
2.  **Admin Alerts** (when you get a new "Contact Us" message).

We use a service called **Resend** because it's free to start and very easy to use.

---

## 1. Get a Resend API Key

1.  Go to [Resend.com](https://resend.com) and sign up.
2.  Click **API Keys** → **Create API Key**.
3.  Give it a name (e.g., "Freshbase App") and copy the key (starts with `re_...`).
4.  **Important**: You must verify your sending domain (like `myapp.com`) in Resend to send emails to real people. Until then, you can only send to your own email address.

## 2. Connect It to Your App

1.  Open your `.env.local` file (or `.env` in production).
2.  Add your key:
    PRIVATE_RESEND_API_KEY='re_123456...'
3.  Set your Notification email (where you want to receive admin alerts):
    PRIVATE_ADMIN_EMAIL='your@email.com'

## 3. Customizing Emails (AI can help you with this!)

### The Welcome Email

When a user creates a profile, they get a welcome email.

- **Edit the Text**: Open `src/lib/emails/welcome_email_text.hbs`.
- **Edit the Design**: Open `src/lib/emails/welcome_email_html.hbs`.

### Sending Admin Emails )

If you want to receive an alert when something happens (like a user deleting their account):

```typescript
import { sendAdminEmail } from "$lib/email"

await sendAdminEmail(
  "Account Deleted", // Subject
  "User 123 just deleted their account.", // Body
)
```

### Sending User Emails

To send an email to a user:

```typescript
import { sendUserEmail } from "$lib/email"

await sendUserEmail({
  to: "user@example.com",
  subject: "Hello!",
  html: "<p>Welcome to Freshbase!</p>",
  text: "Welcome to Freshbase!",
})
```
