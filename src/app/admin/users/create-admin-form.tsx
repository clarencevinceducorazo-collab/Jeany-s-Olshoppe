'use client';

import { useState, useTransition } from 'react';
import { createAdminUser } from '../actions';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreateAdminForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    
    startTransition(async () => {
      const response = await createAdminUser(formData);
      
      if (response?.error) {
         toast({
           variant: 'destructive',
           title: 'Error',
           description: response.error
         });
      } else {
         toast({
           title: 'Success!',
           description: 'Admin account successfully created.'
         });
         form.reset();
      }
    });
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white">Create New Admin</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-1">
          <label className="text-xs text-white/50 uppercase tracking-widest">First Name</label>
          <input name="first_name" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-white/50 uppercase tracking-widest">Last Name</label>
          <input name="last_name" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-white/50 uppercase tracking-widest">Email</label>
          <input name="email" type="email" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-white/50 uppercase tracking-widest">Password</label>
          <input name="password" type="password" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-white/50 uppercase tracking-widest">Role</label>
          <select name="role" defaultValue="admin" className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent">
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        
        <div className="md:col-span-2 flex justify-end mt-2">
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-2 bg-accent hover:bg-accent/80 text-background font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
          >
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Creating...</> : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
