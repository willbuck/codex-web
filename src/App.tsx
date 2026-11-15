import { useEffect, useState } from 'react'
import { Board } from './components/Board'
import { SessionBar } from './components/SessionBar'
import { isFirebaseConfigured } from './cloud/firebaseConfig'
import {
  createInitialBoard,
  loadCardCatalog,
  type CardCatalog,
} from './data/cardCatalog'
import { useGameSession } from './hooks/useGameSession'
import type { BoardState } from './types/card'
import './App.css'

export default function App() {
  const [catalog, setCatalog] = useState<CardCatalog | null>(null)
  const [board, setBoard] = useState<BoardState | null>(null)
  const session = useGameSession(
    board ?? { hand: [], inPlay: [], discard: [] },
  )

  useEffect(() => {
    let cancelled = false
    void loadCardCatalog().then((loaded) => {
      if (cancelled) return
      setCatalog(loaded)
      setBoard((prev) => prev ?? createInitialBoard(loaded))
    })
    return () => {
      cancelled = true
    }
  }, [])

  function handleBoardChange(next: BoardState) {
    setBoard(next)
    void session.publishZones(next)
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__brand">Codex</p>
        <h1 className="app__title">Web Player</h1>
        <p className="app__subtitle">
          Drag cards between hand, play, and discard. Create a session to sync
          the table over Firebase.
        </p>
        <p
          className={`app__status${isFirebaseConfigured() ? ' app__status--live' : ''}`}
        >
          {isFirebaseConfigured()
            ? 'Firebase configured — create or join a session'
            : 'Local mock mode — Firebase env not set'}
        </p>
      </header>

      <SessionBar
        firebaseReady={session.firebaseReady}
        sessionCode={session.session?.code ?? null}
        playerName={session.player.name}
        playerCount={
          session.session ? Object.keys(session.session.players).length : 0
        }
        busy={session.busy}
        error={session.error}
        onPlayerNameChange={session.rename}
        onCreate={() => void session.create(setBoard)}
        onJoin={(code) => void session.join(code, setBoard)}
        onLeave={session.leave}
      />

      <main className="app__main">
        {catalog && board ? (
          <Board
            board={board}
            catalog={catalog}
            onBoardChange={handleBoardChange}
          />
        ) : (
          <p className="app__loading">Loading cards…</p>
        )}
      </main>
    </div>
  )
}
