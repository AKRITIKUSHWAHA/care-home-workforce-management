import React, { useState, useEffect } from 'react';
import { Shield, Flame, Activity, TrendingUp, Check, AlertTriangle, Clock, Calendar, User, ChevronDown, ChevronUp, History } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

// Lookup dictionaries for timeline detail labels
const WATERLOW_LABELS = {
  build: {
    0: 'Average',
    1: 'Above Average',
    2: 'Obese',
    3: 'Below Average / Cachectic'
  },
  skin: {
    0: 'Healthy / Normal',
    1: 'Paper thin / Dry',
    2: 'Damp / Discoloured',
    3: 'Broken / Cavities'
  },
  sexAge: {
    1: 'Male (14-49 years)',
    2: 'Female (14-49 years)',
    3: 'Age 50-64 years',
    4: 'Age 65-74 years',
    5: 'Age 75-81 years',
    6: 'Age 82+ years'
  },
  mobility: {
    0: 'Fully Active',
    1: 'Restless / Fidgety',
    2: 'Apathetic / Bedbound',
    3: 'Restricted mobility / Zimmer',
    4: 'Immobile / Hoisted'
  },
  nutrition: {
    0: 'Healthy Appetite',
    1: 'Poor Intake / Supplements',
    2: 'Pureed / Soft diets',
    3: 'NG Tube / PEG Fed'
  },
  specialRisk: {
    0: 'None',
    2: 'Diabetes / MS / Stroke',
    4: 'Sensory Deficits',
    6: 'Severe Cachexia / Terminal Illness'
  }
};

const MUST_LABELS = {
  bmiScore: {
    0: 'BMI > 20 (Healthy/Overweight)',
    1: 'BMI 18.5 - 20 (Underweight)',
    2: 'BMI < 18.5 (Severe Malnourishment)'
  },
  weightLossScore: {
    0: 'Weight Loss < 5%',
    1: 'Weight Loss 5% - 10%',
    2: 'Weight Loss > 10%'
  },
  acuteDiseaseScore: {
    0: 'No acute disease effect',
    2: 'Severely ill & empty intake for 5+ days'
  }
};

