'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { TeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from './actions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'assistant',
    description: '',
    status: 'active',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        role: member.role,
        category: member.category,
        description: member.description || '',
        status: member.status,
        image_url: member.image_url || ''
      })
    } else {
      setEditingMember(null)
      setFormData({
        name: '', role: '', category: 'assistant', description: '', status: 'active', image_url: ''
      })
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMember(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const data = new FormData()
    data.append('name', formData.name)
    data.append('role', formData.role)
    data.append('category', formData.category)
    data.append('description', formData.description)
    data.append('status', formData.status)
    data.append('image_url', formData.image_url)
    if (imageFile) data.append('imageFile', imageFile)

    let res;
    if (editingMember) {
      res = await updateTeamMember(editingMember.id, data)
    } else {
      res = await createTeamMember(data)
    }

    if (res?.success) {
      router.refresh()
      closeModal()
    } else {
      alert(res?.error || "An error occurred.")
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently remove ${name}?`)) {
      const res = await deleteTeamMember(id)
      if (res.success) {
        setMembers(prev => prev.filter(m => m.id !== id))
        router.refresh()
      } else {
        alert(res.error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Team Roster</h2>
          <p className="text-sm text-white/50">Manage staff and live host displays across the platform.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-accent hover:bg-accent/80 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/40 uppercase bg-black/20 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Category & Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/30">No team members found in database. Load migrations?</td>
                </tr>
              ) : members.map((member) => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 overflow-hidden relative shrink-0">
                        {member.image_url ? (
                          <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="font-medium text-white group-hover:text-accent transition-colors">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-semibold uppercase tracking-wider text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 mr-2">{member.category}</span>
                     <span className="text-white/50">{member.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                      member.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => openModal(member)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(member.id, member.name)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1512] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 shrink-0">
               <h3 className="text-lg font-bold text-white">{editingMember ? 'Edit Staff Member' : 'New Team Member'}</h3>
               <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors" placeholder="e.g. John Doe" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">System Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors">
                    <option value="host">Live Host</option>
                    <option value="admin">Admin</option>
                    <option value="assistant">Assistant</option>
                    <option value="rider">Rider</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Display Role</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors" placeholder="e.g. Lead Assistant" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Short Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Optional background..."></textarea>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Profile Origin Image URL (Or Upload)</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors mb-2" placeholder="/images/Staff/name.jpg" />
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Account Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
                    <input type="radio" value="active" checked={formData.status === 'active'} onChange={e => setFormData({...formData, status: e.target.value})} className="accent-accent" />
                    <span className="group-hover:text-white transition-colors">Active Operations</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
                    <input type="radio" value="inactive" checked={formData.status === 'inactive'} onChange={e => setFormData({...formData, status: e.target.value})} className="accent-accent" />
                    <span className="group-hover:text-white transition-colors">Inactive / Suspended</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-accent hover:bg-accent/80 disabled:opacity-50 text-background rounded-lg text-sm font-medium transition-colors">
                  {isSubmitting ? 'Syncing...' : (editingMember ? 'Save Changes' : 'Draft Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
