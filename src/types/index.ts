export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type ScanStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';

export type FindingStatus = 'Open' | 'In Review' | 'Resolved' | 'False Positive';

export type Environment = 'Development' | 'Testing' | 'Staging' | 'Production';

export type ScanIntensity = 'Basic' | 'Standard' | 'Comprehensive';

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  tool: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  progress: number;
  duration?: string;
  findingsCount?: number;
}

export interface Finding {
  id: string;
  scanId: string;
  title: string;
  severity: Severity;
  riskScore: number;
  target: string;
  targetUrl: string;
  endpoint: string;
  source: 'OWASP ZAP' | 'Nmap' | 'HTTP Headers' | 'TLS Check' | 'Custom Check' | 'Multi-Tool';
  status: FindingStatus;
  date: string;
  description: string;
  whyItMatters: string;
  evidence: string;
  technicalDetails?: string;
  riskAnalysis: string;
  recommendedAction: string;
  aiExplanation: string;
  aiRemediation: string[];
  cve?: string;
  cwe?: string;
  correlatedWith?: string[];
  priority: 'Critical Priority' | 'High Priority' | 'Medium Priority' | 'Low Priority';
}

export interface CorrelationItem {
  id: string;
  title: string;
  source1: {
    tool: string;
    finding: string;
    evidence: string;
  };
  source2: {
    tool: string;
    finding: string;
    evidence: string;
  };
  commonIssue: string;
  consolidatedFinding: string;
  deduplicationRatio: string;
  riskScore: number;
  status: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  stage: string;
  message: string;
}

export interface Scan {
  id: string;
  targetUrl: string;
  targetName: string;
  environment: Environment;
  modules: string[];
  intensity: ScanIntensity;
  status: ScanStatus;
  progress: number;
  currentStage: string;
  startTime: string;
  endTime?: string;
  duration: string;
  findingsCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  authorized: boolean;
  pipeline: PipelineStage[];
  logs: ScanLog[];
}

export interface Target {
  id: string;
  name: string;
  url: string;
  environment: Environment;
  description: string;
  authorized: boolean;
  lastScanDate: string;
  lastScanId?: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
  status: 'Active' | 'Under Scan' | 'Archived';
  findingsCount: number;
}

export interface Report {
  id: string;
  scanId: string;
  target: string;
  targetUrl: string;
  date: string;
  duration: string;
  findingsCount: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  status: 'Generated' | 'Ready' | 'Archived';
  executiveSummary: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'scan_completed' | 'high_risk' | 'report_ready' | 'info';
  link?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  aiProvider: 'GPT-4o Security Engine' | 'Claude 3.5 Sonnet SecOps' | 'Local DeepSeek-R1 (Air-Gapped)';
  defaultScanType: 'Standard Assessment' | 'Quick Discovery' | 'Full Pentest';
  defaultIntensity: ScanIntensity;
  notifications: {
    scanCompleted: boolean;
    criticalFound: boolean;
    reportGenerated: boolean;
  };
}
