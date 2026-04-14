import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { Bike, MapPin, Phone, Mail, Plus } from 'lucide-react'
import { CreateRiderForm } from './create-rider-form'
import { UserDeleteButton } from '../users/user-controls'

export default async function AdminRidersPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin')

  const supabase = await createClient()
  const { data: riders } = await supabase
    .from('people')
    .select('*')
    .eq('role', 'rider')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Bike className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Riders</h1>
          <p className="text-white/40 text-xs md:text-sm mt-0.5">
            {riders?.length ?? 0} delivery personnel registered
          </p>
        </div>
      </div>

      <CreateRiderForm />

      {/* Mobile card list */}
      <div className="lg:hidden mt-6 space-y-3">
        {riders?.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No riders registered yet.
          </div>
        )}
        {riders?.map((rider) => {
          const displayName = rider.first_name
            ? `${rider.first_name} ${rider.last_name || ''}`.trim()
            : rider.full_name || 'No Name'

          return (
            <div key={rider.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Bike className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm leading-tight">{displayName}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{rider.email}</p>
                </div>
                {/* Available badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Action footer */}
              <div className="flex border-t border-white/5">
                <a
                  href={`mailto:${rider.email}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <div className="w-px bg-white/5" />
                <button className="flex-1 flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Track
                </button>
                <div className="w-px bg-white/5" />
                <div className="flex-1 flex items-center justify-center py-3">
                  <UserDeleteButton person={rider} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-xl overflow-x-auto w-full mt-6">
        <table className="w-full min-w-[600px] text-left text-sm text-white/60">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-mono">
            <tr>
              <th className="px-6 py-4">Name / Contact</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {riders?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-white/30">
                  No riders registered yet.
                </td>
              </tr>
            )}
            {riders?.map((rider) => {
              const displayName = rider.first_name
                ? `${rider.first_name} ${rider.last_name || ''}`.trim()
                : rider.full_name
              return (
                <tr key={rider.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Bike className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="font-semibold text-white/90">{displayName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/50">{rider.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Available
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Track
                      </button>
                      <UserDeleteButton person={rider} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile FAB — Add Rider scroll to form */}
      <a
        href="#create-rider"
        className="lg:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 bg-blue-500 text-white px-4 h-14 rounded-full shadow-2xl shadow-blue-500/30 hover:bg-blue-600 active:scale-95 transition-all font-semibold text-sm"
        aria-label="Add Rider"
      >
        <Plus className="w-5 h-5" /> Add Rider
      </a>
    </div>
  )
}
