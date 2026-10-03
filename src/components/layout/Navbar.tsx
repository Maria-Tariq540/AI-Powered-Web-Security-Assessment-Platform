'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  onOpenMobileSidebar,
}) => {
  const { user, notifications, markNotificationAsRead, markAllNotificationsAsRead, setIsSearchOpen } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/70 text-slate-500 text-xs border border-slate-200 transition-colors"
          title="Search targets, findings, scans (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Search assessments...</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setNotifDropdownOpen((prev) => !prev);
              setUserDropdownOpen(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        !item.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.type === 'scan_completed' && (
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'high_risk' && (
                          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'report_ready' && (
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileCheck className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">
                          {item.timestamp}
                        </span>
                      </div>

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/settings?tab=notifications"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs font-medium text-slate-600 hover:text-blue-600"
                >
                  Notification Preferences →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Documentation / Help Trigger */}
        <Link
          href="/settings?tab=help"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Security Assessment Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setUserDropdownOpen((prev) => !prev);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/30">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 block truncate font-medium">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> 2FA Authenticated
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings?tab=profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </Link>
                <Link
                  href="/settings?tab=help"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Help & Documentation
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
