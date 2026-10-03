'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  History,
  Crosshair,
  AlertOctagon,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  BrainCircuit,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, findings, scans } = useApp();

  const activeFindingsCount = findings.filter((f) => f.status === 'Open').length;
  const runningScansCount = scans.filter((s) => s.status === 'Running').length;

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'New Scan',
      href: '/scans/new',
      icon: <PlusCircle className="w-5 h-5 shrink-0" />,
      badge: runningScansCount > 0 ? `${runningScansCount} active` : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      label: 'Scan History',
      href: '/scan-history',
      icon: <History className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Targets',
      href: '/targets',
      icon: <Crosshair className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Findings',
      href: '/findings',
      icon: <AlertOctagon className="w-5 h-5 shrink-0" />,
      badge: activeFindingsCount > 0 ? `${activeFindingsCount}` : undefined,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      label: 'Risk Analysis',
      href: '/risk-analysis',
      icon: <Layers className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'AI Insights',
      href: '/ai-analysis',
      icon: <BrainCircuit className="w-5 h-5 shrink-0 text-cyan-400" />,
      highlight: true,
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <FileText className="w-5 h-5 shrink-0" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800/80 transition-all duration-300 ease-in-out select-none
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-white tracking-tight leading-tight flex items-center gap-1.5">
                  WebSec <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Scan • Analyze • Secure
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                  ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <span className={`${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                        <Sparkles className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Sidebar */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Help link */}
          <Link
            href="/settings?tab=help"
            title={collapsed ? 'Help & Support' : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Help & Docs</span>}
          </Link>

          {/* User profile bar */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/20 shrink-0">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
              </div>
            )}
            {!collapsed && (
              <Link
                href="/login"
                title="Sign Out"
                className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
