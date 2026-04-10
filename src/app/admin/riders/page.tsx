import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { Bike, MapPin } from 'lucide-react'
import { CreateRiderForm } from './create-rider-form'
import { UserDeleteButton } from '../users/user-controls'

export default async function AdminRidersPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin') 

  const supabase = await createClient()

  // Fetch only users with 'rider' role
  const { data: riders } = await supabase
    .from('people')
    .select('*')
    .eq('role', 'rider')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <Bike className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Riders Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage delivery personnel and their statuses.</p>
        </div>
      </div>
      
      <CreateRiderForm />

      <div className="bg-white/5 border border-white/5 rounded-xl overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-left text-sm text-white/60">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-mono">
            <tr>
              <th className="px-6 py-4">Rider ID</th>
              <th className="px-6 py-4">Name / Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {riders?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/40 font-mono text-sm">
                  No riders registered yet.
                </td>
              </tr>
            )}
            {riders?.map((rider) => (
              <tr key={rider.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-white/30 truncate max-w-[120px]">
                  {rider.id}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-white/90">{rider.first_name ? `${rider.first_name} ${rider.last_name || ''}` : rider.full_name}</p>
                  <p className="text-xs text-white/40">{rider.email}</p>
                </td>
                <td className="px-6 py-4">
                  {/* For now, fake a status tag */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Available
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors text-xs font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Track
                    </button>
                    {/* Reuse the UserDeleteButton since riders are in 'people' table */}
                    <UserDeleteButton person={rider} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
