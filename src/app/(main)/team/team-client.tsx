'use client'

import { useEffect, useState } from 'react'
import { UserCircle, Shield, Bike, Megaphone, MessageCircleHeart } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/app/admin/team/actions'

function MemberCard({ member }: { member: TeamMember }) {
  const isAdmin = member.category === 'admin';
  const isRider = member.category === 'rider';
  
  return (
    <div className="group relative flex flex-col items-center p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/[0.06] hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer">
      {/* Role Badge */}
      <div className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-colors duration-300
        ${isAdmin ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 group-hover:bg-rose-500/20' : 
          isRider ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20 group-hover:bg-orange-500/20' : 
          'bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent/20'}
      `}>
        {isAdmin && <Shield className="w-3 h-3" />}
        {isRider && <Bike className="w-3 h-3" />}
        {isAdmin ? 'Admin' : isRider ? 'Rider' : 'Assistant'}
      </div>

      {/* Default Avatar */}
      <div className="w-24 h-24 rounded-full mb-5 bg-gradient-to-tr from-[#1a1512] to-[#2a2320] flex items-center justify-center border border-white/10 shadow-inner group-hover:shadow-accent/20 group-hover:border-accent/30 overflow-hidden transition-all duration-500 relative">
         <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 z-10 pointer-events-none" />
         {member.image_url ? (
           <Image priority={false} src={member.image_url} alt={member.name} fill sizes="(max-width: 96px) 100vw, 96px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
         ) : (
           <UserCircle className="w-10 h-10 text-white/30 group-hover:text-accent/80 transition-colors duration-500 group-hover:scale-110" />
         )}
      </div>

      <h3 className="text-white/90 font-bold text-center text-base tracking-wide group-hover:text-white transition-colors">{member.name}</h3>
      <p className="text-white/40 group-hover:text-white/60 text-xs text-center mt-1.5 font-medium px-2 leading-relaxed transition-colors">{member.role}</p>
    </div>
  );
}

export function TeamClient({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('realtime_team')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMembers(prev => [...prev, payload.new as TeamMember])
        } else if (payload.eventType === 'UPDATE') {
          setMembers(prev => prev.map(m => m.id === payload.new.id ? payload.new as TeamMember : m))
        } else if (payload.eventType === 'DELETE') {
          setMembers(prev => prev.filter(m => m.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const activeMembers = members.filter(m => m.status === 'active')
  const host = activeMembers.find(m => m.category === 'host')
  const assistants = activeMembers.filter(m => m.category === 'assistant' || m.category === 'admin')
  const riders = activeMembers.filter(m => m.category === 'rider')

  return (
    <div className="min-h-screen bg-[#1a1512] pt-8 pb-32 md:pb-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* Background Japanese Watermark Image */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay">
         <Image src="/images/Staff/japanese.jpg" alt="Background" fill className="object-cover" />
      </div>

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        
        {/* Header Title with Logo */}
        <div className="text-center space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border border-white/10 overflow-hidden shadow-2xl p-1 bg-white/5 backdrop-blur-md">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image priority src="/images/Staff/logo.jpg" alt="Jeany's Olshoppe Logo" fill sizes="(max-width: 80px) 100vw, 80px" className="object-cover" />
            </div>
          </div>
          <div>
             <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Our Dedicated <span className="text-accent">Team</span></h1>
             <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto mt-4">
               Meet the hardworking people behind Jeany&apos;s Olshoppe ensuring you get the best Japan surplus quality delivered right to you.
             </p>
          </div>
        </div>

        {/* Section 1: Live Host & Live Session Mockup */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gradient-to-br from-[#241e1b] to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[300px]">
             {host ? (
              <div className="relative z-10 flex flex-col items-start gap-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1a1512] flex shrink-0 items-center justify-center border-4 border-accent/20 shadow-xl overflow-hidden relative">
                   {host.image_url ? (
                     <Image src={host.image_url} alt={host.name} fill sizes="(max-width: 160px) 100vw, 160px" className="object-cover" />
                   ) : (
                     <UserCircle className="w-16 h-16 text-white/20" />
                   )}
                </div>
                
                <div>
                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full mb-4 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_currentColor]" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Live Host & Founder</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1 tracking-wide">{host.name}</h2>
                  <p className="text-sm text-accent/80 font-medium mb-4 uppercase tracking-widest">{host.role}</p>
                  <p className="text-white/50 text-sm leading-relaxed max-w-md">
                    {host.description || "The main speaker and seller during live selling sessions. Presents items, answers questions, and assists customers in real time. The Voice of Jeany's."}
                  </p>
                </div>
              </div>
             ) : (
               <div className="flex flex-col items-center justify-center text-white/30 text-center h-full">
                 <Megaphone className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-sm font-medium">No live host available</p>
               </div>
             )}
          </div>

          {/* Live Mobile Mockup Panel */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-xl flex items-center justify-center min-h-[400px]">
             {/* Abstract Backdrop */}
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
             
             {/* Phone Mockup Frame */}
             <div className="relative w-64 h-[460px] bg-black rounded-[2.5rem] border-[6px] border-[#2a2320] shadow-2xl overflow-hidden ring-1 ring-white/10">
               <div className="absolute top-0 inset-x-0 h-6 bg-[#2a2320] rounded-b-xl z-20 mx-auto w-1/3" />
               <Image src="/images/Staff/live.png" alt="Live Session" fill sizes="(max-width: 256px) 100vw, 256px" className="object-cover z-0" />
               
               <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                 <RadioIcon className="w-3 h-3" /> LIVE
               </div>
               <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 shadow-lg">
                 👁 4.2k
               </div>

               {/* Live Chat Overlay */}
               <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 p-4 flex flex-col justify-end gap-2">
                 
                 <div className="flex items-start gap-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-xl border border-white/5 shadow-sm transform hover:scale-105 transition-transform origin-bottom-left cursor-pointer">
                   <div className="w-6 h-6 rounded-full bg-orange-400 overflow-hidden shrink-0 flex items-center justify-center relative border border-white/10">
                     <span className="text-[10px] font-bold text-white">C</span>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-white/80">Celia Frias</p>
                     <p className="text-[10px] text-white">Mine po yong japanese bowl!! ✨</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-xl border border-white/5 shadow-sm transform hover:scale-105 transition-transform origin-bottom-left cursor-pointer">
                   <div className="w-6 h-6 rounded-full bg-accent/80 overflow-hidden shrink-0 flex items-center justify-center relative border border-white/10">
                      <span className="text-[10px] font-bold text-white">M</span>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-accent/80 flex items-center gap-1">Mary E. <MessageCircleHeart className="w-2.5 h-2.5 text-rose-400" /></p>
                     <p className="text-[10px] text-white">Ang ganda naman po niyan madam 😍</p>
                   </div>
                 </div>

               </div>
             </div>
          </div>
        </section>

        {/* Japan Ceramics Ambient Header Component */}
        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl my-8">
           <Image priority={false} src="/images/Staff/thrift-stores.webp" alt="Ceramics Banner" fill className="object-cover opacity-60 mix-blend-luminosity" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#1a1512] to-transparent" />
           <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
             <h3 className="text-2xl font-bold text-white/90">Authentic Connections</h3>
             <p className="text-white/50 text-sm max-w-sm mt-1">Our dedicated assistants ensure top-quality pieces like our Japan ceramics make it directly to your home.</p>
           </div>
        </div>

        {/* Section 2: Shop Assistants */}
        {assistants.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <UsersIcon className="w-6 h-6 text-accent/80" />
                <h2 className="text-2xl font-bold text-white">Our Shop Assistants</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-40 h-10 relative opacity-40 rounded-lg overflow-hidden mix-blend-overlay hidden md:block">
                  <Image src="/images/Staff/japan.jpg" alt="Japan Decor" fill sizes="(max-width: 160px) 100vw, 160px" className="object-cover" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {assistants.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Delivery Partners */}
        {riders.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <TruckIcon className="w-6 h-6 text-orange-400/80" />
              <h2 className="text-2xl font-bold text-white">Our Delivery Partners</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {riders.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

// Inline Icons for semantic sections
function UsersIcon(props: React.ComponentProps<'svg'>) { ...props; return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function TruckIcon(props: React.ComponentProps<'svg'>) { ...props; return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> }
function RadioIcon(props: React.ComponentProps<'svg'>) { ...props; return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg> }
