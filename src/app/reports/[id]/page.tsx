'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/Badge';
import { DonutChart } from '@/components/ui/Charts';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  Globe,
  FileCheck,
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = (params?.id as string) || 'REP-2026-0012';
  const { reports, findings, scans } = useApp();

  const report = reports.find((r) => r.id === reportId) || reports[0];
  const scan = scans.find((s) => s.id === report.scanId) || scans[0];
  const reportFindings = findings.slice(0, 4);

  const handlePrint = () => {
    window.print();
  };

  const riskDistribution = [
    { label: 'Critical', count: 2, percentage: 8.7, color: '#dc2626' },
    { label: 'High', count: 6, percentage: 26.1, color: '#ea580c' },
    { label: 'Medium', count: 10, percentage: 43.5, color: '#f59e0b' },
    { label: 'Low', count: 5, percentage: 21.7, color: '#10b981' },
    { label: 'Informational', count: 0, percentage: 0, color: '#0284c7' },
  ];

  return (
    <DashboardLayout
      title={`Report Preview: ${report.id}`}
      subtitle={`Security assessment report compiled for ${report.target}`}
      actions={
        <div className="flex items-center gap-2 no-print">
          <Link href="/reports">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Reports
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Save as PDF
          </Button>
        </div>
      }
    >
      {/* Report Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-8 sm:p-12 space-y-10 font-sans print:border-none print:shadow-none print:p-0">
        {/* Document Header & Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-slate-900 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  WebSec <span className="text-blue-600">AI</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  Automated Security Assessment Platform
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 pt-3">
              Security Assessment Audit Report
            </h2>
            <p className="text-xs text-slate-500">
              Formal penetration assessment audit & AI-assisted remediation roadmap.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 shrink-0 min-w-56 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Report ID:</span>
              <span className="font-bold text-slate-900">{report.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scan Reference:</span>
              <span className="text-blue-600 font-bold">{report.scanId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Audit Date:</span>
              <span className="text-slate-700">{report.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Classification:</span>
              <span className="text-rose-600 font-bold">CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Section 1: Report Information */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            1. Target Assessment Scope
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Host</span>
              <span className="font-bold text-slate-900">{report.target}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Base URL</span>
              <span className="font-mono text-slate-700 truncate block">{report.targetUrl}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Scan Duration</span>
              <span className="font-bold text-slate-900">{report.duration}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Compliance Status</span>
              <span className="font-bold text-rose-600">Action Required</span>
            </div>
          </div>
        </div>

        {/* Section 2: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            2. Executive Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/30 p-5 rounded-xl border border-blue-100">
            {report.executiveSummary} Automated testing engines identified multiple unconstrained SQL injection and Cross-Site Scripting attack vectors capable of resulting in total tenant credential extraction and administrative account takeover. Immediate isolation and patching are advised.
          </p>
        </div>

        {/* Section 3: Risk Overview Chart */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            3. Risk Posture & Severity Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-slate-200 bg-slate-50/40">
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Overall Risk Assessment
              </span>
              <div className="text-4xl font-black text-rose-600 mt-1">
                {report.riskLevel.toUpperCase()}
              </div>
              <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                Score: {report.riskScore} / 10
              </div>
              <p className="text-xs text-slate-500 mt-2">
                CVSS v3.1 standard environmental and base impact rating.
              </p>
            </div>
            <div className="md:col-span-7">
              <DonutChart
                categories={riskDistribution}
                totalLabel={String(report.findingsCount)}
                totalSubtext="Total Findings"
                size={160}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Detailed Findings & Technical Evidence */}
        <div className="space-y-6 print-page-break">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            4. Confirmed Technical Findings & Evidence
          </h3>

          <div className="space-y-6">
            {reportFindings.map((f, i) => (
              <div key={f.id} className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{i + 1}
                    </span>
                    <SeverityBadge severity={f.severity} size="sm" />
                    <h4 className="text-base font-bold text-slate-900">{f.title}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    CVSS: {f.riskScore.toFixed(1)}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div>Endpoint: <span className="text-slate-900 font-semibold">{f.endpoint}</span></div>
                  <div>Source Scanner: <span className="text-blue-600 font-semibold">{f.source}</span></div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Vulnerability Description:
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Technical Scanner Evidence:
                  </h5>
                  <CodeBlock code={f.evidence} title={`Scanner Proof: ${f.source}`} />
                </div>

                <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-900 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    AI Remediation Guidance:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {f.aiExplanation}
                  </p>
                  <ul className="space-y-1 pt-1 font-sans">
                    {f.aiRemediation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer Signoff */}
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <span>Generated by WebSec AI Security Engine</span>
          <span>Lead Analyst: Maria Tariq</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
