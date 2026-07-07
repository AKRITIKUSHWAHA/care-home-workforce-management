import React, { useState } from 'react';
import { Users, ClipboardList, CheckCircle, Plus, Trash2, Calendar, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HandoverAllocationSheet = () => {
  const { employees, currentRole } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [allocations, setAllocations] = useState(() => {
    const saved = localStorage.getItem('care_handover_allocations');
    return saved ? JSON.parse(saved) : [
      { id: '1', staffName: 'John (Senior Carer)', suite: 'Suite A (Rooms 101-105)', shift: 'Day Shift (8AM - 8PM)', notes: 'All resident personal belongings checked, no issues.', status: 'Completed' },
      { id: '2', staffName: 'Jane (Housekeeper)', suite: 'Suite B (Rooms 106-110)', shift: 'Day Shift (8AM - 8PM)', notes: 'Deep clean completed in bathroom suite.', status: 'Completed' }
    ];
  });

  const [formData, setFormData] = useState({
    staffName: employees[0]?.name || '',
    suite: '',
    shift: 'Day Shift (8AM - 8PM)',
    notes: ''
  });

  const saveAllocations = (newAllocations) => {
    setAllocations(newAllocations);
    localStorage.setItem('care_handover_allocations', JSON.stringify(newAllocations));
  };

  const handleAddAllocation = (e) => {
    e.preventDefault();
    if (!formData.suite || !formData.notes) return;

    const newAlloc = {
      id: Date.now().toString(),
      staffName: formData.staffName,
      suite: formData.suite,
      shift: formData.shift,
      notes: formData.notes,
      status: 'Completed'
    };

    saveAllocations([newAlloc, ...allocations]);
    setShowAddModal(false);
    setFormData({ staffName: employees[0]?.name || '', suite: '', shift: 'Day Shift (8AM - 8PM)', notes: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this allocation/handover log?')) {
      const filtered = allocations.filter(alloc => alloc.id !== id);
      saveAllocations(filtered);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-teal-350" />
            Handover & Allocation Sheet
          </h1>
          <p className="mt-1 text-sm text-teal-100 font-medium">
            Digitized staff suite allocations, shift handover summaries, and carer duty checklists.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-white px-5 text-xs font-bold text-teal-800 hover:bg-teal-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Allocation & Handover</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">Suite Allocation Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Allocated Staff</th>
                <th className="px-6 py-4">Allocated Suite / Rooms</th>
                <th className="px-6 py-4">Shift Details</th>
                <th className="px-6 py-4">Handover Notes</th>
                <th className="px-6 py-4 text-center">Status</th>
                {['Admin', 'Manager'].includes(currentRole) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {allocations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 italic">
                    No allocations created yet.
                  </td>
                </tr>
              ) : (
                allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>{alloc.staffName}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{alloc.suite}</td>
                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">{alloc.shift}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-350 max-w-sm break-words">{alloc.notes}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                        {alloc.status}
                      </span>
                    </td>
                    {['Admin', 'Manager'].includes(currentRole) && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(alloc.id)}
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

      {/* Add Allocation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Create Suite Allocation & Handover</h2>
            
            <form onSubmit={handleAddAllocation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Carer Name</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.staffName}
                    onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Shift Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  >
                    <option>Day Shift (8AM - 8PM)</option>
                    <option>Night Shift (8PM - 8AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Allocated Suite / Rooms</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Suite C (Rooms 111-115)"
                  className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-800 dark:text-white"
                  value={formData.suite}
                  onChange={(e) => setFormData({ ...formData, suite: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Handover / Briefing Notes</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="e.g. All keys present. Resident room belongings verified. No outstanding issues."
                  className="w-full px-4 py-3 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-800 dark:text-white resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-teal-500/10 active:scale-95"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandoverAllocationSheet;
