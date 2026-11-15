/** Env-only config reader. Free of Firebase imports so callers can check
 * availability without pulling in the SDK. */

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string | undefined
  messagingSenderId: string | undefined
  appId: string
  measurementId: string | undefined
}

export function readFirebaseConfig(): FirebaseConfig | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  const appId = import.meta.env.VITE_FIREBASE_APP_ID
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: storageBucket || undefined,
    messagingSenderId: messagingSenderId || undefined,
    appId,
    measurementId: measurementId || undefined,
  }
}

export function isFirebaseConfigured(): boolean {
  return readFirebaseConfig() !== null
}
