import { Metadata } from 'next';
import { UserCircle, Shield, Bike, Megaphone } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the dedicated people behind Jeany\'s Olshoppe.',
};

// API-Ready Data Structure
const TEAM_DATA = {
  host: {
    name: "Jeany Razo", // Assuming from context, can be adjusted if needed
    role: "Live Host / Seller",
    description: "The main speaker and seller during live selling sessions. Presents items, answers questions, and assists customers in real time. The Voice of Jeany's.",
    tag: "Host",
  },
  assistants: [
    { name: "Roberto Razo", role: "Operations Partner", tag: "(Admin) Representative", isAdmin: true },
    { name: "Rica Razo", role: "Customer Service Representative", tag: "(Admin)", isAdmin: true },
    { name: "Clarence Vince Razo", role: "Operations & Logistics Manager", tag: "(Admin)", isAdmin: true },
    { name: "Jing Acasio", role: "Live Support / Coordinator", tag: "Assistant", isAdmin: false },
    { name: "Liza Pascua", role: "Live Stream Assistant", tag: "Assistant", isAdmin: false },
    { name: "Kea Montemayor", role: "Live Stream Assistant", tag: "Assistant", isAdmin: false },
    { name: "Julie Ann Jimenez", role: "Live Stream Assistant", tag: "Assistant", isAdmin: false },
  ],
  delivery: [
    { name: "Christopher M. Velbis", role: "Long-Distance Delivery Rider", tag: "Rider" },
    { name: "Christopher G. Prestoza", role: "Long-Distance Delivery Rider", tag: "Rider" },
  ]
};

function MemberCard({ member, type }: { member: any, type: 'assistant' | 'rider' }) {
  const isAdmin = member.isAdmin;
  
  return (
    <div className="group relative flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300">
      {/* Role Badge */}
      <div className={`absolute top-4 right-4 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm
        ${isAdmin ? 'bg-rose-400/20 text-rose-300 border border-rose-400/30' : 
          type === 'rider' ? 'bg-orange-400/20 text-orange-300 border border-orange-400/30' : 
          'bg-accent/20 text-accent border border-accent/20'}
      `}>
        {isAdmin && <Shield className="w-3 h-3" />}
        {!isAdmin && type === 'rider' && <Bike className="w-3 h-3" />}
        {member.tag}
      </div>

      {/* Default Avatar */}
      <div className="w-24 h-24 rounded-full mb-4 bg-[#241e1b] flex items-center justify-center border-2 border-white/5 shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-300 relative">
         {member.avatarUrl ? (
           <Image src={member.avatarUrl} alt={member.name} fill className="object-cover" />
         ) : (
           <UserCircle className="w-12 h-12 text-white/20" />
         )}
      </div>

      <h3 className="text-white font-bold text-center text-lg">{member.name}</h3>
      <p className="text-white/50 text-sm text-center mt-1 font-medium">{member.role}</p>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#1a1512] pt-8 pb-32 md:pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Our Dedicated <span className="text-accent">Team</span></h1>
          <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto">
            Meet the hardworking people behind Jeany&apos;s Olshoppe ensuring you get the best Japan surplus quality delivered right to you.
          </p>
        </div>

        {/* Section 1: Live Host */}
        <section className="bg-gradient-to-br from-[#241e1b] to-black/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Megaphone className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1a1512] flex shrink-0 items-center justify-center border-4 border-accent/20 shadow-xl overflow-hidden relative">
               <UserCircle className="w-16 h-16 text-white/20" />
            </div>
            
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Live Host & Founder</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Host / Seller</h2>
              <p className="text-lg text-white/80 font-medium mb-3">The Voice of Jeany&apos;s</p>
              <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
                {TEAM_DATA.host.description}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Shop Assistants */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <UsersIcon className="w-6 h-6 text-white/60" />
            <h2 className="text-2xl font-bold text-white">Our Shop Assistants</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {TEAM_DATA.assistants.map((member, idx) => (
              <MemberCard key={idx} member={member} type="assistant" />
            ))}
          </div>
        </section>

        {/* Section 3: Delivery Partners */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <TruckIcon className="w-6 h-6 text-white/60" />
            <h2 className="text-2xl font-bold text-white">Our Delivery Partners</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM_DATA.delivery.map((member, idx) => (
              <MemberCard key={idx} member={member} type="rider" />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// Inline Icons for semantic sections
function UsersIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function TruckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
  );
}
