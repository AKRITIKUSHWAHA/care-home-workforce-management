import { 
  LayoutDashboard, Users, FileText, Plane, FileSpreadsheet, BadgeCheck, 
  ClipboardList, BookOpen, AlertTriangle, GraduationCap, FileWarning, MessageSquare 
} from 'lucide-react';

export const hrMenu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'messages', label: 'Staff Messages', icon: MessageSquare },
  {
    id: 'workforce',
    label: 'Workforce',
    icon: Users,
    isExpandable: true,
    submenu: [
      { id: 'employees', label: 'Employee Profiles' },
      { id: 'training-matrix', label: 'Training Matrix' },
      { id: 'supervisions', label: 'Supervisions & Appraisals' },
      { id: 'dbs-vetting', label: 'DBS & Vetting' }
    ]
  },
  { id: 'document-templates', label: 'Document Templates', icon: FileText },
  { id: 'leave', label: 'Leave Approvals', icon: Plane },
  { id: 'payroll', label: 'Payroll Summary', icon: FileSpreadsheet },
  { id: 'competency', label: 'Competency', icon: BadgeCheck },
  { id: 'care-planning', label: 'Care Planning', icon: ClipboardList },
  { id: 'policies-training', label: 'Policies & SOPs', icon: BookOpen },
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
