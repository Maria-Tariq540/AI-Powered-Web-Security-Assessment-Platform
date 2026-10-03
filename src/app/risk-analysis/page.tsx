'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, FindingStatusBadge } from '@/components/ui/Badge';
import { DonutChart } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import { riskDistributionData } from '@/lib/mockData';
import {
  Layers,
  GitMerge,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from 'lucide-react';

export default function RiskAnalysisPage() {
  const { findings, correlations, setSelectedFinding } = useApp();

  return (
    <DashboardLayout
      title="Risk Analysis & Correlation"
      subtitle="Standardized CVSS v3.1 scoring, exploit prioritization, and multi-tool deduplication"
    >
      <div className="space-y-8">
        {/* Top Summary & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 border-l-4 border-l-rose-600">
            <CardHeader
              title="System-Wide Threat Exposure"
              subtitle="Aggregated risk calculation across all registered scopes"
            />
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Risk Level
                  </span>
                  <div className="text-3xl font-black text-rose-600">HIGH</div>
                  <span className="text-xs text-rose-900 font-medium">Critical focus needed</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Overall Score
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    7.8 <span className="text-sm font-normal text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>CVSS v3.1 Base Scoring:</span>
                  <span className="font-bold text-slate-900">Enforced</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Correlated Incidents:</span>
                  <span className="font-bold text-blue-600">2 Unified Clusters</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Noise Reduction Ratio:</span>
                  <span className="font-bold text-emerald-600">-28% Deduplication</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader
              title="Risk Distribution Matrix"
              subtitle="Severity distribution across active normalized security alerts"
            />
            <CardContent className="pt-2">
              <DonutChart
                categories={riskDistributionData}
                totalLabel="127"
                totalSubtext="Total Active Risks"
                size={175}
              />
            </CardContent>
          </Card>
        </div>

        {/* Section 35: CORRELATION SECTION (Key Platform Differentiation) */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-600 text-white">
                <GitMerge className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Multi-Tool Finding Correlation & Deduplication Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrates automatic cross-tool telemetry alignment between Nmap, OWASP ZAP, and Custom Python checks to eliminate noise and unify root cause analysis.
            </p>
          </div>

          <div className="space-y-4">
            {correlations.map((corr) => (
              <Card
                key={corr.id}
                className="border-2 border-blue-200/80 bg-gradient-to-br from-white via-blue-50/20 to-white shadow-xs overflow-hidden"
              >
                {/* Correlation Header */}
                <div className="px-6 py-3.5 bg-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-700 px-2 py-0.5 rounded text-cyan-300">
                      {corr.id}
                    </span>
                    <h3 className="text-sm font-bold">{corr.title}</h3>
                  </div>
                  <span className="text-xs text-cyan-300 font-mono bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-700">
                    {corr.deduplicationRatio}
                  </span>
                </div>

                <CardContent className="p-6 space-y-5">
                  {/* Two Source Tool Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source 1 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-blue-600" />
                          Source Scanner 1
                        </span>
                        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                          {corr.source1.tool}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{corr.source1.finding}</p>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-600 leading-snug">
                        {corr.source1.evidence}
                      </div>
                    </div>

                    {/* Source 2 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                          Source Scanner 2
                        </span>
                        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                          {corr.source2.tool}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{corr.source2.finding}</p>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-600 leading-snug">
                        {corr.source2.evidence}
                      </div>
                    </div>
                  </div>

                  {/* Common Issue & Consolidated Finding */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Common Underlying Vulnerability Root Cause
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {corr.commonIssue}
                    </p>
                    <div className="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        Consolidated Finding: <span className="text-emerald-700">{corr.consolidatedFinding}</span>
                      </span>
                      <span className="font-mono font-bold bg-white text-emerald-700 px-2.5 py-1 rounded border border-emerald-300">
                        Score: {corr.riskScore}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 34: Risk Table */}
        <Card>
          <CardHeader
            title="Prioritized Vulnerability Risk Register"
            subtitle="Normalized findings ranked in descending order of risk score"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Vulnerability</th>
                  <th className="py-3 px-6">Severity</th>
                  <th className="py-3 px-6 text-center">Risk Score</th>
                  <th className="py-3 px-6">Source</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Priority Level</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {findings.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedFinding(f)}
                  >
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                        {f.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {f.endpoint}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <SeverityBadge severity={f.severity} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-900">
                      {f.riskScore.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[11px]">
                      {f.source}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <FindingStatusBadge status={f.status} />
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
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
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <Button variant="outline" size="sm">
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
