# Project Roadmap & Checklist 🗺️

> **How to use this ecosystem:**
>
> 1.  🧠 **Strategy**: Read [`docs/launch_guide.md`](launch_guide.md) for high-level advice ("vibe coding"), prompt engineering, and product management tips.
> 2.  🛠 **Setup**: Follow [`_START-HERE.md`](../_START-HERE.md) first to configure your project environment, and database, payment system and any other services you plan to use.
> 3.  ✅ **Execution**: Use **this document** as your master checklist to track concrete progress from idea to launch.
> 4.  🚀 **Using AI**: While this roadmap can look technical, you can use the AI chatbot to help you every step of the way. Remember if you are just building simple app or prototype where everythign doesn't need to work perfectly you can skip a lot of things from Phase 3 onward.

—

## Phase 1: Ideation & Foundation

_Before writing code, define what you are building._

- [ ] **Define the "One-Liner"**: Write a single sentence describing your app (Who + Problem + Solution).
- [ ] **Generate a PRD**: Use your AI to write a Product Requirements Document (see [`docs/launch_guide.md`](launch_guide.md)).

—

## Phase 2: Branding & Design

_Make it look like YOUR product._

- [ ] **Theme Configuration**:
  - [ ] Prompt the AI with `Run npm run dev` and edit your styles by visiting [`/styles`](../styles)`.
  - [ ] Select your colors and styles.
  - [ ] Toggle Dark/Light mode to refine your preferences.
  - [ ] Click **"Save Project-Wide"**.
- [ ] **Landing Page**:
  - [ ] Prompt the AI to edit the homepage with your custom text and design.
  - [ ] Update feature list and benefits.
  - [ ] Replace or update the Hero image.
- [ ] **Metadata**: You can ask the AI to "Edit `src/app.html` title and `src/config.ts` to update it with my website details."

—

_NOTE: The following steps get more advanced. Not all these features or requests will be relevant to your app. If you followed the launch guide [`docs/launch_guide.md`](launch_guide.md) it will help the AI determine what you need to do next. Don't forget you can ask the AI for help along the way!_

—

## Phase 3: Building the MVP (Core Features)

_The meat and potatoes of your application._

- [ ] **Core Feature Routes**: Create the necessary pages (AKA Routes) as outlined in your PRD (e.g., "Projects", "Tools" etc).
- [ ] **Navigation**: Update the homepage or navbar with links to your new pages.
- [ ] **CRUD Operations**: Implement Create, Read, Update, Delete logic for your core data types in Firebase.
- [ ] **User Dashboard**: Customize you user account page to show relevant user data.
- [ ] **Permissions**: Ensure users can only read/write their own data.

_Confused? If you want to learn ask the AI to "Explain what this means" or "What does this do?" ...Or just ask it to do it and don't worry about it!_

—

## Phase 4: Monetization & Growth (Optional)

_Turning users into customers._

- [ ] **Stripe Product Setup**: Create products in Stripe Dashboard.
- [ ] **Link Products**: Update plans in `src/routes/marketing/pricing/pricing_plans.ts` with real Price IDs.
- [ ] **Test Payments**: Verify the checkout flow using Stripe Test Mode.
- [ ] **Blog**: Write 1-3 initial blog posts in `src/routes/marketing/blog/posts/` for SEO.
- [ ] **Email**: Configure transactional emails (Welcome, Reset Password) with Resend.

—

## Phase 5: Pre-Launch Polish

_The "Vibe Check" before going live._

- [ ] **Mobile Review**: Test all pages on mobile view (Chrome DevTools).
- [ ] **Security Sweep**:
  - [ ] Search code for hardcoded API keys.
  - [ ] Remove `console.log` debugging statements.
- [ ] **Legal Pages**: Generate and add Privacy Policy & Terms of Service.
- [ ] **Accessibility Audit**: BONUS POINTS! Check for missing alt tags or poor contrast in the Theme Editor.

—

## Phase 6: Launch 🚀

_It's GO TIME!_

- [ ] **Git Push**: Ensure all changes are committed and pushed to GitHub.
- [ ] **Netlify Setup**: Connect the GitHub repository and **add all Environment Variables** to Netlify.
- [ ] **Domain**: Connect a new or existing domain to Netlify.
- [ ] **Live Test**: Click like a wild person and test the live site. Make users, add things, delete stuff, test payments, etc. Now do it again on your phone!
- [ ] **Promote**: Share your new SaaS with the world!
