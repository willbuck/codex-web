import { Board } from './components/Board'
import { isFirebaseConfigured } from './firebase/config'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <p className="app__brand">Codex</p>
        <h1 className="app__title">Web Player</h1>
        <p className="app__subtitle">
          Drag cards between hand, play, and discard. Shared Firebase sync comes
          next.
        </p>
        <p
          className={`app__status${isFirebaseConfigured ? ' app__status--live' : ''}`}
        >
          {isFirebaseConfigured
            ? 'Firebase configured'
            : 'Local mock mode — add Firebase env to sync'}
        </p>
      </header>
      <main className="app__main">
        <Board />
      </main>
    </div>
  )
}
