# The Vibe Coder’s Guide to Launching 🚀

Welcome! This guide is your playbook for building a real, profitable SaaS product using this starter kit and your AI assistant (like Antigravity or Cursor).

**Don't panic.** You don't need to be a coding wizard. You just need to have a vision ("the vibe") and know how to ask the AI for what you want.

---

## Phase 1: The Setup (Don't Skip!)

Before you build features, you need to sync your AI with the project.

**Step 1.1: Load the Context**
The most common mistake is the AI forgetting how the project works.
*   **Action**: In your AI chat window, always start a new session by attaching or referencing `_AI-CONTEXT.md`.
*   **Prompt**: *"Read `_AI-CONTEXT.md` to understand the project architecture. I want to start building."*

**Step 1.2: Define Your App**
Tell the AI what you are actually building so it can suggest relevant code.
*   **Prompt**: *"I want to build a SaaS called [Name] that helps [Target Audience] do [Main Problem] by [Your Solution]. Keep this in mind for all future code."*

---

## Phase 2: Make It Yours (Visuals)

Let's get the "vibe" right before we touch complex logic.

**Step 2.1: The Theme Editor**
You have a built-in design tool!
*   **Action**: Run your app (`npm run dev`) and go to `http://localhost:5173/styles` in your browser.
*   **Do**: Pick your Primary (Brand) color and a Font. Toggle Light/Dark mode to see what looks best.
*   **Tip**: Click **"Save Project-Wide"** to instantly write these changes to your code.

**Step 2.2: The Landing Page**
*   **Action**: The file is at `src/routes/(marketing)/+page.svelte`.
*   **Prompt**: *"Update the landing page copy effectively. My product is [Description]. Change the Hero headline to be catchy, and update the 'Features' section to list these 3 benefits: [Benefit 1, Benefit 2, Benefit 3]."*

---

## Phase 3: Building The "MVP" (Minimum Viable Product)

This is where you build the features people pay for.

**Step 3.1: Create a Navigation Link**
You probably need a new page for your tool.
*   **Prompt**: *"I need a new page for [Feature Name, e.g., 'Dashboard']. Create a new route at `/app/dashboard`. Make sure it is protected (users must be logged in). Add a link to it in the main Navbar."*

**Step 3.2: User Data (The Database)**
Your app needs to remember things. We use **Firebase** for this. It's like a giant spreadsheet in the cloud.
*   **Prompt**: *"I need to save [Item Name, e.g., 'Projects'] for each user. Create a Firebase function to 'create' a new project with a 'title' and 'description'. Then, create a UI form on the Dashboard to let users submit this."*

**Step 3.3: User Login**
*   **Good News**: This is already built! Go to `/login` to see it. It works out of the box if you followed the Firebase Setup in `_START-HERE.md`.

---

## Phase 4: Making Money (Optional) 💸

If you want to charge users, you need **Stripe**.

**Step 4.1: Setup Plans**
*   **Action**: Go to Stripe.com, create a Product (e.g., "Pro Plan", $10/mo). Copy the "Price ID" (starts with `price_...`).
*   **Action**: Open `src/routes/(marketing)/pricing/pricing_plans.ts` and paste that ID.

**Step 4.2: The Customer Portal**
*   **Note**: The kit already handles the "Subscribe" button logic found on the `/pricing` page.
*   **Prompt**: *"I've updated my pricing IDs. Verify that the checkout flow works for the 'Pro Plan'."*

---

## Phase 5: The "Vibe Check" (Polish)

Before you launch, you need to verify everything looks good on all devices.

**Step 5.1: The Mobile Review**
Don't just look at your big monitor!
*   **Action**: In Chrome, right-click anywhere and select **Inspect**.
*   **Action**: Click the tiny phone/tablet icon (top-left of the inspector panel) or press `Cmd+Shift+M`.
*   **Task**: Click through every page. Does the menu look broken? Are buttons too small?
*   **Fix It Prompt**: *"The navigation bar looks messy on mobile (iPhone SE view). Please collapse the links into a hamburger menu for screens smaller than 768px."*

**Step 5.2: The "Audit"**
Ask the AI to critique its own work.
*   **Prompt**: *"Review `src/routes/app`. Are there any hardcoded API keys? Are there `console.log` statements I left in? Please clean them up."*

---

## Phase 6: Launching 🚀

**Step 6.1: Deployment**
*   **Action**: Read the **"Deploy to Netlify"** section in `_START-HERE.md`. It walks you through connecting your GitHub repo to the web.
*   **Key**: You must add your Environment Variables (the keys in `.env`) to Netlify's settings page.

**Step 6.2: Legal Stuff**
*   **Prompt**: *"Generate a standard placeholder Privacy Policy for a SaaS app. Save it to `src/routes/legal/privacy/+page.svelte`."* (Consult a lawyer later!)

---

## Cheat Sheet: "Vibe Coding" Best Practices

1.  **Small Batches**: Don't say "Build my entire specific Startup."
    *   *Bad*: "Build a CRM."
    *   *Good*: "Create a 'Contacts' list page that fetches data from Firebase."
2.  **Iterate**: It's okay to say "That looks ugly, make it pop more" or "Make the button bigger."
3.  **Trust but Verify**: AI writes code fast, but sometimes breaks things. **Always** look at your localhost preview after the AI makes a change.
