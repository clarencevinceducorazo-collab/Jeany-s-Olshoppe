'use client';

import { Trash2 } from 'lucide-react';
import { updateUserRole, deleteUser } from '../actions';
import { useState } from 'react';

export function UserRoleSelector({ person }: { person: { id: string, role: string } }) {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <select 
      name="role" 
      disabled={isUpdating}
      defaultValue={person.role}
      className={`bg-[#0a0807] border rounded px-2 py-1 text-xs uppercase tracking-wider outline-none focus:ring-1 focus:ring-red-400 disabled:opacity-50
        ${person.role === 'super_admin' ? 'border-red-400/50 text-red-400' : 
          person.role === 'admin' ? 'border-yellow-400/50 text-yellow-400' : 
          'border-white/10 text-white/50'}`}
      onChange={async (e) => {
        if(confirm(`Change this user's role to ${e.target.value}?`)) {
           setIsUpdating(true);
           await updateUserRole(person.id, e.target.value as any);
           window.location.reload();
        } else {
           // Reset back to original if cancelled
           e.target.value = person.role;
        }
      }}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="super_admin">Super Admin</option>
    </select>
  );
}

export function UserDeleteButton({ person }: { person: { id: string, role: string } }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <button 
      onClick={async () => {
        if(confirm("Are you sure? This will PERMANENTLY delete this user's account and all associated data.")) {
           setIsDeleting(true);
           await deleteUser(person.id);
        }
      }}
      disabled={person.role === 'super_admin' || isDeleting}
      title={person.role === 'super_admin' ? "Cannot delete other super admins" : "Delete permanently"} 
      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
