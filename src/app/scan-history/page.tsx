'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import {
  History,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  Calendar,
  Globe,
  Download,
} from 'lucide-react';

export default function ScanHistoryPage() {
  const router = useRouter();
  const { scans } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetFilter, setTargetFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const targetsList = Array.from(new Set(scans.map((s) => s.targetName)));

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTarget = targetFilter === 'All' || scan.targetName === targetFilter;
    const matchesRisk =
      riskFilter === 'All' ||
      scan.overallRisk.toLowerCase() === riskFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || scan.status === statusFilter;

    return matchesSearch && matchesTarget && matchesRisk && matchesStatus;
  });

  return (
    <DashboardLayout
      title="Scan History"
      subtitle="Complete chronological audit log of all security assessments"
      actions={
        <Link href="/scans/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Assessment
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filters Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search scan ID, target URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Targets</option>
                {targetsList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Risk Ratings</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Running">Running</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
              <span>
                Showing <strong>{filteredScans.length}</strong> of{' '}
                <strong>{scans.length}</strong> historical assessment runs
              </span>
              {(searchQuery || targetFilter !== 'All' || riskFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTargetFilter('All');
                    setRiskFilter('All');
                    setStatusFilter('All');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan History Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Target Application</th>
                  <th className="py-3 px-6">Scan Type / Intensity</th>
                  <th className="py-3 px-6 text-center">Findings</th>
                  <th className="py-3 px-6">Risk Level</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredScans.map((scan) => (
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
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {scan.startTime.split(' ')[0]} {scan.startTime.split(' ')[1]} {scan.startTime.split(' ')[2]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {scan.duration}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {scan.targetName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                        {scan.targetUrl}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                        {scan.intensity} Assessment
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center font-mono font-bold text-slate-900 text-sm">
                      {scan.findingsCount}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
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

                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={scan.status} size="sm" />
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {scan.status === 'Running' ? (
                          <Link href={`/scans/${scan.id}/progress`}>
                            <Button variant="primary" size="sm">
                              Progress
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/scans/${scan.id}`}>
                            <Button variant="outline" size="sm">
                              Results
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
