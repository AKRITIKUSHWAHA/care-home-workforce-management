import React from 'react';
import { useApp } from '../context/AppContext';

// Shared Utilities
import AccessDenied from '../modules/shared/AccessDenied';

// --- ADMIN MODULE IMPORTS ---
import AdminDashboard from '../modules/admin/AdminDashboard';
import VerificationAuditLog from '../modules/admin/VerificationAuditLog';
import AdminEmployees from '../modules/admin/Employees';
import AdminRotaCalendar from '../modules/admin/RotaCalendar';
import AdminRotaManagement from '../modules/admin/RotaManagement';
import AdminDayNotes from '../modules/admin/DayNotes';
import AdminAttendance from '../modules/admin/Attendance';
import AdminLeave from '../modules/admin/Leave';
import AdminPayroll from '../modules/admin/Payroll';
import AdminReports from '../modules/admin/Reports';
import AdminVisitorTablet from '../modules/admin/VisitorTablet';
import AdminAuditDashboard from '../modules/admin/AuditDashboard';
import AdminObservationManagement from '../modules/admin/ObservationManagement';
import AdminCompetencyManagement from '../modules/admin/CompetencyManagement';
import AdminSettings from '../modules/admin/Settings';
import AdminDocumentTemplates from '../modules/admin/DocumentTemplates';

// --- KITCHEN IMPORT ---
import KitchenPaperwork from '../modules/kitchen/KitchenPaperwork';

// --- CARE PLANNING IMPORT ---
import CarePlanningDashboard from '../modules/care-planning/CarePlanningDashboard';
import PoliciesAndTraining from '../modules/shared/PoliciesAndTraining';
import IncidentReporting from '../modules/shared/IncidentReporting';
import FireComplianceDashboard from '../modules/compliance/FireComplianceDashboard';
import DependencyTool from '../modules/care-planning/components/DependencyTool';
import MedicationRoomCleaning from '../modules/shared/MedicationRoomCleaning';
import MalnutritionTracker from '../modules/care-planning/components/MalnutritionTracker';

// --- HR MODULE IMPORTS ---
import HRDashboard from '../modules/hr/HRDashboard';
import HREmployees from '../modules/hr/Employees';
import HRLeave from '../modules/hr/Leave';
import HRPayroll from '../modules/hr/Payroll';
import HRRotaCalendar from '../modules/hr/RotaCalendar';
import HRRotaManagement from '../modules/hr/RotaManagement';
import HRDayNotes from '../modules/hr/DayNotes';
import HRAttendance from '../modules/hr/Attendance';
import HRCompetencyManagement from '../modules/hr/CompetencyManagement';
import HRSettings from '../modules/hr/Settings';
import HRDocumentTemplates from '../modules/hr/DocumentTemplates';

// --- COMPLIANCE MODULE IMPORTS ---
import ComplianceAuditDashboard from '../modules/compliance/AuditDashboard';
import ComplianceRotaCalendar from '../modules/compliance/RotaCalendar';
import ComplianceRotaManagement from '../modules/compliance/RotaManagement';
import ComplianceDayNotes from '../modules/compliance/DayNotes';
import ComplianceAttendance from '../modules/compliance/Attendance';
import ComplianceObservationManagement from '../modules/compliance/ObservationManagement';
import ComplianceCompetencyManagement from '../modules/compliance/CompetencyManagement';
import ComplianceSettings from '../modules/compliance/Settings';

// --- MANAGER MODULE IMPORTS ---
import ManagerDashboard from '../modules/manager/ManagerDashboard';
import DocumentVerification from '../modules/manager/DocumentVerification';
import ManagerEmployees from '../modules/manager/Employees';
import ManagerRotaCalendar from '../modules/manager/RotaCalendar';
import ManagerRotaManagement from '../modules/manager/RotaManagement';
import ManagerDayNotes from '../modules/manager/DayNotes';
import ManagerAttendance from '../modules/manager/Attendance';
import ManagerLeave from '../modules/manager/Leave';
import ManagerPayroll from '../modules/manager/Payroll';
import ManagerAuditDashboard from '../modules/manager/AuditDashboard';
import ManagerObservationManagement from '../modules/manager/ObservationManagement';
import ManagerCompetencyManagement from '../modules/manager/CompetencyManagement';
import ManagerSettings from '../modules/manager/Settings';

// --- EMPLOYEE MODULE IMPORTS ---
import EmployeeDashboard from '../modules/employee/EmployeeDashboard';
import MyDocuments from '../modules/employee/MyDocuments';
import EmployeeRotaCalendar from '../modules/employee/RotaCalendar';
import EmployeeRotaManagement from '../modules/employee/RotaManagement';
import EmployeeDayNotes from '../modules/employee/DayNotes';
import EmployeeAttendance from '../modules/employee/Attendance';
import EmployeeLeave from '../modules/employee/Leave';
import EmployeePayroll from '../modules/employee/Payroll';
import EmployeeObservationManagement from '../modules/employee/ObservationManagement';
import EmployeeCompetencyManagement from '../modules/employee/CompetencyManagement';
import EmployeeSettings from '../modules/employee/Settings';

