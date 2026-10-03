'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Drawer } from '@/components/ui/Drawer';
import { SeverityBadge, FindingStatusBadge } from '@/components/ui/Badge';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Tag,
  Crosshair,
  Server,
  Layers,
} from 'lucide-react';
import { FindingStatus } from '@/types';

export const FindingDetailsDrawer: React.FC = () => {
  const { selectedFinding, setSelectedFinding, updateFindingStatus } = useApp();

  if (!selectedFinding) return null;

  const handleStatusChange = (newStatus: FindingStatus) => {
    updateFindingStatus(selectedFinding.id, newStatus);
  };

  return (
    <Drawer
      isOpen={!!selectedFinding}
      onClose={() => setSelectedFinding(null)}
      width="xl"
      title={
        <div className="flex items-center gap-3">
          <SeverityBadge severity={selectedFinding.severity} size="lg" />
          <span className="text-lg font-bold text-slate-900">{selectedFinding.title}</span>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {selectedFinding.id}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-mono">{selectedFinding.endpoint}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Update Status:</span>
            {(['Open', 'In Review', 'Resolved', 'False Positive'] as FindingStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedFinding.status === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedFinding(null)}>
            Close
          </Button>
        </div>
      }
    >
      {/* Top Metadata Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Risk Score
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-600 font-mono">
              {selectedFinding.riskScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 10</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Status
          </span>
          <div className="mt-1">
            <FindingStatusBadge status={selectedFinding.status} />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Source Scanner
          </span>
          <span className="text-xs font-bold text-slate-800 mt-1.5 block">
            {selectedFinding.source}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Assessment ID
          </span>
          <span className="text-xs font-mono text-slate-700 mt-1.5 block truncate">
            {selectedFinding.scanId}
          </span>
        </div>
      </div>

      {/* Target Details */}
      <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-slate-600">Target Application:</span>
          <span className="font-semibold text-slate-900">{selectedFinding.target}</span>
        </div>
        <span className="font-mono text-slate-500">{selectedFinding.targetUrl}</span>
      </div>

      {/* Section 1: Description */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          Vulnerability Description
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          {selectedFinding.description}
        </p>
      </div>

      {/* Section 2: Why It Matters */}
      <div>
        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Why It Matters (Impact)
        </h4>
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-sm text-amber-950 leading-relaxed">
          {selectedFinding.whyItMatters}
        </div>
      </div>

      {/* Section 3: Technical Scanner Evidence */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-500" />
          Technical Evidence & Payload
        </h4>
        <CodeBlock
          code={selectedFinding.evidence}
          title={`Evidence from ${selectedFinding.source}`}
          language="http"
        />
        {selectedFinding.technicalDetails && (
          <p className="text-xs text-slate-500 font-mono mt-2 px-1">
            {selectedFinding.technicalDetails}
          </p>
        )}
      </div>

      {/* Section 4: AI Analysis & Remediation */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-b from-cyan-50/40 via-white to-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-cyan-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              AI Security Explanation
            </h4>
            <span className="text-[11px] text-cyan-700 font-medium">
              Evidence-based analysis & step-by-step remediation plan
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {selectedFinding.aiExplanation}
        </p>

        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Recommended Action Steps:
        </h5>
        <ul className="space-y-2">
          {selectedFinding.aiRemediation.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 5: Risk Scoring Rationale */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-slate-500" />
          Risk Scoring Rationale
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {selectedFinding.riskAnalysis}
        </p>
      </div>

      {/* CWE / CVE references */}
      {(selectedFinding.cwe || selectedFinding.cve) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          {selectedFinding.cve && (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              <Tag className="w-3.5 h-3.5" /> {selectedFinding.cve}
            </span>
          )}
          {selectedFinding.cwe && (
            <span className="text-xs text-slate-500">
              {selectedFinding.cwe}
            </span>
          )}
        </div>
      )}
    </Drawer>
  );
};
