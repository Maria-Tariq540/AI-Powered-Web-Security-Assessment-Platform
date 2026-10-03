'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { StatusBadge } from '@/components/ui/Badge';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  StopCircle,
  Terminal,
  Activity,
  Layers,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';

export default function ScanProgressPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = (params?.id as string) || 'SCAN-2026-0015';
  const { scans, cancelScan, addToast } = useApp();

  const scan = scans.find((s) => s.id === scanId) || scans[1] || scans[0];

  const [progress, setProgress] = useState(scan.status === 'Completed' ? 100 : (scan.progress || 62));
  const [activeStageIdx, setActiveStageIdx] = useState(scan.status === 'Completed' ? 5 : 1);
  const [logs, setLogs] = useState(scan.logs && scan.logs.length > 0 ? scan.logs : [
    { id: '1', timestamp: '21:30:01', level: 'INFO' as const, stage: 'System', message: 'Assessment launched with verified credentials' },
    { id: '2', timestamp: '21:30:20', level: 'INFO' as const, stage: 'Nmap', message: 'Port 443/tcp open, TLS 1.3 negotiated' },
    { id: '3', timestamp: '21:30:45', level: 'SUCCESS' as const, stage: 'Nmap', message: 'Host discovery completed cleanly' },
    { id: '4', timestamp: '21:31:00', level: 'INFO' as const, stage: 'OWASP ZAP', message: 'Active scanning initiated for REST API endpoints' },
    { id: '5', timestamp: '21:32:04', level: 'WARN' as const, stage: 'OWASP ZAP', message: 'Insecure cookie flag detected on session tokens' },
  ]);

  // Live simulation ticker for progress demonstration
  useEffect(() => {
    if (progress >= 100) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [progress]);

  const pipelineStages = [
    {
      id: '1',
      title: 'Nmap — Network Discovery',
      tool: 'Nmap 7.94',
      description: 'Host discovery, open ports, OS fingerprinting',
      status: progress >= 30 ? 'Completed' : 'Running',
      time: '42s',
    },
    {
      id: '2',
      title: 'OWASP ZAP — Web Security Testing',
      tool: 'OWASP ZAP 2.14',
      description: 'Active spidering, injection and auth fuzzing',
      status: progress >= 65 ? 'Completed' : progress >= 30 ? 'Running' : 'Pending',
      time: progress >= 65 ? '1m 30s' : 'In Progress',
    },
    {
      id: '3',
      title: 'Custom Security Checks',
      tool: 'Python Suite',
      description: 'Proprietary BOLA, IDOR, sensitive file leakage checks',
      status: progress >= 80 ? 'Completed' : progress >= 65 ? 'Running' : 'Pending',
      time: progress >= 80 ? '38s' : '--',
    },
    {
      id: '4',
      title: 'Finding Processing',
      tool: 'Normalizer Engine',
      description: 'Deduplication across tools, CVSS v3.1 schema normalization',
      status: progress >= 90 ? 'Completed' : progress >= 80 ? 'Running' : 'Pending',
      time: progress >= 90 ? '14s' : '--',
    },
    {
      id: '5',
      title: 'Risk Analysis',
      tool: 'Correlation Matrix',
      description: 'Cross-tool exploit correlation and attack surface ranking',
      status: progress >= 96 ? 'Completed' : progress >= 90 ? 'Running' : 'Pending',
      time: progress >= 96 ? '12s' : '--',
    },
    {
      id: '6',
      title: 'AI Analysis',
      tool: 'GPT-4o Engine',
      description: 'Evidence-based impact explanation & code remediation synthesis',
      status: progress >= 100 ? 'Completed' : progress >= 96 ? 'Running' : 'Pending',
      time: progress >= 100 ? '22s' : '--',
    },
  ];

  const handleFastForwardComplete = () => {
    setProgress(100);
    addToast({
      type: 'success',
      title: 'Scan Pipeline Finished',
      message: 'All stages completed successfully. Results ready for inspection.',
    });
  };

  const handleCancel = () => {
    cancelScan(scan.id);
    router.push('/dashboard');
  };

  return (
    <DashboardLayout
      title="Security Assessment in Progress"
      subtitle={`Live orchestration pipeline for ${scan.targetName}`}
      actions={
        <div className="flex items-center gap-2">
          {progress < 100 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFastForwardComplete}
              leftIcon={<Zap className="w-4 h-4 text-amber-500" />}
            >
              Simulate Completion
            </Button>
          )}
          {progress < 100 ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              leftIcon={<StopCircle className="w-4 h-4" />}
            >
              Cancel Scan
            </Button>
          ) : (
            <Link href={`/scans/${scan.id}`}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View Assessment Results
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Metadata Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{scan.targetName}</h2>
                <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                  {scan.id}
                </span>
                <StatusBadge status={progress >= 100 ? 'Completed' : 'Running'} size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{scan.targetUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 border-t md:border-t-0 pt-3 md:pt-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Environment</span>
              <span className="font-semibold text-slate-800">{scan.environment}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Started</span>
              <span className="font-semibold text-slate-800">{scan.startTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Remaining</span>
              <span className="font-mono font-bold text-blue-600">
                {progress >= 100 ? '0s' : '2 minutes'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Display & Pipeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section 19: Large Circular Progress Indicator Card */}
          <Card className="lg:col-span-4 flex flex-col items-center justify-center p-8 text-center">
            <ProgressCircle
              progress={progress}
              size={200}
              strokeWidth={14}
              statusText={progress >= 100 ? 'Completed' : 'Scanning...'}
              subtitle={progress >= 100 ? 'All 6 stages verified' : 'Estimated: 2 minutes remaining'}
            />

            <div className="mt-6 w-full pt-6 border-t border-slate-100 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Findings Identified:</span>
                <span className="font-mono font-bold text-slate-900">{scan.findingsCount || 14}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Scanner:</span>
                <span className="font-semibold text-blue-600">
                  {progress >= 100 ? 'Pipeline Finished' : 'OWASP ZAP 2.14.0'}
                </span>
              </div>
            </div>

            {progress >= 100 && (
              <div className="mt-5 w-full">
                <Link href={`/scans/${scan.id}`} className="w-full block">
                  <Button variant="primary" className="w-full">
                    View Results Overview →
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Section 20 & 21: Scan Pipeline Stages */}
          <Card className="lg:col-span-8">
            <CardHeader
              title="Execution Pipeline"
              subtitle="Sequential multi-tool analysis workflow stages"
              action={
                <span className="text-xs font-mono text-slate-500">
                  Stage {Math.min(6, Math.floor((progress / 100) * 6) + 1)} of 6
                </span>
              }
            />
            <CardContent className="space-y-3">
              {pipelineStages.map((stage, idx) => {
                const isCompleted = stage.status === 'Completed';
                const isRunning = stage.status === 'Running';
                const isPending = stage.status === 'Pending';

                return (
                  <div
                    key={stage.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isRunning
                        ? 'border-blue-400 bg-blue-50/30 shadow-xs'
                        : isCompleted
                        ? 'border-emerald-200/80 bg-emerald-50/15'
                        : 'border-slate-200 bg-slate-50/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* State icon */}
                      <div className="shrink-0">
                        {isCompleted && (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        {isRunning && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-spin">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                        )}
                        {isPending && (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            Stage {idx + 1}: {stage.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {stage.tool}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
                        {stage.time}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                      {isRunning && (
                        <span className="text-xs font-semibold text-blue-600 animate-pulse">
                          In Progress...
                        </span>
                      )}
                      {isPending && (
                        <span className="text-xs font-medium text-slate-400">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Live Execution Console Stream */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Live Scanner Telemetry Stream</span>
              </div>
            }
            subtitle="Standard out telemetry captured directly from scanner processes"
          />
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 rounded-b-xl max-h-56 overflow-y-auto space-y-1.5 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`font-semibold shrink-0 uppercase text-[10px] px-1 rounded ${
                    log.level === 'WARN'
                      ? 'bg-amber-900/60 text-amber-300'
                      : log.level === 'SUCCESS'
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : log.level === 'ERROR'
                      ? 'bg-rose-900/60 text-rose-300'
                      : 'bg-blue-900/60 text-blue-300'
                  }`}
                >
                  {log.stage}
                </span>
                <span
                  className={
                    log.level === 'WARN'
                      ? 'text-amber-200'
                      : log.level === 'SUCCESS'
                      ? 'text-emerald-200'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>Awaiting next stdout chunk from active runner...</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
