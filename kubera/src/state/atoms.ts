import { atom } from 'jotai'

export type CardColor = 'violet' | 'blue' | 'rose' | 'emerald' | 'amber'

export type CardEntity = {
  id: string
  name: string
  type: 'credit' | 'debit'
  currency: string
  last4: string
  expiry: string
  color: CardColor
  limit?: number
  spent?: number
}

export type Account = {
  id: string
  name: string
  institution: string
  currency: string
  balance: number
}

export type Market = {
  id: string
  name: string
  currency: string
}

export type Portfolio = {
  id: string
  marketId: string
  name: string
}

export type Stock = {
  id: string
  portfolioId: string
  ticker: string
  name: string
  shares: number
  price: number
}

export type Property = {
  id: string
  name: string
  kind: 'house' | 'land' | 'commercial' | 'other'
  value: number
  location?: string
}

export type Transaction = {
  id: string
  payee: string
  payeeIcon: string
  dateISO: string
  method: string
  type: 'Send' | 'Receive'
  status: 'Pending' | 'Complete' | 'Failed'
  amount: number
}

export type AllocationBucket = {
  id: string
  label: string
  pct: number
  color: string
}

export type SeriesPoint = { month: string; movable: number; nonMovable: number }

export const cardsAtom = atom<CardEntity[]>([
  { id: 'c1', name: 'Visa Platinum', type: 'credit', currency: 'INR', last4: '9213', expiry: '06/28', color: 'violet', limit: 500_000, spent: 124_000 },
  { id: 'c2', name: 'Salary debit',   type: 'debit',  currency: 'INR', last4: '8102', expiry: '04/29', color: 'blue' },
  { id: 'c3', name: 'Travel card',    type: 'credit', currency: 'USD', last4: '0421', expiry: '02/30', color: 'rose', limit: 8_000, spent: 1_240 },
])

export const accountsAtom = atom<Account[]>([
  { id: 'a1', name: 'Checking',  institution: 'HDFC',  currency: 'INR', balance: 285_000 },
  { id: 'a2', name: 'Savings',   institution: 'ICICI', currency: 'INR', balance: 1_240_000 },
  { id: 'a3', name: 'Emergency', institution: 'SBI',   currency: 'INR', balance: 600_000 },
])

export const marketsAtom = atom<Market[]>([
  { id: 'm1', name: 'US Equity',     currency: 'USD' },
  { id: 'm2', name: 'Indian Equity', currency: 'INR' },
])

export const portfoliosAtom = atom<Portfolio[]>([
  { id: 'p1', marketId: 'm1', name: 'Tech' },
  { id: 'p2', marketId: 'm1', name: 'Long term' },
  { id: 'p3', marketId: 'm2', name: 'Bluechips' },
])

export const stocksAtom = atom<Stock[]>([
  { id: 's1', portfolioId: 'p1', ticker: 'AAPL', name: 'Apple',     shares: 40,  price: 232.5 },
  { id: 's2', portfolioId: 'p1', ticker: 'MSFT', name: 'Microsoft', shares: 25,  price: 451.2 },
  { id: 's3', portfolioId: 'p2', ticker: 'NVDA', name: 'NVIDIA',    shares: 15,  price: 178.9 },
  { id: 's4', portfolioId: 'p3', ticker: 'INFY', name: 'Infosys',   shares: 120, price: 1830 },
])

export const propertiesAtom = atom<Property[]>([
  { id: 'p1', name: 'Bandra Apartment', kind: 'house',      value: 32_500_000, location: 'Mumbai' },
  { id: 'p2', name: 'Goa Plot',         kind: 'land',       value: 8_750_000,  location: 'Goa' },
  { id: 'p3', name: 'Andheri Office',   kind: 'commercial', value: 18_200_000, location: 'Mumbai' },
])

export const transactionsAtom = atom<Transaction[]>([
  { id: 't1', payee: 'Figma Pro',     payeeIcon: '🎨', dateISO: '2025-11-20T08:01:00', method: 'Visa **** 8271',    type: 'Send',    status: 'Pending',  amount: -120 },
  { id: 't2', payee: 'Youtube',       payeeIcon: '▶︎', dateISO: '2025-11-20T08:01:00', method: 'Jago **** 8102',    type: 'Send',    status: 'Pending',  amount: -120 },
  { id: 't3', payee: 'Coffee',        payeeIcon: '☕', dateISO: '2025-11-20T08:01:00', method: 'Seabank **** 1289', type: 'Send',    status: 'Complete', amount: -120 },
  { id: 't4', payee: 'Food',          payeeIcon: '🍱', dateISO: '2025-11-20T08:01:00', method: 'Mandiri **** 0783', type: 'Send',    status: 'Complete', amount: -120 },
  { id: 't5', payee: 'Kusina Mewing', payeeIcon: '👤', dateISO: '2025-11-20T08:01:00', method: 'Jago **** 8102',    type: 'Receive', status: 'Failed',   amount: 120 },
  { id: 't6', payee: 'Gojek',         payeeIcon: '🛵', dateISO: '2025-11-20T08:01:00', method: 'Visa **** 8271',    type: 'Send',    status: 'Complete', amount: -120 },
])

export const allocationAtom = atom<AllocationBucket[]>([
  { id: 'a1', label: 'Emergency fund',   pct: 46, color: '#FCD7B6' },
  { id: 'a2', label: 'BPJS',             pct: 22, color: '#D9D6F2' },
  { id: 'a3', label: 'Pay rent',         pct: 12, color: '#CFE6F0' },
  { id: 'a4', label: 'App subscription', pct: 11, color: '#EAD9F4' },
  { id: 'a5', label: 'Shopping',         pct: 5,  color: '#F4D4DA' },
  { id: 'a6', label: 'Others',           pct: 4,  color: '#CDE9D0' },
])

export const netWorthSeriesAtom = atom<SeriesPoint[]>([
  { month: 'Jan', movable: 3200, nonMovable: 2200 },
  { month: 'Feb', movable: 3500, nonMovable: 2300 },
  { month: 'Mar', movable: 3300, nonMovable: 2400 },
  { month: 'Apr', movable: 4100, nonMovable: 2500 },
  { month: 'May', movable: 4400, nonMovable: 2700 },
  { month: 'Jun', movable: 4200, nonMovable: 2900 },
  { month: 'Jul', movable: 4800, nonMovable: 3000 },
  { month: 'Aug', movable: 4600, nonMovable: 3100 },
  { month: 'Sep', movable: 5100, nonMovable: 3200 },
  { month: 'Oct', movable: 4900, nonMovable: 3300 },
  { month: 'Nov', movable: 5300, nonMovable: 3500 },
  { month: 'Dec', movable: 5500, nonMovable: 3600 },
])

export const accountTotalAtom = atom((g) => g(accountsAtom).reduce((s, a) => s + a.balance, 0))
export const stockTotalAtom = atom((g) => g(stocksAtom).reduce((s, x) => s + x.shares * x.price, 0))
export const propertyTotalAtom = atom((g) => g(propertiesAtom).reduce((s, p) => s + p.value, 0))
export const movableTotalAtom = atom((g) => g(accountTotalAtom) + g(stockTotalAtom))
export const nonMovableTotalAtom = atom((g) => g(propertyTotalAtom))
export const netWorthAtom = atom((g) => g(movableTotalAtom) + g(nonMovableTotalAtom))
