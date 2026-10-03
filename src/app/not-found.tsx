'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 mb-6 shadow-xl">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="font-mono text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The requested resource, security assessment report, or endpoint could not be found or has been decommissioned.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
        <Link href="/scans">
          <Button variant="outline" size="md">
            View All Scans
          </Button>
        </Link>
      </div>
    </div>
  );
}
