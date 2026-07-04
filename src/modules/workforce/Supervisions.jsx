import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ChevronRight, 
  MoreHorizontal, 
  X, 
  FileUp, 
  Calendar, 
  Check, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Supervisions = () => {
  const { employees, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'matrix'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordFormData, setRecordFormData] = useState({
    employeeId: '',
    managerId: '',
    type: '1-to-1',
    date: '',
    notes: '',
    status: 'Completed'
  });

  // Supervision & Observation Matrix state loaded from localStorage or seeded
  const [matrixData, setMatrixData] = useState(() => {
    const saved = localStorage.getItem('supervision_obs_matrix');
    if (saved) return JSON.parse(saved);
    
    // Seed initial high-fidelity data matching our 14 employees
    return employees.map((emp, idx) => {
      const isSenior = ['Manager', 'Admin', 'HR', 'Compliance Officer', 'Senior Care Assistant', 'Registered Care Nurse'].includes(emp.title) || emp.role === 'Manager' || emp.role === 'Compliance Officer';
      const isNewStarter = emp.startDate.startsWith('2024') || emp.startDate.startsWith('2025') || emp.startDate.startsWith('2026');
      
      return {
        employeeId: emp.id,
        name: emp.name,
        title: emp.title,
        startDate: emp.startDate,
        isSenior,
        newStarter: {
          w1: isNewStarter ? '2024-04-17' : 'Completed',
          w2: isNewStarter ? '2024-04-24' : 'Completed',
          w4: isNewStarter ? 'Completed' : 'Completed',
          w6: isNewStarter ? 'Pending' : 'Completed',
          w8: isNewStarter ? 'Pending' : 'Completed',
          w10: isNewStarter ? 'Pending' : 'Completed',
          w12: isNewStarter ? 'Pending' : 'Completed',
        },
        quarterlySupervisions: {
          q1: { date: '2026-03-10', status: 'Completed' },
          q2: { date: '2026-06-12', status: 'Completed' },
          q3: { date: '', status: 'Pending' },
          q4: { date: '', status: 'Pending' }
        },
        probationReview: {
          targetDate: emp.id === 'EMP-008' ? '2024-10-01' : '2021-09-15',
          completedDate: emp.id === 'EMP-008' ? '' : '2021-09-14',
          status: emp.id === 'EMP-008' ? 'Under Review' : 'Passed'
        },
        observations: {
          medication: { date: idx % 2 === 0 ? '2026-05-10' : '2026-05-02', status: 'Completed' },
          movingHandling: { date: idx % 3 === 0 ? '2026-05-11' : '2026-05-09', status: 'Completed' },
          infectionControl: { date: '2026-05-12', status: 'Completed' },
          dining: { date: idx % 4 === 0 ? '2026-05-14' : '2026-05-08', status: 'Completed' },
          recordKeeping: { date: '2026-05-15', status: 'Completed' },
          communication: { date: '2026-05-16', status: 'Completed' },
          dignity: { date: '2026-05-17', status: 'Completed' }
        },
        monthlyChecks: {
          careNotes: { date: '2026-06-01', status: 'Completed' },
          repositioning: { date: '2026-06-02', status: 'Completed' },
          fireDrill: { date: '2026-06-05', status: 'Completed' }
        },
        seniorSignoffs: {
          weeklyMar: { date: isSenior ? '2026-06-10' : 'N/A', status: isSenior ? 'Completed' : 'N/A' },
          monthlyMar: { date: isSenior ? '2026-06-01' : 'N/A', status: isSenior ? 'Completed' : 'N/A' },
          weeklyCarePlan: { date: isSenior ? '2026-06-08' : 'N/A', status: isSenior ? 'Completed' : 'N/A' },
          monthlyCarePlan: { date: isSenior ? '2026-06-01' : 'N/A', status: isSenior ? 'Completed' : 'N/A' }
        }
      };
    });
  });

  // Keep matrix data in sync with local storage
  useEffect(() => {
    localStorage.setItem('supervision_obs_matrix', JSON.stringify(matrixData));
  }, [matrixData]);

  // Classic Records list state (pre-seeded)
  const [recordsList, setRecordsList] = useState(() => {
    const saved = localStorage.getItem('supervision_records');
    if (saved) return JSON.parse(saved);
    return [
      { id: "1", employeeName: "Oliver", managerName: "Abhina", type: "1-to-1", date: "2026-05-12", status: "Completed", notes: "Discussed clinical practice improvements and hydration auditing support." },
      { id: "2", employeeName: "Aron", managerName: "Abhina", type: "Probation Review", date: "2026-06-01", status: "Overdue", notes: "Pending completion check-off sheet." },
      { id: "3", employeeName: "Harry", managerName: "Abhina", type: "Annual Appraisal", date: "2026-06-25", status: "Upcoming", notes: "Scheduled 12-month review." }
    ];
  });

  useEffect(() => {
    localStorage.setItem('supervision_records', JSON.stringify(recordsList));
  }, [recordsList]);

  // Interactive editing cell state for Matrix
  const [selectedCell, setSelectedCell] = useState(null); // { employeeId, section, key, currentVal }
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('Completed');
  const [editStarterValue, setEditStarterValue] = useState('');

  // KPIs calculation
  const totalCompleted = recordsList.filter(r => r.status === 'Completed').length + 
    matrixData.reduce((acc, emp) => {
      let count = 0;
      Object.values(emp.quarterlySupervisions).forEach(q => { if (q.status === 'Completed') count++; });
      Object.values(emp.observations).forEach(o => { if (o.status === 'Completed') count++; });
      return acc + count;
    }, 0);

  const totalOverdue = recordsList.filter(r => r.status === 'Overdue').length + 
    matrixData.filter(emp => emp.probationReview.status === 'Under Review').length;

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!recordFormData.employeeId || !recordFormData.managerId) {
      alert("Please select both Employee and Manager.");
      return;
    }
    const emp = employees.find(e => e.id === recordFormData.employeeId);
    const mgr = employees.find(e => e.id === recordFormData.managerId);

    const newRecord = {
      id: `SR-${Date.now()}`,
      employeeName: emp ? emp.name : 'Unknown',
      managerName: mgr ? mgr.name : 'Unknown',
      type: recordFormData.type,
      date: recordFormData.date,
      status: recordFormData.status,
      notes: recordFormData.notes
    };

    setRecordsList(prev => [newRecord, ...prev]);
    setIsRecordModalOpen(false);
    setRecordFormData({
      employeeId: '',
      managerId: '',
      type: '1-to-1',
      date: '',
      notes: '',
      status: 'Completed'
    });
  };

  const handleCellClick = (employeeId, section, key, currentVal) => {
    const emp = matrixData.find(e => e.employeeId === employeeId);
    if (!emp) return;
    
    setSelectedCell({ employeeId, section, key, currentVal });
    
    if (section === 'newStarter') {
      setEditStarterValue(emp.newStarter[key]);
    } else if (section === 'probationReview') {
      setEditDate(emp.probationReview[key] || '');
      setEditStatus(emp.probationReview.status);
    } else {
      setEditDate(currentVal.date || '');
      setEditStatus(currentVal.status || 'Pending');
    }
    setEditModalOpen(true);
  };

  const handleSaveCellChanges = () => {
    if (!selectedCell) return;
    const { employeeId, section, key } = selectedCell;

    setMatrixData(prev => prev.map(emp => {
      if (emp.employeeId !== employeeId) return emp;

      const updated = { ...emp };
      if (section === 'newStarter') {
        updated.newStarter = { ...updated.newStarter, [key]: editStarterValue };
      } else if (section === 'probationReview') {
        updated.probationReview = { 
          ...updated.probationReview, 
          [key]: editDate, 
          status: editStatus 
        };
      } else if (section === 'quarterlySupervisions') {
        updated.quarterlySupervisions = {
          ...updated.quarterlySupervisions,
          [key]: { date: editDate, status: editStatus }
        };
      } else if (section === 'observations') {
        updated.observations = {
          ...updated.observations,
          [key]: { date: editDate, status: editStatus }
        };
      } else if (section === 'monthlyChecks') {
        updated.monthlyChecks = {
          ...updated.monthlyChecks,
          [key]: { date: editDate, status: editStatus }
        };
      } else if (section === 'seniorSignoffs') {
        updated.seniorSignoffs = {
          ...updated.seniorSignoffs,
          [key]: { date: editDate, status: editStatus }
        };
      }

      return updated;
    }));

    setEditModalOpen(false);
    setSelectedCell(null);
  };

  // Filter matrix or records
  const filteredMatrix = matrixData.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecords = recordsList.filter(row => 
    row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.managerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status Colors styling helpers
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
      case 'Passed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800';
      case 'Pending':
      case 'Upcoming':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800';
      case 'N/A':
        return 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800';
      default:
        return 'bg-slate-50 text-slate-650 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Dynamic Dashboard Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-650 p-6 md:p-8 text-white shadow-lg shadow-brand-900/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" />
            Supervisions & Clinical Observations Matrix
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            Monitor quarterly check-ins, starter milestones, CQC competency assessments, and senior sign-offs.
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'list' && (
            <button 
              onClick={() => setIsRecordModalOpen(true)}
              className="h-10 rounded-xl bg-white px-4 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Log Supervision</span>
            </button>
          )}
          <button className="h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 text-xs font-bold text-white transition-all flex items-center gap-1.5 backdrop-blur-sm">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'list' 
              ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          Meetings & Appraisals List
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'matrix' 
              ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          Supervision & Observation Matrix Grid
        </button>
      </div>

      {/* KPIs Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Activities</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalCompleted}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
            <Check className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerts & Overdue</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{totalOverdue}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Supervised Staff</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{employees.length}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 text-white shadow-md">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-850 dark:text-slate-100">
            {activeTab === 'list' ? 'Supervision Meeting Records' : 'Staff Compliance & Check-off Grid'}
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            {activeTab === 'list' 
              ? 'Chronological list of all logged meetings, appraisal evaluations, and feedback notes.' 
              : 'Interactive matrix mapping training progress, CQC inspections, and senior sign-offs.'}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search staff or title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/55 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold transition-all w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Classic List View */}
      {activeTab === 'list' && (
        <div className="glass-card rounded-3xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Assessor / Manager</th>
                  <th className="px-6 py-4">Meeting Type</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Key Assessment Comments</th>
                  <th className="px-6 py-4 text-right">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                {filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.employeeName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-450">{row.managerName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{row.type}</td>
                    <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{row.date}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[280px] truncate" title={row.notes}>
                      {row.notes || 'No notes added.'}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <span className={`px-2.5 py-1 rounded border font-bold text-[9px] uppercase tracking-wider inline-block ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                      <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Supervisions & Observations Matrix Grid */}
      {activeTab === 'matrix' && (
        <div className="glass-card rounded-3xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left border-collapse text-[11px] font-sans">
              <thead className="bg-slate-100/70 dark:bg-slate-900 text-slate-500 dark:text-slate-450 border-b border-slate-200 dark:border-slate-850">
                {/* Header Row 1: Section Grouping */}
                <tr>
                  <th colSpan="3" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-350 text-xs">
                    Staff Identity Info
                  </th>
                  <th colSpan="7" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-teal-500/5 dark:bg-teal-950/20 text-[#1f4b42] dark:text-[#52cbb4] text-center text-xs">
                    New Starter Check-Offs
                  </th>
                  <th colSpan="4" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-indigo-500/5 dark:bg-indigo-950/20 text-[#292261] dark:text-[#9086e4] text-center text-xs">
                    Quarterly Supervisions
                  </th>
                  <th colSpan="1" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 dark:bg-amber-955/20 text-[#69431e] dark:text-[#f3b573] text-center text-xs">
                    Probation Review
                  </th>
                  <th colSpan="7" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/20 text-[#204928] dark:text-[#6ae27f] text-center text-xs">
                    Quarterly Clinical Observations
                  </th>
                  <th colSpan="3" className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-400 text-center text-xs">
                    Monthly Checks
                  </th>
                  <th colSpan="4" className="px-4 py-3 font-bold bg-brand-500/5 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 text-center text-xs">
                    Senior Sign-offs
                  </th>
                </tr>
                {/* Header Row 2: Columns Details */}
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider bg-slate-50 dark:bg-slate-900/50">
                  {/* Staff Info */}
                  <th className="px-4 py-3 min-w-[130px] sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 border-r border-slate-250 dark:border-slate-800">Name</th>
                  <th className="px-4 py-3 min-w-[140px]">Role / Title</th>
                  <th className="px-4 py-3 min-w-[90px] border-r border-slate-250 dark:border-slate-800">Start Date</th>
                  {/* Starter Weeks */}
                  <th className="px-2 py-3 text-center min-w-[70px]">W1 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px]">W2 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px]">W4 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px]">W6 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px]">W8 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px]">W10 Check</th>
                  <th className="px-2 py-3 text-center min-w-[70px] border-r border-slate-250 dark:border-slate-800">W12 Check</th>
                  {/* Quarterly Supervisions */}
                  <th className="px-2 py-3 text-center min-w-[85px]">Q1 Review</th>
                  <th className="px-2 py-3 text-center min-w-[85px]">Q2 Review</th>
                  <th className="px-2 py-3 text-center min-w-[85px]">Q3 Review</th>
                  <th className="px-2 py-3 text-center min-w-[85px] border-r border-slate-250 dark:border-slate-800">Q4 Review</th>
                  {/* Probation */}
                  <th className="px-3 py-3 text-center min-w-[120px] border-r border-slate-250 dark:border-slate-800">6-Month Probation</th>
                  {/* Observations */}
                  <th className="px-2 py-3 text-center min-w-[80px]">Medication</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">M&H</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">Infection</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">Dining</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">Records</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">Comm.</th>
                  <th className="px-2 py-3 text-center min-w-[80px] border-r border-slate-250 dark:border-slate-800">Dignity</th>
                  {/* Monthly Checks */}
                  <th className="px-2 py-3 text-center min-w-[85px]">Care Notes</th>
                  <th className="px-2 py-3 text-center min-w-[85px]">Repos Chart</th>
                  <th className="px-2 py-3 text-center min-w-[85px] border-r border-slate-250 dark:border-slate-800">Fire Drill</th>
                  {/* Senior Signoffs */}
                  <th className="px-2 py-3 text-center min-w-[80px]">W-MAR</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">M-MAR</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">W-CarePlan</th>
                  <th className="px-2 py-3 text-center min-w-[80px]">M-CarePlan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                {filteredMatrix.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    {/* Sticky Name */}
                    <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-905 z-10 shadow-sm border-r border-slate-250 dark:border-slate-800">
                      {emp.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                      {emp.title}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-450 dark:text-slate-500 border-r border-slate-250 dark:border-slate-800">
                      {emp.startDate}
                    </td>

                    {/* New Starter Columns */}
                    {['w1', 'w2', 'w4', 'w6', 'w8', 'w10', 'w12'].map((wk) => {
                      const val = emp.newStarter[wk];
                      const isComplete = val === 'Completed';
                      return (
                        <td 
                          key={wk}
                          onClick={() => handleCellClick(emp.employeeId, 'newStarter', wk, val)}
                          className={`px-2 py-3 text-center font-bold cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-r border-dashed border-slate-100 dark:border-slate-800/50 text-[10px] ${
                            isComplete 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-amber-500 dark:text-amber-400'
                          }`}
                        >
                          {isComplete ? '✓ Compliant' : val}
                        </td>
                      );
                    })}

                    {/* Quarterly Supervisions */}
                    {['q1', 'q2', 'q3', 'q4'].map((quarter, qIdx) => {
                      const item = emp.quarterlySupervisions[quarter];
                      const style = getStatusStyle(item.status);
                      const displayStr = item.status === 'Completed' ? item.date : 'Due';
                      const isLast = qIdx === 3;
                      
                      return (
                        <td 
                          key={quarter}
                          onClick={() => handleCellClick(emp.employeeId, 'quarterlySupervisions', quarter, item)}
                          className={`px-2 py-3 text-center cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                            isLast ? 'border-r border-slate-250 dark:border-slate-800 font-bold' : 'border-r border-dashed border-slate-100 dark:border-slate-800/50'
                          }`}
                        >
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold border ${style}`}>
                            {displayStr}
                          </span>
                        </td>
                      );
                    })}

                    {/* 6-Month Probation review */}
                    <td 
                      onClick={() => handleCellClick(emp.employeeId, 'probationReview', 'completedDate', emp.probationReview)}
                      className="px-3 py-3 text-center cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-r border-slate-250 dark:border-slate-800"
                    >
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${getStatusStyle(emp.probationReview.status)}`}>
                          {emp.probationReview.status}
                        </span>
                        {emp.probationReview.completedDate && (
                          <span className="text-[9px] text-slate-400">{emp.probationReview.completedDate}</span>
                        )}
                        {!emp.probationReview.completedDate && (
                          <span className="text-[9px] text-slate-400">Due: {emp.probationReview.targetDate}</span>
                        )}
                      </div>
                    </td>

                    {/* Quarterly Observations (7 types) */}
                    {['medication', 'movingHandling', 'infectionControl', 'dining', 'recordKeeping', 'communication', 'dignity'].map((obs, oIdx) => {
                      const item = emp.observations[obs];
                      const style = getStatusStyle(item.status);
                      const displayStr = item.status === 'Completed' ? item.date : 'Due';
                      const isLast = oIdx === 6;

                      return (
                        <td 
                          key={obs}
                          onClick={() => handleCellClick(emp.employeeId, 'observations', obs, item)}
                          className={`px-2 py-3 text-center cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                            isLast ? 'border-r border-slate-250 dark:border-slate-800 font-bold' : 'border-r border-dashed border-slate-100 dark:border-slate-800/50'
                          }`}
                        >
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${style}`}>
                            {displayStr}
                          </span>
                        </td>
                      );
                    })}

                    {/* Monthly Checks */}
                    {['careNotes', 'repositioning', 'fireDrill'].map((chk, cIdx) => {
                      const item = emp.monthlyChecks[chk];
                      const style = getStatusStyle(item.status);
                      const isLast = cIdx === 2;

                      return (
                        <td 
                          key={chk}
                          onClick={() => handleCellClick(emp.employeeId, 'monthlyChecks', chk, item)}
                          className={`px-2 py-3 text-center cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                            isLast ? 'border-r border-slate-250 dark:border-slate-800 font-bold' : 'border-r border-dashed border-slate-100 dark:border-slate-800/50'
                          }`}
                        >
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${style}`}>
                            {item.status === 'Completed' ? item.date : 'Due'}
                          </span>
                        </td>
                      );
                    })}

                    {/* Senior Sign-offs */}
                    {['weeklyMar', 'monthlyMar', 'weeklyCarePlan', 'monthlyCarePlan'].map((snr) => {
                      const item = emp.seniorSignoffs[snr];
                      const style = getStatusStyle(item.status);
                      const isNA = item.status === 'N/A';

                      return (
                        <td 
                          key={snr}
                          onClick={() => !isNA && handleCellClick(emp.employeeId, 'seniorSignoffs', snr, item)}
                          className={`px-2 py-3 text-center transition-all ${
                            isNA ? 'bg-slate-50/40 dark:bg-slate-900/40 text-slate-400/55 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${style}`}>
                            {item.status === 'Completed' ? item.date : item.status}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Addition Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Log Supervision Record</h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Store formal 1-to-1 notes, probation details, or annual evaluations.</p>
              </div>
              <button 
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Employee Name</label>
                <select
                  required
                  value={recordFormData.employeeId}
                  onChange={(e) => setRecordFormData({ ...recordFormData, employeeId: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="">Select Employee...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Assessor / Reviewer</label>
                <select
                  required
                  value={recordFormData.managerId}
                  onChange={(e) => setRecordFormData({ ...recordFormData, managerId: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="">Select Reviewer...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.title})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Review Type</label>
                  <select
                    value={recordFormData.type}
                    onChange={(e) => setRecordFormData({ ...recordFormData, type: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option>1-to-1</option>
                    <option>Probation Review</option>
                    <option>Annual Appraisal</option>
                    <option>Return to Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={recordFormData.date}
                    onChange={(e) => setRecordFormData({ ...recordFormData, date: e.target.value })}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Record Notes</label>
                <textarea
                  rows="3"
                  value={recordFormData.notes}
                  onChange={(e) => setRecordFormData({ ...recordFormData, notes: e.target.value })}
                  placeholder="Record summary feedback and target improvement areas..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-850 dark:text-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Status</label>
                <select
                  value={recordFormData.status}
                  onChange={(e) => setRecordFormData({ ...recordFormData, status: e.target.value })}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-850 dark:text-slate-200"
                >
                  <option>Completed</option>
                  <option>Upcoming</option>
                  <option>Overdue</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brand-650 to-brand-550 hover:from-brand-550 hover:to-brand-450 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Matrix Cell Editing Modal */}
      {editModalOpen && selectedCell && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Update Matrix Milestone</h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                  Employee: <span className="font-bold text-slate-600 dark:text-slate-350">{matrixData.find(e => e.employeeId === selectedCell.employeeId)?.name}</span>
                </p>
              </div>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedCell.section === 'newStarter' ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Starter Week Value</label>
                  <select
                    value={editStarterValue}
                    onChange={(e) => setEditStarterValue(e.target.value)}
                    className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="Completed">Completed / Signed Off</option>
                    <option value="Pending">Pending / In Progress</option>
                    <option value="N/A">Not Applicable</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Date Completed</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Milestone Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Completed">Completed / Passed</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Overdue">Overdue</option>
                      <option value="N/A">Not Applicable</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCellChanges}
                  className="flex-1 py-3 bg-gradient-to-r from-brand-650 to-brand-550 hover:from-brand-550 hover:to-brand-450 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supervisions;
