# Codex Web Player

Web play surface for **Codex: Card-Time Strategy** — React + TypeScript + Vite, Firebase for shared sessions, GitHub Pages for hosting.

**Live:** https://willbuck.github.io/codex-web/

## Features

- Drag-and-drop between **Hand**, **In Play**, and **Discard**
- Create / join a shared session by code (Firebase Firestore realtime sync)
- Card catalog seeded from [willbuck/codex-cards-js](https://github.com/willbuck/codex-cards-js) (same data as [codexcarddb.com](https://www.codexcarddb.com/)), with art from `codexcards-assets.surge.sh`
- Graceful **local mock mode** when Firebase env vars are missing

## Stack

- React 19 + TypeScript + Vite
- `@dnd-kit` for drag-and-drop
- Firebase / Firestore (optional at runtime)
- GitHub Pages workflow (`.github/workflows/gh-pages.yml`)

Patterns follow [buckwp-auto/dodgeball-scorekeeper](https://github.com/buckwp-auto/dodgeball-scorekeeper) (`src/cloud/*`, Pages base path, env names).

## Local development

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/

```bash
npm run build
npm run preview
```

## Firebase

Copy `.env.example` → `.env.local` and fill:

| Variable | Required |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes |
| `VITE_FIREBASE_PROJECT_ID` | yes |
| `VITE_FIREBASE_APP_ID` | yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | recommended |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | recommended |
| `VITE_FIREBASE_MEASUREMENT_ID` | optional |

Then deploy `firestore.rules`. Full checklist: [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

Without these vars the board still works offline; Create/Join stay disabled.

## Card data

`codexcarddb.com` is a Gatsby SPA with **no public JSON API**. This app ships a curated subset in:

- `src/data/catalog.seed.json` (bundled)
- `public/data/cards-subset.json` (optional runtime merge)

Images: `https://codexcards-assets.surge.sh/images/{sirlins_filename}` (same asset host the card DB uses via Cloudinary).

## Deploy

Push to `main`. Pages builds with `GITHUB_PAGES=true` so `base` is `/codex-web/`.
