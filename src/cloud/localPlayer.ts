const PLAYER_KEY = 'codex-web.player'

export type LocalPlayer = {
  id: string
  name: string
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `p_${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateLocalPlayer(): LocalPlayer {
  try {
    const raw = localStorage.getItem(PLAYER_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as LocalPlayer
      if (parsed?.id && parsed?.name) return parsed
    }
  } catch {
    // ignore corrupt storage
  }

  const player: LocalPlayer = {
    id: randomId(),
    name: `Player ${Math.floor(Math.random() * 90 + 10)}`,
  }
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
  return player
}

export function setLocalPlayerName(name: string): LocalPlayer {
  const current = getOrCreateLocalPlayer()
  const next = { ...current, name: name.trim() || current.name }
  localStorage.setItem(PLAYER_KEY, JSON.stringify(next))
  return next
}
