import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { CodexCard } from '../types/card'

type CardViewProps = {
  instanceId: string
  card: CodexCard
}

const colorVar: Record<string, string> = {
  red: 'var(--faction-red)',
  green: 'var(--faction-green)',
  blue: 'var(--faction-blue)',
  purple: 'var(--faction-purple)',
  neutral: 'var(--faction-neutral)',
}

export function CardView({ instanceId, card }: CardViewProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: instanceId, data: { instanceId } })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1,
    borderColor: colorVar[card.color ?? 'neutral'] ?? colorVar.neutral,
  }

  return (
    <article
      ref={setNodeRef}
      className="card"
      style={style}
      {...listeners}
      {...attributes}
      aria-label={`${card.name}, ${card.type}`}
    >
      <header className="card__header">
        <span className="card__cost">{card.cost ?? '—'}</span>
        <h3 className="card__name">{card.name}</h3>
      </header>
      <p className="card__type">{card.type}</p>
      {card.text ? <p className="card__text">{card.text}</p> : null}
    </article>
  )
}
