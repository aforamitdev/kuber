import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type AuthUser = {
  name: string
  email: string
}

type StoredAccount = AuthUser & { passwordHash: string }

export function hashPassword(pw: string): string {
  let h = 0
  for (let i = 0; i < pw.length; i++) {
    h = (h << 5) - h + pw.charCodeAt(i)
    h |= 0
  }
  return `h${h}`
}

export const TEST_ACCOUNT = {
  name: 'Test User',
  email: 'test@kubera.app',
  password: 'test1234',
}

const seededAccounts: StoredAccount[] = [
  {
    name: TEST_ACCOUNT.name,
    email: TEST_ACCOUNT.email,
    passwordHash: hashPassword(TEST_ACCOUNT.password),
  },
]

const ACCOUNTS_KEY = 'kubera.accounts'

if (typeof window !== 'undefined') {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    const parsed: StoredAccount[] = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed : []
    if (!list.some((a) => a.email.toLowerCase() === TEST_ACCOUNT.email)) {
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...list, ...seededAccounts]))
    }
  } catch {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seededAccounts))
  }
}

export const sessionAtom = atomWithStorage<AuthUser | null>('kubera.session', null)

export const accountsRegistryAtom = atomWithStorage<StoredAccount[]>(ACCOUNTS_KEY, seededAccounts)

export const isAuthedAtom = atom((g) => g(sessionAtom) !== null)
