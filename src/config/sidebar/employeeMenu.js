import { 
  LayoutDashboard, Calendar, FileText, FileSpreadsheet, FileCheck, 
  ClipboardList, Stethoscope, BookOpen, ShieldAlert, AlertTriangle, MessageSquare 
} from 'lucide-react';

export const employeeMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'messages', label: 'Staff Messages', icon: MessageSquare },
  { id: 'rota', label: 'My Rota', icon: Calendar },
  { id: 'my-documents', label: 'My Documents', icon: FileText },
  { id: 'payroll', label: 'My Payslips', icon: FileSpreadsheet },
  {
    id: 'audits-group',
    label: 'Audits',
    icon: FileCheck,
    isExpandable: true,
    submenu: [
      { id: 'audits', label: 'Audit Dashboard' }
    ]
  },
  { id: 'care-planning', label: 'Care Planning', icon: ClipboardList },
  { id: 'malnutrition-tracker', label: 'Malnutrition Tracker', icon: Stethoscope },
  { id: 'policies-training', label: 'Policies & SOPs', icon: BookOpen },
  { id: 'fire-compliance', label: 'Fire & Compliance', icon: ShieldAlert },
  { id: 'incidents', label: 'Incident Reporting', icon: AlertTriangle }
];
