import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Scale, Users, Info, Settings, AlertCircle, Save, CheckCircle, ChevronRight, Calculator, Plus, Trash } from 'lucide-react';

const SHIFT_HOURS = {
  early: 6,
  late: 6,
  night: 12
};

const CATEGORY_NAMES = {
  oneToOne: '1:1 Support',
  eating: 'Eating/drinking',
  communication: 'Communication',
  social: 'Social/Activities/Family Support',
  mobility: 'Moving & transferring',
  emotional: 'Emotional Psychological',
  personalCare: 'Personal Care (Bathing/Shower)',
  behavioural: 'Positive Behaviour Support',
  medication: 'Medication Support'
};

const DependencyTool = () => {
  const { dependencyLogs, setDependencyLogs, employees } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'baseline' | 'additional' | 'guidance' | 'peeps'
  const [peepsLogs, setPeepsLogs] = useState(() => {
    const saved = localStorage.getItem('care_peeps_logs');
    return saved ? JSON.parse(saved) : [
      { name: 'Margaret Smith', priority: 'High', assistance: '2-Staff Assistance', status: 'Compliant' },
      { name: 'Arthur Pendelton', priority: 'Medium', assistance: '1-Staff Assistance', status: 'Compliant' },
      { name: 'Margaret Atwood', priority: 'Low', assistance: 'Self-Evacuate', status: 'Compliant' },
      { name: 'John Miller', priority: 'High', assistance: 'Hoist / Sling Needed', status: 'Compliant' }
    ];
  });
  
  // Local states for month configuration
  const [monthData, setMonthData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load data for selected month
  useEffect(() => {
    if (dependencyLogs && dependencyLogs.months && dependencyLogs.months[selectedMonth]) {
      setMonthData(JSON.parse(JSON.stringify(dependencyLogs.months[selectedMonth])));
    } else {
      // Create empty month data if not found
      setMonthData({
        ragLowMin: 0,
        ragLowMax: 5,
        ragMedMin: 6,
        ragMedMax: 10,
        ragHighMin: 11,
        ragHighMax: 15,
        residents: [
          { name: 'Margaret Smith', baseline: 2, needs: createEmptyNeeds() },
          { name: 'Arthur Pendelton', baseline: 3, needs: createEmptyNeeds() },
          { name: 'Margaret Atwood', baseline: 1, needs: createEmptyNeeds() },
          { name: 'John Miller', baseline: 4, needs: createEmptyNeeds() }
        ],
        otherConsiderations: '',
        additionalHours: { early: 0, late: 0, night: 0 },
        rosteredHours: { early: 12, late: 12, night: 24 }
      });
    }
  }, [selectedMonth, dependencyLogs]);

  function createEmptyNeeds() {
    const empty = {};
    Object.keys(CATEGORY_NAMES).forEach(cat => {
      empty[cat] = { early: 0, late: 0, night: 0 };
    });
    return empty;
  }

  if (!monthData) return <div className="p-8 text-center text-slate-500">Loading dependency tool...</div>;

  // Handler for cell input change (additional support minutes)
  const handleCellChange = (resIndex, category, shift, value) => {
    const numVal = Math.max(0, parseInt(value) || 0);
    const updated = { ...monthData };
    updated.residents[resIndex].needs[category][shift] = numVal;
    setMonthData(updated);
    setIsSaved(false);
  };

  // Handler for baseline assessment score change
  const handleBaselineChange = (resIndex, score) => {
    const updated = { ...monthData };
    updated.residents[resIndex].baseline = parseInt(score) || 1;
    setMonthData(updated);
    setIsSaved(false);
  };

  // Handler for resident name change
  const handleNameChange = (resIndex, name) => {
    const updated = { ...monthData };
    updated.residents[resIndex].name = name;
    setMonthData(updated);
    setIsSaved(false);
  };

  // Add new resident row
  const addResidentRow = () => {
    const updated = { ...monthData };
    updated.residents.push({
      name: '',
      baseline: 1,
      needs: createEmptyNeeds()
    });
    setMonthData(updated);
    setIsSaved(false);
  };

  // Delete resident row
  const removeResidentRow = (index) => {
    const updated = { ...monthData };
    updated.residents.splice(index, 1);
    setMonthData(updated);
    setIsSaved(false);
  };

  // Save changes to global context and localStorage
  const saveChanges = () => {
    const updatedLogs = { ...dependencyLogs };
    if (!updatedLogs.months) updatedLogs.months = {};
    updatedLogs.months[selectedMonth] = monthData;
    setDependencyLogs(updatedLogs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Calculations for each resident
  const calculateResidentRow = (res) => {
    const baselineMins = (res.baseline || 1) * 60;
    const baselinePerShift = baselineMins / 3; // 20, 40, 60, 80 mins respectively
    
    let earlyAddMins = 0;
    let lateAddMins = 0;
    let nightAddMins = 0;

    Object.values(res.needs).forEach(need => {
      earlyAddMins += Number(need.early || 0);
      lateAddMins += Number(need.late || 0);
      nightAddMins += Number(need.night || 0);
    });

    const earlyTotalMins = earlyAddMins + baselinePerShift;
    const lateTotalMins = lateAddMins + baselinePerShift;
    const nightTotalMins = nightAddMins + baselinePerShift;
    
    const totalMins24 = earlyTotalMins + lateTotalMins + nightTotalMins;

    return {
      earlyMins: earlyTotalMins,
      earlyHrs: earlyTotalMins / 60,
      lateMins: lateTotalMins,
      lateHrs: lateTotalMins / 60,
      nightMins: nightTotalMins,
      nightHrs: nightTotalMins / 60,
      totalMins: totalMins24,
      totalHrs: totalMins24 / 60
    };
  };

  // Perform computations for all residents
  const calculatedRows = monthData.residents.map(res => calculateResidentRow(res));

  // Sum calculations for the whole service
  const sumTotalHrs = calculatedRows.reduce((a, b) => a + b.totalHrs, 0);
  const sumEarlyHrs = calculatedRows.reduce((a, b) => a + b.earlyHrs, 0);
  const sumLateHrs = calculatedRows.reduce((a, b) => a + b.lateHrs, 0);
  const sumNightHrs = calculatedRows.reduce((a, b) => a + b.nightHrs, 0);

  // Baseline category counts
  const baselineCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  monthData.residents.forEach(res => {
    if (res.name.trim() !== '') {
      baselineCounts[res.baseline] = (baselineCounts[res.baseline] || 0) + 1;
    }
  });

  // Other considerations additional staff hours
  const addHours = monthData.additionalHours || { early: 0, late: 0, night: 0 };
  const addHoursTotal = Number(addHours.early || 0) + Number(addHours.late || 0) + Number(addHours.night || 0);

  // Total required shift hours (Dependency + Other Considerations)
  const reqEarlyHrs = sumEarlyHrs + Number(addHours.early || 0);
  const reqLateHrs = sumLateHrs + Number(addHours.late || 0);
  const reqNightHrs = sumNightHrs + Number(addHours.night || 0);
  const reqTotalHrs = sumTotalHrs + addHoursTotal;

  // Rostered staff hours
  const rostHours = monthData.rosteredHours || { early: 0, late: 0, night: 0 };
  const rostTotalHrs = Number(rostHours.early || 0) + Number(rostHours.late || 0) + Number(rostHours.night || 0);

  // Number of staff per shift
  const earlyStaffCount = Number(rostHours.early || 0) / SHIFT_HOURS.early;
  const lateStaffCount = Number(rostHours.late || 0) / SHIFT_HOURS.late;
  const nightStaffCount = Number(rostHours.night || 0) / SHIFT_HOURS.night;
  const totalStaffCount = earlyStaffCount + lateStaffCount + nightStaffCount;

  // Ratios (Adults / Staff)
  const activeAdults = monthData.residents.filter(r => r.name.trim() !== '').length;
  const earlyRatio = earlyStaffCount > 0 ? (activeAdults / earlyStaffCount).toFixed(1) : '0';
  const lateRatio = lateStaffCount > 0 ? (activeAdults / lateStaffCount).toFixed(1) : '0';
  const nightRatio = nightStaffCount > 0 ? (activeAdults / nightStaffCount).toFixed(1) : '0';
  const totalRatio = totalStaffCount > 0 ? (activeAdults / totalStaffCount).toFixed(1) : '0';

  // RAG Color Helper
  const getRagClass = (val) => {
    if (val === 0) return 'bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-600';
    if (val >= monthData.ragLowMin && val <= monthData.ragLowMax) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40';
    }
    if (val >= monthData.ragMedMin && val <= monthData.ragMedMax) {
      return 'bg-amber-50 text-amber-850 border-amber-200 dark:bg-amber-955/20 dark:text-amber-300 dark:border-amber-900/40';
    }
    if (val >= monthData.ragHighMin) {
      return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-955/20 dark:text-rose-300 dark:border-rose-900/40';
    }
    return 'bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
  };

  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-6 w-6 text-[#2e6559] dark:text-[#3a8273]" />
            <span>Staffing Dependency Tool</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate safe staffing levels and care ratios based on resident baseline needs and additional clinical minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setIsSaved(false);
            }}
            className="h-10 px-4 rounded-xl border border-slate-250 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#2e6559] dark:bg-slate-800 dark:border-slate-700 dark:text-white cursor-pointer"
          >
            {monthsList.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Save Button */}
          <button
            onClick={saveChanges}
            className={`h-10 px-5 rounded-xl text-white font-bold transition-all shadow-sm flex items-center gap-2 ${
              isSaved 
                ? 'bg-emerald-600 hover:bg-emerald-500' 
                : 'bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] dark:hover:bg-[#2e6559]'
            }`}
          >
            {isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save Matrix'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'calculator'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Dependency Calculator
        </button>
        <button
          onClick={() => setActiveTab('baseline')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'baseline'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Baseline Assessment Scale
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'additional'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Additional Needs Prompts
        </button>
        <button
          onClick={() => setActiveTab('guidance')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'guidance'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Spreadsheet Guidance
        </button>
        <button
          onClick={() => setActiveTab('peeps')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'peeps'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          PEEPs & First Aid Audit
        </button>
      </div>

      {/* Tab content 1: Dependency Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Configuration and Setup cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Baseline Totals count cards */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-600" />
                <span>Baseline Score Totals</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 flex items-center justify-between">
                  <span className="font-semibold text-slate-500">1: Self-Caring</span>
                  <span className="font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{baselineCounts[1] || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 flex items-center justify-between">
                  <span className="font-semibold text-slate-500">2: Low</span>
                  <span className="font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{baselineCounts[2] || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 flex items-center justify-between">
                  <span className="font-semibold text-slate-500">3: Medium</span>
                  <span className="font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{baselineCounts[3] || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 flex items-center justify-between">
                  <span className="font-semibold text-slate-500">4: High</span>
                  <span className="font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{baselineCounts[4] || 0}</span>
                </div>
              </div>
            </div>

            {/* Editable RAG parameters */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-brand-600" />
                <span>Needs RAG Limits (Mins)</span>
              </h2>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-600 flex items-center gap-1">🟢 Low Limit</span>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      value={monthData.ragLowMin}
                      onChange={(e) => {
                        const updated = { ...monthData };
                        updated.ragLowMin = parseInt(e.target.value) || 0;
                        setMonthData(updated);
                      }}
                      className="w-12 h-8 border rounded-lg text-center dark:bg-slate-850 dark:border-slate-800"
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      value={monthData.ragLowMax}
                      onChange={(e) => {
                        const updated = { ...monthData };
                        updated.ragLowMax = parseInt(e.target.value) || 0;
                        setMonthData(updated);
                      }}
                      className="w-12 h-8 border rounded-lg text-center dark:bg-slate-850 dark:border-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-amber-600 flex items-center gap-1">🟡 Med Limit</span>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      value={monthData.ragMedMin}
                      onChange={(e) => {
                        const updated = { ...monthData };
                        updated.ragMedMin = parseInt(e.target.value) || 0;
                        setMonthData(updated);
                      }}
                      className="w-12 h-8 border rounded-lg text-center dark:bg-slate-850 dark:border-slate-800"
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      value={monthData.ragMedMax}
                      onChange={(e) => {
                        const updated = { ...monthData };
                        updated.ragMedMax = parseInt(e.target.value) || 0;
                        setMonthData(updated);
                      }}
                      className="w-12 h-8 border rounded-lg text-center dark:bg-slate-850 dark:border-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-rose-600 flex items-center gap-1">🔴 High Limit</span>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      value={monthData.ragHighMin}
                      onChange={(e) => {
                        const updated = { ...monthData };
                        updated.ragHighMin = parseInt(e.target.value) || 0;
                        setMonthData(updated);
                      }}
                      className="w-12 h-8 border rounded-lg text-center dark:bg-slate-850 dark:border-slate-800"
                    />
                    <span>+</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">These boundaries define colors for additional needs inputs.</p>
            </div>

            {/* Quick Status / Validation summary */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  <span>Staffing Adequacy Check</span>
                </h2>
                <div className="mt-3 text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Total Hours Required:</span>
                    <span className="text-slate-850 dark:text-white">{reqTotalHrs.toFixed(1)} hrs</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Rostered Hours Entered:</span>
                    <span className="text-slate-850 dark:text-white">{rostTotalHrs.toFixed(1)} hrs</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {rostTotalHrs >= reqTotalHrs ? (
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 justify-center">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>Roster is Safely Staffed</span>
                  </div>
                ) : (
                  <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-955/20 dark:text-rose-300 dark:border-rose-900/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 justify-center">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Staff Shortage: { (reqTotalHrs - rostTotalHrs).toFixed(1) } hrs under!</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Interactive Calculator Matrix */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Supported Adults Dependency Ledger</span>
              <button
                onClick={addResidentRow}
                className="h-8 px-3 rounded-lg bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Adult Row</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  {/* Row 1: Category Names */}
                  <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold text-center select-none">
                    <th className="p-2 border-r dark:border-slate-800 text-left min-w-[150px]" rowSpan={2}>Supported Adult's Name</th>
                    <th className="p-2 border-r dark:border-slate-800 min-w-[100px]" rowSpan={2}>Baseline Assessment Score</th>
                    {Object.values(CATEGORY_NAMES).map((catName, idx) => (
                      <th key={idx} className="p-2 border-r dark:border-slate-800" colSpan={3}>{catName}</th>
                    ))}
                    <th className="p-2 border-r dark:border-slate-800 min-w-[70px]" rowSpan={2}>Total Mins over 24h</th>
                    <th className="p-2 border-r dark:border-slate-800 min-w-[70px]" rowSpan={2}>Actual Contact Hrs</th>
                    <th className="p-2 border-r dark:border-slate-800 min-w-[70px]" colSpan={2}>Early Shift</th>
                    <th className="p-2 border-r dark:border-slate-800 min-w-[70px]" colSpan={2}>Late Shift</th>
                    <th className="p-2 border-r dark:border-slate-800 min-w-[70px]" colSpan={2}>Night Shift</th>
                    <th className="p-2 min-w-[50px]" rowSpan={2}>Actions</th>
                  </tr>
                  {/* Row 2: Early, Late, Night Columns */}
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold text-center select-none">
                    {Object.keys(CATEGORY_NAMES).map((_, idx) => (
                      <React.Fragment key={idx}>
                        <th className="p-1 border-r border-slate-150 dark:border-slate-850 w-8">E</th>
                        <th className="p-1 border-r border-slate-150 dark:border-slate-850 w-8">L</th>
                        <th className="p-1 border-r dark:border-slate-800 w-8">N</th>
                      </React.Fragment>
                    ))}
                    <th className="p-1 border-r border-slate-150 dark:border-slate-850 w-8">Mins</th>
                    <th className="p-1 border-r dark:border-slate-800 w-8">Hrs</th>
                    <th className="p-1 border-r border-slate-150 dark:border-slate-850 w-8">Mins</th>
                    <th className="p-1 border-r dark:border-slate-800 w-8">Hrs</th>
                    <th className="p-1 border-r border-slate-150 dark:border-slate-850 w-8">Mins</th>
                    <th className="p-1 dark:border-slate-800 w-8">Hrs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                  {monthData.residents.map((res, resIndex) => {
                    const rowCalc = calculatedRows[resIndex];
                    return (
                      <tr key={resIndex} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        
                        {/* Name Input */}
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850">
                          <input 
                            type="text"
                            value={res.name}
                            onChange={(e) => handleNameChange(resIndex, e.target.value)}
                            placeholder="Enter name..."
                            className="w-full bg-transparent px-1 py-0.5 font-bold outline-none border border-transparent focus:border-brand-500 rounded-md dark:text-white"
                          />
                        </td>

                        {/* Baseline Score Dropdown */}
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center">
                          <select
                            value={res.baseline}
                            onChange={(e) => handleBaselineChange(resIndex, e.target.value)}
                            className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 outline-none font-bold text-slate-800 dark:text-white dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
                          >
                            <option value={1}>1 - Self-Caring</option>
                            <option value={2}>2 - Low</option>
                            <option value={3}>3 - Medium</option>
                            <option value={4}>4 - High</option>
                          </select>
                        </td>

                        {/* Additional Needs Inputs */}
                        {Object.keys(CATEGORY_NAMES).map((cat, catIdx) => (
                          <React.Fragment key={catIdx}>
                            <td className={`p-1 border-r border-slate-150 dark:border-slate-850 text-center ${getRagClass(res.needs[cat].early)}`}>
                              <input 
                                type="text"
                                value={res.needs[cat].early === 0 ? '' : res.needs[cat].early}
                                onChange={(e) => handleCellChange(resIndex, cat, 'early', e.target.value)}
                                className="w-full bg-transparent text-center font-bold outline-none"
                                placeholder="0"
                              />
                            </td>
                            <td className={`p-1 border-r border-slate-150 dark:border-slate-850 text-center ${getRagClass(res.needs[cat].late)}`}>
                              <input 
                                type="text"
                                value={res.needs[cat].late === 0 ? '' : res.needs[cat].late}
                                onChange={(e) => handleCellChange(resIndex, cat, 'late', e.target.value)}
                                className="w-full bg-transparent text-center font-bold outline-none"
                                placeholder="0"
                              />
                            </td>
                            <td className={`p-1 border-r border-slate-205 dark:border-slate-805 text-center ${getRagClass(res.needs[cat].night)}`}>
                              <input 
                                type="text"
                                value={res.needs[cat].night === 0 ? '' : res.needs[cat].night}
                                onChange={(e) => handleCellChange(resIndex, cat, 'night', e.target.value)}
                                className="w-full bg-transparent text-center font-bold outline-none"
                                placeholder="0"
                              />
                            </td>
                          </React.Fragment>
                        ))}

                        {/* Calculations output columns */}
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">{rowCalc.totalMins}</td>
                        <td className="p-2 border-r border-slate-205 dark:border-slate-805 text-center font-black text-slate-900 bg-slate-50/50 dark:text-white dark:bg-slate-950/20">{rowCalc.totalHrs.toFixed(1)}</td>
                        
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">{rowCalc.earlyMins.toFixed(0)}</td>
                        <td className="p-2 border-r border-slate-205 dark:border-slate-805 text-center font-black text-slate-900 bg-slate-50/50 dark:text-white dark:bg-slate-950/20">{rowCalc.earlyHrs.toFixed(1)}</td>
                        
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">{rowCalc.lateMins.toFixed(0)}</td>
                        <td className="p-2 border-r border-slate-205 dark:border-slate-805 text-center font-black text-slate-900 bg-slate-50/50 dark:text-white dark:bg-slate-950/20">{rowCalc.lateHrs.toFixed(1)}</td>
                        
                        <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">{rowCalc.nightMins.toFixed(0)}</td>
                        <td className="p-2 border-r border-slate-205 dark:border-slate-805 text-center font-black text-slate-900 bg-slate-50/50 dark:text-white dark:bg-slate-950/20">{rowCalc.nightHrs.toFixed(1)}</td>

                        {/* Actions */}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeResidentRow(resIndex)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                            title="Delete resident row"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                  {/* Summary Rows (Spreadsheet bottom totals) */}
                  
                  {/* Row A: Dependency Contact Time (Hours) Totals */}
                  <tr className="bg-slate-50 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 select-none">
                    <td className="p-2.5 font-extrabold text-slate-800 dark:text-white text-left" colSpan={2}>
                      Dependency Contact Time Totals
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/10">Total Mins</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-extrabold text-indigo-700 bg-indigo-50/30 dark:text-indigo-400 dark:bg-indigo-950/10">
                      {(sumTotalHrs * 60).toFixed(0)}m
                    </td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/5 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {sumEarlyHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/5 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {sumLateHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/5 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {sumNightHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                  {/* Row B: Additional Staff Required due to Other Considerations */}
                  <tr className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <td className="p-2.5 font-extrabold text-slate-800 dark:text-white text-left" colSpan={2}>
                      Other Considerations (Add. Hours)
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800 text-left p-1 text-[9px] text-slate-400 font-semibold italic">
                      e.g. environment layout, security issues, escort requirements
                    </td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900">24-Hr Tot</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-extrabold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900">
                      {addHoursTotal.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-amber-50/20 dark:bg-amber-955/5">
                      <input 
                        type="number"
                        value={addHours.early === 0 ? '' : addHours.early}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.additionalHours.early = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 border-r dark:border-slate-800 bg-amber-50/20 dark:bg-amber-955/5">
                      <input 
                        type="number"
                        value={addHours.late === 0 ? '' : addHours.late}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.additionalHours.late = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 border-r dark:border-slate-800 bg-amber-50/20 dark:bg-amber-955/5">
                      <input 
                        type="number"
                        value={addHours.night === 0 ? '' : addHours.night}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.additionalHours.night = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                  {/* Row C: Dependency + Other Considerations Total */}
                  <tr className="bg-slate-100 dark:bg-slate-900 border-t border-slate-250 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <td className="p-2.5 font-black text-slate-900 dark:text-white text-left" colSpan={2}>
                      Dependency + Considerations Total (Req. Hours)
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20">Grand Tot</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20">
                      {reqTotalHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/10 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {reqEarlyHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/10 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {reqLateHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-[#2e6559]/10 font-black text-[#2e6559] dark:text-[#3a8273]">
                      {reqNightHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                  {/* Row D: Rostered Staff Hours */}
                  <tr className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <td className="p-2.5 font-extrabold text-slate-800 dark:text-white text-left" colSpan={2}>
                      Rostered Staff Hours (Not Inc. Manager)
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900">Rost Tot</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900">
                      {rostTotalHrs.toFixed(1)}h
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-955/5">
                      <input 
                        type="number"
                        value={rostHours.early === 0 ? '' : rostHours.early}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.rosteredHours.early = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 border-r dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-955/5">
                      <input 
                        type="number"
                        value={rostHours.late === 0 ? '' : rostHours.late}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.rosteredHours.late = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 border-r dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-955/5">
                      <input 
                        type="number"
                        value={rostHours.night === 0 ? '' : rostHours.night}
                        onChange={(e) => {
                          const updated = { ...monthData };
                          updated.rosteredHours.night = Math.max(0, parseFloat(e.target.value) || 0);
                          setMonthData(updated);
                          setIsSaved(false);
                        }}
                        placeholder="0"
                        className="w-10 bg-transparent text-center font-black outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                      />
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                  {/* Row E: Number of Care Staff Per Shift */}
                  <tr className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 select-none">
                    <td className="p-2.5 font-extrabold text-slate-800 dark:text-white text-left" colSpan={2}>
                      Number of Care Staff Per Shift
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900">Staff Tot</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-extrabold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900">
                      {totalStaffCount.toFixed(1)}
                    </td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900 font-black">
                      {earlyStaffCount.toFixed(1)}
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900 font-black">
                      {lateStaffCount.toFixed(1)}
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900 font-black">
                      {nightStaffCount.toFixed(1)}
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                  {/* Row F: Ratios */}
                  <tr className="bg-slate-100 dark:bg-slate-900 border-t border-slate-250 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 select-none">
                    <td className="p-2.5 font-black text-slate-950 dark:text-white text-left" colSpan={2}>
                      Staff-to-Adult Ratio (Staff : Adults)
                    </td>
                    <td colSpan={27} className="border-r dark:border-slate-800"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 bg-slate-200 dark:bg-slate-950 font-bold">Total Adults</td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-950">
                      {activeAdults}
                    </td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-[#2e6559] dark:text-[#3a8273] bg-[#2e6559]/5">
                      1 : {earlyRatio}
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-[#2e6559] dark:text-[#3a8273] bg-[#2e6559]/5">
                      1 : {lateRatio}
                    </td>
                    <td className="p-2 border-r dark:border-slate-800 bg-slate-100 dark:bg-slate-900"></td>
                    <td className="p-2 text-center border-r dark:border-slate-800 font-black text-[#2e6559] dark:text-[#3a8273] bg-[#2e6559]/5">
                      1 : {nightRatio}
                    </td>
                    <td className="p-2 bg-slate-100 dark:bg-slate-900"></td>
                    <td></td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Other considerations free-text notes */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Other Considerations Justification Notes
              </label>
              <textarea
                value={monthData.otherConsiderations}
                onChange={(e) => {
                  const updated = { ...monthData };
                  updated.otherConsiderations = e.target.value;
                  setMonthData(updated);
                  setIsSaved(false);
                }}
                placeholder="Log layout factors, safety issues, patient escorts, or environmental factors that require additional hours..."
                className="w-full min-h-[80px] p-3 text-xs font-semibold bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl outline-none focus:ring-2 focus:ring-[#2e6559] dark:text-white"
              />
            </div>

          </div>

        </div>
      )}

      {/* Tab content 2: Baseline Assessment Scale */}
      {activeTab === 'baseline' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-fade-in text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Baseline Assessment Categories</h2>
            <p className="text-slate-500 mt-0.5">Use this key to determine the Baseline Assessment Score (1 to 4) for each resident.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Self-Caring */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5 dark:border-slate-800">
                <span className="font-extrabold text-sm text-[#2e6559] dark:text-[#3a8273]">Category 1: Self-Caring</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">Score 1</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <li>Is fully continent of bowel and urine.</li>
                <li>Does not require assistance or reminders to visit the toilet.</li>
                <li>Can feed themselves completely without help.</li>
                <li>Can wash and bathe themselves independently.</li>
                <li>Can walk without assistance (may use a basic walking stick).</li>
                <li>Can manage own personal affairs and make needs known.</li>
              </ul>
            </div>

            {/* Low Needs */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5 dark:border-slate-800">
                <span className="font-extrabold text-sm text-blue-600">Category 2: Low Needs</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px]">Score 2</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <li>Continent but may have occasional accidents.</li>
                <li>Can usually manage toilet but may need assistance with clothing or wiping.</li>
                <li>Can feed themselves.</li>
                <li>May need supervision or minor assistance with washing/bathing.</li>
                <li>May need supervision or assistance with dressing.</li>
                <li>Walks with support of a frame or requires occasional help.</li>
                <li>Can make needs known.</li>
              </ul>
            </div>

            {/* Medium Needs */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5 dark:border-slate-800">
                <span className="font-extrabold text-sm text-amber-600">Category 3: Medium Needs</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-[10px]">Score 3</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <li>Is occasionally incontinent.</li>
                <li>Requires regular physical assistance in the toilet.</li>
                <li>Can feed themselves but may need food cutting up.</li>
                <li>Needs assistance with washing, bathing, and dressing.</li>
                <li>Needs to use a walking aid or be assisted by 1 staff.</li>
                <li>Requires assistance with financial affairs.</li>
                <li>Has difficulty making needs known.</li>
              </ul>
            </div>

            {/* High Needs */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5 dark:border-slate-800">
                <span className="font-extrabold text-sm text-rose-600">Category 4: High Needs</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-extrabold text-[10px]">Score 4</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <li>Is sometimes or frequently doubly incontinent.</li>
                <li>Requires complete assistance in the toilet (using pads/commode).</li>
                <li>Needs to be fed completely by staff.</li>
                <li>Requires complete assistance with washing, bathing, and dressing.</li>
                <li>Immobile, bedbound, or requires hoist transfer (2 staff).</li>
                <li>Unable to make needs known or has severe cognitive impairments.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Tab content 3: Additional Needs prompts */}
      {activeTab === 'additional' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Additional Support Needs Prompts</h2>
            <p className="text-slate-500 mt-0.5">Guidance on logging additional time in minutes for specific resident circumstances.</p>
          </div>

          <div className="space-y-3 font-semibold text-slate-655 dark:text-slate-350">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">1:1 Support</p>
              <p className="leading-relaxed font-medium">Record hours contracted for 1:1 supervision due to safety, funding, or high-risk behaviors.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Eating & Drinking</p>
              <p className="leading-relaxed font-medium">Add time if the person needs continuous encouragement, soft food preparation, feeding support, or monitoring due to choking risk (MUST score-related).</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Communication</p>
              <p className="leading-relaxed font-medium">Add time for translation services, sensory impairments support, or using special communication boards/methods.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Social/Activities/Family Contact Support</p>
              <p className="leading-relaxed font-medium">Add minutes if staff must accompany the resident on outdoor activities, arrange video calls, or manage complex family visit needs.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Moving & Transferring</p>
              <p className="leading-relaxed font-medium">Add minutes if the person requires 2-carer hoisted transfers, specialized slide sheet operations, or 2-hourly turns (Pressure Turn Chart).</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Emotional Psychological</p>
              <p className="leading-relaxed font-medium">Add minutes for managing acute anxiety, distress, bereavement, or psychological support sessions.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Personal Care (Inc. Bathing/Shower)</p>
              <p className="leading-relaxed font-medium">Add minutes if bathing takes significantly longer due to skin integrity, dressings, or extreme resistance.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Positive Behaviour Support (PBS)</p>
              <p className="leading-relaxed font-medium">Add time for implementing de-escalation strategies, managing aggression, or redirection (ABC Behavior Chart).</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 rounded-xl">
              <p className="font-extrabold text-slate-850 dark:text-white mb-1">Medication Support</p>
              <p className="leading-relaxed font-medium">Add time if medication administration requires two countersigning staff (Controlled Drugs) or takes longer due to covert arrangements or peg-tube flushing.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 4: Spreadsheet Guidance */}
      {activeTab === 'guidance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center gap-2 border-b pb-2 dark:border-slate-800">
            <Info className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Spreadsheet Calculation Guidance</h2>
          </div>

          <div className="space-y-3 font-semibold text-slate-655 dark:text-slate-350">
            <p>
              This Dependency Tool has been digitized to help care home managers calculate and justify staffing levels to compliance bodies (such as CQC). The calculations are split into three areas:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 font-semibold text-slate-655 dark:text-slate-350">
              <li>
                <strong>Baseline Assessment:</strong> Provides <strong>60 minutes</strong> of care time per score level per resident per day (e.g. a Low score of 2 equates to 120 minutes of base care time over 24 hours). This is divided equally into <strong>20 minutes per shift</strong> (Early, Late, Night) for each score point.
              </li>
              <li>
                <strong>Additional Support Needs:</strong> Time required for clinical or individual support beyond the baseline. This must be inputted in <strong>minutes</strong> for each shift. The grid cells color-code automatically based on RAG limit parameters.
              </li>
              <li>
                <strong>Other Considerations:</strong> Environmental, human, or layout elements that cannot be calculated in a set formula. These hours are manually entered at the bottom and added to the required staffing totals.
              </li>
            </ol>
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-4 rounded-xl">
              <p className="font-bold text-indigo-950 dark:text-indigo-300">Staff-to-Adult Ratio Calculation:</p>
              <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                The ratio calculates as <code className="bg-white px-1.5 py-0.5 rounded border dark:bg-slate-800 dark:border-slate-700">Supported Adults / Care Staff per shift</code>. Rostered staff count per shift is calculated as <code className="bg-white px-1.5 py-0.5 rounded border dark:bg-slate-800 dark:border-slate-700">Rostered Hours / Shift Length</code>. 
                <br />
                Shift lengths are defined as: <strong>Early (6 hrs)</strong>, <strong>Late (6 hrs)</strong>, and <strong>Night (12 hrs)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 5: PEEPs & First Aid Audit */}
      {activeTab === 'peeps' && (
        <div className="space-y-6 animate-fade-in text-xs font-semibold">
          {/* PEEPs Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Emergency Evacuation Plans (PEEPs) Checklist
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Resident Name</th>
                    <th className="px-4 py-3">Evacuation Priority</th>
                    <th className="px-4 py-3">Required Support Details</th>
                    <th className="px-4 py-3 text-center">PEEP Document Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {peepsLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{log.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                          ${log.priority === 'High' 
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-450' 
                            : log.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-450'
                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-450'}`}>
                          {log.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-350">{log.assistance}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* First Aid Coverage Audit */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Weekly First Aid Coverage Audit
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              CQC compliance audit ensuring at least one trained First Aider is rostered on duty for every shift.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { shift: 'Early Shift (8AM - 2PM)', status: 'Compliant', staff: 'Sarah Jenkins' },
                { shift: 'Late Shift (2PM - 8PM)', status: 'Compliant', staff: 'James Carter' },
                { shift: 'Night Shift (8PM - 8AM)', status: 'Compliant', staff: 'John (Senior Carer)' }
              ].map((fa, faIdx) => (
                <div key={faIdx} className="p-3 bg-slate-50 dark:bg-slate-855 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{fa.shift}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{fa.staff} (First Aider)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                    {fa.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DependencyTool;
