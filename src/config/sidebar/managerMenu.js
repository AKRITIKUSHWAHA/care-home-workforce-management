import { 
  LayoutDashboard, Users, FileCheck, Eye, BadgeCheck, ClipboardList, 
  BookOpen, ShieldAlert, AlertTriangle, Calendar, FileText, Plane, 
  FileSpreadsheet, Map, UserPlus 
} from 'lucide-react';

export const managerMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'operations-ecm',
    label: 'Operations & ECM',
    icon: Map,
    isExpandable: true,
    submenu: [
      { id: 'ecm-live', label: 'ECM / GPS Live' },
      { id: 'qr-secure', label: 'QR Secure & Fleet' },
      { id: 'messages', label: 'Staff Messages' }
    ]
  },
  { id: 'client-records', label: 'Client Records', icon: UserPlus },
  {
    id: 'workforce',
    label: 'Workforce',
    icon: Users,
    isExpandable: true,
    submenu: [
      { id: 'employees', label: 'Employee Profiles' },
      { id: 'supervisions', label: 'Supervisions & Appraisals' }
    ]
  },
  { id: 'document-verification', label: 'Document Verification', icon: FileText },
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
  { id: 'payroll', label: 'Payroll Summary', icon: FileSpreadsheet },
  {
    id: 'quality-compliance',
    label: 'Quality & Compliance',
    icon: FileCheck,
    isExpandable: true,
    submenu: [
      { id: 'compliance-board', label: 'Compliance Board' },
      { id: 'audits', label: 'Audit Dashboard' }
    ]
  },
  { id: 'observation', label: 'Observation', icon: Eye },
  { id: 'competency', label: 'Competency', icon: BadgeCheck },
  { id: 'care-planning', label: 'Care Planning', icon: ClipboardList },
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
      { id: 'concerns', label: 'Concerns' }
    ]
  }
];
