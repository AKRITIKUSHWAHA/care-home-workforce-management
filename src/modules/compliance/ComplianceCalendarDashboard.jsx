import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Users, 
  ClipboardCheck,
  LayoutDashboard,
  CheckCircle2,
  X
} from 'lucide-react';
import AdminDashboard from '../admin/AdminDashboard';
import ManagerDashboard from '../manager/ManagerDashboard';
import AuditDashboard from '../audits/AuditDashboard';

export default function ComplianceCalendarDashboard() {
  const { 
    currentRole, 
    auditMatrix, 
    employees, 
    notifications 
  } = useApp();

  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'kpis'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 15)); // Set mock initial date to June 2026 (mock data reference month)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState([]);

  // Aggregate all compliance events
  useEffect(() => {
    const list = [];

    // 1. Audits from state (scheduled date)
    const savedAudits = localStorage.getItem('audit_matrix');
    if (savedAudits) {
      try {
        const matrix = JSON.parse(savedAudits);
        matrix.forEach(row => {
          // Check for planned date in June/July (mock data is set to 2026)
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          months.forEach((mon, mIdx) => {
            const data = row[mon];
            if (data && data.planned) {
              // Extract date, standard format is DD.MM.YY or YYYY-MM-DD
              let dateStr = data.planned;
              let parts = dateStr.split('.');
              let dateObj = null;
              if (parts.length === 3) {
                dateObj = new Date(2000 + parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              } else if (dateStr.includes('-')) {
                dateObj = new Date(dateStr);
              }
              
              if (dateObj && !isNaN(dateObj.getTime())) {
                list.push({
                  id: `audit-${row.category}-${mon}`,
                  title: `${row.category} Audit`,
                  date: dateObj,
                  type: 'audit',
                  status: data.actual ? 'completed' : 'pending',
                  assignedTo: 'EMP-006', // Marcus Vance (Compliance)
                  details: `Scheduled Audit Type: ${row.category}. Status: ${data.actual ? 'Passed with ' + (data.score || 'N/A') : 'Awaiting Audit'}`
                });
              }
            }
          });
        });
      } catch(e) {}
    }

    // 2. Supervisions planned dates
    const savedSupervisions = localStorage.getItem('supervision_matrix');
    if (savedSupervisions) {
      try {
        const matrix = JSON.parse(savedSupervisions);
        matrix.forEach(row => {
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          months.forEach((mon, mIdx) => {
            const data = row[mon];
            if (data && data.planned) {
              let dateStr = data.planned;
              let parts = dateStr.split('.');
              let dateObj = null;
              if (parts.length === 3) {
                dateObj = new Date(2000 + parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              } else if (dateStr.includes('-')) {
                dateObj = new Date(dateStr);
              }

              if (dateObj && !isNaN(dateObj.getTime())) {
                list.push({
                  id: `supervision-${row.employeeId}-${mon}`,
                  title: `Staff Supervision: ${row.name}`,
                  date: dateObj,
                  type: 'supervision',
                  status: data.actual ? 'completed' : 'pending',
                  assignedTo: 'EMP-001', // Sarah Jenkins (Manager)
                  details: `Supervision Check-off. Code: ${data.code || 'S'}. Status: ${data.actual ? 'Conducted on ' + data.actual : 'Scheduled Supervision'}`
                });
              }
            }
          });
        });
      } catch(e) {}
    }

    // 3. DoLS expiries (based on mock refDate 2026-06-15)
    // Arthur Pendelton expiring 2026-07-15, Mary Green expiring 2026-08-15
    list.push({
      id: 'dols-arthur',
      title: 'DoLS Expiry: Arthur Pendelton',
      date: new Date(2026, 6, 15), // July 15, 2026
      type: 'dols',
      status: 'warning',
      assignedTo: 'EMP-006',
      details: 'Deprivation of Liberty Safeguards (DoLS) authorization expires today. Review assessment standard application immediately.'
    });

    list.push({
      id: 'dols-mary',
      title: 'DoLS Expiry: Mary Green',
      date: new Date(2026, 7, 15), // Aug 15, 2026
      type: 'dols',
      status: 'warning',
      assignedTo: 'EMP-006',
      details: 'Deprivation of Liberty Safeguards (DoLS) authorization expires. Prepare renewal request 2 months prior.'
    });

    // 4. Resident document matrix checklist tasks
    const savedMatrix = localStorage.getItem('resident_document_matrix');
    if (savedMatrix) {
      try {
        const matrix = JSON.parse(savedMatrix);
        Object.keys(matrix).forEach(resId => {
          Object.keys(matrix[resId]).forEach(tabId => {
            Object.keys(matrix[resId][tabId]).forEach(mon => {
              const task = matrix[resId][tabId][mon];
              if (task && task.targetDate) {
                const dateObj = new Date(task.targetDate);
                if (!isNaN(dateObj.getTime())) {
                  const resName = resId === 'R1' ? 'Eleanor Vance' : resId === 'R2' ? 'Arthur Pendelton' : resId === 'R3' ? 'Mary Green' : resId === 'R4' ? 'Harold Smith' : 'Mary Berry';
                  const tabLabel = tabId.replace('_', ' ').toUpperCase();
                  list.push({
                    id: `matrix-task-${resId}-${tabId}-${mon}`,
                    title: `Checklist: ${tabLabel} - ${resName}`,
                    date: dateObj,
                    type: 'checklist',
                    status: task.completed ? 'completed' : 'pending',
                    assignedTo: task.assignedTo || 'Unassigned',
                    details: `Resident Compliance Checklist item for ${resName}. Notes: ${task.notes || 'No notes added.'}`
                  });
                }
              }
            });
          });
        });
      } catch(e) {}
    }

    setEventsList(list);
  }, [activeTab]);

  // Calendar logic helpers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Day of week (0-6)
    const numDays = new Date(year, month + 1, 0).getDate(); // Days count

    const days = [];
    // Pad previous month days
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }
    // Present month days
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Pad next month days to complete the 7-column grid rows
    const totalCells = Math.ceil(days.length / 7) * 7;
    const paddingNeeded = totalCells - days.length;
    for (let i = 0; i < paddingNeeded; i++) {
      days.push(null);
    }
    
    return days;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const yearNum = currentDate.getFullYear();
  const monthDays = getDaysInMonth();

  // Find events for specific day
  const getEventsForDay = (date) => {
    if (!date) return [];
    return eventsList.filter(ev => 
      ev.date.getDate() === date.getDate() && 
      ev.date.getMonth() === date.getMonth() && 
      ev.date.getFullYear() === date.getFullYear()
    );
  };

  // Get color for event badges
  const getBadgeClass = (ev) => {
    if (ev.status === 'completed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900/60 dark:text-emerald-400';
    }
    if (ev.type === 'dols' || ev.status === 'warning') {
      return 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-400';
    }
    return 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-400';
  };

  // Render role-specific original dashboard
  const renderOriginalDashboard = () => {
    if (currentRole === 'Admin') return <AdminDashboard />;
    if (currentRole === 'Manager') return <ManagerDashboard />;
    return <AuditDashboard />;
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 dark:border-slate-850 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            <span>Compliance & Audit Master Control</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Aggregated dashboard of all regulatory CQC checks, supervisions, DoLS expiries, and document checklists.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Compliance Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>KPI Dashboard View</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {activeTab === 'kpis' ? (
        <div className="animate-fade-in">{renderOriginalDashboard()}</div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Calendar Header Panel */}
          <div className="glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <h3 className="text-md font-black text-slate-800 dark:text-white whitespace-nowrap w-40 text-center">
                {monthName} {yearNum}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Quick Legend indicators */}
            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-emerald-500 shrink-0" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-amber-500 shrink-0" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-rose-500 shrink-0" />
                <span>Regulatory Expiry</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="glass-card bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-slate-150 dark:border-slate-850 text-center font-black text-[10px] uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/20 py-3.5">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-slate-150 dark:bg-slate-850 min-h-[500px]">
              {monthDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isToday = day && day.getDate() === 15 && day.getMonth() === 5 && day.getFullYear() === 2026; // Highlight refDate June 15, 2026

                return (
                  <div 
                    key={idx} 
                    className={`p-3 space-y-2 flex flex-col justify-start relative transition-colors min-h-[100px] ${
                      day ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/20 dark:bg-slate-900/10'
                    } ${isToday ? 'bg-brand-50/30 dark:bg-brand-950/10 border border-brand-500/50' : ''}`}
                  >
                    {/* Day Number Header */}
                    {day && (
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-black h-6 w-6 flex items-center justify-center rounded-lg ${
                          isToday 
                            ? 'bg-brand-500 text-white shadow-sm font-black' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {day.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[9px] font-black px-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-450 border border-slate-200/50 dark:border-slate-700">
                            {dayEvents.length} Tasks
                          </span>
                        )}
                      </div>
                    )}

                    {/* Day Events list */}
                    {day && (
                      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px] hide-scrollbar select-none">
                        {dayEvents.map(ev => (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`w-full text-left px-2 py-1 text-[9px] rounded-lg border font-bold flex flex-col transition-all hover:scale-[1.02] cursor-pointer truncate ${getBadgeClass(ev)}`}
                          >
                            <span className="truncate">{ev.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Popover Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="glass-card bg-white dark:bg-slate-950 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-850 shadow-2xl overflow-hidden animate-scale-up">
            {/* Popover Header */}
            <div className="p-6 border-b border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedEvent.type.toUpperCase()} EVENT
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                  {selectedEvent.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-550 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popover Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Event Date</span>
                  <p className="font-bold text-slate-800 dark:text-white">
                    {selectedEvent.date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Assigned Staff</span>
                <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>
                    {employees.find(e => e.id === selectedEvent.assignedTo)?.name || selectedEvent.assignedTo}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Details & Scope</span>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 p-3 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400">
                  {selectedEvent.details}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Task Status</span>
                <div className="flex items-center gap-2 mt-1">
                  {selectedEvent.status === 'completed' ? (
                    <span className="px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Compliant</span>
                    </span>
                  ) : selectedEvent.status === 'warning' ? (
                    <span className="px-2.5 py-0.5 rounded-full border border-rose-350 text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Expiries / Risk</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full border border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Awaiting action</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Popover Footer */}
            <div className="p-6 border-t border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-md transition-all text-xs font-bold"
              >
                Close Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
