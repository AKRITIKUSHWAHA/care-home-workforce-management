import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, ClipboardCheck, AlertTriangle, CheckCircle, Save, Plus, Check, Trash } from 'lucide-react';

const WEEKLY_TASKS = [
  'Dust all Surfaces (Inc. High, Low & Light Fittings)',
  'Hoover (Inc. Behind, Under furniture & Skirting)',
  'Disinfect Touch Points (Light switches, door handles, sockets)',
  'Clean & Sanitise Cupboards (Inc. CD Cabinets)',
  'Clean & Sanitise Medication Fridge',
  'Skirting Boards'
];

const DAILY_TASKS = [
  'Clean & Sanitise Sink',
  'Clean & Sanitise Medication Trolley',
  'Clean & Disinfect Worktops',
  'Empty and Disinfect Bins'
];

// Helper to check if a day is active for weekly tasks (only days 7, 14, 21, 28 are active)
const isWeeklyDayActive = (day) => {
  return day === 7 || day === 14 || day === 21 || day === 28;
};

const MedicationRoomCleaning = () => {
  const { medicationCleaningLogs, setMedicationCleaningLogs, employees, currentRole } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [activeSubTab, setActiveSubTab] = useState('grids'); // 'grids' | 'issues' | 'review'
  
  // States for signature modals
  const [signingCell, setSigningCell] = useState(null); // { type: 'daily'|'weekly', task: string, day: number }
  const [staffInitials, setStaffInitials] = useState('');
  
  // Issue log modal/form state
  const [newIssue, setNewIssue] = useState({
    area: '',
    date: '2026-06-15',
    cleaned: 'N',
    reason: '',
    actionRequired: 'N',
    details: '',
    responsible: '',
    targetDate: ''
  });

  const [saveAlert, setSaveAlert] = useState(false);

  // Month select options
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Toggle cell sign-off
  const handleCellClick = (type, task, day) => {
    // If weekly task and day is not active, block click
    if (type === 'weekly' && !isWeeklyDayActive(day)) {
      return;
    }
    
    // Set cell details for signing
    setSigningCell({ type, task, day });
    
    // Pre-populate with currently signed initials if any
    const existing = type === 'daily' 
      ? (medicationCleaningLogs.cleaningDaily?.[task]?.[day] || '')
      : (medicationCleaningLogs.cleaningWeekly?.[task]?.[day] || '');
      
    setStaffInitials(existing);
  };

  const submitSignOff = () => {
    if (!signingCell) return;
    const { type, task, day } = signingCell;
    const updated = { ...medicationCleaningLogs };
    
    if (type === 'daily') {
      if (!updated.cleaningDaily) updated.cleaningDaily = {};
      if (!updated.cleaningDaily[task]) updated.cleaningDaily[task] = {};
      updated.cleaningDaily[task][day] = staffInitials.toUpperCase().trim();
    } else {
      if (!updated.cleaningWeekly) updated.cleaningWeekly = {};
      if (!updated.cleaningWeekly[task]) updated.cleaningWeekly[task] = {};
      updated.cleaningWeekly[task][day] = staffInitials.toUpperCase().trim();
    }
    
    setMedicationCleaningLogs(updated);
    setSigningCell(null);
    setStaffInitials('');
  };

  // Add issue log exception entry
  const addIssueEntry = (e) => {
    e.preventDefault();
    if (!newIssue.area || !newIssue.date) return;
    
    const entry = {
      id: `mi-${Date.now()}`,
      ...newIssue,
      signature: 'John', // Default logged in staff
      managerSign: ''
    };
    
    const updated = { ...medicationCleaningLogs };
    if (!updated.issues) updated.issues = [];
    updated.issues.push(entry);
    setMedicationCleaningLogs(updated);
    
    // Reset form
    setNewIssue({
      area: '',
      date: '2026-06-15',
      cleaned: 'N',
      reason: '',
      actionRequired: 'N',
      details: '',
      responsible: '',
      targetDate: ''
    });
  };

  // Delete issue log entry
  const deleteIssueEntry = (id) => {
    const updated = { ...medicationCleaningLogs };
    updated.issues = updated.issues.filter(i => i.id !== id);
    setMedicationCleaningLogs(updated);
  };

  // Countersign issue entry (as Manager)
  const managerCountersign = (id) => {
    const updated = { ...medicationCleaningLogs };
    updated.issues = updated.issues.map(i => {
      if (i.id === id) {
        return { ...i, managerSign: 'Sarah Jenkins (Manager)' };
      }
      return i;
    });
    setMedicationCleaningLogs(updated);
  };

  // Save end of month review
  const handleReviewChange = (field, value) => {
    const updated = { ...medicationCleaningLogs };
    if (!updated.reviews) updated.reviews = {};
    if (!updated.reviews[selectedMonth]) {
      updated.reviews[selectedMonth] = { completed: 'Y', comments: '', managerSign: '' };
    }
    updated.reviews[selectedMonth][field] = value;
    setMedicationCleaningLogs(updated);
  };

  const triggerSaveNotification = () => {
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentReview = medicationCleaningLogs.reviews?.[selectedMonth] || { completed: 'Y', comments: '', managerSign: '' };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#2e6559] dark:text-[#3a8273]" />
            <span>Medication Room Cleaning Schedule</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log daily and weekly cleanliness audits for the medication administration room to ensure CQC compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 px-4 rounded-xl border border-slate-250 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#2e6559] dark:bg-slate-800 dark:border-slate-700 dark:text-white cursor-pointer"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Trigger save feedback */}
          <button
            onClick={triggerSaveNotification}
            className={`h-10 px-5 rounded-xl text-white font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
              saveAlert ? 'bg-emerald-600' : 'bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273]'
            }`}
          >
            {saveAlert ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saveAlert ? 'Saved!' : 'Save Progress'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-250 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('grids')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'grids'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Daily & Weekly Checksheet</span>
        </button>
        <button
          onClick={() => setActiveSubTab('issues')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'issues'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Med Room Issues Log</span>
        </button>
        <button
          onClick={() => setActiveSubTab('review')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'review'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>End of Month Review</span>
        </button>
      </div>

      {/* SUB-TAB 1: CLEANING GRIDS */}
      {activeSubTab === 'grids' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in space-y-6 p-5">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">Medication Room - Cleaning Ledger ({selectedMonth})</h2>
            <p className="text-[11px] text-slate-500 leading-normal font-semibold">
              Click on the active day columns to sign off with your initials. Daily tasks are active every day. Weekly tasks are only signable on weekly compliance checkpoints (days 7, 14, 21, and 28). Days marked with 'X' represent locked days.
            </p>
          </div>

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800">
            <table className="w-full text-[10.5px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold select-none">
                  <th className="p-3 border-r dark:border-slate-800 min-w-[200px]">Cleaning Item</th>
                  <th className="p-3 border-r dark:border-slate-800 w-16 text-center">Frequency</th>
                  {daysInMonth.map(d => (
                    <th key={d} className={`p-1 border-r border-slate-200 dark:border-slate-800 text-center w-7 ${isWeeklyDayActive(d) ? 'bg-[#2e6559]/10 text-[#2e6559] dark:bg-[#3a8273]/10 dark:text-[#3a8273]' : ''}`}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-bold text-slate-700 dark:text-slate-350">
                
                {/* 1. Daily Cleaning Checklist */}
                <tr className="bg-slate-100/60 dark:bg-slate-950/60 select-none">
                  <td className="p-2 border-r dark:border-slate-850 font-extrabold text-slate-950 dark:text-white" colSpan={33}>Daily Cleaning Checklist</td>
                </tr>
                {DAILY_TASKS.map((task) => (
                  <tr key={task} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r border-slate-150 dark:border-slate-850 font-semibold">{task}</td>
                    <td className="p-3 border-r border-slate-150 dark:border-slate-850 text-center text-[9px] uppercase tracking-wide font-extrabold text-[#2e6559] dark:text-[#3a8273]">Daily</td>
                    {daysInMonth.map(d => {
                      const sig = medicationCleaningLogs.cleaningDaily?.[task]?.[d] || '';
                      return (
                        <td 
                          key={d} 
                          onClick={() => handleCellClick('daily', task, d)}
                          className={`p-1 border-r border-slate-150 dark:border-slate-850 text-center cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${sig ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : ''}`}
                        >
                          <span className="text-[9px] font-black">{sig || '-'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 2. Weekly Cleaning Checklist */}
                <tr className="bg-slate-100/60 dark:bg-slate-950/60 select-none">
                  <td className="p-2 border-r dark:border-slate-850 font-extrabold text-slate-950 dark:text-white" colSpan={33}>Weekly Deep Cleaning Checklist</td>
                </tr>
                {WEEKLY_TASKS.map((task) => (
                  <tr key={task} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r border-slate-150 dark:border-slate-850 font-semibold">{task}</td>
                    <td className="p-3 border-r border-slate-150 dark:border-slate-850 text-center text-[9px] uppercase tracking-wide font-extrabold text-indigo-600 dark:text-indigo-400">Weekly</td>
                    {daysInMonth.map(d => {
                      const isActive = isWeeklyDayActive(d);
                      const sig = medicationCleaningLogs.cleaningWeekly?.[task]?.[d] || '';
                      
                      if (!isActive) {
                        return (
                          <td key={d} className="p-1 border-r border-slate-150 dark:border-slate-850 text-center text-slate-300 bg-slate-50/50 dark:text-slate-700 dark:bg-slate-950/40 select-none cursor-not-allowed">
                            <span className="font-extrabold text-[8px] opacity-75">X</span>
                          </td>
                        );
                      }
                      
                      return (
                        <td 
                          key={d} 
                          onClick={() => handleCellClick('weekly', task, d)}
                          className={`p-1 border-r border-slate-150 dark:border-slate-850 text-center cursor-pointer transition-colors hover:bg-[#2e6559]/5 ${sig ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-slate-50/50'}`}
                        >
                          <span className="text-[9px] font-black">{sig || '-'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ISSUES EXCEPTION LOG */}
      {activeSubTab === 'issues' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-fade-in text-xs">
          
          {/* New Issue Logger */}
          <form onSubmit={addIssueEntry} className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2e6559] dark:text-[#3a8273]">Record Cleaning Exception / Issue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Area of Issue</label>
                <input 
                  type="text" 
                  value={newIssue.area}
                  onChange={(e) => setNewIssue({ ...newIssue, area: e.target.value })}
                  placeholder="e.g. CD Cabinets, Trolley wheel"
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Date Logged</label>
                <input 
                  type="date" 
                  value={newIssue.date}
                  onChange={(e) => setNewIssue({ ...newIssue, date: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Cleaned? (Y/N)</label>
                <select 
                  value={newIssue.cleaned}
                  onChange={(e) => setNewIssue({ ...newIssue, cleaned: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">If No, Reason / Details</label>
                <input 
                  type="text" 
                  value={newIssue.reason}
                  onChange={(e) => setNewIssue({ ...newIssue, reason: e.target.value })}
                  placeholder="e.g. locked and key lost"
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Action Required? (Y/N)</label>
                <select 
                  value={newIssue.actionRequired}
                  onChange={(e) => setNewIssue({ ...newIssue, actionRequired: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>

            {newIssue.actionRequired === 'Y' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-500">Details of Action</label>
                  <input 
                    type="text" 
                    value={newIssue.details}
                    onChange={(e) => setNewIssue({ ...newIssue, details: e.target.value })}
                    placeholder="e.g. Call maintenance team to drill lock"
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Target Resolution Date</label>
                  <input 
                    type="date" 
                    value={newIssue.targetDate}
                    onChange={(e) => setNewIssue({ ...newIssue, targetDate: e.target.value })}
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="h-9 px-5 bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add Issue Log</span>
              </button>
            </div>
          </form>

          {/* Issue Logs Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Medication Room Cleaning Exception Logs</h3>
            
            <div className="overflow-x-auto border rounded-xl dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold">
                    <th className="p-3">Area of Issue</th>
                    <th className="p-3">Date Logged</th>
                    <th className="p-3 text-center">Cleaned?</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-center">Action Req?</th>
                    <th className="p-3">Details of Action</th>
                    <th className="p-3 text-center">Signed By</th>
                    <th className="p-3">Manager Countersign</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                  {medicationCleaningLogs.issues?.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{issue.area}</td>
                      <td className="p-3 font-mono">{issue.date}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${issue.cleaned === 'Y' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-955/20'}`}>
                          {issue.cleaned}
                        </span>
                      </td>
                      <td className="p-3 italic text-slate-500 dark:text-slate-400">{issue.reason || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${issue.actionRequired === 'Y' ? 'bg-amber-50 text-amber-700 dark:bg-amber-955/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                          {issue.actionRequired}
                        </span>
                      </td>
                      <td className="p-3">{issue.details || 'N/A'} {issue.targetDate && <span className="font-mono text-[9px] text-slate-400 block mt-0.5">Target: {issue.targetDate}</span>}</td>
                      <td className="p-3 text-center text-slate-500 font-extrabold">{issue.signature}</td>
                      
                      <td className="p-3">
                        {issue.managerSign ? (
                          <span className="text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Checked
                          </span>
                        ) : (
                          (currentRole === 'Admin' || currentRole === 'Manager') ? (
                            <button
                              onClick={() => managerCountersign(issue.id)}
                              className="px-2 py-1 text-[9px] font-black uppercase tracking-wider bg-[#2e6559]/10 text-[#2e6559] hover:bg-[#2e6559]/20 rounded transition-colors"
                            >
                              Countersign
                            </button>
                          ) : (
                            <span className="text-slate-400 italic">Awaiting countersign</span>
                          )
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteIssueEntry(issue.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!medicationCleaningLogs.issues || medicationCleaningLogs.issues.length === 0) && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 italic">No issues logged for the Medication Room.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: END OF MONTH REVIEW */}
      {activeSubTab === 'review' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-fade-in text-xs max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">End of Month Cleanliness Review</h2>
            <p className="text-slate-500 mt-0.5">Manager validation of the medication room cleaning matrix checksheet.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-2xl space-y-5">
            <div className="flex flex-col gap-2">
              <span className="font-extrabold text-slate-800 dark:text-white text-sm">Have all tasks been completed at the appropriate frequency?</span>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 font-bold cursor-pointer dark:text-white">
                  <input
                    type="radio"
                    name="completedFrequency"
                    value="Y"
                    checked={currentReview.completed === 'Y'}
                    onChange={() => handleReviewChange('completed', 'Y')}
                    className="h-4 w-4 accent-[#2e6559]"
                  />
                  <span>Yes (All tasks completed)</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer dark:text-white">
                  <input
                    type="radio"
                    name="completedFrequency"
                    value="N"
                    checked={currentReview.completed === 'N'}
                    onChange={() => handleReviewChange('completed', 'N')}
                    className="h-4 w-4 accent-[#2e6559]"
                  />
                  <span>No (Deficits identified)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 block">Actions Taken & Comments</label>
              <textarea
                value={currentReview.comments}
                onChange={(e) => handleReviewChange('comments', e.target.value)}
                placeholder="Details of reviews, actions taken for gaps, or general medication room maintenance details..."
                className="w-full min-h-[90px] p-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 block">Manager Signature Lock</label>
              <input
                type="text"
                value={currentReview.managerSign}
                onChange={(e) => handleReviewChange('managerSign', e.target.value)}
                placeholder="Enter full name to sign off..."
                className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-black"
                disabled={!(currentRole === 'Admin' || currentRole === 'Manager')}
              />
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Only Admin/Manager roles can sign off this month review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cell Signing Modal */}
      {signingCell && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4 mx-4 text-xs font-semibold text-slate-655 dark:text-slate-350">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2e6559] dark:text-[#3a8273]">Confirm Cleaning Sign-Off</span>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 leading-normal">{signingCell.task}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Day {signingCell.day} of {selectedMonth}</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 block">Staff Initials</label>
              <input
                type="text"
                value={staffInitials}
                onChange={(e) => setStaffInitials(e.target.value.slice(0, 3))}
                placeholder="e.g. SJ"
                className="h-9 w-full px-3 border rounded-xl dark:bg-slate-850 dark:border-slate-800 uppercase text-center font-black dark:text-white focus:border-[#2e6559] outline-none"
              />
              <p className="text-[10px] text-slate-400 font-bold">Input up to 3 letters (e.g. initials of signing staff).</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSigningCell(null)}
                className="flex-1 h-9 rounded-xl border font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitSignOff}
                className="flex-1 h-9 rounded-xl bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold transition-colors"
              >
                Sign Off Check
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicationRoomCleaning;
