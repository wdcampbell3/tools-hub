# Style Guide

This project follows the utility-first philosophy of **Tailwind CSS** combined with the pre-designed components of **DaisyUI**.

## Core Principles
1.  **Don't reinvent the wheel**: Use DaisyUI components (`btn`, `card`, `input`, `modal`) before creating custom styles.
2.  **Utility Classes**: Use Tailwind utilities for layout (`flex`, `grid`), spacing (`p-4`, `m-2`), and sizing.
3.  **Theming**: We use DaisyUI themes. Define global colors in `tailwind.config.js` or `app.css` (e.g., `primary`, `secondary`, `accent`).

## Component Examples

### Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-ghost">Secondary Action</button>
<button class="btn btn-error btn-sm">Delete</button>
```

### Cards
```html
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Content goes here.</p>
  </div>
</div>
```

### Forms
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">What is your name?</span>
  </div>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
</label>
```

## Icons
- We use SVG strings directly in components or Lucide/Heroicons (if added).
- Keep icons consistent in stroke width and size.

## File Structure
- `src/app.css`: Global styles and Tailwind imports.
- `src/routes/+layout.svelte`: Global layout structure.

## Customizing Styles

### Colors
This project uses **Tailwind CSS v4** with **DaisyUI**.

To change the color palette (primary, secondary, accent, etc.):
1.  Open `src/app.css`.
2.  Locate the `@plugin "daisyui/theme"` block.
3.  Modify the CSS variables (e.g., `--color-primary`, `--color-secondary`).

Example `src/app.css`:
```css
@plugin "daisyui/theme" {
  name: "saasstartertheme";
  default: true;
  --color-primary: #180042; /* Change this hex code */
  /* ... */
}
```

### Fonts
To change fonts:
1.  Import your font in `src/app.html` (e.g., from Google Fonts).
2.  Set the font family in `src/app.css` using Tailwind v4 theme variables.

Example:
```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui;
}
```

