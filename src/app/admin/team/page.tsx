import { getTeamMembers } from './actions'
import { TeamManager } from './team-manager'
import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const role = await getUserRole()
  if (!role || (role !== 'admin' && role !== 'super_admin')) {
    redirect('/admin')
  }

  const initialMembers = await getTeamMembers()

  return (
    <div className="p-4 md:p-8 w-full">
      <TeamManager initialMembers={initialMembers} />
    </div>
  )
}
