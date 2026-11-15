import { useCallback, useEffect, useRef, useState } from 'react'
import { boardsEqual } from '../board/boardLogic'
import { isFirebaseConfigured } from '../cloud/firebaseConfig'
import {
  getOrCreateLocalPlayer,
  setLocalPlayerName,
} from '../cloud/localPlayer'
import type { GameSession } from '../cloud/sessionTypes'
import type { BoardState } from '../types/card'

type SessionApi = typeof import('../cloud/sessionApi')

export function useGameSession(localBoard: BoardState) {
  const firebaseReady = isFirebaseConfigured()
  const [player, setPlayer] = useState(() => getOrCreateLocalPlayer())
  const [session, setSession] = useState<GameSession | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const applyingRemote = useRef(false)
  const unsubRef = useRef<(() => void) | null>(null)

  const loadApi = useCallback(async (): Promise<SessionApi> => {
    return import('../cloud/sessionApi')
  }, [])

  const clearSubscription = useCallback(() => {
    unsubRef.current?.()
    unsubRef.current = null
  }, [])

  useEffect(() => () => clearSubscription(), [clearSubscription])

  const attachSubscription = useCallback(
    async (code: string, onZones: (zones: BoardState) => void) => {
      clearSubscription()
      const api = await loadApi()
      unsubRef.current = api.subscribeSession(
        code,
        (next) => {
          setSession(next)
          applyingRemote.current = true
          onZones(next.zones)
          queueMicrotask(() => {
            applyingRemote.current = false
          })
        },
        (err) => setError(err.message),
      )
    },
    [clearSubscription, loadApi],
  )

  const create = useCallback(
    async (onZones: (zones: BoardState) => void) => {
      if (!firebaseReady) return
      setBusy(true)
      setError(null)
      try {
        const api = await loadApi()
        const created = await api.createSession({
          player: {
            id: player.id,
            name: player.name,
            joinedAt: Date.now(),
          },
          zones: localBoard,
        })
        setSession(created)
        await attachSubscription(created.code, onZones)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setBusy(false)
      }
    },
    [attachSubscription, firebaseReady, loadApi, localBoard, player],
  )

  const join = useCallback(
    async (code: string, onZones: (zones: BoardState) => void) => {
      if (!firebaseReady) return
      setBusy(true)
      setError(null)
      try {
        const api = await loadApi()
        const joined = await api.joinSession({
          code,
          player: {
            id: player.id,
            name: player.name,
            joinedAt: Date.now(),
          },
        })
        setSession(joined)
        onZones(joined.zones)
        await attachSubscription(joined.code, onZones)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setBusy(false)
      }
    },
    [attachSubscription, firebaseReady, loadApi, player],
  )

  const leave = useCallback(() => {
    clearSubscription()
    setSession(null)
    setError(null)
  }, [clearSubscription])

  const publishZones = useCallback(
    async (zones: BoardState) => {
      if (!session || applyingRemote.current) return
      if (boardsEqual(session.zones, zones)) return
      try {
        const api = await loadApi()
        await api.updateSessionZones(session.code, zones)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    },
    [loadApi, session],
  )

  const rename = useCallback((name: string) => {
    setPlayer(setLocalPlayerName(name))
  }, [])

  return {
    firebaseReady,
    player,
    session,
    busy,
    error,
    create,
    join,
    leave,
    publishZones,
    rename,
  }
}
