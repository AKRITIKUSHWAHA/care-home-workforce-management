import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Flame, 
  Calendar, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Save, 
  Users,
  Send,
  HelpCircle,
  Eye,
  FileCheck2,
  Trash2,
  Lock,
  X
} from 'lucide-react';
import AccessDenied from '../shared/AccessDenied';

const FireComplianceDashboard = () => {
  const {
    currentRole,
    employees,
    activeEmployeeId,
    fireCertificates,
    complianceCertificates,
    activeManager,
    fireSignatures,
    updateFireCertificate,
    updateComplianceCertificate,
    updateActiveManagerDetails,
    signFireAssessment,
    sendFireAssessmentToAll,
    notifications
  } = useApp();

  const [activeTab, setActiveTab] = useState('fire-safety'); // fire-safety, compliance, sign-offs
  const [selectedCert, setSelectedCert] = useState(null); // for editing certificate details
  const [viewingCertDoc, setViewingCertDoc] = useState(null); // for viewing certificate report mockup
  const [editDate, setEditDate] = useState('');
  const [editCompletedBy, setEditCompletedBy] = useState('');
  const [editFile, setEditFile] = useState(null);

  // Manager Edit State
  const [managerName, setManagerName] = useState(activeManager.name);
  const [managerChangeDate, setManagerChangeDate] = useState(activeManager.changeDate);
  const [isUpdatingManager, setIsUpdatingManager] = useState(false);

  // E-Sign Form State for Employee
  const [esignChecked, setEsignChecked] = useState(false);
  const [esignName, setEsignName] = useState('');
  const [notifiedSuccess, setNotifiedSuccess] = useState(false);

  const activeEmp = employees.find(e => e.id === activeEmployeeId) || employees[0];
  const isManagerial = ['Admin', 'HR', 'Manager', 'Compliance Officer'].includes(currentRole);

  const getDaysToExpiry = (expiryDateStr) => {
    if (!expiryDateStr || expiryDateStr === 'N/A') return 999;
    const exp = new Date(expiryDateStr);
    const refDate = new Date('2026-06-13'); // Fixed reference point matching system local time
    const diffTime = exp - refDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (expiryDateStr) => {
    const days = getDaysToExpiry(expiryDateStr);
    if (days <= 0) {
      return {
        text: 'Expired',
        style: 'bg-rose-50 text-rose-750 border-rose-250 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
        dot: 'bg-rose-500'
      };
    }
    if (days <= 30) {
      return {
        text: `Expiring soon (${days}d)`,
        style: 'bg-amber-50 text-amber-705 border-amber-250 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/50',
        dot: 'bg-amber-500'
      };
    }
    return {
      text: 'Valid',
      style: 'bg-emerald-50 text-emerald-705 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
      dot: 'bg-emerald-500'
    };
  };

  const handleUpdateCertSubmit = (e) => {
    e.preventDefault();
    if (!selectedCert) return;

    const nextRenewal = calculateNextRenewal(editDate, selectedCert.frequency);
    const updatedFields = {
      lastCompleted: editDate,
      renewalDate: nextRenewal,
      completedBy: editCompletedBy,
      file: editFile ? editFile.name : selectedCert.file
    };

    if (selectedCert.id.startsWith('fire')) {
      updateFireCertificate(selectedCert.id, updatedFields);
    } else {
      updateComplianceCertificate(selectedCert.id, updatedFields);
    }

    setSelectedCert(null);
    setEditFile(null);
  };

  const calculateNextRenewal = (completedDate, frequency) => {
    if (!completedDate) return '';
    const date = new Date(completedDate);
    if (frequency.includes('6 Months')) {
      date.setMonth(date.getMonth() + 6);
    } else if (frequency.includes('Yearly') || frequency.includes('Annually')) {
      date.setFullYear(date.getFullYear() + 1);
    } else if (frequency.includes('2 Years')) {
      date.setFullYear(date.getFullYear() + 2);
    } else if (frequency.includes('5 Years')) {
      date.setFullYear(date.getFullYear() + 5);
    } else {
      date.setMonth(date.getMonth() + 6); // default 6 month fallback
    }
    return date.toISOString().split('T')[0];
  };

  const handleManagerUpdateSubmit = (e) => {
    e.preventDefault();
    setIsUpdatingManager(true);
    setTimeout(() => {
      updateActiveManagerDetails(managerName, managerChangeDate);
      setIsUpdatingManager(false);
    }, 600);
  };

  const handleEmployeeSignSubmit = (e) => {
    e.preventDefault();
    if (!esignChecked) {
      alert('Please check the confirmation box to authorize your signature.');
      return;
    }
    if (esignName.trim().toLowerCase() !== activeEmp.name.toLowerCase()) {
      alert(`Signature name must match your profile name exactly: "${activeEmp.name}"`);
      return;
    }
    signFireAssessment(activeEmp.id, esignName);
    setEsignChecked(false);
    setEsignName('');
  };

  const handleNotifyStaff = () => {
    sendFireAssessmentToAll();
    setNotifiedSuccess(true);
    setTimeout(() => {
      setNotifiedSuccess(false);
    }, 4500);
  };

  // Sign-off metrics
  const totalEmployees = employees.length;
  const signedEmployees = Object.values(fireSignatures).filter(s => s.signed).length;
  const signatureProgress = Math.round((signedEmployees / totalEmployees) * 100);

  // E-Sign contents for guidelines review
  const FIRE_GUIDELINES_SUMMARY = `
    AS CARE HOME — FIRE SAFETY RISK ASSESSMENT COMPLIANCE MANUAL
    Approved by General Manager: ${activeManager.name} (Effective: ${activeManager.changeDate})
    
    1. GENERAL SAFETY STANDARD OPERATING PROCEDURE
    - Fire exit pathways, corridors, and doorways must remain entirely clear of obstacles (e.g. wheelchairs, hoists, laundry bins) at all times.
    - All self-closing fire doors must remain closed and never be wedged or blocked open.
    - Faulty electrical appliances or compromised PAT stickers must be immediately reported to safety leads.

    2. FIRE ALARM SYSTEM TESTING & EMERGENCIES
    - In case of fire alarm activation:
      - Staff must immediately execute the Horizontal Evacuation protocol, moving residents from the high-risk fire sector to a safe adjoining compartment.
      - NEVER use the elevators/lifts. Lift operations will automatically cease, and they will go to the ground floor.
      - The designated shift lead must carry the Resident Roster and Receptionist Visitor check-in logs to the assembly area.
      - Staff must be fully trained on the use of personal protective evacuation sheets (evac sheets) situated under residents' mattresses.

    3. EXTINGUISHER & EQUIPMENT HANDLING
    - Fire fighting equipment is situated throughout all corridors.
    - Do not attempt to tackle major blazes. Focus strictly on resident evacuation.
    - Use Red Water/Foam extinguishers for solid combustions, Blue Dry Powder for electrical risks, and Black CO2 for kitchen oil/fats fires.
  `;

  return (
    <div className="space-y-6 animate-fade-in p-2 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 font-sans">
            <Flame className="h-8 w-8 text-rose-500 animate-pulse" />
            Fire Safety & Compliance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Archiving safety certificates, managing active manager details, and recording employee risk declarations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/60 dark:border-slate-800 text-xs font-bold gap-1 self-start">
          <button
            onClick={() => setActiveTab('fire-safety')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'fire-safety'
                ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            Fire Safety
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'compliance'
                ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-[#2e6559] dark:text-[#3a8273]" />
            Compliance Certs
          </button>
          <button
            onClick={() => setActiveTab('sign-offs')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'sign-offs'
                ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
            Staff Sign-offs
            {activeTab !== 'sign-offs' && !fireSignatures[activeEmp.id]?.signed && !isManagerial && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: FIRE SAFETY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'fire-safety' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Certificates tracking cards */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <FileCheck2 className="h-4.5 w-4.5 text-rose-500" />
              <span>Fire Inspection Certificates</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {fireCertificates.map(cert => {
                const badge = getStatusBadge(cert.renewalDate);
                const days = getDaysToExpiry(cert.renewalDate);

                return (
                  <div 
                    key={cert.id}
                    className="glass-card rounded-3xl border border-slate-200/70 dark:border-slate-800/80 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-150 leading-tight">
                          {cert.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[8px] border uppercase shrink-0 ${badge.style}`}>
                          {badge.text}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-400 font-semibold">
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                          <span>Inspection Interval:</span>
                          <span className="text-slate-600 dark:text-slate-350">{cert.frequency}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                          <span>Last Completed:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">{cert.lastCompleted}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                          <span>Renewal Due Date:</span>
                          <span className={`font-bold ${days <= 30 ? 'text-amber-500 font-black' : days <= 0 ? 'text-rose-500 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                            {cert.renewalDate}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                          <span>Service Contractor:</span>
                          <span className="text-slate-600 dark:text-slate-350">{cert.completedBy || 'Awaiting Report'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Certificate Document:</span>
                          <span 
                            onClick={() => setViewingCertDoc(cert)}
                            className="text-[#2e6559] dark:text-[#3a8273] font-bold flex items-center gap-1 cursor-pointer hover:underline truncate max-w-[150px]"
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            {cert.file}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isManagerial && (
                      <button
                        onClick={() => {
                          setSelectedCert(cert);
                          setEditDate(cert.lastCompleted);
                          setEditCompletedBy(cert.completedBy);
                        }}
                        className="h-8 w-full rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 font-bold dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-855 dark:border-slate-800 transition-all text-[10px] flex items-center justify-center gap-1.5"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Update Certificate Record</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Fire Risk Assessment guidelines quick-info */}
              <div className="glass-card rounded-3xl bg-rose-50/20 dark:bg-rose-955/5 border border-rose-500/10 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-rose-500" />
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-150">Fire Risk Assessment</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The Care Home Fire Risk Assessment manual contains safety evacuations, horizontal evacuation grids, and extinguisher positions.
                  </p>
                  <div className="text-[10px] text-slate-400 font-semibold space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>Assigned Auditor:</span>
                      <span className="text-slate-700 dark:text-slate-300">AS Safety Consultants</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yearly Review Frequency:</span>
                      <span className="text-slate-700 dark:text-slate-300">Annually (Due Nov 26)</span>
                    </div>
                  </div>
                </div>

                <a
                  href="/Fire risk assessment.pdf"
                  target="_blank"
                  className="h-8 w-full rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 font-bold dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all text-[10px] flex items-center justify-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Fire risk assessment.pdf</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Manager Settings Card */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-4.5 w-4.5 text-slate-400" />
              <span>Manager & Administration</span>
            </h2>

            <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-5">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Registered Manager</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Change the designated Registered Manager and the date of effect.</p>
              </div>

              {/* Current Status Preview */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-900 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Active Manager:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeManager.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Date:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeManager.changeDate}</span>
                </div>
              </div>

              {isManagerial ? (
                <form onSubmit={handleManagerUpdateSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 block uppercase text-[10px]">Manager Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 block uppercase text-[10px]">Date of Change</label>
                    <input
                      type="date"
                      required
                      value={managerChangeDate}
                      onChange={(e) => setManagerChangeDate(e.target.value)}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-850 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingManager}
                    className="h-9 w-full rounded-xl bg-brand-600 hover:bg-brand-550 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/10 active:scale-[0.98] disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isUpdatingManager ? 'Updating...' : 'Apply Manager Change'}</span>
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/20 border border-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                  <span>Only Administrators and Managers have access permissions to change the designated manager details.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: COMPLIANCE SECTION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'compliance' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Regulatory Compliance Registry</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track care home safety inspection certificates and legal compliance expirations.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complianceCertificates.map(cert => {
              const badge = getStatusBadge(cert.renewalDate);
              const days = getDaysToExpiry(cert.renewalDate);

              return (
                <div 
                  key={cert.id}
                  className="glass-card rounded-3xl border border-slate-200/70 dark:border-slate-800/80 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-xs text-slate-855 dark:text-slate-150 leading-tight">
                        {cert.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[8px] border uppercase shrink-0 ${badge.style}`}>
                        {badge.text}
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-400 font-semibold">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                        <span>Interval:</span>
                        <span className="text-slate-600 dark:text-slate-350">{cert.frequency}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                        <span>Last Completed:</span>
                        <span className="text-slate-700 dark:text-slate-300">{cert.lastCompleted}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                        <span>Renewal Due:</span>
                        <span className={`font-bold ${days <= 30 ? 'text-amber-500 font-black' : days <= 0 ? 'text-rose-500 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                          {cert.renewalDate}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                        <span>Contractor:</span>
                        <span className="text-slate-600 dark:text-slate-350 truncate max-w-[150px]" title={cert.completedBy}>
                          {cert.completedBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certificate File:</span>
                        <span 
                          onClick={() => setViewingCertDoc(cert)}
                          className="text-[#2e6559] dark:text-[#3a8273] font-bold flex items-center gap-1 cursor-pointer hover:underline truncate max-w-[155px]"
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          {cert.file}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isManagerial && (
                    <button
                      onClick={() => {
                        setSelectedCert(cert);
                        setEditDate(cert.lastCompleted);
                        setEditCompletedBy(cert.completedBy);
                      }}
                      className="h-7 w-full rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 font-bold dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-855 dark:border-slate-800 transition-all text-[9px] flex items-center justify-center gap-1.5 animate-fade-in"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Update Inspection Log</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: STAFF SIGN-OFFS (READ & SIGN FLOW) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'sign-offs' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* MANAGER VIEW: SIGNATURES LEDGER */}
          {isManagerial && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Progress Summary */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between gap-5 shadow-sm">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-150">FRA Signatures Progress</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Monitor how many team members have successfully signed the active Fire Risk Assessment guidelines.
                  </p>
                </div>

                <div className="relative flex items-center justify-center py-4">
                  <svg width="120" height="120" className="transform -rotate-90">
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" className="dark:stroke-slate-800" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke="#4f46e5" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={314.15}
                      strokeDashoffset={314.15 - (314.15 * signatureProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{signatureProgress}%</span>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Signed</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold border-b pb-2">
                    <span>Total Workforce:</span>
                    <span className="text-slate-700 dark:text-slate-250 font-bold">{totalEmployees} staff</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold border-b pb-2">
                    <span>E-Signed Complete:</span>
                    <span className="text-emerald-600 font-bold">{signedEmployees} staff</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Awaiting Review:</span>
                    <span className="text-amber-600 font-bold">{totalEmployees - signedEmployees} staff</span>
                  </div>
                </div>

                <button
                  onClick={handleNotifyStaff}
                  className="h-10 w-full rounded-xl bg-brand-600 hover:bg-brand-550 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/10 active:scale-[0.98] mt-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Notify Pending Staff</span>
                </button>

                {notifiedSuccess && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450 shrink-0" />
                    <span>Notifications sent to {totalEmployees - signedEmployees} pending staff members!</span>
                  </div>
                )}
              </div>

              {/* Employee Signature Grid Ledger */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="border-b pb-3 mb-2">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-150">Workforce Signatures Register</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Active audit record verifying yearly employee fire risk file checks.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-2">Staff Member</th>
                        <th className="py-3 px-2">Role/Title</th>
                        <th className="py-3 px-2">E-Sign Status</th>
                        <th className="py-3 px-2">Signed Timestamp</th>
                        <th className="py-3 px-2">Audit Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                      {employees.map(emp => {
                        const sig = fireSignatures[emp.id] || { signed: false, signedAt: '', signatureName: '' };
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                            <td className="py-3 px-2 flex items-center gap-3">
                              <img 
                                src={emp.photo} 
                                alt={emp.name}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <span className="font-bold text-slate-900 dark:text-slate-200">{emp.name}</span>
                            </td>
                            <td className="py-3 px-2 text-slate-550 dark:text-slate-400 font-medium">{emp.title}</td>
                            <td className="py-3 px-2">
                              {sig.signed ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] font-extrabold uppercase">
                                  Signed
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-extrabold uppercase animate-pulse">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-slate-450 font-mono text-[10px]">
                              {sig.signed ? sig.signedAt : '—'}
                            </td>
                            <td className="py-3 px-2">
                              {sig.signed ? (
                                <span className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>Signed: "{sig.signatureName}"</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Awaiting Sign</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* EMPLOYEE VIEW: SIGN-OFF PORTAL */}
          {!isManagerial && (
            <div className="max-w-2xl mx-auto space-y-6">
              {fireSignatures[activeEmp.id]?.signed ? (
                /* ALREADY SIGNED VIEW */
                <div className="glass-card rounded-3xl border border-emerald-200/80 bg-emerald-50/10 p-6 text-center space-y-4 shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto shadow-md">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">Fire Risk Review Completed</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold">
                      You have successfully reviewed and signed the active Fire Risk Assessment guidelines.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 inline-block text-left text-xs space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between gap-10">
                      <span className="text-slate-400">Signed User:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{fireSignatures[activeEmp.id].signatureName}</span>
                    </div>
                    <div className="flex justify-between gap-10">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{fireSignatures[activeEmp.id].signedAt}</span>
                    </div>
                    <div className="flex justify-between gap-10">
                      <span className="text-slate-400">Audit Status:</span>
                      <span className="font-extrabold text-emerald-600 uppercase text-[9px] border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/20">Compliant</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic font-semibold">Thank you for helping keep AS Care Home safe and compliant.</p>
                </div>
              ) : (
                /* PENDING E-SIGN VIEW */
                <div className="space-y-4">
                  <div className="bg-rose-50/30 border border-rose-500/20 p-4 rounded-3xl flex items-start gap-3 text-rose-800 dark:text-rose-455">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold">Yearly Fire Safety Sign-off Required</p>
                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        CQC regulations require all staff members to read, review, and sign off the Care Home Fire Risk Assessment yearly. Please review the document summary below and e-sign.
                      </p>
                    </div>
                  </div>

                  {/* High Fidelity Scrollable Document Review */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-250/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md flex flex-col max-h-[450px]">
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-brand-600" />
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">FRA Guidelines Summary & Declaration</span>
                      </div>
                      <a 
                        href="/Fire risk assessment.pdf"
                        target="_blank"
                        className="text-[10px] font-bold text-brand-600 hover:text-brand-700 underline"
                      >
                        Download Full PDF
                      </a>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-mono whitespace-pre-line custom-scrollbar">
                      {FIRE_GUIDELINES_SUMMARY}
                    </div>
                  </div>

                  {/* E-Sign panel */}
                  <div className="glass-card rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    <form onSubmit={handleEmployeeSignSubmit} className="space-y-4 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={esignChecked}
                          onChange={(e) => setEsignChecked(e.target.checked)}
                          className="h-4.5 w-4.5 text-brand-600 border-slate-300 rounded focus:ring-brand-500 cursor-pointer mt-0.5 shrink-0"
                        />
                        <span className="text-[11px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
                          I confirm that I have read and understood the Fire Risk Assessment guidelines, horizontal evacuation paths, and agree to abide by all care home fire compliance protocols.
                        </span>
                      </label>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-550 block uppercase text-[9px] tracking-wide">Type Your Full Name to Authorize Signature</label>
                        <input
                          type="text"
                          required
                          placeholder={activeEmp.name}
                          value={esignName}
                          onChange={(e) => setEsignName(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-850 dark:text-white text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        className="h-10 w-full rounded-xl bg-brand-600 hover:bg-brand-550 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/10 active:scale-[0.98]"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Authorize Electronic Signature</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* MODAL: EDIT CERTIFICATE DATES (FOR ADMIN/MANAGER COMPLIANCE MANAGEMENT) */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-modal max-w-sm w-full rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative bg-white dark:bg-slate-950 animate-slide-up">
            
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm border-b pb-3 mb-4 flex items-center gap-2">
              <Upload className="h-4.5 w-4.5 text-[#2e6559] dark:text-[#3a8273]" />
              <span>Update Certificate: {selectedCert.name}</span>
            </h3>

            <form onSubmit={handleUpdateCertSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block uppercase text-[9px] tracking-wide">Inspection Completed Date</label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-850 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block uppercase text-[9px] tracking-wide">Next Auto Renewal Frequency</label>
                <div className="h-10 w-full rounded-xl border border-slate-150 bg-slate-100/70 px-3 flex items-center text-slate-500 dark:border-slate-850 dark:bg-slate-900/60 font-semibold font-mono text-[10px]">
                  {selectedCert.frequency} (Auto Next Renewal: {calculateNextRenewal(editDate, selectedCert.frequency) || 'N/A'})
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block uppercase text-[9px] tracking-wide">Service Contractor / Engineer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. G.P. Masons"
                  value={editCompletedBy}
                  onChange={(e) => setEditCompletedBy(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-850 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 block uppercase text-[9px] tracking-wide">Upload Certificate File (.pdf, .jpg)</label>
                <label className="h-14 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-850 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-[9px] text-slate-400 font-bold">
                  <Upload className="h-4 w-4" />
                  <span>{editFile ? editFile.name : (selectedCert.file || 'Select certificate report file')}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex gap-2 justify-end border-t pt-3 mt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="h-8.5 px-4 rounded-xl border font-bold text-slate-500 hover:bg-slate-55 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-550 text-white font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOCK CERTIFICATE DOCUMENT VIEWER */}
      {viewingCertDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-stone-50 text-stone-900 rounded-3xl p-8 border-4 border-amber-800 shadow-2xl animate-fade-in custom-scrollbar overflow-y-auto max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setViewingCertDoc(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors shadow-sm"
              title="Close Certificate"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Gold Certificate Border Frame */}
            <div className="border-4 border-double border-amber-600/40 p-6 md:p-10 rounded-2xl bg-white space-y-6 relative overflow-hidden">
              
              {/* Decorative background watermark stamp */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <Flame className="w-80 h-80 text-amber-800" />
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-2 bg-amber-50 rounded-full text-amber-700 border border-amber-200/60 mb-2">
                  <ShieldAlert className="h-10 w-10" />
                </div>
                <h2 className="text-xs font-black tracking-widest text-amber-850 uppercase font-serif">
                  Care Home Safety & Compliance Certification
                </h2>
                <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 font-serif">
                  CERTIFICATE OF COMPLIANCE
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
              </div>

              {/* Certificate Body Statement */}
              <div className="space-y-4 text-center mt-6">
                <p className="text-xs italic text-stone-500 font-serif">
                  This document serves as formal confirmation that the regulatory safety inspection and maintenance procedures have been fully performed for:
                </p>
                <h3 className="text-lg md:text-xl font-bold text-amber-900 uppercase font-sans">
                  {viewingCertDoc.name}
                </h3>
                <p className="text-xs text-stone-600">
                  at the designated site facility of <span className="font-semibold text-stone-850">Oakfield Care Home (AS Care group)</span>.
                </p>
              </div>

              {/* Inspection Details Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-stone-200 py-6 text-xs bg-stone-50/50 rounded-xl px-4 font-sans font-medium">
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">Inspection Category</span>
                    <span className="text-stone-800 font-bold">{viewingCertDoc.id.startsWith('fire') ? 'Fire Safety & Prevention' : 'Property & Facilities Compliance'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">Authorized Contractor / Inspector</span>
                    <span className="text-stone-800 font-bold">{viewingCertDoc.completedBy || 'Awaiting Report'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">Inspection Cycle Frequency</span>
                    <span className="text-stone-800 font-bold">{viewingCertDoc.frequency}</span>
                  </div>
                </div>

                <div className="space-y-2 border-l border-stone-200 pl-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">Date of Inspection</span>
                    <span className="text-stone-800 font-bold">{viewingCertDoc.lastCompleted}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">Certificate Expiry / Renewal Due</span>
                    <span className="text-stone-800 font-bold text-amber-800">{viewingCertDoc.renewalDate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">File Reference</span>
                    <span className="text-stone-800 font-mono text-[10px] break-all">{viewingCertDoc.file}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Authority Stamps & Signatures */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                
                {/* Authority Signature */}
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Designated Safety Officer</span>
                  <div className="font-serif italic text-base text-amber-800 border-b border-stone-300 pb-1 px-4 min-w-[150px]">
                    {activeManager.name}
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold block">Registered Manager (Date: {activeManager.changeDate})</span>
                </div>

                {/* Audit Stamp */}
                <div className="relative flex items-center justify-center border-4 border-emerald-600 text-emerald-600 rounded-full h-24 w-24 transform -rotate-12 bg-white/80 p-2 font-black uppercase text-center flex-col shadow-md">
                  <span className="text-[8px] tracking-wider leading-none">AS CARE AUDIT</span>
                  <span className="text-[10px] my-0.5 leading-none">VERIFIED</span>
                  <span className="text-[8px] tracking-widest leading-none">COMPLIANT</span>
                  <div className="absolute inset-0 border border-emerald-600 rounded-full m-1 border-dashed" />
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between mt-6 text-xs text-stone-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Statutory Safety Standard Verified</span>
              </span>
              <button
                onClick={() => setViewingCertDoc(null)}
                className="h-9 px-6 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FireComplianceDashboard;
