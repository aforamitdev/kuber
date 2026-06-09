import { Provider as JotaiProvider, useAtomValue } from 'jotai'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { CardsPage } from './pages/cards/CardsPage'
import { AccountsPage } from './pages/accounts/AccountsPage'
import { AccountDetailPage } from './pages/accounts/AccountDetailPage'
import { AssetsPage } from './pages/assets/AssetsPage'
import { AssetDetailPage } from './pages/assets/AssetDetailPage'
import { StocksPage } from './pages/stocks/StocksPage'
import { IncomeSourcesPage } from './pages/income/IncomeSourcesPage'
import { IncomeSourceDetailPage } from './pages/income/IncomeSourceDetailPage'
import { LoansPage } from './pages/loans/LoansPage'
import { LoanDetailPage } from './pages/loans/LoanDetailPage'
import { NotificationsPage } from './pages/notifications/NotificationsPage'
import { RoadmapPage } from './pages/roadmap/RoadmapPage'
import { CashFlowPage } from './pages/cashflow/CashFlowPage'
import { WorkflowPage } from './pages/workflow/WorkflowPage'
import { TransactionsPage } from './pages/transactions/TransactionsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
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
        <Route path="/assets/:id" element={<AssetDetailPage />} />
        <Route path="/income-sources" element={<IncomeSourcesPage />} />
        <Route path="/income-sources/:id" element={<IncomeSourceDetailPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/:id" element={<LoanDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/cashflow" element={<CashFlowPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
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
