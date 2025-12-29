# Verisure Lead Test Landing Page (Vite + React)

Google Ads test landing page to validate lead generation for home security interest (Verisure-oriented). No affiliate links; the page positions an independent security consultant and sends leads to Make.com for automation and Salesforce intake tests.

## Structure
- `index.html` — Vite entry that mounts the React app.
- `src/main.jsx` — React entry point, mounts `<App />` and imports global styles.
- `src/App.jsx` — landing layout (hero, pourquoi, étapes, rôle, formulaire, RGPD, disclaimer) plus client-side validation and submit handler.
- `src/styles/main.css` — minimalist, trust-oriented styling (blue/white/grey palette, responsive).
- `public/` — static assets (if any) for hosting.

## Local develop
```bash
npm install
npm run dev
```
Open the printed local URL to view the page. Edit React components in `src/App.jsx` and styles in `src/styles/main.css`.

## Build & deploy
```bash
npm run build
```
Deploy the generated `dist/` folder on any static host (Netlify, Vercel, S3+CloudFront, etc.).

## Make.com webhook
In `src/App.jsx`, replace the placeholder `webhookUrl` (marked with a TODO) with your Make.com webhook URL before deployment. Ensure HTTPS and that Make.com forwards to Salesforce as needed.
