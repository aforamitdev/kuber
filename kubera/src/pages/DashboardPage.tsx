import { Greeting } from '../components/dashboard/Greeting'
import { NetWorthPanel } from '../components/dashboard/NetWorthPanel'
import { SplitTiles } from '../components/dashboard/SplitTiles'
import { AllocationPanel } from '../components/dashboard/AllocationPanel'
import { RecentActivity } from '../components/dashboard/RecentActivity'

export function DashboardPage() {
  return (
    <>
      <Greeting />
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-5">
          <NetWorthPanel />
          <SplitTiles />
        </div>
        <div className="grid gap-5">
          <AllocationPanel />
        </div>
      </div>
      <div className="mt-5">
        <RecentActivity />
      </div>
    </>
  )
}
