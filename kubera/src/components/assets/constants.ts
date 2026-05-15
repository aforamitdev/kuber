import type { AssetKind } from '@/state/atoms'

export const ASSET_KIND_LABEL: Record<AssetKind, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  land: 'Land',
  car: 'Vehicle',
  gold: 'Gold & ornaments',
  other: 'Other',
}

export const ASSET_KIND_ORDER: AssetKind[] = [
  'residential',
  'commercial',
  'land',
  'car',
  'gold',
  'other',
]
