import { Provider as JotaiProvider, useAtomValue } from 'jotai'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { CardsPage } from './pages/CardsPage'
import { AccountsPage } from './pages/AccountsPage'
import { AccountDetailPage } from './pages/AccountDetailPage'
import { AssetsPage } from './pages/AssetsPage'
import { StocksPage } from './pages/StocksPage'
import { IncomeSourcesPage } from './pages/IncomeSourcesPage'
import { LoansPage } from './pages/LoansPage'
import { LoanDetailPage } from './pages/LoanDetailPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AppProvider } from './state/AppContext'
import { isAuthedAtom } from './state/auth'

function Routed() {
  const authed = useAtomValue(isAuthedAtom)

  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/stocks-portfolio" element={<StocksPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/income-sources" element={<IncomeSourcesPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/:id" element={<LoanDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <JotaiProvider>
      <AppProvider>
        <HashRouter>
          <Routed />
        </HashRouter>
      </AppProvider>
    </JotaiProvider>
  )
}

export default App
