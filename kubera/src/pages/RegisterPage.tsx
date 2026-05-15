import { useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Input'
import { accountsRegistryAtom, hashPassword, isAuthedAtom, sessionAtom } from '@/state/auth'
import { AuthShell } from './LoginPage'

export function RegisterPage() {
  const authed = useAtomValue(isAuthedAtom)
  const [accounts, setAccounts] = useAtom(accountsRegistryAtom)
  const setSession = useSetAtom(sessionAtom)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (authed) return <Navigate to="/" replace />

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const n = name.trim()
    const e1 = email.trim().toLowerCase()
    if (n.length < 2) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e1)) return setError('Enter a valid email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    if (accounts.some((a) => a.email.toLowerCase() === e1)) {
      return setError('An account with that email already exists.')
    }
    const user = { name: n, email: e1 }
    setAccounts([...accounts, { ...user, passwordHash: hashPassword(password) }])
    setSession(user)
    navigate('/', { replace: true })
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Track your accounts, assets, and loans — all in one place."
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="Confirm password">
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
        </Field>
        {error && <div className="text-xs text-rose-600">{error}</div>}
        <Button type="submit" variant="primary" className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
