import { invoke } from '@tauri-apps/api/core'
import type { Account } from '@/state/atoms'

export type AccountInput = {
  name: string
  institution: string
  currency: string
  balance: number
}

export function listAccounts(): Promise<Account[]> {
  return invoke<Account[]>('account_list')
}

export function createAccount(input: AccountInput): Promise<Account> {
  return invoke<Account>('account_create', { input })
}

export function getAccount(id: string): Promise<Account | null> {
  return invoke<Account | null>('account_get', { id })
}

export function updateAccount(id: string, input: AccountInput): Promise<Account | null> {
  return invoke<Account | null>('account_update', { id, input })
}

export function deleteAccount(id: string): Promise<boolean> {
  return invoke<boolean>('account_delete', { id })
}
