import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { LogisticsMap } from './logistics-map'
import { Map } from 'lucide-react'
import { getBuyerLocations, getLiveRiders } from '../actions'

export default async function AdminMapPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin') 

  const initialLocations = await getBuyerLocations()
  const liveRiders = await getLiveRiders()

  return (
    <div className="p-4 md:p-8 w-full h-screen flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Map className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Logistics Map</h1>
          <p className="text-white/40 text-sm mt-1">Real-time tracking interface for dispatch and routing operations.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/5 p-2 overflow-hidden min-h-[500px]">
        <LogisticsMap initialLocations={initialLocations || []} liveRiders={liveRiders || []} />
      </div>
    </div>
  )
}