// --- RECEPTIONIST MODULE IMPORTS ---
import VisitorTablet from '../modules/receptionist/VisitorTablet';
import ReceptionistSettings from '../modules/receptionist/Settings';


// --- NEW FEATURES IMPORTS ---
import ECMLive from '../modules/operations/ECMLive';
import QRSecure from '../modules/operations/QRSecure';
import Messages from '../modules/operations/Messages';
import ClientRegister from '../modules/clients/ClientRegister';
import ClientSchedules from '../modules/clients/ClientSchedules';
import MARChart from '../modules/clients/MARChart';
import CareNotes from '../modules/clients/CareNotes';
import ClinicalObservations from '../modules/clients/ClinicalObservations';
import LegalCapacity from '../modules/clients/LegalCapacity';
import EndOfLife from '../modules/clients/EndOfLife';
import TrainingMatrix from '../modules/workforce/TrainingMatrix';
import Supervisions from '../modules/workforce/Supervisions';
import DBSVetting from '../modules/workforce/DBSVetting';
import VisitApproval from '../modules/finance/VisitApproval';
import Invoices from '../modules/finance/Invoices';
import Contracts from '../modules/finance/Contracts';
import GovernanceHub from '../modules/compliance/GovernanceHub';
import ComplianceBoard from '../modules/compliance/ComplianceBoard';
import StatutoryNotifications from '../modules/compliance/StatutoryNotifications';
import SafeguardingHub from '../modules/safeguarding/SafeguardingHub';
import Concerns from '../modules/safeguarding/Concerns';
import Complaints from '../modules/safeguarding/Complaints';
import ClientRecordsHub from '../modules/clients/ClientRecordsHub';
import ComplianceCalendarDashboard from '../modules/compliance/ComplianceCalendarDashboard';

