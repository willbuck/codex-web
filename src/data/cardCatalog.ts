import type { BoardState, CardInstance, CodexCard } from '../types/card'
import seed from './catalog.seed.json'

type SeedCard = CodexCard

const seedCards = seed as SeedCard[]

export type CardCatalog = Record<string, CodexCard>

/** Built-in subset sourced from willbuck/codex-cards-js (same data as codexcarddb). */
export function getSeedCatalog(): CardCatalog {
  return Object.fromEntries(seedCards.map((card) => [card.id, card]))
}

/**
 * Prefer bundled seed; optionally refresh/merge from /data/cards-subset.json
 * (public asset) when available. Live fetch from codexcarddb.com is not used —
 * that site is a Gatsby SPA with no public JSON API.
 */
export async function loadCardCatalog(): Promise<CardCatalog> {
  const catalog = getSeedCatalog()

  try {
    const base = import.meta.env.BASE_URL || '/'
    const url = `${base}data/cards-subset.json`
    const res = await fetch(url)
    if (!res.ok) return catalog
    const raw = (await res.json()) as Array<Record<string, unknown>>
    for (const item of raw) {
      const mapped = mapRawCard(item)
      if (mapped) catalog[mapped.id] = mapped
    }
  } catch {
    // Keep seed catalog
  }

  return catalog
}

function mapRawCard(item: Record<string, unknown>): CodexCard | null {
  const name = typeof item.name === 'string' ? item.name : null
  if (!name) return null

  const sirlinsFilename =
    typeof item.sirlins_filename === 'string'
      ? item.sirlins_filename
      : typeof item.sirlinsFilename === 'string'
        ? item.sirlinsFilename
        : undefined

  const id =
    (typeof item.id === 'string' && item.id) ||
    (sirlinsFilename
      ? sirlinsFilename.replace(/\.jpg$/i, '')
      : name.toLowerCase().replace(/\s+/g, '_'))

  const textParts = ['rules_text_1', 'rules_text_2', 'rules_text_3']
    .map((k) => item[k])
    .filter((v): v is string => typeof v === 'string' && v.length > 0)

  return {
    id,
    name,
    type: typeof item.type === 'string' ? item.type : 'Unknown',
    cost: typeof item.cost === 'number' ? item.cost : undefined,
    color:
      typeof item.color === 'string' ? item.color.toLowerCase() : undefined,
    spec: typeof item.spec === 'string' ? item.spec : undefined,
    subtype: typeof item.subtype === 'string' ? item.subtype : undefined,
    atk: typeof item.ATK === 'number' ? item.ATK : undefined,
    hp: typeof item.HP === 'number' ? item.HP : undefined,
    text:
      textParts.length > 0
        ? textParts.join(' ')
        : typeof item.text === 'string'
          ? item.text
          : undefined,
    imageUrl: sirlinsFilename
      ? `https://codexcards-assets.surge.sh/images/${sirlinsFilename}`
      : typeof item.imageUrl === 'string'
        ? item.imageUrl
        : undefined,
    sirlinsFilename,
  }
}

const STARTER_HAND_IDS = [
  '0003_timely_messenger',
  '0004_tenderfoot',
  '0005_older_brother',
  '0006_brick_thief',
  '0009_fruit_ninja',
  '0010_spark',
  '0011_bloom',
]

export function createInitialBoard(catalog: CardCatalog): BoardState {
  const ids = STARTER_HAND_IDS.filter((id) => catalog[id])
  const fallback = Object.keys(catalog).slice(0, 7)
  const handIds = ids.length > 0 ? ids : fallback

  const hand: CardInstance[] = handIds.map((cardId, index) => ({
    instanceId: `local_${index + 1}_${cardId}`,
    cardId,
  }))

  return { hand, inPlay: [], discard: [] }
}
