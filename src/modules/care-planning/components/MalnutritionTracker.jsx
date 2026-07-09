import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TrendingUp, Plus, Trash, Check, Save, Activity, Calendar, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const MONTHS_LIST = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MalnutritionTracker = () => {
  const { malnutritionLogs, setMalnutritionLogs, currentRole } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'plans' | 'trends'
  
  const [saveAlert, setSaveAlert] = useState(false);
  const [newActionPlan, setNewActionPlan] = useState({
    name: '',
    monthTriggered: 'June',
    dateIdentified: '2026-06-15',
    actionsTaken: '',
    responsible: '',
    dateCompleted: '',
    improvementSeen: 'Y',
    details: ''
  });

  const [newReview, setNewReview] = useState({
    residentName: '',
    dateTime: new Date().toISOString().slice(0, 16),
    mustScore: '0',
    actionsTaken: '',
    comments: ''
  });

  // Check weight loss difference and flag
  const getWeightLossStatus = (diffPercent) => {
    if (diffPercent >= 10) return { label: 'High Risk (≥10%)', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    if (diffPercent >= 5) return { label: 'Medium Risk (≥5%)', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'Low Risk', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  // Handler for weight changes
  // Handler for weight changes
  const handleWeightChange = (resIndex, month, value) => {
    const numVal = value === '' ? null : Math.max(0, parseFloat(value) || 0);
    setMalnutritionLogs(prev => {
      const residents = prev.residents.map((res, i) => {
        if (i !== resIndex) return res;
        const weights = { ...(res.weights || {}) };
        if (numVal === null) {
          delete weights[month];
        } else {
          weights[month] = numVal;
        }
        return { ...res, weights };
      });
      return { ...prev, residents };
    });
  };

  // Handler for date weight taken
  const handleDateChange = (resIndex, month, value) => {
    setMalnutritionLogs(prev => {
      const residents = prev.residents.map((res, i) => {
        if (i !== resIndex) return res;
        const dates = { ...(res.dates || {}) };
        dates[month] = value;
        return { ...res, dates };
      });
      return { ...prev, residents };
    });
  };

  // Handler for height changes
  const handleHeightChange = (resIndex, value) => {
    const numVal = Math.max(0.1, parseFloat(value) || 0);
    setMalnutritionLogs(prev => {
      const residents = prev.residents.map((res, i) => {
        if (i !== resIndex) return res;
        return { ...res, height: numVal };
      });
      return { ...prev, residents };
    });
  };

  // Add resident
  const addResident = () => {
    setMalnutritionLogs(prev => {
      const residents = prev.residents ? [...prev.residents] : [];
      residents.push({
        name: '',
        height: 1.70,
        weights: {},
        dates: {}
      });
      const updated = { ...prev, residents };
      console.log("addResident clicked. Previous state:", prev, "Updated state:", updated);
      return updated;
    });
  };

  // Remove resident
  const removeResident = (index) => {
    setMalnutritionLogs(prev => {
      const residents = prev.residents ? [...prev.residents] : [];
      residents.splice(index, 1);
      return { ...prev, residents };
    });
  };

  // Add action plan
  const handleAddActionPlan = (e) => {
    e.preventDefault();
    if (!newActionPlan.name || !newActionPlan.actionsTaken) return;

    const entry = {
      id: `ap-${Date.now()}`,
      ...newActionPlan
    };

    setMalnutritionLogs(prev => {
      const actionPlans = prev.actionPlans ? [...prev.actionPlans] : [];
      actionPlans.push(entry);
      return { ...prev, actionPlans };
    });

    // Reset
    setNewActionPlan({
      name: '',
      monthTriggered: 'June',
      dateIdentified: '2026-06-15',
      actionsTaken: '',
      responsible: '',
      dateCompleted: '',
      improvementSeen: 'Y',
      details: ''
    });
  };

  // Delete action plan
  const deleteActionPlan = (id) => {
    setMalnutritionLogs(prev => ({
      ...prev,
      actionPlans: (prev.actionPlans || []).filter(p => p.id !== id)
    }));
  };

  // Add monthly review
  const handleAddMonthlyReview = (e) => {
    e.preventDefault();
    if (!newReview.residentName || !newReview.comments) return;

    const entry = {
      id: `rev-${Date.now()}`,
      month: selectedMonth,
      ...newReview
    };

    setMalnutritionLogs(prev => {
      const monthlyReviews = prev.monthlyReviews ? [...prev.monthlyReviews] : [];
      monthlyReviews.push(entry);
      return { ...prev, monthlyReviews };
    });

    // Reset form
    setNewReview({
      residentName: '',
      dateTime: new Date().toISOString().slice(0, 16),
      mustScore: '0',
      actionsTaken: '',
      comments: ''
    });
  };

  // Delete monthly review
  const handleDeleteMonthlyReview = (id) => {
    setMalnutritionLogs(prev => {
      const monthlyReviews = prev.monthlyReviews ? [...prev.monthlyReviews] : [];
      return {
        ...prev,
        monthlyReviews: monthlyReviews.filter(r => r.id !== id)
      };
    });
  };

  const saveToLocalStorage = () => {
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  // Helper to get weight for a month
  const getWeightVal = (res, month) => {
    return res.weights?.[month] !== undefined ? res.weights[month] : '';
  };

  // Helper to get date for a month
  const getDateVal = (res, month) => {
    return res.dates?.[month] || '';
  };

  // Calculates BMI
  const getBMI = (weight, height) => {
    if (!weight || !height) return '';
    return (weight / (height * height)).toFixed(1);
  };

  // Helper to find previous month weight
  const getPrevMonthWeight = (res, currentMonth) => {
    const idx = MONTHS_LIST.indexOf(currentMonth);
    if (idx === 0) return null; // January has no previous month in this ledger
    const prevMonth = MONTHS_LIST[idx - 1];
    return res.weights?.[prevMonth] !== undefined ? res.weights[prevMonth] : null;
  };

  // Helper to find highest weight in past 3-6 months
  const getHighestWeight36m = (res, currentMonth) => {
    const idx = MONTHS_LIST.indexOf(currentMonth);
    const startIdx = Math.max(0, idx - 6);
    const checkMonths = MONTHS_LIST.slice(startIdx, idx);
    
    let maxW = 0;
    checkMonths.forEach(m => {
      const w = res.weights?.[m];
      if (w && w > maxW) maxW = w;
    });
    return maxW > 0 ? maxW : null;
  };

  // Calculation for Trend Analysis
  const getTrendDataForMonth = (m) => {
    let weighed = 0;
    let bmiOver20 = 0;
    let bmiBetween = 0;
    let bmiUnder = 0;
    
    malnutritionLogs.residents.forEach(res => {
      const w = res.weights?.[m];
      if (w) {
        weighed++;
        const bmi = w / (res.height * res.height);
        if (bmi > 20) bmiOver20++;
        else if (bmi >= 18.5) bmiBetween++;
        else bmiUnder++;
      }
    });

    // Simulated MUST score statistics (normally computed based on weight drop triggers)
    let must0 = 0;
    let must1 = 0;
    let must2 = 0;
    malnutritionLogs.residents.forEach(res => {
      const w = res.weights?.[m];
      if (w) {
        const prevW = getPrevMonthWeight(res, m);
        if (prevW) {
          const drop = prevW - w;
          const dropPct = (drop / prevW) * 100;
          if (dropPct >= 10) must2++;
          else if (dropPct >= 5) must1++;
          else must0++;
        } else {
          must0++;
        }
      }
    });

    return {
      month: m,
      weighed,
      bmiOver20,
      bmiBetween,
      bmiUnder,
      must0,
      must1,
      must2
    };
  };

  // Compute Trend Table rows
  const trendRows = MONTHS_LIST.map(m => getTrendDataForMonth(m));

  // Quarterly Trend Calculator
  const getQuarterTotal = (startIndex, endIndex) => {
    const slice = trendRows.slice(startIndex, endIndex + 1);
    const weighed = slice.reduce((a, b) => a + b.weighed, 0);
    const bmiOver20 = slice.reduce((a, b) => a + b.bmiOver20, 0);
    const bmiBetween = slice.reduce((a, b) => a + b.bmiBetween, 0);
    const bmiUnder = slice.reduce((a, b) => a + b.bmiUnder, 0);
    const must0 = slice.reduce((a, b) => a + b.must0, 0);
    const must1 = slice.reduce((a, b) => a + b.must1, 0);
    const must2 = slice.reduce((a, b) => a + b.must2, 0);
    
    return { weighed, bmiOver20, bmiBetween, bmiUnder, must0, must1, must2 };
  };

  const quarters = {
    Q1: getQuarterTotal(0, 2),
    Q2: getQuarterTotal(3, 5),
    Q3: getQuarterTotal(6, 8),
    Q4: getQuarterTotal(9, 11)
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#2e6559] dark:text-[#3a8273]" />
            <span>Malnutrition Risk & Weight Tracker</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor resident weights, trace 3-6 month weight changes, calculate BMI categories, and manage care intervention plans.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 px-4 rounded-xl border border-slate-250 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#2e6559] dark:bg-slate-800 dark:border-slate-700 dark:text-white cursor-pointer"
          >
            {MONTHS_LIST.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Save Button */}
          <button
            onClick={saveToLocalStorage}
            className={`h-10 px-5 rounded-xl text-white font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
              saveAlert ? 'bg-emerald-600' : 'bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273]'
            }`}
          >
            {saveAlert ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saveAlert ? 'Saved!' : 'Save Progress'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-250 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'ledger'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Monthly Weight Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'plans'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Weight Action Plans</span>
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'trends'
              ? 'border-[#2e6559] text-[#2e6559] dark:border-[#3a8273] dark:text-[#3a8273]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Trend Analysis & Stats</span>
        </button>
      </div>

      {/* TAB 1: MONTHLY WEIGHT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b dark:border-slate-850 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Weight Monitoring Sheet ({selectedMonth}) - Total: {malnutritionLogs.residents.length}</span>
            <button
              onClick={addResident}
              className="h-8 px-3 rounded-lg bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Resident</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold select-none">
                  <th className="p-2.5 border-r dark:border-slate-800 min-w-[150px]">Resident Name</th>
                  <th className="p-2.5 border-r dark:border-slate-800 w-20 text-center">Height (m)</th>
                  <th className="p-2.5 border-r dark:border-slate-800 w-24 text-center">Weight (kg)</th>
                  <th className="p-2.5 border-r dark:border-slate-800 w-28 text-center">Date Taken</th>
                  <th className="p-2.5 border-r dark:border-slate-800 w-20 text-center">BMI (kg/m²)</th>
                  <th className="p-2.5 border-r dark:border-slate-800 text-center">Weight Drop from Prev. Month</th>
                  <th className="p-2.5 border-r dark:border-slate-800 text-center">Highest Weight (3-6m)</th>
                  <th className="p-2.5 border-r dark:border-slate-800 text-center">Overall Loss from Max</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                {malnutritionLogs.residents.map((res, idx) => {
                  const currentW = getWeightVal(res, selectedMonth);
                  const prevW = getPrevMonthWeight(res, selectedMonth);
                  const maxW = getHighestWeight36m(res, selectedMonth);
                  
                  const bmi = getBMI(currentW, res.height);
                  
                  // Compute month-on-month difference
                  let diffMonth = 'N/A';
                  let diffMonthPct = 0;
                  if (currentW && prevW) {
                    const drop = prevW - currentW;
                    diffMonthPct = (drop / prevW) * 100;
                    diffMonth = `${drop.toFixed(1)} kg (${diffMonthPct.toFixed(1)}%)`;
                  }
                  
                  // Compute difference from 3-6 month highest weight
                  let diffMax = 'N/A';
                  let diffMaxPct = 0;
                  if (currentW && maxW) {
                    const drop = maxW - currentW;
                    diffMaxPct = (drop / maxW) * 100;
                    diffMax = `${drop.toFixed(1)} kg (${diffMaxPct.toFixed(1)}%)`;
                  }

                  const worstLossPct = Math.max(diffMonthPct, diffMaxPct);
                  const risk = getWeightLossStatus(worstLossPct);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      
                      {/* Name Input */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850">
                        <input
                          type="text"
                          value={res.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMalnutritionLogs(prev => {
                              const residents = prev.residents.map((r, i) => {
                                if (i !== idx) return r;
                                return { ...r, name: val };
                              });
                              return { ...prev, residents };
                            });
                          }}
                          placeholder="Resident Name..."
                          className="w-full bg-transparent px-1 py-0.5 outline-none font-bold dark:text-white"
                        />
                      </td>

                      {/* Height Input */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center">
                        <input
                          type="number"
                          step="0.01"
                          value={res.height || ''}
                          onChange={(e) => handleHeightChange(idx, e.target.value)}
                          className="w-16 bg-transparent text-center outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white"
                        />
                      </td>

                      {/* Weight Input */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={currentW}
                          onChange={(e) => handleWeightChange(idx, selectedMonth, e.target.value)}
                          placeholder="e.g. 70"
                          className="w-20 bg-transparent text-center outline-none border border-slate-200 dark:border-slate-700 rounded py-0.5 dark:text-white font-black"
                        />
                      </td>

                      {/* Date Weight Taken */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center">
                        <input
                          type="date"
                          value={getDateVal(res, selectedMonth)}
                          onChange={(e) => handleDateChange(idx, selectedMonth, e.target.value)}
                          className="w-28 bg-transparent text-center outline-none dark:text-white text-[10px]"
                        />
                      </td>

                      {/* BMI Output */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center font-black text-slate-900 bg-slate-50/50 dark:text-white dark:bg-slate-950/20">
                        {bmi} {bmi && <span className="text-[8px] font-semibold text-slate-400 block">{bmi < 18.5 ? 'MALNOURISHED' : (bmi > 25 ? 'OVERWEIGHT' : 'HEALTHY')}</span>}
                      </td>

                      {/* Month Drop Output */}
                      <td className={`p-2 border-r border-slate-150 dark:border-slate-850 text-center font-mono ${diffMonthPct >= 5 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                        {diffMonth}
                      </td>

                      {/* 3-6m Highest Weight */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center text-slate-500 font-mono">
                        {maxW ? `${maxW.toFixed(1)} kg` : 'N/A'}
                      </td>

                      {/* Loss from Highest Weight */}
                      <td className={`p-2 border-r border-slate-150 dark:border-slate-850 text-center font-mono ${diffMaxPct >= 10 ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>
                        {diffMax}
                      </td>

                      {/* Status Warning Badge */}
                      <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center">
                        {currentW ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${risk.color}`}>
                            {risk.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No Weight logged</span>
                        )}
                      </td>

                      {/* Delete Action */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeResident(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
                {malnutritionLogs.residents.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400 italic">No residents logged in weight ledger.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Monthly Malnutrition & MUST Review Section */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2e6559] dark:text-[#3a8273] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-555 dark:text-amber-400 animate-pulse" />
                <span>Monthly Malnutrition & MUST Review ({selectedMonth})</span>
              </h3>
              <p className="text-slate-550 dark:text-slate-400 text-[11px] mt-1 font-medium">
                Log MUST score assessment outcomes, clinical commentary, and immediate actions taken (such as GP notifications) for each resident.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddMonthlyReview} className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Resident Name</label>
                  <select
                    value={newReview.residentName}
                    onChange={(e) => setNewReview({ ...newReview, residentName: e.target.value })}
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-semibold"
                    required
                  >
                    <option value="">Select Resident...</option>
                    {malnutritionLogs.residents.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Review Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newReview.dateTime}
                    onChange={(e) => setNewReview({ ...newReview, dateTime: e.target.value })}
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">MUST Score</label>
                  <select
                    value={newReview.mustScore}
                    onChange={(e) => setNewReview({ ...newReview, mustScore: e.target.value })}
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-bold"
                  >
                    <option value="0">0 - Low Risk</option>
                    <option value="1">1 - Medium Risk</option>
                    <option value="2">2+ - High Risk</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Actions Taken / GP Notified</label>
                  <input
                    type="text"
                    value={newReview.actionsTaken}
                    onChange={(e) => setNewReview({ ...newReview, actionsTaken: e.target.value })}
                    placeholder="e.g. GP Notified, Dietitian referral"
                    className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">MUST Review Comments / Clinical Notes</label>
                <textarea
                  value={newReview.comments}
                  onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
                  placeholder="Enter detailed weight assessment notes, GP recommendations, or dietary adjustments..."
                  rows="2"
                  className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white resize-none font-medium"
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Save Review Entry</span>
                </button>
              </div>
            </form>

            {/* List / Table of current reviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">MUST Risk & Review History for {selectedMonth}</h4>
              <div className="overflow-x-auto border rounded-xl dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-left border-collapse text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold">
                      <th className="p-3 w-40">Resident</th>
                      <th className="p-3 w-36">Date & Time</th>
                      <th className="p-3 text-center w-28">MUST Score</th>
                      <th className="p-3 w-48">Actions Taken</th>
                      <th className="p-3">Comments / Clinical Notes</th>
                      <th className="p-3 text-center w-16">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                    {(() => {
                      const filteredReviews = (malnutritionLogs.monthlyReviews || []).filter(r => r.month === selectedMonth);
                      if (filteredReviews.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-400 italic bg-slate-50/50 dark:bg-slate-950/20">
                              No malnutrition or MUST reviews logged for {selectedMonth}.
                            </td>
                          </tr>
                        );
                      }
                      return filteredReviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{rev.residentName}</td>
                          <td className="p-3 font-mono text-slate-500">{rev.dateTime ? rev.dateTime.replace('T', ' ') : 'N/A'}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                              rev.mustScore === '0' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/55' :
                              rev.mustScore === '1' ? 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border-amber-200/55' :
                              'bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border-rose-200/55'
                            }`}>
                              Score {rev.mustScore}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{rev.actionsTaken}</td>
                          <td className="p-3 text-slate-655 dark:text-slate-350 leading-relaxed font-normal">{rev.comments}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteMonthlyReview(rev.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WEIGHT Interventions & Action plans */}
      {activeTab === 'plans' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-fade-in text-xs">
          
          {/* Action Plan Logger Form */}
          <form onSubmit={handleAddActionPlan} className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2e6559] dark:text-[#3a8273] flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Record Weight Intervention Action Plan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Resident Name</label>
                <select
                  value={newActionPlan.name}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, name: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-semibold"
                  required
                >
                  <option value="">Select Resident...</option>
                  {malnutritionLogs.residents.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Month Action Triggered</label>
                <select
                  value={newActionPlan.monthTriggered}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, monthTriggered: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-semibold"
                >
                  {MONTHS_LIST.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Date Identified</label>
                <input
                  type="date"
                  value={newActionPlan.dateIdentified}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, dateIdentified: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Actions Taken / Intervention Details</label>
                <input
                  type="text"
                  value={newActionPlan.actionsTaken}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, actionsTaken: e.target.value })}
                  placeholder="e.g. Fortified diet, PEG feed adjustments, GP notification"
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Responsible Person</label>
                <input
                  type="text"
                  value={newActionPlan.responsible}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, responsible: e.target.value })}
                  placeholder="e.g. Sarah Jenkins (Manager)"
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Date Action Completed</label>
                <input
                  type="date"
                  value={newActionPlan.dateCompleted}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, dateCompleted: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Improvement Seen? (Y/N)</label>
                <select
                  value={newActionPlan.improvementSeen}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, improvementSeen: e.target.value })}
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                  <option value="N/A">Not evaluated yet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Details of Results</label>
                <input
                  type="text"
                  value={newActionPlan.details}
                  onChange={(e) => setNewActionPlan({ ...newActionPlan, details: e.target.value })}
                  placeholder="e.g. Weight stabilized at 72.5kg"
                  className="w-full h-9 px-3 border rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="h-9 px-5 bg-[#2e6559] hover:bg-[#234d44] dark:bg-[#3a8273] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Save Action Plan Entry</span>
              </button>
            </div>
          </form>

          {/* Action Plans Log Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Weight Comparison & Interventions Action Log</h3>
            
            <div className="overflow-x-auto border rounded-xl dark:border-slate-800">
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold">
                    <th className="p-3">Adult's Name</th>
                    <th className="p-3">Month Triggered</th>
                    <th className="p-3">Date Identified</th>
                    <th className="p-3">Actions Taken</th>
                    <th className="p-3">Responsible Person</th>
                    <th className="p-3">Date Completed</th>
                    <th className="p-3 text-center">Improvement Seen?</th>
                    <th className="p-3">Details of Results</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                  {malnutritionLogs.actionPlans?.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{plan.name}</td>
                      <td className="p-3">{plan.monthTriggered}</td>
                      <td className="p-3 font-mono">{plan.dateIdentified}</td>
                      <td className="p-3">{plan.actionsTaken}</td>
                      <td className="p-3 text-slate-500 font-extrabold">{plan.responsible}</td>
                      <td className="p-3 font-mono">{plan.dateCompleted || 'In Progress'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${plan.improvementSeen === 'Y' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : (plan.improvementSeen === 'N' ? 'bg-rose-50 text-rose-700 dark:bg-rose-955/20' : 'bg-slate-100 text-slate-500')}`}>
                          {plan.improvementSeen}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{plan.details || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteActionPlan(plan.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!malnutritionLogs.actionPlans || malnutritionLogs.actionPlans.length === 0) && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 italic">No action plans recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TREND ANALYSIS */}
      {activeTab === 'trends' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-fade-in text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Trend Analysis & Statistics</h2>
            <p className="text-slate-500 mt-0.5">Summary of monthly BMI categories and MUST risk scores for quarterly reporting audits.</p>
          </div>

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold select-none">
                  <th className="p-3 border-r dark:border-slate-800">Reporting Month / Quarter</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28">Total Adults Weighed</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28 text-emerald-600">BMI &gt; 20 (Healthy)</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28 text-amber-600">BMI 18.5 - 20 (Low)</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28 text-rose-600">BMI &lt; 18.5 (Severe)</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28 text-emerald-700">MUST Score 0 (Low)</th>
                  <th className="p-3 border-r dark:border-slate-800 text-center w-28 text-amber-700">MUST Score 1 (Med)</th>
                  <th className="p-3 text-center w-28 text-rose-700">MUST Score 2+ (High)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-bold text-slate-700 dark:text-slate-350">
                {/* Jan - Mar */}
                {trendRows.slice(0, 3).map(r => (
                  <tr key={r.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r dark:border-slate-800">{r.month}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.weighed}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiOver20}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiBetween}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiUnder}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must0}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must1}</td>
                    <td className="p-3 text-center font-mono">{r.must2}</td>
                  </tr>
                ))}
                
                {/* Q1 Total */}
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10 font-black text-slate-900 dark:text-white border-b-2 border-slate-250">
                  <td className="p-3 border-r dark:border-slate-800 uppercase tracking-wide">Q1 Jan - Mar Totals</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{quarters.Q1.weighed}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-700">{quarters.Q1.bmiOver20}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-700">{quarters.Q1.bmiBetween}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-rose-700">{quarters.Q1.bmiUnder}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-800">{quarters.Q1.must0}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-800">{quarters.Q1.must1}</td>
                  <td className="p-3 text-center font-mono text-rose-805">{quarters.Q1.must2}</td>
                </tr>

                {/* Apr - Jun */}
                {trendRows.slice(3, 6).map(r => (
                  <tr key={r.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r dark:border-slate-800">{r.month}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.weighed}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiOver20}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiBetween}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiUnder}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must0}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must1}</td>
                    <td className="p-3 text-center font-mono">{r.must2}</td>
                  </tr>
                ))}

                {/* Q2 Total */}
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10 font-black text-slate-900 dark:text-white border-b-2 border-slate-250">
                  <td className="p-3 border-r dark:border-slate-800 uppercase tracking-wide">Q2 Apr - Jun Totals</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{quarters.Q2.weighed}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-700">{quarters.Q2.bmiOver20}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-700">{quarters.Q2.bmiBetween}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-rose-700">{quarters.Q2.bmiUnder}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-800">{quarters.Q2.must0}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-800">{quarters.Q2.must1}</td>
                  <td className="p-3 text-center font-mono text-rose-805">{quarters.Q2.must2}</td>
                </tr>

                {/* Jul - Sep */}
                {trendRows.slice(6, 9).map(r => (
                  <tr key={r.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r dark:border-slate-800">{r.month}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.weighed}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiOver20}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiBetween}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiUnder}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must0}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must1}</td>
                    <td className="p-3 text-center font-mono">{r.must2}</td>
                  </tr>
                ))}

                {/* Q3 Total */}
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10 font-black text-slate-900 dark:text-white border-b-2 border-slate-250">
                  <td className="p-3 border-r dark:border-slate-800 uppercase tracking-wide">Q3 Jul - Sep Totals</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{quarters.Q3.weighed}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-700">{quarters.Q3.bmiOver20}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-700">{quarters.Q3.bmiBetween}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-rose-700">{quarters.Q3.bmiUnder}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-800">{quarters.Q3.must0}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-800">{quarters.Q3.must1}</td>
                  <td className="p-3 text-center font-mono text-rose-805">{quarters.Q3.must2}</td>
                </tr>

                {/* Oct - Dec */}
                {trendRows.slice(9, 12).map(r => (
                  <tr key={r.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 border-r dark:border-slate-800">{r.month}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.weighed}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiOver20}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiBetween}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.bmiUnder}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must0}</td>
                    <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{r.must1}</td>
                    <td className="p-3 text-center font-mono">{r.must2}</td>
                  </tr>
                ))}

                {/* Q4 Total */}
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10 font-black text-slate-900 dark:text-white border-b-2 border-slate-250">
                  <td className="p-3 border-r dark:border-slate-800 uppercase tracking-wide">Q4 Oct - Dec Totals</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono">{quarters.Q4.weighed}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-700">{quarters.Q4.bmiOver20}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-700">{quarters.Q4.bmiBetween}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-rose-700">{quarters.Q4.bmiUnder}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-emerald-800">{quarters.Q4.must0}</td>
                  <td className="p-3 border-r dark:border-slate-800 text-center font-mono text-amber-800">{quarters.Q4.must1}</td>
                  <td className="p-3 text-center font-mono text-rose-805">{quarters.Q4.must2}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default MalnutritionTracker;
