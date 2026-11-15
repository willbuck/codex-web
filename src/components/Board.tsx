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
import { findZone, moveCard } from '../board/boardLogic'
import type { CardCatalog } from '../data/cardCatalog'
import type { BoardState, ZoneId } from '../types/card'
import { ZONE_IDS } from '../types/card'
import { CardView } from './CardView'
import { Zone } from './Zone'

type BoardProps = {
  board: BoardState
  catalog: CardCatalog
  onBoardChange: (next: BoardState) => void
  disabled?: boolean
}

export function Board({
  board,
  catalog,
  onBoardChange,
  disabled = false,
}: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function onDragStart(event: DragStartEvent) {
    if (disabled) return
    setActiveId(String(event.active.id))
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (disabled) return
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

    onBoardChange(moveCard(board, instanceId, toZone))
  }

  const activeInstance = activeId
    ? ZONE_IDS.map((z) => board[z].find((c) => c.instanceId === activeId)).find(
        Boolean,
      )
    : undefined
  const activeCard = activeInstance
    ? catalog[activeInstance.cardId]
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
          catalog={catalog}
        />
        <Zone id="hand" label="Hand" cards={board.hand} catalog={catalog} />
        <Zone
          id="discard"
          label="Discard"
          cards={board.discard}
          catalog={catalog}
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
