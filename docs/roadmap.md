# The Vibe Coder’s Guide to Launching

This isn't just a roadmap; it's a playbook for building and launching your SaaS using AI (vibe coding) + this starter kit.

## Phase 1: Ideation & Calibration

Before writing code, get your AI assistant (Antigravity/Cursor) aligned with your vision.

- [ ] **The "One-Liner"**: Define your app in one sentence.
  - _Prompt_: "I want to build a SaaS that helps [target audience] do [problem] by [solution]. Critically analyze this idea."
- [ ] **Generate a PRD (Product Requirements Document)**:
  - _Prompt_: "Act as a Senior Product Manager. Write a PRD for [your idea]. Include user personas, core features, and a database schema properly fitting the Firebase/Firestore model."
- [ ] **Break Down Tasks**:
  - _Prompt_: "Break this PRD down into step-by-step implementation tasks. Group them by: Setup, Authentication, Core Feature A, Core Feature B, and Polish."

## Phase 2: Building with the Kit

Leverage the starter kit's existing features to move fast. **Always** reference `_AI-CONTEXT.md`.

- [ ] **Customization**:
  - _Action_: Use the Theme Editor at `/styles` to set your brand colors. Saves to `src/app.css` automatically.
  - _Prompt_: "Update the landing page copy in `src/routes/(marketing)/+page.svelte` to match my PRD's value proposition."
- [ ] **Core Logic**:
  - _Action_: Reference `docs/function_map.md` to find helper functions.
  - _Prompt_: "Create a new route at `/app/projects`. Use the `src/routes/(admin)/account/+layout.server.ts` pattern to ensure it's protected. Connect it to a new `projects` collection in Firestore."
- [ ] **Stripe Integration**:
  - _Action_: Update `src/routes/(marketing)/pricing/pricing_plans.ts` with your Product IDs.
  - _Prompt_: "Review the pricing plans file. I've updated the IDs. Now help me create a webhook handler to listen for 'checkout.session.completed'."

## Phase 3: Polish & "Vibe Check"

Don't ship broken code. Use the AI to audit your work.

- [ ] **The "Audit" Prompt**:
  - _Prompt_: "Run a full audit of `src/routes/app`. Look for: 1. Console logs to remove. 2. Any hardcoded secrets (security risk). 3. Inconsistent Tailwind styling. 4. Accessibility issues."
- [ ] **Mobile Review**:
  - _Action_: Open Chrome DevTools (Device Toolbar) and click through every page.
  - _Prompt_: "The navbar looks weird on mobile. Fix it to be a hamburger menu below 768px."
- [ ] **Content Polish**:
  - _Action_: Update `static/favicon.png` and `src/app.html` metadata.

## Phase 4: Launch

Turning your code into a business.

- [ ] **Deployment**:
  - _Action_: Push to GitHub. Connect to Netlify. Add Environment Variables (don't forget the private keys!).
- [ ] **Domain**:
  - _Action_: Buy a domain (e.g. Namecheap) and add it to Netlify "Domain Management".
- [ ] **Legal**:
  - _Prompt_: "Generate a generic Terms of Service and Privacy Policy for a SaaS app. I will have a lawyer review it later." (Place these in `src/routes/(marketing)/legal/...`)
- [ ] **Marketing Plan**:
  - _Prompt_: "Act as a Growth Marketer. Create a launch plan for this app. Suggest 5 blog post titles I should write using the built-in blog engine to attract [target persona]."

## Best Practices for Vibe Coding

1.  **Context is King**: Always start a chat with: _"Read `_AI-CONTEXT.md` first."_
2.  **Small Batches**: Don't say "Build the whole dashboard." Say "Build the 'Create Project' form component."
3.  **Iterate**: "That looks good, but make the button blue and add a loading state."
4.  **Trust but Verify**: AI makes mistakes. Always check the `localhost` preview after a code change.
