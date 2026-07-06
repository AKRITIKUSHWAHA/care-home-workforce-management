import { 
  LayoutDashboard, Users, FileSignature, FileText, Calendar, Plane, FileSpreadsheet, 
  BarChart2, MonitorPlay, FileCheck, Eye, ClipboardList, Activity, Stethoscope, 
  BookOpen, AlertTriangle, ShieldAlert, Map, QrCode, MessageSquare, 
  ClipboardType, Pill, UserPlus, Scale, Cross, Bell, Network, GraduationCap, FileWarning
} from 'lucide-react';

export const adminMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'operations-ecm',
    label: 'Operations & ECM',
    icon: Map,
    isExpandable: true,
    submenu: [
      { id: 'ecm-live', label: 'ECM / GPS Live' },
      { id: 'qr-secure', label: 'QR Secure & Fleet' },
      { id: 'messages', label: 'Staff Messages' },
      { id: 'handover-allocation', label: 'Handover & Allocation' }
    ]
  },
  {
    id: 'client-records-group',
    label: 'Client Records',
    icon: UserPlus,
    isExpandable: true,
    submenu: [
      { id: 'client-records', label: 'Client Records Hub' },
      { id: 'resident-tracker', label: 'Resident Occupancy Tracker' }
    ]
  },
  {
    id: 'workforce',
    label: 'Workforce',
    icon: Users,
    isExpandable: true,
    submenu: [
      { id: 'employees', label: 'Employee Profiles' },
      { id: 'training-matrix', label: 'Training Matrix' },
      { id: 'supervisions', label: 'Supervisions & Appraisals' },
      { id: 'dbs-vetting', label: 'DBS & Vetting' },
      { id: 'organisation-chart', label: 'Organisation Chart' },
      { id: 'personnel-files', label: 'Personnel Files Audit' }
    ]
  },
  { id: 'verification-audit-log', label: 'Verification Audit Log', icon: FileSignature },
  { id: 'document-templates', label: 'Document Templates', icon: FileText },
  {
    id: 'rota-group',
    label: 'Rota',
    icon: Calendar,
    isExpandable: true,
    submenu: [
      { id: 'rota', label: 'Calendar View' },
      { id: 'shift-planning', label: 'Shift Planning' },
      { id: 'attendance', label: 'Attendance' },
      { id: 'day-notes', label: 'Day Notes' }
    ]
  },
  { id: 'leave', label: 'Leave Manager', icon: Plane },
  {
    id: 'finance',
    label: 'Finance',
    icon: FileSpreadsheet,
    isExpandable: true,
    submenu: [
      { id: 'visit-approval', label: 'Visit Approval' },
      { id: 'payroll', label: 'Payroll Summary' },
      { id: 'invoices', label: 'Invoices' },
      { id: 'contracts', label: 'Contracts' }
    ]
  },
  { id: 'reports', label: 'Reports Insights', icon: BarChart2 },
  { id: 'visitor-tablet', label: 'Visitor Registration', icon: MonitorPlay },
  {
    id: 'quality-compliance',
    label: 'Quality & Compliance',
    icon: FileCheck,
    isExpandable: true,
    submenu: [
      { id: 'governance-hub', label: 'Governance Hub' },
      { id: 'compliance-board', label: 'Compliance Board' },
      { id: 'audits', label: 'Audit Dashboard' },
      { id: 'statutory-notifications', label: 'Statutory Notifications' },
      { id: 'cleaning-schedule', label: 'Domestic Cleaning Logs' },
      { id: 'fire-compliance-book', label: 'Fire Registry Book' },
      { id: 'governance-workbook', label: 'CQC Governance Ledger' },
      { id: 'master-action-plan', label: 'Master Action Plan' },
      { id: 'compliance-calendar', label: 'Compliance Task Calendar' }
    ]
  },
  { id: 'observation', label: 'Observation', icon: Eye },
  { id: 'care-planning', label: 'Care Planning', icon: ClipboardList },
  { id: 'dependency-tool', label: 'Staffing Dependency', icon: Activity },
  { id: 'malnutrition-tracker', label: 'Malnutrition Tracker', icon: Stethoscope },
  { id: 'policies-training', label: 'Policies & SOPs', icon: BookOpen },
  { id: 'fire-compliance', label: 'Fire & Compliance', icon: ShieldAlert },
  {
    id: 'safeguarding-hub',
    label: 'Safeguarding',
    icon: AlertTriangle,
    isExpandable: true,
    submenu: [
      { id: 'safeguarding', label: 'Safeguarding Hub' },
      { id: 'incidents', label: 'Incident Reporting' },
      { id: 'concerns', label: 'Concerns' },
      { id: 'complaints', label: 'Complaints' }
    ]
  }
];
