import React, { useState } from 'react';
import { Users, ClipboardList, CheckCircle, Plus, Trash2, Calendar, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResidentTracker = () => {
  const { currentRole } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [residents, setResidents] = useState(() => {
    const saved = localStorage.getItem('care_resident_tracker');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Margaret Smith', room: 'Room 101', admissionDate: '2025-01-10', fundingType: 'NHS Funding', cqcNotified: 'Yes', status: 'Admitted' },
      { id: '2', name: 'Arthur Pendelton', room: 'Room 102', admissionDate: '2025-03-14', fundingType: 'Private', cqcNotified: 'Yes', status: 'Admitted' },
      { id: '3', name: 'Margaret Atwood', room: 'Room 103', admissionDate: '2025-05-20', fundingType: 'Social Care', cqcNotified: 'Yes', status: 'Admitted' },
      { id: '4', name: 'John Miller', room: 'Room 104', admissionDate: '2026-02-01', fundingType: 'NHS Funding', cqcNotified: 'Yes', status: 'Admitted' }
    ];
  });

  const [formData, setFormData] = useState({
    name: '',
    room: '',
    admissionDate: '',
    fundingType: 'NHS Funding',
    cqcNotified: 'Yes'
  });

  const saveResidents = (newResidents) => {
    setResidents(newResidents);
    localStorage.setItem('care_resident_tracker', JSON.stringify(newResidents));
  };

  const handleAddResident = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.room || !formData.admissionDate) return;

    const newRes = {
      id: Date.now().toString(),
      name: formData.name,
      room: formData.room,
      admissionDate: formData.admissionDate,
      fundingType: formData.fundingType,
      cqcNotified: formData.cqcNotified,
      status: 'Admitted'
    };

    saveResidents([newRes, ...residents]);
    setShowAddModal(false);
    setFormData({ name: '', room: '', admissionDate: '', fundingType: 'NHS Funding', cqcNotified: 'Yes' });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this resident record from the tracker?')) {
      const filtered = residents.filter(res => res.id !== id);
      saveResidents(filtered);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-blue-350" />
            Resident Admissions Tracker
          </h1>
          <p className="mt-1 text-sm text-blue-100 font-medium">
            Digitized admissions logbook, room allocations, CQC notification checklist, and local authority funding status.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-white px-5 text-xs font-bold text-blue-800 hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Admit New Resident</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">Active Occupancy Register</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Resident Name</th>
                <th className="px-6 py-4">Room Allocation</th>
                <th className="px-6 py-4">Date of Admission</th>
                <th className="px-6 py-4">Funding Stream</th>
                <th className="px-6 py-4">CQC Notification Status</th>
                <th className="px-6 py-4 text-center">Status</th>
                {['Admin', 'Manager'].includes(currentRole) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {residents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400 italic">
                    No resident records found in the tracker.
                  </td>
                </tr>
              ) : (
                residents.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{res.name}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-350">{res.room}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">{res.admissionDate}</td>
                    <td className="px-6 py-4 font-bold text-slate-655 dark:text-slate-400">{res.fundingType}</td>
                    <td className="px-6 py-4 font-bold text-slate-655 dark:text-slate-400">{res.cqcNotified}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                        {res.status}
                      </span>
                    </td>
                    {['Admin', 'Manager'].includes(currentRole) && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(res.id)}
                          className="p-1 text-slate-455 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg transition-all"
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

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Admit New Resident</h2>
            
            <form onSubmit={handleAddResident} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Full Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Margaret Thatcher"
                  className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Room number</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Room 105"
                    className="w-full px-4 py-2 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Date of Admission</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Funding Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.fundingType}
                    onChange={(e) => setFormData({ ...formData, fundingType: e.target.value })}
                  >
                    <option>NHS Funding</option>
                    <option>Private</option>
                    <option>Social Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">CQC Notified?</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 dark:text-white"
                    value={formData.cqcNotified}
                    onChange={(e) => setFormData({ ...formData, cqcNotified: e.target.value })}
                  >
                    <option>Yes</option>
                    <option>No</option>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 active:scale-95"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentTracker;
