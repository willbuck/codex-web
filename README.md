# Codex Web Player

Web play surface for **Codex: Card-Time Strategy** — React + TypeScript + Vite, with Firebase planned for shared game state and GitHub Pages for hosting.

## Status

Scaffold + local mock board with drag-and-drop between **Hand**, **In Play**, and **Discard**. Firebase sync and [Codex Card DB](https://www.codexcarddb.com/) wiring are next.

## Stack

- React 19 + TypeScript + Vite
- `@dnd-kit` for card drag-and-drop
- Firebase (dependency present; config stubbed via env)
- GitHub Pages workflow (`.github/workflows/gh-pages.yml`)

Patterns follow [buckwp-auto/dodgeball-scorekeeper](https://github.com/buckwp-auto/dodgeball-scorekeeper) where useful (base path, Pages deploy, Firebase env names).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173/

Optional Firebase: copy `.env.example` → `.env.local` and fill values. Without them the app stays in local mock mode.

```bash
npm run build    # typecheck + production build
npm run preview  # serve dist locally
```

GitHub Pages builds use `GITHUB_PAGES=true` so `base` becomes `/codex-web/`.

## Deploy

Push to `main`. The Pages workflow builds and deploys. Enable **Settings → Pages → Source: GitHub Actions** once if not already set.

Firebase secrets (optional until sync lands):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

## Sources

- Rulebook / resources (Dropbox): see Project goal
- Card database: https://www.codexcarddb.com/
