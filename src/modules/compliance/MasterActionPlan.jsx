import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Trash2, Calendar, UserCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MasterActionPlan = () => {
  const { employees, currentRole } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionPlans, setActionPlans] = useState(() => {
    const saved = localStorage.getItem('care_action_plans');
    return saved ? JSON.parse(saved) : [
      { id: '1', finding: 'Medication fridge temperature log missing on 2 days', action: 'Update fridge temperature checklist and staff orientation', responsible: 'John (Manager)', targetDate: '2026-07-15', dateCompleted: '', status: 'In Progress' },
      { id: '2', finding: 'Fire exit Zone 2 partially obstructed by domestic trolley', action: 'Move domestic storage cabinet to designated store room', responsible: 'Jane (Housekeeper)', targetDate: '2026-07-01', dateCompleted: '2026-07-02', status: 'Verified' }
    ];
  });

  const [formData, setFormData] = useState({
    finding: '',
    action: '',
    responsible: employees[0]?.name || '',
    targetDate: ''
  });

  const saveActionPlans = (newPlans) => {
    setActionPlans(newPlans);
    localStorage.setItem('care_action_plans', JSON.stringify(newPlans));
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!formData.finding || !formData.action || !formData.targetDate) return;

    const newPlan = {
      id: Date.now().toString(),
      finding: formData.finding,
      action: formData.action,
      responsible: formData.responsible,
      targetDate: formData.targetDate,
      dateCompleted: '',
      status: 'In Progress'
    };

    saveActionPlans([newPlan, ...actionPlans]);
    setShowAddModal(false);
    setFormData({ finding: '', action: '', responsible: employees[0]?.name || '', targetDate: '' });
  };

  const handleVerify = (id) => {
    const updated = actionPlans.map(plan => {
      if (plan.id === id) {
        return {
          ...plan,
          status: 'Verified',
          dateCompleted: new Date().toISOString().split('T')[0]
        };
      }
      return plan;
    });
    saveActionPlans(updated);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this action plan?')) {
      const filtered = actionPlans.filter(plan => plan.id !== id);
      saveActionPlans(filtered);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-indigo-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-indigo-300" />
            Master Action Plan (Continuous Improvement)
          </h1>
          <p className="mt-1 text-sm text-indigo-100 font-medium">
            Digitized corrective action plans, target milestone dates, and registered manager verification signs.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-white px-5 text-xs font-bold text-indigo-800 hover:bg-indigo-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Action Plan</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Open Actions</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {actionPlans.filter(p => p.status === 'In Progress').length}
            </p>
          </div>
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-955/20 text-amber-600 dark:text-amber-450 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Verified Actions</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {actionPlans.filter(p => p.status === 'Verified').length}
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Total Audit Findings</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {actionPlans.length}
            </p>
          </div>
          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-405 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Action Plan Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">Corrective Action Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Audit Finding</th>
                <th className="px-6 py-4">Corrective Action Required</th>
                <th className="px-6 py-4">Responsible Person</th>
                <th className="px-6 py-4">Target Date</th>
                <th className="px-6 py-4">Date Completed</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {actionPlans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400 italic">
                    No action items created yet.
                  </td>
                </tr>
              ) : (
                actionPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[200px] break-words">{plan.finding}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[250px] break-words">{plan.action}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-500" />
                      <span>{plan.responsible}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">{plan.targetDate}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">{plan.dateCompleted || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border whitespace-nowrap inline-block
                        ${plan.status === 'Verified' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450' 
                          : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-450'}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {plan.status === 'In Progress' && ['Admin', 'Manager', 'Compliance Officer'].includes(currentRole) && (
                        <button 
                          onClick={() => handleVerify(plan.id)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold border border-emerald-200/50 transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}
                      {['Admin', 'Manager'].includes(currentRole) && (
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="p-1 text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all inline-block align-middle cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Create Action Plan</h2>
            
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Audit Finding / Non-Compliance</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Zone 1 Fire Extinguisher pressure tag expired"
                  className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800 dark:text-white"
                  value={formData.finding}
                  onChange={(e) => setFormData({ ...formData, finding: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Corrective Action Plan</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="e.g. Schedule immediate inspection with fire asset partner and tag replacement"
                  className="w-full px-4 py-3 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800 dark:text-white resize-none"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Target Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Responsible Person</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-500/10 active:scale-95"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterActionPlan;
