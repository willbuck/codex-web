import { useDroppable } from '@dnd-kit/core'
import type { CardInstance, CodexCard, ZoneId } from '../types/card'
import { CardView } from './CardView'

type ZoneProps = {
  id: ZoneId
  label: string
  cards: CardInstance[]
  catalog: Record<string, CodexCard>
}

export function Zone({ id, label, cards, catalog }: ZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <section
      ref={setNodeRef}
      className={`zone${isOver ? ' zone--over' : ''}`}
      data-zone={id}
      aria-label={label}
    >
      <header className="zone__header">
        <h2>{label}</h2>
        <span className="zone__count">{cards.length}</span>
      </header>
      <div className="zone__cards">
        {cards.length === 0 ? (
          <p className="zone__empty">Drop cards here</p>
        ) : (
          cards.map((instance) => {
            const card = catalog[instance.cardId]
            if (!card) return null
            return (
              <CardView
                key={instance.instanceId}
                instanceId={instance.instanceId}
                card={card}
              />
            )
          })
        )}
      </div>
    </section>
  )
}
