'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { PlusCircle, Activity, ArrowRight, Server, Shield } from 'lucide-react';

export default function ScansListPage() {
  const router = useRouter();
  const { scans } = useApp();

  return (
    <DashboardLayout
      title="Security Assessments"
      subtitle="All configured active and completed assessment pipelines"
      actions={
        <Link href="/scans/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Assessment
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Scans</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {scans.filter((s) => s.status === 'Running').length}
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Multi-tool runners active</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Scans</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {scans.filter((s) => s.status === 'Completed').length}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Ready for review</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-rose-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">High Risk Scans</span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
              {scans.filter((s) => s.overallRisk === 'CRITICAL' || s.overallRisk === 'HIGH').length}
            </div>
            <span className="text-[11px] text-rose-600 font-medium">Critical attention needed</span>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="All Security Assessments"
            subtitle="Click on any scan to inspect detailed findings, pipeline stages, or telemetry logs"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Assessment ID</th>
                  <th className="py-3 px-6">Target Application</th>
                  <th className="py-3 px-6">Environment</th>
                  <th className="py-3 px-6 text-center">Findings</th>
                  <th className="py-3 px-6">Risk Rating</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                {scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (scan.status === 'Running') {
                        router.push(`/scans/${scan.id}/progress`);
                      } else {
                        router.push(`/scans/${scan.id}`);
                      }
                    }}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {scan.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {scan.targetName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {scan.targetUrl}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {scan.environment}
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-slate-900 text-sm">
                      {scan.findingsCount}
                    </td>
                    <td className="py-4 px-6">
                      <SeverityBadge
                        severity={
                          scan.overallRisk === 'CRITICAL'
                            ? 'Critical'
                            : scan.overallRisk === 'HIGH'
                            ? 'High'
                            : scan.overallRisk === 'MEDIUM'
                            ? 'Medium'
                            : 'Low'
                        }
                        size="sm"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={scan.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {scan.status === 'Running' ? (
                          <Link href={`/scans/${scan.id}/progress`}>
                            <Button variant="primary" size="sm">
                              Live Progress
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/scans/${scan.id}`}>
                            <Button variant="secondary" size="sm">
                              View Results
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
