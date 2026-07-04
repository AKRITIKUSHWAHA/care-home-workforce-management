import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Calendar, 
  Check, 
  X, 
  Clipboard, 
  UserCheck, 
  AlertCircle, 
  CheckSquare, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const RESIDENTS = [
  { id: 'R1', name: 'Eleanor Vance', room: 'Room 102' },
  { id: 'R2', name: 'Arthur Pendelton', room: 'Room 205' },
  { id: 'R3', name: 'Mary Green', room: 'Room 114' },
  { id: 'R4', name: 'Harold Smith', room: 'Room 108' },
  { id: 'R5', name: 'Mary Berry', room: 'Room 211' }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SUB_TABS = [
  { id: 'interests', label: 'Interests' },
  { id: 'dols', label: 'DoLS' },
  { id: 'resident_agreement', label: 'Resident Agreement' },
  { id: 'fees_agreement', label: 'Fees Agreement' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'jewellery', label: 'Jewellery' }
];

export default function ResidentComplianceMatrix() {
  const { employees } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('resident_agreement');
  const [matrixData, setMatrixData] = useState({});
  const [selectedCell, setSelectedCell] = useState(null); // { residentId, month, tabId }
  const [popoverState, setPopoverState] = useState({
    completed: false,
    assignedTo: '',
    notes: '',
    targetDate: ''
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('resident_document_matrix');
    if (saved) {
      setMatrixData(JSON.parse(saved));
    } else {
      // Seed some default compliance data so it doesn't look blank
      const seed = {};
      RESIDENTS.forEach(res => {
        seed[res.id] = {};
        SUB_TABS.forEach(tab => {
          seed[res.id][tab.id] = {};
          MONTHS.forEach((mon, idx) => {
            // Seed 70% completed records for past months (Jan, Feb, Mar)
            const isCompleted = idx < 3 && (res.id !== 'R2' || tab.id !== 'dols');
            seed[res.id][tab.id][mon] = {
              completed: isCompleted,
              assignedTo: isCompleted ? 'EMP-001' : '',
              notes: isCompleted ? 'Standard documentation completed and uploaded.' : '',
              targetDate: ''
            };
          });
        });
      });
      setMatrixData(seed);
      localStorage.setItem('resident_document_matrix', JSON.stringify(seed));
    }
  }, []);

  // Save changes
  const saveMatrix = (updatedData) => {
    setMatrixData(updatedData);
    localStorage.setItem('resident_document_matrix', JSON.stringify(updatedData));
  };

  // Open Popover
  const handleCellClick = (residentId, month) => {
    const cellData = matrixData[residentId]?.[activeSubTab]?.[month] || {
      completed: false,
      assignedTo: '',
      notes: '',
      targetDate: ''
    };
    setSelectedCell({ residentId, month, tabId: activeSubTab });
    setPopoverState({
      completed: cellData.completed || false,
      assignedTo: cellData.assignedTo || '',
      notes: cellData.notes || '',
      targetDate: cellData.targetDate || ''
    });
  };

  // Save cell details from Popover
  const handleSavePopover = () => {
    if (!selectedCell) return;
    const { residentId, month, tabId } = selectedCell;
    const updated = { ...matrixData };
    
    if (!updated[residentId]) updated[residentId] = {};
    if (!updated[residentId][tabId]) updated[residentId][tabId] = {};
    
    updated[residentId][tabId][month] = {
      ...popoverState
    };
    
    saveMatrix(updated);
    setSelectedCell(null);
  };

  // Get cell stats
  const getStats = () => {
    let total = 0;
    let completed = 0;
    RESIDENTS.forEach(res => {
      MONTHS.forEach(mon => {
        total++;
        if (matrixData[res.id]?.[activeSubTab]?.[mon]?.completed) {
          completed++;
        }
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending: total - completed, pct };
  };

  const stats = getStats();
  const activeTabLabel = SUB_TABS.find(t => t.id === activeSubTab)?.label || '';

  return (
    <div className="space-y-6">
      {/* KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Total Check-offs</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stats.total}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Jan - Dec checklists</p>
          </div>
          <div className="p-3 bg-brand-50 rounded-xl dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
            <Clipboard className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Completed Matrix</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.completed}</h3>
            <p className="text-[10px] text-emerald-500/80 font-semibold mt-0.5">Documents fully verified</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Pending Action</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</h3>
            <p className="text-[10px] text-amber-550/85 font-semibold mt-0.5">Awaiting staff uploads</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <span className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Compliance Rate</span>
            <h3 className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{stats.pct}%</h3>
            <div className="w-24 bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${stats.pct}%` }} />
            </div>
          </div>
          <div className="p-3 bg-brand-50 rounded-xl dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="glass-card rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="p-5 border-b border-slate-150 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/20 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span>Resident Document Compliance Matrix</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              Monthly sign-off chart for <strong className="text-brand-600 dark:text-brand-400">{activeTabLabel}</strong>. Click any cell to check status or assign tasks.
            </p>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider text-[10px]">
                <th className="p-4 w-[220px]">Resident Name</th>
                {MONTHS.map(mon => (
                  <th key={mon} className="p-4 text-center">{mon}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
              {RESIDENTS.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">{res.name}</span>
                      <span className="text-[10px] text-slate-450 font-bold">{res.room}</span>
                    </div>
                  </td>
                  {MONTHS.map(mon => {
                    const cell = matrixData[res.id]?.[activeSubTab]?.[mon] || { completed: false };
                    return (
                      <td key={mon} className="p-4 text-center">
                        <button
                          onClick={() => handleCellClick(res.id, mon)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all mx-auto ${
                            cell.completed
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 hover:scale-105'
                              : 'bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-105'
                          }`}
                        >
                          {cell.completed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : cell.assignedTo ? (
                            <User className="w-3.5 h-3.5 text-amber-500 stroke-[2]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tab Pills Footer (Matches Excel Tabs look but premium) */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-2">
          {SUB_TABS.map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800/80 dark:text-emerald-400 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Assignment Popover Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="glass-card bg-white dark:bg-slate-950 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-850 shadow-2xl overflow-hidden animate-scale-up">
            {/* Popover Header */}
            <div className="p-6 border-b border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Update {activeTabLabel}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  {RESIDENTS.find(r => r.id === selectedCell.residentId)?.name} — {selectedCell.month} Matrix
                </p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-550 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popover Body */}
            <div className="p-6 space-y-4 text-xs font-semibold">
              {/* Checkbox status */}
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/80 transition-colors">
                <input
                  type="checkbox"
                  checked={popoverState.completed}
                  onChange={(e) => setPopoverState({ ...popoverState, completed: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-white">Compliant & Completed</span>
                  <span className="text-[10px] text-slate-405 font-bold">Marks this cell as completed</span>
                </div>
              </label>

              {/* Task Assignment */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Task To</span>
                </label>
                <div className="relative">
                  <select
                    value={popoverState.assignedTo}
                    onChange={(e) => setPopoverState({ ...popoverState, assignedTo: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Unassigned --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Target Expiry / Update Date */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target/Completion Date</span>
                </label>
                <input
                  type="date"
                  value={popoverState.targetDate}
                  onChange={(e) => setPopoverState({ ...popoverState, targetDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  Compliance Notes
                </label>
                <textarea
                  value={popoverState.notes}
                  onChange={(e) => setPopoverState({ ...popoverState, notes: e.target.value })}
                  placeholder="e.g. Agreement signed by resident's solicitor, checklist verified..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all resize-none font-semibold text-xs"
                />
              </div>
            </div>

            {/* Popover Footer */}
            <div className="p-6 border-t border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 transition-all text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePopover}
                className="px-4 py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-md transition-all text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
