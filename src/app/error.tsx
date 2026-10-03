'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled platform error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-500 flex items-center justify-center mb-6 shadow-xl">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">
        Platform Exception
      </span>

      <h1 className="text-3xl font-black text-white tracking-tight mb-3">
        Something went wrong
      </h1>

      <p className="text-xs text-slate-400 max-w-md mb-8 leading-relaxed">
        An unexpected exception occurred while processing telemetry data. The error has been captured for audit review.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => reset()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Retry Action
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
