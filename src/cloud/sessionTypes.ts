import type { BoardState } from '../types/card'

export type SessionPlayer = {
  id: string
  name: string
  joinedAt: number
}

export type GameSession = {
  code: string
  players: Record<string, SessionPlayer>
  zones: BoardState
  lastUpdated: number
  createdAt: number
}

export const SESSION_COLLECTION = 'sessions'
