'use client'; 
 
import { useEffect } from 'react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Let's ensure it forcefully prints to browser console
    console.error("Caught by Error Boundary:", error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0a0807] text-white">
      <h2 className="text-3xl font-bold mb-4 text-red-500">Server Render Error</h2>
      <p className="mb-6 text-white/60">An exception occurred while trying to load the page.</p>

      <div className="bg-black/50 border border-red-500/30 p-6 rounded-lg w-full max-w-2xl break-words whitespace-pre-wrap">
        <p className="font-semibold text-red-400 mb-1">Error Message:</p>
        <p className="font-mono text-sm text-red-200 mb-4">{error.message || "Message redacted by Next.js Production mode."}</p>
        
        {error.digest && (
          <>
            <p className="font-semibold text-yellow-500 mb-1">Digest ID:</p>
            <p className="font-mono text-sm text-yellow-300 mb-4">{error.digest}</p>
          </>
        )}
        
        {error.stack && (
          <>
            <p className="font-semibold text-white/60 mb-1">Local Stack Trace (if available):</p>
            <pre className="font-mono text-xs text-white/40 bg-white/5 p-3 rounded">{error.stack}</pre>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="px-6 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium"
          onClick={() => reset()}
        >
          Attempt Recovery
        </button>
        <button
          className="px-6 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors font-medium"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}
