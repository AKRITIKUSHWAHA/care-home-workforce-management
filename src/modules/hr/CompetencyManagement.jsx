import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, Plus, Calendar, Clock, AlertCircle, FileText, CheckCircle, 
  Search, User, ClipboardList, Shield, AlertTriangle, ShieldAlert, Award, 
  FileClock, Trash2, ArrowLeft, Upload, CheckCircle2, ChevronRight, UserCheck, HelpCircle, X, Lock, BookOpen
} from 'lucide-react';

const COMPETENCY_TYPES = [
  'Medication Competency', 'Medication Error Competency', 'Fire Safety Competency', 
  'Infection Control Competency', 'Health & Safety Competency', 'Manual Handling Competency', 
  'Care Planning Competency', 'Food Hygiene Competency', 'First Aid Competency', 'Other'
];

const MEDICATION_CHECKLIST = [
  'MAR Chart Understanding', 'Safe Administration', 'Hand Hygiene', 
  'Consent Procedures', 'Medication Storage', 'Controlled Drugs Handling', 
  'Record Keeping', 'PRN Medication Knowledge', 'Error Reporting'
];

const MED_ERROR_CHECKLIST = [
  'Error Identification', 'Near Miss Reporting', 'Duty Of Candour', 
  'Incident Reporting', 'Escalation Process', 'Documentation Requirements', 
  'Corrective Actions'
];

const KNOWLEDGE_QUESTIONS = [
  { id: 'q1', label: 'Management of Medicines Policy & Local Policy (discuss 3 key areas and location)' },
  { id: 'q2', label: 'Accountability (ordering, administration, receipt, safe storage, CD, allergies, observations, refusal, covert admin, documentation, safe disposal)' },
  { id: 'q3', label: 'Management of Medication errors and near misses (policies, Duty of Candour, reporting, who to inform)' },
  { id: 'q4', label: 'Adults medical/psychiatric conditions in relation to medication (discuss 2 adults)' },
  { id: 'q5', label: 'Handwritten entries on MAR sheet and GP verbal requests' },
  { id: 'q6', label: 'Management of ADVERSE / anaphylactic reactions, alerts from HMRA and MDA' },
  { id: 'q7', label: 'Effects & side effects of 5 commonly used medications in the home' },
  { id: 'q8', label: 'Homely remedies administration, checking, and recording procedures' },
  { id: 'q9', label: 'Routes of administration (give one or more example for each route)' },
  { id: 'q10', label: 'Medical devices used in administration & maintenance requirements' }
];

const PRACTICAL_ITEMS = [
  { id: 'p1', title: 'Preparation for Administration', desc: 'MAR charts check, wash/dry hands, collect trolley/fridge meds, BNF up to date, non-alcohol sanitiser, pots/spoons, water/juice, disposal bags.' },
  { id: 'p2', title: 'Communication & Consent', desc: 'Knocks on door, introduces self, identifies person, gains verbal/implied consent, explains uses/procedure, answers questions, discusses right to refuse.' },
  { id: 'p3', title: 'Infection Control', desc: 'Washes/sanitises hands between residents, manages sharps disposal, handles refused meds, clears equipment.' },
  { id: 'p4', title: 'Administration & Recording', desc: 'Conducts 5 checks, observes resident swallow, signs MAR immediately, offers PRN, checks opening dates, records codes & refusal reasons.' },
  { id: 'p5', title: 'Covert Administration', desc: 'Verifies MCA/DOLS documentation is active, administers as specified in care plan.' },
  { id: 'p6', title: 'Controlled Medication', desc: 'Knowledge of CD laws & storage, CD administration procedures, witness checks, weekly stock counts.' },
  { id: 'p7', title: 'Safe Storage & Temperature Logs', desc: 'Records daily clinic room/fridge temperatures, records opening dates, knows steps for fridge breakdown & oxygen safety.' },
  { id: 'p8', title: 'Self-Administration Support', desc: 'Knowledge of assessment process for self-medicating resident and reassessment schedules.' }
];

const DRUG_CALCULATIONS = [
  { id: 'c1', label: 'Convert 360 micrograms to milligrams.', correct: '0.36', suffix: 'mg' },
  { id: 'c2', label: 'Test dose of Zuclopenthixol decanoate is 50mg. Ampoule is 200mg in 1ml. What volume (ml) to draw up?', correct: '0.25', suffix: 'ml' },
  { id: 'c3', label: 'Prescribed 500mcg haloperidol. Haloperidol liquid is 1mg/ml. What volume (ml) is required?', correct: '0.5', suffix: 'ml' },
  { id: 'c4', label: 'Citalopram 40mg/ml = 20 drops/ml. Prescribed 16mg daily. How many drops are required?', correct: '8', suffix: 'drops' },
  { id: 'c5', label: 'Oramorph 40mg prescribed. Concentration is 10mg/5ml. How many ml are required?', correct: '20', suffix: 'ml' },
  { id: 'c6', label: 'Furosemide prescribed as 60mg daily. Tablets are 20mg. How many tablets dispensed in one week?', correct: '21', suffix: 'tablets' },
  { id: 'c7', label: 'Midazolam dose in 24hrs for a 75kg person (prescribed 175mcg per kg per day). Calculate dose in mg.', correct: '13.125', suffix: 'mg' }
];

const SCENARIO_ASSESSMENTS = [
  { id: 's1', label: 'What would you do if you find a medication error involving Controlled Medication?' },
  { id: 's2', label: 'What would you do if a medication had been dispensed in wrong dosage?' },
  { id: 's3', label: 'What would you do if a medication had been incorrectly labelled to the wrong resident?' },
  { id: 's4', label: 'What would you do if on completing a stock check and the amount of tablets present do NOT tally with MAR?' }
];

const EXPIRY_GUIDE_CM11 = [
  { formulation: 'Tablets and capsules – in original blister/foil boxes', recommended: 'Manufacturer’s expiry date. Do not mix batches. Only order when necessary.' },
  { formulation: 'Tablets and capsules – loose, i.e. put into a bottle by pharmacy', recommended: '6 months from the dispensing date or manufacturer’s expiry date.' },
  { formulation: 'Oral liquids (original or amber bottles)', recommended: '6 months from date of opening or manufacturer’s recommendation if shorter. Mark date of opening.' },
  { formulation: 'External liquids (e.g. shampoos, scrubs)', recommended: '6 months from date of opening or manufacturer’s recommendation if shorter. Mark date of opening.' },
  { formulation: 'Creams/Ointments in tubes', recommended: '3 months from date of opening or manufacturer’s recommendation if shorter. Mark opening date.' },
  { formulation: 'Creams/Ointments in pots, tubs or jars', recommended: '1 month from date of opening or expiry date provided by pharmacy.' },
  { formulation: 'Creams/Ointments in pump dispensers', recommended: '6 months from date of opening or manufacturer’s recommendation if shorter.' },
  { formulation: 'Sterile Eye/Ear/Nose drops or Ointments', recommended: '28 days from date of opening. Some drops require fridge storage.' },
  { formulation: 'Inhalers/Sprays', recommended: 'Manufacturer’s expiry date or dose counter review.' },
  { formulation: 'MCCA or MDS (Multi-Compartment Compliance Aid / Monitored Dosing)', recommended: '8 weeks from date of dispensing.' }
];

