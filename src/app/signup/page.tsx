'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/FormElements';
import { useApp } from '@/context/AppContext';

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPolicy) {
      addToast({
        type: 'warning',
        title: 'Policy Acceptance Required',
        message: 'You must agree to the Terms and Security Assessment Policy.',
      });
      return;
    }
    if (password !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'The confirmed password does not match.',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Account Created Successfully',
        message: 'Welcome to WebSec AI. Please log in.',
      });
      router.push('/login');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-md">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Analyst Account</h1>
          <p className="text-xs text-slate-500">
            Join WebSec AI to run authorized multi-tool vulnerability assessments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Maria Tariq"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Work Email"
            type="email"
            required
            placeholder="analyst@enterprise.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="pt-2">
            <Checkbox
              label="I agree to the Terms and Security Assessment Policy"
              description="I certify that I will only perform assessments against systems for which I hold explicit authorization."
              checked={agreedPolicy}
              onChange={(e) => setAgreedPolicy(e.target.checked)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={!agreedPolicy}
            className="w-full text-sm font-semibold shadow-md shadow-blue-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
