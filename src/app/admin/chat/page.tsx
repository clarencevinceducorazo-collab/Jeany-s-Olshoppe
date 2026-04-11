import { getUserRole } from '@/lib/get-user-role'
import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { MessageClient } from './message-client'
import { createClient } from '@/lib/supabase/server'

export default async function AdminChatPage() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/admin') 

  const supabase = await createClient()

  // Get current logged-in admin details implicitly
  const { data: { user } } = await supabase.auth.getUser()

  // Load all available riders to initiate chat with
  const { data: riders } = await supabase
    .from('people')
    .select('id, full_name, email')
    .eq('role', 'rider')

  return (
    <div className="p-4 md:p-8 w-full h-screen flex flex-col max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <MessageSquare className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Dispatch Comms</h1>
          <p className="text-white/40 text-sm mt-1">Real-time messenger backbone to Fleet Riders.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/5 overflow-hidden min-h-[500px]">
        {/* Pass initial data into Real-Time Client Component */}
        <MessageClient 
           adminId={user?.id || ''} 
           riders={riders || []} 
        />
      </div>
    </div>
  )
}
