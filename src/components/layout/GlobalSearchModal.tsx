'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Search,
  X,
  Crosshair,
  AlertOctagon,
  FileText,
  Activity,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { SeverityBadge } from '../ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, scans, findings, targets, reports } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTargets = q
    ? targets.filter((t) => t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q))
    : targets.slice(0, 3);

  const filteredFindings = q
    ? findings.filter((f) => f.title.toLowerCase().includes(q) || f.endpoint.toLowerCase().includes(q) || f.source.toLowerCase().includes(q))
    : findings.slice(0, 4);

  const filteredScans = q
    ? scans.filter((s) => s.id.toLowerCase().includes(q) || s.targetName.toLowerCase().includes(q))
    : scans.slice(0, 3);

  const filteredReports = q
    ? reports.filter((r) => r.id.toLowerCase().includes(q) || r.target.toLowerCase().includes(q))
    : reports.slice(0, 2);

  const hasResults =
    filteredTargets.length > 0 ||
    filteredFindings.length > 0 ||
    filteredScans.length > 0 ||
    filteredReports.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
        <div
          className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 transition-all text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Box */}
          <div className="relative border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search targets, findings, scans, or reports..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-sm sm:text-base text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {!hasResults ? (
              <div className="text-center py-10">
                <Shield className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No results found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching with terms like &quot;SQL&quot;, &quot;Juice Shop&quot;, &quot;SCAN&quot;, or &quot;ZAP&quot;
                </p>
              </div>
            ) : (
              <>
                {/* Findings Results */}
                {filteredFindings.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      Findings ({filteredFindings.length})
                    </div>
                    <div className="space-y-1">
                      {filteredFindings.map((finding) => (
                        <Link
                          key={finding.id}
                          href={`/findings#${finding.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <SeverityBadge severity={finding.severity} size="sm" />
                            <div className="truncate">
                              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate block">
                                {finding.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono truncate block">
                                {finding.endpoint} • {finding.source}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded ml-2 shrink-0">
                            {finding.riskScore.toFixed(1)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scans Results */}
                {filteredScans.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Scans & Assessments
                    </div>
                    <div className="space-y-1">
                      {filteredScans.map((scan) => (
                        <Link
                          key={scan.id}
                          href={`/scans/${scan.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              {scan.id}
                            </span>
                            <div>
                              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 block">
                                {scan.targetName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {scan.targetUrl} • {scan.findingsCount} findings
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Targets Results */}
                {filteredTargets.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" />
                      Targets
                    </div>
                    <div className="space-y-1">
                      {filteredTargets.map((target) => (
                        <Link
                          key={target.id}
                          href="/targets"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
                        >
                          <div>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 block">
                              {target.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {target.url} • {target.environment}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Authorized
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reports Results */}
                {filteredReports.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Reports
                    </div>
                    <div className="space-y-1">
                      {filteredReports.map((report) => (
                        <Link
                          key={report.id}
                          href={`/reports/${report.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
                        >
                          <div>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 block">
                              {report.target} Report ({report.id})
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Generated {report.date}
                            </span>
                          </div>
                          <span className="text-xs text-blue-600 font-medium">
                            Preview →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Navigation: Click or press Enter to navigate</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
