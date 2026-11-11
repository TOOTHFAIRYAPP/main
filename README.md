# Toothfairy™ AI — website

Three self-contained pages (all fonts, images and videos are embedded):

- `index.html` — landing page
- `professionals.html` — for dentists, with demo-request form
- `faq.html` — FAQ + contact form

## GitHub
Create a repo, drop these files in the root, commit. Enable **Settings → Pages → Deploy from branch** for a free preview URL.

## Shopify
Shopify doesn't import static HTML sites directly. Options, simplest first:

1. **Custom page (recommended for 1–3 pages)** — Online Store → Pages → Add page → open the `<>` code view and paste the full `<body>` content of a file. The `<style>` block in `<head>` goes in too (Shopify allows inline `<style>`). Repeat per page.
2. **Theme section** — Online Store → Themes → Edit code → Sections → Add new section → paste the page HTML into a `.liquid` file, then add the section to a page template. This keeps your theme header/footer.
3. **Subdomain** — host these files on GitHub Pages or Netlify as-is and link `ai.ortho-clear.com` to it from the Shopify navigation. Zero conversion work; the forms will need a form endpoint (e.g. Formspree) either way.

## Videos
The two video spots on `index.html` are placeholders (the real screen recordings were ~30 MB embedded). Upload your MP4s to Shopify Files (or the GitHub repo) and replace the placeholder `<div>` with
`<video src="URL" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>`.

Note: the demo and contact forms are front-end only — connect them to a form service or Shopify Forms before going live.
