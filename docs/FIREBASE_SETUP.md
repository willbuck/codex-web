# Firebase setup for Codex Web Player

The app runs in **local mock mode** until these Vite env vars are set. No project
is wired yet — create one (or reuse another Firebase web app) and paste values
into `.env.local` and GitHub Actions secrets.

## Exact env var names

Required:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Recommended (used when present):

```bash
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
```

Optional:

```bash
VITE_FIREBASE_MEASUREMENT_ID=
```

## What Will needs to do

1. Open [Firebase Console](https://console.firebase.google.com/) → **Add project**
   (or pick an existing project you want dedicated to Codex).
2. Enable **Firestore** (production or test mode, then deploy rules below).
3. Project settings → **Your apps** → add a **Web** app.
4. Copy the Firebase config object fields into `.env.local` using the names above.
5. Deploy security rules from this repo:

   ```bash
   # from ~/code/codex-web, after `firebase login` + `firebase use <projectId>`
   firebase deploy --only firestore:rules
   ```

   Rules file: `firestore.rules` (session-code-as-capability on `sessions/{code}`).
6. For GitHub Pages, add the same `VITE_FIREBASE_*` names as **repository Actions
   secrets** (not only environment secrets). The Pages workflow already passes them.

## Local file

```bash
cp .env.example .env.local
# paste real values — never commit .env.local
npm run dev
```

## Notes

- Dodgeball-scorekeeper already has a Firebase web app on this machine
  (`~/code/me/projects/dodgeball-score/.env.local`). You *may* copy those values
  into Codex for a quick smoke test, but a dedicated Codex project is cleaner so
  scorekeeper data and game sessions do not share one ruleset forever.
- Auth is not required for v1; players are identified via `localStorage` and
  stored on the session document.
