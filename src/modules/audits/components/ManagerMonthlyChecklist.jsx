import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ClipboardList, Plus, Check, Calendar, User, Lock, PenTool } from 'lucide-react';

const ManagerMonthlyChecklist = () => {
  const { managerChecklists, addManagerChecklist } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'new'
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  // PIN modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  // Form State
  const [dateCompleted, setDateCompleted] = useState(new Date().toISOString().split('T')[0]);
  const [completedBy, setCompletedBy] = useState('Sarah Jenkins');
  
  // Supported Adults
  const [supportedAdultsCount, setSupportedAdultsCount] = useState(4);
  const [hospitalAdmissionsCount, setHospitalAdmissionsCount] = useState(0);
  const [carePlansAuditedCount, setCarePlansAuditedCount] = useState(4);
  const [significantChanges, setSignificantChanges] = useState('');
  const [weightChanges, setWeightChanges] = useState('');
  const [carePlanActionsLastMonth, setCarePlanActionsLastMonth] = useState('');
  const [carePlanActionsThisMonth, setCarePlanActionsThisMonth] = useState('');

  // Staffing
  const [staffCount, setStaffCount] = useState(8);
  const [startersCount, setStartersCount] = useState(0);
  const [inductionsCompletedCount, setInductionsCompletedCount] = useState(0);
  const [vacanciesCount, setVacanciesCount] = useState(0);
  const [staffAbsencesCount, setStaffAbsencesCount] = useState(0);
  const [supervisionsCompletedCount, setSupervisionsCompletedCount] = useState(2);
  const [observationsCompletedCount, setObservationsCompletedCount] = useState(1);
  const [medicationCompetenciesCount, setMedicationCompetenciesCount] = useState(1);
  const [movingHandlingCompetenciesCount, setMovingHandlingCompetenciesCount] = useState(1);
  const [staffMeetingDate, setStaffMeetingDate] = useState('');
  const [nextStaffMeetingDate, setNextStaffMeetingDate] = useState('');
  const [trainingsCompleted, setTrainingsCompleted] = useState('');
  const [mandatoryOver85, setMandatoryOver85] = useState('Y');
  const [trainingsPlanned, setTrainingsPlanned] = useState('');
  const [staffActionsLastMonth, setStaffActionsLastMonth] = useState('');
  const [staffActionsThisMonth, setStaffActionsThisMonth] = useState('');

  // Safeguards
  const [safeguardsNewCount, setSafeguardsNewCount] = useState(0);
  const [safeguardsOpenCount, setSafeguardsOpenCount] = useState(0);
  const [safeguardsActionsLastMonth, setSafeguardsActionsLastMonth] = useState('');
  const [safeguardsActionsThisMonth, setSafeguardsActionsThisMonth] = useState('');

  // Incidents
  const [incidentsCount, setIncidentsCount] = useState(0);
  const [accidentsCount, setAccidentsCount] = useState(0);
  const [incidentActionsLastMonth, setIncidentActionsLastMonth] = useState('');
  const [incidentActionsThisMonth, setIncidentActionsThisMonth] = useState('');

  // Missed Visits
  const [missedVisitsCount, setMissedVisitsCount] = useState(0);
  const [lateVisitsCount, setLateVisitsCount] = useState(0);
  const [shortVisitsCount, setShortVisitsCount] = useState(0);
  const [visitActionsLastMonth, setVisitActionsLastMonth] = useState('');
  const [visitActionsThisMonth, setVisitActionsThisMonth] = useState('');

  // CQC, compliments, complaints
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [complimentsCount, setComplimentsCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [complimentsDetails, setComplimentsDetails] = useState('');
  const [complaintsDetails, setComplaintsDetails] = useState('');
  const [monthHighlight, setMonthHighlight] = useState('');
  const [auditsCompleted, setAuditsCompleted] = useState('');
  const [otherActions, setOtherActions] = useState('');

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

    const newChecklist = {
      id: `MCL-${Date.now()}`,
      dateCompleted,
      completedBy,
      supportedAdultsCount: parseInt(supportedAdultsCount),
      hospitalAdmissionsCount: parseInt(hospitalAdmissionsCount),
      carePlansAuditedCount: parseInt(carePlansAuditedCount),
      significantChanges,
      weightChanges,
      carePlanActionsLastMonth,
      carePlanActionsThisMonth,
      staffCount: parseInt(staffCount),
      startersCount: parseInt(startersCount),
      inductionsCompletedCount: parseInt(inductionsCompletedCount),
      vacanciesCount: parseInt(vacanciesCount),
      staffAbsencesCount: parseInt(staffAbsencesCount),
      supervisionsCompletedCount: parseInt(supervisionsCompletedCount),
      observationsCompletedCount: parseInt(observationsCompletedCount),
      medicationCompetenciesCount: parseInt(medicationCompetenciesCount),
      movingHandlingCompetenciesCount: parseInt(movingHandlingCompetenciesCount),
      staffMeetingDate,
      nextStaffMeetingDate,
      trainingsCompleted,
      mandatoryOver85,
      trainingsPlanned,
      staffActionsLastMonth,
      staffActionsThisMonth,
      safeguardsNewCount: parseInt(safeguardsNewCount),
      safeguardsOpenCount: parseInt(safeguardsOpenCount),
      safeguardsActionsLastMonth,
      safeguardsActionsThisMonth,
      incidentsCount: parseInt(incidentsCount),
      accidentsCount: parseInt(accidentsCount),
      incidentActionsLastMonth,
      incidentActionsThisMonth,
      missedVisitsCount: parseInt(missedVisitsCount),
      lateVisitsCount: parseInt(lateVisitsCount),
      shortVisitsCount: parseInt(shortVisitsCount),
      visitActionsLastMonth,
      visitActionsThisMonth,
      notificationsCount: parseInt(notificationsCount),
      complimentsCount: parseInt(complimentsCount),
      complaintsCount: parseInt(complaintsCount),
      complimentsDetails,
      complaintsDetails,
      monthHighlight,
      auditsCompleted,
      otherActions,
      managerSignature: completedBy
    };

    addManagerChecklist(newChecklist);
    setViewMode('list');
    resetForm();
  };

  const resetForm = () => {
    setDateCompleted(new Date().toISOString().split('T')[0]);
    setCompletedBy('Sarah Jenkins');
    setSupportedAdultsCount(4);
    setHospitalAdmissionsCount(0);
    setCarePlansAuditedCount(4);
    setSignificantChanges('');
    setWeightChanges('');
    setCarePlanActionsLastMonth('');
    setCarePlanActionsThisMonth('');
    setStaffCount(8);
    setStartersCount(0);
    setInductionsCompletedCount(0);
    setVacanciesCount(0);
    setStaffAbsencesCount(0);
    setSupervisionsCompletedCount(2);
    setObservationsCompletedCount(1);
    setMedicationCompetenciesCount(1);
    setMovingHandlingCompetenciesCount(1);
    setStaffMeetingDate('');
    setNextStaffMeetingDate('');
    setTrainingsCompleted('');
    setMandatoryOver85('Y');
    setTrainingsPlanned('');
    setStaffActionsLastMonth('');
    setStaffActionsThisMonth('');
    setSafeguardsNewCount(0);
    setSafeguardsOpenCount(0);
    setSafeguardsActionsLastMonth('');
    setSafeguardsActionsThisMonth('');
    setIncidentsCount(0);
    setAccidentsCount(0);
    setIncidentActionsLastMonth('');
    setIncidentActionsThisMonth('');
    setMissedVisitsCount(0);
    setLateVisitsCount(0);
    setShortVisitsCount(0);
    setVisitActionsLastMonth('');
    setVisitActionsThisMonth('');
    setNotificationsCount(0);
    setComplimentsCount(0);
    setComplaintsCount(0);
    setComplimentsDetails('');
    setComplaintsDetails('');
    setMonthHighlight('');
    setAuditsCompleted('');
    setOtherActions('');
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Manager Monthly Checklists</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Track monthly CQC operations checklists and countersigned audits.</p>
        </div>
        <div>
          {viewMode === 'list' ? (
            <button
              onClick={() => setViewMode('new')}
              className="h-9 px-4 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> New Checklist
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

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Historical Checklists</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(managerChecklists || []).map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedChecklist(item)}
                  className={`p-4 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all border ${
                    selectedChecklist?.id === item.id 
                      ? 'border-[#2e6559] bg-[#2e6559]/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-slate-805 dark:text-white text-sm">Monthly Audit Checklist</h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Completed on {item.dateCompleted} by {item.completedBy}
                      </p>
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10">
                      ✓ Countersigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {selectedChecklist ? (
              <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                  <h4 className="font-black text-slate-800 dark:text-white text-sm">Checklist Details</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Date: {selectedChecklist.dateCompleted} | Manager: {selectedChecklist.completedBy}</p>
                </div>

                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Supported Adults</span>
                    <div className="flex justify-between">
                      <span>Supported Adults:</span>
                      <span className="font-bold">{selectedChecklist.supportedAdultsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hospital Admissions:</span>
                      <span className="font-bold">{selectedChecklist.hospitalAdmissionsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Care Plans Audited:</span>
                      <span className="font-bold">{selectedChecklist.carePlansAuditedCount}</span>
                    </div>
                    <p className="text-[10px] mt-1 text-slate-500"><strong>Changes:</strong> {selectedChecklist.significantChanges || 'None'}</p>
                    <p className="text-[10px] text-slate-500"><strong>Weights:</strong> {selectedChecklist.weightChanges || 'None'}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Staffing & Supervisions</span>
                    <div className="flex justify-between">
                      <span>Total Staff:</span>
                      <span className="font-bold">{selectedChecklist.staffCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supervisions Completed:</span>
                      <span className="font-bold">{selectedChecklist.supervisionsCompletedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Observations Completed:</span>
                      <span className="font-bold">{selectedChecklist.observationsCompletedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meds Competencies:</span>
                      <span className="font-bold">{selectedChecklist.medicationCompetenciesCount}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Safeguarding & Incidents</span>
                    <div className="flex justify-between">
                      <span>New Safeguards:</span>
                      <span className="font-bold">{selectedChecklist.safeguardsNewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Incidents:</span>
                      <span className="font-bold">{selectedChecklist.incidentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Accidents:</span>
                      <span className="font-bold">{selectedChecklist.accidentsCount}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Missed & Late Visits</span>
                    <div className="flex justify-between">
                      <span>Missed Visits:</span>
                      <span className="font-bold">{selectedChecklist.missedVisitsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Visits:</span>
                      <span className="font-bold">{selectedChecklist.lateVisitsCount}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Feedback & Audits</span>
                    <div className="flex justify-between">
                      <span>Compliments:</span>
                      <span className="font-bold">{selectedChecklist.complimentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complaints:</span>
                      <span className="font-bold">{selectedChecklist.complaintsCount}</span>
                    </div>
                    <p className="text-[10px] mt-1 text-slate-500"><strong>Highlight:</strong> {selectedChecklist.monthHighlight || 'None'}</p>
                    <p className="text-[10px] text-slate-500"><strong>Audits Done:</strong> {selectedChecklist.auditsCompleted || 'None'}</p>
                  </div>
                </div>

                <div className="border-t pt-3 border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5">
                    🔒 Countersigned By: {selectedChecklist.managerSignature}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-12">Select a checklist report to review full metrics.</p>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={initiateSubmit} className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs font-semibold">
          <div className="border-b pb-4 border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">Conduct Monthly Operational Checklist</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Review operational, staffing, clinical, and safeguarding indices for regulatory compliance.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                required
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="h-8 rounded-lg border border-slate-250 bg-slate-50 px-2 font-semibold text-xs"
              />
              <input
                type="text"
                required
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                className="h-8 rounded-lg border border-slate-250 bg-slate-50 px-2 font-semibold text-xs w-36"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Section 1: Supported Adults */}
            <div className="space-y-3 border p-4 rounded-xl bg-slate-50/20 dark:bg-slate-900/40">
              <h5 className="font-extrabold text-slate-805 dark:text-white uppercase tracking-wider text-[10px] border-b pb-1.5">1. Supported Adults & Care Planning</h5>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 block">Total Adults</label>
                  <input type="number" value={supportedAdultsCount} onChange={(e) => setSupportedAdultsCount(e.target.value)} className="h-8 w-full rounded border px-2 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 block">Hospital Admits</label>
                  <input type="number" value={hospitalAdmissionsCount} onChange={(e) => setHospitalAdmissionsCount(e.target.value)} className="h-8 w-full rounded border px-2 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 block">Care Plans Audited</label>
                  <input type="number" value={carePlansAuditedCount} onChange={(e) => setCarePlansAuditedCount(e.target.value)} className="h-8 w-full rounded border px-2 font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 block">Significant Changes to Care Needs & Actions</label>
                <textarea value={significantChanges} onChange={(e) => setSignificantChanges(e.target.value)} className="w-full rounded border p-2 h-14" placeholder="Detail any changes, GP notifications, staff brief details..." />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 block">Significant Changes to Adults Weight (MUST tools)</label>
                <textarea value={weightChanges} onChange={(e) => setWeightChanges(e.target.value)} className="w-full rounded border p-2 h-14" placeholder="MUST alerts triggered, dietitian referrals completed..." />
              </div>
            </div>

            {/* Section 2: Staffing & Competencies */}
            <div className="space-y-3 border p-4 rounded-xl bg-slate-50/20 dark:bg-slate-900/40">
              <h5 className="font-extrabold text-slate-805 dark:text-white uppercase tracking-wider text-[10px] border-b pb-1.5">2. Staffing, Supervisions & Training</h5>
              <div className="grid grid-cols-5 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Total Staff</label>
                  <input type="number" value={staffCount} onChange={(e) => setStaffCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">New Starters</label>
                  <input type="number" value={startersCount} onChange={(e) => setStartersCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Inductions</label>
                  <input type="number" value={inductionsCompletedCount} onChange={(e) => setInductionsCompletedCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Vacancies</label>
                  <input type="number" value={vacanciesCount} onChange={(e) => setVacanciesCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Absences</label>
                  <input type="number" value={staffAbsencesCount} onChange={(e) => setStaffAbsencesCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Supervisions</label>
                  <input type="number" value={supervisionsCompletedCount} onChange={(e) => setSupervisionsCompletedCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Observations</label>
                  <input type="number" value={observationsCompletedCount} onChange={(e) => setObservationsCompletedCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Meds Comp</label>
                  <input type="number" value={medicationCompetenciesCount} onChange={(e) => setMedicationCompetenciesCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">M&H Comp</label>
                  <input type="number" value={movingHandlingCompetenciesCount} onChange={(e) => setMovingHandlingCompetenciesCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
              </div>
            </div>

            {/* Section 3: Safeguards & Incidents */}
            <div className="space-y-3 border p-4 rounded-xl bg-slate-50/20 dark:bg-slate-900/40">
              <h5 className="font-extrabold text-slate-805 dark:text-white uppercase tracking-wider text-[10px] border-b pb-1.5">3. Safeguards, Incidents & Accidents</h5>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">New Safeguards</label>
                  <input type="number" value={safeguardsNewCount} onChange={(e) => setSafeguardsNewCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Open Safeguards</label>
                  <input type="number" value={safeguardsOpenCount} onChange={(e) => setSafeguardsOpenCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Incidents Count</label>
                  <input type="number" value={incidentsCount} onChange={(e) => setIncidentsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Accidents Count</label>
                  <input type="number" value={accidentsCount} onChange={(e) => setAccidentsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 block">Actions identified following Incidents/Accidents (Trends?)</label>
                <textarea value={incidentActionsThisMonth} onChange={(e) => setIncidentActionsThisMonth(e.target.value)} className="w-full rounded border p-2 h-14" placeholder="Details of trends, sensor mats, lighting, furniture layout adjustments..." />
              </div>
            </div>

            {/* Section 4: Missed/Late Visits & CQC Notifications */}
            <div className="space-y-3 border p-4 rounded-xl bg-slate-50/20 dark:bg-slate-900/40">
              <h5 className="font-extrabold text-slate-805 dark:text-white uppercase tracking-wider text-[10px] border-b pb-1.5">4. Missed/Late Visits & Compliments</h5>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Missed Visits</label>
                  <input type="number" value={missedVisitsCount} onChange={(e) => setMissedVisitsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Late Visits</label>
                  <input type="number" value={lateVisitsCount} onChange={(e) => setLateVisitsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">Short Visits</label>
                  <input type="number" value={shortVisitsCount} onChange={(e) => setShortVisitsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block leading-tight">CQC Notifs</label>
                  <input type="number" value={notificationsCount} onChange={(e) => setNotificationsCount(e.target.value)} className="h-8 w-full rounded border px-1.5 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 block">Compliments Received</label>
                  <input type="number" value={complimentsCount} onChange={(e) => setComplimentsCount(e.target.value)} className="h-8 w-full rounded border px-2 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 block">Complaints Received</label>
                  <input type="number" value={complaintsCount} onChange={(e) => setComplaintsCount(e.target.value)} className="h-8 w-full rounded border px-2 font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 block">Month Highlight (Good news stories, relatives feedback)</label>
                <textarea value={monthHighlight} onChange={(e) => setMonthHighlight(e.target.value)} className="w-full rounded border p-2 h-14" placeholder="What was the home most proud of this month?" />
              </div>
            </div>

          </div>

          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <PenTool className="w-4 h-4" /> Sign-off & Lock Checklist
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
              Submit monthly operational index report to compliance database. Enter authorized manager PIN to lock checklist.
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
                  Confirm Lock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerMonthlyChecklist;
