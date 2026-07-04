import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  INITIAL_OPEN_SHIFTS,
  INITIAL_ATTENDANCE,
  INITIAL_AUDITS,
  INITIAL_VISITORS,
  INITIAL_LEAVE,
  INITIAL_NOTIFICATIONS,
  buildInitialDocuments,
  MANDATORY_DOCS,
  INITIAL_DAY_NOTES,
  INITIAL_OBSERVATIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_TEMPLATES,
  INITIAL_POLICIES,
  INITIAL_POLICY_SIGNATURES,
  INITIAL_TRAINING_MATRIX,
  TRAINING_COURSES
} from '../utils/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // Auth and session state — restored from sessionStorage on refresh
  const [isLoggedIn, setIsLoggedInState] = useState(() => {
    return sessionStorage.getItem('session_active') === 'true';
  });

  // Role and routing navigation state — restored from sessionStorage
  const [currentRole, setCurrentRoleState] = useState(() => {
    return sessionStorage.getItem('session_role') || 'Admin';
  });
  const [currentView, setCurrentViewState] = useState(() => {
    return sessionStorage.getItem('session_view') || 'dashboard';
  });

  // Wrapper setters that also persist to sessionStorage
  const setIsLoggedIn = (val) => {
    if (val) {
      sessionStorage.setItem('session_active', 'true');
    } else {
      // Clear entire session on logout
      sessionStorage.removeItem('session_active');
      sessionStorage.removeItem('session_role');
      sessionStorage.removeItem('session_view');
    }
    setIsLoggedInState(val);
  };

  const setCurrentView = (view) => {
    sessionStorage.setItem('session_view', view);
    setCurrentViewState(view);
  };

  // Data state
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 14) return parsed;
    }
    return INITIAL_EMPLOYEES;
  });
  const [documents, setDocuments] = useState(buildInitialDocuments(INITIAL_EMPLOYEES));
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [openShifts, setOpenShifts] = useState(INITIAL_OPEN_SHIFTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [leave, setLeave] = useState(INITIAL_LEAVE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [dayNotes, setDayNotes] = useState(INITIAL_DAY_NOTES);
  const [observations, setObservations] = useState(INITIAL_OBSERVATIONS);
  const [observationTemplates, setObservationTemplates] = useState([
    {
      id: 'temp-vital-signs',
      name: 'Vital Signs',
      category: 'Clinical',
      fields: [
        { id: 'temp', label: 'Body Temperature', type: 'number', unit: '°C', required: true },
        { id: 'pulse', label: 'Pulse Rate', type: 'number', unit: 'bpm', required: true },
        { id: 'bp', label: 'Blood Pressure', type: 'text', unit: 'mmHg', required: false },
        { id: 'spo2', label: 'SpO2 Oxygen', type: 'number', unit: '%', required: false }
      ]
    },
    {
      id: 'temp-fluid-intake',
      name: 'Fluid Intake',
      category: 'Nutrition',
      fields: [
        { id: 'volume', label: 'Intake Volume', type: 'number', unit: 'ml', required: true },
        { id: 'type', label: 'Fluid Type', type: 'select', options: ['Water', 'Tea/Coffee', 'Juice', 'Soup'], required: true },
        { id: 'refused', label: 'Refused', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'temp-behaviour-log',
      name: 'Behaviour Log',
      category: 'Behaviour',
      fields: [
        { id: 'scale', label: 'Agitation Scale', type: 'select', options: ['1 - Calm', '2 - Restless', '3 - Verbally Aggressive', '4 - Physically Aggressive'], required: true },
        { id: 'trigger', label: 'Trigger Notes', type: 'textarea', required: false }
      ]
    }
  ]);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [residentRiskAssessments, setResidentRiskAssessments] = useState([
    {
      id: 'RA-101',
      resident: 'Eleanor Vance',
      type: 'Waterlow',
      date: '2026-05-15',
      time: '10:30',
      assessor: 'Sarah Jenkins',
      score: 16,
      categoryLabel: 'High Risk',
      details: { build: 2, skin: 1, sexAge: 6, mobility: 3, nutrition: 2, specialRisk: 2 }
    },
    {
      id: 'RA-102',
      resident: 'Eleanor Vance',
      type: 'MUST',
      date: '2026-05-20',
      time: '11:15',
      assessor: 'James Carter',
      score: 1,
      categoryLabel: 'Medium Risk (Monitor)',
      details: { bmiScore: 0, weightLossScore: 1, acuteDiseaseScore: 0 }
    },
    {
      id: 'RA-103',
      resident: 'Arthur Pendelton',
      type: 'Waterlow',
      date: '2026-05-25',
      time: '09:00',
      assessor: 'Amira Patel',
      score: 11,
      categoryLabel: 'At Risk',
      details: { build: 1, skin: 1, sexAge: 5, mobility: 2, nutrition: 1, specialRisk: 1 }
    },
    {
      id: 'RA-104',
      resident: 'Arthur Pendelton',
      type: 'PEEP',
      date: '2026-05-28',
      time: '14:20',
      assessor: 'Sarah Jenkins',
      score: 0,
      categoryLabel: 'Requires Assistance',
      details: { mobilityLevel: 'Requires 1 Assistant', evacEquipment: 'Evacuation Chair', cognitiveStatus: 'Mild Confusion', dayNotes: 'Assisted evacuation via rear exit stairwell.', nightNotes: 'Night team to assist from bed to chair.' }
    },
    {
      id: 'RA-105',
      resident: 'Mary Green',
      type: 'Waterlow',
      date: '2026-06-01',
      time: '15:00',
      assessor: 'James Carter',
      score: 22,
      categoryLabel: 'Very High Risk',
      details: { build: 3, skin: 2, sexAge: 6, mobility: 4, nutrition: 3, specialRisk: 4 }
    }
  ]);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [policySignatures, setPolicySignatures] = useState(() => {
    const seededSigs = {};
    Object.keys(INITIAL_POLICY_SIGNATURES).forEach(empId => {
      seededSigs[empId] = {};
      Object.keys(INITIAL_POLICY_SIGNATURES[empId]).forEach(polId => {
        const record = INITIAL_POLICY_SIGNATURES[empId][polId];
        const empName = INITIAL_EMPLOYEES.find(e => e.id === empId)?.name || 'Staff';
        if (record.signed) {
          const history = [
            { version: 'v1.0', signedAt: '2024-05-10 10:00 AM', user: empName },
            { version: 'v2.0', signedAt: '2025-05-12 11:30 AM', user: empName },
            { version: 'v3.0', signedAt: record.signedAt || '2026-05-10 09:30 AM', user: empName }
          ];
          seededSigs[empId][polId] = {
            ...record,
            history
          };
        } else {
          seededSigs[empId][polId] = {
            ...record,
            history: []
          };
        }
      });
    });
    return seededSigs;
  });
  const [trainingMatrix, setTrainingMatrix] = useState(() => {
    const saved = localStorage.getItem('training_matrix');
    if (saved) {
      const parsed = JSON.parse(saved);
      const keys = Object.keys(parsed);
      if (keys.length >= 14 && parsed[keys[0]] && parsed[keys[0]].medication !== 'Completed') {
        return parsed;
      }
    }
    return INITIAL_TRAINING_MATRIX;
  });
  const [complianceLogs, setComplianceLogs] = useState([
    {
      id: 'CL-101',
      timestamp: '2026-06-01 10:15',
      action: 'Policy Signed',
      details: 'Sarah Jenkins signed Health & Safety Policy (v3.2)',
      user: 'Sarah Jenkins',
      type: 'Policy'
    },
    {
      id: 'CL-102',
      timestamp: '2026-06-02 14:00',
      action: 'Training Completed',
      details: 'James Carter completed Dementia Care training (via Futuru.ai sync)',
      user: 'James Carter',
      type: 'Training'
    },
    {
      id: 'CL-103',
      timestamp: '2026-06-03 09:30',
      action: 'Policy Version Updated',
      details: 'GDPR Policy updated from v1.9 to v2.0',
      user: 'Admin User',
      type: 'Policy'
    },
    {
      id: 'CL-104',
      timestamp: '2026-06-04 11:45',
      action: 'Training Status Updated',
      details: 'Elena Rostova status for Fire Safety changed to In Progress',
      user: 'Sarah Jenkins (Manager)',
      type: 'Training'
    }
  ]);
  const [customAuditCategories, setCustomAuditCategories] = useState([]);

  // Kitchen Logs state (digitized checklists & temperatures from photos)
  const [kitchenLogs, setKitchenLogs] = useState(() => {
    const saved = localStorage.getItem('kitchen_logs');
    if (saved) return JSON.parse(saved);
    return {
      temperatures: [
        { id: 'kt-1', date: '2026-06-13', time: '08:30 AM', equipment: 'Fridge 1', temp: 3.2, notes: 'Within range', signedBy: 'Carol Foss' },
        { id: 'kt-2', date: '2026-06-13', time: '08:35 AM', equipment: 'Fridge 2', temp: 4.0, notes: 'Within range', signedBy: 'Carol Foss' },
        { id: 'kt-3', date: '2026-06-13', time: '08:40 AM', equipment: 'Freezer 1', temp: -19, notes: 'Within range', signedBy: 'Carol Foss' },
        { id: 'kt-4', date: '2026-06-13', time: '08:45 AM', equipment: 'Freezer 2', temp: -20, notes: 'Within range', signedBy: 'Carol Foss' },
        { id: 'kt-5', date: '2026-06-13', time: '12:40 PM', equipment: 'Oven', temp: 84, notes: 'Cooked Porridge', signedBy: 'Carol Foss' }
      ],
      cleaningDaily: {},
      cleaningWeekly: {},
      issues: [
        { id: 'ki-1', area: 'Sink area', date: '2026-06-10', cleaned: 'N', reason: 'Leaking tap', actionRequired: 'Y', details: 'Plumber called', responsible: 'Marcus Vance', targetDate: '2026-06-15', actualDate: '', signature: 'Carol Foss', managerSign: '' }
      ],
      sfbbDiary: [
        { id: 'kd-1', date: '2026-06-13', openingSigned: 'Carol Foss', closingSigned: 'Carol Foss', comments: 'All clean, no issues.' }
      ]
    };
  });

  // Audit Matrix Schedule state (representing audit matrix Schedule.xlsx)
  const [auditMatrix, setAuditMatrix] = useState(() => {
    const saved = localStorage.getItem('audit_matrix_v2');
    if (saved) return JSON.parse(saved);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const categories = [
      "First aid", "environmental", "infection control", "Meds weekly", "meds monthly", 
      "Meal time audit", "Covert meds", "CD meds", "Homely remedies", "Storage of Medication", 
      "ordering and receipt of medication", "Disposal of medication", "High risk medication", 
      "Care plan audit", "dignity audit", "Fire Safety", "Health and safety", "Dependancy", 
      "Kitchen Audit", "Grab bag audit", "Pressure cushion audit", "Matress", "MCA/DOLS", 
      "Maintenance audit", "Cleaning standards audit", "Window restrictors", "Accident & Incident", "Weight Loss"
    ];
    return categories.map(cat => {
      const row = { category: cat };
      months.forEach(m => {
        row[m] = { planned: '', actual: '', score: '' };
      });
      return row;
    });
  });

  // Supervision & Appraisal Matrix state (S. Supervision&Appraisal Schedule Matrix.xlsx)
  const [supervisionMatrix, setSupervisionMatrix] = useState(() => {
    const saved = localStorage.getItem('supervision_matrix');
    if (saved) return JSON.parse(saved);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return INITIAL_EMPLOYEES.map(emp => {
      const row = { employeeId: emp.id, name: emp.name, title: emp.title };
      months.forEach(m => {
        row[m] = { planned: '', actual: '', code: '' };
      });
      // Seed some data
      row['Jan'].planned = '28.01.26';
      row['Jan'].actual = '28.01.26';
      row['Jan'].code = 'TM';
      
      row['Feb'].planned = '26.02.26';
      row['Feb'].actual = '26.02.26';
      row['Feb'].code = 'S';
      return row;
    });
  });

  useEffect(() => {
    localStorage.setItem('kitchen_logs', JSON.stringify(kitchenLogs));
  }, [kitchenLogs]);

  useEffect(() => {
    localStorage.setItem('audit_matrix_v2', JSON.stringify(auditMatrix));
  }, [auditMatrix]);

  useEffect(() => {
    localStorage.setItem('supervision_matrix', JSON.stringify(supervisionMatrix));
  }, [supervisionMatrix]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('training_matrix', JSON.stringify(trainingMatrix));
  }, [trainingMatrix]);

  // Initial Audit Dates (Reminders Engine)
  const [initialAuditDates, setInitialAuditDates] = useState(() => {
    const saved = localStorage.getItem('initial_audit_dates');
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    localStorage.setItem('initial_audit_dates', JSON.stringify(initialAuditDates));
  }, [initialAuditDates]);

  // Fire & Compliance Certificates state
  const [fireCertificates, setFireCertificates] = useState(() => {
    const saved = localStorage.getItem('fire_certificates');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'fire-emerg-light', name: 'Emergency Light Test Certificate', frequency: '6 Months', lastCompleted: '2026-03-15', renewalDate: '2026-09-15', completedBy: 'G.P. MASONS', status: 'Valid', file: 'emerg_light_cert_mar26.pdf' },
      { id: 'fire-alarm', name: 'Fire Alarm System Maintenance', frequency: '6 Months', lastCompleted: '2026-03-15', renewalDate: '2026-09-15', completedBy: 'G.P. MASON', status: 'Valid', file: 'fire_alarm_cert_mar26.pdf' },
      { id: 'fire-equipment', name: 'Fire Equipment / Extinguishers', frequency: 'Yearly', lastCompleted: '2026-03-20', renewalDate: '2027-03-20', completedBy: 'G.P. MASON', status: 'Valid', file: 'fire_ext_cert_mar26.pdf' }
    ];
  });

  const [complianceCertificates, setComplianceCertificates] = useState(() => {
    const saved = localStorage.getItem('compliance_certificates');
    const initialList = [
      { id: 'comp-lift-loler', name: 'Lift LOLER Inspection', frequency: '6 Months', lastCompleted: '2026-04-10', renewalDate: '2026-10-10', completedBy: 'Otis Elevators', status: 'Valid', file: 'lift_loler_apr26.pdf' },
      { id: 'comp-lift-service', name: 'Lift Servicing', frequency: '6 Months', lastCompleted: '2026-04-10', renewalDate: '2026-10-10', completedBy: 'Otis Elevators', status: 'Valid', file: 'lift_service_apr26.pdf' },
      { id: 'comp-clinical-waste', name: 'Clinical Waste Certificate', frequency: 'Yearly', lastCompleted: '2026-05-12', renewalDate: '2027-05-12', completedBy: 'WasteCare Ltd', status: 'Valid', file: 'clinical_waste_may26.pdf' },
      { id: 'comp-pat', name: 'PAT Testing', frequency: 'Yearly', lastCompleted: '2025-10-15', renewalDate: '2026-10-15', completedBy: 'Birmingham PAT Services', status: 'Valid', file: 'pat_test_oct25.pdf' },
      { id: 'comp-biomass', name: 'Biomass Boiler Remote Service', frequency: 'Serviced', lastCompleted: '2025-07-04', renewalDate: '2026-07-04', completedBy: 'Biomass Engineers Ltd', status: 'Valid', file: 'biomass_serv_jul25.pdf' },
      { id: 'comp-loler-hoist', name: 'LOLER Testing - Hoist', frequency: '6 Months', lastCompleted: '2026-02-18', renewalDate: '2026-08-18', completedBy: 'HoistSafe Co', status: 'Valid', file: 'loler_hoist_feb26.pdf' },
      { id: 'comp-loler-sling', name: 'LOLER Testing - Sling', frequency: '6 Months', lastCompleted: '2026-02-18', renewalDate: '2026-08-18', completedBy: 'HoistSafe Co', status: 'Valid', file: 'loler_sling_feb26.pdf' },
      { id: 'comp-loler-bath-sling', name: 'LOLER Testing - Bath Sling', frequency: '6 Months', lastCompleted: '2026-02-18', renewalDate: '2026-08-18', completedBy: 'HoistSafe Co', status: 'Valid', file: 'loler_bath_sling_feb26.pdf' },
      { id: 'comp-loler-standing-aid', name: 'LOLER Testing - Standing Aid', frequency: '6 Months', lastCompleted: '2026-02-18', renewalDate: '2026-08-18', completedBy: 'HoistSafe Co', status: 'Valid', file: 'loler_standing_feb26.pdf' },
      { id: 'comp-legionella', name: 'Legionella Testing', frequency: '2 Years', lastCompleted: '2025-09-10', renewalDate: '2027-09-10', completedBy: 'AquaClear Labs', status: 'Valid', file: 'legionella_sept25.pdf' },
      { id: 'comp-risk-assess', name: 'Risk Assessments', frequency: 'Yearly', lastCompleted: '2025-11-20', renewalDate: '2026-11-20', completedBy: 'AS Care Safety Team', status: 'Valid', file: 'risk_assess_nov25.pdf' },
      { id: 'comp-employer-liability', name: 'Employer\'s Liability', frequency: 'Yearly', lastCompleted: '2026-05-01', renewalDate: '2027-05-01', completedBy: 'Aviva Insurance', status: 'Valid', file: 'employers_liability_may26.pdf' },
      { id: 'comp-ico', name: 'ICO Registration', frequency: 'Yearly', lastCompleted: '2026-01-15', renewalDate: '2027-01-15', completedBy: 'Information Commissioner', status: 'Valid', file: 'ico_reg_jan26.pdf' },
      { id: 'comp-elec-safety', name: 'Electrical Safety (EICR)', frequency: '5 Years', lastCompleted: '2023-07-15', renewalDate: '2028-07-15', completedBy: 'PowerCheck Ltd', status: 'Valid', file: 'electrical_safety_jul23.pdf' }
    ];
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasNewItems = parsed.some(item => item.id === 'comp-loler-hoist');
      if (hasNewItems) return parsed;
    }
    return initialList;
  });

  const [activeManager, setActiveManager] = useState(() => {
    const saved = localStorage.getItem('active_manager_details');
    if (saved) return JSON.parse(saved);
    return { name: 'Sarah Jenkins', changeDate: '2026-06-01' };
  });

  const [fireSignatures, setFireSignatures] = useState(() => {
    const saved = localStorage.getItem('fire_signatures');
    if (saved) return JSON.parse(saved);
    return {
      'EMP-001': { signed: true, signedAt: '2026-06-11 10:15 AM', signatureName: 'Sarah Jenkins' },
      'EMP-002': { signed: false, signedAt: '', signatureName: '' },
      'EMP-003': { signed: true, signedAt: '2026-06-12 04:30 PM', signatureName: 'Amira Patel' },
      'EMP-004': { signed: false, signedAt: '', signatureName: '' },
      'EMP-005': { signed: false, signedAt: '', signatureName: '' },
      'EMP-006': { signed: true, signedAt: '2026-06-11 02:45 PM', signatureName: 'Marcus Vance' },
      'EMP-007': { signed: false, signedAt: '', signatureName: '' },
      'EMP-008': { signed: false, signedAt: '', signatureName: '' }
    };
  });

  useEffect(() => {
    localStorage.setItem('fire_certificates', JSON.stringify(fireCertificates));
  }, [fireCertificates]);

  useEffect(() => {
    localStorage.setItem('compliance_certificates', JSON.stringify(complianceCertificates));
  }, [complianceCertificates]);

  useEffect(() => {
    localStorage.setItem('active_manager_details', JSON.stringify(activeManager));
  }, [activeManager]);

  useEffect(() => {
    localStorage.setItem('fire_signatures', JSON.stringify(fireSignatures));
  }, [fireSignatures]);

  // Reminders and Recurrence Engine
  useEffect(() => {
    const runRemindersEngine = () => {
      const refDate = new Date('2026-06-15'); // Current system active date reference
      
      // Calculate and auto-schedule recurring audits based on initialAuditDates
      const newAuditsToAppend = [];
      
      Object.entries(initialAuditDates).forEach(([auditType, startDateStr]) => {
        if (!startDateStr) return;
        const startDate = new Date(startDateStr);
        // Generate monthly recurrence for up to 6 months
        for (let i = 0; i < 6; i++) {
          const nextDate = new Date(startDate);
          nextDate.setMonth(startDate.getMonth() + i);
          const dateStr = nextDate.toISOString().split('T')[0];
          
          // Check if an audit of this type and scheduled date already exists
          const exists = audits.some(a => a.type === auditType && a.scheduledDate === dateStr);
          if (!exists) {
            newAuditsToAppend.push({
              id: `AUD-REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              type: auditType,
              scheduledDate: dateStr,
              officerId: 'EMP-006', // Default to Marcus Vance (Lead Compliance Officer)
              status: 'Pending',
              lastCompleted: 'Never',
              score: null
            });
          }
        }
      });
      
      if (newAuditsToAppend.length > 0) {
        setAudits(prev => [...prev, ...newAuditsToAppend]);
      }
      
      // Check audits for alerts/reminders
      let auditsUpdated = false;
      const updatedAudits = audits.map(audit => {
        if (audit.status !== 'Completed') {
          const scheduled = new Date(audit.scheduledDate);
          const diffTime = refDate - scheduled;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0) {
            // Flag employee reminder
            const reminderText = `Reminder: Audit "${audit.type}" is scheduled for ${audit.scheduledDate}.`;
            const isReminderExist = notifications.some(n => n.text === reminderText);
            if (!isReminderExist) {
              addNotification('info', reminderText);
            }
          }
          
          if (diffDays > 3) {
            // Alert Admin/Manager if not Completed within 3 days after target date
            const alertText = `⚠️ OVERDUE ALERT: Audit "${audit.type}" (scheduled: ${audit.scheduledDate}) is overdue by ${diffDays} days!`;
            const isAlertExist = notifications.some(n => n.text === alertText);
            if (!isAlertExist) {
              addNotification('alert', alertText);
            }
            if (audit.status !== 'Overdue') {
              auditsUpdated = true;
              return { ...audit, status: 'Overdue' };
            }
          }
        }
        return audit;
      });

      // Check MCA DoLS reminders (1 and 2 months before expiry based on refDate 2026-06-15)
      const dolsExpiries = [
        { name: "Arthur Pendelton", expiryDate: "2026-07-15", period: "1 month" },
        { name: "Mary Green", expiryDate: "2026-08-15", period: "2 months" }
      ];
      dolsExpiries.forEach(d => {
        const dolsText = `⚖️ MCA DoLS Reminder: ${d.name}'s DoLS authorization is expiring in ${d.period} (${d.expiryDate}).`;
        const exists = notifications.some(n => n.text === dolsText);
        if (!exists) {
          addNotification('warning', dolsText);
        }
      });

      if (auditsUpdated) {
        setAudits(updatedAudits);
      }
    };
    
    const timer = setTimeout(runRemindersEngine, 1000);
    return () => clearTimeout(timer);
  }, [initialAuditDates, audits.length]);

  // Active Employee state (used when role is Employee)
  const [activeEmployeeId, setActiveEmployeeId] = useState('EMP-002');
  
  // Live employee Clock tracker state
  const [clockState, setClockState] = useState({
    status: 'Clocked Out',
    timeIn: null,
    breakStart: null,
    totalBreaks: 0,
    timer: 0
  });

  // Global state for onboarding modal view, used to conditionally hide layout
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Global document compliance filter state
  const [docStatusFilter, setDocStatusFilter] = useState('All');

  // Load theme preference on start
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sync theme changes
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Switch role — persists role
  const handleRoleChange = (role) => {
    sessionStorage.setItem('session_role', role);
    setCurrentRoleState(role);
  };

  // Add shift assignment helper
  const addShift = (day, type, employeeId, role) => {
    // Basic Rota Compliance validation
    // Rule 1: 12-Hour Rest Check
    const employeeShifts = shifts.filter(s => s.employeeId === employeeId && s.day === day);
    if (employeeShifts.length > 0) {
      alert(`⚠️ Rota Compliance Alert: ${employees.find(e => e.id === employeeId)?.name} already has a shift assigned on ${day}. Doubling shifts is flagged for rest periods!`);
    }

    // Rule 2: 6-Day Work Rule
    const totalWeeklyShifts = shifts.filter(s => s.employeeId === employeeId).length;
    if (totalWeeklyShifts >= 6) {
      alert(`⚠️ Safety Alert: ${employees.find(e => e.id === employeeId)?.name} has worked ${totalWeeklyShifts} shifts this week. Maximum safe working standard is 6 consecutive days.`);
    }

    // Rule 3: Approved Leave Check
    const dates = {
      "Monday": "2026-06-01",
      "Tuesday": "2026-06-02",
      "Wednesday": "2026-06-03",
      "Thursday": "2026-06-04",
      "Friday": "2026-06-05",
      "Saturday": "2026-06-06",
      "Sunday": "2026-06-07"
    };
    const dateStr = dates[day];
    if (dateStr && leave) {
      const leaveOnDay = leave.find(l => 
        l.employeeId === employeeId && 
        l.status === 'Approved' && 
        dateStr >= l.start && 
        dateStr <= l.end
      );
      if (leaveOnDay) {
        alert(`⚠️ Rota Compliance Alert: ${employees.find(e => e.id === employeeId)?.name} is on approved leave (${leaveOnDay.type}) on ${day} (${dateStr})!`);
      }
    }

    const newShift = {
      id: `S-${Date.now()}`,
      employeeId,
      day,
      type,
      role
    };

    setShifts(prev => [...prev, newShift]);
    addNotification('info', `Shift assigned to ${employees.find(e => e.id === employeeId)?.name} on ${day} (${type})`);
  };

  // Remove shift assignment
  const removeShift = (shiftId) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      const empName = employees.find(e => e.id === shift.employeeId)?.name;
      setShifts(prev => prev.filter(s => s.id !== shiftId));
      addNotification('warning', `Cancelled shift for ${empName} on ${shift.day} (${shift.type})`);
    }
  };

  // Claim Open Shift helper
  const claimOpenShift = (openShiftId, employeeId) => {
    const openShift = openShifts.find(os => os.id === openShiftId);
    const emp = employees.find(e => e.id === employeeId);
    
    if (openShift && emp) {
      // Compliance Validations:
      // 12-Hour Rest Check on that day
      const sameDayShifts = shifts.filter(s => s.employeeId === employeeId && s.day === openShift.day);
      if (sameDayShifts.length > 0) {
        alert(`❌ Compliance Warning: You are already assigned a shift on ${openShift.day}. The 12-hour mandatory rest rule prevents you from claiming this.`);
        return false;
      }
      
      // 6-Day consecutive work check
      const weeklyShiftsCount = shifts.filter(s => s.employeeId === employeeId).length;
      if (weeklyShiftsCount >= 6) {
        alert(`❌ Safety Rest Warning: You have already scheduled 6 shifts this week. Standard healthcare compliance protects you against working 7 consecutive days.`);
        return false;
      }

      // Approved Leave check on that day
      const dates = {
        "Monday": "2026-06-01",
        "Tuesday": "2026-06-02",
        "Wednesday": "2026-06-03",
        "Thursday": "2026-06-04",
        "Friday": "2026-06-05",
        "Saturday": "2026-06-06",
        "Sunday": "2026-06-07"
      };
      const dateStr = dates[openShift.day];
      if (dateStr && leave) {
        const leaveOnDay = leave.find(l => 
          l.employeeId === employeeId && 
          l.status === 'Approved' && 
          dateStr >= l.start && 
          dateStr <= l.end
        );
        if (leaveOnDay) {
          alert(`❌ Compliance Warning: You are on approved leave (${leaveOnDay.type}) on ${openShift.day} (${dateStr}). You cannot claim shifts on this day.`);
          return false;
        }
      }

      // Add to shifts
      addShift(openShift.day, openShift.type, employeeId, openShift.role);
      // Remove from open shifts
      setOpenShifts(prev => prev.filter(os => os.id !== openShiftId));
      addNotification('success', `${emp.name} successfully claimed Open Shift for ${openShift.day} (${openShift.type})`);
      return true;
    }
    return false;
  };

  // Create Open Shift helper
  const createOpenShift = (day, type, role, reason) => {
    const newOpen = {
      id: `OS-${Date.now()}`,
      day,
      type,
      role,
      reason: reason || "Operational demand requirement"
    };
    setOpenShifts(prev => [...prev, newOpen]);
    addNotification('alert', `New Open Shift created: ${day} (${type}) for ${role}`);
  };

  // Notifications system helper
  const addNotification = (type, text) => {
    const newNotif = {
      id: `N-${Date.now()}`,
      type, // 'alert', 'info', 'warning', 'success'
      text,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Clock operations helpers
  const handleClockIn = (employeeId, location = "Oakfield care home", locationMeta = null) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    // Determine status (Late after 08:05 AM)
    let status = "On Time";
    const minutes = now.getMinutes();
    const hours = now.getHours();
    if (hours > 8 || (hours === 8 && minutes > 5)) {
      status = "Late";
    }

    const newLog = {
      id: `A-${Date.now()}`,
      employeeId,
      date: dateString,
      clockIn: timeString,
      clockOut: 'Pending',
      breaks: [],
      status,
      location, // Log location from clock-in event
      latitude: locationMeta?.lat || null,
      longitude: locationMeta?.lng || null,
      geofenceStatus: locationMeta?.status || null,
      distance: locationMeta?.distance || null,
      accuracy: locationMeta?.accuracy || null
    };

    setAttendance(prev => [newLog, ...prev]);
    setClockState({
      status: 'Clocked In',
      timeIn: timeString,
      breakStart: null,
      totalBreaks: 0,
      timer: 0,
      location,
      latitude: locationMeta?.lat || null,
      longitude: locationMeta?.lng || null,
      geofenceStatus: locationMeta?.status || null,
      distance: locationMeta?.distance || null,
      accuracy: locationMeta?.accuracy || null
    });
    
    const geofenceText = locationMeta ? ` (Geofence: ${locationMeta.status}, ${locationMeta.lat}, ${locationMeta.lng})` : "";
    addNotification('success', `${employees.find(e => e.id === employeeId)?.name} clocked in at ${timeString} from ${location}${geofenceText}`);
  };

  const handleStartBreak = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockState(prev => ({
      ...prev,
      status: 'On Break',
      breakStart: timeString
    }));
  };

  const handleEndBreak = (employeeId) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add break interval to the active attendance record
    const dateString = now.toISOString().split('T')[0];
    setAttendance(prev => {
      return prev.map(log => {
        if (log.employeeId === employeeId && log.date === dateString && log.clockOut === 'Pending') {
          return {
            ...log,
            breaks: [...log.breaks, { start: clockState.breakStart, end: timeString }]
          };
        }
        return log;
      });
    });

    // Mock duration addition of 30 mins
    setClockState(prev => ({
      ...prev,
      status: 'Clocked In',
      breakStart: null,
      totalBreaks: prev.totalBreaks + 30
    }));
  };

  const handleClockOut = (employeeId) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    setAttendance(prev => {
      return prev.map(log => {
        if (log.employeeId === employeeId && log.date === dateString && log.clockOut === 'Pending') {
          return {
            ...log,
            clockOut: timeString
          };
        }
        return log;
      });
    });

    setClockState(prev => ({
      ...prev,
      status: 'Clocked Out',
      timeIn: null,
      breakStart: null,
      timer: 0
    }));
    addNotification('info', `${employees.find(e => e.id === employeeId)?.name} clocked out at ${timeString}`);
  };

  // Visitor sign-in
  const registerVisitor = (name, company, phone, purpose, visitingPerson) => {
    const now = new Date();
    const timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newVisitor = {
      id: `VIS-${Date.now()}`,
      name,
      company,
      phone,
      purpose,
      visitingPerson,
      clockIn: timeString,
      clockOut: 'Still Inside',
      status: 'Currently Inside'
    };

    setVisitors(prev => [newVisitor, ...prev]);
    addNotification('info', `Visitor registered at Reception: ${name} (${company})`);
  };

  // Visitor check-out
  const checkoutVisitor = (visitorId) => {
    const now = new Date();
    const timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setVisitors(prev => prev.map(vis => {
      if (vis.id === visitorId) {
        return {
          ...vis,
          clockOut: timeString,
          status: 'Signed Out'
        };
      }
      return vis;
    }));
    
    const visitor = visitors.find(v => v.id === visitorId);
    if (visitor) {
      addNotification('info', `Visitor checked out: ${visitor.name}`);
    }
  };

  // Document Checklist Verifications (Amber/Red/Green status switching)
  const updateDocumentStatus = (employeeId, docName, field, value) => {
    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const updatedDocs = userDocs.map(doc => {
        if (doc.name === docName) {
          const newDoc = { ...doc, [field]: value };
          
          // Re-evaluate signatures
          if (field === 'uploadStatus' && value === 'Uploaded') {
            newDoc.employeeSignature = 'E-Signed';
            newDoc.complianceIndicator = 'Amber'; // Needs verify
          }
          if (field === 'verifiedStatus' && value === 'Verified') {
            newDoc.managerSignature = 'Verified By Manager';
            newDoc.complianceIndicator = 'Green';
          }
          if (field === 'verifiedStatus' && value === 'Needs Verification') {
            newDoc.managerSignature = 'Pending Verification';
            newDoc.complianceIndicator = 'Amber';
          }
          if (field === 'uploadStatus' && value === 'Pending') {
            newDoc.employeeSignature = 'Pending Signature';
            newDoc.managerSignature = 'Pending Verification';
            newDoc.verifiedStatus = 'Needs Verification';
            newDoc.complianceIndicator = 'Red';
          }

          return newDoc;
        }
        return doc;
      });
      
      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });

    const empName = employees.find(e => e.id === employeeId)?.name;
    addNotification('info', `Document "${docName}" updated for ${empName}`);
  };

  const uploadEmployeeDocument = (employeeId, docName, fileName, userName) => {
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const docExists = userDocs.some(d => d.name === docName);
      
      const newDocObj = {
        name: docName,
        uploadStatus: "Uploaded",
        verifiedStatus: "Needs Verification",
        status: "Pending Verification",
        expiryDate: docName === 'Passport' || docName === 'Driving Licence' || docName === 'Right To Work' ? '2028-12-31' : 'N/A',
        fileName,
        uploadedBy: userName,
        uploadDate: dateStr,
        uploadTime: timeStr,
        verifiedBy: "",
        verificationDate: "",
        verificationTime: "",
        verificationNotes: "",
        originalSeen: false,
        rejectedBy: "",
        rejectedDate: "",
        rejectedTime: "",
        rejectionReason: "",
        employeeSignature: "E-Signed",
        managerSignature: "Pending Verification",
        complianceIndicator: "Amber",
        history: [{
          action: "Uploaded",
          user: userName,
          date: dateStr,
          time: timeStr
        }]
      };

      let updatedDocs;
      if (docExists) {
        updatedDocs = userDocs.map(doc => {
          if (doc.name === docName) {
            const hist = Array.isArray(doc.history) ? [...doc.history] : [];
            hist.push({
              action: "Uploaded",
              user: userName,
              date: dateStr,
              time: timeStr
            });
            return {
              ...doc,
              uploadStatus: "Uploaded",
              verifiedStatus: "Needs Verification",
              status: "Pending Verification",
              fileName,
              uploadedBy: userName,
              uploadDate: dateStr,
              uploadTime: timeStr,
              verifiedBy: "",
              verificationDate: "",
              verificationTime: "",
              verificationNotes: "",
              originalSeen: false,
              rejectedBy: "",
              rejectedDate: "",
              rejectedTime: "",
              rejectionReason: "",
              employeeSignature: "E-Signed",
              managerSignature: "Pending Verification",
              complianceIndicator: "Amber",
              history: hist
            };
          }
          return doc;
        });
      } else {
        updatedDocs = [newDocObj, ...userDocs];
      }

      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });

    addNotification('success', `Document "${docName}" uploaded successfully.`);
  };

  const verifyEmployeeDocument = (employeeId, docName, userName, notes) => {
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const updatedDocs = userDocs.map(doc => {
        if (doc.name === docName) {
          const hist = Array.isArray(doc.history) ? [...doc.history] : [];
          hist.push({
            action: "Original Seen Checked",
            user: userName,
            date: dateStr,
            time: timeStr
          });
          hist.push({
            action: "Verified",
            user: userName,
            date: dateStr,
            time: timeStr
          });
          
          return {
            ...doc,
            verifiedStatus: "Verified",
            status: "Verified",
            verifiedBy: userName,
            verificationDate: dateStr,
            verificationTime: timeStr,
            verificationNotes: notes || "Original seen and verified.",
            originalSeen: true,
            managerSignature: "Verified By Manager",
            complianceIndicator: "Green",
            history: hist
          };
        }
        return doc;
      });

      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });

    addNotification('success', `Document "${docName}" verified by ${userName}.`);
  };

  const rejectEmployeeDocument = (employeeId, docName, userName, reason) => {
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const updatedDocs = userDocs.map(doc => {
        if (doc.name === docName) {
          const hist = Array.isArray(doc.history) ? [...doc.history] : [];
          hist.push({
            action: "Rejected",
            user: userName,
            date: dateStr,
            time: timeStr,
            reason
          });

          return {
            ...doc,
            uploadStatus: "Pending",
            verifiedStatus: "Needs Verification",
            status: "Rejected",
            rejectedBy: userName,
            rejectedDate: dateStr,
            rejectedTime: timeStr,
            rejectionReason: reason,
            employeeSignature: "Pending Signature",
            managerSignature: "Pending Verification",
            complianceIndicator: "Red",
            history: hist
          };
        }
        return doc;
      });

      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });

    addNotification('warning', `Document "${docName}" rejected. Reason: ${reason}`);
  };

  // Onboarding direct helper
  const onboardEmployee = (empData) => {
    const newEmpId = `EMP-0${employees.length + 1}`;
    const newEmp = {
      id: newEmpId,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
      ...empData,
      status: "Active"
    };

    // Add employee
    setEmployees(prev => [...prev, newEmp]);
    
    // Build initial empty documents checklists (Red status) for new employees
    setDocuments(prev => {
      const newDocsList = MANDATORY_DOCS.map(doc => ({
        name: doc,
        uploadStatus: "Pending",
        verifiedStatus: "Needs Verification",
        expiryDate: "N/A",
        employeeSignature: "Pending Signature",
        managerSignature: "Pending Verification",
        complianceIndicator: "Red"
      }));
      return {
        ...prev,
        [newEmpId]: newDocsList
      };
    });

    addNotification('success', `New Employee successfully onboarded: ${newEmp.name} (${newEmp.title})`);
  };

  // Audits submit helper (with Matrix update auto-trigger)
  const submitAuditResult = (auditId, score, details = null) => {
    setAudits(prev => prev.map(aud => {
      if (aud.id === auditId) {
        return {
          ...aud,
          status: 'Completed',
          lastCompleted: new Date().toISOString().split('T')[0],
          score: score,
          details: details || aud.details
        };
      }
      return aud;
    }));

    const audit = audits.find(a => a.id === auditId);
    if (audit) {
      addNotification('success', `${audit.type} successfully completed. Compliance score scored: ${score}%`);
      
      // Auto-update Audit Matrix Schedule for the current month column
      const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }); // e.g. 'Jun'
      const formattedDateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '.'); // DD.MM.YYYY
      
      setAuditMatrix(prevMatrix => prevMatrix.map(row => {
        const rowName = row.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const auditName = audit.type.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (rowName === auditName || rowName.includes(auditName) || auditName.includes(rowName)) {
          return {
            ...row,
            [currentMonth]: {
              ...row[currentMonth],
              actual: formattedDateStr,
              score: `${score}%`
            }
          };
        }
        return row;
      }));
    }
  };

  // Reminders Engine: Action to set initial date
  const setInitialAuditDate = (auditType, date) => {
    setInitialAuditDates(prev => ({
      ...prev,
      [auditType]: date
    }));
    addNotification('info', `Initial target date for "${auditType}" set to ${date}. Monthly recurrence registered.`);
  };

  // Upload Employee Certificate - updates Training Matrix & Documents Checklist
  const uploadEmployeeCertificate = (employeeId, courseName, fileData) => {
    const courseId = courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Set Training Matrix cell to today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    setTrainingMatrix(prev => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        [courseId]: todayStr
      }
    }));
    
    // Calculate 1 year expiry date
    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 1);
    
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const expiryStr = expiry.toISOString().split('T')[0];
    const fileName = fileData ? fileData.name : `${courseId}_cert.pdf`;
    
    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const docName = `Training Certificate - ${courseName}`;
      const docExists = userDocs.some(d => d.name === docName);
      
      const newDocObj = {
        name: docName,
        uploadStatus: "Uploaded",
        verifiedStatus: "Verified",
        status: "Verified",
        expiryDate: expiryStr,
        fileName: fileName,
        uploadedBy: "Manager",
        uploadDate: dateStr,
        uploadTime: timeStr,
        verifiedBy: "Sarah Jenkins",
        verificationDate: dateStr,
        verificationTime: timeStr,
        verificationNotes: "Automatically verified certificate upload.",
        originalSeen: true,
        employeeSignature: "E-Signed",
        managerSignature: "Verified By Manager",
        complianceIndicator: "Green",
        history: [{
          action: "Certificate Uploaded",
          user: "Manager",
          date: dateStr,
          time: timeStr
        }]
      };
      
      let updatedDocs;
      if (docExists) {
        updatedDocs = userDocs.map(doc => doc.name === docName ? newDocObj : doc);
      } else {
        updatedDocs = [newDocObj, ...userDocs];
      }
      
      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });
    
    addComplianceLog(
      'Training Certificate Uploaded',
      `${employees.find(e => e.id === employeeId)?.name} completed ${courseName} (Expiry: ${expiryStr})`,
      'Manager',
      'Training'
    );
    addNotification('success', `Certificate for ${courseName} uploaded. Status is now Completed.`);
  };

  // Log supervision matrix updates
  const updateSupervisionMatrix = (employeeId, date, code) => {
    const dateObj = new Date(date);
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' }); // e.g. 'Jun'
    const formattedDate = dateObj.toLocaleDateString('en-GB').replace(/\//g, '.');
    
    setSupervisionMatrix(prev => prev.map(row => {
      if (row.employeeId === employeeId) {
        return {
          ...row,
          [monthName]: {
            planned: row[monthName]?.planned || formattedDate,
            actual: formattedDate,
            code: code
          }
        };
      }
      return row;
    }));
  };

  const logSupervision = (employeeId, date) => {
    updateSupervisionMatrix(employeeId, date, 'S');
    addNotification('success', `Supervision session logged and scheduled in Supervision Matrix (Code: S).`);
  };

  const logObservation = (employeeId, date) => {
    updateSupervisionMatrix(employeeId, date, 'Obs');
    addNotification('success', `Competency observation logged in Supervision Matrix (Code: Obs).`);
  };

  const logMeeting = (employeeId, date) => {
    updateSupervisionMatrix(employeeId, date, 'TM');
    addNotification('success', `Team meeting / Appraisal logged in Supervision Matrix (Code: TM).`);
  };

  // Missing Document Counter
  const getMissingDocumentsCount = (employee) => {
    if (!employee) return 0;
    const empDocs = documents[employee.id] || [];
    let count = 0;
    
    // 1. Photo Check
    if (!employee.photo || employee.photo.includes('placeholder') || employee.photo === '') {
      count++;
    }
    
    // 2. References (Employer Reference 1 & 2)
    const ref1 = empDocs.find(d => d.name === 'Employer Reference 1');
    const ref2 = empDocs.find(d => d.name === 'Employer Reference 2');
    if (!ref1 || ref1.uploadStatus === 'Pending') count++;
    if (!ref2 || ref2.uploadStatus === 'Pending') count++;
    
    // 3. DBS Check (with expiry check)
    const dbs = empDocs.find(d => d.name === 'DBS Check');
    if (!dbs || dbs.uploadStatus === 'Pending') {
      count++;
    } else if (dbs.expiryDate && dbs.expiryDate !== 'N/A') {
      const exp = new Date(dbs.expiryDate);
      const ref = new Date('2026-06-15');
      if (exp <= ref) {
        count++; // Expired counts as missing compliance
      }
    }
    
    // 4. Right To Work Expiry
    const rtw = empDocs.find(d => d.name === 'Right To Work');
    if (!rtw || rtw.uploadStatus === 'Pending') {
      count++;
    } else if (rtw.expiryDate && rtw.expiryDate !== 'N/A') {
      const exp = new Date(rtw.expiryDate);
      const ref = new Date('2026-06-15');
      if (exp <= ref) {
        count++; // Expired counts as missing compliance
      }
    }
    
    // 5. Signed Contract: "Contract of Employment"
    const contract = empDocs.find(d => d.name === 'Contract of Employment' || d.name === 'Contract');
    if (!contract || contract.uploadStatus === 'Pending') count++;
    
    // 6. Employee Handbook
    const handbook = empDocs.find(d => d.name === 'Employee Handbook' || d.name === 'Signed Handbook');
    if (!handbook || handbook.uploadStatus === 'Pending') count++;
    
    // 7. Health Questionnaire
    const healthQ = empDocs.find(d => d.name === 'Health Questionnaire');
    if (!healthQ || healthQ.uploadStatus === 'Pending') count++;
    
    // 8. GDPR Acknowledgment
    const gdpr = empDocs.find(d => d.name === 'GDPR Acknowledgment');
    if (!gdpr || gdpr.uploadStatus === 'Pending') count++;

    // 9. Rehabilitation Form
    const rehab = empDocs.find(d => d.name === 'Rehabilitation Form');
    if (!rehab || rehab.uploadStatus === 'Pending') count++;

    // 10. Proof of Qualification
    const qual = empDocs.find(d => d.name === 'Proof of Qualification' || d.name === 'Qualification Certificate');
    if (!qual || qual.uploadStatus === 'Pending') count++;

    // 11. Induction Record
    const induction = empDocs.find(d => d.name === 'Induction Record' || d.name === 'Induction');
    if (!induction || induction.uploadStatus === 'Pending') count++;
    
    return count;
  };

  // Schedule new compliance audit reactively
  const scheduleAudit = (type, date, officerId, area = '', personAudited = '') => {
    const newAudit = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      type,
      scheduledDate: date,
      officerId,
      status: 'Pending',
      lastCompleted: 'Never',
      score: null,
      area,
      personAudited
    };
    setAudits(prev => [newAudit, ...prev]);
    addNotification('info', `New care audit scheduled: ${type} for ${date}${area ? ` at ${area}` : ''}`);
    return newAudit;
  };

  const deleteAudit = (auditId) => {
    setAudits(prev => prev.filter(a => a.id !== auditId));
    addNotification('warning', `Scheduled audit deleted successfully`);
  };

  const updateAuditAssignment = (auditId, officerId, date, status, area = '', personAudited = '') => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        return {
          ...a,
          officerId: officerId || a.officerId,
          scheduledDate: date || a.scheduledDate,
          status: status || a.status,
          area: area !== undefined ? area : a.area,
          personAudited: personAudited !== undefined ? personAudited : a.personAudited
        };
      }
      return a;
    }));
    addNotification('info', `Audit schedule/assignment updated`);
  };

  const updateAuditActionPlans = (auditId, actionPlans) => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        return {
          ...a,
          details: {
            ...(a.details || {}),
            actionPlans
          }
        };
      }
      return a;
    }));
    addNotification('success', `Action plans register updated`);
  };

  const addCustomAuditCategory = (categoryName, questions) => {
    setCustomAuditCategories(prev => [...prev, { name: categoryName, questions }]);
    addNotification('success', `Custom audit category "${categoryName}" created`);
  };

  // Leave operations helpers
  const applyLeaveRequest = (employeeId, leaveData) => {
    const newLeave = {
      id: `LV-${Date.now()}`,
      employeeId,
      status: 'Pending',
      ...leaveData
    };

    setLeave(prev => [newLeave, ...prev]);
    addNotification('info', `New Leave Request pending review from ${employees.find(e => e.id === employeeId)?.name}`);
  };

  const approveLeaveRequest = (leaveId) => {
    setLeave(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'Approved' };
      }
      return l;
    }));
    
    const request = leave.find(l => l.id === leaveId);
    if (request) {
      addNotification('success', `Holiday Request APPROVED for ${employees.find(e => e.id === request.employeeId)?.name}`);
    }
  };

  const rejectLeaveRequest = (leaveId) => {
    setLeave(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'Rejected' };
      }
      return l;
    }));

    const request = leave.find(l => l.id === leaveId);
    if (request) {
      addNotification('warning', `Holiday Request REJECTED for ${employees.find(e => e.id === request.employeeId)?.name}`);
    }
  };

  // Helper to update employee details
  const updateEmployee = (id, updatedData) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
    addNotification('success', `Employee details updated successfully`);
  };

  // Helper to add custom employee document
  const addEmployeeDocument = (employeeId, docName) => {
    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const newDoc = {
        name: docName,
        uploadStatus: "Uploaded",
        verifiedStatus: "Verified",
        expiryDate: "2028-12-31",
        employeeSignature: "E-Signed",
        managerSignature: "Verified By Manager",
        complianceIndicator: "Green",
        owner: "You",
        added: "Just now"
      };
      return {
        ...prev,
        [employeeId]: [newDoc, ...userDocs]
      };
    });
    addNotification('success', `Document "${docName}" uploaded successfully`);
  };

  // Day Notes helpers
  const addDayNote = (day, noteData) => {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newNote = {
      id: `DN-${Date.now()}`,
      day,
      ...noteData,
      createdDate: formattedDate
    };
    setDayNotes(prev => [...prev, newNote]);
    addNotification('info', `New Day Note added for ${day}: "${noteData.title}"`);
  };

  const editDayNote = (noteId, updatedData) => {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setDayNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          ...updatedData,
          updatedDate: formattedDate
        };
      }
      return note;
    }));
    addNotification('info', `Day Note updated: "${updatedData.title}"`);
  };

  const deleteDayNote = (noteId) => {
    const note = dayNotes.find(n => n.id === noteId);
    if (note) {
      setDayNotes(prev => prev.filter(n => n.id !== noteId));
      addNotification('warning', `Deleted Day Note for ${note.day}: "${note.title}"`);
    }
  };

  // Observation mutators
  const addObservationTemplate = (name, category, fields) => {
    const newTemplate = {
      id: `temp-${Date.now()}`,
      name,
      category,
      fields
    };
    setObservationTemplates(prev => [...prev, newTemplate]);
    addNotification('success', `Observation template "${name}" created successfully.`);
  };

  const addObservation = (obsData) => {
    const newObs = {
      ...obsData,
      id: `OBS-00${observations.length + 1}`,
      notesHistory: obsData.notes ? [{ date: `${obsData.date} ${obsData.time}`, authorName: employees.find(e => e.id === obsData.createdBy)?.name || 'System', comment: obsData.notes }] : [],
      attachments: obsData.attachments || [],
      timeline: [{ date: `${obsData.date} ${obsData.time}`, action: 'Created', by: employees.find(e => e.id === obsData.createdBy)?.name || 'System' }]
    };
    setObservations(prev => [newObs, ...prev]);
    addNotification('info', `New Observation logged for resident ${obsData.resident}`);

    // Sync weight to malnutrition logs if provided
    if (obsData && obsData.answers) {
      const weightFieldKey = Object.keys(obsData.answers).find(key => key.toLowerCase().includes('weight') || key.toLowerCase().includes('temp'));
      // Note: we only sync weight
      const isWeightKey = weightFieldKey && weightFieldKey.toLowerCase().includes('weight');
      if (isWeightKey) {
        const weightVal = parseFloat(obsData.answers[weightFieldKey]);
        if (!isNaN(weightVal) && weightVal > 0) {
          const residentName = obsData.resident;
          setMalnutritionLogs(prev => {
            const monthName = new Date().toLocaleString('en-US', { month: 'long' });
            const updatedResidents = prev.residents.map(res => {
              if (res.name.toLowerCase() === residentName.toLowerCase()) {
                const weights = { ...res.weights, [monthName]: weightVal };
                const dates = { ...res.dates, [monthName]: obsData.date || new Date().toISOString().split('T')[0] };

                const prevWeight = res.weights[monthName] || Object.values(res.weights).pop() || weightVal;
                const pctDiff = prevWeight > weightVal ? ((prevWeight - weightVal) / prevWeight) * 100 : 0;
                if (pctDiff >= 5) {
                  addNotification('warning', `WEIGHT ALERT: Resident ${residentName} weight dropped by ${pctDiff.toFixed(1)}%! Please initiate a malnutrition review.`);
                }

                return {
                  ...res,
                  weights,
                  dates
                };
              }
              return res;
            });
            return {
              ...prev,
              residents: updatedResidents
            };
          });
        }
      }
    }
  };

  const updateObservation = (id, updatedData) => {
    setObservations(prev => prev.map(o => {
      if (o.id === id) {
        const changes = [];
        if (updatedData.assignedStaff !== o.assignedStaff) changes.push('Assigned');
        if (updatedData.status !== o.status) changes.push(updatedData.status === 'Closed' ? 'Closed' : 'Updated');
        
        const newTimeline = [...o.timeline];
        changes.forEach(c => {
          newTimeline.push({
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            action: c,
            by: employees.find(e => e.id === activeEmployeeId)?.name || 'System'
          });
        });
        
        if (changes.length === 0) {
          newTimeline.push({
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            action: 'Updated',
            by: employees.find(e => e.id === activeEmployeeId)?.name || 'System'
          });
        }

        return {
          ...o,
          ...updatedData,
          timeline: newTimeline
        };
      }
      return o;
    }));
  };

  const deleteObservation = (id) => {
    setObservations(prev => prev.filter(o => o.id !== id));
    addNotification('warning', `Observation ${id} deleted from system`);
  };

  const addObservationNote = (obsId, noteText, authorName) => {
    setObservations(prev => prev.map(o => {
      if (o.id === obsId) {
        return {
          ...o,
          notesHistory: [...(o.notesHistory || []), {
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            authorName,
            comment: noteText
          }],
          timeline: [...o.timeline, {
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            action: 'Updated',
            by: authorName
          }]
        };
      }
      return o;
    }));
  };

  const addObservationAttachment = (obsId, fileName, size, uploadedBy) => {
    setObservations(prev => prev.map(o => {
      if (o.id === obsId) {
        return {
          ...o,
          attachments: [...(o.attachments || []), {
            name: fileName,
            size,
            uploadedBy,
            date: new Date().toISOString().split('T')[0]
          }],
          timeline: [...o.timeline, {
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            action: 'Updated',
            by: uploadedBy
          }]
        };
      }
      return o;
    }));
  };

  // Resident Risk Assessment mutators
  const saveRiskAssessment = (resident, type, score, details, categoryLabel) => {
    const newAssessment = {
      id: `RA-${Date.now()}`,
      resident,
      type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      assessor: employees.find(e => e.id === activeEmployeeId)?.name || 'System Carer',
      score,
      details,
      categoryLabel
    };
    setResidentRiskAssessments(prev => [newAssessment, ...prev]);
    addNotification('success', `${type} assessment saved for ${resident} (Risk: ${categoryLabel})`);
  };

  // Competency mutators
  const addAssessment = (assessmentData) => {
    const newAssessment = {
      ...assessmentData,
      id: `COMP-00${assessments.length + 1}`,
      evidence: assessmentData.evidence || [],
      renewalHistory: []
    };
    setAssessments(prev => [newAssessment, ...prev]);
    addNotification('success', `Competency assessment added for ${assessmentData.staffMember}`);
  };

  const updateAssessment = (id, updatedData) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAssessment = (id) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    addNotification('warning', `Assessment record ${id} removed`);
  };

  const renewCompetency = (compId, reviewDate, expiryDate, assessorName) => {
    setAssessments(prev => prev.map(a => {
      if (a.id === compId) {
        return {
          ...a,
          assessmentDate: new Date().toISOString().split('T')[0],
          reviewDate,
          expiryDate,
          assessorName,
          result: 'Pass',
          renewalHistory: [...(a.renewalHistory || []), {
            date: new Date().toISOString().split('T')[0],
            action: 'Renewed Competency',
            by: assessorName
          }]
        };
      }
      return a;
    }));
    addNotification('success', `Renewed competency for ${assessments.find(a => a.id === compId)?.staffMember}`);
  };

  const uploadCompetencyEvidence = (compId, fileName, size) => {
    const authorName = employees.find(e => e.id === activeEmployeeId)?.name || 'System';
    setAssessments(prev => prev.map(a => {
      if (a.id === compId) {
        return {
          ...a,
          evidence: [...(a.evidence || []), {
            name: fileName,
            size,
            date: new Date().toISOString().split('T')[0]
          }]
        };
      }
      return a;
    }));
    addNotification('info', `Evidence uploaded for competency: ${fileName}`);
  };

  const addTemplate = (newTemp) => {
    setTemplates(prev => [...prev, newTemp]);
    addNotification('success', `Template "${newTemp.name}" created successfully.`);
  };

  const updateTemplate = (id, updated) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    addNotification('success', `Template "${updated.name}" updated successfully.`);
  };

  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    addNotification('warning', `Template deleted successfully.`);
  };

  const saveGeneratedDocument = (employeeId, docName, fileName, contentHtml, userName) => {
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setDocuments(prev => {
      const userDocs = prev[employeeId] || [];
      const docExists = userDocs.some(d => d.name === docName);
      
      const newDocObj = {
        name: docName,
        uploadStatus: "Uploaded",
        verifiedStatus: "Verified",
        status: "Verified",
        expiryDate: "N/A",
        fileName,
        uploadedBy: userName,
        uploadDate: dateStr,
        uploadTime: timeStr,
        verifiedBy: userName,
        verificationDate: dateStr,
        verificationTime: timeStr,
        verificationNotes: "Automatically generated by the system.",
        originalSeen: true,
        employeeSignature: "E-Signed",
        managerSignature: "Verified By Manager",
        complianceIndicator: "Green",
        isGenerated: true,
        contentHtml,
        history: [{
          action: "Generated & Saved",
          user: userName,
          date: dateStr,
          time: timeStr
        }]
      };

      let updatedDocs;
      if (docExists) {
        updatedDocs = userDocs.map(doc => {
          if (doc.name === docName) {
            const hist = Array.isArray(doc.history) ? [...doc.history] : [];
            hist.push({
              action: "Re-generated & Overwritten",
              user: userName,
              date: dateStr,
              time: timeStr
            });
            return {
              ...newDocObj,
              history: hist
            };
          }
          return doc;
        });
      } else {
        updatedDocs = [newDocObj, ...userDocs];
      }

      return {
        ...prev,
        [employeeId]: updatedDocs
      };
    });

    addNotification('success', `Document "${docName}" generated and saved to employee's folder.`);
  };

  const addComplianceLog = (action, details, user, type) => {
    const newLog = {
      id: `CL-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action,
      details,
      user,
      type
    };
    setComplianceLogs(prev => [newLog, ...prev]);
  };

  const signPolicy = (employeeId, policyId) => {
    const emp = employees.find(e => e.id === employeeId);
    const policy = policies.find(p => p.id === policyId);
    const empName = emp ? emp.name : 'Employee';
    const policyName = policy ? policy.name : policyId;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setPolicySignatures(prev => {
      const currentRecord = prev[employeeId]?.[policyId] || { history: [] };
      const history = Array.isArray(currentRecord.history) ? [...currentRecord.history] : [];
      history.push({
        version: policy?.version || 'v3.2',
        signedAt: formattedDate,
        user: empName
      });
      return {
        ...prev,
        [employeeId]: {
          ...(prev[employeeId] || {}),
          [policyId]: {
            signed: true,
            signedAt: formattedDate,
            history
          }
        }
      };
    });
    addComplianceLog('Policy Signed', `${empName} signed policy ${policyName} (Version ${policy?.version || 'v3.2'})`, empName, 'Policy');
  };

  const updateTrainingStatus = (employeeId, courseId, status) => {
    const emp = employees.find(e => e.id === employeeId);
    const empName = emp ? emp.name : 'Employee';
    const courseName = courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const dateVal = status === 'Completed' ? new Date().toISOString().split('T')[0] : '';

    setTrainingMatrix(prev => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        [courseId]: dateVal
      }
    }));
    addComplianceLog(
      'Training Status Updated',
      `${empName} training status for ${courseName} changed to ${status}`,
      employees.find(e => e.id === activeEmployeeId)?.name || 'System Manager',
      'Training'
    );
  };

  const updateTrainingDate = (employeeId, courseId, dateString) => {
    const emp = employees.find(e => e.id === employeeId);
    const empName = emp ? emp.name : 'Employee';
    const courseName = courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    setTrainingMatrix(prev => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        [courseId]: dateString
      }
    }));
    addComplianceLog(
      'Training Date Updated',
      `${empName} training date for ${courseName} set to ${dateString || 'None (Cleared)'}`,
      employees.find(e => e.id === activeEmployeeId)?.name || 'System Manager',
      'Training'
    );
  };

  const updateFireCertificate = (id, updatedFields) => {
    setFireCertificates(prev => prev.map(c => {
      if (c.id === id) {
        const nextCert = { ...c, ...updatedFields };
        if (updatedFields.renewalDate) {
          const refDate = new Date('2026-06-13');
          const exp = new Date(updatedFields.renewalDate);
          const diffTime = exp - refDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            addNotification('alert', `EXPIRY ALERT: ${nextCert.name} expired on ${updatedFields.renewalDate}!`);
          } else if (diffDays <= 30) {
            addNotification('warning', `EXPIRY WARNING: ${nextCert.name} is expiring in ${diffDays} days (${updatedFields.renewalDate})`);
          }
        }
        return nextCert;
      }
      return c;
    }));
    addNotification('success', `Fire certificate updated successfully.`);
  };

  const updateComplianceCertificate = (id, updatedFields) => {
    setComplianceCertificates(prev => prev.map(c => {
      if (c.id === id) {
        const nextCert = { ...c, ...updatedFields };
        if (updatedFields.renewalDate) {
          const refDate = new Date('2026-06-13');
          const exp = new Date(updatedFields.renewalDate);
          const diffTime = exp - refDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            addNotification('alert', `EXPIRY ALERT: ${nextCert.name} expired on ${updatedFields.renewalDate}!`);
          } else if (diffDays <= 30) {
            addNotification('warning', `EXPIRY WARNING: ${nextCert.name} is expiring in ${diffDays} days (${updatedFields.renewalDate})`);
          }
        }
        return nextCert;
      }
      return c;
    }));
    addNotification('success', `Compliance certificate updated successfully.`);
  };

  const updateActiveManagerDetails = (name, date) => {
    setActiveManager({ name, changeDate: date });
    addComplianceLog('Manager Details Updated', `Active Manager updated to ${name} effective from ${date}`, employees.find(e => e.id === activeEmployeeId)?.name || 'Admin', 'Administrative');
    addNotification('success', `Active Manager updated to ${name}.`);
  };

  const signFireAssessment = (employeeId, signatureName) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setFireSignatures(prev => ({
      ...prev,
      [employeeId]: { signed: true, signedAt: formattedDate, signatureName }
    }));
    const emp = employees.find(e => e.id === employeeId);
    const empName = emp ? emp.name : 'Employee';
    addComplianceLog('Fire Risk Assessment Signed', `${empName} signed the Fire Risk Assessment`, empName, 'Fire Safety');
    addNotification('success', `Fire Risk Assessment successfully signed.`);
  };

  const sendFireAssessmentToAll = () => {
    const pendingEmps = employees.filter(e => !fireSignatures[e.id]?.signed);
    pendingEmps.forEach(emp => {
      addNotification('alert', `Fire Risk Assessment review required. Please read and sign.`);
    });
    addNotification('success', `Sent review and sign request to all pending employees.`);
  };

  // Expiry notification checking on launch
  useEffect(() => {
    const checkExpiries = () => {
      const refDate = new Date('2026-06-13'); // System active time reference
      
      fireCertificates.forEach(cert => {
        if (cert.renewalDate) {
          const exp = new Date(cert.renewalDate);
          const diffTime = exp - refDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            addNotification('alert', `EXPIRY ALERT: ${cert.name} expired on ${cert.renewalDate}!`);
          } else if (diffDays <= 30) {
            addNotification('warning', `EXPIRY WARNING: ${cert.name} is expiring in ${diffDays} days (${cert.renewalDate})`);
          }
        }
      });

      complianceCertificates.forEach(cert => {
        if (cert.renewalDate) {
          const exp = new Date(cert.renewalDate);
          const diffTime = exp - refDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            addNotification('alert', `EXPIRY ALERT: ${cert.name} expired on ${cert.renewalDate}!`);
          } else if (diffDays <= 30) {
            addNotification('warning', `EXPIRY WARNING: ${cert.name} is expiring in ${diffDays} days (${cert.renewalDate})`);
          }
        }
      });
    };

    const timer = setTimeout(checkExpiries, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Medication Room Cleaning Checklist Logs state
  const [medicationCleaningLogs, setMedicationCleaningLogs] = useState(() => {
    const saved = localStorage.getItem('medication_cleaning_logs');
    if (saved) return JSON.parse(saved);
    return {
      cleaningDaily: {},
      cleaningWeekly: {},
      issues: [
        {
          id: 'mi-1',
          area: 'CD Cabinet',
          date: '2026-06-12',
          cleaned: 'N',
          reason: 'Key misplaced, lock jammed',
          actionRequired: 'Y',
          details: 'Locksmith called to replace lock',
          responsible: 'Sarah Jenkins',
          targetDate: '2026-06-15',
          actualDate: '',
          signature: 'Amira Patel',
          managerSign: ''
        }
      ],
      reviews: {
        'June': { completed: 'Y', comments: 'All daily and weekly tasks maintained appropriately.', managerSign: 'Sarah Jenkins' }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('medication_cleaning_logs', JSON.stringify(medicationCleaningLogs));
  }, [medicationCleaningLogs]);

  // Dependency Tool Logs state
  const [dependencyLogs, setDependencyLogs] = useState(() => {
    const saved = localStorage.getItem('dependency_logs');
    if (saved) return JSON.parse(saved);
    return {
      months: {
        'June': {
          ragLowMin: 0,
          ragLowMax: 5,
          ragMedMin: 6,
          ragMedMax: 10,
          ragHighMin: 11,
          ragHighMax: 15,
          residents: [
            {
              name: 'Margaret Smith',
              baseline: 2, // Low
              needs: {
                oneToOne: { early: 0, late: 0, night: 0 },
                eating: { early: 5, late: 5, night: 0 },
                communication: { early: 0, late: 0, night: 0 },
                social: { early: 10, late: 10, night: 0 },
                mobility: { early: 5, late: 5, night: 0 },
                emotional: { early: 0, late: 0, night: 0 },
                personalCare: { early: 10, late: 10, night: 0 },
                behavioural: { early: 0, late: 0, night: 0 },
                medication: { early: 5, late: 5, night: 5 }
              }
            },
            {
              name: 'Arthur Pendelton',
              baseline: 3, // Medium
              needs: {
                oneToOne: { early: 0, late: 0, night: 0 },
                eating: { early: 10, late: 10, night: 0 },
                communication: { early: 5, late: 5, night: 0 },
                social: { early: 15, late: 15, night: 0 },
                mobility: { early: 10, late: 10, night: 0 },
                emotional: { early: 5, late: 5, night: 0 },
                personalCare: { early: 15, late: 15, night: 0 },
                behavioural: { early: 5, late: 5, night: 0 },
                medication: { early: 10, late: 10, night: 10 }
              }
            },
            {
              name: 'Margaret Atwood',
              baseline: 1, // Self-Caring
              needs: {
                oneToOne: { early: 0, late: 0, night: 0 },
                eating: { early: 0, late: 0, night: 0 },
                communication: { early: 0, late: 0, night: 0 },
                social: { early: 10, late: 10, night: 0 },
                mobility: { early: 0, late: 0, night: 0 },
                emotional: { early: 0, late: 0, night: 0 },
                personalCare: { early: 0, late: 0, night: 0 },
                behavioural: { early: 0, late: 0, night: 0 },
                medication: { early: 5, late: 0, night: 0 }
              }
            },
            {
              name: 'John Miller',
              baseline: 4, // High
              needs: {
                oneToOne: { early: 30, late: 30, night: 30 },
                eating: { early: 15, late: 15, night: 0 },
                communication: { early: 10, late: 10, night: 0 },
                social: { early: 15, late: 15, night: 0 },
                mobility: { early: 15, late: 15, night: 10 },
                emotional: { early: 10, late: 10, night: 10 },
                personalCare: { early: 20, late: 20, night: 10 },
                behavioural: { early: 10, late: 10, night: 5 },
                medication: { early: 10, late: 10, night: 10 }
              }
            }
          ],
          otherConsiderations: 'Service is spread across two floors, requiring additional staff to monitor corridors during the night. Human element cannot be fully formulaic.',
          additionalHours: { early: 2, late: 2, night: 6 },
          rosteredHours: { early: 18, late: 18, night: 24 }
        }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('dependency_logs', JSON.stringify(dependencyLogs));
  }, [dependencyLogs]);

  // Malnutrition Weight & Risk Tracker Logs state
  const [malnutritionLogs, setMalnutritionLogs] = useState(() => {
    const saved = localStorage.getItem('malnutrition_logs');
    if (saved) return JSON.parse(saved);
    return {
      residents: [
        { name: 'Margaret Smith', height: 1.62, weights: { 'January': 65.2, 'February': 64.8, 'March': 64.5, 'April': 64.0, 'May': 63.8, 'June': 63.5 }, dates: { 'June': '2026-06-12' } },
        { name: 'Arthur Pendelton', height: 1.75, weights: { 'January': 78.5, 'February': 77.0, 'March': 75.2, 'April': 74.0, 'May': 73.1, 'June': 72.0 }, dates: { 'June': '2026-06-14' } },
        { name: 'Margaret Atwood', height: 1.58, weights: { 'January': 54.0, 'February': 54.1, 'March': 54.0, 'April': 54.2, 'May': 54.1, 'June': 54.0 }, dates: { 'June': '2026-06-10' } },
        { name: 'John Miller', height: 1.80, weights: { 'January': 89.0, 'February': 88.5, 'March': 86.0, 'April': 84.5, 'May': 83.0, 'June': 81.5 }, dates: { 'June': '2026-06-13' } }
      ],
      actionPlans: [
        {
          id: 'ap-1',
          name: 'Arthur Pendelton',
          monthTriggered: 'March',
          dateIdentified: '2026-03-28',
          actionsTaken: 'Gastroenterologist referral, soft diet initiated, high calorie milkshakes daily.',
          responsible: 'Sarah Jenkins',
          dateCompleted: '2026-04-15',
          improvementSeen: 'Y',
          details: 'Weight stabilized in April, appetite returned.'
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('malnutrition_logs', JSON.stringify(malnutritionLogs));
  }, [malnutritionLogs]);

  // Lessons Learnt Summary Reports state
  const [lessonsLearntLogs, setLessonsLearntLogs] = useState(() => {
    const saved = localStorage.getItem('lessons_learnt_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'LL-001',
        serviceName: 'Swan Care Home',
        preparedBy: 'Kathy Williams',
        date: '2025-11-16',
        backgroundSummary: 'A person who was not authorised or permitted to be in the home was found to be staying in the staff accommodation.',
        presentFindings: 'A review was undertaken and it was identified that a staff member had brought their relative into the home without permission. Several staff and the manager were aware of this but did not escalate to the directors or ask the person to leave.',
        natureOfConcern: 'Staff did not follow the correct steps when they had concerns and exposed people to risk as a result.',
        informationReviewed: 'Visitor book, statements, emails',
        finalFindings: 'By staff not escalating their concerns, an unauthorised person had access to the home and vulnerable service users.',
        complianceFailings: 'Failure by staff members to follow the reporting concerns process. Failure by staff member to follow tenancy rules.',
        whatWentWell: 'When notified, the directors arranged for the person to leave within 24 hours.',
        recommendations: 'Full and formal investigation to be undertaken by Fulcrum. The staff accommodation area should be decommissioned. Risk assessment should be undertaken. reminders of tenancy, and staff supervisions.',
        signedBy: 'Kathy Williams',
        signDate: '2025-11-16'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lessons_learnt_logs', JSON.stringify(lessonsLearntLogs));
  }, [lessonsLearntLogs]);

  // Restrictive Practices Register state
  const [restrictivePracticeLogs, setRestrictivePracticeLogs] = useState(() => {
    const saved = localStorage.getItem('restrictive_practice_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'RP-001',
        residentName: 'Arthur Pendelton',
        dob: '1944-08-23',
        diagnoses: 'Severe Dementia, Agitation',
        completedBy: 'Sarah Jenkins',
        completedDate: '2026-06-05',
        harmAssessment: 'Resident frequently tries to wander out into the busy road. Unsteady on feet and has high history of falls.',
        likelihoodHarm: 'Frequent - daily wandering attempts.',
        consentDetails: 'MCA completed on 2026-05-10 identifying resident lacks capacity. Best interests decision involving son Clive Smith and Social Worker Jane Smith.',
        circumstances: 'Resident becomes agitated in late afternoons (sundowning) and searches for his childhood home.',
        restrictions: {
          closeSupervision: 'Y',
          prnMedication: 'Y',
          bedRails: 'Y',
          lockedDoors: 'Y',
          lockedKitchen: 'Y',
          lockedPantry: 'Y',
          accessMoney: 'Y',
          washingAlone: 'Y',
          razors: 'Y'
        },
        checklist: {
          avoidHarmSelf: 'Y',
          avoidHarmOthers: 'Y',
          emotionalImpact: 'Y',
          proportionality: 'Y',
          leastRestrictive: 'Y',
          timeLimited: 'Y',
          balancedInterests: 'Y',
          personCentred: 'Y'
        },
        reviews: [
          { date: '2026-06-15', reviewer: 'Sarah Jenkins', details: 'Wandering attempts reduced. Bed rails remain necessary. PRN medication not used this week.' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('restrictive_practice_logs', JSON.stringify(restrictivePracticeLogs));
  }, [restrictivePracticeLogs]);

  // Safeguarding Action Records state
  const [safeguardingLogs, setSafeguardingLogs] = useState(() => {
    const saved = localStorage.getItem('safeguarding_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'SG-001',
        allegationReceivedFrom: 'Carer Amira Patel',
        dateReceived: '2026-05-28',
        residentsAffected: 'Eleanor Vance',
        descriptionLocation: 'Incident log INC-2026-038',
        localityTeamInformedDate: '2026-05-28',
        localityTeamInformedBy: 'Sarah Jenkins via Online Safeguarding Portal',
        policeInformedDate: 'NA',
        policeInformedBy: 'NA',
        userDisclosure: 'N',
        disclosureDate: '',
        disclosureStaff: '',
        disclosureNotesLocation: '',
        immediateActions: 'Bruising photographed, GP and family notified, skin integrity assessment completed.',
        consentGained: 'Y',
        bestInterestsInvolvement: 'Resident has capacity. Ann Vance (NOK) kept informed.',
        notesLocation: 'Resident personal file',
        staffSuspended: 'None',
        suspensionNotesLocation: '',
        cqcInformedDate: '2026-05-29',
        cqcInformedBy: 'Sarah Jenkins via CQC Portal',
        cqcRecordLocation: 'CQC Notifications folder',
        communications: [
          { date: '2026-06-02', details: 'Safeguarding officer visited Eleanor. Confirmed bruising is fading and resident feels safe.', signature: 'Sarah Jenkins' }
        ],
        lessonsLearnt: 'Y',
        lessonsLearntDetails: 'Remind staff to check skin daily during personal care. Complete Waterlow and skin assessments on admission.',
        completedBy: 'Sarah Jenkins',
        completedDate: '2026-06-10'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('safeguarding_logs', JSON.stringify(safeguardingLogs));
  }, [safeguardingLogs]);

  // Special Diets Record state
  const [specialDiets, setSpecialDiets] = useState(() => {
    const saved = localStorage.getItem('special_diets');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'SD-001', date: '2026-06-10', residentName: 'Arthur Pendelton', requirement: 'Soft/Pureed diet - high risk of choking. High calorie thick milkshakes.', signedBy: 'Thomas McGregor' },
      { id: 'SD-002', date: '2026-06-12', residentName: 'Margaret Smith', requirement: 'Diabetic - low sugar, low carb options. Hydration monitoring.', signedBy: 'Thomas McGregor' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('special_diets', JSON.stringify(specialDiets));
  }, [specialDiets]);

  // Manager Monthly Checklists state
  const [managerChecklists, setManagerChecklists] = useState(() => {
    const saved = localStorage.getItem('manager_checklists');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'MCL-001',
        dateCompleted: '2026-05-31',
        completedBy: 'Sarah Jenkins',
        supportedAdultsCount: 4,
        hospitalAdmissionsCount: 0,
        carePlansAuditedCount: 4,
        significantChanges: 'Margaret Smith had knee flare-ups, mobility plan reviewed and GP updated.',
        weightChanges: 'Arthur Pendelton MUST score 1 (medium risk), weekly weights set and supplements active.',
        carePlanActionsLastMonth: 'Completed all Waterlow reassessments.',
        carePlanActionsThisMonth: 'Audit all PEEPs next month.',
        staffCount: 8,
        startersCount: 1,
        inductionsCompletedCount: 1,
        vacanciesCount: 0,
        staffAbsencesCount: 2,
        supervisionsCompletedCount: 4,
        observationsCompletedCount: 2,
        medicationCompetenciesCount: 2,
        movingHandlingCompetenciesCount: 2,
        staffMeetingDate: '2026-05-15',
        nextStaffMeetingDate: '2026-06-18',
        trainingsCompleted: 'Dementia Care (James Carter, 2026-06-02)',
        mandatoryOver85: 'Y',
        trainingsPlanned: 'Fire Safety Refresher (All Staff, 2026-06-25)',
        staffActionsLastMonth: 'Conducted supervisions for night staff.',
        staffActionsThisMonth: 'Onboard new care assistant.',
        safeguardsNewCount: 1,
        safeguardsOpenCount: 1,
        safeguardsActionsLastMonth: 'Review fall guidelines.',
        safeguardsActionsThisMonth: 'Submit CQC notification for SG-001.',
        incidentsCount: 1,
        accidentsCount: 1,
        incidentActionsLastMonth: 'Refine corridor checks.',
        incidentActionsThisMonth: 'Sensor mats implemented for Arthur.',
        missedVisitsCount: 0,
        lateVisitsCount: 0,
        shortVisitsCount: 0,
        visitActionsLastMonth: 'Verify digital logins.',
        visitActionsThisMonth: 'Audit attendance logs weekly.',
        notificationsCount: 1,
        complimentsCount: 3,
        complaintsCount: 0,
        complimentsDetails: 'Family of Arthur Pendelton expressed great thanks for dietary support.',
        complaintsDetails: 'None.',
        monthHighlight: 'Arthur Pendelton smiled and participated in classical music activity.',
        auditsCompleted: 'Infection Control, Health and Safety, Medication Room',
        otherActions: 'Upgrade handwash station signages.',
        managerSignature: 'Sarah Jenkins'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('manager_checklists', JSON.stringify(managerChecklists));
  }, [managerChecklists]);

  // Surveys & Feedback state
  const [customerSurveys, setCustomerSurveys] = useState(() => {
    const saved = localStorage.getItem('customer_surveys');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'SV-001',
        surveyType: 'Service User',
        date: '2026-06-08',
        respondent: 'Clive Smith (on behalf of Arthur Pendelton)',
        ratings: {
          dignity: 5,
          choice: 4,
          activities: 3,
          meals: 4,
          staffAttitude: 5,
          responsiveness: 4
        },
        comments: 'Overall very happy with the care. Dad is always clean and dressed well. More outings would be nice.'
      },
      {
        id: 'SV-002',
        surveyType: 'Stakeholder',
        date: '2026-06-10',
        respondent: 'Jane Smith (Social Worker)',
        ratings: {
          professionalism: 5,
          communication: 5,
          safety: 4,
          careQuality: 5,
          compliance: 4
        },
        comments: 'Excellent collaboration. Staff are proactive in communicating clinical changes and updating care plans.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('customer_surveys', JSON.stringify(customerSurveys));
  }, [customerSurveys]);

  // Medication Competency assessments state
  const [medicationCompetencies, setMedicationCompetencies] = useState(() => {
    const saved = localStorage.getItem('medication_competencies');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'MC-001',
        employeeId: 'EMP-002',
        employeeName: 'James Carter',
        assessorName: 'Sarah Jenkins',
        date: '2026-06-15',
        status: 'Pass',
        knowledgeScores: { q1: 'Pass', q2: 'Pass', q3: 'Pass', q4: 'Pass', q5: 'Pass', q6: 'Pass', q7: 'Pass', q8: 'Pass', q9: 'Pass', q10: 'Pass' },
        practicalChecklist: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true },
        calculations: { c1: '0.36', c2: '0.25', c3: '0.5', c4: '8', c5: '20', c6: '21', c7: '13.125' },
        scenarios: { s1: 'Pass', s2: 'Pass', s3: 'Pass', s4: 'Pass' },
        actionPlan: 'Competency achieved. Annual refresher scheduled for June 2027.',
        managerSign: 'Sarah Jenkins',
        candidateSign: 'James Carter'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medication_competencies', JSON.stringify(medicationCompetencies));
  }, [medicationCompetencies]);

  // Employee Induction Packs state
  const [employeeInductionPacks, setEmployeeInductionPacks] = useState(() => {
    const saved = localStorage.getItem('employee_induction_packs');
    if (saved) return JSON.parse(saved);
    return {
      'EMP-001': {
        type: 'Permanent',
        completed: true,
        items: {
          handbook: true,
          fireEvac: true,
          policies: true,
          whistleblowing: true,
          safeguarding: true,
          healthSafety: true,
          codeOfConduct: true,
          serviceAims: true,
          orientation: true,
          security: true,
          fireExits: true,
          extinguishers: true,
          callBells: true,
          dressCode: true,
          carePlans: true,
          dailyNotes: true,
          shiftPatterns: true,
          infectionControl: true,
          wasteControl: true,
          movingHandling: true,
          emergencyPlans: true,
          accidentReporting: true,
          firstAid: true
        },
        mentorSign: 'Admin User',
        mentorDate: '2021-03-20',
        employeeSign: 'Sarah Jenkins',
        employeeDate: '2021-03-20'
      },
      'EMP-008': {
        type: 'Permanent',
        completed: false,
        items: {
          handbook: true,
          fireEvac: true,
          policies: true,
          whistleblowing: false,
          safeguarding: true,
          healthSafety: true,
          codeOfConduct: true,
          serviceAims: true,
          orientation: true,
          security: true,
          fireExits: true,
          extinguishers: false,
          callBells: true,
          dressCode: true,
          carePlans: false,
          dailyNotes: false,
          shiftPatterns: true,
          infectionControl: true,
          wasteControl: true,
          movingHandling: false,
          emergencyPlans: false,
          accidentReporting: false,
          firstAid: false
        },
        mentorSign: '',
        mentorDate: '',
        employeeSign: '',
        employeeDate: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('employee_induction_packs', JSON.stringify(employeeInductionPacks));
  }, [employeeInductionPacks]);

  // Care Notes global state
  const [careNotes, setCareNotes] = useState(() => {
    const saved = localStorage.getItem('care_notes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'n1', patientId: 2, patientName: 'Arthur Pendelton', note: 'Refused morning physiotherapy session and stated he wanted to stay in bed.', author: 'James Carter (Registered Nurse)', time: '45 mins ago', hasRefusedCare: true },
      { id: 'n2', patientId: 1, patientName: 'Margaret Smith', note: 'Assisted with lunch. Ate 100% of meal. Had 200ml orange juice.', author: 'John (Senior Carer)', time: '2 hours ago', hasRefusedCare: false },
      { id: 'n3', patientId: 4, patientName: 'John Miller', note: 'Resident refused to participate in the afternoon gardening activity and locked himself in his room.', author: 'Amira Patel (Care Support)', time: '10 mins ago', hasRefusedCare: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('care_notes', JSON.stringify(careNotes));
  }, [careNotes]);

  const addCareNote = (patientId, patientName, noteText, hasRefusedCare, author = 'John (Senior Carer)', time, weight = null) => {
    const currentTimeStr = time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newNote = {
      id: `n-${Date.now()}`,
      patientId,
      patientName,
      note: noteText || 'Routine check. Resident is comfortable.',
      author,
      time: currentTimeStr,
      hasRefusedCare
    };
    setCareNotes(prev => [newNote, ...prev]);

    // Auto-sync weight to malnutrition logs if provided
    if (weight) {
      const numWeight = parseFloat(weight);
      if (!isNaN(numWeight) && numWeight > 0) {
        setMalnutritionLogs(prev => {
          const monthName = new Date().toLocaleString('en-US', { month: 'long' }); // e.g. "June"
          const updatedResidents = prev.residents.map(res => {
            if (res.name.toLowerCase() === patientName.toLowerCase()) {
              // Trigger weight change alert if weight drop is significant (e.g. > 5%)
              const weights = { ...res.weights, [monthName]: numWeight };
              const dates = { ...res.dates, [monthName]: new Date().toISOString().split('T')[0] };
              
              // Simple check for weight drop alerts
              const prevWeight = res.weights[monthName] || Object.values(res.weights).pop() || numWeight;
              const pctDiff = prevWeight > numWeight ? ((prevWeight - numWeight) / prevWeight) * 100 : 0;
              if (pctDiff >= 5) {
                addNotification('warning', `WEIGHT ALERT: Resident ${patientName} weight dropped by ${pctDiff.toFixed(1)}%! Please initiate a malnutrition review.`);
              }

              return {
                ...res,
                weights,
                dates
              };
            }
            return res;
          });
          return {
            ...prev,
            residents: updatedResidents
          };
        });
      }
    }
  };

  // Action methods to mutate states
  const addLessonsLearntLog = (log) => {
    setLessonsLearntLogs(prev => [log, ...prev]);
  };

  const addManagerChecklist = (checklist) => {
    setManagerChecklists(prev => [checklist, ...prev]);
  };

  const addRestrictivePracticeLog = (log) => {
    setRestrictivePracticeLogs(prev => [log, ...prev]);
  };

  const addSafeguardingLog = (log) => {
    setSafeguardingLogs(prev => [log, ...prev]);
  };

  const addSpecialDiet = (diet) => {
    setSpecialDiets(prev => [diet, ...prev]);
  };

  const addCustomerSurvey = (survey) => {
    setCustomerSurveys(prev => [survey, ...prev]);
  };

  const addMedicationCompetency = (comp) => {
    setMedicationCompetencies(prev => [comp, ...prev]);
  };

  const updateEmployeeInduction = (empId, pack) => {
    setEmployeeInductionPacks(prev => ({
      ...prev,
      [empId]: pack
    }));
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      isLoggedIn,
      setIsLoggedIn,
      currentRole,
      setCurrentRole: handleRoleChange,
      currentView,
      setCurrentView,
      
      employees,
      documents,
      shifts,
      openShifts,
      attendance,
      audits,
      visitors,
      leave,
      notifications,
      dayNotes,
      
      activeEmployeeId,
      setActiveEmployeeId,
      clockState,
      setClockState,
      isOnboardModalOpen,
      setIsOnboardModalOpen,
      docStatusFilter,
      setDocStatusFilter,
      
      // Operations actions
      addShift,
      removeShift,
      claimOpenShift,
      createOpenShift,
      markAllNotificationsRead,
      handleClockIn,
      handleClockOut,
      handleStartBreak,
      handleEndBreak,
      registerVisitor,
      checkoutVisitor,
      updateDocumentStatus,
      uploadEmployeeDocument,
      verifyEmployeeDocument,
      rejectEmployeeDocument,
      onboardEmployee,
      submitAuditResult,
      scheduleAudit,
      deleteAudit,
      updateAuditAssignment,
      updateAuditActionPlans,
      addCustomAuditCategory,
      customAuditCategories,
      applyLeaveRequest,
      approveLeaveRequest,
      rejectLeaveRequest,
      updateEmployee,
      addEmployeeDocument,
      addDayNote,
      editDayNote,
      deleteDayNote,

      // Observation Exports
      observations,
      observationTemplates,
      addObservationTemplate,
      addObservation,
      updateObservation,
      deleteObservation,
      addObservationNote,
      addObservationAttachment,

      // Resident Risk Assessment Exports
      residentRiskAssessments,
      saveRiskAssessment,

      // Competency Exports
      assessments,
      addAssessment,
      updateAssessment,
      deleteAssessment,
      renewCompetency,
      uploadCompetencyEvidence,

      // Document template system
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      saveGeneratedDocument,

      // Policies & Training
      policies,
      policySignatures,
      trainingMatrix,
      signPolicy,
      updateTrainingStatus,
      updateTrainingDate,
      TRAINING_COURSES,
      complianceLogs,
      addComplianceLog,

      // Fire & Compliance
      fireCertificates,
      complianceCertificates,
      activeManager,
      fireSignatures,
      updateFireCertificate,
      updateComplianceCertificate,
      updateActiveManagerDetails,
      signFireAssessment,
      sendFireAssessmentToAll,

      // Compliance matrix & Kitchen states/reminders
      kitchenLogs,
      setKitchenLogs,
      auditMatrix,
      setAuditMatrix,
      supervisionMatrix,
      setSupervisionMatrix,
      setInitialAuditDate,
      uploadEmployeeCertificate,
      logSupervision,
      logObservation,
      logMeeting,
      getMissingDocumentsCount,
      initialAuditDates,

      // Medication Room & Dependency Tool additions
      medicationCleaningLogs,
      setMedicationCleaningLogs,
      dependencyLogs,
      setDependencyLogs,
      malnutritionLogs,
      setMalnutritionLogs,

      // All newly added client digitized template states & actions
      lessonsLearntLogs,
      addLessonsLearntLog,
      restrictivePracticeLogs,
      addRestrictivePracticeLog,
      safeguardingLogs,
      addSafeguardingLog,
      specialDiets,
      addSpecialDiet,
      customerSurveys,
      addCustomerSurvey,
      medicationCompetencies,
      addMedicationCompetency,
      employeeInductionPacks,
      updateEmployeeInduction,
      managerChecklists,
      addManagerChecklist,
      careNotes,
      addCareNote
    }}>
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
