import type { BoardState, CodexCard } from '../types/card'

/** Placeholder cards until Codex Card DB wiring. */
export const MOCK_CARDS: Record<string, CodexCard> = {
  worker: {
    id: 'worker',
    name: 'Worker',
    type: 'Unit',
    cost: 1,
    color: 'neutral',
    text: 'Produces gold.',
  },
  techlab: {
    id: 'techlab',
    name: 'Tech Lab',
    type: 'Building',
    cost: 2,
    color: 'blue',
    text: 'Unlocks tech II.',
  },
  brave: {
    id: 'brave',
    name: 'Timely Messenger',
    type: 'Unit',
    cost: 1,
    color: 'red',
    text: 'Haste. Arrives ready.',
  },
  bloom: {
    id: 'bloom',
    name: 'Blooming Flower',
    type: 'Unit',
    cost: 2,
    color: 'green',
    text: 'Gains +1/+1 each turn.',
  },
  mirror: {
    id: 'mirror',
    name: 'Mirror Illusion',
    type: 'Unit',
    cost: 3,
    color: 'purple',
    text: 'Copy a unit in play.',
  },
}

export function createInitialBoard(): BoardState {
  return {
    hand: [
      { instanceId: 'i1', cardId: 'worker' },
      { instanceId: 'i2', cardId: 'techlab' },
      { instanceId: 'i3', cardId: 'brave' },
      { instanceId: 'i4', cardId: 'bloom' },
      { instanceId: 'i5', cardId: 'mirror' },
    ],
    inPlay: [],
    discard: [],
  }
}
