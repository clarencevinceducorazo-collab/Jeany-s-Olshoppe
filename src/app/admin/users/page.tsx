import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { ShieldAlert, ShieldCheck, User, Shield, Bike, Trash2 } from 'lucide-react'
import { UserRoleSelector, UserDeleteButton } from './user-controls'
import { CreateAdminForm } from './create-admin-form'

const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  super_admin: { label: 'Super Admin', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: ShieldAlert },
  admin:       { label: 'Admin',       color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: ShieldCheck },
  rider:       { label: 'Rider',       color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Bike },
  user:        { label: 'User',        color: 'text-white/50 bg-white/5 border-white/10', icon: User },
}

export default async function AdminUsersPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin')

  const supabase = await createClient()
  const { data: people } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">User Control</h1>
          <p className="text-white/40 text-xs md:text-sm mt-0.5">Manage platform roles and accounts</p>
        </div>
      </div>

      <CreateAdminForm />

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3 mt-6">
        {people?.map((person) => {
          const userRole = person.role || 'user'
          const cfg = roleConfig[userRole] || roleConfig.user
          const RoleIcon = cfg.icon
          const displayName = person.first_name
            ? `${person.first_name} ${person.last_name || ''}`.trim()
            : person.full_name || 'No Name'

          return (
            <div key={person.id} className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <RoleIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm leading-tight">{displayName}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{person.email}</p>
                </div>
                <UserDeleteButton person={person} />
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <span className="text-white/40 text-xs font-medium">Role:</span>
                <UserRoleSelector person={person} />
              </div>
            </div>
          )
        })}
        {!people?.length && (
          <p className="text-center text-white/30 py-12 text-sm">No users found.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-xl overflow-x-auto w-full mt-6">
        <table className="w-full min-w-[600px] text-left text-sm text-white/60">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-mono">
            <tr>
              <th className="px-6 py-4">Name / Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Danger Zone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {people?.map((person) => {
              const userRole = person.role || 'user'
              const cfg = roleConfig[userRole] || roleConfig.user
              const RoleIcon = cfg.icon
              const displayName = person.first_name
                ? `${person.first_name} ${person.last_name || ''}`.trim()
                : person.full_name || 'No Name'
              return (
                <tr key={person.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${cfg.color}`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">{displayName}</p>
                        <p className="text-xs text-white/40">{person.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleSelector person={person} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <UserDeleteButton person={person} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
