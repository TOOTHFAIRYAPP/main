# Toothfairy™ AI — Shopify theme

Online Store 2.0 theme with the Toothfairy™ AI landing, Professionals and FAQ pages.
Every part of the design is its own section, so it can be moved, hidden, duplicated or edited in the theme editor.
All pages match the 1440px design on desktop and reflow for tablet and phone.

## Install via GitHub
1. Shopify admin → Online Store → Themes → **Add theme → Connect from GitHub** → pick this repo and branch.
2. Theme settings → **Toothfairy → App Store link**. The app ID in that link also drives Safari's App Store banner on iPhone (can be switched off there).
3. Create a page **Professionals** (template `page.professionals`) and a page **FAQ** (template `page.faq`).

## Sections
| Section | Used for |
| --- | --- |
| TF Header | Logo, menu links (blocks) and button. One per page, so every page can have its own menu. Turns into a floating capsule on scroll, slides away while scrolling down and returns on scroll up; can be switched off. |
| TF Hero (centred) | Landing hero with three realistic iPhones: optional looping video in the middle one, fan-out on scroll and a mouse tilt (both can be switched off). |
| TF Hero (split) | Professionals hero with two phones. |
| TF Page intro | FAQ heading, intro text and jump links. |
| TF Before / after | Drag slider. |
| TF Numbered columns | "How it works" (with phone screens) and "Why" (text only). |
| TF Steps + phone | "In the chair" and the clinic-network panels: steps, optional intro text and button, phone left or right. |
| TF Video feature | Pink panel: text, short points (blocks), App Store button and a video in a phone rising from the bottom edge. Optional background symbol. |
| TF Cards | Testimonials and fact cards. |
| TF Pricing | Credit packs and practice plans. |
| TF FAQ | One question group; add one section per group. |
| TF Closing call to action | "One selfie away." |
| TF Demo request form | Dark form on the Professionals page. |
| TF Contact form | Light form on the FAQ page. |
| TF Footer | Shared footer (footer group, same on every page). |

Every section has **Space above / Space below**, an optional **line above**, and an **Anchor ID** for menu links such as `#how`.
Phone screens can be swapped by picking an image; otherwise one of the bundled app screens is used.

## Forms
Both forms use Shopify's contact form; submissions go to the store's sender email. Shopify's contact form can't take file attachments.

## Files
- `assets/toothfairy.css` — all styles (shared design tokens, every section, breakpoints at 1280 / 1024 / 860 / 600px).
- `assets/toothfairy.js` — before/after slider and the personalised form confirmation; re-initialises in the theme editor.
- `snippets/tf-screen.liquid` — picked image or bundled screenshot.
