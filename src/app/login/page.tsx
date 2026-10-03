'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/FormElements';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [email, setEmail] = useState('maria.tariq@secops.enterprise.org');
  const [password, setPassword] = useState('SecOps#2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome back, Maria Tariq. Session authorized.',
      });
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-white select-none">
      {/* Left Branding & Visual Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
        {/* Abstract background cybersecurity grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.4) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Glow decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              WebSec <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Scan • Analyze • Secure
            </p>
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Next-Generation Automated Security Platform</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            AI-Powered Web Security <br className="hidden lg:block" />
            Assessment Platform
          </h2>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Assess authorized web applications, prioritize security findings, and understand vulnerabilities through intelligent analysis and automated correlation.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">Multi-Tool Scans</p>
                <p className="text-[11px] text-slate-400">Nmap, OWASP ZAP & Python</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">Smart Correlation</p>
                <p className="text-[11px] text-slate-400">Deduplication & scoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-6">
          <span>Enterprise SecOps Standard v2.4</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Scanner Engines Online
          </span>
        </div>
      </div>

      {/* Right Login Card Section */}
      <div className="md:w-1/2 bg-white text-slate-900 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Enter your authorized security team credentials to access assessments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@enterprise.org"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <Checkbox
                label="Remember this device"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-semibold shadow-md shadow-blue-500/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to WebSec AI
            </Button>
          </form>

          {/* Demo Credentials Tip */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Default Analyst Demo Access:</span>
            <div className="font-mono text-[11px] text-slate-500">
              User: <span className="text-slate-800">maria.tariq@secops.enterprise.org</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Role: <span className="text-slate-800">Senior Security Analyst</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
