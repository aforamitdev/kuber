import type { CardColor } from '@/state/atoms'

export const CARD_CHIP: Record<CardColor, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
}

export const CARD_COLORS: CardColor[] = ['violet', 'blue', 'rose', 'emerald', 'amber']
