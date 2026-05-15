import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAtomValue } from 'jotai'
import { sessionAtom } from './auth'

type Currency = { code: string; locale: string; symbol: string }

const CURRENCIES: Record<string, Currency> = {
  INR: { code: 'INR', locale: 'en-IN', symbol: '₹' },
  USD: { code: 'USD', locale: 'en-US', symbol: '$' },
  EUR: { code: 'EUR', locale: 'de-DE', symbol: '€' },
  GBP: { code: 'GBP', locale: 'en-GB', symbol: '£' },
  JPY: { code: 'JPY', locale: 'ja-JP', symbol: '¥' },
  AUD: { code: 'AUD', locale: 'en-AU', symbol: 'A$' },
  CAD: { code: 'CAD', locale: 'en-CA', symbol: 'C$' },
  SGD: { code: 'SGD', locale: 'en-SG', symbol: 'S$' },
  AED: { code: 'AED', locale: 'en-AE', symbol: 'د.إ' },
}

type AppContextValue = {
  user: { name: string; email: string }
  currency: Currency
  setCurrencyCode: (code: string) => void
  format: (n: number) => string
  formatCompact: (n: number) => string
  formatIn: (n: number, currencyCode: string) => string
}

const AppContext = createContext<AppContextValue | null>(null)

function buildFormatter(code: string, notation: 'standard' | 'compact' = 'standard') {
  const cur = CURRENCIES[code] ?? { code, locale: 'en-US', symbol: code }
  return new Intl.NumberFormat(cur.locale, {
    style: 'currency',
    currency: cur.code,
    notation,
    maximumFractionDigits: notation === 'compact' ? 2 : 0,
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string>('INR')
  const session = useAtomValue(sessionAtom)

  const value = useMemo<AppContextValue>(() => {
    const currency = CURRENCIES[code] ?? CURRENCIES.INR
    const fmt = buildFormatter(currency.code)
    const compact = buildFormatter(currency.code, 'compact')
    return {
      user: session ?? { name: 'Guest', email: '' },
      currency,
      setCurrencyCode: (c) => setCode(c),
      format: (n) => fmt.format(n),
      formatCompact: (n) => compact.format(n),
      formatIn: (n, c) => buildFormatter(c).format(n),
    }
  }, [code, session])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export const CURRENCY_CODES = Object.keys(CURRENCIES)
