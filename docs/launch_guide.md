# The Vibe Coder's Guide to Launching 🚀

> **Prerequisites**: Complete the setup steps in [`_START-HERE.md`](../_START-HERE.md) before using this guide.

This is your playbook for turning an idea into a launched SaaS product using AI-assisted coding ("vibe coding"). You don't need to be a coding expert—just bring your vision and learn how to guide your AI assistant effectively.

---

## 1. Generating Your Idea

Before writing any code, get crystal clear on _what_ you're building.

### Define Your "One-Liner"

Summarize your app in a single sentence:

> "I'm building a SaaS that helps **[target audience]** do **[core problem]** by **[your solution]**."

### Validate the Concept

Use your AI assistant to pressure-test your idea:

```
Prompt: "I want to build a SaaS that helps freelance designers manage client feedback.
Critically analyze this idea. What are potential weaknesses? Who are competitors?"
```

---

## 2. Creating a PRD (Product Requirements Document)

A PRD is your "blueprint" that keeps you and your AI aligned.

### Generate a PRD

```
Prompt: "Act as a Senior Product Manager. Write a PRD for my app idea: [your one-liner].
Include:
- Target user persona
- 3-5 core features for an MVP
- A proposed Firestore data schema"
```

### Why This Matters

- AI assistants work best with **clear, documented requirements**.
- You can reference this PRD in future prompts: _"Referring to the PRD, build the dashboard page."_

---

## 3. Breaking Down Tasks for AI

AI performs best with small, focused instructions—not giant requests.

| ❌ Bad Prompt               | ✅ Good Prompt                                                                 |
| --------------------------- | ------------------------------------------------------------------------------ |
| "Build me a CRM."           | "Create a 'Contacts' page that displays a list fetched from Firebase."         |
| "Make the whole dashboard." | "Build the 'Create Project' form component with title and description fields." |

### Generate a Task List

```
Prompt: "Break down this PRD into step-by-step implementation tasks.
Group them by: Setup, Core Features, UI Polish, and Advanced Features."
```

### Feeding Context to AI

Always start new AI sessions by loading project context:

```
Prompt: "Read `_AI-CONTEXT.md` first. Then help me build [specific feature]."
```

---

## 4. Working with the Database (Firebase)

Firebase/Firestore is your cloud database. Think of it as a collection of spreadsheets.

### Key Concepts

- **Collections**: Like folders (e.g., `users`, `projects`, `posts`)
- **Documents**: Individual records with unique IDs
- **Fields**: Data points within a document (e.g., `title`, `createdAt`)

### Example Prompt

```
Prompt: "I need users to save 'Projects'. Each project has a title, description, and status.
Create a Firestore helper function to add a new project, and build a simple form to submit it."
```

### Best Practice

- Always tie user-created data to their `userId` for security
- Reference `docs/data_schema.md` for the existing schema

---

## 5. Branding Your App

Make the app _yours_ before diving into features.

### Use the Theme Editor

1. Run `npm run dev`
2. Visit `http://localhost:5173/styles`
3. Pick your brand colors, toggle light/dark mode
4. Click **"Save"** to write changes to `app.css`

### Update the Landing Page

The homepage is at `src/routes/(marketing)/+page.svelte`.

```
Prompt: "Update the landing page for my app. The headline should be [catchy headline].
List these 3 benefits in the Features section: [Benefit 1], [Benefit 2], [Benefit 3]."
```

---

## 6. Adding Advanced Features (Optional)

These are already built into the kit—you just need to configure them.

### User Authentication

- **Already working** at `/login` if you completed Firebase setup
- Supports Email/Password and Google Sign-In

### Payments (Stripe)

1. Create a Product in your [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy the `Price ID` (starts with `price_...`)
3. Paste it into `src/routes/(marketing)/pricing/pricing_plans.ts`
4. The `/pricing` page handles checkout automatically

### Blog Engine

- Blog posts live in `src/routes/(marketing)/blog/posts/`
- Add new `.md` files to create posts
- Great for SEO and content marketing

---

## 7. Troubleshooting & Auditing

Before launching, do a "vibe check" on your code.

### Mobile Review

1. Open Chrome DevTools (`Cmd+Option+I` or `F12`)
2. Click the device toolbar icon (or `Cmd+Shift+M`)
3. Test every page on iPhone SE and iPad views

```
Fix Prompt: "The navbar is broken on mobile. Collapse it into a hamburger menu below 768px."
```

### Code Audit

Ask the AI to review its own work:

```
Prompt: "Audit `src/routes/app/` for:
1. Hardcoded secrets or API keys
2. Leftover console.log statements
3. Accessibility issues (missing alt text, labels)
Please fix any issues found."
```

### Common Issues

| Problem                               | Solution                                       |
| ------------------------------------- | ---------------------------------------------- |
| "Page not found" after adding a route | Check file is named `+page.svelte` (not `.ts`) |
| Firebase permission denied            | Verify Firestore rules in Firebase Console     |
| Styles not updating                   | Clear browser cache or restart dev server      |

---

## 8. Launching

When you're ready to go live, follow the deployment steps in [`_START-HERE.md`](../_START-HERE.md#deploy-to-netlify).

**Quick Checklist:**

- [ ] Push code to GitHub
- [ ] Connect repo to Netlify
- [ ] Add all `.env` variables to Netlify settings
- [ ] Set up a custom domain (optional)
- [ ] Add Privacy Policy and Terms of Service pages

---

## Cheat Sheet: Vibe Coding Best Practices

| Principle            | Example                                             |
| -------------------- | --------------------------------------------------- |
| **Context is King**  | Always start with: _"Read `_AI-CONTEXT.md` first."_ |
| **Small Batches**    | One feature at a time, not "build my whole app"     |
| **Iterate**          | _"That looks good, but add a loading spinner."_     |
| **Trust but Verify** | Always check `localhost` after AI makes changes     |
| **Save Often**       | Commit to Git frequently so you can roll back       |

---

**You've got this!** Start small, iterate fast, and ship something real. 🎉
