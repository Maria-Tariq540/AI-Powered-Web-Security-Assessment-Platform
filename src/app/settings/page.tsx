'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox } from '@/components/ui/FormElements';
import { useApp } from '@/context/AppContext';
import {
  User,
  Shield,
  Bell,
  Sliders,
  BrainCircuit,
  HelpCircle,
  Key,
  Smartphone,
  Save,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'assessment' | 'ai' | 'help'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Notification toggles
  const [notifScan, setNotifScan] = useState(user.notifications.scanCompleted);
  const [notifCritical, setNotifCritical] = useState(user.notifications.criticalFound);
  const [notifReport, setNotifReport] = useState(user.notifications.reportGenerated);

  // Assessment Defaults
  const [defaultScanType, setDefaultScanType] = useState(user.defaultScanType);
  const [defaultIntensity, setDefaultIntensity] = useState(user.defaultIntensity);

  // AI Provider
  const [aiProvider, setAiProvider] = useState(user.aiProvider);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      twoFactorEnabled: twoFactor,
      defaultScanType,
      defaultIntensity,
      aiProvider,
      notifications: {
        scanCompleted: notifScan,
        criticalFound: notifCritical,
        reportGenerated: notifReport,
      },
    });
  };

  return (
    <DashboardLayout
      title="Settings & Workspace Preferences"
      subtitle="Configure analyst profile, authentication policies, scanner engines, and AI models"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1">
          {[
            { id: 'profile', label: 'Analyst Profile', icon: <User className="w-4 h-4" /> },
            { id: 'security', label: 'Security & 2FA', icon: <Shield className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'assessment', label: 'Assessment Defaults', icon: <Sliders className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Configuration', icon: <BrainCircuit className="w-4 h-4 text-cyan-500" /> },
            { id: 'help', label: 'Architecture & Docs', icon: <HelpCircle className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Body */}
        <div className="md:col-span-9">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader
                title="Analyst Profile"
                subtitle="Your identity details displayed in reports and assessment logs"
              />
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white text-xl font-bold flex items-center justify-center ring-4 ring-blue-500/20 shadow-md">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                      <p className="text-xs text-slate-500">{user.role}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        Active Analyst Token
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Role & Assignment"
                    value={user.role}
                    disabled
                    helperText="Managed by Enterprise Workspace Administrator"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader
                  title="Two-Factor Authentication (2FA)"
                  subtitle="Enforce hardware tokens or TOTP authenticator app verification"
                />
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Authenticator App (TOTP)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Google Authenticator, Microsoft Authenticator, or Yubikey
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title="Change Password"
                  subtitle="Update your security analyst password"
                />
                <CardContent className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Minimum 12 characters with symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      addToast({
                        type: 'success',
                        title: 'Password Updated',
                        message: 'Analyst password changed successfully.',
                      });
                    }}
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader
                  title="Active Analyst Sessions"
                  subtitle="Devices currently authenticated to your workspace"
                />
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Windows 11 • Chrome 129 (Current Session)
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        IP: 192.168.1.104 • Islamabad, PK
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Now
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader
                title="Notification Triggers"
                subtitle="Choose events that send immediate dashboard alerts"
              />
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <Checkbox
                      label="Security Scan Completed"
                      description="Notify when multi-tool pipeline finishes execution and produces findings."
                      checked={notifScan}
                      onChange={(e) => setNotifScan(e.target.checked)}
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <Checkbox
                      label="Critical / High Severity Vulnerability Confirmed"
                      description="Immediate high-priority toast and bell indicator upon confirmed exploit."
                      checked={notifCritical}
                      onChange={(e) => setNotifCritical(e.target.checked)}
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <Checkbox
                      label="Formal Assessment Report Compiled"
                      description="Notify when executive summary and PDF artifact are ready for export."
                      checked={notifReport}
                      onChange={(e) => setNotifReport(e.target.checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="md" onClick={handleSaveProfile}>
                  Save Notification Preferences
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* TAB 4: ASSESSMENT PREFERENCES */}
          {activeTab === 'assessment' && (
            <Card>
              <CardHeader
                title="Assessment Defaults"
                subtitle="Standard defaults applied when launching new security scans"
              />
              <CardContent className="space-y-5">
                <Select
                  label="Default Scan Type"
                  value={defaultScanType}
                  onChange={(e) => setDefaultScanType(e.target.value as any)}
                  options={[
                    { label: 'Standard Assessment (Balanced multi-tool)', value: 'Standard Assessment' },
                    { label: 'Quick Discovery (Fast port & header scan)', value: 'Quick Discovery' },
                    { label: 'Full Pentest (Deep spidering & fuzzing)', value: 'Full Pentest' },
                  ]}
                />

                <Select
                  label="Default Intensity Level"
                  value={defaultIntensity}
                  onChange={(e) => setDefaultIntensity(e.target.value as any)}
                  options={[
                    { label: 'Basic — Fast lightweight checks', value: 'Basic' },
                    { label: 'Standard — Standard security baseline', value: 'Standard' },
                    { label: 'Comprehensive — Exhaustive checks & active tests', value: 'Comprehensive' },
                  ]}
                />
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="md" onClick={handleSaveProfile}>
                  Save Assessment Defaults
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* TAB 5: AI SETTINGS */}
          {activeTab === 'ai' && (
            <Card>
              <CardHeader
                title="AI Advisory Engine Configuration"
                subtitle="Select the LLM model responsible for evidence explanation and code remediation synthesis"
              />
              <CardContent className="space-y-5">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Advisory Sandbox Notice
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    AI models are used strictly downstream of scanner findings to analyze technical evidence, explain impacts in plain language, and produce remediation blueprints. Live API keys can be connected in the backend phase.
                  </p>
                </div>

                <Select
                  label="Configured AI Advisory Model"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as any)}
                  options={[
                    { label: 'GPT-4o Security Engine (Active SaaS Engine)', value: 'GPT-4o Security Engine' },
                    { label: 'Claude 3.5 Sonnet SecOps (Deep Code Remediation)', value: 'Claude 3.5 Sonnet SecOps' },
                    { label: 'Local DeepSeek-R1 (Air-Gapped Private Deployment)', value: 'Local DeepSeek-R1 (Air-Gapped)' },
                  ]}
                />

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Active Provider:</span>
                    <span className="font-bold text-slate-900">{aiProvider}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Prompt Architecture:</span>
                    <span className="font-mono text-blue-600">CVSS + Raw Evidence Prompt v2.1</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Air-Gapped Mode:</span>
                    <span className="text-emerald-700 font-semibold">Available for On-Premise</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="md" onClick={handleSaveProfile}>
                  Update AI Configuration
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* TAB 6: HELP & ARCHITECTURE */}
          {activeTab === 'help' && (
            <Card>
              <CardHeader
                title="Platform Architecture & User Flow"
                subtitle="Understanding the security pipeline from scanner to audit report"
              />
              <CardContent className="space-y-6 text-xs text-slate-700">
                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-center text-xs leading-loose">
                  Scanner → Findings → Processing → Risk → AI → Report
                </div>

                <div className="space-y-3 leading-relaxed">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Core Security Workflow Principles
                  </h4>
                  <p>
                    1. <strong>Authorized Scanning:</strong> Every target requires certified authorization confirmation before any network discovery or active web scans can be initiated.
                  </p>
                  <p>
                    2. <strong>Multi-Tool Assessment:</strong> Integrates Nmap for port/service reconnaissance, OWASP ZAP for web application fuzzing, and custom Python suites for headers, TLS, and authorization weaknesses.
                  </p>
                  <p>
                    3. <strong>Normalization & Deduplication:</strong> Eliminates duplicate findings from multiple scanner outputs and standardizes CVSS v3.1 scores.
                  </p>
                  <p>
                    4. <strong>AI-Guided Remediation:</strong> Ingests confirmed findings and generates human-readable explanations alongside verified code patches.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
