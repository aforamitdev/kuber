import { Greeting } from '@/components/dashboard/Greeting'
import { NetWorthPanel } from '@/components/dashboard/NetWorthPanel'
import { SplitTiles } from '@/components/dashboard/SplitTiles'
import { AllocationPanel } from '@/components/dashboard/AllocationPanel'
import { MonthlyIncomePanel } from '@/components/dashboard/MonthlyIncomePanel'
import { ExpenseInsightPanel } from '@/components/dashboard/ExpenseInsightPanel'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'

export function DashboardPage() {
  return (
    <>
      <Greeting />
      <Tabs defaultValue="dashboard" className="grid gap-5">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="activity">Recent activity</TabsTrigger>
        </TabsList>

        <TabsPanel value="dashboard" className="grid gap-5">
          <div className="grid items-stretch gap-5 ">
            <NetWorthPanel />
          </div>
            <AllocationPanel />
          <SplitTiles />
          <div className="grid gap-5 sm:grid-cols-2">
            <MonthlyIncomePanel />
            <ExpenseInsightPanel />
          </div>
        </TabsPanel>

        <TabsPanel value="activity">
          <RecentActivity />
        </TabsPanel>
      </Tabs>
    </>
  )
}