export const AppRouter = () => {
  const { currentRole, currentView } = useApp();

  // 1. ADMIN ROLE ROUTING
  if (currentRole === 'Admin') {
    switch (currentView) {
      case 'dashboard':
        return <ComplianceCalendarDashboard />;
      case 'employees':
        return <AdminEmployees />;
      case 'verification-audit-log':
        return <VerificationAuditLog />;
      case 'rota':
        return <AdminRotaCalendar />;
      case 'shift-planning':
        return <AdminRotaManagement />;
      case 'day-notes':
        return <AdminDayNotes />;
      case 'attendance':
        return <AdminAttendance />;
      case 'leave':
        return <AdminLeave />;
      case 'payroll':
        return <AdminPayroll />;
      case 'reports':
        return <AdminReports />;
      case 'visitor-tablet':
        return <AdminVisitorTablet />;
      case 'audits':
      case 'audit-fire':
      case 'audit-medication':
      case 'audit-cleaning':
      case 'audit-kitchen':
        return <AdminAuditDashboard />;
      case 'observation':
        return <AdminObservationManagement />;
      case 'competency':
        return <AdminCompetencyManagement />;
      case 'settings':
        return <AdminSettings />;
      case 'document-templates':
        return <AdminDocumentTemplates />;
      case 'care-planning':
        return <CarePlanningDashboard />;
      case 'policies-training':
        return <PoliciesAndTraining />;
      case 'fire-compliance':
        return <FireComplianceDashboard />;
      case 'kitchen-paperwork':
        return <KitchenPaperwork />;
      case 'dependency-tool':
        return <DependencyTool />;
      case 'medication-cleaning':
        return <MedicationRoomCleaning />;
      case 'malnutrition-tracker':
        return <MalnutritionTracker />;
      case 'incidents':
        return <IncidentReporting userRole="Admin" />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <ComplianceCalendarDashboard />;
    }
  }

  // 2. HR ROLE ROUTING
  if (currentRole === 'HR') {
    switch (currentView) {
      case 'dashboard':
        return <HRDashboard />;
      case 'employees':
        return <HREmployees />;
      case 'leave':
        return <HRLeave />;
      case 'payroll':
        return <HRPayroll />;
      case 'rota':
        return <HRRotaCalendar />;
      case 'shift-planning':
        return <HRRotaManagement />;
      case 'day-notes':
        return <HRDayNotes />;
      case 'attendance':
        return <HRAttendance />;
      case 'competency':
        return <HRCompetencyManagement />;
      case 'settings':
        return <HRSettings />;
      case 'document-templates':
        return <HRDocumentTemplates />;
      case 'care-planning':
        return <CarePlanningDashboard />;
      case 'policies-training':
        return <PoliciesAndTraining />;
      case 'fire-compliance':
        return <FireComplianceDashboard />;
      case 'dependency-tool':
        return <DependencyTool />;
      case 'medication-cleaning':
        return <MedicationRoomCleaning />;
      case 'incidents':
        return <IncidentReporting userRole="HR" />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <HRDashboard />;
    }
  }

  // 3. COMPLIANCE OFFICER ROLE ROUTING
  if (currentRole === 'Compliance Officer') {
    switch (currentView) {
      case 'dashboard':
        return <ComplianceCalendarDashboard />;
      case 'audits':
      case 'audit-fire':
      case 'audit-medication':
      case 'audit-cleaning':
      case 'audit-kitchen':
        return <ComplianceAuditDashboard />;
      case 'rota':
        return <ComplianceRotaCalendar />;
      case 'shift-planning':
        return <ComplianceRotaManagement />;
      case 'day-notes':
        return <ComplianceDayNotes />;
      case 'attendance':
        return <ComplianceAttendance />;
      case 'observation':
        return <ComplianceObservationManagement />;
      case 'competency':
        return <ComplianceCompetencyManagement />;
      case 'settings':
        return <ComplianceSettings />;
      case 'care-planning':
        return <CarePlanningDashboard />;
      case 'policies-training':
        return <PoliciesAndTraining />;
      case 'fire-compliance':
        return <FireComplianceDashboard />;
      case 'kitchen-paperwork':
        return <KitchenPaperwork />;
      case 'dependency-tool':
        return <DependencyTool />;
      case 'medication-cleaning':
        return <MedicationRoomCleaning />;
      case 'incidents':
        return <IncidentReporting userRole="Compliance Officer" />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <ComplianceCalendarDashboard />;
    }
  }

  // 4. MANAGER ROLE ROUTING
  if (currentRole === 'Manager') {
    switch (currentView) {
      case 'dashboard':
        return <ComplianceCalendarDashboard />;
      case 'employees':
        return <ManagerEmployees />;
      case 'document-verification':
        return <DocumentVerification />;
      case 'rota':
        return <ManagerRotaCalendar />;
      case 'shift-planning':
        return <ManagerRotaManagement />;
      case 'day-notes':
        return <ManagerDayNotes />;
      case 'attendance':
        return <ManagerAttendance />;
      case 'leave':
        return <ManagerLeave />;
      case 'payroll':
        return <ManagerPayroll />;
      case 'audits':
      case 'audit-fire':
      case 'audit-medication':
      case 'audit-cleaning':
      case 'audit-kitchen':
        return <ManagerAuditDashboard />;
      case 'observation':
        return <ManagerObservationManagement />;
      case 'competency':
        return <ManagerCompetencyManagement />;
      case 'settings':
        return <ManagerSettings />;
      case 'care-planning':
        return <CarePlanningDashboard />;
      case 'policies-training':
        return <PoliciesAndTraining />;
      case 'fire-compliance':
        return <FireComplianceDashboard />;
      case 'kitchen-paperwork':
        return <KitchenPaperwork />;
      case 'dependency-tool':
        return <DependencyTool />;
      case 'medication-cleaning':
        return <MedicationRoomCleaning />;
      case 'incidents':
        return <IncidentReporting userRole="Manager" />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <ComplianceCalendarDashboard />;
    }
  }

  // 5. EMPLOYEE ROLE ROUTING
  if (currentRole === 'Employee') {
    switch (currentView) {
      case 'dashboard':
      case 'employee-dashboard':
        return <EmployeeDashboard />;
      case 'rota':
        return <EmployeeRotaCalendar />;
      case 'shift-planning':
        return <EmployeeRotaManagement />;
      case 'day-notes':
        return <EmployeeDayNotes />;
      case 'attendance':
        return <EmployeeAttendance />;
      case 'my-documents':
        return <MyDocuments />;
      case 'leave':
        return <EmployeeLeave />;
      case 'payroll':
        return <EmployeePayroll />;
      case 'observation':
        return <EmployeeObservationManagement />;
      case 'competency':
        return <EmployeeCompetencyManagement />;
      case 'settings':
        return <EmployeeSettings />;
      case 'care-planning':
        return <CarePlanningDashboard />;
      case 'policies-training':
        return <PoliciesAndTraining />;
      case 'fire-compliance':
        return <FireComplianceDashboard />;
      case 'kitchen-paperwork':
        return <KitchenPaperwork />;
      case 'medication-cleaning':
        return <MedicationRoomCleaning />;
      case 'audit-fire':
      case 'audit-medication':
      case 'audit-cleaning':
      case 'audit-kitchen':
      case 'audits':
        return <ComplianceAuditDashboard />;
      case 'incidents':
        return <IncidentReporting userRole="Employee" />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <EmployeeDashboard />;
    }
  }

  // 6. RECEPTIONIST ROLE ROUTING
  if (currentRole === 'Receptionist') {
    switch (currentView) {
      case 'dashboard':
      case 'visitor-tablet':
        return <VisitorTablet />;
      case 'settings':
        return <ReceptionistSettings />;
      
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-records': return <ClientRecordsHub />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
      default:
        return <VisitorTablet />;
    }
  }

  return <AccessDenied />;
};
