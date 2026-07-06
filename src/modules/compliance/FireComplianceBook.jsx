import React, { useState } from 'react';
import { Flame, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Trash2, Calendar, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FireComplianceBook = () => {
  const { employees, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('alarm'); // 'alarm' | 'lighting' | 'drills' | 'extinguishers'
  const [showAddModal, setShowAddModal] = useState(false);
  const [customLogs, setCustomLogs] = useState(() => {
    const saved = localStorage.getItem('care_fire_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'alarm', checkName: 'Weekly Alarm Test (Zone 1)', lastCompleted: '2026-07-01', completedBy: 'John (Manager)', status: 'Compliant' },
      { id: '2', type: 'lighting', checkName: 'Monthly Emergency Lights (Zone 2)', lastCompleted: '2026-07-02', completedBy: 'John (Manager)', status: 'Compliant' },
      { id: '3', type: 'drills', checkName: 'Quarterly Fire Drill Simulation', lastCompleted: '2026-06-15', completedBy: 'Sarah (Lead Nurse)', status: 'Compliant' },
      { id: '4', type: 'extinguishers', checkName: 'Annual Extinguisher Pressure Inspection', lastCompleted: '2026-05-10', completedBy: 'John (Manager)', status: 'Compliant' }
    ];
  });

  const [formData, setFormData] = useState({
    checkName: '',
    type: 'alarm',
    completedBy: employees[0]?.name || ''
  });

  const saveLogs = (newLogs) => {
    setCustomLogs(newLogs);
    localStorage.setItem('care_fire_logs', JSON.stringify(newLogs));
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!formData.checkName) return;

    const newLog = {
      id: Date.now().toString(),
      type: formData.type,
      checkName: formData.checkName,
      lastCompleted: new Date().toISOString().split('T')[0],
      completedBy: formData.completedBy,
      status: 'Compliant'
    };

    saveLogs([newLog, ...customLogs]);
    setShowAddModal(false);
    setFormData({ checkName: '', type: 'alarm', completedBy: employees[0]?.name || '' });
  };

  const handleDeleteLog = (id) => {
    if (confirm('Are you sure you want to delete this fire compliance log?')) {
      const filtered = customLogs.filter(log => log.id !== id);
      saveLogs(filtered);
    }
  };

  const filteredLogs = customLogs.filter(log => log.type === activeTab);

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-red-800 to-rose-650 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Flame className="w-8 h-8 text-rose-300 animate-pulse" />
            Fire & Evacuation Registry
          </h1>
          <p className="mt-1 text-sm text-red-100 font-medium">
            Digitized fire log books, emergency lighting registries, drills history, and CQC safety compliance checks.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-white px-5 text-xs font-bold text-red-800 hover:bg-rose-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Record Fire Safety Check</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-850 gap-1 w-fit overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('alarm')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'alarm' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Fire Alarm Testing
        </button>
        <button
          onClick={() => setActiveTab('lighting')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'lighting' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Emergency Lighting
        </button>
        <button
          onClick={() => setActiveTab('drills')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'drills' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Fire Evacuation Drills
        </button>
        <button
          onClick={() => setActiveTab('extinguishers')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'extinguishers' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Extinguisher Audits
        </button>
      </div>

      {/* Grid of details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">Fire Safety Checks Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Fire Audit / Test Name</th>
                <th className="px-6 py-4">Last Completed Date</th>
                <th className="px-6 py-4">Completed By (Signature)</th>
                <th className="px-6 py-4 text-center">Verification Status</th>
                {['Admin', 'Manager'].includes(currentRole) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">
                    No logs found for this category.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{log.checkName}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">{log.lastCompleted}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>{log.completedBy}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                        {log.status}
                      </span>
                    </td>
                    {['Admin', 'Manager'].includes(currentRole) && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1 text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Record Fire Safety Check</h2>
            
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Check / Test Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Weekly Sounder Alarm Zone 3 Test"
                  className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold text-slate-800 dark:text-white"
                  value={formData.checkName}
                  onChange={(e) => setFormData({ ...formData, checkName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Register Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="alarm">Fire Alarm Test</option>
                    <option value="lighting">Emergency Light Check</option>
                    <option value="drills">Evacuation Drill Log</option>
                    <option value="extinguishers">Extinguisher Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Completed By</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.completedBy}
                    onChange={(e) => setFormData({ ...formData, completedBy: e.target.value })}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 text-slate-655 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-red-500/10 active:scale-95"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireComplianceBook;
