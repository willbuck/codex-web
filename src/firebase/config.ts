/**
 * Firebase config stub. Populated from Vite env when a project is wired.
 * Until then, `isFirebaseConfigured` is false and the UI uses local mock state.
 */

export type FirebaseWebConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

function readEnv(name: string): string {
  return (import.meta.env[name] as string | undefined)?.trim() ?? ''
}

export const firebaseConfig: FirebaseWebConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
  measurementId: readEnv('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
}

const requiredKeys: (keyof FirebaseWebConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
]

export const isFirebaseConfigured = requiredKeys.every(
  (key) => Boolean(firebaseConfig[key]),
)
