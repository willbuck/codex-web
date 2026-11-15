import { initializeApp, type FirebaseApp } from 'firebase/app'
import { readFirebaseConfig } from './firebaseConfig'

/**
 * Pulls in the Firebase SDK — reach this module only through a dynamic import.
 * Use `isFirebaseConfigured` from ./firebaseConfig for cheap checks.
 */

let app: FirebaseApp | null | undefined

/** Returns null when Firebase env is not configured (local-only mode). */
export function getFirebaseApp(): FirebaseApp | null {
  if (app !== undefined) return app

  const config = readFirebaseConfig()
  if (!config) {
    app = null
    return app
  }

  app = initializeApp(config)
  return app
}
