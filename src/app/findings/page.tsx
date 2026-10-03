'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, FindingStatusBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { Finding, FindingStatus, Severity } from '@/types';
import {
  AlertOctagon,
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function FindingsManagementPage() {
  const { findings, setSelectedFinding, updateFindingStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || f.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || f.source === sourceFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesSource;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('All');
    setStatusFilter('All');
    setSourceFilter('All');
  };

  return (
    <DashboardLayout
      title="Findings Management"
      subtitle="Centralized triage repository of security vulnerabilities detected across all targets"
    >
      <div className="space-y-6">
        {/* Status Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 border-l-4 border-l-rose-600 bg-rose-50/15">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Open Flaws</span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
              {findings.filter((f) => f.status === 'Open').length}
            </div>
            <span className="text-[10px] text-rose-600/80">Pending remediation</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/15">
            <span className="text-[11px] font-bold text-amber-700 uppercase">In Review</span>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              {findings.filter((f) => f.status === 'In Review').length}
            </div>
            <span className="text-[10px] text-amber-600/80">Engineering triage</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600 bg-emerald-50/15">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Resolved</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              {findings.filter((f) => f.status === 'Resolved').length}
            </div>
            <span className="text-[10px] text-emerald-600/80">Patch verified</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">False Positives</span>
            <div className="text-2xl font-bold font-mono text-slate-700 mt-1">
              {findings.filter((f) => f.status === 'False Positive').length}
            </div>
            <span className="text-[10px] text-slate-500">Excluded by rule</span>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search finding name, endpoint, target..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="False Positive">False Positive</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
              >
                <option value="All">All Scanners</option>
                <option value="OWASP ZAP">OWASP ZAP</option>
                <option value="Nmap">Nmap</option>
                <option value="HTTP Headers">HTTP Headers</option>
                <option value="TLS Check">TLS Check</option>
                <option value="Custom Check">Custom Check</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
              <span>
                Displaying <strong>{filteredFindings.length}</strong> of{' '}
                <strong>{findings.length}</strong> centralized finding records
              </span>
              {(searchQuery || severityFilter !== 'All' || statusFilter !== 'All' || sourceFilter !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Findings Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Severity</th>
                  <th className="py-3 px-6">Vulnerability Title</th>
                  <th className="py-3 px-6">Target Application</th>
                  <th className="py-3 px-6">Affected Endpoint</th>
                  <th className="py-3 px-6">Scanner Source</th>
                  <th className="py-3 px-6 text-center">Risk Score</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredFindings.map((finding) => (
                  <tr
                    key={finding.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedFinding(finding)}
                  >
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <SeverityBadge severity={finding.severity} size="sm" />
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                        {finding.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {finding.cve || finding.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 whitespace-nowrap text-slate-800 font-medium">
                      {finding.target}
                    </td>

                    <td className="py-3.5 px-6 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {finding.endpoint}
                    </td>

                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                        {finding.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900">
                        {finding.riskScore.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <FindingStatusBadge status={finding.status} />
                    </td>

                    <td className="py-3.5 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFinding(finding)}
                      >
                        Inspect
                      </Button>
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
