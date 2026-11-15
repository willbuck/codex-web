export type CardId = string

export type CodexCard = {
  id: CardId
  name: string
  type: string
  cost?: number
  color?: string
  text?: string
  imageUrl?: string
}

/** Instance of a card in a zone (deck may have multiples later). */
export type CardInstance = {
  instanceId: string
  cardId: CardId
}

export type ZoneId = 'hand' | 'inPlay' | 'discard'

export type BoardState = Record<ZoneId, CardInstance[]>
