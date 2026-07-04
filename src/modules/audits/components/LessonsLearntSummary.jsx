import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileText, Plus, Check, Calendar, User, Lock, BookOpen, PenTool } from 'lucide-react';

const LessonsLearntSummary = () => {
  const { lessonsLearntLogs, addLessonsLearntLog } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'new'
  const [selectedReport, setSelectedReport] = useState(null);

  // PIN modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  // Form State
  const [serviceName, setServiceName] = useState('Swan Care Home');
  const [preparedBy, setPreparedBy] = useState('Sarah Jenkins');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [backgroundSummary, setBackgroundSummary] = useState('');
  const [presentFindings, setPresentFindings] = useState('');
  const [natureOfConcern, setNatureOfConcern] = useState('');
  const [informationReviewed, setInformationReviewed] = useState('');
  const [finalFindings, setFinalFindings] = useState('');
  const [complianceFailings, setComplianceFailings] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const initiateSubmit = (e) => {
    e.preventDefault();
    setPinModalOpen(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinValue !== '1234') {
      setPinError('Incorrect PIN. Demo PIN is 1234.');
      return;
    }

    setPinError('');
    setPinModalOpen(false);
    setPinValue('');

    const newReport = {
      id: `LL-${Date.now()}`,
      serviceName,
      preparedBy,
      date,
      backgroundSummary,
      presentFindings,
      natureOfConcern,
      informationReviewed,
      finalFindings,
      complianceFailings,
      whatWentWell,
      recommendations,
      signedBy: preparedBy,
      signDate: date
    };

    addLessonsLearntLog(newReport);
    setViewMode('list');
    resetForm();
  };

  const resetForm = () => {
    setServiceName('Swan Care Home');
    setPreparedBy('Sarah Jenkins');
    setDate(new Date().toISOString().split('T')[0]);
    setBackgroundSummary('');
    setPresentFindings('');
    setNatureOfConcern('');
    setInformationReviewed('');
    setFinalFindings('');
    setComplianceFailings('');
    setWhatWentWell('');
    setRecommendations('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Lessons Learnt Reports</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Root cause analysis, findings, and prevention recommendation logs.</p>
        </div>
        <div>
          {viewMode === 'list' ? (
            <button
              onClick={() => setViewMode('new')}
              className="h-9 px-4 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> New Lessons Learnt Report
            </button>
          ) : (
            <button
              onClick={() => { setViewMode('list'); resetForm(); }}
              className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-bold"
            >
              Back to Reports
            </button>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Lessons Learnt Summaries</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(lessonsLearntLogs || []).map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedReport(item)}
                  className={`p-4 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all border ${
                    selectedReport?.id === item.id 
                      ? 'border-[#2e6559] bg-[#2e6559]/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-slate-805 dark:text-white text-sm">{item.serviceName}</h5>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        Concern: {item.natureOfConcern || 'General findings'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                        Prepared by {item.preparedBy} on {item.date}
                      </p>
                    </div>
                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#2e6559]/10 text-[#2e6559]">
                      Reviewed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {selectedReport ? (
              <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                  <h4 className="font-black text-slate-800 dark:text-white text-sm">{selectedReport.serviceName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Prepared by: {selectedReport.preparedBy} on {selectedReport.date}</p>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Background Summary</span>
                    <p className="mt-0.5 text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border">"{selectedReport.backgroundSummary}"</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Findings</span>
                    <p className="mt-0.5 text-slate-650 dark:text-slate-300">{selectedReport.presentFindings}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Nature of Concern</span>
                    <p className="mt-0.5 text-slate-650 dark:text-slate-300">{selectedReport.natureOfConcern}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Compliance Failings</span>
                    <p className="mt-0.5 text-rose-600 font-extrabold">{selectedReport.complianceFailings}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Recommendations</span>
                    <p className="mt-0.5 text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 p-2 rounded">{selectedReport.recommendations}</p>
                  </div>
                </div>

                <div className="border-t pt-3 border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                    ✓ Signed by {selectedReport.signedBy}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-12">Select a lessons-learnt report from the register list to view root cause analysis and action plan details.</p>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={initiateSubmit} className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs font-semibold">
          <div className="border-b pb-4 border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">Record Lessons Learnt Summary</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Review root cause and compliance gaps. Require Manager PIN validation.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="h-8 rounded-lg border px-2 font-semibold text-xs w-36"
                placeholder="Service Name"
              />
              <input
                type="text"
                required
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="h-8 rounded-lg border px-2 font-semibold text-xs w-36"
                placeholder="Report Prepared By"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-500 block">Background Summary</label>
              <textarea required value={backgroundSummary} onChange={(e) => setBackgroundSummary(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="e.g. Unauthorised persons staying in staff accommodation..." />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Present Findings</label>
              <textarea required value={presentFindings} onChange={(e) => setPresentFindings(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="Relative brought into home without permission..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-805">
            <div className="space-y-1">
              <label className="text-slate-500 block">Nature of Concern</label>
              <textarea required value={natureOfConcern} onChange={(e) => setNatureOfConcern(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="Staff did not follow reporting process..." />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Information Reviewed (Visitor books, records, etc.)</label>
              <textarea required value={informationReviewed} onChange={(e) => setInformationReviewed(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="Statements, Visitor book, emails..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-805">
            <div className="space-y-1">
              <label className="text-slate-500 block">Final Findings</label>
              <textarea required value={finalFindings} onChange={(e) => setFinalFindings(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="Unauthorised person had access to home..." />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Compliance Failings</label>
              <textarea required value={complianceFailings} onChange={(e) => setComplianceFailings(e.target.value)} className="w-full rounded border p-2.5 h-20 text-rose-600 font-bold" placeholder="Failure by staff members to follow tenancy and reporting concerns process..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-805">
            <div className="space-y-1">
              <label className="text-slate-500 block">What went well?</label>
              <textarea required value={whatWentWell} onChange={(e) => setWhatWentWell(e.target.value)} className="w-full rounded border p-2.5 h-20" placeholder="Directors arranged for the person to leave within 24 hours..." />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 block">Recommendations & Actions</label>
              <textarea required value={recommendations} onChange={(e) => setRecommendations(e.target.value)} className="w-full rounded border p-2.5 h-20 text-amber-700 dark:text-amber-450" placeholder="Accommodation decommissioned, tenancy notices issued, staff supervisions..." />
            </div>
          </div>

          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <PenTool className="w-4 h-4" /> Save & PIN Authorize Report
            </button>
          </div>
        </form>
      )}

      {/* PIN Counter-signature modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-80 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#2e6559]">
              <Lock className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Registered Manager Signature</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              Confirming learnings review and corrective action plans. Please enter manager PIN code.
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
                  onClick={() => { setPinModalOpen(false); setPinValue(''); setPinError(''); }}
                  className="flex-1 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs"
                >
                  Confirm Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsLearntSummary;