const RiskAssessments = ({ patientName }) => {
  const { residentRiskAssessments, saveRiskAssessment } = useApp();
  const [activeTab, setActiveTab] = useState('waterlow'); // 'waterlow' | 'must' | 'peep'

  // Form States
  const [waterlow, setWaterlow] = useState({
    build: 0,
    skin: 0,
    sexAge: 0,
    mobility: 0,
    nutrition: 0,
    specialRisk: 0
  });

  const [must, setMust] = useState({
    bmiScore: 0,
    weightLossScore: 0,
    acuteDiseaseScore: 0
  });

  const [peep, setPeep] = useState({
    mobilityLevel: 'Independent',
    evacEquipment: 'None',
    cognitiveStatus: 'Fully Aware',
    dayNotes: 'No special assistance required.',
    nightNotes: 'Night staff to guide during egress.'
  });

  const [savedStatus, setSavedStatus] = useState({
    waterlow: false,
    must: false,
    peep: false
  });

  const [expandedIds, setExpandedIds] = useState({});

  // 1. Smart Preloading Effect: Load latest saved values when resident or tab changes
  useEffect(() => {
    const historyOfType = residentRiskAssessments.filter(
      ra => ra.resident === patientName && ra.type.toLowerCase() === activeTab
    );
    
    if (historyOfType.length > 0) {
      const latest = historyOfType[0]; // Sort order is descending by date
      if (activeTab === 'waterlow') {
        setWaterlow(latest.details);
      } else if (activeTab === 'must') {
        setMust(latest.details);
      } else if (activeTab === 'peep') {
        setPeep(latest.details);
      }
    } else {
      // Fallback defaults if no previous records
      if (activeTab === 'waterlow') {
        setWaterlow({ build: 0, skin: 0, sexAge: 3, mobility: 0, nutrition: 0, specialRisk: 0 });
      } else if (activeTab === 'must') {
        setMust({ bmiScore: 0, weightLossScore: 0, acuteDiseaseScore: 0 });
      } else if (activeTab === 'peep') {
        setPeep({
          mobilityLevel: 'Independent',
          evacEquipment: 'None',
          cognitiveStatus: 'Fully Aware',
          dayNotes: 'No special assistance required.',
          nightNotes: 'Night staff to guide during egress.'
        });
      }
    }
  }, [patientName, activeTab, residentRiskAssessments]);

  // Compute Waterlow Score
  const waterlowTotal = Object.values(waterlow).reduce((a, b) => Number(a) + Number(b), 0);
  const getWaterlowLevel = (score) => {
    if (score >= 20) return { label: 'Very High Risk', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    if (score >= 15) return { label: 'High Risk', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (score >= 10) return { label: 'At Risk', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' };
    return { label: 'Low Risk', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  // Compute MUST Score
  const mustTotal = Number(must.bmiScore) + Number(must.weightLossScore) + Number(must.acuteDiseaseScore);
  const getMustLevel = (score) => {
    if (score >= 2) return { label: 'High Risk (Assess & Treat)', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    if (score === 1) return { label: 'Medium Risk (Monitor)', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'Low Risk (Routine Care)', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  // Save Handlers
  const handleSaveWaterlow = () => {
    const level = getWaterlowLevel(waterlowTotal).label;
    saveRiskAssessment(patientName, 'Waterlow', waterlowTotal, waterlow, level);
    setSavedStatus(prev => ({ ...prev, waterlow: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, waterlow: false }));
    }, 2000);
  };

  const handleSaveMust = () => {
    const level = getMustLevel(mustTotal).label;
    saveRiskAssessment(patientName, 'MUST', mustTotal, must, level);
    setSavedStatus(prev => ({ ...prev, must: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, must: false }));
    }, 2000);
  };

  const handleSavePeep = () => {
    saveRiskAssessment(patientName, 'PEEP', 0, peep, peep.mobilityLevel);
    setSavedStatus(prev => ({ ...prev, peep: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, peep: false }));
    }, 2000);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter history for current resident
  const residentHistory = residentRiskAssessments.filter(ra => ra.resident === patientName);

  return (
    <div className="space-y-6">
      
      {/* Risk Assessments Panel Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
        
        {/* Header and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>PCS Clinical Risk Assessments</span>
            </h3>
            <p className="text-xs text-slate-500">Conduct Waterlow, MUST, and PEEP compliance scorings.</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('waterlow')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'waterlow'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Waterlow
            </button>
            <button
              onClick={() => setActiveTab('must')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'must'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              MUST Score
            </button>
            <button
              onClick={() => setActiveTab('peep')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'peep'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              PEEP
            </button>
          </div>
        </div>

        {/* 1. WATERLOW PRESSURE RISK ASSESSMENTS */}
        {activeTab === 'waterlow' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pressure Ulcer Risk</span>
                <p className="font-extrabold text-sm text-slate-850 dark:text-white">Waterlow Score Card</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Score</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{waterlowTotal}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getWaterlowLevel(waterlowTotal).color}`}>
                  {getWaterlowLevel(waterlowTotal).label}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Build / Weight */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Build / Weight Type</label>
                <select
                  value={waterlow.build}
                  onChange={(e) => setWaterlow({ ...waterlow, build: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>Average (0)</option>
                  <option value={1}>Above Average (1)</option>
                  <option value={2}>Obese (2)</option>
                  <option value={3}>Below Average / Cachectic (3)</option>
                </select>
              </div>

              {/* Skin Condition */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Visual Skin Status</label>
                <select
                  value={waterlow.skin}
                  onChange={(e) => setWaterlow({ ...waterlow, skin: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>Healthy / Normal (0)</option>
                  <option value={1}>Paper thin / Dry (1)</option>
                  <option value={2}>Damp / Discoloured (2)</option>
                  <option value={3}>Broken / Cavities (3)</option>
                </select>
              </div>

              {/* Sex & Age */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Sex & Age bracket</label>
                <select
                  value={waterlow.sexAge}
                  onChange={(e) => setWaterlow({ ...waterlow, sexAge: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={1}>Male (14-49 years) (1)</option>
                  <option value={2}>Female (14-49 years) (2)</option>
                  <option value={3}>Age 50-64 years (3)</option>
                  <option value={4}>Age 65-74 years (4)</option>
                  <option value={5}>Age 75-81 years (5)</option>
                  <option value={6}>Age 82+ years (6)</option>
                </select>
              </div>

              {/* Mobility */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Mobility Level</label>
                <select
                  value={waterlow.mobility}
                  onChange={(e) => setWaterlow({ ...waterlow, mobility: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>Fully Active (0)</option>
                  <option value={1}>Restless / Fidgety (1)</option>
                  <option value={2}>Apathetic / Bedbound (2)</option>
                  <option value={3}>Restricted mobility / Zimmer (3)</option>
                  <option value={4}>Immobile / Hoisted (4)</option>
                </select>
              </div>

              {/* Nutritional Status */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nutritional Intake</label>
                <select
                  value={waterlow.nutrition}
                  onChange={(e) => setWaterlow({ ...waterlow, nutrition: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>Healthy Appetite (0)</option>
                  <option value={1}>Poor Intake / Supplements (1)</option>
                  <option value={2}>Pureed / Soft diets (2)</option>
                  <option value={3}>NG Tube / PEG Fed (3)</option>
                </select>
              </div>

              {/* Special Risk Categories */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Neurological / Special Risks</label>
                <select
                  value={waterlow.specialRisk}
                  onChange={(e) => setWaterlow({ ...waterlow, specialRisk: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>None (0)</option>
                  <option value={2}>Diabetes / MS / Stroke (2)</option>
                  <option value={4}>Sensory Deficits (4)</option>
                  <option value={6}>Severe Cachexia / Terminal Illness (6)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800">
              <button
                onClick={handleSaveWaterlow}
                className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savedStatus.waterlow ? <Check className="h-4 w-4" /> : null}
                <span>{savedStatus.waterlow ? 'Scoring Saved!' : 'Save Waterlow Score'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. MUST ASSESSMENTS */}
        {activeTab === 'must' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nutritional Screening</span>
                <p className="font-extrabold text-sm text-slate-850 dark:text-white">MUST Score Card</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Score</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{mustTotal}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getMustLevel(mustTotal).color}`}>
                  {getMustLevel(mustTotal).label}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* BMI Score */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">BMI Parameter</label>
                <select
                  value={must.bmiScore}
                  onChange={(e) => setMust({ ...must, bmiScore: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>{"BMI > 20 (Healthy/Overweight) (Score 0)"}</option>
                  <option value={1}>BMI 18.5 - 20 (Underweight) (Score 1)</option>
                  <option value={2}>{"BMI < 18.5 (Severe Malnourishment) (Score 2)"}</option>
                </select>
              </div>

              {/* Unplanned Weight Loss */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Unplanned Weight Loss (Last 3-6m)</label>
                <select
                  value={must.weightLossScore}
                  onChange={(e) => setMust({ ...must, weightLossScore: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>{"Weight Loss < 5% (Score 0)"}</option>
                  <option value={1}>Weight Loss 5% - 10% (Score 1)</option>
                  <option value={2}>{"Weight Loss > 10% (Score 2)"}</option>
                </select>
              </div>

              {/* Acute Disease Effect */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">{"Acute Disease Effect (No Intake > 5 days)"}</label>
                <select
                  value={must.acuteDiseaseScore}
                  onChange={(e) => setMust({ ...must, acuteDiseaseScore: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={0}>No acute disease effect (Score 0)</option>
                  <option value={2}>Severely ill & empty intake for 5+ days (Score 2)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800">
              <button
                onClick={handleSaveMust}
                className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savedStatus.must ? <Check className="h-4 w-4" /> : null}
                <span>{savedStatus.must ? 'Scoring Saved!' : 'Save MUST Score'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. PEEP ASSESSMENTS */}
        {activeTab === 'peep' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                This PEEP form establishes evacuation pathways during fire alarms. Always ensure that the physical evacuation matches these directions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Egress Mobility */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Emergency Egress Mobility</label>
                <select
                  value={peep.mobilityLevel}
                  onChange={(e) => setPeep({ ...peep, mobilityLevel: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Independent">Independent Egress</option>
                  <option value="Requires 1 Assistant">Requires 1 Assistant</option>
                  <option value="Requires 2 Assistants">Requires 2 Assistants (Hoist users)</option>
                  <option value="Non-ambulatory">Non-ambulatory (Bedbound)</option>
                </select>
              </div>

              {/* Evacuation Equipment */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Required Egress Equipment</label>
                <select
                  value={peep.evacEquipment}
                  onChange={(e) => setPeep({ ...peep, evacEquipment: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="None">None (Walks with aid/frame)</option>
                  <option value="Evacuation Chair">Evacuation Chair (Stairways)</option>
                  <option value="Slide Sheet">Slide Sheet (Mattress drag)</option>
                  <option value="Hoist">Hoist Transfer to Chair</option>
                </select>
              </div>

              {/* Cognitive Status */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Emergency Cognitive Status</label>
                <select
                  value={peep.cognitiveStatus}
                  onChange={(e) => setPeep({ ...peep, cognitiveStatus: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Fully Aware">Fully Cooperating & Aware</option>
                  <option value="Mild Confusion">Mild Confusion (Dementia)</option>
                  <option value="Severely Disoriented">Severely Disoriented (Needs direct handholding)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Daytime Evacuation Plan Details</label>
                <textarea
                  value={peep.dayNotes}
                  onChange={(e) => setPeep({ ...peep, dayNotes: e.target.value })}
                  placeholder="Day evacuation details..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl min-h-[70px] outline-none focus:border-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nighttime Egress Plan Details</label>
                <textarea
                  value={peep.nightNotes}
                  onChange={(e) => setPeep({ ...peep, nightNotes: e.target.value })}
                  placeholder="Night evacuation details..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl min-h-[70px] outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800">
              <button
                onClick={handleSavePeep}
                className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savedStatus.peep ? <Check className="h-4 w-4" /> : null}
                <span>{savedStatus.peep ? 'PEEP Evacuation Plan Saved!' : 'Save PEEP Details'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. VISUAL TIMELINE VIEW FOR RISK ASSESSMENT VERSIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        
        {/* Timeline Header */}
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3">
          <History className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Resident Risk Assessment History</h4>
            <p className="text-[10px] text-slate-500">Review version changes and audit logs for {patientName}.</p>
          </div>
        </div>

        {/* Timeline List */}
        {residentHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No previous risk assessments logged for {patientName}.
          </div>
        ) : (
          <div className="relative border-l border-slate-150 dark:border-slate-800 pl-5 ml-2.5 py-2 space-y-5">
            {residentHistory.map((entry) => {
              const isExpanded = !!expandedIds[entry.id];
              
              // Color badges based on assessment type
              let typeBadge = '';
              if (entry.type === 'Waterlow') typeBadge = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40';
              if (entry.type === 'MUST') typeBadge = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40';
              if (entry.type === 'PEEP') typeBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40';

              // Risk level styling
              const isHighRisk = entry.categoryLabel.toLowerCase().includes('high') || entry.categoryLabel.toLowerCase().includes('severe');
              const isMediumRisk = entry.categoryLabel.toLowerCase().includes('medium') || entry.categoryLabel.toLowerCase().includes('at risk') || entry.categoryLabel.toLowerCase().includes('assistance');
              
              const riskColorBadge = isHighRisk 
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40' 
                : isMediumRisk 
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40' 
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-955/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40';

              return (
                <div key={entry.id} className="relative text-xs">
                  {/* Bullet Node */}
                  <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-500 dark:border-slate-900" />
                  
                  {/* Timeline content row */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-all shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${typeBadge}`}>
                          {entry.type}
                        </span>
                        {entry.type !== 'PEEP' && (
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            Score: {entry.score}
                          </span>
                        )}
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${riskColorBadge}`}>
                          {entry.categoryLabel}
                        </span>
                      </div>
                      
                      {/* Date details */}
                      <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3" /> {entry.date} at {entry.time}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-bold">
                        <User className="h-3.5 w-3.5 text-slate-400" /> Assessor: {entry.assessor}
                      </span>
                      
                      <button
                        onClick={() => toggleExpand(entry.id)}
                        className="text-[10px] font-bold text-brand-600 hover:text-brand-500 flex items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg shadow-xs"
                      >
                        {isExpanded ? (
                          <>Hide Details <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Show Details <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                    </div>

                    {/* Detailed Collapsible Parameters (Version details) */}
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-150 dark:border-slate-800 space-y-2 text-[10.5px] font-semibold text-slate-655 dark:text-slate-350 animate-fade-in">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block border-b pb-1 mb-2">
                          Scored parameters / directions
                        </span>
                        
                        {/* Render details based on assessment type */}
                        {entry.type === 'Waterlow' && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Build / Weight:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.build[entry.details.build]} ({entry.details.build})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Skin Condition:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.skin[entry.details.skin]} ({entry.details.skin})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Sex & Age bracket:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.sexAge[entry.details.sexAge]} ({entry.details.sexAge})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Mobility Level:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.mobility[entry.details.mobility]} ({entry.details.mobility})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Nutrition Status:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.nutrition[entry.details.nutrition]} ({entry.details.nutrition})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Neurological / Special:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {WATERLOW_LABELS.specialRisk[entry.details.specialRisk]} ({entry.details.specialRisk})
                              </span>
                            </div>
                          </div>
                        )}

                        {entry.type === 'MUST' && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">BMI Parameter:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {MUST_LABELS.bmiScore[entry.details.bmiScore]} ({entry.details.bmiScore})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Unplanned Weight Loss:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {MUST_LABELS.weightLossScore[entry.details.weightLossScore]} ({entry.details.weightLossScore})
                              </span>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Acute Disease Effect:</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {MUST_LABELS.acuteDiseaseScore[entry.details.acuteDiseaseScore]} ({entry.details.acuteDiseaseScore})
                              </span>
                            </div>
                          </div>
                        )}

                        {entry.type === 'PEEP' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                                <span className="text-slate-500">Egress Mobility:</span>
                                <span className="font-bold text-slate-800 dark:text-white">{entry.details.mobilityLevel}</span>
                              </div>
                              <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                                <span className="text-slate-500">Required Equipment:</span>
                                <span className="font-bold text-slate-800 dark:text-white">{entry.details.evacEquipment}</span>
                              </div>
                            </div>
                            <div className="flex justify-between border-b dark:border-slate-800 pb-1">
                              <span className="text-slate-500">Cognitive Status:</span>
                              <span className="font-bold text-slate-800 dark:text-white">{entry.details.cognitiveStatus}</span>
                            </div>
                            <div className="pt-1.5 space-y-1">
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase">Day Evacuation Plan</span>
                              <p className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-350">{entry.details.dayNotes}</p>
                            </div>
                            <div className="pt-1 space-y-1">
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase">Night Evacuation Plan</span>
                              <p className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-350">{entry.details.nightNotes}</p>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default RiskAssessments;
