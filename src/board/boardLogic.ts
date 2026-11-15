import type { BoardState, CardInstance, ZoneId } from '../types/card'
import { ZONE_IDS } from '../types/card'

export function findZone(
  state: BoardState,
  instanceId: string,
): ZoneId | null {
  for (const zone of ZONE_IDS) {
    if (state[zone].some((c) => c.instanceId === instanceId)) return zone
  }
  return null
}

export function moveCard(
  state: BoardState,
  instanceId: string,
  toZone: ZoneId,
): BoardState {
  const fromZone = findZone(state, instanceId)
  if (!fromZone || fromZone === toZone) return state

  let moving: CardInstance | undefined
  const next: BoardState = {
    hand: [],
    inPlay: [],
    discard: [],
  }

  for (const zone of ZONE_IDS) {
    next[zone] = state[zone].filter((c) => {
      if (c.instanceId === instanceId) {
        moving = c
        return false
      }
      return true
    })
  }

  if (!moving) return state
  next[toZone] = [...next[toZone], moving]
  return next
}

export function boardsEqual(a: BoardState, b: BoardState): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
