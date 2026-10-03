import React from 'react';
import { Severity, ScanStatus, FindingStatus, Environment } from '@/types';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className = '',
  size = 'md',
  showDot = true,
}) => {
  const styles: Record<Severity, { bg: string; text: string; border: string; dot: string }> = {
    Critical: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-600',
    },
    High: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      text: 'text-orange-700',
      border: 'border-orange-200',
      dot: 'bg-orange-600',
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    Informational: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      text: 'text-sky-700',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
    },
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  };

  const current = styles[severity] || styles.Informational;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider ${current.bg} ${sizeStyles[size]} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      )}
      {severity}
    </span>
  );
};

interface StatusBadgeProps {
  status: ScanStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
  };

  if (status === 'Running') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeStyles[size]} ${className}`}
      >
        <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
        Running
      </span>
    );
  }

  if (status === 'Completed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeStyles[size]} ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Completed
      </span>
    );
  }

  if (status === 'Failed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 ${sizeStyles[size]} ${className}`}
      >
        <AlertTriangle className="w-3 h-3 text-red-600" />
        Failed
      </span>
    );
  }

  if (status === 'Cancelled') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeStyles[size]} ${className}`}
      >
        <XCircle className="w-3 h-3 text-slate-400" />
        Cancelled
      </span>
    );
  }

  // Pending
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeStyles[size]} ${className}`}
    >
      <Clock className="w-3 h-3 text-slate-400" />
      Pending
    </span>
  );
};

interface FindingStatusBadgeProps {
  status: FindingStatus;
  className?: string;
}

export const FindingStatusBadge: React.FC<FindingStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const styles: Record<FindingStatus, string> = {
    Open: 'bg-rose-50 text-rose-700 border-rose-200',
    'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'False Positive': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status]} ${className}`}
    >
      {status}
    </span>
  );
};

export const EnvironmentBadge: React.FC<{ env: Environment; className?: string }> = ({
  env,
  className = '',
}) => {
  const styles: Record<Environment, string> = {
    Production: 'bg-purple-50 text-purple-700 border-purple-200',
    Staging: 'bg-blue-50 text-blue-700 border-blue-200',
    Testing: 'bg-amber-50 text-amber-700 border-amber-200',
    Development: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${styles[env]} ${className}`}
    >
      {env}
    </span>
  );
};
