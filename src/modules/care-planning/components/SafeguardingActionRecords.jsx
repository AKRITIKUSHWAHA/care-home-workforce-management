import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  AlertOctagon, 
  Plus, 
  Check, 
  X, 
  Calendar, 
  User, 
  Lock, 
  FileText, 
  Clock, 
  PhoneCall, 
  AlertTriangle,
  PenTool
} from 'lucide-react';

const SafeguardingActionRecords = ({ patientName }) => {
  const { 
    safeguardingLogs, 
    addSafeguardingLog, 
    setSafeguardingLogs,
    currentRole 
  } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'new'
  const [selectedLog, setSelectedLog] = useState(null);

  // PIN Verification State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // { type: 'submit' | 'comm', data: any }

  // Form State
  const [allegationReceivedFrom, setAllegationReceivedFrom] = useState('');
  const [dateReceived, setDateReceived] = useState(new Date().toISOString().split('T')[0]);
  const [residentsAffected, setResidentsAffected] = useState(patientName || '');
  const [descriptionLocation, setDescriptionLocation] = useState('');
  const [localityTeamInformedDate, setLocalityTeamInformedDate] = useState('');
  const [localityTeamInformedBy, setLocalityTeamInformedBy] = useState('');
  const [policeInformedDate, setPoliceInformedDate] = useState('NA');
  const [policeInformedBy, setPoliceInformedBy] = useState('NA');
  const [userDisclosure, setUserDisclosure] = useState('N');
  const [disclosureDate, setDisclosureDate] = useState('');
  const [disclosureStaff, setDisclosureStaff] = useState('');
  const [disclosureNotesLocation, setDisclosureNotesLocation] = useState('');
  const [immediateActions, setImmediateActions] = useState('');
  const [consentGained, setConsentGained] = useState('Y');
  const [bestInterestsInvolvement, setBestInterestsInvolvement] = useState('');
  const [notesLocation, setNotesLocation] = useState('');
  const [staffSuspended, setStaffSuspended] = useState('None');
  const [suspensionNotesLocation, setSuspensionNotesLocation] = useState('');
  const [cqcInformedDate, setCqcInformedDate] = useState('');
  const [cqcInformedBy, setCqcInformedBy] = useState('');
  const [cqcRecordLocation, setCqcRecordLocation] = useState('');
  const [lessonsLearnt, setLessonsLearnt] = useState('Y');
  const [lessonsLearntDetails, setLessonsLearntDetails] = useState('');
  const [completedBy, setCompletedBy] = useState('Sarah Jenkins');

  // Comm states
  const [commDetails, setCommDetails] = useState('');
  const [commSignature, setCommSignature] = useState('');

  const initiateSubmit = (e) => {
    e.preventDefault();
    if (!residentsAffected) {
      alert('Please specify the resident affected.');
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
        id: `SG-${Date.now()}`,
        allegationReceivedFrom,
        dateReceived,
        residentsAffected,
        descriptionLocation,
        localityTeamInformedDate,
        localityTeamInformedBy,
        policeInformedDate,
        policeInformedBy,
        userDisclosure,
        disclosureDate: userDisclosure === 'Y' ? disclosureDate : '',
        disclosureStaff: userDisclosure === 'Y' ? disclosureStaff : '',
        disclosureNotesLocation: userDisclosure === 'Y' ? disclosureNotesLocation : '',
        immediateActions,
        consentGained,
        bestInterestsInvolvement,
        notesLocation,
        staffSuspended,
        suspensionNotesLocation,
        cqcInformedDate,
        cqcInformedBy,
        cqcRecordLocation,
        communications: [],
        lessonsLearnt,
        lessonsLearntDetails,
        completedBy,
        completedDate: new Date().toISOString().split('T')[0]
      };

      addSafeguardingLog(newLog);
      resetForm();
      setViewMode('list');
    } else if (pendingAction.type === 'comm') {
      const logId = pendingAction.data.logId;
      setSafeguardingLogs(prev => prev.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            communications: [
              ...(log.communications || []),
              {
                date: new Date().toISOString().split('T')[0],
                details: commDetails,
                signature: commSignature || 'Sarah Jenkins'
              }
            ]
          };
        }
        return log;
      }));
      setCommDetails('');
      setCommSignature('');
      
      const updated = safeguardingLogs.find(l => l.id === logId);
      if (updated) {
        setSelectedLog(prev => ({
          ...prev,
          communications: [
            ...(prev.communications || []),
            {
              date: new Date().toISOString().split('T')[0],
              details: commDetails,
              signature: commSignature || 'Sarah Jenkins'
            }
          ]
        }));
      }
    }
    setPendingAction(null);
  };

  const initiateCommSubmit = (logId) => {
    if (!commDetails) return;
    setPendingAction({ type: 'comm', data: { logId } });
    setPinModalOpen(true);
  };

  const resetForm = () => {
    setAllegationReceivedFrom('');
    setDateReceived(new Date().toISOString().split('T')[0]);
    setResidentsAffected(patientName || '');
    setDescriptionLocation('');
    setLocalityTeamInformedDate('');
    setLocalityTeamInformedBy('');
    setPoliceInformedDate('NA');
    setPoliceInformedBy('NA');
    setUserDisclosure('N');
    setDisclosureDate('');
    setDisclosureStaff('');
    setDisclosureNotesLocation('');
    setImmediateActions('');
    setConsentGained('Y');
    setBestInterestsInvolvement('');
    setNotesLocation('');
    setStaffSuspended('None');
    setSuspensionNotesLocation('');
    setCqcInformedDate('');
    setCqcInformedBy('');
    setCqcRecordLocation('');
    setLessonsLearnt('Y');
    setLessonsLearntDetails('');
  };

  const filteredLogs = patientName 
    ? (safeguardingLogs || []).filter(log => log.residentsAffected.toLowerCase() === patientName.toLowerCase())
    : (safeguardingLogs || []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Safeguarding Action Records</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Contemporaneous records of notifications and suspension audits for safeguarding compliance.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {viewMode === 'list' ? (
              <button
                onClick={() => setViewMode('new')}
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Log Allegation / Incident
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
          {/* List */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Safeguarding Logs</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all border ${
                    selectedLog?.id === log.id 
                      ? 'border-rose-500 bg-rose-500/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{log.residentsAffected}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Received on {log.dateReceived} from {log.allegationReceivedFrom}
                      </p>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-250 dark:bg-rose-500/10">
                      CQC: {log.cqcInformedDate || 'Pending'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                    <strong>Immediate Actions:</strong> {log.immediateActions || 'None specified'}
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <p className="text-slate-400 text-xs py-8 text-center">No safeguarding actions registered for this resident.</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {selectedLog ? (
              <div className="space-y-4 text-xs">
                <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 uppercase mb-2 inline-block">Active Investigation</span>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">{selectedLog.residentsAffected}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Reported by: {selectedLog.allegationReceivedFrom} on {selectedLog.dateReceived}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-550 block">Immediate Action Taken:</h4>
                    <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 italic mt-0.5">
                      "{selectedLog.immediateActions}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
                      <span className="font-bold text-slate-400 block uppercase">Locality Team</span>
                      <p className="text-slate-700 dark:text-slate-200 font-bold mt-0.5">{selectedLog.localityTeamInformedDate || 'Not Informed'}</p>
                      <span className="text-slate-400 block mt-0.5 truncate">{selectedLog.localityTeamInformedBy}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850">
                      <span className="font-bold text-slate-400 block uppercase">CQC Informed</span>
                      <p className="text-slate-700 dark:text-slate-200 font-bold mt-0.5">{selectedLog.cqcInformedDate || 'Not Informed'}</p>
                      <span className="text-slate-400 block mt-0.5 truncate">{selectedLog.cqcInformedBy}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between border-b pb-1 border-slate-200/50">
                      <span className="text-slate-500 font-bold">User Disclosed Abuse?</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-350">{selectedLog.userDisclosure === 'Y' ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-slate-200/50 pt-1">
                      <span className="text-slate-500 font-bold">Consent Acquired?</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-350">{selectedLog.consentGained === 'Y' ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-slate-200/50 pt-1">
                      <span className="text-slate-500 font-bold">Staff Suspensions?</span>
                      <span className="font-extrabold text-rose-600">{selectedLog.staffSuspended}</span>
                    </div>
                    {selectedLog.lessonsLearnt === 'Y' && (
                      <div className="pt-2">
                        <span className="text-slate-500 font-bold block">Lessons Learnt & Plan:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5 italic">{selectedLog.lessonsLearntDetails}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Communication interactions */}
                <div className="border-t pt-3 border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-500" /> Interaction & Notification Logs
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {(selectedLog.communications || []).map((comm, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-[10px]">
                        <div className="flex justify-between text-slate-400 font-bold mb-1">
                          <span>{comm.date}</span>
                          <span>Signed: {comm.signature}</span>
                        </div>
                        <p className="text-slate-605 dark:text-slate-300">"{comm.details}"</p>
                      </div>
                    ))}
                    {(!selectedLog.communications || selectedLog.communications.length === 0) && (
                      <p className="text-slate-450 italic text-center py-2">No contact records updated yet.</p>
                    )}
                  </div>

                  {/* Add Communication log form */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <input
                      type="text"
                      placeholder="Your Signature Name"
                      value={commSignature}
                      onChange={(e) => setCommSignature(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 font-semibold dark:bg-slate-850 dark:border-slate-800"
                    />
                    <textarea
                      placeholder="Details of telephone / email communication with social worker, CQC, or family..."
                      value={commDetails}
                      onChange={(e) => setCommDetails(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-semibold dark:bg-slate-850 dark:border-slate-800 h-16"
                    />
                    <button
                      onClick={() => initiateCommSubmit(selectedLog.id)}
                      disabled={!commDetails}
                      className="w-full h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1 shadow disabled:opacity-50"
                    >
                      <PenTool className="w-3.5 h-3.5" /> PIN Authorize & Save Record
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-12">Select an allegation file to view the regulatory reporting audit trails and notifications list.</p>
            )}
          </div>
        </div>
      ) : (
        /* Wizard/Form View */
        <form onSubmit={initiateSubmit} className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs font-semibold">
          <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-500" /> Log Safeguarding Incident Details
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1"> contempo-reporting is critical. Fill out all sections. All fields require PIN counter-signature.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-550 block">Safeguarding Allegations Received From</label>
              <input
                type="text"
                required
                placeholder="e.g. Carer Amira Patel"
                value={allegationReceivedFrom}
                onChange={(e) => setAllegationReceivedFrom(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">Date Allegation Received</label>
              <input
                type="date"
                required
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">Service User Affected (Full Name)</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={residentsAffected}
                onChange={(e) => setResidentsAffected(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1 border-t pt-4 border-slate-100 dark:border-slate-800">
            <label className="text-slate-550 block">Where can the full description / incident report be found? (e.g. Incident file, email)</label>
            <input
              type="text"
              placeholder="e.g. Incident report ref INC-2026-038"
              value={descriptionLocation}
              onChange={(e) => setDescriptionLocation(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Date Locality Safeguarding Team Informed</label>
              <input
                type="date"
                value={localityTeamInformedDate}
                onChange={(e) => setLocalityTeamInformedDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">Method & Person Sharing with Locality Team</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins via Online Portal"
                value={localityTeamInformedBy}
                onChange={(e) => setLocalityTeamInformedBy(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Date Police Informed (if applicable, or NA)</label>
              <input
                type="text"
                value={policeInformedDate}
                onChange={(e) => setPoliceInformedDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">Method & Person Sharing with Police</label>
              <input
                type="text"
                value={policeInformedBy}
                onChange={(e) => setPoliceInformedBy(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Service User Disclosure section */}
          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Service User Disclosure Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-550 block">Did the Service User disclose abuse to staff?</label>
                <select
                  value={userDisclosure}
                  onChange={(e) => setUserDisclosure(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold dark:bg-slate-850 dark:border-slate-800"
                >
                  <option value="N">NO</option>
                  <option value="Y">YES</option>
                </select>
              </div>
              {userDisclosure === 'Y' && (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-550 block">Date of Disclosure</label>
                    <input
                      type="date"
                      value={disclosureDate}
                      onChange={(e) => setDisclosureDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-550 block">Staff Member(s) Logged Disclosure To</label>
                    <input
                      type="text"
                      placeholder="e.g. Amira Patel"
                      value={disclosureStaff}
                      onChange={(e) => setDisclosureStaff(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-550 block">Location of Disclosure Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Email folder 'Disclosure Notes'"
                      value={disclosureNotesLocation}
                      onChange={(e) => setDisclosureNotesLocation(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1 border-t pt-4 border-slate-100 dark:border-slate-800">
            <label className="text-slate-550 block">Immediate actions taken by Safeguarding Lead/Manager with dates</label>
            <textarea
              required
              placeholder="e.g. Bruising photographed, GP and family notified, skin assessments updated..."
              value={immediateActions}
              onChange={(e) => setImmediateActions(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Consent gained to investigate safeguarding?</label>
              <select
                value={consentGained}
                onChange={(e) => setConsentGained(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold dark:bg-slate-850 dark:border-slate-800"
              >
                <option value="Y">YES</option>
                <option value="N">NO</option>
                <option value="NA">NA / Lacks Capacity</option>
              </select>
            </div>
            {consentGained === 'NA' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-550 block">Who is involved in the Best Interests Decision? (LPAs, deputies)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ann Vance (NOK), Social Worker..."
                    value={bestInterestsInvolvement}
                    onChange={(e) => setBestInterestsInvolvement(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-550 block">Location of Decision Meeting Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Resident personal file Section 6"
                    value={notesLocation}
                    onChange={(e) => setNotesLocation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Staff Suspended? (Names and Date, or None)</label>
              <input
                type="text"
                value={staffSuspended}
                onChange={(e) => setStaffSuspended(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            {staffSuspended !== 'None' && (
              <div className="space-y-1">
                <label className="text-slate-550 block">Location of suspension letter/record</label>
                <input
                  type="text"
                  placeholder="e.g. HR personal file"
                  value={suspensionNotesLocation}
                  onChange={(e) => setSuspensionNotesLocation(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Date CQC Informed</label>
              <input
                type="date"
                required
                value={cqcInformedDate}
                onChange={(e) => setCqcInformedDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">CQC Notification Informed By</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins via CQC Portal"
                value={cqcInformedBy}
                onChange={(e) => setCqcInformedBy(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-550 block">CQC Record Location</label>
              <input
                type="text"
                required
                placeholder="e.g. CQC notifications folder"
                value={cqcRecordLocation}
                onChange={(e) => setCqcRecordLocation(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-550 block">Are there any lessons to be learnt from this safeguarding?</label>
              <select
                value={lessonsLearnt}
                onChange={(e) => setLessonsLearnt(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold dark:bg-slate-850 dark:border-slate-800"
              >
                <option value="Y">YES</option>
                <option value="N">NO</option>
                <option value="NA">NA</option>
              </select>
            </div>
            {lessonsLearnt === 'Y' && (
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-slate-550 block">Describe lessons & sharing details (with dates)</label>
                <textarea
                  required
                  placeholder="Lessons and staff meeting date details..."
                  value={lessonsLearntDetails}
                  onChange={(e) => setLessonsLearntDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
                />
              </div>
            )}
          </div>

          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-550 block">Name of Registered Manager / Lead Completing Form</label>
              <input
                type="text"
                required
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-95 transition-all"
              >
                <PenTool className="w-4 h-4" /> Save & PIN Authorize Register
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Manager PIN counter-signature modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-80 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <Lock className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Manager Counter-Signature Required</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              Safeguarding reports require authorized counter-signature. Please enter your PIN to lock this entry in compliance logs.
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                required
                maxLength={4}
                placeholder="Enter PIN (demo: 1234)"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value)}
                className="h-10 w-full text-center text-lg font-black tracking-widest rounded-xl border border-slate-200 bg-slate-50 px-3 focus:ring-2 focus:ring-rose-550 dark:bg-slate-850 dark:border-slate-800 dark:text-white"
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
                  className="flex-1 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
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

export default SafeguardingActionRecords;
