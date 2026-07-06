import { 
  LayoutDashboard, FileCheck, Eye, ClipboardList, Activity, Stethoscope, 
  BookOpen, ShieldAlert, AlertTriangle, FileWarning, BarChart2 
} from 'lucide-react';

export const complianceMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
