import { Provider as JotaiProvider } from 'jotai'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { CardsPage } from './pages/CardsPage'
import { AccountsPage } from './pages/AccountsPage'
import { StocksPage } from './pages/StocksPage'
import { AppProvider } from './state/AppContext'

function App() {
  return (
    <JotaiProvider>
      <AppProvider>
        <HashRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/stocks-portfolio" element={<StocksPage />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </AppProvider>
    </JotaiProvider>
  )
}

export default App
