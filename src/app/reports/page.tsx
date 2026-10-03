'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Download,
  Eye,
  PlusCircle,
  Calendar,
  Clock,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const { reports, scans, generateReport, addToast } = useApp();

  const handleDownloadPDF = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      type: 'success',
      title: 'Preparing PDF Export',
      message: `Opening print dialogue for ${reportId}.`,
    });
    router.push(`/reports/${reportId}`);
  };

  return (
    <DashboardLayout
      title="Security Reports"
      subtitle="Executive summaries and formal audit reports ready for stakeholders"
      actions={
        <Link href="/scans/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Run Assessment
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Available Reports</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {reports.length}
            </div>
            <span className="text-[11px] text-blue-600">Formal compliance audits</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Audit Standard</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              OWASP ASVS & CVSS
            </div>
            <span className="text-[11px] text-emerald-600">Standardized metrics</span>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase">AI Remediation</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              Included
            </div>
            <span className="text-[11px] text-purple-600">Actionable engineer guides</span>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Generated Security Assessment Reports"
            subtitle="Click View to inspect in-app preview or Download PDF to export formal audit"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Report ID</th>
                  <th className="py-3 px-6">Target Application</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-center">Findings</th>
                  <th className="py-3 px-6">Risk Rating</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/reports/${report.id}`)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {report.id}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                        {report.target}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {report.targetUrl}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {report.date}
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-slate-900">
                      {report.findingsCount}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <SeverityBadge severity={report.riskLevel} size="sm" />
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Ready
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/reports/${report.id}`}>
                          <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                            View Preview
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Download className="w-3.5 h-3.5 text-blue-600" />}
                          onClick={(e) => handleDownloadPDF(report.id, e)}
                        >
                          Download PDF
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
    </DashboardLayout>
  );
}
