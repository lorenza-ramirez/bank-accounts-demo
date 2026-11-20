# Bank Accounts prototype

Clickable prototype of Practice Data > Bank Accounts in the Air app shell.
Pages: Plaid, BAI and Anatomy. All data is synthetic. Nothing leaves the browser.

Built with React 18, Vite 8 and lucide-react. Needs Node 20.19 or newer. The Geist font loads from Google Fonts.

## Run it locally

```bash
npm install
npm run dev
```

Open the address that Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Put it on GitHub

```bash
git init
git add .
git commit -m "Bank Accounts prototype"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

## Deploy on Vercel

1. In Vercel choose **Add New > Project** and import the GitHub repo.
2. Vercel detects Vite. Keep the defaults: build command `npm run build`, output directory `dist`.
3. Select **Deploy**.

No environment variables are needed. Every push to `main` redeploys.

## What to click

- Left menu, Admin Panel > Practice Data > Bank Accounts: Plaid, BAI, Anatomy.
- Plaid: click the row to open the account details. Hover the orange refresh icon for the tooltip. Click the blue x for the delete dialog.
- BAI: hover a red tag to see why dates are missing.
- Every table has a filter button, a settings button (show or hide columns) and search.
- Header: the dictation badge toggles a recording state. Scribe and Athelas AI show "Not part of this demo".
- Anything else outside this screen shows "Not part of this demo".

## Notes

- The app is one file: `src/App.jsx`. Design tokens are CSS variables at the top of its style block.
- Icons are from lucide-react. Figma's own icons (Scribe, Assistant Emblem) are approximated.
- The design reference is the Design System 3.0 Figma file.
