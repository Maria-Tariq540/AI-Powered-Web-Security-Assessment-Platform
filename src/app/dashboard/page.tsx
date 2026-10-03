'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { TrendLineChart, DonutChart } from '@/components/ui/Charts';
import { useApp } from '@/context/AppContext';
import { trendData, riskDistributionData } from '@/lib/mockData';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Crosshair,
  PlusCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { scans, findings, targets } = useApp();

  const totalScans = scans.length + 19; // 24 total historical scans
  const totalFindings = 127;
  const highRiskFindings = 18;
  const mediumRiskFindings = 42;
  const lowRiskFindings = 67;
  const totalTargets = targets.length;

  return (
    <DashboardLayout
      title="Security Dashboard"
      subtitle="Overview of your security assessments and threat posture"
      actions={
        <Link href="/scans/new">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="shadow-sm"
          >
            New Scan
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Section 10: 6 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Scans */}
          <Card className="hover:border-slate-300 transition-all border-l-4 border-l-blue-600">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Scans
                </span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {totalScans}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                  +3 this week
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Multi-tool jobs</p>
            </CardContent>
          </Card>

          {/* Card 2: Total Findings */}
          <Card className="hover:border-slate-300 transition-all border-l-4 border-l-slate-800">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Findings
                </span>
                <AlertOctagon className="w-4 h-4 text-slate-700" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {totalFindings}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Normalized</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 8 targets</p>
            </CardContent>
          </Card>

          {/* Card 3: High/Critical Risk */}
          <Card className="hover:border-rose-300 transition-all border-l-4 border-l-rose-600 bg-rose-50/20">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  High Risk
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
                  {highRiskFindings}
                </span>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
                  Action Req
                </span>
              </div>
              <p className="text-[11px] text-rose-600/80 mt-1">Critical & High CVSS</p>
            </CardContent>
          </Card>

          {/* Card 4: Medium Risk */}
          <Card className="hover:border-amber-300 transition-all border-l-4 border-l-amber-500 bg-amber-50/15">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Medium Risk
                </span>
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
                  {mediumRiskFindings}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">43.5%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Headers & configs</p>
            </CardContent>
          </Card>

          {/* Card 5: Low Risk */}
          <Card className="hover:border-emerald-300 transition-all border-l-4 border-l-emerald-500 bg-emerald-50/15">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Low Risk
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
                  {lowRiskFindings}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">21.7%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recon & hardening</p>
            </CardContent>
          </Card>

          {/* Card 6: Targets */}
          <Card className="hover:border-slate-300 transition-all border-l-4 border-l-cyan-600">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Targets
                </span>
                <Crosshair className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {totalTargets}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">100% Authorized</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">In active registry</p>
            </CardContent>
          </Card>
        </div>

        {/* Section 11: Charts (Security Findings Trend + Risk Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Findings Trend Line Chart */}
          <Card className="lg:col-span-7">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Security Findings Trend</span>
                </div>
              }
              subtitle="Daily aggregated vulnerabilities identified across assessment cycles"
              action={
                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  Last 30 Days
                </span>
              }
            />
            <CardContent>
              <TrendLineChart data={trendData} height={230} />
            </CardContent>
          </Card>

          {/* Risk Distribution Donut Chart */}
          <Card className="lg:col-span-5">
            <CardHeader
              title="Risk Distribution"
              subtitle="Breakdown of normalized findings by severity rating"
              action={
                <Link
                  href="/risk-analysis"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Risk Matrix <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent className="flex items-center justify-center pt-2">
              <DonutChart
                categories={riskDistributionData}
                totalLabel="127"
                totalSubtext="Total Findings"
                size={180}
              />
            </CardContent>
          </Card>
        </div>

        {/* Section 12: Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/scans/new" className="group">
            <Card className="h-full border-blue-200 bg-gradient-to-br from-blue-50/60 to-white hover:border-blue-400 hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    New Scan
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Start an authorized multi-tool security assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/findings" className="group">
            <Card className="h-full hover:border-slate-300 hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    View Findings
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Review and triage detected security issues.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports" className="group">
            <Card className="h-full hover:border-slate-300 hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    View Reports
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Open executive summaries and generated PDF audits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/targets" className="group">
            <Card className="h-full hover:border-slate-300 hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Crosshair className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Manage Targets
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    View verified authorized assets and scopes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Section 11: Recent Scans Table */}
        <Card>
          <CardHeader
            title="Recent Security Assessments"
            subtitle="Latest multi-tool scans executed on authorized targets"
            action={
              <Link href="/scan-history">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All Scans
                </Button>
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Target</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-center">Findings</th>
                  <th className="py-3 px-6">Risk Rating</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {scans.slice(0, 5).map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (scan.status === 'Running') {
                        router.push(`/scans/${scan.id}/progress`);
                      } else {
                        router.push(`/scans/${scan.id}`);
                      }
                    }}
                  >
                    {/* Target */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {scan.targetName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate max-w-xs">
                        {scan.targetUrl}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-600 whitespace-nowrap">
                      {scan.startTime.split(' ')[0]} {scan.startTime.split(' ')[1]} {scan.startTime.split(' ')[2]}
                    </td>

                    {/* Findings */}
                    <td className="py-4 px-6 text-center">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {scan.findingsCount}
                      </span>
                    </td>

                    {/* Risk */}
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

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={scan.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {scan.status === 'Running' ? (
                          <Link href={`/scans/${scan.id}/progress`}>
                            <Button variant="primary" size="sm">
                              View Live Progress
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
