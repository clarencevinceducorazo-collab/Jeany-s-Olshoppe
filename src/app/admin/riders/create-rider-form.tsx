'use client';

import { useState } from 'react';
import { createRiderUser } from '../actions';
import { Bike } from 'lucide-react';

export function CreateRiderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    
    // Server action
    const response = await createRiderUser(formData);
    
    if (response?.error) {
       setError(response.error);
    } else {
       setSuccess('Rider successfully registered!');
       e.currentTarget.reset();
       // Refresh list
       window.location.reload();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Bike className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white">Register Delivery Rider</h2>
      </div>
      
      {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-sm mb-4 border border-green-500/20">{success}</div>}

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
          <label className="text-xs text-white/50 uppercase tracking-widest">Phone Number</label>
          <input name="phone" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        <div className="grid gap-1 md:col-span-2">
          <label className="text-xs text-white/50 uppercase tracking-widest">Password</label>
          <input name="password" type="password" required className="bg-black/40 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-accent" />
        </div>
        
        <div className="md:col-span-2 flex justify-end mt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent hover:bg-accent/80 text-background font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Rider'}
          </button>
        </div>
      </form>
    </div>
  );
}