const CompetencyManagement = () => {
  const {
    assessments,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    renewCompetency,
    uploadCompetencyEvidence,
    employees,
    activeEmployeeId,
    currentRole,
    medicationCompetencies,
    addMedicationCompetency
  } = useApp();

  const [viewState, setViewState] = useState('dashboard'); // 'dashboard', 'details', 'med-details'
  const [dashboardTab, setDashboardTab] = useState('general'); // 'general', 'meds', 'register', 'expiry'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedMedAssessment, setSelectedMedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Requests Log for managers
  const [requestedAssessments, setRequestedAssessments] = useState([
    { id: 'REQ-101', staffName: 'Amira Patel', employeeId: 'EMP-003', competencyType: 'Medication Competency', reason: 'Annual renewal due next month', status: 'Pending', date: '2026-06-02' }
  ]);

  // Form State for general assessments
  const [formData, setFormData] = useState({
    staffMember: '',
    employeeId: '',
    department: 'Care',
    type: 'Medication Competency',
    customType: '',
    assessorName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    reviewDate: '',
    expiryDate: '',
    result: 'Pass',
    score: '',
    comments: '',
    recommendations: '',
    checklist: {}
  });

  // Medication Competency Wizard Form State
  const [wizardStep, setWizardStep] = useState(1); // 1, 2, 3, 4
  const [medWizardData, setMedWizardData] = useState({
    employeeId: '',
    assessorName: '',
    date: new Date().toISOString().split('T')[0],
    knowledgeScores: { q1: 'Pass', q2: 'Pass', q3: 'Pass', q4: 'Pass', q5: 'Pass', q6: 'Pass', q7: 'Pass', q8: 'Pass', q9: 'Pass', q10: 'Pass' },
    knowledgeNotes: { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '' },
    practicalChecklist: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true },
    calculations: { c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '' },
    scenarios: { s1: 'Pass', s2: 'Pass', s3: 'Pass', s4: 'Pass' },
    scenarioNotes: { s1: '', s2: '', s3: '', s4: '' },
    actionPlan: 'Competency achieved. Scheduled for annual refresher review.',
    managerSign: '',
    candidateSign: '',
    pin: ''
  });
  const [wizardError, setWizardError] = useState('');

  // Renewal Form State
  const [renewalData, setRenewalData] = useState({
    assessorName: '',
    reviewDate: '',
    expiryDate: ''
  });

  // Request Assessment Form State (for managers)
  const [requestData, setRequestData] = useState({
    employeeId: '',
    competencyType: 'Medication Competency',
    reason: ''
  });

  // Access check
  if (currentRole === 'Receptionist') {
    return (
      <div className="glass-card rounded-3xl p-8 text-center max-w-xl mx-auto my-12 shadow-lg border border-slate-200 dark:border-slate-800">
        <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Your role ({currentRole}) does not have permission to access the Competency Module. Please contact an administrator.
        </p>
      </div>
    );
  }

  const currentEmp = employees.find(e => e.id === activeEmployeeId);

  // RBAC Helper functions
  const isTeamAssessment = (assessment) => {
    if (currentRole === 'Admin' || currentRole === 'HR' || currentRole === 'Compliance Officer') return true;
    if (currentRole === 'Manager') {
      const staffEmp = employees.find(e => e.id === assessment.employeeId);
      return (
        assessment.employeeId === activeEmployeeId ||
        (staffEmp && staffEmp.manager === currentEmp?.name)
      );
    }
    if (currentRole === 'Employee') {
      return assessment.employeeId === activeEmployeeId;
    }
    return false;
  };

  const canManage = () => {
    return ['Admin', 'HR'].includes(currentRole);
  };

  const canDelete = () => {
    return currentRole === 'Admin';
  };

  const canRenew = () => {
    return ['Admin', 'HR'].includes(currentRole);
  };

  const canRequest = () => {
    return currentRole === 'Manager';
  };

  // Filter calculations
  const filteredAssessments = assessments
    .filter(isTeamAssessment)
    .filter(a => {
      const matchesSearch = a.staffMember.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || a.type === typeFilter;
      return matchesSearch && matchesType;
    });

  // Expiry Calculations
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const exp = new Date(expiryDate);
    const now = new Date();
    const diffTime = exp - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return exp >= now && diffDays <= 30;
  };

  // Dashboard Stats Calculations
  const distinctAssessed = new Set(filteredAssessments.map(a => a.employeeId)).size + (medicationCompetencies || []).length;
  const competentCount = new Set(filteredAssessments.filter(a => a.result === 'Pass' && !isExpired(a.expiryDate)).map(a => a.employeeId)).size + (medicationCompetencies || []).filter(mc => mc.status === 'Pass').length;
  const expiringCount = filteredAssessments.filter(a => isExpiringSoon(a.expiryDate)).length;
  const expiredCount = filteredAssessments.filter(a => isExpired(a.expiryDate)).length;
  const failedCount = filteredAssessments.filter(a => a.result === 'Fail').length + (medicationCompetencies || []).filter(mc => mc.status === 'Fail').length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        updated.checklist = {}; // reset checklist
      }
      if (name === 'employeeId') {
        const selectedStaff = employees.find(emp => emp.id === value);
        if (selectedStaff) {
          updated.staffMember = selectedStaff.name;
          updated.department = selectedStaff.group || 'Care';
        }
      }
      return updated;
    });
  };

  const handleChecklistChange = (item) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: !prev.checklist[item]
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedAssessment) {
      updateAssessment(selectedAssessment.id, formData);
      const updated = assessments.find(a => a.id === selectedAssessment.id);
      if (updated) setSelectedAssessment(updated);
    } else {
      addAssessment(formData);
    }
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setSelectedAssessment(null);
    const firstStaff = employees[0] || { id: '', name: '', group: '' };
    setFormData({
      staffMember: firstStaff.name,
      employeeId: firstStaff.id,
      department: firstStaff.group || 'Care',
      type: 'Medication Competency',
      customType: '',
      assessorName: currentEmp ? currentEmp.name : 'Sarah Jenkins',
      assessmentDate: new Date().toISOString().split('T')[0],
      reviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +6 months
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +1 year
      result: 'Pass',
      score: '90',
      comments: '',
      recommendations: '',
      checklist: {}
    });
    setIsModalOpen(true);
  };

  const openEditModal = (a) => {
    setSelectedAssessment(a);
    setFormData({ ...a });
    setIsModalOpen(true);
  };

  const handleRenewSubmit = (e) => {
    e.preventDefault();
    renewCompetency(
      selectedAssessment.id,
      renewalData.reviewDate,
      renewalData.expiryDate,
      renewalData.assessorName
    );
    setIsRenewModalOpen(false);
    setTimeout(() => {
      const updated = assessments.find(a => a.id === selectedAssessment.id);
      if (updated) setSelectedAssessment(updated);
    }, 100);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const staff = employees.find(emp => emp.id === requestData.employeeId);
    if (!staff) return;
    
    const newReq = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      staffName: staff.name,
      employeeId: requestData.employeeId,
      competencyType: requestData.competencyType,
      reason: requestData.reason,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setRequestedAssessments([newReq, ...requestedAssessments]);
    setIsRequestModalOpen(false);
    alert(`Success: Competency assessment request submitted for ${staff.name}`);
  };

  const handleEvidenceUpload = () => {
    const docTypes = ['signed_checklist.pdf', 'assessor_signoff_log.png', 'practical_feedback_score.pdf'];
    const randomFile = docTypes[Math.floor(Math.random() * docTypes.length)];
    const sizes = ['450 KB', '1.1 MB', '720 KB'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
    uploadCompetencyEvidence(selectedAssessment.id, randomFile, randomSize);
    
    setTimeout(() => {
      const updated = assessments.find(a => a.id === selectedAssessment.id);
      if (updated) setSelectedAssessment(updated);
    }, 100);
  };

  // Medication Wizard Handlers
  const handleMedWizardSubmit = (e) => {
    e.preventDefault();
    if (medWizardData.pin !== '1234') {
      setWizardError('Incorrect PIN. Authorized Manager PIN required (demo is 1234).');
      return;
    }

    const targetStaff = employees.find(emp => emp.id === medWizardData.employeeId);
    if (!targetStaff) {
      setWizardError('Invalid Employee selected.');
      return;
    }

    // Auto calculate calculation score
    let calculationCorrectCount = 0;
    DRUG_CALCULATIONS.forEach(calc => {
      if (medWizardData.calculations[calc.id] === calc.correct) {
        calculationCorrectCount++;
      }
    });

    const isPass = calculationCorrectCount === DRUG_CALCULATIONS.length && 
      !Object.values(medWizardData.knowledgeScores).includes('Fail') &&
      !Object.values(medWizardData.scenarios).includes('Fail') &&
      !Object.values(medWizardData.practicalChecklist).includes(false);

    const newMedCompetency = {
      id: `MC-${Date.now()}`,
      employeeId: medWizardData.employeeId,
      employeeName: targetStaff.name,
      assessorName: medWizardData.assessorName,
      date: medWizardData.date,
      status: isPass ? 'Pass' : 'Fail',
      knowledgeScores: medWizardData.knowledgeScores,
      knowledgeNotes: medWizardData.knowledgeNotes,
      practicalChecklist: medWizardData.practicalChecklist,
      calculations: medWizardData.calculations,
      scenarios: medWizardData.scenarios,
      scenarioNotes: medWizardData.scenarioNotes,
      actionPlan: medWizardData.actionPlan,
      managerSign: medWizardData.managerSign || medWizardData.assessorName,
      candidateSign: medWizardData.candidateSign || targetStaff.name
    };

    addMedicationCompetency(newMedCompetency);
    setIsMedModalOpen(false);
    
    // Reset wizard
    setMedWizardData({
      employeeId: '',
      assessorName: '',
      date: new Date().toISOString().split('T')[0],
      knowledgeScores: { q1: 'Pass', q2: 'Pass', q3: 'Pass', q4: 'Pass', q5: 'Pass', q6: 'Pass', q7: 'Pass', q8: 'Pass', q9: 'Pass', q10: 'Pass' },
      knowledgeNotes: { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '' },
      practicalChecklist: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true },
      calculations: { c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '' },
      scenarios: { s1: 'Pass', s2: 'Pass', s3: 'Pass', s4: 'Pass' },
      scenarioNotes: { s1: '', s2: '', s3: '', s4: '' },
      actionPlan: 'Competency achieved. Scheduled for annual refresher review.',
      managerSign: '',
      candidateSign: '',
      pin: ''
    });
    setWizardStep(1);
    setWizardError('');
    alert(`Medication Competency saved! Result: ${isPass ? 'PASS' : 'FAIL'}`);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Staff Competency Management</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1 ml-10">Track certifications, checklists, renewals, and regulatory training compliance.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {viewState !== 'dashboard' && (
            <button 
              onClick={() => setViewState('dashboard')}
              className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4"/>
              Back to Dashboard
            </button>
          )}
          {canManage() && viewState === 'dashboard' && (
            <>
              <button
                onClick={() => {
                  const firstEmp = employees[0] || { id: '' };
                  setMedWizardData(prev => ({
                    ...prev,
                    employeeId: firstEmp.id,
                    assessorName: currentEmp ? currentEmp.name : 'Sarah Jenkins'
                  }));
                  setWizardStep(1);
                  setWizardError('');
                  setIsMedModalOpen(true);
                }}
                className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Lock className="h-4 w-4" />
                Medication Assessment Wizard
              </button>
              <button
                onClick={openCreateModal}
                className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                New General Competency
              </button>
            </>
          )}
          {canRequest() && viewState === 'dashboard' && (
            <button
              onClick={() => {
                const team = employees.filter(emp => emp.manager === currentEmp?.name);
                const firstTeam = team[0] || { id: '' };
                setRequestData({
                  employeeId: firstTeam.id,
                  competencyType: 'Medication Competency',
                  reason: ''
                });
                setIsRequestModalOpen(true);
              }}
              className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <ClipboardList className="h-4 w-4" />
              Request Assessment
            </button>
          )}
        </div>
      </div>

      {viewState === 'dashboard' && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assessed Staff</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{distinctAssessed}</span>
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400"><User className="h-4 w-4"/></div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Competent Staff</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{competentCount}</span>
                <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><CheckCircle className="h-4 w-4"/></div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-brand-500">
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">Pending / Failures</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{failedCount}</span>
                <div className="h-8 w-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600"><HelpCircle className="h-4 w-4"/></div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Expiring Soon</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{expiringCount}</span>
                <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600"><Clock className="h-4 w-4"/></div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-405 uppercase tracking-wider mb-2">Expired</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{expiredCount}</span>
                <div className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600"><AlertTriangle className="h-4 w-4"/></div>
              </div>
            </div>
          </div>

          {/* Sub-tab Bar */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border dark:border-slate-800 w-fit mb-6">
            <button
              onClick={() => setDashboardTab('general')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                dashboardTab === 'general' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              General Competencies
            </button>
            <button
              onClick={() => setDashboardTab('meds')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dashboardTab === 'meds' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Medication Assessments
            </button>
            <button
              onClick={() => setDashboardTab('register')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dashboardTab === 'register' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Staff Competency Register
            </button>
            <button
              onClick={() => setDashboardTab('expiry')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dashboardTab === 'expiry' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Meds Expiry Guide (CM11)
            </button>
          </div>

          {/* TAB 1: General Competencies Table */}
          {dashboardTab === 'general' && (
            <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 gap-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Assessment Board</h3>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search staff member..." 
                      className="h-8 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white w-full sm:w-48"
                    />
                  </div>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="All">All Competencies</option>
                    {COMPETENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 font-bold">Staff Member</th>
                      <th className="p-3 font-bold">Competency Type</th>
                      <th className="p-3 font-bold">Assessor</th>
                      <th className="p-3 font-bold">Expiry Date</th>
                      <th className="p-3 font-bold">Result</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAssessments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-semibold">
                          No competency assessment records logged.
                        </td>
                      </tr>
                    ) : (
                      filteredAssessments.map(a => {
                        const expired = isExpired(a.expiryDate);
                        const warning = isExpiringSoon(a.expiryDate);
                        return (
                          <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group text-xs">
                            <td className="p-3">
                              <div className="font-extrabold text-slate-900 dark:text-slate-100">{a.staffMember}</div>
                              <div className="text-[10px] text-slate-500 font-medium">{a.employeeId} • {a.department}</div>
                            </td>
                            <td className="p-3 font-bold text-slate-805 dark:text-slate-200">
                              {a.type === 'Other' ? a.customType : a.type}
                            </td>
                            <td className="p-3 font-semibold text-slate-655 dark:text-slate-400">
                              {a.assessorName}
                            </td>
                            <td className="p-3">
                              <span className={`font-semibold flex items-center gap-1
                                ${expired 
                                  ? 'text-rose-600 dark:text-rose-455 font-bold' 
                                  : warning 
                                    ? 'text-amber-600 dark:text-amber-455 font-bold' 
                                    : 'text-slate-600 dark:text-slate-400'}
                              `}>
                                {expired ? <AlertTriangle className="h-3.5 w-3.5"/> : warning ? <Clock className="h-3.5 w-3.5"/> : null}
                                {a.expiryDate} {expired ? '(Expired)' : warning ? '(Expiring Soon)' : ''}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border
                                ${a.result === 'Pass' 
                                  ? 'border-emerald-250 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400' 
                                  : 'border-rose-250 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400'}
                              `}>
                                {a.result}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {canManage() && (
                                <button 
                                  onClick={() => openEditModal(a)}
                                  className="text-[11px] font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
                                >
                                  Edit
                                </button>
                              )}
                              <button 
                                onClick={() => { setSelectedAssessment(a); setViewState('details'); }}
                                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg border border-brand-100 dark:border-brand-900/40"
                              >
                                Details
                              </button>
                              {canDelete() && (
                                <button 
                                  onClick={() => deleteAssessment(a.id)}
                                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-450 dark:hover:text-rose-350"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Medication Competencies (Digitized Wizard List) */}
          {dashboardTab === 'meds' && (
            <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Digitized Medication Competency Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 font-bold">Candidate Staff</th>
                      <th className="p-3 font-bold">Assessment Date</th>
                      <th className="p-3 font-bold">Assessor</th>
                      <th className="p-3 font-bold">Calculations Score</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(medicationCompetencies || []).map(mc => {
                      // Calculate score
                      let calcScore = 0;
                      DRUG_CALCULATIONS.forEach(c => {
                        if (mc.calculations[c.id] === c.correct) calcScore++;
                      });

                      return (
                        <tr key={mc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">{mc.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{mc.employeeId}</div>
                          </td>
                          <td className="p-3 font-mono">{mc.date}</td>
                          <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">{mc.assessorName}</td>
                          <td className="p-3 font-bold">
                            {calcScore} / {DRUG_CALCULATIONS.length} ({(calcScore / DRUG_CALCULATIONS.length * 100).toFixed(0)}%)
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                              mc.status === 'Pass' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-505/10 dark:text-emerald-400' 
                                : 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-505/10 dark:text-rose-400'
                            }`}>
                              {mc.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => { setSelectedMedAssessment(mc); setViewState('med-details'); }}
                              className="text-[11px] font-black text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-xl hover:bg-brand-100 transition-all dark:bg-brand-950/40 dark:text-brand-400"
                            >
                              Review Full Checklist
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(medicationCompetencies || []).length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                          No Medication Competency Assessments logged.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Staff Competency Register */}
          {dashboardTab === 'register' && (
            <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Authorized Medication Administration Ledger</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">List of staff employed who are "authorised to administer medication" under regulatory guidelines.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 font-bold">Staff Member</th>
                      <th className="p-3 font-bold">Qualified / Authorised</th>
                      <th className="p-3 font-bold">Qualifications</th>
                      <th className="p-3 font-bold">Date Authorised</th>
                      <th className="p-3 font-bold">Refresher Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {/* Seed Authorized Managers/Seniors */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</div>
                        <div className="text-[10px] text-slate-400">EMP-001 • Manager</div>
                      </td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-100">Qualified</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Registered Nurse (RN), Medication Management Lead Cert</td>
                      <td className="p-3 font-mono">2021-03-20</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">Continuous Registry</td>
                    </tr>
                    {/* Dynamically query passed Medication Competencies */}
                    {(medicationCompetencies || []).filter(mc => mc.status === 'Pass').map(mc => {
                      const staff = employees.find(e => e.id === mc.employeeId) || {};
                      const authDate = new Date(mc.date);
                      const due = new Date(authDate);
                      due.setFullYear(due.getFullYear() + 1);
                      const dueStr = due.toISOString().split('T')[0];
                      return (
                        <tr key={mc.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">{mc.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{mc.employeeId} • {staff.title || 'Senior Carer'}</div>
                          </td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-100">Authorised</span></td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Passed CQC Medication Framework, NVQ Care Cert</td>
                          <td className="p-3 font-mono">{mc.date}</td>
                          <td className="p-3 font-mono text-amber-600 font-bold">{dueStr}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Expiry reference guide */}
          {dashboardTab === 'expiry' && (
            <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-extrabold text-sm text-slate-805 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-[#2e6559]" />
                  Medication Expiry Reference Guide (CM11)
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Suggested expiry guidelines of medical products from the date of opening.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 font-bold w-1/3">Formulation Type</th>
                      <th className="p-3 font-bold">Recommended Expiry Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {EXPIRY_GUIDE_CM11.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="p-3 font-extrabold text-slate-800 dark:text-slate-200">{item.formulation}</td>
                        <td className="p-3 font-semibold text-slate-600 dark:text-slate-350">{item.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requested Assessments list */}
          {requestedAssessments.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden shadow-sm mt-6">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ClipboardList className="h-4.5 w-4.5 text-indigo-500" />
                  Manager Requested Assessments
                </h3>
              </div>
              <div className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {requestedAssessments.map(req => (
                    <div key={req.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950 text-xs">
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-800 dark:text-slate-200">{req.staffName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{req.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{req.competencyType}</p>
                      <p className="text-slate-650 dark:text-slate-405 font-medium mt-1.5 italic">"{req.reason}"</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-850">
                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[9px] font-extrabold uppercase border border-amber-100">
                          {req.status}
                        </span>
                        {canManage() && (
                          <button
                            onClick={() => {
                              const emp = employees.find(e => e.id === req.employeeId);
                              setSelectedAssessment(null);
                              setFormData({
                                staffMember: req.staffName,
                                employeeId: req.employeeId,
                                department: emp?.group || 'Care',
                                type: req.competencyType,
                                customType: '',
                                assessorName: currentEmp?.name || 'Assessor',
                                assessmentDate: new Date().toISOString().split('T')[0],
                                reviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                result: 'Pass',
                                score: '90',
                                comments: '',
                                recommendations: '',
                                checklist: {}
                              });
                              setRequestedAssessments(prev => prev.filter(r => r.id !== req.id));
                              setIsModalOpen(true);
                            }}
                            className="text-[10px] font-bold text-brand-600 hover:text-brand-700"
                          >
                            Approve & Assess
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW: General Competencies Details */}
      {viewState === 'details' && selectedAssessment && (
        <div className="grid gap-6 lg:grid-cols-3 animate-slide-up">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold uppercase text-slate-500">
                    Competency Sign-Off Record
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
                    {selectedAssessment.type === 'Other' ? selectedAssessment.customType : selectedAssessment.type}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Assessed on {selectedAssessment.assessmentDate} by {selectedAssessment.assessorName}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border
                    ${selectedAssessment.result === 'Pass' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40' 
                      : 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/40'}
                  `}>
                    Result: {selectedAssessment.result} ({selectedAssessment.score}%)
                  </span>
                  {canRenew() && (
                    <button
                      onClick={() => {
                        setRenewalData({
                          assessorName: currentEmp?.name || selectedAssessment.assessorName,
                          reviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        });
                        setIsRenewModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-white bg-brand-600 hover:bg-brand-500 px-3.5 py-1 rounded-lg transition-all shadow-sm"
                    >
                      Renew Competency
                    </button>
                  )}
                </div>
              </div>

              {(selectedAssessment.type === 'Medication Competency' || selectedAssessment.type === 'Medication Error Competency') && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 mb-6">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-200 dark:border-slate-750">
                    Template Verification Checklist
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(selectedAssessment.checklist || {}).map(([item, val]) => (
                      <div key={item} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/60 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate mr-2">{item}</span>
                        {val ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 shrink-0"><CheckCircle className="h-4 w-4"/> Verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 shrink-0"><AlertCircle className="h-4 w-4"/> Failed</span>
                        )}
                      </div>
                    ))}
                    {Object.keys(selectedAssessment.checklist || {}).length === 0 && (
                      <p className="text-xs text-slate-400 italic py-2 sm:col-span-2">No checklist details stored for this assessment.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assessor Feedback Comments</h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-250/60 dark:bg-slate-900/50 dark:border-slate-800 text-xs font-semibold text-slate-655 dark:text-slate-350">
                    {selectedAssessment.comments || 'No feedback logged.'}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Development Recommendations</h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-250/60 dark:bg-slate-900/50 dark:border-slate-800 text-xs font-semibold text-slate-655 dark:text-slate-350">
                    {selectedAssessment.recommendations || 'No recommendations.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h4 className="font-black text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
                <FileClock className="h-4.5 w-4.5 text-indigo-500" />
                Competency Assessment History
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="py-2">Date</th>
                      <th className="py-2">Assessor</th>
                      <th className="py-2">Score</th>
                      <th className="py-2">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                    {assessments
                      .filter(a => a.employeeId === selectedAssessment.employeeId && a.id !== selectedAssessment.id)
                      .map(hist => (
                        <tr key={hist.id} className="text-slate-655 dark:text-slate-405">
                          <td className="py-2 font-mono">{hist.assessmentDate}</td>
                          <td className="py-2 font-semibold">{hist.assessorName}</td>
                          <td className="py-2">{hist.score}%</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${hist.result === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {hist.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {assessments.filter(a => a.employeeId === selectedAssessment.employeeId && a.id !== selectedAssessment.id).length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-3 text-slate-400 italic text-[11px]">
                          No prior assessment logs recorded for this staff member.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-4">Assessed Staff Profile</h4>
              {(() => {
                const staff = employees.find(e => e.id === selectedAssessment.employeeId);
                if (!staff) {
                  return (
                    <div>
                      <h5 className="font-black text-slate-800 dark:text-white">{selectedAssessment.staffMember}</h5>
                      <p className="text-xs text-slate-400 mt-1">ID Reference: {selectedAssessment.employeeId}</p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={staff.photo} alt={staff.name} className="h-14 w-14 rounded-full object-cover border-2 border-brand-100" />
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white">{staff.name}</h5>
                        <p className="text-[11px] text-slate-500 font-semibold">{staff.title}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">ID: {staff.id} • {staff.group}</p>
                      </div>
                    </div>
                    <div className="text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 font-semibold text-slate-600 dark:text-slate-350">
                      <div className="flex justify-between"><span className="text-slate-400">Direct Manager:</span> <span>{staff.manager || 'Sarah Jenkins'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Employment:</span> <span>{staff.startDate} ({staff.status})</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Direct Email:</span> <span className="font-mono text-[10px]">{staff.email}</span></div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-3">Expiry Tracking</h4>
              {(() => {
                const expired = isExpired(selectedAssessment.expiryDate);
                const warning = isExpiringSoon(selectedAssessment.expiryDate);
                return (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl border text-xs font-semibold ${expired ? 'bg-rose-50 border-rose-200/50 text-rose-705' : warning ? 'bg-amber-50 border-amber-200/50 text-amber-705' : 'bg-emerald-50 border-emerald-200/50 text-emerald-705'}`}>
                      <div className="flex items-center gap-1.5">
                        {expired ? <AlertTriangle className="h-4.5 w-4.5"/> : warning ? <Clock className="h-4.5 w-4.5"/> : <CheckCircle className="h-4.5 w-4.5"/>}
                        <span className="uppercase text-[9px] font-black tracking-widest">
                          {expired ? 'EXPIRED' : warning ? 'EXPIRING SOON' : 'VALID CERTIFICATION'}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">Expiry Date: <span className="font-bold font-mono">{selectedAssessment.expiryDate}</span></p>
                      {selectedAssessment.reviewDate && <p className="text-[10px] text-slate-400 mt-0.5">Scheduled Review: {selectedAssessment.reviewDate}</p>}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Uploaded Evidence</h4>
                {canManage() && (
                  <button onClick={handleEvidenceUpload} className="text-[10px] font-black text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
                    <Upload className="h-3 w-3" /> Upload
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(!selectedAssessment.evidence || selectedAssessment.evidence.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No evidence checklists uploaded.</p>
                ) : (
                  selectedAssessment.evidence.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-805 text-[11px] font-semibold text-slate-655 dark:text-slate-350">
                      <span className="truncate mr-2 font-mono text-[10px]">{file.name}</span>
                      <span className="text-[9px] text-slate-400 shrink-0">{file.size}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Medication Competency Details Checklist Report */}
      {viewState === 'med-details' && selectedMedAssessment && (
        <div className="space-y-6 animate-slide-up text-xs font-semibold text-slate-700 dark:text-slate-350">
          {/* Header summary panel */}
          <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2e6559]/10 text-[#2e6559] text-[9px] font-black uppercase">Digitized Regulatory Assessment</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
                CQC Medication Competency sign-off & Authorization Record
              </h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Candidate: <strong>{selectedMedAssessment.employeeName} ({selectedMedAssessment.employeeId})</strong> | Assessed: {selectedMedAssessment.date} by {selectedMedAssessment.assessorName}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider ${
                selectedMedAssessment.status === 'Pass' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                Result: {selectedMedAssessment.status}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Column 1: Knowledge Assessment Framework (Q1-Q10) */}
            <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b pb-2">1. Knowledge Competency Framework (Q1 - Q10)</h4>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {KNOWLEDGE_QUESTIONS.map(q => {
                  const pass = selectedMedAssessment.knowledgeScores[q.id] === 'Pass';
                  return (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                      <div className="flex justify-between items-start font-bold mb-1.5">
                        <span className="text-slate-800 dark:text-slate-200 w-4/5 leading-snug">{q.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          pass ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>{selectedMedAssessment.knowledgeScores[q.id]}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                        <strong>Discussion Notes:</strong> {selectedMedAssessment.knowledgeNotes[q.id] || 'No notes recorded.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Practical Skills checklist (P1-P8) */}
            <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b pb-2">2. Practical Skills Competency Checklist (P1 - P8)</h4>
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {PRACTICAL_ITEMS.map(p => {
                  const checked = selectedMedAssessment.practicalChecklist[p.id];
                  return (
                    <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 border ${
                        checked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-300'
                      }`}>
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white leading-tight">{p.title}</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calculations & Scenarios Panel */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Drug Calculations Checker */}
            <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b pb-2">3. Drug Calculation Assessment</h4>
              <div className="space-y-3">
                {DRUG_CALCULATIONS.map(calc => {
                  const val = selectedMedAssessment.calculations[calc.id];
                  const isCorrect = val === calc.correct;
                  return (
                    <div key={calc.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-150/60 dark:border-slate-850 text-xs">
                      <span className="text-slate-800 dark:text-slate-205 w-2/3 leading-snug">{calc.label}</span>
                      <div className="text-right">
                        <span className={`font-black font-mono px-2 py-0.5 rounded text-[10px] ${
                          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          Entered: {val || 'None'} {calc.suffix}
                        </span>
                        {!isCorrect && (
                          <p className="text-[9px] text-slate-400 mt-0.5">Correct: <strong>{calc.correct} {calc.suffix}</strong></p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scenarios and Signatures */}
            <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b pb-2">4. Scenarios & "What would you do if..."</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {SCENARIO_ASSESSMENTS.map(s => {
                    const pass = selectedMedAssessment.scenarios[s.id] === 'Pass';
                    return (
                      <div key={s.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40">
                        <div className="flex justify-between items-start font-bold mb-1">
                          <span className="text-slate-800 dark:text-slate-200 leading-tight">{s.label}</span>
                          <span className={`px-2 py-0.2 rounded text-[8px] font-black uppercase ${
                            pass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>{selectedMedAssessment.scenarios[s.id]}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic mt-1">
                          <strong>Response:</strong> {selectedMedAssessment.scenarioNotes[s.id] || 'No notes logged.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100 space-y-3.5">
                <h5 className="font-bold text-slate-800 dark:text-white text-xs">Action Plan & CQC Verification Signatures</h5>
                <div className="text-xs bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-extrabold">Remedial Action Plan</span>
                  <p className="text-slate-655 dark:text-slate-350 italic font-semibold mt-1">"{selectedMedAssessment.actionPlan}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center text-[10px] font-extrabold uppercase pt-2">
                  <div className="border border-slate-200 bg-white p-2.5 rounded-xl">
                    <span className="text-slate-400 block">Assessor / Manager</span>
                    <span className="text-slate-800 dark:text-white font-black font-mono tracking-tight block mt-1">✓ {selectedMedAssessment.managerSign}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">Countersigned</span>
                  </div>
                  <div className="border border-slate-200 bg-white p-2.5 rounded-xl">
                    <span className="text-slate-400 block">Candidate / Staff</span>
                    <span className="text-slate-800 dark:text-white font-black font-mono block mt-1">✓ {selectedMedAssessment.candidateSign}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">Countersigned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* MODAL: General Competency Create / Edit Form */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-950 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-slide-up">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand-500" />
              {selectedAssessment ? 'Edit Assessment details' : 'Record New Competency Assessment'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Staff Member</label>
                  <select 
                    name="employeeId" 
                    value={formData.employeeId} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                  >
                    <option value="">Select Staff...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assessor</label>
                  <input 
                    type="text" 
                    name="assessorName" 
                    value={formData.assessorName} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Competency Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange} 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                  >
                    {COMPETENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assessment Result</label>
                  <select 
                    name="result" 
                    value={formData.result} 
                    onChange={handleInputChange} 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                  >
                    <option value="Pass">Pass / Competent</option>
                    <option value="Fail">Fail / Needs Improvement</option>
                  </select>
                </div>
              </div>

              {formData.type === 'Other' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Custom Competency Name</label>
                  <input 
                    type="text" 
                    name="customType" 
                    value={formData.customType} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Catheter Care Competency"
                    className="w-full h-9 px-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-brand-900/20 dark:border-brand-800/50 dark:text-white outline-none" 
                  />
                </div>
              )}

              {(formData.type === 'Medication Competency' || formData.type === 'Medication Error Competency') && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center justify-between">
                    <span>{formData.type} Template Checklist</span>
                    <span className="text-[9px] text-slate-400 normal-case">Check off verified steps</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(formData.type === 'Medication Competency' ? MEDICATION_CHECKLIST : MED_ERROR_CHECKLIST).map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-655 dark:text-slate-350 hover:text-slate-800">
                        <input 
                          type="checkbox" 
                          checked={formData.checklist[item] || false}
                          onChange={() => handleChecklistChange(item)}
                          className="h-3.5 w-3.5 rounded text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="truncate">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score achieved (%)</label>
                  <input 
                    type="number" 
                    name="score" 
                    value={formData.score} 
                    onChange={handleInputChange} 
                    required 
                    max="100" 
                    min="0" 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assessment Date</label>
                  <input 
                    type="date" 
                    name="assessmentDate" 
                    value={formData.assessmentDate} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry Expiration Date</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={formData.expiryDate} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assessor Evaluator Comments</label>
                <textarea 
                  name="comments" 
                  value={formData.comments} 
                  onChange={handleInputChange} 
                  rows="2" 
                  placeholder="Record summary observations about practical skills..."
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommendations & Directives</label>
                <textarea 
                  name="recommendations" 
                  value={formData.recommendations} 
                  onChange={handleInputChange} 
                  rows="2" 
                  placeholder="e.g. Schedule refresh in 6 months. Standard monitoring."
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="h-10 px-5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-10 px-6 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4"/>
                  Save Assessment Record
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL: Medication Competency Wizard Form (Digitized Assessment Framework) */}
      {isMedModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-950 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-slide-up text-xs font-semibold text-slate-655 dark:text-slate-350">
            <button
              type="button"
              onClick={() => setIsMedModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="border-b pb-3 mb-4 flex justify-between items-center pr-8">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#2e6559]" />
                  Medication Competency Assessment Wizard
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Digitized CQC Assessment Framework & Safe Administration Checklist</p>
              </div>
              <div className="flex bg-slate-150/40 p-0.5 rounded-lg border dark:border-slate-800 text-[10px] font-extrabold uppercase shrink-0">
                <span className={`px-2 py-1 rounded ${wizardStep === 1 ? 'bg-white text-slate-950 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-400'}`}>1. Knowledge</span>
                <span className={`px-2 py-1 rounded ${wizardStep === 2 ? 'bg-white text-slate-950 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-400'}`}>2. Practical</span>
                <span className={`px-2 py-1 rounded ${wizardStep === 3 ? 'bg-white text-slate-950 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-400'}`}>3. Calculations</span>
                <span className={`px-2 py-1 rounded ${wizardStep === 4 ? 'bg-white text-slate-950 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-400'}`}>4. Sign-off</span>
              </div>
            </div>

            <form onSubmit={handleMedWizardSubmit} className="space-y-5">
              
              {/* STEP 1: Basic Info & Knowledge Framework */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Candidate Staff</label>
                      <select
                        value={medWizardData.employeeId}
                        onChange={(e) => setMedWizardData({ ...medWizardData, employeeId: e.target.value })}
                        required
                        className="w-full h-9 px-3 rounded-lg border bg-slate-50 focus:bg-white focus:border-[#2e6559] dark:bg-slate-900 dark:border-slate-800 text-xs"
                      >
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Assessor / Evaluator</label>
                      <input
                        type="text"
                        required
                        value={medWizardData.assessorName}
                        onChange={(e) => setMedWizardData({ ...medWizardData, assessorName: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border bg-slate-50 focus:bg-white focus:border-[#2e6559] dark:bg-slate-900 dark:border-slate-800 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Assessment Date</label>
                      <input
                        type="date"
                        required
                        value={medWizardData.date}
                        onChange={(e) => setMedWizardData({ ...medWizardData, date: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border bg-slate-50 focus:bg-white focus:border-[#2e6559] dark:bg-slate-900 dark:border-slate-800 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-4">
                    <h4 className="font-extrabold text-[#2e6559] text-xs">Knowledge Competency Framework (Q1 - Q10)</h4>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {KNOWLEDGE_QUESTIONS.map(q => (
                        <div key={q.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-950/20 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800 dark:text-white leading-tight w-4/5">{q.label}</span>
                            <select
                              value={medWizardData.knowledgeScores[q.id]}
                              onChange={(e) => setMedWizardData({
                                ...medWizardData,
                                knowledgeScores: { ...medWizardData.knowledgeScores, [q.id]: e.target.value }
                              })}
                              className="h-7 px-1.5 rounded border bg-white dark:bg-slate-900 text-[10px] font-bold outline-none"
                            >
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                            </select>
                          </div>
                          <textarea
                            rows={1}
                            placeholder="Add candidate discussion and evidence notes..."
                            value={medWizardData.knowledgeNotes[q.id]}
                            onChange={(e) => setMedWizardData({
                              ...medWizardData,
                              knowledgeNotes: { ...medWizardData.knowledgeNotes, [q.id]: e.target.value }
                            })}
                            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-[10px] font-medium resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="h-9 px-5 bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      Next Step <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Practical Skills checklist */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-extrabold text-[#2e6559] text-xs">Practical Skills Competency Checklist (Assessor Observations)</h4>
                  <div className="grid gap-3 sm:grid-cols-2 max-h-[400px] overflow-y-auto pr-1 py-1">
                    {PRACTICAL_ITEMS.map(p => {
                      const checked = medWizardData.practicalChecklist[p.id];
                      return (
                        <div
                          key={p.id}
                          onClick={() => setMedWizardData({
                            ...medWizardData,
                            practicalChecklist: { ...medWizardData.practicalChecklist, [p.id]: !checked }
                          })}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all hover:bg-slate-50/50 flex gap-2.5 ${
                            checked ? 'border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5' : 'border-slate-200'
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 border ${
                            checked ? 'bg-emerald-505 text-white border-emerald-500' : 'bg-slate-50 border-slate-300'
                          }`}>
                            {checked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-white leading-tight">{p.title}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-semibold leading-relaxed">{p.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="h-9 px-4 border rounded-xl font-bold hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="h-9 px-5 bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      Next Step <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Drug Calculations & Scenarios */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid gap-5 md:grid-cols-2">
                    
                    {/* Left: 7 Drug Calculations */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[#2e6559] text-xs">Drug Calculation Assessment</h4>
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {DRUG_CALCULATIONS.map(calc => {
                          const val = medWizardData.calculations[calc.id];
                          const isCorrect = val === calc.correct;
                          return (
                            <div key={calc.id} className="p-3 rounded-xl border border-slate-150 bg-slate-50/20 dark:border-slate-800 dark:bg-slate-900/10 space-y-1.5">
                              <label className="text-[10px] text-slate-655 dark:text-slate-350 block leading-tight font-bold">{calc.label}</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Answer..."
                                  value={val}
                                  onChange={(e) => setMedWizardData({
                                    ...medWizardData,
                                    calculations: { ...medWizardData.calculations, [calc.id]: e.target.value }
                                  })}
                                  className="h-8 w-24 rounded border px-2.5 font-bold font-mono text-center outline-none focus:border-[#2e6559]"
                                />
                                <span className="text-[10px] text-slate-400 font-semibold">{calc.suffix}</span>
                                {val && (
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                    isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {isCorrect ? 'Correct ✓' : 'Incorrect ❌'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: 4 Scenario Questions */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[#2e6559] text-xs">Scenarios & Action Responses</h4>
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {SCENARIO_ASSESSMENTS.map(s => (
                          <div key={s.id} className="p-3 rounded-xl border border-slate-150 bg-slate-50/20 dark:border-slate-800 space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] text-slate-700 dark:text-slate-200 block font-bold leading-tight w-3/4">{s.label}</label>
                              <select
                                value={medWizardData.scenarios[s.id]}
                                onChange={(e) => setMedWizardData({
                                  ...medWizardData,
                                  scenarios: { ...medWizardData.scenarios, [s.id]: e.target.value }
                                })}
                                className="h-7 px-1 rounded border text-[9px] font-black uppercase outline-none bg-white dark:bg-slate-900"
                              >
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                              </select>
                            </div>
                            <textarea
                              rows={1}
                              placeholder="Detail candidate actions and response notes..."
                              value={medWizardData.scenarioNotes[s.id]}
                              onChange={(e) => setMedWizardData({
                                ...medWizardData,
                                scenarioNotes: { ...medWizardData.scenarioNotes, [s.id]: e.target.value }
                              })}
                              className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-[10px] font-medium resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="h-9 px-4 border rounded-xl font-bold hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="h-9 px-5 bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      Next Step <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Action Plan & PIN Sign-off */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in max-w-xl mx-auto">
                  <h4 className="font-extrabold text-[#2e6559] text-xs text-center border-b pb-2">Final Step: Sign-off & Submit Competency</h4>
                  
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 block font-bold">Remedial Action Plan / Assessor Notes</label>
                      <textarea
                        rows={3}
                        required
                        value={medWizardData.actionPlan}
                        onChange={(e) => setMedWizardData({ ...medWizardData, actionPlan: e.target.value })}
                        className="w-full p-3 border rounded-xl bg-white dark:bg-slate-950 font-medium resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Assessor Signature</label>
                        <input
                          type="text"
                          required
                          placeholder="Print Name..."
                          value={medWizardData.managerSign}
                          onChange={(e) => setMedWizardData({ ...medWizardData, managerSign: e.target.value })}
                          className="h-9 w-full rounded-lg border bg-white px-2.5 font-bold font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Candidate Signature</label>
                        <input
                          type="text"
                          required
                          placeholder="Print Name..."
                          value={medWizardData.candidateSign}
                          onChange={(e) => setMedWizardData({ ...medWizardData, candidateSign: e.target.value })}
                          className="h-9 w-full rounded-lg border bg-white px-2.5 font-bold font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-slate-200/50 mt-2">
                      <label className="text-[10px] text-slate-400 block font-bold text-center">Enter Registered Manager PIN to lock sign-off</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="PIN (demo: 1234)"
                        value={medWizardData.pin}
                        onChange={(e) => setMedWizardData({ ...medWizardData, pin: e.target.value })}
                        className="h-10 w-36 mx-auto text-center text-lg font-black tracking-widest rounded-xl border border-slate-350 focus:ring-2 focus:ring-[#2e6559] bg-white dark:bg-slate-950 block"
                      />
                      {wizardError && <p className="text-[9px] font-black text-rose-500 text-center mt-1.5">{wizardError}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="h-9 px-4 border rounded-xl font-bold hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-6 bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Lock className="w-4 h-4" /> Save & Authorise Meds Competency
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL: Renew Competency */}
      {isRenewModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 relative animate-slide-up">
            <button
              type="button"
              onClick={() => setIsRenewModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-500" />
              Renew Certify Competency
            </h3>

            <form onSubmit={handleRenewSubmit} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Assessor Sign-Off</label>
                <input 
                  type="text" 
                  value={renewalData.assessorName}
                  onChange={(e) => setRenewalData({ ...renewalData, assessorName: e.target.value })}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Next Review Date</label>
                  <input 
                    type="date" 
                    value={renewalData.reviewDate}
                    onChange={(e) => setRenewalData({ ...renewalData, reviewDate: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">New Expiry Date</label>
                  <input 
                    type="date" 
                    value={renewalData.expiryDate}
                    onChange={(e) => setRenewalData({ ...renewalData, expiryDate: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsRenewModalOpen(false)}
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-lg bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:text-slate-305 transition-all text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-lg text-white bg-brand-600 hover:bg-brand-500 transition-all text-xs font-bold"
                >
                  Confirm Renewal
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL: Request Training Assessment */}
      {isRequestModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 relative animate-slide-up">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-500" />
              Request Training Assessment
            </h3>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Select Team Member</label>
                <select 
                  value={requestData.employeeId}
                  onChange={(e) => setRequestData({ ...requestData, employeeId: e.target.value })}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                >
                  {employees.filter(emp => emp.manager === currentEmp?.name).map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                  ))}
                  {employees.filter(emp => emp.manager === currentEmp?.name).length === 0 && (
                    <option value="">No Team Staff Registered</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Competency Required</label>
                <select 
                  value={requestData.competencyType}
                  onChange={(e) => setRequestData({ ...requestData, competencyType: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none"
                >
                  {COMPETENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Reason for Request</label>
                <textarea 
                  value={requestData.reason}
                  onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                  required
                  rows="3"
                  placeholder="e.g. Annual renewal due or performance improvement directive..."
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white outline-none resize-none font-medium text-slate-700 dark:text-slate-205"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsRequestModalOpen(false)}
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-all text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition-all text-xs font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </>
  );
};

export default CompetencyManagement;
