# The Vibe Coder's Guide to Launching 🚀

This guide is a prequel to the step-by-step setup instructions in [`_START-HERE.md`](../_START-HERE.md) that you can follow when you're ready to officially start your project.

Think of this quick-start guide as your playbook for turning an idea into a launched SaaS product using AI-assisted coding ("vibe coding"). You don't need to be a coding expert—just bring your vision and learn how to guide your AI assistant effectively.

_NOTE: It's not mandatory to follow this guide, but it's recommended if you want to learn the fundamentals of how to launch a robust app. If you just want to jump into experiments that's perfectly fine, you can always create another project later, install the kit again and follow along, step-by-step._

—

## 1. Generating Your Idea

Before writing any code, it's important to get crystal clear on _what_ you're building.

### Define Your "One-Liner"

Summarize your app in a single sentence:

> "I'm building a SaaS that helps **[target audience]** do **[core problem]** by **[your solution]**."

### Validate the Concept

Use your AI assistant to pressure-test your idea:

```
Example Prompt: "I want to build a SaaS app that helps freelance designers manage client feedback.
Critically analyze this idea. What are potential weaknesses? Who are competitors? What should I research What could be the core features?"
```

—

## 2. Creating a PRD (Product Requirements Document)

A PRD is your "blueprint" that keeps you and your AI aligned. While not strictly required to get started, it's highly recommended especially for more complex projects.

### Generate a PRD

```
Example Prompt: "Act as a Senior Product Manager. Write a PRD for my app idea: [your one-liner].
Include:
- Target user persona (ICA)
- 3-5 core features for an MVP
- A proposed data schema, if a database is needed. Otherwise, state "No database needed.""
```

...You can use the AI's output to create a new file called `PRD.md` in the `/docs` folder and paste the PRD text into it. _NOTE: .md files are AI friendly, plain text "markdown" files that can be opened in any text editor._

### Why This Matters

- AI assistants work best with **clear, documented requirements**.
- You can reference this PRD.md file in the future like this:

```
Example Prompt: "Referring to the `docs/PRD.md` file, build the dashboard page."
```

—

## 3. Breaking Down Tasks for AI

In general, AI performs best with small, focused instructions—not giant requests.

❌ Bad Prompt: "Build me a CRM."
✅ Good Prompt: "Create a 'Contacts' page that displays a list fetched from Firebase."

❌ Bad Prompt: "Make the whole dashboard."
✅ Good Prompt: "Build the 'Create Project' form component with title and description fields."

### Refer to your PRD as You Create Tasks (Optional)

If your PRD is long, you can consider using AI to break it down into a list of smaller tasks, then creating a separate file called `TASKS.md` in the /docs folder to keep track of them as you proceed.

```
Prompt: "Break down this PRD into step-by-step implementation tasks.
Group them by: Setup, Core Features, UI Polish, and Advanced Features."
```

...

### Feeding Context to AI

At this point, whether you want to work from your PRD file, have created a tasks file, or just want to copy/paste them from an AI chat, you can start using the AI assistant to build your app. IMPORTANT: Always start new AI sessions by loading project context:

```
Prompt: "Read `_AI-CONTEXT.md` first. Then help me build [specific feature]."
```

_This file helps the AI understand the project context. Subsequent prompts can just include the specific tasks you want to build. However, it's good practice to occasionally remind the AI assistant of the project context by pointing it to the `_AI-CONTEXT.md` file._

—

## 4. Designing the Look of Your App

Make the app _yours_ before diving into features.

### Establish Your Brand Identity

Your kit comes with a powerful **Theme Editor** (see `_START-HERE.md` for usage) that lets you define your visual language instantly.

1. Launch the built-in theme editor.
2. Pick your brand colors, toggle light/dark mode, and choose what you want the default theme to be.
3. Click **"Save"** to save your app's style.

### Update the Landing / Marketing Page

Your landing page is your elevator pitch. You don't need to write code to change it—just ask the AI.

```
Prompt: "Update the landing page headline to: [Your Catchy One-Liner].
Then, rewrite the 3 feature blocks to highlight: [Benefit 1], [Benefit 2], [Benefit 3]."
```

_Tip: Not sure what to write? Use the AI assistant to come up with some ideas or just give it free reign and let it do its thing._
—

# Optional Power-Ups 🚀

## 1. Leveraging the Database (Firebase)

A database is your cloud database for more advanced features like user authentication, blog posts, payments, and more. Think of a database as a collection of spreadsheets.

### Key Concepts for AI Prompts

When asking your AI to build features, use these terms:

- **Collections**: Categories of data (e.g., "Users", "Projects", "Invoices").
- **Documents**: Individual items within a collection.
- **Fields**: The specific data points (e.g., "status", "amount", "date").

_TIP: The project already has a database schema defined in `docs/data_schema.md`. However as you work on your app, you may need to add new collections and documents to the schema. Ideally you ask the AI to refer to it, and keep the document up to date as the project evolves. This helps the AI understand the data structure and how to interact with it._

### Example Prompt

```
Prompt: "I need to save user 'Projects'. Create a database collection for them.
Each project document should have a title, description, and status field."
```

—

## 2. Additional Features (Optional)

These are already built into the kit—you just need to configure them.

### User Authentication (Multiple Methods)

- When you activate your database, user authentication is enabled by default.
- Supports Email/Password and Google Sign-In
- The `_Start-Here.md` file has instructions for setting this up.

### Payments (Stripe)

Once you've added your API keys (see `_START-HERE.md`), enabling payments is as simple as defining your pricing tiers.

```
Prompt: "I've added my Stripe Product IDs to the config.
Now, create a 'Upgrade' button on the dashboard that redirects to the checkout flow."
```

### Blog Engine

Content is the cheapest way to get users. Your kit has a built-in markdown blog.

- Use it to share updates, tutorials, or industry thoughts.
- Ask the AI to "Write a new blog post about [Topic]" and it can generate the markdown file for you!

—

## 3. Review & Polishing

Before launching, do a "vibe check" on your code.

### Mobile Review

1. Open Chrome DevTools (`Cmd+Option+I` or `F12`)
2. Click the device toolbar icon (or `Cmd+Shift+M`)
3. Test every page on iPhone SE and iPad views

```
Fix Prompt: "The navbar is broken on mobile. Collapse it into a hamburger menu for smaller screens."
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

> **Hit a technical snag?** Check the "Common Troubleshooting" section in `_START-HERE.md`.

—

## 4. Launching

When you're ready to go live, follow the deployment steps in `_START-HERE.md` and you'll be online in not time.

**Public Launch Checklist:**

- [ ] Test project locally
- [ ] Push code to GitHub
- [ ] Connect repo to Netlify
- [ ] Add all `.env` variables to Netlify settings
- [ ] Set up a custom domain (optional)
- [ ] Add Privacy Policy and Terms of Service pages
      ...You can expand this list as needed, in fact we created a much more detailed checklist in the `docs/roadmap.md` file.

—

## Cheat Sheet: Vibe Coding Best Practices

| Principle            | Example                                             |
| -------------------- | --------------------------------------------------- |
| **Context is King**  | Always start with: _"Read `_AI-CONTEXT.md` first."_ |
| **Small Batches**    | One feature at a time, not _"build my whole app"_.  |
| **Iterate**          | _"That looks good, but add a loading spinner."_     |
| **Trust but Verify** | Always check `localhost` after AI makes changes     |
| **Save Often**       | Commit to Git frequently so you can roll back       |

—

**You've got this!** Start small, iterate fast, and ship something real. 🎉
