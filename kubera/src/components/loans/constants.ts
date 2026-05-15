import type { LoanKind } from '@/state/atoms'

export const LOAN_KIND_LABEL: Record<LoanKind, string> = {
  home: 'Home',
  car: 'Auto',
  personal: 'Personal',
  education: 'Education',
  credit: 'Credit',
  business: 'Business',
  other: 'Other',
}

export const LOAN_KIND_ORDER: LoanKind[] = [
  'home',
  'car',
  'personal',
  'education',
  'credit',
  'business',
  'other',
]
