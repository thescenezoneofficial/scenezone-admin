import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/app/(main)/dashboard/data-table'
import { SectionCards } from '@/components/section-cards'
import data from './data.json'

export default function Dashboard() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
