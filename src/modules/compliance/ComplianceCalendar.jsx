import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Clock, Plus, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ComplianceCalendar = () => {
  const { currentRole } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026

  const complianceEvents = [
    { day: 1, title: 'Weekly zone fire alarm tests', status: 'Compliant' },
    { day: 2, title: 'Check Medication fridge temp logs', status: 'Compliant' },
    { day: 6, title: 'Review 3 resident MUST assessments', status: 'Compliant' },
    { day: 8, title: 'Weekly zone fire alarm tests', status: 'Compliant' },
    { day: 10, title: 'Domestic cleaning audit validation', status: 'Compliant' },
    { day: 15, title: 'Weekly zone fire alarm tests', status: 'Compliant' },
    { day: 20, title: 'Quarterly fire drill simulation', status: 'Pending' },
    { day: 22, title: 'Weekly zone fire alarm tests', status: 'Pending' },
    { day: 28, title: 'Monthly emergency lighting checks', status: 'Pending' }
  ];

  // Helper to generate days in a month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDay = new Date(year, month, 1).getDay(); // day of week
    const numDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for starting day
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= numDays; d++) {
      days.push(d);
    }
    return days;
  };

  const daysGrid = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-350" />
            Compliance Task Calendar
          </h1>
          <p className="mt-1 text-sm text-blue-100 font-medium">
            Monthly schedule board for safety checks, audits, mock drills, and regulatory deadlines.
          </p>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        {/* Month Navigation */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-850 dark:text-white uppercase tracking-wider">
            {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {daysGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-28 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-100 dark:border-slate-900/60" />;
            }

            const dayEvents = complianceEvents.filter(e => e.day === day);

            return (
              <div key={`day-${day}`} className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
                <span className="text-xs font-black text-slate-400 font-mono">{day}</span>
                
                <div className="flex-1 mt-1.5 overflow-y-auto space-y-1 scrollbar-none">
                  {dayEvents.map((evt, eIdx) => (
                    <div 
                      key={eIdx} 
                      className={`p-1 rounded text-[9px] font-bold leading-tight border transition-colors cursor-help
                        ${evt.status === 'Compliant' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-955/20 dark:text-amber-400'}`}
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar;
