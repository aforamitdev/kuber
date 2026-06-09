import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { SparkleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { TEST_ACCOUNT, accountsRegistryAtom, hashPassword, isAuthedAtom, sessionAtom } from '@/state/auth'

export function LoginPage() {
  const authed = useAtomValue(isAuthedAtom)
  const accounts = useAtomValue(accountsRegistryAtom)
  const setSession = useSetAtom(sessionAtom)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (authed) return <Navigate to="/" replace />

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const e1 = email.trim().toLowerCase()
    const acc = accounts.find((a) => a.email.toLowerCase() === e1)
    if (!acc) {
      setError('No account found for that email.')
      return
    }
    if (acc.passwordHash !== hashPassword(password)) {
      setError('Wrong password.')
      return
    }
    setSession({ name: acc.name, email: acc.email })
    navigate('/', { replace: true })
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to Kubera."
      footer={
        <span>
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="grid gap-3">
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
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>
        {error && <div className="text-xs text-rose-600">{error}</div>}
        <Button type="submit" variant="primary" className="mt-2 w-full">
          Sign in
        </Button>
      </form>
      <div className="mt-4 border border-dashed border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
        <div className="mb-1 font-medium text-foreground">Test account</div>
        <div className="font-mono">{TEST_ACCOUNT.email}</div>
        <div className="font-mono">{TEST_ACCOUNT.password}</div>
        <button
          type="button"
          onClick={() => {
            setEmail(TEST_ACCOUNT.email)
            setPassword(TEST_ACCOUNT.password)
            setError(null)
          }}
          className="mt-2 text-foreground underline-offset-2 hover:underline"
        >
          Use test account
        </button>
      </div>
    </AuthShell>
  )
}

type ShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: ShellProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid size-8 place-items-center bg-foreground text-background">
            <SparkleIcon weight="fill" className="size-4" />
          </span>
          <span className="font-heading text-base font-medium">Kubera</span>
        </div>
        <div className="border border-border bg-card p-6">
          <h1 className="font-heading text-xl">{title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{footer}</p>
      </div>
    </div>
  )
}
