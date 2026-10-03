'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Scan,
  Finding,
  Target,
  Report,
  NotificationItem,
  CorrelationItem,
  UserProfile,
  FindingStatus,
  Environment,
  ScanIntensity,
} from '@/types';
import {
  initialScans,
  initialFindings,
  initialTargets,
  initialReports,
  initialNotifications,
  initialCorrelations,
  initialUserProfile,
  samplePipelineStages,
} from '@/lib/mockData';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  scans: Scan[];
  activeScanId: string | null;
  setActiveScanId: (id: string | null) => void;
  startNewScan: (config: {
    targetUrl: string;
    targetName: string;
    environment: Environment;
    modules: string[];
    intensity: ScanIntensity;
    authorized: boolean;
  }) => string;
  cancelScan: (scanId: string) => void;
  retryScan: (scanId: string) => void;
  targets: Target[];
  addTarget: (target: Omit<Target, 'id' | 'lastScanDate' | 'findingsCount' | 'riskLevel' | 'status'>) => void;
  removeTarget: (id: string) => void;
  findings: Finding[];
  updateFindingStatus: (id: string, status: FindingStatus) => void;
  selectedFinding: Finding | null;
  setSelectedFinding: (finding: Finding | null) => void;
  reports: Report[];
  generateReport: (scanId: string) => string;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  correlations: CorrelationItem[];
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [activeScanId, setActiveScanId] = useState<string | null>('SCAN-2026-0012');
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [correlations] = useState<CorrelationItem[]>(initialCorrelations);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Preferences Updated',
      message: 'Your profile settings have been saved successfully.',
    });
  };

  const startNewScan = (config: {
    targetUrl: string;
    targetName: string;
    environment: Environment;
    modules: string[];
    intensity: ScanIntensity;
    authorized: boolean;
  }): string => {
    const scanNum = scans.length + 13;
    const newId = `SCAN-2026-00${scanNum}`;

    const newScan: Scan = {
      id: newId,
      targetUrl: config.targetUrl,
      targetName: config.targetName || new URL(config.targetUrl.startsWith('http') ? config.targetUrl : `http://${config.targetUrl}`).hostname,
      environment: config.environment,
      modules: config.modules,
      intensity: config.intensity,
      status: 'Running',
      progress: 18,
      currentStage: 'Nmap — Network Discovery',
      startTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' (Today)',
      duration: '45s (In Progress)',
      findingsCount: 4,
      criticalCount: 1,
      highCount: 1,
      mediumCount: 2,
      lowCount: 0,
      infoCount: 0,
      overallRisk: 'HIGH',
      riskScore: 7.2,
      authorized: config.authorized,
      pipeline: samplePipelineStages('Running'),
      logs: [
        { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', stage: 'System', message: `Assessment authorization verified for ${config.targetUrl}` },
        { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'INFO', stage: 'Nmap', message: 'Initiated network discovery and port enumeration' },
      ],
    };

    setScans((prev) => [newScan, ...prev]);

    // Check if target already exists; if not, add it
    setTargets((prev) => {
      const exists = prev.some((t) => t.url.toLowerCase() === config.targetUrl.toLowerCase());
      if (exists) {
        return prev.map((t) =>
          t.url.toLowerCase() === config.targetUrl.toLowerCase()
            ? { ...t, status: 'Under Scan', lastScanDate: 'Just now', lastScanId: newId }
            : t
        );
      }
      return [
        {
          id: `TGT-00${prev.length + 1}`,
          name: newScan.targetName,
          url: config.targetUrl,
          environment: config.environment,
          description: `Auto-registered target during assessment ${newId}`,
          authorized: true,
          lastScanDate: 'Just now',
          lastScanId: newId,
          riskLevel: 'High',
          status: 'Under Scan',
          findingsCount: 4,
        },
        ...prev,
      ];
    });

    addToast({
      type: 'success',
      title: 'Scan Started Successfully',
      message: `Security assessment ${newId} initiated on ${newScan.targetName}.`,
    });

    return newId;
  };

  const cancelScan = (scanId: string) => {
    setScans((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, status: 'Cancelled', duration: 'Cancelled by user' } : s))
    );
    addToast({
      type: 'info',
      title: 'Scan Cancelled',
      message: `Security assessment ${scanId} was stopped by user request.`,
    });
  };

  const retryScan = (scanId: string) => {
    setScans((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, status: 'Running', progress: 10 } : s))
    );
    addToast({
      type: 'info',
      title: 'Scan Restarted',
      message: `Re-executing assessment pipeline for ${scanId}.`,
    });
  };

  const addTarget = (targetData: Omit<Target, 'id' | 'lastScanDate' | 'findingsCount' | 'riskLevel' | 'status'>) => {
    const newTarget: Target = {
      ...targetData,
      id: `TGT-00${targets.length + 1}`,
      lastScanDate: 'Never',
      findingsCount: 0,
      riskLevel: 'None',
      status: 'Active',
    };
    setTargets((prev) => [newTarget, ...prev]);
    addToast({
      type: 'success',
      title: 'Target Registered',
      message: `Authorized target "${newTarget.name}" added to assessment scope.`,
    });
  };

  const removeTarget = (id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Target Removed',
      message: 'Target was decommissioned from authorized assessment list.',
    });
  };

  const updateFindingStatus = (id: string, status: FindingStatus) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
    if (selectedFinding?.id === id) {
      setSelectedFinding((prev) => (prev ? { ...prev, status } : null));
    }
    addToast({
      type: 'success',
      title: 'Finding Updated',
      message: `Status set to ${status}.`,
    });
  };

  const generateReport = (scanId: string): string => {
    const scan = scans.find((s) => s.id === scanId) || scans[0];
    const reportNum = reports.length + 13;
    const newId = `REP-2026-00${reportNum}`;

    const newReport: Report = {
      id: newId,
      scanId: scan.id,
      target: scan.targetName,
      targetUrl: scan.targetUrl,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      duration: scan.duration,
      findingsCount: scan.findingsCount,
      riskLevel: scan.overallRisk === 'CRITICAL' ? 'Critical' : scan.overallRisk === 'HIGH' ? 'High' : 'Medium',
      riskScore: scan.riskScore,
      status: 'Ready',
      executiveSummary: `Automated security assessment report generated for ${scan.targetName} (${scan.targetUrl}). Includes multi-tool normalized findings, correlation matrix results, and prioritized AI remediation recommendations.`,
    };

    setReports((prev) => [newReport, ...prev]);
    addToast({
      type: 'success',
      title: 'Report Generated Successfully',
      message: `Report ${newId} is compiled and ready for preview or download.`,
    });
    return newId;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        scans,
        activeScanId,
        setActiveScanId,
        startNewScan,
        cancelScan,
        retryScan,
        targets,
        addTarget,
        removeTarget,
        findings,
        updateFindingStatus,
        selectedFinding,
        setSelectedFinding,
        reports,
        generateReport,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        correlations,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
