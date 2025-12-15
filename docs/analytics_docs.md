# Adding Google Analytics 📊

This guide will help you set up **Google Analytics 4 (GA4)** for your Freshbase project. It allows you to track visitor numbers and see how people use your app.

## 1. Get Your Tracking Code

1.  Go to [analytics.google.com](https://analytics.google.com/) and sign in.
2.  Click **Admin** (the gear icon) → **Create Property**.
3.  Follow the setup steps (enter your app name, time zone, etc.).
4.  When asked to choose a platform, select **Web**.
5.  Enter your website URL (e.g., `https://myapp.netlify.app` or `http://localhost:5173` for testing).
6.  Once created, you will see a **Measurement ID** (starts with `G-XXXXXXX`).
7.  Click **View Tag Instructions** → **Install manually**.
8.  **Copy** the code block that looks like this:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-YOURID"
></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag("js", new Date())

  gtag("config", "G-YOURID")
</script>
```

## 2. Add Code to Your App

1.  Open your project in your code editor.
2.  Navigate to `src/app.html`.
3.  Paste the code block you copied **inside the `<head>` tag**, just before the closing `</head>`.

## 3. Verify It Works

1.  Run your app: `npm run dev`.
2.  Open your site in a browser.
3.  Go back to Google Analytics → **Reports** → **Realtime**.
4.  You should see "1 user in the last 30 minutes".

That's it! You're now tracking visitors.
