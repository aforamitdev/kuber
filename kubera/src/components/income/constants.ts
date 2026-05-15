import type { IncomeKind, IncomeSource } from '@/state/atoms'

export const INCOME_KIND_LABEL: Record<IncomeKind, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  business: 'Business',
  rental: 'Rental',
  dividend: 'Dividend',
  interest: 'Interest',
  other: 'Other',
}

export const INCOME_KIND_ORDER: IncomeKind[] = [
  'salary',
  'freelance',
  'business',
  'rental',
  'dividend',
  'interest',
  'other',
]

export const INCOME_CADENCE_LABEL: Record<IncomeSource['cadence'], string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  'one-time': 'One-time',
}

export const INCOME_CADENCE_ORDER: IncomeSource['cadence'][] = ['monthly', 'yearly', 'one-time']
