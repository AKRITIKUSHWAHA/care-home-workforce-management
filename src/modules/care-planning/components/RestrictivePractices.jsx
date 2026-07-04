import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Shield, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Calendar, 
  User, 
  Lock, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  HelpCircle,
  PenTool
} from 'lucide-react';

const RestrictivePractices = ({ patientName }) => {
  const { 
    restrictivePracticeLogs, 
    addRestrictivePracticeLog, 
    setRestrictivePracticeLogs,
    currentRole 
  } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'new'
  const [selectedLog, setSelectedLog] = useState(null);
  
  // PIN Verification State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // { type: 'submit' | 'review', data: any }

  // Form State
  const [residentNameInput, setResidentNameInput] = useState(patientName || '');
  const [dob, setDob] = useState('');
  const [diagnoses, setDiagnoses] = useState('');
  const [completedByName, setCompletedByName] = useState('John (Senior Carer)');
  const [harmToSelfOthers, setHarmToSelfOthers] = useState('');
  const [harmLikelihood, setHarmLikelihood] = useState('');
  const [consentCapacityDecision, setConsentCapacityDecision] = useState('');
  const [circumstancesOfUse, setCircumstancesOfUse] = useState('');
  
  const [restrictions, setRestrictions] = useState({
    closeSupervision: 'N',
    closeSupervisionDetails: '',
    prnMedication: 'N',
    prnMedicationDetails: '',
    bedRails: 'N',
    bedRailsDetails: '',
    lockedDoors: 'N',
    lockedDoorsDetails: '',
    lockedKitchen: 'N',
    lockedKitchenDetails: '',
    lockedPantry: 'N',
    lockedPantryDetails: '',
    accessMoney: 'N',
    accessMoneyDetails: '',
    washingAlone: 'N',
    washingAloneDetails: '',
    razors: 'N',
    razorsDetails: ''
  });

  const [checklist, setChecklist] = useState({
    avoidHarmSelf: 'N',
    avoidHarmOthers: 'N',
    emotionalImpact: 'N',
    proportionality: 'N',
    leastRestrictive: 'N',
    timeLimited: 'N',
    balancedInterests: 'N',
    personCentred: 'N'
  });

  // Review states
  const [reviewNote, setReviewNote] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const handleRestrictionChange = (key, value) => {
    setRestrictions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleChecklistChange = (key, value) => {
    setChecklist(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const initiateSubmit = (e) => {
    e.preventDefault();
    if (!residentNameInput) {
      alert('Please enter service user name.');
      return;
    }
    setPendingAction({ type: 'submit' });
    setPinModalOpen(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinValue !== '1234') {
      setPinError('Incorrect Manager PIN. Demo PIN is 1234.');
      return;
    }
    
    setPinError('');
    setPinModalOpen(false);
    setPinValue('');

    if (pendingAction.type === 'submit') {
      const newLog = {
        id: `RP-${Date.now()}`,
        residentName: residentNameInput,
        dob: dob || '1945-01-01',
        diagnoses: diagnoses || 'Not specified',
        completedByName,
        completedDate: new Date().toISOString().split('T')[0],
        completedBySignature: completedByName,
        harmToSelfOthers,
        harmLikelihood,
        consentCapacityDecision,
        circumstancesOfUse,
        restrictions: {
          closeSupervision: restrictions.closeSupervision,
          prnMedication: restrictions.prnMedication,
          bedRails: restrictions.bedRails,
          lockedDoors: restrictions.lockedDoors,
          lockedKitchen: restrictions.lockedKitchen,
          lockedPantry: restrictions.lockedPantry,
          accessMoney: restrictions.accessMoney,
          washingAlone: restrictions.washingAlone,
          razors: restrictions.razors
        },
        checklist: { ...checklist },
        reviews: []
      };

      addRestrictivePracticeLog(newLog);
      resetForm();
      setViewMode('list');
    } else if (pendingAction.type === 'review') {
      const logId = pendingAction.data.logId;
      setRestrictivePracticeLogs(prev => prev.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            reviews: [
              ...(log.reviews || []),
              {
                date: new Date().toISOString().split('T')[0],
                reviewer: reviewerName || 'Sarah Jenkins',
                details: reviewNote
              }
            ]
          };
        }
        return log;
      }));
      setReviewNote('');
      setReviewerName('');
      // Update selectedLog view
      const updated = restrictivePracticeLogs.find(l => l.id === logId);
      if (updated) {
        setSelectedLog(prev => ({
          ...prev,
          reviews: [
            ...(prev.reviews || []),
            {
              date: new Date().toISOString().split('T')[0],
              reviewer: reviewerName || 'Sarah Jenkins',
              details: reviewNote
            }
          ]
        }));
      }
    }
    setPendingAction(null);
  };

  const initiateReviewSubmit = (logId) => {
    if (!reviewNote) return;
    setPendingAction({ type: 'review', data: { logId } });
    setPinModalOpen(true);
  };

  const resetForm = () => {
    setResidentNameInput(patientName || '');
    setDob('');
    setDiagnoses('');
    setHarmToSelfOthers('');
    setHarmLikelihood('');
    setConsentCapacityDecision('');
    setCircumstancesOfUse('');
    setRestrictions({
      closeSupervision: 'N',
      closeSupervisionDetails: '',
      prnMedication: 'N',
      prnMedicationDetails: '',
      bedRails: 'N',
      bedRailsDetails: '',
      lockedDoors: 'N',
      lockedDoorsDetails: '',
      lockedKitchen: 'N',
      lockedKitchenDetails: '',
      lockedPantry: 'N',
      lockedPantryDetails: '',
      accessMoney: 'N',
      accessMoneyDetails: '',
      washingAlone: 'N',
      washingAloneDetails: '',
      razors: 'N',
      razorsDetails: ''
    });
    setChecklist({
      avoidHarmSelf: 'N',
      avoidHarmOthers: 'N',
      emotionalImpact: 'N',
      proportionality: 'N',
      leastRestrictive: 'N',
      timeLimited: 'N',
      balancedInterests: 'N',
      personCentred: 'N'
    });
  };

  const filteredLogs = patientName 
    ? (restrictivePracticeLogs || []).filter(log => log.residentName.toLowerCase() === patientName.toLowerCase())
    : (restrictivePracticeLogs || []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Restrictive Practices Register</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">CQC Proportionality Assessments & Leat Restrictive Practice logs.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {viewMode === 'list' ? (
              <button
                onClick={() => setViewMode('new')}
                className="h-9 px-4 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> New Assessment
              </button>
            ) : (
              <button
                onClick={() => { setViewMode('list'); resetForm(); }}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Back to Register
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Historical Logs</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all border ${
                    selectedLog?.id === log.id 
                      ? 'border-[#2e6559] bg-[#2e6559]/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{log.residentName}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Assessed on {log.completedDate} by {log.completedByName}
                      </p>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10">
                      {log.reviews?.length || 0} Reviews
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                    <strong>Harm Prevented:</strong> {log.harmToSelfOthers || 'Not specified'}
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <p className="text-slate-400 text-xs py-8 text-center">No restrictive practice assessments registered for this resident.</p>
              )}
            </div>
          </div>

          {/* Details View */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {selectedLog ? (
              <div className="space-y-4 text-xs">
                <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">{selectedLog.residentName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">DOB: {selectedLog.dob} | Diagnoses: {selectedLog.diagnoses}</p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <h4 className="font-bold text-slate-655 dark:text-slate-400">1. Proportionality Rationale</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800">
                      "{selectedLog.harmToSelfOthers}"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-655 dark:text-slate-400">2. Active Restrictions</h4>
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {Object.entries(selectedLog.restrictions || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1.5 p-1.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
                          {val === 'Y' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-350" />
                          )}
                          <span className="font-semibold text-slate-705 dark:text-slate-350 truncate">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-655 dark:text-slate-400">3. CQC Compliance Checklist</h4>
                    <div className="space-y-1 mt-1">
                      {Object.entries(selectedLog.checklist || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-550 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${val === 'Y' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {val === 'Y' ? 'YES' : 'NO'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-805 dark:text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Assessment Reviews
                  </h4>
                  
                  {/* Reviews List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {(selectedLog.reviews || []).map((rev, index) => (
                      <div key={index} className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[10px]">
                        <div className="flex justify-between font-bold text-slate-400 mb-1">
                          <span>{rev.date}</span>
                          <span>Reviewed by: {rev.reviewer}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic">"{rev.details}"</p>
                      </div>
                    ))}
                    {(!selectedLog.reviews || selectedLog.reviews.length === 0) && (
                      <p className="text-slate-400 text-center italic py-2">No reviews completed yet. Must review quarterly.</p>
                    )}
                  </div>

                  {/* Add Review */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <input
                      type="text"
                      placeholder="Reviewer Name"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 font-semibold dark:bg-slate-850 dark:border-slate-800"
                    />
                    <textarea
                      placeholder="Add quarterly review comments and confirmation of proportionality..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-semibold dark:bg-slate-850 dark:border-slate-800 h-16"
                    />
                    <button
                      onClick={() => initiateReviewSubmit(selectedLog.id)}
                      disabled={!reviewNote}
                      className="w-full h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1 shadow disabled:opacity-50"
                    >
                      <PenTool className="w-3.5 h-3.5" /> Submit & Countersign Review
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-12">Select an assessment from the register list to view details or log reviews.</p>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={initiateSubmit} className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs font-semibold">
          <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#2e6559]" /> New Restrictive Practice Assessment
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Provide full diagnostic and proportionality data. All restrictions must be Least Restrictive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-500 block">Service User Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Arthur Pendelton"
                value={residentNameInput}
                onChange={(e) => setResidentNameInput(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">DOB</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Diagnoses (if applicable)</label>
              <input
                type="text"
                placeholder="e.g. Severe Dementia"
                value={diagnoses}
                onChange={(e) => setDiagnoses(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-500 block">Is the restrictive practice necessary to prevent harm to the Person or others? Who?</label>
              <textarea
                required
                placeholder="Describe details of risk..."
                value={harmToSelfOthers}
                onChange={(e) => setHarmToSelfOthers(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">How likely is harm? Frequent? History of harm?</label>
              <textarea
                required
                placeholder="Describe frequency and likelihood..."
                value={harmLikelihood}
                onChange={(e) => setHarmLikelihood(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-500 block">Consent / mental capacity / best interests decision details (Where is it found?)</label>
              <textarea
                required
                placeholder="e.g. MCA completed 2026-05-10, locked in Resident file section 4..."
                value={consentCapacityDecision}
                onChange={(e) => setConsentCapacityDecision(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Circumstances of use (e.g. Sundowning behavior, triggers)</label>
              <textarea
                required
                placeholder="Describe circumstances..."
                value={circumstancesOfUse}
                onChange={(e) => setCircumstancesOfUse(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
              />
            </div>
          </div>

          {/* Agreed Restrictions Checklist */}
          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Agreed Restrictions Grid</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Close / constant supervision', key: 'closeSupervision' },
                { label: 'PRN Medication for behavior', key: 'prnMedication' },
                { label: 'Bed rails', key: 'bedRails' },
                { label: 'Locked external doors / garden', key: 'lockedDoors' },
                { label: 'Locked kitchen', key: 'lockedKitchen' },
                { label: 'Locked fridge / freezer / pantry', key: 'lockedPantry' },
                { label: 'Access to money', key: 'accessMoney' },
                { label: 'Washing / toilet facilities alone', key: 'washingAlone' },
                { label: 'Razors', key: 'razors' }
              ].map(item => (
                <div key={item.key} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-900/40">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <select
                      value={restrictions[item.key]}
                      onChange={(e) => handleRestrictionChange(item.key, e.target.value)}
                      className="h-7 rounded-lg border border-slate-200 bg-white px-2 font-bold text-[10px]"
                    >
                      <option value="N">NO</option>
                      <option value="Y">YES</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CQC Proportionality Checklist */}
          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">CQC Least Restrictive & Proportionality Checklist</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Is restriction necessary to avoid significant harm to the person?', key: 'avoidHarmSelf' },
                { label: 'Is restriction necessary to avoid significant harm to others?', key: 'avoidHarmOthers' },
                { label: 'Does restriction account for the emotional impact on the person?', key: 'emotionalImpact' },
                { label: 'Is the risk enough to justify the restriction (proportionality)?', key: 'proportionality' },
                { label: 'Is it the least restrictive option?', key: 'leastRestrictive' },
                { label: 'Is it imposed only for as long as necessary?', key: 'timeLimited' },
                { label: 'Has the interests of the individual been balanced with those of others?', key: 'balancedInterests' },
                { label: 'Is the restriction consistent with a person-centred approach?', key: 'personCentred' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/20">
                  <span className="text-slate-655 dark:text-slate-350 pr-4">{item.label}</span>
                  <select
                    value={checklist[item.key]}
                    onChange={(e) => handleChecklistChange(item.key, e.target.value)}
                    className="h-7 rounded-lg border border-slate-200 bg-white px-2 font-bold text-[10px]"
                  >
                    <option value="N">NO</option>
                    <option value="Y">YES</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-500 block">Person Completing Form</label>
              <input
                type="text"
                required
                value={completedByName}
                onChange={(e) => setCompletedByName(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-95 transition-all"
              >
                <PenTool className="w-4 h-4" /> Save & PIN Authorize Register
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Manager PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-80 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <Lock className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Manager Counter-Signature Required</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              Confirming CQC compliance and least-restrictive guidelines. Please enter the authorized PIN code to lock this record.
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                required
                maxLength={4}
                placeholder="Enter PIN (demo: 1234)"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value)}
                className="h-10 w-full text-center text-lg font-black tracking-widest rounded-xl border border-slate-200 bg-slate-50 px-3 focus:ring-2 focus:ring-[#2e6559] dark:bg-slate-850 dark:border-slate-800 dark:text-white"
              />
              {pinError && <p className="text-[10px] font-bold text-rose-500 text-center">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setPinModalOpen(false); setPinValue(''); setPinError(''); setPendingAction(null); }}
                  className="flex-1 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs"
                >
                  Confirm Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestrictivePractices;
