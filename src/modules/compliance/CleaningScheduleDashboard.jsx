import React, { useState } from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Plus, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CleaningScheduleDashboard = () => {
  const { employees, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'medication'
  const [showAddModal, setShowAddModal] = useState(false);
  const [customLogs, setCustomLogs] = useState(() => {
    const saved = localStorage.getItem('care_cleaning_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', area: 'Resident Lounge', task: 'Vacuum carpet & sanitize cushions', frequency: 'Daily', completedAt: '2026-07-06 08:30', staffName: 'Jane (Housekeeper)', status: 'Verified' },
      { id: '2', area: 'Dining Hall', task: 'Wash dining tables & clean floor', frequency: 'Daily', completedAt: '2026-07-06 09:00', staffName: 'Sarah (Domestic)', status: 'Verified' },
      { id: '3', area: 'Room 101 Bathroom', task: 'Disinfect toilet, sink & tiles', frequency: 'Daily', completedAt: '2026-07-06 10:15', staffName: 'Jane (Housekeeper)', status: 'Verified' }
    ];
  });

  const [formData, setFormData] = useState({
    area: '',
    task: '',
    frequency: 'Daily',
    staffName: employees[0]?.name || ''
  });

  const saveLogs = (newLogs) => {
    setCustomLogs(newLogs);
    localStorage.setItem('care_cleaning_logs', JSON.stringify(newLogs));
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!formData.area || !formData.task) return;

    const newLog = {
      id: Date.now().toString(),
      area: formData.area,
      task: formData.task,
      frequency: formData.frequency,
      completedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      staffName: formData.staffName,
      status: 'Verified'
    };

    saveLogs([newLog, ...customLogs]);
    setShowAddModal(false);
    setFormData({ area: '', task: '', frequency: 'Daily', staffName: employees[0]?.name || '' });
  };

  const handleDeleteLog = (id) => {
    if (confirm('Are you sure you want to delete this cleaning record?')) {
      const filtered = customLogs.filter(log => log.id !== id);
      saveLogs(filtered);
    }
  };

  // Filter tasks based on active tab frequency
  const getFilteredLogs = () => {
    if (activeTab === 'daily') return customLogs.filter(log => log.frequency === 'Daily');
    if (activeTab === 'weekly') return customLogs.filter(log => log.frequency === 'Weekly');
    return customLogs.filter(log => log.area.toLowerCase().includes('medication'));
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Banner Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-650 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            Domestic Cleaning Schedule
          </h1>
          <p className="mt-1 text-sm text-emerald-100 font-medium">
            Digitized cleaning rosters, hygiene checklists, and CQC infection control logs.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-white px-5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Sign Off Completed Clean</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-850 gap-1 w-fit">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'daily' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Daily Cleaning Logs
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'weekly' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Weekly Deep Cleans
        </button>
        <button
          onClick={() => setActiveTab('medication')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'medication' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Medication Room Cleanings
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Compliance</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
          </div>
          <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cleans Logged</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{customLogs.length}</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400  rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Areas Pending Check</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">0</p>
          </div>
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-955/20 text-amber-600 dark:text-amber-450 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider"> Hygiene Log Entries</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Area / Room</th>
                <th className="px-6 py-4">Task Completed</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Date & Time Logged</th>
                <th className="px-6 py-4">Staff Signature</th>
                <th className="px-6 py-4 text-center">Status</th>
                {['Admin', 'Manager'].includes(currentRole) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400 italic">
                    No cleaning records found for this category.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{log.area}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{log.task}</td>
                    <td className="px-6 py-4 font-bold text-slate-550 dark:text-slate-400">{log.frequency}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">{log.completedAt}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>{log.staffName}</span>
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
                          className="p-1 text-slate-450 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
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

      {/* Add Sign-off Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Sign Off Completed Clean</h2>
            
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Cleaning Area / Suite</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. S1 Medication Room"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800 dark:text-white"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Hygiene Task Details</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Describe cleaning tasks (e.g. wiped worktops, empty bins, damp mop floor)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800 dark:text-white resize-none"
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Frequency</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Signatory Staff</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.staffName}
                    onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/10 active:scale-95"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningScheduleDashboard;
