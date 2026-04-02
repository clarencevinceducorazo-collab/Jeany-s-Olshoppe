'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInWithFacebook } from '@/lib/auth';

export function FacebookLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithFacebook();
      // It redirects to Facebook so we leave loading state true until page unloads
    } catch (err: any) {
      console.error('Facebook login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="relative flex h-12 w-full items-center justify-center rounded-md bg-[#1877F2] px-4 font-semibold text-white transition-colors hover:bg-[#166FE5] disabled:cursor-not-allowed disabled:opacity-70"
        type="button"
      >
        <div className="absolute left-4 flex h-6 w-6 items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
        </div>
        <span>{isLoading ? 'Connecting...' : 'Continue with Facebook'}</span>
      </button>
      
      {error && (
        <p className="text-sm text-destructive text-center mt-1 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
