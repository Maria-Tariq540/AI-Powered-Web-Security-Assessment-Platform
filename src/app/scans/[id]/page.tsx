'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, StatusBadge, FindingStatusBadge } from '@/components/ui/Badge';
import { DonutChart } from '@/components/ui/Charts';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useApp } from '@/context/AppContext';
import { Finding, Severity, FindingStatus } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
  Globe,
  SlidersHorizontal,
  Download,
} from 'lucide-react';

export default function ScanResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = (params?.id as string) || 'SCAN-2026-0012';
  const { scans, findings, setSelectedFinding, generateReport } = useApp();

  const scan = scans.find((s) => s.id === scanId) || scans[0];

  // Tabs state: 1. Overview, 2. Findings, 3. Vulnerabilities, 4. Risk Analysis, 5. AI Insights, 6. Raw Results
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'vulnerabilities' | 'risk' | 'ai' | 'raw'>('overview');

  // Findings Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter findings for this scan (or all relevant mock findings)
  const scanFindings = findings.filter((f) => f.scanId === scan.id || scan.id === 'SCAN-2026-0012');

  const filteredFindings = scanFindings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || f.severity === severityFilter;
    const matchesSource = sourceFilter === 'All' || f.source === sourceFilter;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesSource && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('All');
    setSourceFilter('All');
    setStatusFilter('All');
  };

  const handleGenerateReport = () => {
    const reportId = generateReport(scan.id);
    router.push(`/reports/${reportId}`);
  };

  const riskDistribution = [
    { label: 'Critical', count: scan.criticalCount || 2, percentage: 8.7, color: '#dc2626' },
    { label: 'High', count: scan.highCount || 6, percentage: 26.1, color: '#ea580c' },
    { label: 'Medium', count: scan.mediumCount || 10, percentage: 43.5, color: '#f59e0b' },
    { label: 'Low', count: scan.lowCount || 5, percentage: 21.7, color: '#10b981' },
    { label: 'Informational', count: scan.infoCount || 0, percentage: 0, color: '#0284c7' },
  ];

  return (
    <DashboardLayout
      title="Security Assessment Results"
      subtitle={`${scan.targetName} • Scan ID: ${scan.id}`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            leftIcon={<Download className="w-4 h-4 text-blue-600" />}
          >
            Export Audit Report
          </Button>
          <Link href="/scans/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Re-scan Target
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Section 22: Results Header Summary Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-black text-slate-900">{scan.targetName}</h2>
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {scan.id}
              </span>
              <StatusBadge status={scan.status} size="sm" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{scan.targetUrl}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 border-t lg:border-t-0 pt-4 lg:pt-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assessment Date</span>
              <span className="font-semibold text-slate-800">{scan.startTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Duration</span>
              <span className="font-mono font-bold text-slate-800">{scan.duration}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Environment</span>
              <span className="font-semibold text-slate-800">{scan.environment}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Scan Intensity</span>
              <span className="font-semibold text-blue-600">{scan.intensity}</span>
            </div>
          </div>
        </div>

        {/* Section 23: Results Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Findings</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {scan.findingsCount}
            </div>
            <span className="text-[10px] text-slate-500">Across 6 modules</span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-red-700">Critical</span>
            <div className="text-2xl font-black text-red-600 font-mono mt-1">
              {scan.criticalCount}
            </div>
            <span className="text-[10px] text-red-600/80 font-medium">Immediate hotfix</span>
          </div>

          <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-orange-700">High Risk</span>
            <div className="text-2xl font-black text-orange-600 font-mono mt-1">
              {scan.highCount}
            </div>
            <span className="text-[10px] text-orange-600/80 font-medium">Remediate in sprint</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-amber-700">Medium</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">
              {scan.mediumCount}
            </div>
            <span className="text-[10px] text-amber-600/80">Configuration gaps</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-emerald-700">Low</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {scan.lowCount}
            </div>
            <span className="text-[10px] text-emerald-600/80">Informational notes</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-sky-700">Informational</span>
            <div className="text-2xl font-black text-sky-600 font-mono mt-1">
              {scan.infoCount}
            </div>
            <span className="text-[10px] text-sky-600/80">Recon telemetry</span>
          </div>
        </div>

        {/* Section 24: Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Overview' },
            { id: 'findings', label: `2. Findings (${scanFindings.length})` },
            { id: 'vulnerabilities', label: '3. Vulnerabilities' },
            { id: 'risk', label: '4. Risk Analysis' },
            { id: 'ai', label: '5. AI Insights' },
            { id: 'raw', label: '6. Raw Results' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Overall Risk Card */}
              <Card className="lg:col-span-5 border-l-4 border-l-rose-600">
                <CardHeader
                  title="Overall Risk Evaluation"
                  subtitle="Weighted score calculated from standardized CVSS v3.1 vector"
                />
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Threat Rating
                      </span>
                      <div className="text-3xl font-black text-rose-600 tracking-tight mt-0.5">
                        {scan.overallRisk}
                      </div>
                      <p className="text-xs text-rose-950 font-medium mt-1">
                        High risk of authentication bypass and unauthorized data extraction.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Risk Score
                      </span>
                      <div className="text-3xl font-black text-slate-900 font-mono">
                        {scan.riskScore} <span className="text-sm text-slate-400 font-normal">/ 10</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Normalized Vulnerabilities:</span>
                      <span className="font-bold text-slate-900">{scan.findingsCount}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Exploitable Flaws:</span>
                      <span className="font-bold text-rose-600">2 Verified</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Configuration Baselines Failed:</span>
                      <span className="font-bold text-amber-600">5 Checks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution Chart */}
              <Card className="lg:col-span-7">
                <CardHeader
                  title="Risk Distribution by Severity"
                  subtitle="Categorized breakdown of identified security findings"
                />
                <CardContent className="pt-2">
                  <DonutChart
                    categories={riskDistribution}
                    totalLabel={String(scan.findingsCount)}
                    totalSubtext="Total Findings"
                    size={175}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Top Vulnerabilities Section */}
            <Card>
              <CardHeader
                title="Top Priority Vulnerabilities"
                subtitle="High-impact findings requiring immediate remediation attention"
                action={
                  <button
                    onClick={() => setActiveTab('findings')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All {scanFindings.length} Findings →
                  </button>
                }
              />
              <div className="divide-y divide-slate-100">
                {scanFindings.slice(0, 5).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFinding(f)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <SeverityBadge severity={f.severity} size="sm" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {f.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                          <span>{f.endpoint}</span>
                          <span>•</span>
                          <span>Source: {f.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          Risk
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-900">
                          {f.riskScore.toFixed(1)}
                        </span>
                      </div>
                      <FindingStatusBadge status={f.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: FINDINGS TABLE & FILTERS */}
        {activeTab === 'findings' && (
          <div className="space-y-4">
            {/* Section 27: Finding Filters Bar */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search vulnerabilities, endpoints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  {/* Severity Filter */}
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Informational">Informational</option>
                  </select>

                  {/* Source Filter */}
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All">All Tool Sources</option>
                    <option value="OWASP ZAP">OWASP ZAP</option>
                    <option value="Nmap">Nmap</option>
                    <option value="HTTP Headers">HTTP Headers</option>
                    <option value="TLS Check">TLS Check</option>
                    <option value="Custom Check">Custom Check</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="False Positive">False Positive</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">
                    Showing <strong>{filteredFindings.length}</strong> of{' '}
                    <strong>{scanFindings.length}</strong> findings
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear All Filters
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Section 26: Findings Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-5">Severity</th>
                      <th className="py-3 px-5">Vulnerability / Title</th>
                      <th className="py-3 px-5">Endpoint</th>
                      <th className="py-3 px-5">Source</th>
                      <th className="py-3 px-5 text-center">Risk Score</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredFindings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No findings match the current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredFindings.map((finding) => (
                        <tr
                          key={finding.id}
                          onClick={() => setSelectedFinding(finding)}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <SeverityBadge severity={finding.severity} size="sm" />
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {finding.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {finding.cve || finding.id}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                            {finding.endpoint}
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                              {finding.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-center whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-900">
                              {finding.riskScore.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <FindingStatusBadge status={finding.status} />
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFinding(finding);
                              }}
                            >
                              Inspect Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: VULNERABILITIES (Categorized Overview) */}
        {activeTab === 'vulnerabilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scanFindings.map((f) => (
              <Card
                key={f.id}
                className="hover:border-slate-300 transition-all cursor-pointer"
                onClick={() => setSelectedFinding(f)}
              >
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={f.severity} size="sm" />
                      <span className="text-sm font-bold text-slate-900">{f.title}</span>
                    </div>
                  }
                  action={
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      Score: {f.riskScore.toFixed(1)}
                    </span>
                  }
                />
                <CardContent className="space-y-3 text-xs">
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {f.description}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-500 truncate">
                    Endpoint: {f.endpoint}
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1">
                    <span>Source: {f.source}</span>
                    <span className="text-blue-600 font-semibold group-hover:underline">
                      View Remediation →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 4: RISK ANALYSIS TAB */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Priority Threat Matrix"
                subtitle="Vulnerabilities arranged by exploitability, asset sensitivity, and impact"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-5">Vulnerability</th>
                      <th className="py-3 px-5">Severity</th>
                      <th className="py-3 px-5">Risk Score</th>
                      <th className="py-3 px-5">Source</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Priority Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {scanFindings.map((f) => (
                      <tr
                        key={f.id}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedFinding(f)}
                      >
                        <td className="py-3 px-5 font-semibold text-slate-900">{f.title}</td>
                        <td className="py-3 px-5">
                          <SeverityBadge severity={f.severity} size="sm" />
                        </td>
                        <td className="py-3 px-5 font-mono font-bold">{f.riskScore.toFixed(1)}</td>
                        <td className="py-3 px-5 font-mono">{f.source}</td>
                        <td className="py-3 px-5">
                          <FindingStatusBadge status={f.status} />
                        </td>
                        <td className="py-3 px-5">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                              f.priority.includes('Critical')
                                ? 'bg-red-100 text-red-800'
                                : f.priority.includes('High')
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {f.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: AI INSIGHTS */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">AI Transparency Notice:</strong>
                AI analyzes confirmed scanner findings and does not independently perform vulnerability scanning. Insights provide contextual risk explanations and validated code fixes.
              </div>
            </div>

            <div className="space-y-4">
              {scanFindings.slice(0, 3).map((f) => (
                <Card key={f.id} className="border-l-4 border-l-cyan-500">
                  <CardHeader
                    title={
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={f.severity} size="sm" />
                        <span className="font-bold text-slate-900">{f.title}</span>
                      </div>
                    }
                    subtitle={`Endpoint: ${f.endpoint} • Source: ${f.source}`}
                  />
                  <CardContent className="space-y-4 text-xs">
                    <div>
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                        AI Context Explanation
                      </h5>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        {f.aiExplanation}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Prioritized Remediation Actions:
                      </h5>
                      <ul className="space-y-1.5">
                        {f.aiRemediation.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: RAW RESULTS */}
        {activeTab === 'raw' && (
          <div className="space-y-4">
            <Card>
              <CardHeader
                title="Raw Telemetry Output"
                subtitle="Direct parser output from ZAP active scanner, Nmap XML output, and Python headers suite"
              />
              <CardContent className="space-y-4">
                <CodeBlock
                  code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nmaprun>
<nmaprun scanner="nmap" args="nmap -sV -sC -Pn -p 22,80,443,3000,8080 juice-shop.local" start="1727828530" version="7.94">
<host starttime="1727828530" endtime="1727828572">
<status state="up" reason="user-set"/>
<address addr="192.168.1.104" addrtype="ipv4"/>
<ports>
  <port protocol="tcp" portid="22"><state state="open" reason="syn-ack"/><service name="ssh" product="OpenSSH" version="7.4p1"/></port>
  <port protocol="tcp" portid="80"><state state="open" reason="syn-ack"/><service name="http" product="Apache httpd" version="2.4.29"/></port>
  <port protocol="tcp" portid="3000"><state state="open" reason="syn-ack"/><service name="http" product="Node.js Express framework"/></port>
</ports>
</host>
</nmaprun>`}
                  title="Nmap XML Parser Output"
                  language="xml"
                />

                <CodeBlock
                  code={`{
  "site": "http://juice-shop.local",
  "alerts": [
    {
      "pluginId": "40018",
      "alert": "SQL Injection",
      "riskcode": "3",
      "confidence": "2",
      "risk": "High",
      "url": "http://juice-shop.local/rest/user/login",
      "param": "email",
      "attack": "' OR 1=1 --",
      "evidence": "admin@juice-sh.op"
    }
  ]
}`}
                  title="OWASP ZAP Alerts JSON Dump"
                  language="json"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
