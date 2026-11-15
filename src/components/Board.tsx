import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { createInitialBoard, MOCK_CARDS } from '../data/mockCards'
import type { BoardState, CardInstance, ZoneId } from '../types/card'
import { CardView } from './CardView'
import { Zone } from './Zone'

const ZONE_IDS: ZoneId[] = ['inPlay', 'hand', 'discard']

function findZone(
  state: BoardState,
  instanceId: string,
): ZoneId | null {
  for (const zone of ZONE_IDS) {
    if (state[zone].some((c) => c.instanceId === instanceId)) return zone
  }
  return null
}

function moveCard(
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

export function Board() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const instanceId = String(active.id)
    const overId = String(over.id)

    let toZone: ZoneId | null = null
    if (ZONE_IDS.includes(overId as ZoneId)) {
      toZone = overId as ZoneId
    } else {
      toZone = findZone(board, overId)
    }
    if (!toZone) return

    setBoard((prev) => moveCard(prev, instanceId, toZone))
  }

  const activeInstance = activeId
    ? ZONE_IDS.map((z) => board[z].find((c) => c.instanceId === activeId)).find(
        Boolean,
      )
    : undefined
  const activeCard = activeInstance
    ? MOCK_CARDS[activeInstance.cardId]
    : undefined

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="board">
        <Zone
          id="inPlay"
          label="In Play"
          cards={board.inPlay}
          catalog={MOCK_CARDS}
        />
        <Zone id="hand" label="Hand" cards={board.hand} catalog={MOCK_CARDS} />
        <Zone
          id="discard"
          label="Discard"
          cards={board.discard}
          catalog={MOCK_CARDS}
        />
      </div>
      <DragOverlay>
        {activeCard && activeInstance ? (
          <CardView instanceId={activeInstance.instanceId} card={activeCard} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
