import React, { useState, useRef } from 'react';
import {
  AlertTriangle, Plus, ChevronLeft, Search, Filter, Download,
  FileText, Clock, User, MapPin, CheckCircle, XCircle, Eye,
  Bell, TrendingUp, Shield, Activity, BarChart2, ChevronDown,
  ChevronUp, Printer, Send, Check, X, AlertOctagon, Users,
  Calendar, Clipboard, Zap, ArrowRight, Info
} from 'lucide-react';

// ─── SEED DATA ────────────────────────────────────────────────────
const INCIDENT_TYPES = [
  'Fall / Trip',
  'Medication Error',
  'Skin Integrity (Pressure Sore)',
  'Challenging Behaviour',
  'Safeguarding Concern',
  'Choking / Aspiration',
  'Missing / Absent Without Leave',
  'Property Damage',
  'Infection / Outbreak',
  'Fire / Evacuation',
  'Staff Injury',
  'Visitor Complaint',
  'Equipment Failure',
  'Other'
];

const BODY_LOCATIONS = [
  'Head', 'Face', 'Neck', 'Left Shoulder', 'Right Shoulder',
  'Left Arm', 'Right Arm', 'Left Hand', 'Right Hand',
  'Chest / Torso', 'Back', 'Left Hip', 'Right Hip',
  'Left Leg', 'Right Leg', 'Left Knee', 'Right Knee',
  'Left Ankle', 'Right Ankle', 'Left Foot', 'Right Foot',
  'Not Applicable'
];

const RESIDENTS = [
  'Margaret Smith', 'Arthur Pendelton', 'Margaret Atwood',
  'John Miller', 'Eleanor Vance', 'Mary Green', 'Peter Collins'
];

const STAFF_LIST = [
  'Sarah Jenkins', 'James Carter', 'Amira Patel',
  'David Lee', 'Emma Thomson', 'Mohammed Rashid'
];

const SEED_INCIDENTS = [
  {
    id: 'INC-2026-041',
    date: '2026-06-08',
    time: '14:30',
    type: 'Fall / Trip',
    severity: 'Moderate',
    resident: 'Arthur Pendelton',
    location: 'Corridor – Ground Floor',
    bodyLocation: 'Left Hip',
    description: 'Resident found on floor in corridor near dining room. States he slipped on wet floor. No visible fractures observed. Staff immediately attended and assessed. Dr. Hancock notified.',
    reportedBy: 'Sarah Jenkins',
    witnesses: ['James Carter'],
    status: 'Under Review',
    cqcNotified: false,
    familyNotified: true,
    gpNotified: true,
    laNotified: false,
    actionPlan: 'Wet floor sign deployed. Physiotherapy referral raised. Bed rails assessment scheduled for Monday.',
    actionComplete: false,
    createdAt: '2026-06-08 14:45'
  },
  {
    id: 'INC-2026-040',
    date: '2026-06-05',
    time: '09:10',
    type: 'Medication Error',
    severity: 'High',
    resident: 'Mary Green',
    location: 'Room 301',
    bodyLocation: 'Not Applicable',
    description: 'Resident received double dose of Amlodipine 5mg during morning medication round. Error identified by team leader during MAR review. Resident BP monitored hourly. GP immediately notified.',
    reportedBy: 'James Carter',
    witnesses: ['Amira Patel'],
    status: 'Closed',
    cqcNotified: true,
    familyNotified: true,
    gpNotified: true,
    laNotified: false,
    actionPlan: 'MAR double-check protocol introduced. Medication training refresher completed by all staff within 48 hours.',
    actionComplete: true,
    createdAt: '2026-06-05 09:30'
  },
  {
    id: 'INC-2026-039',
    date: '2026-06-01',
    time: '21:00',
    type: 'Challenging Behaviour',
    severity: 'Low',
    resident: 'John Miller',
    location: 'Lounge – Ground Floor',
    bodyLocation: 'Not Applicable',
    description: 'Resident became verbally aggressive towards another resident during evening TV time. De-escalation techniques applied by night staff. No physical contact occurred.',
    reportedBy: 'David Lee',
    witnesses: [],
    status: 'Action Required',
    cqcNotified: false,
    familyNotified: true,
    gpNotified: false,
    laNotified: false,
    actionPlan: 'Behaviour support plan to be reviewed by key worker. Referral to mental health team submitted.',
    actionComplete: false,
    createdAt: '2026-06-01 21:15'
  },
  {
    id: 'INC-2026-038',
    date: '2026-05-28',
    time: '11:40',
    type: 'Safeguarding Concern',
    severity: 'Critical',
    resident: 'Eleanor Vance',
    location: 'Room 202',
    bodyLocation: 'Back',
    description: 'New unexplained bruising noted on resident\'s lower back during personal care. No known cause identified. Skin integrity record updated. Safeguarding referral raised with Local Authority.',
    reportedBy: 'Amira Patel',
    witnesses: ['Emma Thomson'],
    status: 'Escalated',
    cqcNotified: true,
    familyNotified: true,
    gpNotified: true,
    laNotified: true,
    actionPlan: 'Safeguarding strategy meeting scheduled. Enhanced supervision protocol in place. All staff reminded of safeguarding duty.',
    actionComplete: false,
    createdAt: '2026-05-28 12:00'
  },
  {
    id: 'INC-2026-037',
    date: '2026-05-20',
    time: '16:15',
    type: 'Skin Integrity (Pressure Sore)',
    severity: 'Moderate',
    resident: 'Margaret Smith',
    location: 'Room 101',
    bodyLocation: 'Left Hip',
    description: 'Grade 2 pressure ulcer identified on left hip during routine skin check. Waterlow score updated to 18 (Very High Risk). Treatment plan commenced.',
    reportedBy: 'Sarah Jenkins',
    witnesses: [],
    status: 'Closed',
    cqcNotified: false,
    familyNotified: true,
    gpNotified: true,
    laNotified: false,
    actionPlan: 'Repositioning chart updated to 2-hourly turns. Specialist wound care nurse referred.',
    actionComplete: true,
    createdAt: '2026-05-20 16:30'
  }
];

