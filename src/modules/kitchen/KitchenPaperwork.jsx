import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChefHat, 
  Thermometer, 
  CheckSquare, 
  AlertOctagon, 
  BookOpen, 
  Plus, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  Clock, 
  UserCheck 
} from 'lucide-react';

const KitchenPaperwork = () => {
  const { kitchenLogs, setKitchenLogs, currentRole, specialDiets, addSpecialDiet } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('temps'); // 'temps', 'cleaning', 'issues', 'sfbb', 'diets'

  // State for Special Diets form
  const [dietDate, setDietDate] = useState(new Date().toISOString().split('T')[0]);
  const [dietResidentName, setDietResidentName] = useState('');
  const [dietRequirement, setDietRequirement] = useState('');
  const [dietSignedBy, setDietSignedBy] = useState('');
  
  // State for temperature logging forms
  const [tempType, setTempType] = useState('fridge'); // 'fridge', 'oven'
  const [tempDate, setTempDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempTime, setTempTime] = useState('08:00 AM');
  const [tempEquipment, setTempEquipment] = useState('Fridge 1');
  const [tempVal, setTempVal] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [tempSignedBy, setTempSignedBy] = useState('');

  // State for new issue form
  const [issueArea, setIssueArea] = useState('');
  const [issueReason, setIssueReason] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueResponsible, setIssueResponsible] = useState('');
  const [issueTargetDate, setIssueTargetDate] = useState('');
  const [issueSignedBy, setIssueSignedBy] = useState('');

  // State for SFBB form
  const [sfbbDate, setSfbbDate] = useState(new Date().toISOString().split('T')[0]);
  const [sfbbOpeningSign, setSfbbOpeningSign] = useState('');
  const [sfbbClosingSign, setSfbbClosingSign] = useState('');
  const [sfbbComments, setSfbbComments] = useState('');

  // Equipment options based on type
  const equipmentOptions = {
    fridge: ['Fridge 1', 'Fridge 2', 'Freezer 1', 'Freezer 2', 'Milk Fridge'],
    oven: ['Oven', 'Bain Marie (Hot Holding)', 'Cooker 1', 'Reheating Station']
  };

  const handleTempSubmit = (e) => {
    e.preventDefault();
    if (!tempVal || !tempSignedBy) return;

    const newLog = {
      id: `kt-${Date.now()}`,
      date: tempDate,
      time: tempTime,
      equipment: tempEquipment,
      temp: parseFloat(tempVal),
      notes: tempNotes || 'Within range',
      signedBy: tempSignedBy
    };

    setKitchenLogs(prev => ({
      ...prev,
      temperatures: [newLog, ...(prev.temperatures || [])]
    }));

    // Reset fields
    setTempVal('');
    setTempNotes('');
    setTempSignedBy('');
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!issueArea || !issueReason || !issueSignedBy) return;

    const newIssue = {
      id: `ki-${Date.now()}`,
      area: issueArea,
      date: new Date().toISOString().split('T')[0],
      cleaned: 'N',
      reason: issueReason,
      actionRequired: 'Y',
      details: issueDetails,
      responsible: issueResponsible,
      targetDate: issueTargetDate || new Date().toISOString().split('T')[0],
      actualDate: '',
      signature: issueSignedBy,
      managerSign: ''
    };

    setKitchenLogs(prev => ({
      ...prev,
      issues: [newIssue, ...(prev.issues || [])]
    }));

    setIssueArea('');
    setIssueReason('');
    setIssueDetails('');
    setIssueResponsible('');
    setIssueTargetDate('');
    setIssueSignedBy('');
  };

  const handleSfbbSubmit = (e) => {
    e.preventDefault();
    if (!sfbbOpeningSign && !sfbbClosingSign) return;

    const newDiary = {
      id: `kd-${Date.now()}`,
      date: sfbbDate,
      openingSigned: sfbbOpeningSign || '—',
      closingSigned: sfbbClosingSign || '—',
      comments: sfbbComments || 'No issues'
    };

    setKitchenLogs(prev => ({
      ...prev,
      sfbbDiary: [newDiary, ...(prev.sfbbDiary || [])]
    }));

    setSfbbOpeningSign('');
    setSfbbClosingSign('');
    setSfbbComments('');
  };

  const handleDietSubmit = (e) => {
    e.preventDefault();
    if (!dietResidentName || !dietRequirement || !dietSignedBy) return;

    const newDiet = {
      id: `SD-${Date.now()}`,
      date: dietDate,
      residentName: dietResidentName,
      requirement: dietRequirement,
      signedBy: dietSignedBy
    };

    addSpecialDiet(newDiet);

    // Reset
    setDietResidentName('');
    setDietRequirement('');
    setDietSignedBy('');
  };

  const signOffIssue = (id, initials) => {
    setKitchenLogs(prev => ({
      ...prev,
      issues: (prev.issues || []).map(iss => {
        if (iss.id === id) {
          return {
            ...iss,
            actualDate: new Date().toISOString().split('T')[0],
            cleaned: 'Y',
            signature: initials
          };
        }
        return iss;
      })
    }));
  };

  const managerCounterSignIssue = (id, managerName) => {
    setKitchenLogs(prev => ({
      ...prev,
      issues: (prev.issues || []).map(iss => {
        if (iss.id === id) {
          return {
            ...iss,
            managerSign: managerName
          };
        }
        return iss;
      })
    }));
  };

  // Cleaning cell toggle handler
  const handleCleaningCheck = (type, task, dayNum, currentInitials) => {
    const initials = prompt(`Enter initials to sign off day ${dayNum} for "${task}":`, currentInitials || '');
    if (initials === null) return; // cancelled

    setKitchenLogs(prev => {
      const targetObj = type === 'daily' ? 'cleaningDaily' : 'cleaningWeekly';
      const updatedGrid = { ...(prev[targetObj] || {}) };
      
      if (!updatedGrid[task]) {
        updatedGrid[task] = {};
      }
      
      if (initials.trim() === '') {
        delete updatedGrid[task][dayNum];
      } else {
        updatedGrid[task][dayNum] = initials.trim();
      }

      return {
        ...prev,
        [targetObj]: updatedGrid
      };
    });
  };

  // Temperature ranges validation
  const getTempStatus = (equipment, temp) => {
    const isFridge = equipment.toLowerCase().includes('fridge') || equipment.toLowerCase().includes('milk');
    const isFreezer = equipment.toLowerCase().includes('freezer');
    const isOven = equipment.toLowerCase().includes('oven');
    const isHotHolding = equipment.toLowerCase().includes('marie') || equipment.toLowerCase().includes('holding');
    const isReheating = equipment.toLowerCase().includes('reheat');

    if (isFridge) {
      if (temp <= 5) return { status: 'Good', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
      if (temp <= 8) return { status: 'Warning', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' };
      return { status: 'Critical', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' };
    }
    if (isFreezer) {
      if (temp <= -18) return { status: 'Good', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
      return { status: 'Critical', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' };
    }
    if (isOven) {
      if (temp >= 75) return { status: 'Good', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
      return { status: 'Critical', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' };
    }
    if (isHotHolding) {
      if (temp >= 63) return { status: 'Good', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
      return { status: 'Critical', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' };
    }
    if (isReheating) {
      if (temp >= 82) return { status: 'Good', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' };
      return { status: 'Critical', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' };
    }

    return { status: 'Normal', color: 'text-slate-600 bg-slate-50' };
  };

  const dailyTasksList = [
    "Clean & sanitize all food prep worktables",
    "Sweep & wash kitchen floor with heavy duty degreaser",
    "Empty waste bins & wash out bin interiors",
    "Clean & disinfect kitchen handwash basins",
    "Wash and sanitize crockery, cutlery, and kitchen cooking pans",
    "Clear, sanitize and wipe all fridge door handles"
  ];

  const weeklyTasksList = [
    "Deep clean and descale Bain Marie / Hot Holding unit",
    "Empty, defrost and sanitise milk and main fridge shelves",
    "Deep clean cooker hoods & wash mesh filter screens",
    "Wash down and disinfect kitchen wall tiles and seals"
  ];

  // Helper to render days of month header
  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header Overview Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#2e6559]/10 text-[#2e6559] flex items-center justify-center dark:bg-[#3a8273]/10 dark:text-[#3a8273]">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Kitchen Paperwork & Safety Log</h1>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Digitized logs for temperature audits, task schedules, issues trackers and Safer Food Better Business (SFBB) diary.</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('temps')}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeSubTab === 'temps'
                  ? 'bg-[#2e6559] text-white border-[#2e6559]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
              }`}
            >
              <Thermometer className="h-3.5 w-3.5 inline mr-1" /> Temp Logs
            </button>
            <button
              onClick={() => setActiveSubTab('cleaning')}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeSubTab === 'cleaning'
                  ? 'bg-[#2e6559] text-white border-[#2e6559]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5 inline mr-1" /> Cleaning Grid
            </button>
            <button
              onClick={() => setActiveSubTab('issues')}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeSubTab === 'issues'
                  ? 'bg-[#2e6559] text-white border-[#2e6559]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5 inline mr-1" /> Issues & Actions
            </button>
            <button
              onClick={() => setActiveSubTab('sfbb')}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeSubTab === 'sfbb'
                  ? 'bg-[#2e6559] text-white border-[#2e6559]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1" /> SFBB Diary
            </button>
            <button
              onClick={() => setActiveSubTab('diets')}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeSubTab === 'diets'
                  ? 'bg-[#2e6559] text-white border-[#2e6559]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
              }`}
            >
              <ChefHat className="h-3.5 w-3.5 inline mr-1" /> Special Diets
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: TEMPERATURE LOGS */}
      {activeSubTab === 'temps' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800">
              <Thermometer className="h-4.5 w-4.5 text-[#2e6559]" /> Log Kitchen Temperature
            </h3>
            
            <form onSubmit={handleTempSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Log Category</label>
                  <select
                    value={tempType}
                    onChange={(e) => {
                      setTempType(e.target.value);
                      setTempEquipment(equipmentOptions[e.target.value][0]);
                    }}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="fridge">Fridge & Freezer</option>
                    <option value="oven">Cooking & Reheating</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Equipment Item</label>
                  <select
                    value={tempEquipment}
                    onChange={(e) => setTempEquipment(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-800 dark:border-slate-700"
                  >
                    {equipmentOptions[tempType].map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Log Date</label>
                  <input
                    type="date"
                    required
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Log Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM"
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Measured Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder={tempType === 'fridge' ? 'e.g. 3.5' : 'e.g. 78.2'}
                  value={tempVal}
                  onChange={(e) => setTempVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Corrective Action / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Normal, or Adjusted dial if high"
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Signed Off By</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name / Signature"
                  value={tempSignedBy}
                  onChange={(e) => setTempSignedBy(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4" /> Save Temperature Log
              </button>
            </form>
          </div>

          {/* Table Grid */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Temperature History Log</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Critical thresholds: Fridge (≤ 8°C), Freezer (≤ -18°C), Cooked Oven (≥ 75°C), Hot Holding (≥ 63°C), Reheat (≥ 82°C).</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Date/Time</th>
                    <th className="p-3">Equipment</th>
                    <th className="p-3">Temperature</th>
                    <th className="p-3">Alert Status</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                  {(kitchenLogs.temperatures || []).map((item) => {
                    const validation = getTempStatus(item.equipment, item.temp);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-3">
                          <p className="font-bold text-slate-800 dark:text-white">{item.date}</p>
                          <span className="text-[9px] text-slate-400">{item.time}</span>
                        </td>
                        <td className="p-3 font-bold text-brand-600">{item.equipment}</td>
                        <td className="p-3 font-extrabold text-sm">{item.temp}°C</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full border text-[8px] font-extrabold uppercase ${validation.color}`}>
                            {validation.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[10px] max-w-[150px] truncate" title={item.notes}>{item.notes}</td>
                        <td className="p-3 font-bold text-slate-600 dark:text-slate-400">{item.signedBy}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLEANING GRIDS */}
      {activeSubTab === 'cleaning' && (
        <div className="space-y-6">
          {/* Daily Cleaning task grid */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Daily Kitchen Cleaning Checklist Grid</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Click on any box matching the task and day number to log or clear the responsible staff initials.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 dark:border-slate-800 border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[9px] font-bold text-slate-450 uppercase">
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800 min-w-[240px]">Daily Task Details</th>
                    {daysArray.map(day => (
                      <th key={day} className="p-1 text-center border-r border-slate-200 dark:border-slate-800 w-8">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[10px] font-semibold text-slate-700 dark:text-slate-350">
                  {dailyTasksList.map((task) => (
                    <tr key={task} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/30">
                      <td className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">{task}</td>
                      {daysArray.map(day => {
                        const cellVal = kitchenLogs.cleaningDaily?.[task]?.[day] || '';
                        return (
                          <td 
                            key={day}
                            onClick={() => handleCleaningCheck('daily', task, day, cellVal)}
                            className={`p-1 border-r border-slate-200 dark:border-slate-800 text-center cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold select-none ${
                              cellVal ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {cellVal || '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Cleaning task grid */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Weekly Kitchen Deep Cleaning Grid</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Defibrillator, ovens, filters, and hard wall surfaces deep cleans.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 dark:border-slate-800 border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[9px] font-bold text-slate-450 uppercase">
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800 min-w-[240px]">Weekly Task Details</th>
                    {daysArray.map(day => (
                      <th key={day} className="p-1 text-center border-r border-slate-200 dark:border-slate-800 w-8">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[10px] font-semibold text-slate-700 dark:text-slate-350">
                  {weeklyTasksList.map((task) => (
                    <tr key={task} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/30">
                      <td className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">{task}</td>
                      {daysArray.map(day => {
                        const cellVal = kitchenLogs.cleaningWeekly?.[task]?.[day] || '';
                        return (
                          <td 
                            key={day}
                            onClick={() => handleCleaningCheck('weekly', task, day, cellVal)}
                            className={`p-1 border-r border-slate-200 dark:border-slate-800 text-center cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold select-none ${
                              cellVal ? 'bg-[#2e6559]/10 text-[#2e6559] dark:bg-[#3a8273]/10 dark:text-[#3a8273]' : 'text-slate-300'
                            }`}
                          >
                            {cellVal || '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ISSUES & ACTIONS LOG */}
      {activeSubTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Issue Form */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800">
              <AlertOctagon className="h-4.5 w-4.5 text-rose-500" /> Log Deficit / Action Log
            </h3>
            
            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Kitchen Area / Equipment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dishwasher, Handwash sink, Oven area"
                  value={issueArea}
                  onChange={(e) => setIssueArea(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Reason / Defect</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dirty, leaking tap, seal broken"
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Action Details Taken</label>
                <textarea
                  placeholder="Actions taken to clean/resolve"
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Responsible Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Cook"
                    value={issueResponsible}
                    onChange={(e) => setIssueResponsible(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Target Resolution Date</label>
                  <input
                    type="date"
                    value={issueTargetDate}
                    onChange={(e) => setIssueTargetDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Reported By (Initials)</label>
                <input
                  type="text"
                  required
                  placeholder="Your Initials"
                  value={issueSignedBy}
                  onChange={(e) => setIssueSignedBy(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4" /> Report Issue Deficit
              </button>
            </form>
          </div>

          {/* Issues list */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Exceptions, Issues & Action Plan Log</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Logs all kitchen cleaning deficits, required maintenance, staff initials and manager counter-signatures.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Area / Date</th>
                    <th className="p-3">Defect</th>
                    <th className="p-3">Action Details</th>
                    <th className="p-3">Assigned / Target</th>
                    <th className="p-3">Resolution Signature</th>
                    <th className="p-3 text-right">Counter Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                  {(kitchenLogs.issues || []).map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-3">
                          <p className="font-bold text-slate-800 dark:text-white">{item.area}</p>
                          <span className="text-[9px] text-slate-450 block">{item.date}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[8px] bg-rose-50 text-rose-600 font-extrabold uppercase mr-1">Deficit</span>
                          <span className="text-slate-850 dark:text-slate-200">{item.reason}</span>
                        </td>
                        <td className="p-3 text-[10px] text-slate-500 max-w-[140px] truncate" title={item.details}>
                          {item.details || 'Pending resolution'}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-700 dark:text-slate-350">{item.responsible || 'Staff'}</p>
                          <span className="text-[9px] text-slate-450 block">Target: {item.targetDate}</span>
                        </td>
                        <td className="p-3">
                          {item.actualDate ? (
                            <div>
                              <span className="text-emerald-600 font-bold">Resolved {item.actualDate}</span>
                              <span className="text-[9px] text-slate-450 block">Signed: {item.signature}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const initial = prompt('Enter initials to sign off resolution:');
                                if (initial) signOffIssue(item.id, initial);
                              }}
                              className="h-6 px-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px]"
                            >
                              Sign Off
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {item.managerSign ? (
                            <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">
                              ✓ {item.managerSign}
                            </span>
                          ) : (currentRole === 'Admin' || currentRole === 'Manager') ? (
                            <button
                              onClick={() => {
                                const mgrName = prompt('Enter manager name to countersign:', 'Sarah Jenkins');
                                if (mgrName) managerCounterSignIssue(item.id, mgrName);
                              }}
                              className="h-6 px-2 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 text-[9px] font-bold"
                            >
                              Counter Sign
                            </button>
                          ) : (
                            <span className="text-[9px] text-slate-400">Pending Manager</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SFBB DAILY DIARY */}
      {activeSubTab === 'sfbb' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diary Form */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800">
              <BookOpen className="h-4.5 w-4.5 text-[#2e6559]" /> Log SFBB Daily Checks
            </h3>
            
            <form onSubmit={handleSfbbSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Diary Entry Date</label>
                <input
                  type="date"
                  required
                  value={sfbbDate}
                  onChange={(e) => setSfbbDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Opening Checks Signed By</label>
                <input
                  type="text"
                  placeholder="e.g. Carol Cook (Opening)"
                  value={sfbbOpeningSign}
                  onChange={(e) => setSfbbOpeningSign(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Closing Checks Signed By</label>
                <input
                  type="text"
                  placeholder="e.g. Carol Cook (Closing)"
                  value={sfbbClosingSign}
                  onChange={(e) => setSfbbClosingSign(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Daily Comments / Deficits Found</label>
                <textarea
                  placeholder="Write any food deliveries, special cleanups, or exceptions here..."
                  value={sfbbComments}
                  onChange={(e) => setSfbbComments(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4" /> Save Diary Entry
              </button>
            </form>
          </div>

          {/* Diary Log List */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Safer Food Better Business Diary Logs</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Verification record validating opening and closing safety checks under FSA standards.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Diary Date</th>
                    <th className="p-3">Opening Checks Sign-off</th>
                    <th className="p-3">Closing Checks Sign-off</th>
                    <th className="p-3">Comments / Exceptions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                  {(kitchenLogs.sfbbDiary || []).map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-3 font-bold text-[#2e6559]">{item.date}</td>
                        <td className="p-3">
                          <span className="text-emerald-700 font-bold">✓ Signed</span>
                          <span className="text-[9px] text-slate-450 block">{item.openingSigned}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-emerald-700 font-bold">✓ Signed</span>
                          <span className="text-[9px] text-slate-450 block">{item.closingSigned}</span>
                        </td>
                        <td className="p-3 text-[10px] text-slate-500 max-w-[200px] truncate" title={item.comments}>
                          {item.comments}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SPECIAL DIETS RECORD */}
      {activeSubTab === 'diets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-3 border-slate-100 dark:border-slate-800">
              <ChefHat className="h-4.5 w-4.5 text-[#2e6559]" /> Log Special Diet Requirement
            </h3>
            
            <form onSubmit={handleDietSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Date Agreed</label>
                <input
                  type="date"
                  required
                  value={dietDate}
                  onChange={(e) => setDietDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Name of Service User</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arthur Pendelton"
                  value={dietResidentName}
                  onChange={(e) => setDietResidentName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Special Dietary Requirement Details</label>
                <textarea
                  required
                  placeholder="e.g. Pureed diet, thickened fluids, diabetic, food allergies, etc."
                  value={dietRequirement}
                  onChange={(e) => setDietRequirement(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold dark:bg-slate-850 dark:border-slate-800 h-24"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Signed by Cook as Agreed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas McGregor"
                  value={dietSignedBy}
                  onChange={(e) => setDietSignedBy(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10 active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4" /> Save Diet Record
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Resident Special Dietary Requirements</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Official register for kitchen staff to check and prepare specialized menus for service users.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Date</th>
                    <th className="p-3">Resident</th>
                    <th className="p-3">Dietary Requirements & Details</th>
                    <th className="p-3">Cook Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                  {(specialDiets || []).map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-3 font-bold text-slate-500">{item.date}</td>
                        <td className="p-3 font-bold text-[#2e6559] dark:text-[#3a8273]">{item.residentName}</td>
                        <td className="p-3 text-[10px] text-slate-650 dark:text-slate-300 max-w-[280px] whitespace-pre-wrap">{item.requirement}</td>
                        <td className="p-3">
                          <span className="text-emerald-700 bg-emerald-550/10 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase inline-flex items-center gap-1">
                            ✓ {item.signedBy}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {(!specialDiets || specialDiets.length === 0) && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-slate-400">No special diet records registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenPaperwork;
