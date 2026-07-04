import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Briefcase, 
  Clock, 
  Mail, 
  Send, 
  Check, 
  Plus, 
  X, 
  AlertTriangle,
  FileCheck2,
  Lock
} from 'lucide-react';

const ExternalServices = () => {
  const [activeSubTab, setActiveSubTab] = useState('scheduler'); // 'scheduler' or 'consent'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scheduler State
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('external_appointments');
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", resident: "Eleanor Vance", service: "Dentist", professional: "Dr. Aris Carter", date: "2026-06-20", time: "10:30 AM", purpose: "Routine 6-month inspection", status: "Scheduled", consent: "Consent Granted" },
      { id: "2", resident: "Arthur Pendelton", service: "Chiropodist", professional: "Sarah Miller (Podiatrist)", date: "2026-06-21", time: "02:00 PM", purpose: "Diabetic foot monitoring", status: "Scheduled", consent: "Pending Consent" },
      { id: "3", resident: "Mary Green", service: "Optician", professional: "Dr. James Vance", date: "2026-06-22", time: "11:00 AM", purpose: "Reading glasses review", status: "Completed", consent: "Consent Granted" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('external_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Consent Ledger State
  const [consentForms, setConsentForms] = useState(() => {
    const saved = localStorage.getItem('family_consents');
    if (saved) return JSON.parse(saved);
    return [
      { id: "C-1", resident: "Eleanor Vance", contactName: "David Vance (Son)", contactEmail: "david.vance@mail.com", service: "Dentist visit on 2026-06-20", status: "Consent Granted", sentDate: "2026-06-12", signedDate: "2026-06-13" },
      { id: "C-2", resident: "Arthur Pendelton", contactName: "Jane Pendelton (Daughter)", contactEmail: "jane.p@mail.com", service: "Chiropodist visit on 2026-06-21", status: "Pending Consent", sentDate: "2026-06-14", signedDate: "" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('family_consents', JSON.stringify(consentForms));
  }, [consentForms]);

  const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
  const [schedFormData, setSchedFormData] = useState({
    resident: '',
    service: 'GP',
    professional: '',
    date: '',
    time: '',
    purpose: '',
    status: 'Scheduled',
    consent: 'Pending Consent'
  });

  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentFormData, setConsentFormData] = useState({
    resident: '',
    contactName: '',
    contactEmail: '',
    service: 'Dentist visit on 2026-06-20'
  });

  const [previewEmail, setPreviewEmail] = useState(null);

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const newApp = {
      id: `APP-${Date.now()}`,
      ...schedFormData
    };
    setAppointments(prev => [newApp, ...prev]);
    setIsSchedModalOpen(false);
    setSchedFormData({
      resident: '',
      service: 'GP',
      professional: '',
      date: '',
      time: '',
      purpose: '',
      status: 'Scheduled',
      consent: 'Pending Consent'
    });
  };

  const handleCreateConsent = (e) => {
    e.preventDefault();
    const newConsent = {
      id: `CONS-${Date.now()}`,
      resident: consentFormData.resident,
      contactName: consentFormData.contactName,
      contactEmail: consentFormData.contactEmail,
      service: consentFormData.service,
      status: "Pending Consent",
      sentDate: new Date().toISOString().split('T')[0],
      signedDate: ""
    };
    setConsentForms(prev => [newConsent, ...prev]);
    setIsConsentModalOpen(false);
    // Automatically open the email preview
    setPreviewEmail(newConsent);
  };

  const handleDispatchEmail = () => {
    if (!previewEmail) return;
    alert(`✉️ Simulated SMTP Service:\n\nConsent request successfully sent to ${previewEmail.contactEmail} regarding ${previewEmail.resident}'s ${previewEmail.service}.\nStatus set to 'Pending Consent'.`);
    setPreviewEmail(null);
  };

  const handleSimulateConsentSignature = (id) => {
    setConsentForms(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Consent Granted',
          signedDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    // Also update any matching scheduled appointment to "Consent Granted"
    const form = consentForms.find(c => c.id === id);
    if (form) {
      setAppointments(prev => prev.map(app => {
        if (app.resident === form.resident && form.service.includes(app.service)) {
          return { ...app, consent: 'Consent Granted' };
        }
        return app;
      }));
    }
    alert("👍 Success: Simulated family digital signature received. Consent status updated to 'Consent Granted'.");
  };

  const filteredAppointments = appointments.filter(a => 
    a.resident.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.professional.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-1">
      {/* Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-850 to-brand-650 p-6 text-white shadow-md">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-400" />
            External Services & Visiting Teams Scheduler
          </h1>
          <p className="mt-0.5 text-xs text-brand-100 font-medium">
            Schedule visits for dentists, GPs, chiropodists, and opticians, and dispatch digital consent requests to families.
          </p>
        </div>
        <div className="flex gap-2">
          {activeSubTab === 'scheduler' ? (
            <button 
              onClick={() => setIsSchedModalOpen(true)}
              className="h-9 rounded-xl bg-white px-3.5 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Visit</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsConsentModalOpen(true)}
              className="h-9 rounded-xl bg-white px-3.5 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Draft Consent</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex gap-2 border-b dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'scheduler'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Visiting Professionals Schedule
        </button>
        <button
          onClick={() => setActiveSubTab('consent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'consent'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Family Consent Forms Ledger
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by resident name or visiting team..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all w-full"
          />
        </div>
      </div>

      {/* Tab 1: Scheduler Grid */}
      {activeSubTab === 'scheduler' && (
        <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Resident Name</th>
                  <th className="px-6 py-4">Visiting Service</th>
                  <th className="px-6 py-4">Professional Name</th>
                  <th className="px-6 py-4">Scheduled Date & Time</th>
                  <th className="px-6 py-4">Clinical Purpose</th>
                  <th className="px-6 py-4">Family Consent Status</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-250">{app.resident}</td>
                    <td className="px-6 py-4 font-bold text-[#2e6559] dark:text-[#3a8273]">{app.service}</td>
                    <td className="px-6 py-4 font-semibold text-slate-650 dark:text-slate-400">{app.professional}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-405 shrink-0" />
                        <span>{app.date} @ {app.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 max-w-[200px] truncate" title={app.purpose}>
                      {app.purpose}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-extrabold ${
                        app.consent === 'Consent Granted' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 animate-pulse'
                      }`}>
                        {app.consent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${
                        app.status === 'Completed' 
                          ? 'bg-slate-100 text-slate-500 border-slate-250 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Consent Forms Ledger */}
      {activeSubTab === 'consent' && (
        <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Family Representative Contact</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Service Details</th>
                  <th className="px-6 py-4">Date Dispatched</th>
                  <th className="px-6 py-4">Signature Date</th>
                  <th className="px-6 py-4">Consent Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {consentForms.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-250">{c.resident}</td>
                    <td className="px-6 py-4 font-semibold text-slate-655 dark:text-slate-400">{c.contactName}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">{c.contactEmail}</td>
                    <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-350">{c.service}</td>
                    <td className="px-6 py-4 text-slate-505 dark:text-slate-500 font-semibold">{c.sentDate}</td>
                    <td className="px-6 py-4 text-slate-505 dark:text-slate-500 font-semibold">
                      {c.signedDate || '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${
                        c.status === 'Consent Granted' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 animate-pulse'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === 'Pending Consent' ? (
                        <button
                          onClick={() => handleSimulateConsentSignature(c.id)}
                          className="px-2.5 py-1 bg-[#2e6559] hover:bg-brand-550 text-white font-bold text-[9px] rounded-lg transition-all"
                        >
                          Simulate Signature
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 text-[10px]">
                          <Check className="w-3.5 h-3.5" />
                          Signed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Scheduler Dialog */}
      {isSchedModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-fade-in my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Schedule Visiting Team</h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Log upcoming visiting team consultations.</p>
              </div>
              <button 
                onClick={() => setIsSchedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Resident Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={schedFormData.resident}
                  onChange={(e) => setSchedFormData({ ...schedFormData, resident: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Visiting Service</label>
                  <select
                    value={schedFormData.service}
                    onChange={(e) => setSchedFormData({ ...schedFormData, service: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-slate-200 font-semibold"
                  >
                    <option>Dentist</option>
                    <option>GP</option>
                    <option>Chiropodist</option>
                    <option>Optician</option>
                    <option>Physiotherapist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Professional Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Carter"
                    value={schedFormData.professional}
                    onChange={(e) => setSchedFormData({ ...schedFormData, professional: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Scheduled Date</label>
                  <input 
                    type="date" 
                    required
                    value={schedFormData.date}
                    onChange={(e) => setSchedFormData({ ...schedFormData, date: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Time Slot</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 10:30 AM"
                    value={schedFormData.time}
                    onChange={(e) => setSchedFormData({ ...schedFormData, time: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Clinical Purpose</label>
                <textarea 
                  rows="2"
                  placeholder="Reason for consultation..."
                  value={schedFormData.purpose}
                  onChange={(e) => setSchedFormData({ ...schedFormData, purpose: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-slate-200 resize-none font-semibold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2e6559] hover:bg-brand-550 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consent Form Drafter Modal */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-fade-in my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Draft Family Consent Form</h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Authorise external visiting services or clinical treatments.</p>
              </div>
              <button 
                onClick={() => setIsConsentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConsent} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Resident Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Arthur Pendelton"
                  value={consentFormData.resident}
                  onChange={(e) => setConsentFormData({ ...consentFormData, resident: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Family Representative Contact Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. David Vance"
                  value={consentFormData.contactName}
                  onChange={(e) => setConsentFormData({ ...consentFormData, contactName: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Family Representative Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. family@mail.com"
                  value={consentFormData.contactEmail}
                  onChange={(e) => setConsentFormData({ ...consentFormData, contactEmail: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Associated Visiting Team Service</label>
                <select
                  value={consentFormData.service}
                  onChange={(e) => setConsentFormData({ ...consentFormData, service: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-850 dark:text-slate-200 font-semibold"
                >
                  <option>Dentist visit on 2026-06-20</option>
                  <option>Chiropodist visit on 2026-06-21</option>
                  <option>Optician visit on 2026-06-22</option>
                  <option>GP consultation on 2026-06-25</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2e6559] hover:bg-brand-550 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  Save and Preview Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Email Draft Preview Dialog */}
      {previewEmail && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
            <div className="bg-[#2e6559] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider">Simulated SMTP Email Outbox</span>
              </div>
              <button 
                onClick={() => setPreviewEmail(null)}
                className="text-white/80 hover:text-white bg-white/10 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 border-b bg-white dark:bg-slate-950 text-[11px] space-y-1.5">
              <div><span className="font-bold text-slate-400">To:</span> <span className="font-bold text-[#2e6559]">{previewEmail.contactEmail}</span></div>
              <div><span className="font-bold text-slate-400">Subject:</span> <span className="font-bold text-slate-700 dark:text-slate-350">Consent Request: External visiting team - AS Care Home</span></div>
            </div>

            <div className="p-5 text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 max-h-56 overflow-y-auto custom-scrollbar">
              <p>Dear {previewEmail.contactName},</p>
              <br />
              <p>We are scheduling a routine professional <strong>{previewEmail.service}</strong> visit for <strong>{previewEmail.resident}</strong> at AS Care Home.</p>
              <p>To comply with care inspection and safety policies, we require family signature consent before the visit date.</p>
              <br />
              <p>Please review and sign the digital authorization form linked below:</p>
              <p className="text-[#2e6559] underline cursor-pointer font-bold">https://secure.ascareservices.co.uk/consent/auth_token_901385</p>
              <br />
              <p>Kind Regards,</p>
              <p>Sarah Jenkins</p>
              <p>General Manager, AS Care Home</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-955 border-t dark:border-slate-850 flex gap-2 justify-end">
              <button 
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-305 text-slate-650 font-bold rounded-xl text-[10px]"
              >
                Discard
              </button>
              <button 
                onClick={handleDispatchEmail}
                className="px-5 py-2 bg-[#2e6559] hover:bg-brand-550 text-white font-bold rounded-xl text-[10px] flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Consent Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalServices;