// ─── UTILITY ─────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  Low: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dot: 'bg-blue-500' },
  Moderate: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', dot: 'bg-amber-500' },
  High: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', dot: 'bg-orange-500' },
  Critical: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-500' },
};

const STATUS_CONFIG = {
  'Open': { color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', dot: 'bg-slate-400' },
  'Under Review': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dot: 'bg-blue-500' },
  'Action Required': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', dot: 'bg-orange-500' },
  'Escalated': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-500' },
  'Closed': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', dot: 'bg-green-500' },
};

const Badge = ({ label, config }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${config.color}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
    {label}
  </span>
);

// ─── EXPORT CSV ──────────────────────────────────────────────────
const exportToCSV = (incidents) => {
  const headers = ['ID', 'Date', 'Time', 'Type', 'Severity', 'Resident', 'Location', 'Reported By', 'Status', 'CQC Notified', 'Family Notified', 'GP Notified'];
  const rows = incidents.map(inc => [
    inc.id, inc.date, inc.time, inc.type, inc.severity, inc.resident,
    inc.location, inc.reportedBy, inc.status,
    inc.cqcNotified ? 'Yes' : 'No',
    inc.familyNotified ? 'Yes' : 'No',
    inc.gpNotified ? 'Yes' : 'No'
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'incident_report.csv'; a.click();
  URL.revokeObjectURL(url);
};

// ─── DASHBOARD TAB ───────────────────────────────────────────────
const DashboardTab = ({ incidents, onNew, onView }) => {
  const total = incidents.length;
  const open = incidents.filter(i => i.status !== 'Closed').length;
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const cqcCount = incidents.filter(i => i.cqcNotified).length;

  const typeCounts = INCIDENT_TYPES.slice(0, 6).map(t => ({
    type: t, count: incidents.filter(i => i.type === t).length
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...typeCounts.map(t => t.count), 1);

  const recentOpen = incidents.filter(i => i.status !== 'Closed').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents', value: total, icon: FileText, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
          { label: 'Open / Active', value: open, icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Critical Severity', value: critical, icon: AlertOctagon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'CQC Notified', value: cqcCount, icon: Shield, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Open Incidents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Type Breakdown Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-brand-500" />
            Incident Type Breakdown
          </h3>
          <div className="space-y-3">
            {typeCounts.map(({ type, count }) => (
              <div key={type}>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span>{type}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#2e6559] to-[#3a8273] transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Open / Requires Attention
            </h3>
            <button onClick={onNew} className="flex items-center gap-1.5 bg-[#2e6559] hover:bg-[#255249] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> New Report
            </button>
          </div>
          {recentOpen.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No open incidents
            </div>
          ) : (
            <div className="space-y-3">
              {recentOpen.map(inc => (
                <div key={inc.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#2e6559] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-black text-slate-400 dark:text-slate-500">{inc.id}</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{inc.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{inc.resident} • {inc.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge label={inc.severity} config={SEVERITY_CONFIG[inc.severity]} />
                      <Badge label={inc.status} config={STATUS_CONFIG[inc.status]} />
                    </div>
                  </div>
                  <button onClick={() => onView(inc)} className="text-xs text-[#2e6559] dark:text-[#3a8273] font-bold hover:underline flex items-center gap-1">
                    View Full Report <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-500" />
          Severity Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => {
            const count = incidents.filter(i => i.severity === sev).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={sev} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-100 dark:text-slate-800" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                      stroke={cfg.dot.replace('bg-', '').includes('red') ? '#ef4444' : cfg.dot.replace('bg-', '').includes('orange') ? '#f97316' : cfg.dot.replace('bg-', '').includes('amber') ? '#f59e0b' : '#3b82f6'}
                      strokeDasharray={`${pct} ${100 - pct}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-slate-800 dark:text-white">{count}</span>
                  </div>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${cfg.color}`}>{sev}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── NEW INCIDENT FORM ────────────────────────────────────────────
const NewIncidentForm = ({ onSave, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: today,
    time: '',
    type: '',
    severity: 'Low',
    resident: '',
    location: '',
    bodyLocation: 'Not Applicable',
    description: '',
    reportedBy: '',
    witnesses: [],
    cqcNotified: false,
    familyNotified: false,
    gpNotified: false,
    laNotified: false,
    actionPlan: ''
  });
  const [witnessInput, setWitnessInput] = useState('');
  const [errors, setErrors] = useState({});

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const addWitness = () => {
    if (witnessInput.trim() && !form.witnesses.includes(witnessInput.trim())) {
      set('witnesses', [...form.witnesses, witnessInput.trim()]);
      setWitnessInput('');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.type) e.type = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    if (!form.resident.trim()) e.resident = 'Required';
    if (!form.location.trim()) e.location = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.reportedBy.trim()) e.reportedBy = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const id = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    onSave({
      ...form,
      id,
      status: 'Open',
      actionComplete: false,
      createdAt: new Date().toLocaleString('en-GB')
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2e6559]";
  const errClass = "text-xs text-red-500 mt-1 font-semibold";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      <button onClick={onCancel} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Incidents
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Incident / Accident Report</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">CQC-compliant incident documentation</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">1. Incident Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Incident Type *</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                  <option value="">Select type…</option>
                  {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className={errClass}>{errors.type}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Severity *</label>
                <select value={form.severity} onChange={e => set('severity', e.target.value)} className={inputClass}>
                  {Object.keys(SEVERITY_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Date *</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputClass} />
                {errors.date && <p className={errClass}>{errors.date}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Time *</label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={inputClass} />
                {errors.time && <p className={errClass}>{errors.time}</p>}
              </div>
            </div>
          </section>

          {/* Resident & Location */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">2. Resident & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Resident Name *</label>
                <select value={form.resident} onChange={e => set('resident', e.target.value)} className={inputClass}>
                  <option value="">Select resident…</option>
                  {RESIDENTS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.resident && <p className={errClass}>{errors.resident}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Location in Home *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="e.g., Corridor – Ground Floor"
                  className={inputClass}
                />
                {errors.location && <p className={errClass}>{errors.location}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Body Location / Injury Site</label>
                <select value={form.bodyLocation} onChange={e => set('bodyLocation', e.target.value)} className={inputClass}>
                  {BODY_LOCATIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">3. Description & Account</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Incident Description *</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Provide a detailed factual account of what happened, when, how, and immediate actions taken…"
                className={inputClass + ' resize-none'}
              />
              {errors.description && <p className={errClass}>{errors.description}</p>}
            </div>
          </section>

          {/* Reporting Staff & Witnesses */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">4. Reporting Staff & Witnesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Reported By *</label>
                <select value={form.reportedBy} onChange={e => set('reportedBy', e.target.value)} className={inputClass}>
                  <option value="">Select staff member…</option>
                  {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.reportedBy && <p className={errClass}>{errors.reportedBy}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Add Witness</label>
                <div className="flex gap-2">
                  <select
                    value={witnessInput}
                    onChange={e => setWitnessInput(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select witness…</option>
                    {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={addWitness}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {form.witnesses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.witnesses.map(w => (
                  <span key={w} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                    <User className="w-3 h-3" />{w}
                    <button onClick={() => set('witnesses', form.witnesses.filter(x => x !== w))} className="text-slate-400 hover:text-red-500 ml-1 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Notifications */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">5. Notifications Sent</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'cqcNotified', label: 'CQC', icon: Shield, note: 'Required for Critical/Safeguarding' },
                { key: 'familyNotified', label: 'Family / NOK', icon: Users, note: 'Next of kin informed' },
                { key: 'gpNotified', label: 'GP / Doctor', icon: Activity, note: 'Medical review required' },
                { key: 'laNotified', label: 'Local Authority', icon: Clipboard, note: 'Safeguarding referral' },
              ].map(({ key, label, icon: Icon, note }) => (
                <label
                  key={key}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form[key]
                      ? 'border-[#2e6559] bg-[#2e6559]/5 dark:bg-[#2e6559]/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form[key]}
                    onChange={e => set(key, e.target.checked)}
                  />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    form[key] ? 'bg-[#2e6559] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">{label}</span>
                  {form[key] && <Check className="w-4 h-4 text-[#2e6559]" />}
                </label>
              ))}
            </div>
            {form.severity === 'Critical' && !form.cqcNotified && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <Info className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300 font-semibold">CQC notification is strongly recommended for Critical severity incidents</p>
              </div>
            )}
          </section>

          {/* Action Plan */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">6. Immediate Action Plan</h3>
            <textarea
              rows={3}
              value={form.actionPlan}
              onChange={e => set('actionPlan', e.target.value)}
              placeholder="Describe immediate actions taken and any follow-up tasks assigned…"
              className={inputClass + ' resize-none'}
            />
          </section>
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onCancel} className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Submit Incident Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── INCIDENT DETAIL VIEW ─────────────────────────────────────────
const IncidentDetailView = ({ incident, onBack, onUpdateStatus, onToggleAction }) => {
  const [showPrint, setShowPrint] = useState(false);
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const win = window.open('', '', 'width=800,height=900');
    win.document.write(`
      <html><head><title>Incident Report – ${incident.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a1a; }
        h1 { font-size: 20px; border-bottom: 2px solid #2e6559; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td, th { border: 1px solid #ddd; padding: 8px 12px; font-size: 13px; }
        th { background: #f5f5f5; font-weight: bold; text-align: left; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
        .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666; margin: 20px 0 8px; }
        .box { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; }
      </style></head><body>
      <h1>Incident / Accident Report</h1>
      <p style="color:#666; font-size:12px;">Confidential – CQC Compliant Documentation</p>
      ${printContent}
      </body></html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  const STATUSES = ['Open', 'Under Review', 'Action Required', 'Escalated', 'Closed'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Incidents
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Printer className="w-4 h-4" /> Print / Export
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500">{incident.id}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{incident.date} at {incident.time}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{incident.type}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{incident.resident} • {incident.location}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge label={incident.severity} config={SEVERITY_CONFIG[incident.severity]} />
              <Badge label={incident.status} config={STATUS_CONFIG[incident.status]} />
            </div>
          </div>
        </div>

        {/* Print content ref */}
        <div ref={printRef} className="p-6 space-y-6">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Resident', value: incident.resident, icon: User },
              { label: 'Location', value: incident.location, icon: MapPin },
              { label: 'Body Location', value: incident.bodyLocation, icon: Activity },
              { label: 'Reported By', value: incident.reportedBy, icon: Users },
              { label: 'Date & Time', value: `${incident.date} ${incident.time}`, icon: Clock },
              { label: 'Logged At', value: incident.createdAt, icon: FileText },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Incident Description</p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-[#2e6559]">
              {incident.description}
            </div>
          </div>

          {/* Witnesses */}
          {incident.witnesses.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Witnesses</p>
              <div className="flex flex-wrap gap-2">
                {incident.witnesses.map(w => (
                  <span key={w} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">
                    <User className="w-3 h-3" />{w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Notifications</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'CQC Notified', value: incident.cqcNotified },
                { label: 'Family / NOK', value: incident.familyNotified },
                { label: 'GP / Doctor', value: incident.gpNotified },
                { label: 'Local Authority', value: incident.laNotified },
              ].map(n => (
                <div key={n.label} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                  n.value ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}>
                  {n.value ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {n.label}
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          {incident.actionPlan && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Action Plan</p>
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
                incident.actionComplete
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                {incident.actionPlan}
              </div>
            </div>
          )}
        </div>

        {/* Actions Panel */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(incident.id, s)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                    incident.status === s
                      ? 'bg-[#2e6559] border-[#2e6559] text-white'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Action Plan Completion</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{incident.actionComplete ? 'All actions completed and signed off' : 'Actions outstanding'}</p>
            </div>
            <button
              onClick={() => onToggleAction(incident.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                incident.actionComplete
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200'
              }`}
            >
              {incident.actionComplete ? <><Check className="w-3.5 h-3.5" /> Completed</> : <><Zap className="w-3.5 h-3.5" /> Mark Complete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INCIDENT LIST TAB ────────────────────────────────────────────
const IncidentListTab = ({ incidents, onView, onNew }) => {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = incidents.filter(inc => {
    const matchSearch = search === '' ||
      inc.resident.toLowerCase().includes(search.toLowerCase()) ||
      inc.type.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    const matchStatus = filterStatus === 'All' || inc.status === filterStatus;
    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by resident, type or ID…"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2e6559]"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2e6559]"
        >
          <option value="All">All Severities</option>
          {Object.keys(SEVERITY_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2e6559]"
        >
          <option value="All">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => exportToCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                {['ID', 'Date', 'Type', 'Severity', 'Resident', 'Reported By', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No incidents found</td>
                </tr>
              ) : (
                filtered.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-black text-slate-400">{inc.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{inc.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{inc.type}</td>
                    <td className="px-4 py-3"><Badge label={inc.severity} config={SEVERITY_CONFIG[inc.severity]} /></td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{inc.resident}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{inc.reportedBy}</td>
                    <td className="px-4 py-3"><Badge label={inc.status} config={STATUS_CONFIG[inc.status]} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onView(inc)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#2e6559] dark:text-[#3a8273] hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-right">Showing {filtered.length} of {incidents.length} records</p>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────
const IncidentReporting = ({ userRole = 'Admin' }) => {
  const [incidents, setIncidents] = useState(SEED_INCIDENTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subView, setSubView] = useState('main'); // 'main' | 'new' | 'detail'
  const [selectedIncident, setSelectedIncident] = useState(null);

  const isManager = ['Admin', 'Manager', 'Compliance Officer'].includes(userRole);

  const handleNewSave = (newInc) => {
    setIncidents(prev => [newInc, ...prev]);
    setSubView('main');
    setActiveTab('history');
  };

  const handleViewIncident = (inc) => {
    setSelectedIncident(inc);
    setSubView('detail');
  };

  const handleUpdateStatus = (id, status) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setSelectedIncident(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const handleToggleAction = (id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, actionComplete: !i.actionComplete } : i));
    setSelectedIncident(prev => prev?.id === id ? { ...prev, actionComplete: !prev.actionComplete } : prev);
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'history', label: 'All Incidents', icon: FileText },
  ];

  // Sub-views
  if (subView === 'new') {
    return (
      <div className="animate-fade-in">
        <NewIncidentForm
          onSave={handleNewSave}
          onCancel={() => setSubView('main')}
        />
      </div>
    );
  }

  if (subView === 'detail' && selectedIncident) {
    return (
      <div className="animate-fade-in">
        <IncidentDetailView
          incident={selectedIncident}
          onBack={() => { setSubView('main'); setSelectedIncident(null); }}
          onUpdateStatus={handleUpdateStatus}
          onToggleAction={handleToggleAction}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incident & Accident Reporting</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">CQC-compliant incident documentation, tracking & regulatory notifications</p>
            </div>
          </div>
          <button
            onClick={() => setSubView('new')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Report Incident
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#2e6559] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          incidents={incidents}
          onNew={() => setSubView('new')}
          onView={handleViewIncident}
        />
      )}
      {activeTab === 'history' && (
        <IncidentListTab
          incidents={incidents}
          onView={handleViewIncident}
          onNew={() => setSubView('new')}
        />
      )}
    </div>
  );
};

export default IncidentReporting;
