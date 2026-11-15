import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import type { BoardState } from '../types/card'
import { getDb } from './firestoreDb'
import {
  SESSION_COLLECTION,
  type GameSession,
  type SessionPlayer,
} from './sessionTypes'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateSessionCode(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join(
    '',
  )
}

export function normalizeSessionCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function requireDb() {
  const db = getDb()
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add VITE_FIREBASE_* to .env.local.',
    )
  }
  return db
}

function sessionRef(code: string) {
  return doc(requireDb(), SESSION_COLLECTION, code)
}

export async function createSession(args: {
  code?: string
  player: SessionPlayer
  zones: BoardState
}): Promise<GameSession> {
  const code = normalizeSessionCode(args.code ?? generateSessionCode())
  if (code.length < 4) throw new Error('Session code too short')

  const now = Date.now()
  const session: GameSession = {
    code,
    players: { [args.player.id]: args.player },
    zones: args.zones,
    createdAt: now,
    lastUpdated: now,
  }

  await setDoc(sessionRef(code), {
    ...session,
    // Helpful for Console inspection; client still uses lastUpdated number.
    updatedAt: serverTimestamp(),
  })

  return session
}

export async function joinSession(args: {
  code: string
  player: SessionPlayer
}): Promise<GameSession> {
  const code = normalizeSessionCode(args.code)
  const ref = sessionRef(code)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    throw new Error(`No session found for code ${code}`)
  }

  const data = snap.data() as GameSession
  const players = {
    ...data.players,
    [args.player.id]: {
      ...args.player,
      joinedAt: args.player.joinedAt || Date.now(),
    },
  }

  const lastUpdated = Date.now()
  await updateDoc(ref, {
    players,
    lastUpdated,
    updatedAt: serverTimestamp(),
  })

  return {
    ...data,
    code,
    players,
    lastUpdated,
  }
}

export async function updateSessionZones(
  code: string,
  zones: BoardState,
): Promise<void> {
  const lastUpdated = Date.now()
  await updateDoc(sessionRef(normalizeSessionCode(code)), {
    zones,
    lastUpdated,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeSession(
  code: string,
  onNext: (session: GameSession) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    sessionRef(normalizeSessionCode(code)),
    (snap) => {
      if (!snap.exists()) {
        onError?.(new Error(`Session ${code} disappeared`))
        return
      }
      const data = snap.data() as GameSession
      onNext({ ...data, code: normalizeSessionCode(code) })
    },
    (err) => onError?.(err),
  )
}
