export type Tone =
  | 'sky'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'slate'
  | 'indigo'
  | 'teal'

export const TONE_CLASS: Record<Tone, string> = {
  sky:     'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber:   'bg-amber-50 text-amber-600',
  rose:    'bg-rose-50 text-rose-600',
  violet:  'bg-violet-50 text-violet-600',
  slate:   'bg-slate-100 text-slate-600',
  indigo:  'bg-indigo-50 text-indigo-600',
  teal:    'bg-teal-50 text-teal-600',
}

export const ASSET_KIND_TONE = {
  residential: 'sky',
  commercial:  'indigo',
  land:        'emerald',
  car:         'amber',
  gold:        'amber',
  other:       'slate',
} as const satisfies Record<string, Tone>

export const INCOME_KIND_TONE = {
  salary:    'sky',
  freelance: 'violet',
  business:  'indigo',
  rental:    'emerald',
  dividend:  'teal',
  interest:  'amber',
  other:     'slate',
} as const satisfies Record<string, Tone>

export const LOAN_KIND_TONE = {
  home:      'sky',
  car:       'amber',
  personal:  'violet',
  education: 'indigo',
  credit:    'rose',
  business:  'teal',
  other:     'slate',
} as const satisfies Record<string, Tone>

const ROTATE: Tone[] = ['sky', 'violet', 'emerald', 'amber', 'rose', 'indigo', 'teal', 'slate']

export function rotatingTone(key: string, salt = 0): Tone {
  let h = salt
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return ROTATE[h % ROTATE.length]
}
