import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Award, 
  AlertTriangle,
  ChevronDown,
  User,
  ArrowUpRight,
  Info,
  RefreshCw,
  History,
  FileSpreadsheet,
  Plus,
  Download,
  Upload,
  Trash2,
  Check,
  X,
  Edit3
} from 'lucide-react';

const PoliciesAndTraining = () => {
  const {
    currentRole,
    employees,
    activeEmployeeId,
    policies,
    policySignatures,
    trainingMatrix,
    signPolicy,
    updateTrainingStatus,
    updateTrainingDate,
    TRAINING_COURSES,
    complianceLogs,
    addComplianceLog,
    updateEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState('policies'); // policies, training
  const [policySearch, setPolicySearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null); // For "Read & Sign" modal
  const [esignChecked, setEsignChecked] = useState(false);
  const [esignName, setEsignName] = useState('');
  const [selectedTrainingCell, setSelectedTrainingCell] = useState(null); // { employeeId, courseId } for manager update popover
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStepText, setSyncStepText] = useState('');

  // Spreadsheet edit states
  const [editingCell, setEditingCell] = useState(null); // { employeeId, courseId }
  const [editingName, setEditingName] = useState(null); // employeeId

  // Audit Trail states
  const [auditEmployeeId, setAuditEmployeeId] = useState(employees[0]?.id || 'EMP-001');
  const [auditPolicyId, setAuditPolicyId] = useState(policies[0]?.id || 'health-safety');
  const [auditTypeFilter, setAuditTypeFilter] = useState('All');

  const handleFuturuSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStepText('Connecting to Futuru.ai secure API...');

    setTimeout(() => {
      setSyncProgress(25);
      setSyncStepText('Connected. Fetching training credentials for AS Care staff...');
      
      setTimeout(() => {
        setSyncProgress(50);
        setSyncStepText('Verifying certificates for dementia care, fire safety & infection control...');

        setTimeout(() => {
          setSyncProgress(75);
          setSyncStepText('Writing certification records to compliance ledger...');
          
          const courseKeys = ['medication', 'moving-handling', 'fire-safety', 'infection-control', 'dementia-care'];
          employees.forEach(emp => {
            courseKeys.forEach(course => {
              updateTrainingDate(emp.id, course, '2026-06-15');
            });
          });

          setTimeout(() => {
            setSyncProgress(100);
            setSyncStepText('Sync complete! Matrix ledger updated successfully.');
            
            setTimeout(() => {
              setIsSyncing(false);
              setSyncProgress(0);
              setSyncStepText('');
            }, 2000);
          }, 1000);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Helper: Find currently active employee object
  const activeEmployee = employees.find(e => e.id === activeEmployeeId) || employees[0];
  const isManagerial = ['Admin', 'HR', 'Manager', 'Compliance Officer'].includes(currentRole);

  // Policy text mappings for full reading simulation
  const POLICY_CONTENTS = {
    'health-safety': `
      AS CARE HOME — HEALTH & SAFETY COMPLIANCE MANUAL
      Document ID: HS-POL-2026 | Version: 3.2 | Last Revised: March 2026
      
      1. INTRODUCTION & SCOPE
      This policy outlines the health and safety responsibilities and guidelines applicable to all staff members at AS Care Home. Compliance with these rules is mandatory under the Health and Safety at Work Act 1974.

      2. GENERAL SAFETY RULES
      - Every employee must keep their work area clean, organized, and free of physical hazards.
      - Any hazard, spill, or mechanical failure must be reported immediately using the hazard reporting form.
      - Correct Lifting and Mobilization techniques must be used at all times. Do not lift residents manually; always use the approved mechanical hoists, slide sheets, or assistive transfer tools.

      3. FIRE SAFETY & EMERGENCY PLAN
      - Learn the locations of all fire exits, extinguishers, and break-glass call points.
      - In the event of a fire alarm sounding:
        - Staff must immediately guide residents to assembly points following horizontal evacuation protocols.
        - Never use elevators during a fire evacuation.
        - The senior staff on shift is responsible for bringing the resident roster and visitor log to verify headcount.

      4. ACCIDENT & INCIDENT REPORTING
      - All workplace accidents, injuries, or near-misses (no matter how minor) must be documented in the Accident Book within 24 hours of occurrence.
      - Serious incidents affecting resident safety must be reported to the CQC within statutory limits.
    `,
    'safeguarding': `
      AS CARE HOME — SAFEGUARDING VULNERABLE ADULTS POLICY
      Document ID: SG-POL-2026 | Version: 4.1 | Last Revised: January 2026

      1. OBJECTIVE
      To ensure all residents reside in a safe, caring, and protective environment, free from abuse, neglect, exploitation, or discrimination.

      2. RECOGNIZING ABUSE
      Staff members must remain vigilant for signs of the following types of abuse:
      - Physical Abuse: Unexplained bruising, cuts, burns, or physical restraint marks.
      - Psychological/Emotional Abuse: Bullying, intimidation, isolation, or verbal threats.
      - Financial Abuse: Unauthorized handling of resident cash, bank accounts, or suspicious changes to power of attorney.
      - Neglect: Omission of meals, hygiene support, medication, or basic heating/clothing.

      3. WHISTLEBLOWING & REPORTING CHAIN
      - If you suspect abuse or receive a disclosure from a resident:
        - Ensure the resident is in immediate safety.
        - Report the concern directly to the Safeguarding Lead or Manager immediately.
        - Document the details objectively in the Safeguarding Ledger.
        - If management is involved, contact the local authority safeguarding team or CQC directly.
    `,
    'gdpr': `
      AS CARE HOME — DATA PROTECTION & GDPR COMPLIANCE POLICY
      Document ID: GDPR-POL-2026 | Version: 2.0 | Last Revised: February 2026

      1. DATA PRIVACY PRINCIPLES
      All personal and medical data relating to residents and staff must be handled in compliance with the UK GDPR and the Data Protection Act 2018.

      2. WORKPLACE INFORMATION SECURITY
      - Care records, MAR charts, and personnel folders must be locked in cabinets when not in use.
      - Computer screens running the Care Planning system must never be left logged-in and unattended. Use automatic lock shortcuts (Win+L) before walking away from terminals.
      - Sharing user credentials (passwords, PINs) is strictly prohibited. Each user must utilize their own account.

      3. RESIDENT RIGHTS
      - Residents have the right to request access to their care data, request corrections, and withdraw consent where applicable.
      - Medical information must only be shared with authorized healthcare practitioners (GPs, nurses) or named family members holding registered Power of Attorney (POA).
    `,
    'whistleblowing': `
      AS CARE HOME — WHISTLEBLOWING (SPEAK UP) POLICY
      Document ID: WB-POL-2026 | Version: 2.5 | Last Revised: April 2026

      1. POLICY STATEMENT
      AS Care Home is committed to the highest standards of openness, integrity, and accountability. We encourage employees who have serious concerns about any aspect of the care home's operations to come forward and voice those concerns.

      2. SCOPE OF CONCERNS
      This policy covers situations where an employee reasonably believes that:
      - A criminal offense has been committed.
      - Resident care standards are being compromised.
      - A person's health and safety is being endangered.
      - There is a cover-up of any of the above.

      3. PROTECTION FOR WHISTLEBLOWERS
      No employee will suffer any form of harassment, retaliation, or disadvantage as a result of voicing concerns in good faith. Reports can be made anonymously if preferred.
    `,
    'infection-control': `
      AS CARE HOME — INFECTION PREVENTION & CONTROL (IPC) POLICY
      Document ID: IPC-POL-2026 | Version: 3.0 | Last Revised: May 2026

      1. CLEANLINESS STANDARDS
      Maintaining standard infection control precautions is critical to protecting vulnerable residents from outbreaks (e.g. Norovirus, Influenza, COVID-19).

      2. HAND HYGIENE PROTOCOL
      - Staff must perform hand hygiene according to the World Health Organization's '5 Moments for Hand Hygiene':
        1. Before touching a resident.
        2. Before clean/aseptic procedures.
        3. After body fluid exposure risk.
        4. After touching a resident.
        5. After touching resident surroundings.

      3. PERSONAL PROTECTIVE EQUIPMENT (PPE)
      - Appropriate PPE (gloves, aprons, masks) must be worn when delivering personal care, cleaning, or administering medical procedures.
      - PPE must be disposed of immediately in designated clinical waste bins (yellow bags).
    `
  };

  // --- POLICIES STATISTICS CALCULATIONS (FOR MANAGERS) ---
  const calculatePolicyStats = () => {
    let totalAssigned = employees.length * policies.length;
    let totalSigned = 0;
    
    employees.forEach(emp => {
      const signatures = policySignatures[emp.id] || {};
      policies.forEach(p => {
        if (signatures[p.id]?.signed) {
          totalSigned++;
        }
      });
    });

    const averagePercent = totalAssigned > 0 ? Math.round((totalSigned / totalAssigned) * 100) : 0;
    return { totalSigned, totalPending: totalAssigned - totalSigned, averagePercent };
  };

  const policyStats = calculatePolicyStats();

  // Helper: Calculate compliance color and status from completion date
  const getTrainingStatus = (dateStr) => {
    if (!dateStr) return { status: 'Not Started', textClass: 'text-rose-600 dark:text-rose-400 font-semibold', bgClass: 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50', dot: 'bg-rose-500' };
    
    const refDate = new Date('2026-06-15');
    const compDate = new Date(dateStr);
    const diffTime = refDate - compDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays <= 335) { // 11 months
      return { status: 'Compliant', textClass: 'text-emerald-700 dark:text-emerald-400 font-semibold', bgClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50', dot: 'bg-emerald-500' };
    } else if (diffDays <= 365) { // 12 months
      return { status: 'Expiring Soon', textClass: 'text-amber-700 dark:text-amber-450 font-semibold', bgClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/50', dot: 'bg-amber-500' };
    } else {
      return { status: 'Expired', textClass: 'text-rose-700 dark:text-rose-400 font-semibold', bgClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50', dot: 'bg-rose-500' };
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // --- TRAINING STATISTICS CALCULATIONS ---
  const calculateTrainingStats = () => {
    let totalCells = employees.length * TRAINING_COURSES.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;

    employees.forEach(emp => {
      const record = trainingMatrix[emp.id] || {};
      TRAINING_COURSES.forEach(c => {
        const dateStr = record[c.id];
        const statusObj = getTrainingStatus(dateStr);
        if (statusObj.status === 'Compliant') {
          completedCount++;
        } else if (statusObj.status === 'Expiring Soon') {
          inProgressCount++;
        } else {
          notStartedCount++;
        }
      });
    });

    const completionPercent = totalCells > 0 ? Math.round((completedCount / totalCells) * 100) : 0;
    return { completedCount, inProgressCount, notStartedCount, completionPercent };
  };

  const trainingStats = calculateTrainingStats();

  const handleSaveName = (employeeId, newName) => {
    setEditingName(null);
    if (!newName.trim()) return;
    updateEmployee(employeeId, { name: newName.trim() });
  };

  const handleSaveDate = (employeeId, courseId, dateValue) => {
    setEditingCell(null);
    updateTrainingDate(employeeId, courseId, dateValue);
  };

  const handleAddEmployee = () => {
    const newName = prompt("Enter the name of the new employee:");
    if (!newName || !newName.trim()) return;
    const title = prompt("Enter employee title (e.g. Care Assistant):", "Care Assistant");
    
    // Seed new training matrix row
    const newEmpId = `EMP-0${employees.length + 1}`;
    
    onboardEmployee({
      name: newName.trim(),
      title: title || "Care Assistant",
      dob: "1995-01-01",
      address: "Swan Care Home, CM0 7TR",
      phone: "+44 7700 900000",
      email: `${newName.trim().toLowerCase().replace(/ /g, '.')}@swan-care.co.uk`,
      emergencyContact: "Emergency - +44 7700 900000",
      role: "Employee",
      group: "Care Staff Day",
      manager: activeEmployee.name,
      holidayAllocation: 28,
      startDate: new Date().toISOString().split('T')[0],
      niNumber: "AA 00 00 00 A",
      contractType: "Full-Time Permanent"
    });

    // Initialize all courses to empty strings for this new employee
    TRAINING_COURSES.forEach(c => {
      updateTrainingDate(newEmpId, c.id, '');
    });
  };

  const handleExportCSV = () => {
    const headers = ['Staff ID', 'Staff Name', ...TRAINING_COURSES.map(c => c.name)];
    const rows = employees.map(emp => {
      const record = trainingMatrix[emp.id] || {};
      const courseDates = TRAINING_COURSES.map(c => record[c.id] || '');
      return [emp.id, emp.name, ...courseDates];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Swan_Training_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addComplianceLog('CSV Exported', 'Training matrix exported as CSV', activeEmployee.name, 'Training');
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n').map(line => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result.map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"'));
        }).filter(line => line.length > 1);

        if (lines.length < 2) {
          alert('CSV file is empty or invalid format.');
          return;
        }

        const headers = lines[0];
        const staffIdIdx = headers.indexOf('Staff ID');
        const staffNameIdx = headers.indexOf('Staff Name');

        if (staffNameIdx === -1) {
          alert('CSV must contain "Staff Name" column.');
          return;
        }

        const courseColumnMappings = [];
        headers.forEach((header, idx) => {
          if (idx === staffIdIdx || idx === staffNameIdx) return;
          const matchedCourse = TRAINING_COURSES.find(c => c.name.toLowerCase() === header.toLowerCase() || c.id.toLowerCase() === header.toLowerCase());
          if (matchedCourse) {
            courseColumnMappings.push({ colIdx: idx, courseId: matchedCourse.id });
          }
        });

        const updatedMatrix = { ...trainingMatrix };
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          const staffName = row[staffNameIdx];
          const staffId = staffIdIdx !== -1 ? row[staffIdIdx] : null;

          let emp = employees.find(e => e.id === staffId);
          if (!emp) {
            emp = employees.find(e => e.name.toLowerCase() === staffName.toLowerCase());
          }

          if (emp) {
            if (emp.name !== staffName && staffName) {
              updateEmployee(emp.id, { name: staffName });
            }

            if (!updatedMatrix[emp.id]) updatedMatrix[emp.id] = {};
            courseColumnMappings.forEach(mapping => {
              const cellVal = row[mapping.colIdx];
              let dateStr = '';
              if (cellVal) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(cellVal)) {
                  dateStr = cellVal;
                } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(cellVal)) {
                  const parts = cellVal.split('/');
                  dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
              }
              updatedMatrix[emp.id][mapping.courseId] = dateStr;
            });
          }
        }

        Object.keys(updatedMatrix).forEach(empId => {
          Object.keys(updatedMatrix[empId]).forEach(courseId => {
            updateTrainingDate(empId, courseId, updatedMatrix[empId][courseId]);
          });
        });

        alert('Training Matrix successfully imported and updated!');
        e.target.value = '';
      } catch (err) {
        alert(`Failed to parse CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const triggerCSVImport = () => {
    document.getElementById('csv-import-file').click();
  };

  // Get list of overdue training records for warning widget
  const getOverdueTrainingsList = () => {
    const list = [];
    employees.forEach(emp => {
      const record = trainingMatrix[emp.id] || {};
      TRAINING_COURSES.forEach(course => {
        const dateStr = record[course.id];
        const statusObj = getTrainingStatus(dateStr);
        if (statusObj.status === 'Expired' || statusObj.status === 'Not Started') {
          list.push({
            employeeId: emp.id,
            employeeName: emp.name,
            employeePhoto: emp.photo,
            employeeTitle: emp.title,
            courseId: course.id,
            courseName: course.name,
            dateCompleted: dateStr,
            daysOverdue: dateStr ? Math.floor((new Date('2026-06-15') - new Date(dateStr)) / (1000 * 60 * 60 * 24)) - 365 : null
          });
        }
      });
    });
    return list;
  };

  // Handle policy read and sign form submission
  const handleConfirmSignature = (e) => {
    e.preventDefault();
    if (!esignChecked) {
      alert('Please check the confirmation box to authorize your electronic signature.');
      return;
    }
    if (esignName.trim().toLowerCase() !== activeEmployee.name.toLowerCase()) {
      alert(`Signature name must match your profile name: "${activeEmployee.name}"`);
      return;
    }

    signPolicy(activeEmployee.id, selectedPolicy.id);
    setSelectedPolicy(null);
    setEsignChecked(false);
    setEsignName('');
  };

  const openSignModal = (policy) => {
    setSelectedPolicy(policy);
    setEsignChecked(false);
    setEsignName('');
  };

  // Filters
  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(policySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(policySearch.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.title.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  // Status style helpers
  const getTrainingStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
      case 'Not Started':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 p-4 md:p-6 transition-colors duration-300">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-[#2e6559] dark:text-[#3a8273]" />
            Policies & Training Matrix
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ensure regulatory compliance under Care Quality Commission (CQC) standards.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'policies'
                ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Policies & Sign-offs
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'training'
                ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Training Matrix
          </button>
          {isManagerial && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <History className="h-4 w-4" />
              Compliance Audit Trail
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: POLICIES COMPLIANCE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'policies' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* STATS OVERVIEW FOR MANAGERS */}
          {isManagerial && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute right-4 top-4 text-emerald-500/10">
                  <ShieldCheck className="h-16 w-16" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Compliance</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{policyStats.averagePercent}%</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${policyStats.averagePercent}%` }}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Signed Ledger</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{policyStats.totalSigned}</h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  Successfully archived e-signatures
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Signatures</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{policyStats.totalPending}</h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  Needs immediate staff review
                </p>
              </div>
            </div>
          )}

          {/* TWO PANEL LAYOUT: LEFT SIDE MY POLICIES (EMPLOYEE) | RIGHT SIDE COMPANY MATRIX (MANAGERS) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* PANEL: MY PERSONAL POLICIES CHECKLIST */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md ${isManagerial ? 'xl:col-span-4' : 'xl:col-span-12'}`}>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  {isManagerial ? 'My Policy Sign-off Status' : 'My Required Policies & Procedures'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Signed in under: <strong className="text-slate-700 dark:text-slate-300">{activeEmployee.name} ({activeEmployee.title})</strong>
                </p>
              </div>

              {/* LIST OF INDIVIDUAL POLICIES */}
              <div className="space-y-4">
                {policies.map(p => {
                  const isSignedObj = policySignatures[activeEmployee.id]?.[p.id];
                  const signed = isSignedObj?.signed;
                  
                  return (
                    <div 
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        signed 
                          ? 'bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800' 
                          : 'bg-amber-50/20 border-amber-200/50 dark:bg-amber-950/5 dark:border-amber-900/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {p.name}
                            <span className="text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                              {p.version}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {p.description}
                          </p>
                        </div>
                        
                        {signed ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/30 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/30 shrink-0">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Signed
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-100/30 dark:bg-amber-950/20 px-2.5 py-1 rounded-full border border-amber-200/50 dark:border-amber-900/30 shrink-0">
                            <Clock className="h-3.5 w-3.5" />
                            Pending
                          </span>
                        )}
                      </div>

                      {/* DETAILS / READ SIGN BUTTON */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {signed ? `Signature Lock: ${isSignedObj.signedAt}` : 'Required Compliance Check'}
                        </span>
                        
                        <button
                          onClick={() => openSignModal(p)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                            signed
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                              : 'bg-[#2e6559] text-white hover:bg-[#234d44] dark:bg-[#3a8273] dark:hover:bg-[#2e6559]'
                          }`}
                        >
                          {signed ? 'Read Document' : 'Read & Sign'}
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MANAGER LEDGER / COMPLIANCE REPORT GRID */}
            {isManagerial && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md xl:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Staff Compliance Report
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Check employee signatures and track training completion logs.
                    </p>
                  </div>

                  {/* Search box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs w-full focus:outline-none focus:border-teal-500 dark:focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Staff Member</th>
                        {policies.map(p => (
                          <th key={p.id} className="py-3 px-2 text-center" title={p.name}>
                            {p.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </th>
                        ))}
                        <th className="py-3 px-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredEmployees.map(emp => {
                        const sigs = policySignatures[emp.id] || {};
                        let signedCount = 0;
                        policies.forEach(p => {
                          if (sigs[p.id]?.signed) signedCount++;
                        });
                        const percent = Math.round((signedCount / policies.length) * 100);

                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                            <td className="py-3 px-2 flex items-center gap-3">
                              <img 
                                src={emp.photo} 
                                alt={emp.name}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                              />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{emp.name}</span>
                                <span className="text-[10px] text-slate-400 block">{emp.title}</span>
                              </div>
                            </td>
                            {policies.map(p => {
                              const item = sigs[p.id];
                              const signed = item?.signed;
                              
                              return (
                                <td key={p.id} className="py-3 px-2 text-center">
                                  {signed ? (
                                    <div className="inline-flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 p-1.5 rounded-full border border-emerald-500/20" title={`Signed at: ${item.signedAt}`}>
                                      <CheckCircle className="h-4 w-4" />
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center justify-center text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/5 p-1.5 rounded-full border border-rose-500/20" title="Awaiting signature">
                                      <XCircle className="h-4 w-4" />
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                                percent === 100 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : percent >= 50
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {percent}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TRAINING MATRIX */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'training' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* FUTURU.AI PROMOTION BANNER */}
          <div className="bg-gradient-to-r from-[#1b433b] to-[#2d6a4f] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="h-40 w-40" />
            </div>
            
            <div className="max-w-2xl space-y-4">
              <span className="bg-[#52b788] text-slate-950 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                AI Partners Integration
              </span>
              <h2 className="text-2xl md:text-3xl font-black leading-tight">
                Futuru.ai Digital Training Suite
              </h2>
              <p className="text-sm text-slate-200/90 leading-relaxed">
                Connect your AS Care account to Futuru.ai to access premium CQC training courses including Dementia Care, Hand Hygiene, and Safe Medication practices. Track completed certificates automatically.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://futuru.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#52b788] text-slate-950 hover:bg-[#40916c] px-5 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-md text-sm"
                >
                  Access Futuru.ai Training Center
                  <ExternalLink className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={handleFuturuSync}
                  disabled={isSyncing}
                  className={`inline-flex items-center gap-2 bg-[#3a8273] hover:bg-[#2e6559] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-md text-sm ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Certificates'}
                </button>
              </div>

              {isSyncing && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-teal-500/30 text-white space-y-2 max-w-xl animate-fadeIn">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-teal-300 flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {syncStepText}
                    </span>
                    <span className="font-mono">{syncProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-teal-400 to-[#52b788] h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute right-4 top-4 text-emerald-500/10">
                <Award className="h-16 w-16" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Training Compliance</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{trainingStats.completionPercent}%</h3>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${trainingStats.completionPercent}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Compliant Modules</span>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{trainingStats.completedCount}</h3>
              <p className="text-xs text-slate-400 mt-2">Certified (done within 11 months)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring Soon Warnings</span>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{trainingStats.inProgressCount}</h3>
              <p className="text-xs text-slate-400 mt-2">Due in 30 days (11-12 months)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired / Retraining Required</span>
              <h3 className="text-3xl font-black text-rose-500 dark:text-rose-400 mt-1">{trainingStats.notStartedCount}</h3>
              <p className="text-xs text-slate-400 mt-2">Overdue retraining (over 12 months)</p>
            </div>
          </div>

          {/* SPREADSHEET TOOLBAR */}
          <div className="flex flex-col xl:flex-row gap-6">
            
            {/* LEFT COLUMN: THE SPREADSHEET CONTAINER */}
            <div className="xl:col-span-3 flex-1 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Swan Training Compliance Spreadsheet
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ✏️ **Double-click** any name or date cell to edit inline. Compliance updates instantly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search staff name..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8.5 pr-3 py-1.5 text-xs w-48 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500"
                    />
                  </div>

                  {isManagerial && (
                    <>
                      <button
                        onClick={handleAddEmployee}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Row
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                      </button>

                      <button
                        onClick={triggerCSVImport}
                        className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Import CSV
                      </button>
                      <input
                        type="file"
                        id="csv-import-file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* THE GRID CONTAINER */}
              <div className="overflow-x-auto overflow-y-auto max-h-[550px] relative border border-slate-250 dark:border-slate-800 rounded-lg custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono select-none">
                  <thead>
                    {/* Excel column letters row (A, B, C...) */}
                    <tr className="bg-slate-100 dark:bg-slate-950 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-1 px-2 border-r border-slate-200 dark:border-slate-800 text-center bg-slate-200 dark:bg-slate-900 sticky left-0 z-35 min-w-[40px] shadow-sm">
                        
                      </th>
                      <th className="py-1 px-3 border-r border-slate-200 dark:border-slate-800 text-center sticky left-[40px] z-35 bg-slate-100 dark:bg-slate-950 min-w-[200px] shadow-sm">
                        A
                      </th>
                      {TRAINING_COURSES.map((c, idx) => (
                        <th key={c.id} className="py-1 px-2 border-r border-slate-200 dark:border-slate-800 text-center min-w-[150px]">
                          {String.fromCharCode(66 + idx)}
                        </th>
                      ))}
                      <th className="py-1 px-2 text-center min-w-[80px]">
                        {String.fromCharCode(66 + TRAINING_COURSES.length)}
                      </th>
                    </tr>

                    {/* Actual Course Header Name Row */}
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-b border-slate-250 dark:border-slate-850 font-bold uppercase text-[10.5px]">
                      <th className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold bg-slate-200 dark:bg-slate-900 sticky left-0 z-30 min-w-[40px] shadow-sm">
                        #
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800 sticky left-[40px] z-30 bg-slate-50 dark:bg-slate-900 min-w-[200px] shadow-sm">
                        Staff Member Name
                      </th>
                      {TRAINING_COURSES.map(course => (
                        <th key={course.id} className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-800 text-center min-w-[150px]" title={course.name}>
                          <div className="line-clamp-2 max-w-[140px] mx-auto text-center font-sans tracking-tight leading-tight">
                            {course.name}
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center min-w-[80px] font-sans tracking-tight">
                        CQC Ratio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                    {filteredEmployees.map((emp, empIdx) => {
                      const record = trainingMatrix[emp.id] || {};
                      
                      // Calculate compliance score
                      let greenCount = 0;
                      TRAINING_COURSES.forEach(c => {
                        const dateStr = record[c.id];
                        const statusObj = getTrainingStatus(dateStr);
                        if (statusObj.status === 'Compliant') greenCount++;
                      });
                      const score = Math.round((greenCount / TRAINING_COURSES.length) * 100);

                      return (
                        <tr 
                          key={emp.id} 
                          className="hover:bg-slate-50/20 dark:hover:bg-slate-950/10 transition-colors h-10 group"
                        >
                          {/* Row Number Column */}
                          <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center bg-slate-100 dark:bg-slate-900 text-slate-400 font-bold sticky left-0 z-20 min-w-[40px] shadow-sm">
                            {empIdx + 1}
                          </td>

                          {/* Employee Name Editable Column */}
                          <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 sticky left-[40px] z-20 bg-white dark:bg-slate-900 min-w-[200px] shadow-sm flex items-center gap-2 h-10 select-none">
                            <img 
                              src={emp.photo} 
                              alt={emp.name}
                              className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              {editingName === emp.id && isManagerial ? (
                                <input
                                  type="text"
                                  defaultValue={emp.name}
                                  onBlur={(e) => handleSaveName(emp.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveName(emp.id, e.target.value);
                                    if (e.key === 'Escape') setEditingName(null);
                                  }}
                                  autoFocus
                                  className="w-full bg-white dark:bg-slate-950 border border-teal-500 rounded px-1.5 py-0.5 outline-none font-bold text-slate-800 dark:text-white"
                                />
                              ) : (
                                <div 
                                  className="flex items-center justify-between gap-1 cursor-text"
                                  onDoubleClick={() => { if (isManagerial) setEditingName(emp.id); }}
                                  title="Double click to edit employee name"
                                >
                                  <span className="font-bold text-slate-850 dark:text-slate-100 truncate font-sans">
                                    {emp.name}
                                  </span>
                                  {isManagerial && (
                                    <Edit3 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition duration-150 shrink-0" />
                                  )}
                                </div>
                              )}
                              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block truncate font-sans mt-0.5 leading-none">
                                {emp.title}
                              </span>
                            </div>
                          </td>

                          {/* Training Dates Columns */}
                          {TRAINING_COURSES.map(course => {
                            const dateStr = record[course.id] || '';
                            const isEditing = editingCell?.employeeId === emp.id && editingCell?.courseId === course.id;
                            const statusObj = getTrainingStatus(dateStr);

                            return (
                              <td 
                                key={course.id} 
                                className={`p-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[150px] relative transition-colors duration-150 ${statusObj.bgClass}`}
                              >
                                {isEditing && isManagerial ? (
                                  <input
                                    type="date"
                                    defaultValue={dateStr}
                                    onBlur={(e) => handleSaveDate(emp.id, course.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveDate(emp.id, course.id, e.target.value);
                                      if (e.key === 'Escape') setEditingCell(null);
                                    }}
                                    autoFocus
                                    className="w-full bg-white dark:bg-slate-950 text-slate-850 dark:text-white border border-teal-500 rounded p-1 outline-none text-center shadow-md font-bold"
                                  />
                                ) : (
                                  <div 
                                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer min-h-[30px] font-bold"
                                    onDoubleClick={() => { if (isManagerial) setEditingCell({ employeeId: emp.id, courseId: course.id }); }}
                                    title="Double click to change completion date"
                                  >
                                    <span className="text-[11.5px] tracking-wide">
                                      {formatDateForDisplay(dateStr)}
                                    </span>
                                    <span className={`text-[8.5px] font-sans flex items-center gap-1 mt-0.5 opacity-80 leading-none`}>
                                      <span className={`h-1 w-1 rounded-full ${statusObj.dot}`} />
                                      {statusObj.status}
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          {/* Compliance Score Column */}
                          <td className="py-2 px-2 text-center min-w-[80px]">
                            <span className={`px-2.5 py-1.5 rounded font-bold font-sans ${
                              score === 100 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50' 
                                : score >= 50
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-200 dark:border-rose-900/50'
                            }`}>
                              {score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* RIGHT COLUMN: ACTION REQUIRED ALERTS SIDEBAR */}
            <div className="w-full xl:w-80 shrink-0 space-y-4">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    Required Actions
                  </h3>
                  <span className="text-[9.5px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full font-sans">
                    {getOverdueTrainingsList().length} Due
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-sans">
                  The following staff members have expired certifications (older than 1 year) or are missing training records.
                </p>

                {/* ALERTS TICKER CONTAINER */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {getOverdueTrainingsList().length === 0 ? (
                    <div className="text-center py-6 text-slate-400 italic text-[11.5px] font-sans">
                      🎉 All staff certifications are currently up to date!
                    </div>
                  ) : (
                    getOverdueTrainingsList().map((alertItem, idx) => (
                      <div 
                        key={`${alertItem.employeeId}-${alertItem.courseId}-${idx}`}
                        className="p-3 bg-rose-50/50 border border-rose-200/50 rounded-xl dark:bg-rose-950/5 dark:border-rose-900/40 space-y-2.5 transition hover:scale-[1.01] hover:shadow-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <img 
                            src={alertItem.employeePhoto} 
                            alt={alertItem.employeeName}
                            className="h-6.5 w-6.5 rounded-full object-cover ring-1 ring-rose-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block text-[11.5px] truncate font-sans">
                              {alertItem.employeeName}
                            </span>
                            <span className="text-[9px] text-slate-400 block leading-none mt-0.5 font-sans">
                              {alertItem.employeeTitle}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[10.5px] font-sans space-y-1.5">
                          <p className="text-slate-700 dark:text-slate-350">
                            Course: <strong className="text-slate-850 dark:text-white font-bold">{alertItem.courseName}</strong>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0 text-rose-500" />
                            {alertItem.dateCompleted ? (
                              <span>Expired ({alertItem.daysOverdue} days overdue)</span>
                            ) : (
                              <span className="text-rose-500 font-bold">No Record Found (Missing)</span>
                            )}
                          </p>
                        </div>

                        {isManagerial && (
                          <button
                            onClick={() => updateTrainingDate(alertItem.employeeId, alertItem.courseId, '2026-06-15')}
                            className="w-full mt-1.5 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg shadow-sm transition"
                          >
                            <Check className="h-3 w-3" />
                            Mark Retrained Today
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* SHEET RATINGS GRID LEGEND */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
                <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider block mb-3 font-sans">
                  Compliance Sheet Legend
                </h4>
                
                <div className="space-y-2.5 font-sans text-xs">
                  <div className="flex items-center gap-2.5 p-2 bg-emerald-50/70 border border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900/40 rounded-lg text-emerald-850 dark:text-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold leading-none">Compliant (Green)</p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1">Done within 11 months</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-amber-50/70 border border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/40 rounded-lg text-amber-850 dark:text-amber-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold leading-none">Expiring Soon (Amber)</p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1">Expires in 30 days (11-12 months)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-rose-50/70 border border-rose-250 dark:bg-rose-950/20 dark:border-rose-900/40 rounded-lg text-rose-850 dark:text-rose-450">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                    <div>
                      <p className="font-bold leading-none">Expired / Due (Red)</p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1">Expired or missing date</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: COMPLIANCE AUDIT TRAIL */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'audit' && isManagerial && (
        <div className="space-y-6 animate-fadeIn text-xs">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Compliance Audit Log Registry</h3>
              <p className="text-[10px] text-slate-500">Track and download regulatory audits, policy e-signatures, and training matrix updates.</p>
            </div>
            
            <button
              onClick={() => {
                const rows = employees.map(emp => {
                  const sigs = policySignatures[emp.id] || {};
                  const training = trainingMatrix[emp.id] || {};
                  const hsSig = sigs['health-safety']?.signed ? `Signed (${sigs['health-safety']?.signedAt})` : 'Pending';
                  const sgSig = sigs['safeguarding']?.signed ? `Signed (${sigs['safeguarding']?.signedAt})` : 'Pending';
                  const gdprSig = sigs['gdpr']?.signed ? `Signed (${sigs['gdpr']?.signedAt})` : 'Pending';
                  const wbSig = sigs['whistleblowing']?.signed ? `Signed (${sigs['whistleblowing']?.signedAt})` : 'Pending';
                  const icSig = sigs['infection-control']?.signed ? `Signed (${sigs['infection-control']?.signedAt})` : 'Pending';
                  
                  return [
                    emp.id,
                    `"${emp.name}"`,
                    `"${emp.title}"`,
                    `"H&S: ${hsSig} | Safeguard: ${sgSig} | GDPR: ${gdprSig} | Whistleblow: ${wbSig} | IPC: ${icSig}"`,
                    `"${training.medication || 'Not Started'}"`,
                    `"${training['moving-handling'] || 'Not Started'}"`,
                    `"${training['fire-safety'] || 'Not Started'}"`,
                    `"${training['infection-control'] || 'Not Started'}"`,
                    `"${training['dementia-care'] || 'Not Started'}"`
                  ];
                });
                
                const csvHeaders = ['Employee ID', 'Employee Name', 'Role Title', 'Policies Signature Summary', 'Medication Training', 'Moving & Handling Training', 'Fire Safety Training', 'Infection Control Training', 'Dementia Care Training'];
                const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders.join(','), ...rows.map(r => r.join(','))].join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `staff_compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
              Export Compliance Report (CSV)
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Version History / E-Signature Tracker */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Signature Version Archive
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Select an employee and policy to view signature audit logs and previous version records.</p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Employee</label>
                  <select 
                    value={auditEmployeeId}
                    onChange={(e) => setAuditEmployeeId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.title})</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Policy Document</label>
                  <select 
                    value={auditPolicyId}
                    onChange={(e) => setAuditPolicyId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    {policies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Signature Version History</span>
                  {(() => {
                    const sigRecord = policySignatures[auditEmployeeId]?.[auditPolicyId];
                    const history = sigRecord?.history || [];
                    
                    if (history.length === 0) {
                      return (
                        <p className="text-[10px] text-slate-400 italic">No signature version records found.</p>
                      );
                    }
                    
                    return (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {history.map((hist, hIdx) => (
                          <div key={hIdx} className="p-2 rounded-lg bg-slate-50 border dark:bg-slate-950 dark:border-slate-850 flex justify-between items-center text-[10.5px]">
                            <div>
                              <span className="font-bold text-slate-800 dark:text-white">Version {hist.version}</span>
                              <p className="text-[9px] text-slate-400 mt-0.5">Signed by {hist.user}</p>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono font-semibold">{hist.signedAt}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* General Compliance Ledger / Timeline */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-4 w-4 text-indigo-500" />
                  Compliance Activity Logs
                </h4>
                
                {/* Type Filter */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border dark:border-slate-850">
                  {['All', 'Policy', 'Training'].map(type => (
                    <button
                      key={type}
                      onClick={() => setAuditTypeFilter(type)}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all ${
                        auditTypeFilter === type
                          ? 'bg-white text-slate-850 shadow-xs dark:bg-slate-800 dark:text-white'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs List */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {complianceLogs
                  .filter(log => auditTypeFilter === 'All' || log.type === auditTypeFilter)
                  .map(log => {
                    const isPolicy = log.type === 'Policy';
                    return (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800 flex justify-between items-start gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold ${
                              isPolicy 
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400' 
                                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-955/20 dark:text-indigo-400'
                            }`}>
                              {log.type}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-white">{log.action}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300">{log.details}</p>
                          <p className="text-[9px] text-slate-400">Triggered by: <span className="font-bold">{log.user}</span></p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0 font-semibold">{log.timestamp}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: POLICY DOCUMENT READER (WITH E-SIGN) */}
      {/* ------------------------------------------------------------- */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scaleUp">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#2e6559] dark:text-[#3a8273]" />
                  {selectedPolicy.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  Document Version: {selectedPolicy.version} | Category: {selectedPolicy.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 font-sans custom-scrollbar whitespace-pre-line">
              {POLICY_CONTENTS[selectedPolicy.id] || "No content available for this policy."}
            </div>

            {/* Signature Area */}
            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 p-6 space-y-4">
              
              {/* Check signature status */}
              {policySignatures[activeEmployee.id]?.[selectedPolicy.id]?.signed ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">E-Signature Valid & Document Locked</p>
                    <p className="mt-0.5 opacity-90">Signed by: {activeEmployee.name} on {policySignatures[activeEmployee.id][selectedPolicy.id].signedAt}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmSignature} className="space-y-4">
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="esignConfirm"
                      checked={esignChecked}
                      onChange={(e) => setEsignChecked(e.target.checked)}
                      className="mt-0.5 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                    />
                    <label htmlFor="esignConfirm" className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed select-none cursor-pointer">
                      I confirm that I have fully read, understood, and agree to abide by the principles, guidelines, and responsibilities detailed in this policy document.
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <label htmlFor="esignName" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Print Full Name (To Sign)
                      </label>
                      <input
                        type="text"
                        id="esignName"
                        required
                        value={esignName}
                        placeholder={activeEmployee.name}
                        onChange={(e) => setEsignName(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:border-teal-500 dark:focus:border-teal-500"
                      />
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPolicy(null)}
                        className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#2e6559] hover:bg-[#234d44] text-white dark:bg-[#3a8273] dark:hover:bg-[#2e6559] text-xs font-bold px-5 py-2.5 rounded-xl transition"
                      >
                        Confirm E-Signature
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TRAINING CELL EDITOR (MANAGERS ONLY) */}
      {/* ------------------------------------------------------------- */}
      {selectedTrainingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-scaleUp">
            
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Training records</h4>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedTrainingCell.employeeName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrainingCell(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Training Module</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {selectedTrainingCell.courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Current Status</span>
                <div className="grid grid-cols-1 gap-2">
                  {['Completed', 'In Progress', 'Not Started'].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => {
                        updateTrainingStatus(selectedTrainingCell.employeeId, selectedTrainingCell.courseId, statusOption);
                        setSelectedTrainingCell(null);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold border transition text-left ${
                        selectedTrainingCell.currentStatus === statusOption
                          ? 'bg-teal-50 border-teal-300 text-teal-800 dark:bg-teal-950/30 dark:border-teal-800 dark:text-teal-400 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        statusOption === 'Completed' 
                          ? 'bg-emerald-500' 
                          : statusOption === 'In Progress' 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                      }`} />
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
              <button
                onClick={() => setSelectedTrainingCell(null)}
                className="bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-950 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PoliciesAndTraining;
