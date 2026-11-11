# Toothfairy™ AI — Shopify theme

A minimal Online Store 2.0 theme containing the three Toothfairy™ AI pages.

## Install via GitHub
1. Push this folder's **contents** (layout/, sections/, templates/, assets/, config/, locales/) to the root of a GitHub repo.
2. Shopify admin → Online Store → Themes → **Add theme → Connect from GitHub** → pick the repo/branch.
3. Theme settings → **Toothfairy → App Store link** (prefilled).

## Pages
- Home (`/`) → landing page.
- Create a page **Professionals** (handle `professionals`) and set its template to `page.professionals`.
- Create a page **FAQ** (handle `faq`) and set its template to `page.faq`.
Nav links already point to `/pages/professionals` and `/pages/faq`.

## Forms
Demo-request and contact forms use Shopify's native contact form — submissions arrive at the store's sender email.

## Videos
The landing section has two MP4 URL settings (theme editor → section settings). Upload videos under Content → Files and paste the URLs.

## Professionals page
`sections/tf-professionals.liquid` + `assets/tf-professionals.css` (+ `snippets/tfp-screen.liquid`).
- Fully responsive: matches the 1440px design at desktop width and reflows for tablet and phone (nav collapses to a menu below 1024px).
- Editable in the theme editor: hero, section headings and texts, contact email, footer lines, and the three phone screenshots (empty = bundled screens).
  The reasons, steps, fact cards and plan rows are blocks; add, remove or reorder them there.
- The demo form posts to Shopify's contact form; the confirmation greets the visitor by first name and email.

## Known limits
- Landing and FAQ are still desktop-first (1440px) and scale down on smaller screens; the Professionals page is responsive.
- Product/collection/cart templates are placeholders — the app is sold through the App Store.