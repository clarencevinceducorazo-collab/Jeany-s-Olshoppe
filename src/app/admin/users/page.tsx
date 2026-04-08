import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { UserRoleSelector, UserDeleteButton } from './user-controls'
import { CreateAdminForm } from './create-admin-form'

export default async function AdminUsersPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin') // Strict check

  const supabase = await createClient()

  const { data: people } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-red-400" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin User Control</h1>
          <p className="text-white/40 text-sm mt-1">Manage platform roles and accounts.</p>
        </div>
      </div>
      
      <CreateAdminForm />

      <div className="bg-white/5 border border-white/5 rounded-xl overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-left text-sm text-white/60">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-mono">
            <tr>
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4">Name / Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Danger Zone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {people?.map((person) => (
              <tr key={person.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-white/30 truncate max-w-[120px]">
                  {person.id}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-white/90">{person.first_name ? `${person.first_name} ${person.last_name || ''}` : person.full_name || 'No Name Provided'}</p>
                  <p className="text-xs text-white/40">{person.email}</p>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
