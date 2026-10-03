'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea, Checkbox } from '@/components/ui/FormElements';
import { SeverityBadge, EnvironmentBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { Target, Environment } from '@/types';
import {
  Crosshair,
  PlusCircle,
  Play,
  ShieldCheck,
  Trash2,
  ExternalLink,
  History,
  AlertTriangle,
  Globe,
  Server,
  Layers,
} from 'lucide-react';

export default function TargetsPage() {
  const router = useRouter();
  const { targets, addTarget, removeTarget, addToast } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // New Target Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [environment, setEnvironment] = useState<Environment>('Staging');
  const [description, setDescription] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorized) {
      addToast({
        type: 'warning',
        title: 'Authorization Certification Required',
        message: 'You must certify authorization before adding a target.',
      });
      return;
    }

    addTarget({
      name,
      url,
      environment,
      description,
      authorized: true,
    });

    // Reset & close
    setName('');
    setUrl('');
    setDescription('');
    setAuthorized(false);
    setAddModalOpen(false);
  };

  const handleLaunchTargetScan = (targetUrl: string, targetName: string, env: Environment) => {
    router.push(`/scans/new?targetUrl=${encodeURIComponent(targetUrl)}&targetName=${encodeURIComponent(targetName)}&env=${env}`);
  };

  return (
    <DashboardLayout
      title="Authorized Targets"
      subtitle="Registry of verified web applications approved for security testing"
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={() => setAddModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add Target
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Authorized Assets</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {targets.length} Hosts
            </div>
            <span className="text-[11px] text-blue-600 font-medium">100% written authorization</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Production Scopes</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {targets.filter((t) => t.environment === 'Production').length}
            </div>
            <span className="text-[11px] text-purple-600 font-medium">Strict rate-limiting applied</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Scans Underway</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {targets.filter((t) => t.status === 'Under Scan').length}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Telemetry streaming</span>
          </Card>
        </div>

        {/* Targets Table Card */}
        <Card>
          <CardHeader
            title="Registered Target Directory"
            subtitle="Manage authorized hosts, environment tiers, and on-demand assessment execution"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Target Name</th>
                  <th className="py-3 px-6">URL / Host</th>
                  <th className="py-3 px-6">Environment</th>
                  <th className="py-3 px-6">Authorization</th>
                  <th className="py-3 px-6">Last Scan</th>
                  <th className="py-3 px-6">Risk Level</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {targets.map((target) => (
                  <tr key={target.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Target Name */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>{target.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {target.id}
                      </div>
                    </td>

                    {/* URL */}
                    <td className="py-4 px-6 font-mono text-slate-700">
                      <a
                        href={target.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline"
                      >
                        {target.url}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>

                    {/* Environment */}
                    <td className="py-4 px-6">
                      <EnvironmentBadge env={target.environment} />
                    </td>

                    {/* Authorization */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Certified
                      </span>
                    </td>

                    {/* Last Scan */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {target.lastScanDate}
                      </span>
                      {target.lastScanId && (
                        <Link
                          href={`/scans/${target.lastScanId}`}
                          className="font-mono text-[10px] text-blue-600 hover:underline"
                        >
                          {target.lastScanId}
                        </Link>
                      )}
                    </td>

                    {/* Risk */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {target.riskLevel !== 'None' ? (
                        <SeverityBadge severity={target.riskLevel as any} size="sm" />
                      ) : (
                        <span className="text-slate-400 text-xs">Unassessed</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleLaunchTargetScan(target.url, target.name, target.environment)}
                          leftIcon={<Play className="w-3 h-3 fill-white" />}
                        >
                          Scan
                        </Button>
                        <Link href="/scan-history">
                          <Button variant="outline" size="sm" title="Scan History">
                            <History className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTargetId(target.id)}
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 p-1.5"
                          title="Remove Target"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Section 40: Add Target Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Authorized Target"
        description="Register an authorized web application for recurring or on-demand vulnerability assessments."
        size="lg"
      >
        <form onSubmit={handleCreateTarget} className="space-y-4">
          <Input
            label="Target Application Name *"
            placeholder="e.g. Customer Portal Staging"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Base URL / Host *"
            placeholder="https://staging.app.example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            leftIcon={<Globe className="w-4 h-4" />}
            required
            helperText="Include protocol (http:// or https://)"
          />

          <Select
            label="Environment Tier *"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            options={[
              { label: 'Staging', value: 'Staging' },
              { label: 'Development', value: 'Development' },
              { label: 'Testing / QA', value: 'Testing' },
              { label: 'Production', value: 'Production' },
            ]}
          />

          <Textarea
            label="Description & Scope Notes"
            placeholder="Describe business function, excluded sub-paths, or contact stakeholder..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <Checkbox
              label="I certify explicit written authorization to assess this target."
              description="I confirm this system complies with organizational vulnerability disclosure and testing policies."
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!authorized || !name || !url}
            >
              Add Authorized Target
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Target Deletion"
        description="Are you sure you want to decommission this target from active assessment scopes?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTargetId) removeTarget(deleteTargetId);
                setDeleteTargetId(null);
              }}
            >
              Decommission Target
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          This target will no longer appear in automated assessment pipelines. Historical scan reports will remain archived in Scan History.
        </p>
      </Modal>
    </DashboardLayout>
  );
}
