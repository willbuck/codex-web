import { useState } from 'react'

type SessionBarProps = {
  firebaseReady: boolean
  sessionCode: string | null
  playerName: string
  playerCount: number
  busy: boolean
  error: string | null
  onPlayerNameChange: (name: string) => void
  onCreate: () => void
  onJoin: (code: string) => void
  onLeave: () => void
}

export function SessionBar({
  firebaseReady,
  sessionCode,
  playerName,
  playerCount,
  busy,
  error,
  onPlayerNameChange,
  onCreate,
  onJoin,
  onLeave,
}: SessionBarProps) {
  const [joinCode, setJoinCode] = useState('')

  if (!firebaseReady) {
    return (
      <section className="session session--offline" aria-label="Session">
        <p>
          Local mock mode. Add Firebase env vars to create/join shared sessions
          (see README / docs/FIREBASE_SETUP.md).
        </p>
      </section>
    )
  }

  return (
    <section className="session" aria-label="Session">
      <label className="session__field">
        <span>Name</span>
        <input
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          maxLength={24}
          disabled={busy}
        />
      </label>

      {sessionCode ? (
        <div className="session__active">
          <p>
            Session <strong>{sessionCode}</strong>
            <span className="session__meta"> · {playerCount} player(s)</span>
          </p>
          <button type="button" onClick={onLeave} disabled={busy}>
            Leave
          </button>
        </div>
      ) : (
        <div className="session__actions">
          <button type="button" onClick={onCreate} disabled={busy}>
            {busy ? 'Working…' : 'Create session'}
          </button>
          <label className="session__field session__field--join">
            <span>Join code</span>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={8}
              disabled={busy}
            />
          </label>
          <button
            type="button"
            onClick={() => onJoin(joinCode)}
            disabled={busy || joinCode.trim().length < 4}
          >
            Join
          </button>
        </div>
      )}

      {error ? <p className="session__error">{error}</p> : null}
    </section>
  )
}
