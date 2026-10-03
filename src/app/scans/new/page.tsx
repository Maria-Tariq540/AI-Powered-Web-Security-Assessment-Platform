'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea, Checkbox } from '@/components/ui/FormElements';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { Environment, ScanIntensity } from '@/types';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  Info,
  Server,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Radio,
  FileCheck,
} from 'lucide-react';

export default function NewScanPage() {
  const router = useRouter();
  const { startNewScan, targets } = useApp();

  // Form State
  const [targetUrl, setTargetUrl] = useState('http://juice-shop.local');
  const [targetName, setTargetName] = useState('OWASP Juice Shop');
  const [environment, setEnvironment] = useState<Environment>('Staging');
  const [description, setDescription] = useState('Automated staging penetration assessment for quarterly vulnerability compliance.');

  // Authorization Checkboxes
  const [authConfirmed1, setAuthConfirmed1] = useState(false);
  const [authConfirmed2, setAuthConfirmed2] = useState(false);

  // Modules Selection
  const availableModules = [
    {
      id: 'Nmap Network Discovery',
      name: 'Nmap Network Discovery',
      description: 'Host discovery, open port enumeration, OS detection & service banner grabbing.',
      recommended: true,
    },
    {
      id: 'OWASP ZAP Web Security Scan',
      name: 'OWASP ZAP Web Security Scan',
      description: 'Active spidering, SQL injection, XSS, CSRF, and session testing.',
      recommended: true,
    },
    {
      id: 'HTTP Security Headers',
      name: 'HTTP Security Headers',
      description: 'Evaluates CSP, HSTS, X-Frame-Options, CORS, and cache controls.',
      recommended: true,
    },
    {
      id: 'TLS Configuration',
      name: 'TLS Configuration',
      description: 'Cipher strength, deprecated TLS 1.0/1.1 protocols, certificate expiration.',
      recommended: true,
    },
    {
      id: 'Information Leakage Checks',
      name: 'Information Leakage Checks',
      description: 'Detects exposed .git, backup archives, debug endpoints & stack traces.',
      recommended: true,
    },
    {
      id: 'Custom Security Checks',
      name: 'Custom Security Checks',
      description: 'Targeted Python rule suites for API Authorization (BOLA/IDOR) & business logic.',
      recommended: true,
    },
  ];

  const [selectedModules, setSelectedModules] = useState<string[]>([
    'Nmap Network Discovery',
    'OWASP ZAP Web Security Scan',
    'HTTP Security Headers',
    'TLS Configuration',
    'Information Leakage Checks',
    'Custom Security Checks',
  ]);

  const [scanIntensity, setScanIntensity] = useState<ScanIntensity>('Standard');

  // Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthorized = authConfirmed1 && authConfirmed2;

  const handleToggleModule = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
  };

  const handleSelectPreconfiguredTarget = (tUrl: string) => {
    const found = targets.find((t) => t.url === tUrl);
    if (found) {
      setTargetUrl(found.url);
      setTargetName(found.name);
      setEnvironment(found.environment);
      setDescription(found.description);
    }
  };

  const handleInitiateScan = () => {
    setIsSubmitting(true);
    const newScanId = startNewScan({
      targetUrl,
      targetName,
      environment,
      modules: selectedModules,
      intensity: scanIntensity,
      authorized: true,
    });

    setConfirmModalOpen(false);
    setIsSubmitting(false);
    router.push(`/scans/${newScanId}/progress`);
  };

  return (
    <DashboardLayout
      title="New Security Assessment"
      subtitle="Assess an authorized web application with multi-tool scanning and AI analysis"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Pre-fill quick selector */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <Server className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold">Quick Select from Authorized Targets:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {targets.slice(0, 3).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectPreconfiguredTarget(t.url)}
                className="bg-white hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 font-medium transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section 14: Target Information */}
        <Card>
          <CardHeader
            title="Target Information"
            subtitle="Specify the web application host and environment parameters"
          />
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Target URL *"
                placeholder="https://example.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
                helperText="Fully qualified domain name or IP address"
                required
              />

              <Input
                label="Target Name *"
                placeholder="Example Web Application"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                helperText="Human-readable identifier for reporting"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Environment *"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as Environment)}
                options={[
                  { label: 'Staging (Recommended)', value: 'Staging' },
                  { label: 'Development', value: 'Development' },
                  { label: 'Testing / QA', value: 'Testing' },
                  { label: 'Production (Caution)', value: 'Production' },
                ]}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Scan Intensity *</span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">
                    affects scan depth
                  </span>
                </label>
                <select
                  value={scanIntensity}
                  onChange={(e) => setScanIntensity(e.target.value as ScanIntensity)}
                  className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3.5 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Basic">Basic — Fast port scan & header inspection (~1 min)</option>
                  <option value="Standard">Standard — Full multi-tool assessment (~3-5 mins)</option>
                  <option value="Comprehensive">Comprehensive — Deep active spidering & heavy checks (~10 mins)</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Description / Scope Notes (Optional)"
              placeholder="Provide scope limitations, login test accounts, or specific exclusion rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Section 16: Scanning Modules Configuration */}
        <Card>
          <CardHeader
            title="Scanning Engine Configuration"
            subtitle="Select the security assessment modules to execute"
            action={
              <button
                type="button"
                onClick={() =>
                  setSelectedModules(
                    selectedModules.length === availableModules.length
                      ? []
                      : availableModules.map((m) => m.id)
                  )
                }
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                {selectedModules.length === availableModules.length
                  ? 'Deselect All'
                  : 'Select All Modules'}
              </button>
            }
          />
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableModules.map((module) => {
                const isChecked = selectedModules.includes(module.id);
                return (
                  <div
                    key={module.id}
                    onClick={() => handleToggleModule(module.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-blue-500/60 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{module.name}</h4>
                        {module.recommended && (
                          <span className="text-[10px] text-blue-600 font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {module.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2 mt-4">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Scan Intensity note:</strong> Selected intensity level ({scanIntensity}) directly balances scanner concurrency, crawling depth, and automated verification loops.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Section 15: Authorization Section (Mandatory Confirmation) */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 shadow-sm">
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <span>Authorization Confirmation</span>
              </div>
            }
            subtitle="Legal and ethical compliance certification required prior to initiating assessment"
          />
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <Checkbox
                id="auth-checkbox-1"
                label={
                  <span className="font-semibold text-slate-900">
                    I confirm that I have explicit, verifiable authorization to perform security testing on this target.
                  </span>
                }
                description="The target system is owned by my organization or explicit written consent has been granted for vulnerability assessment."
                checked={authConfirmed1}
                onChange={(e) => setAuthConfirmed1(e.target.checked)}
              />

              <div className="border-t border-slate-100 pt-3">
                <Checkbox
                  id="auth-checkbox-2"
                  label={
                    <span className="font-semibold text-slate-900">
                      I understand that unauthorized security testing is strictly prohibited by law and organizational policy.
                    </span>
                  }
                  description="All activity will be logged with cryptographic audit records and IP telemetry."
                  checked={authConfirmed2}
                  onChange={(e) => setAuthConfirmed2(e.target.checked)}
                />
              </div>
            </div>

            {!isAuthorized && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Both authorization checkboxes must be confirmed before assessment can start.</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Assessment will be assigned an audit tracking ID.</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!isAuthorized || selectedModules.length === 0 || !targetUrl}
              onClick={() => setConfirmModalOpen(true)}
              leftIcon={<Play className="w-4 h-4 fill-white" />}
              className="w-full sm:w-auto shadow-md shadow-blue-500/20 font-semibold"
            >
              Start Security Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Section 17: Scan Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Security Assessment"
        description="Please review target specifications and authorization before triggering automated scanners."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Play className="w-4 h-4 fill-white" />}
              onClick={handleInitiateScan}
            >
              Start Scan
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Application:</span>
              <span className="font-bold text-slate-900">{targetName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target URL:</span>
              <span className="font-mono text-blue-600">{targetUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Environment:</span>
              <span className="font-semibold text-slate-800">{environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scan Intensity:</span>
              <span className="font-semibold text-slate-800">{scanIntensity}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Selected Modules ({selectedModules.length}):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {selectedModules.map((m) => (
                <div
                  key={m}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-900 font-medium text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Explicit User Authorization Verified</span>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
