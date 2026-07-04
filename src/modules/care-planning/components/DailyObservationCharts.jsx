import React, { useState } from 'react';
import { Droplet, Cookie, Pill, Check, AlertCircle, RefreshCw, Layers, Plus, Calendar, Clock, Smile, Trash2 } from 'lucide-react';

const DailyObservationCharts = ({ patientName }) => {
  const [activeTab, setActiveTab] = useState('fluid'); // 'fluid' | 'food' | 'mar' | 'bowel' | 'reposition'

  // --- 1. FLUID LOG STATE ---
  const [fluidLogs, setFluidLogs] = useState([
    { id: 'fl-1', time: '08:30 AM', type: 'Water', volume: 250, carer: 'John (Senior Carer)' },
    { id: 'fl-2', time: '11:15 AM', type: 'Tea', volume: 200, carer: 'James Carter (Nurse)' },
    { id: 'fl-3', time: '01:45 PM', type: 'Orange Juice', volume: 300, carer: 'John (Senior Carer)' }
  ]);
  const [newFluid, setNewFluid] = useState({ type: 'Water', volume: 150 });
  const targetFluid = 2000;
  const totalFluidConsumed = fluidLogs.reduce((acc, log) => acc + log.volume, 0);
  const fluidPercentage = Math.min(Math.round((totalFluidConsumed / targetFluid) * 100), 100);

  const handleAddFluid = (e) => {
    e.preventDefault();
    const newLog = {
      id: `fl-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: newFluid.type,
      volume: Number(newFluid.volume),
      carer: 'John (Senior Carer)'
    };
    setFluidLogs(prev => [...prev, newLog]);
    setNewFluid({ type: 'Water', volume: 150 });
  };

  // --- 2. FOOD CONSUMPTION LOG STATE ---
  const [foodLogs, setFoodLogs] = useState([
    { id: 'fd-1', meal: 'Breakfast', type: 'Soft Diet', portion: 'Full (100%)', notes: 'Ate porridge and banana slice.', carer: 'John (Senior Carer)' },
    { id: 'fd-2', meal: 'Lunch', type: 'Pureed Diet', portion: 'Three Quarters (75%)', notes: 'Enjoyed pureed chicken casserole.', carer: 'Amira Patel (Care Support)' }
  ]);
  const [newFood, setNewFood] = useState({ meal: 'Snack', type: 'Soft Diet', portion: 'Full (100%)', notes: '' });

  const handleAddFood = (e) => {
    e.preventDefault();
    const newLog = {
      id: `fd-${Date.now()}`,
      meal: newFood.meal,
      type: newFood.type,
      portion: newFood.portion,
      notes: newFood.notes || 'No issues observed.',
      carer: 'John (Senior Carer)'
    };
    setFoodLogs(prev => [...prev, newLog]);
    setNewFood({ meal: 'Snack', type: 'Soft Diet', portion: 'Full (100%)', notes: '' });
  };

  // --- 3. MAR SHEET MEDS STATE ---
  const [medsToday, setMedsToday] = useState([
    { id: 'med-1', time: '08:00 AM', name: 'Atorvastatin 20mg', instructions: 'Take 1 tablet daily in the morning', status: 'Given', signedBy: 'James Carter (Nurse)', signedTime: '08:05 AM' },
    { id: 'med-2', time: '12:00 PM', name: 'Paracetamol 500mg', instructions: 'Take 2 tablets with food for pain relief', status: 'Given', signedBy: 'James Carter (Nurse)', signedTime: '12:10 PM' },
    { id: 'med-3', time: '06:00 PM', name: 'Amlodipine 5mg', instructions: 'Take 1 tablet in the evening', status: 'Pending', signedBy: null, signedTime: null },
    { id: 'med-4', time: '08:00 PM', name: 'Zopiclone 7.5mg', instructions: 'Take 1 tablet at bedtime for sleep', status: 'Pending', signedBy: null, signedTime: null }
  ]);

  const handleMedAction = (medId, action) => {
    setMedsToday(prev => prev.map(m => {
      if (m.id === medId) {
        return {
          ...m,
          status: action === 'give' ? 'Given' : 'Refused',
          signedBy: 'James Carter (Registered Nurse)',
          signedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    }));
  };

  // --- 4. BOWEL MONITORING STATE (Bristol Scale) ---
  const [bowelLogs, setBowelLogs] = useState([
    { id: 'bl-1', time: '09:15 AM', bristolType: 'Type 4 (Like a sausage, smooth and soft)', notes: 'Normal bowel movement. No straining.', carer: 'John (Senior Carer)' }
  ]);
  const [newBowel, setNewBowel] = useState({ bristolType: 'Type 4 (Like a sausage, smooth and soft)', notes: '' });

  const handleAddBowel = (e) => {
    e.preventDefault();
    const newLog = {
      id: `bl-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bristolType: newBowel.bristolType,
      notes: newBowel.notes || 'Normal bowel action.',
      carer: 'John (Senior Carer)'
    };
    setBowelLogs(prev => [...prev, newLog]);
    setNewBowel({ bristolType: 'Type 4 (Like a sausage, smooth and soft)', notes: '' });
  };

  // --- 5. REPOSITIONING TURN RECORD STATE ---
  const [turnsToday, setTurnsToday] = useState([
    { id: 't-1', time: '08:00 AM', position: 'Left Side', skinCheck: 'Healthy (No redness)', carer: 'John (Senior Carer)' },
    { id: 't-2', time: '10:00 AM', position: 'Back', skinCheck: 'Healthy (No redness)', carer: 'John (Senior Carer)' },
    { id: 't-3', time: '12:00 PM', position: 'Right Side', skinCheck: 'Mild Redness (Applied cream)', carer: 'Amira Patel (Care Support)' },
    { id: 't-4', time: '02:00 PM', position: 'Back', skinCheck: 'Healthy (Redness faded)', carer: 'John (Senior Carer)' }
  ]);
  const [newTurn, setNewTurn] = useState({ position: 'Left Side', skinCheck: 'Healthy (No redness)' });

  const handleAddTurn = (e) => {
    e.preventDefault();
    const newLog = {
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      position: newTurn.position,
      skinCheck: newTurn.skinCheck,
      carer: 'John (Senior Carer)'
    };
    setTurnsToday(prev => [...prev, newLog]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6 text-xs text-slate-800 dark:text-slate-100">
      
      {/* Top Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <span>Daily Clinical Charts & Observations</span>
          </h3>
          <p className="text-xs text-slate-500">PCS-compliant daily checklists and clinical monitoring for {patientName}.</p>
        </div>

        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 gap-0.5">
          <button
            onClick={() => setActiveTab('fluid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'fluid' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
            }`}
          >
            <Droplet className="h-3.5 w-3.5 text-blue-500" />
            Fluid Chart
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'food' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
            }`}
          >
            <Cookie className="h-3.5 w-3.5 text-amber-500" />
            Food intake
          </button>
          <button
            onClick={() => setActiveTab('mar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'mar' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
            }`}
          >
            <Pill className="h-3.5 w-3.5 text-rose-500" />
            MAR Meds
          </button>
          <button
            onClick={() => setActiveTab('bowel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'bowel' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
            }`}
          >
            <Smile className="h-3.5 w-3.5 text-indigo-500" />
            Bowel Log
          </button>
          <button
            onClick={() => setActiveTab('reposition')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'reposition' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5 text-teal-500 animate-spin-slow" />
            Turn Records
          </button>
        </div>
      </div>

      {/* --- TAB 1: DAILY FLUID BALANCE CHART --- */}
      {activeTab === 'fluid' && (
        <div className="space-y-4 animate-fade-in">
          {/* Progress gauge card */}
          <div className="bg-blue-50/50 border border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Hydration Intake</span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Daily Fluid Balance Goal</h4>
              <p className="text-slate-500 text-[11px] font-semibold mt-0.5">Target: {targetFluid} ml / Consumed: {totalFluidConsumed} ml</p>
            </div>
            
            <div className="flex-1 w-full max-w-sm space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-blue-600 dark:text-blue-400">
                <span>Intake Gauge</span>
                <span>{fluidPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${fluidPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {/* Input Drink Form */}
            <form onSubmit={handleAddFluid} className="md:col-span-4 glass-card p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
              <h5 className="font-extrabold text-slate-900 dark:text-white">Log Liquid Intake</h5>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Fluid Type</label>
                <select 
                  value={newFluid.type}
                  onChange={(e) => setNewFluid({ ...newFluid, type: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Water">Water</option>
                  <option value="Tea">Tea / Coffee</option>
                  <option value="Orange Juice">Fruit Juice</option>
                  <option value="Squash">Squash</option>
                  <option value="Milk">Milk</option>
                  <option value="Soup">Soup / Broth</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Volume (ml)</label>
                <select 
                  value={newFluid.volume}
                  onChange={(e) => setNewFluid({ ...newFluid, volume: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value={100}>100 ml (Small cup)</option>
                  <option value={150}>150 ml (Standard cup)</option>
                  <option value={200}>200 ml (Beaker)</option>
                  <option value={250}>250 ml (Glass)</option>
                  <option value={300}>300 ml (Mug)</option>
                  <option value={500}>500 ml (Bottle)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-8.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add to Chart
              </button>
            </form>

            {/* Logs Table */}
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-slate-150 dark:border-slate-850">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500 text-[10px] uppercase">
                    <th className="p-3">Time</th>
                    <th className="p-3">Drink Type</th>
                    <th className="p-3 text-right">Volume</th>
                    <th className="p-3">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {fluidLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-semibold text-slate-500">{log.time}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.type}</td>
                      <td className="p-3 text-right font-black text-blue-600 dark:text-blue-400">{log.volume} ml</td>
                      <td className="p-3 text-slate-400 font-semibold">{log.carer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: DAILY FOOD CONSUMPTION CHART --- */}
      {activeTab === 'food' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-5 md:grid-cols-12">
            {/* Input Food Form */}
            <form onSubmit={handleAddFood} className="md:col-span-4 glass-card p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
              <h5 className="font-extrabold text-slate-900 dark:text-white">Record Food Intake</h5>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Meal Session</label>
                <select 
                  value={newFood.meal}
                  onChange={(e) => setNewFood({ ...newFood, meal: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack / Dessert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Dietary Style (Soft/Pureed)</label>
                <select 
                  value={newFood.type}
                  onChange={(e) => setNewFood({ ...newFood, type: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Normal Diet">Normal / Regular</option>
                  <option value="Soft Diet">Soft Diet (Osteoarthritis friendly)</option>
                  <option value="Pureed Diet">Pureed Diet (Choking precaution)</option>
                  <option value="Diabetic Diet">Diabetic Diet (Low glycemic index)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Portion Eaten</label>
                <select 
                  value={newFood.portion}
                  onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Full (100%)">Full (100% finished)</option>
                  <option value="Three Quarters (75%)">Three Quarters (75%)</option>
                  <option value="Half (50%)">Half (50%)</option>
                  <option value="Quarter (25%)">Quarter (25%)</option>
                  <option value="Refused (0%)">Refused Care (0% eaten)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Carer Feeding Notes</label>
                <input 
                  type="text"
                  placeholder="e.g. Finished porridge quickly. Liked the tea."
                  value={newFood.notes}
                  onChange={(e) => setNewFood({ ...newFood, notes: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-8.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Food Entry
              </button>
            </form>

            {/* Logs List Table */}
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-slate-150 dark:border-slate-850">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500 text-[10px] uppercase">
                    <th className="p-3">Meal</th>
                    <th className="p-3">Diet Category</th>
                    <th className="p-3">Portion Eaten</th>
                    <th className="p-3">Directives / Notes</th>
                    <th className="p-3">Staff Roster</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {foodLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.meal}</td>
                      <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">{log.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          log.portion.includes('Full') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                        }`}>
                          {log.portion}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-500">{log.notes}</td>
                      <td className="p-3 text-slate-400 font-semibold">{log.carer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: MEDICATION ADMINISTRATION RECORD (MAR SHEET) --- */}
      {activeTab === 'mar' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-rose-50 border-l-4 border-rose-500 dark:bg-rose-950/20 p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800 dark:text-rose-300">Medication Safety Regulation</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5 font-medium">
                Double-check the patient profile and confirm the identity badge before signed administration. If the resident refuses medication, mark as Refused and immediately log an observation case.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-150 dark:border-slate-850">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500 text-[10px] uppercase">
                  <th className="p-3">Scheduled Time</th>
                  <th className="p-3">Medication Name</th>
                  <th className="p-3">Clinical Instructions</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Signed Verification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {medsToday.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                    <td className="p-3 font-semibold text-slate-500">
                      <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400"/> {med.time}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-850 dark:text-white">{med.name}</td>
                    <td className="p-3 text-slate-550 font-semibold">{med.instructions}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        med.status === 'Given' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        med.status === 'Refused' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {med.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {med.signedBy ? (
                        <div>
                          <p className="font-bold">{med.signedBy}</p>
                          <p className="text-[10px] text-slate-400">Signed at: {med.signedTime}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unsigned</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {med.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleMedAction(med.id, 'refuse')}
                            className="h-7 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold"
                          >
                            Refuse
                          </button>
                          <button
                            onClick={() => handleMedAction(med.id, 'give')}
                            className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs"
                          >
                            Give
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold flex items-center justify-end gap-1"><Check className="h-3.5 w-3.5 text-emerald-500"/> Saved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: BOWEL MONITORING CHART (Bristol Scale) --- */}
      {activeTab === 'bowel' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-5 md:grid-cols-12">
            {/* Input Bowel Form */}
            <form onSubmit={handleAddBowel} className="md:col-span-4 glass-card p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
              <h5 className="font-extrabold text-slate-900 dark:text-white">Record Bowel Action</h5>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Bristol Stool Type</label>
                <select 
                  value={newBowel.bristolType}
                  onChange={(e) => setNewBowel({ ...newBowel, bristolType: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Type 1 (Separate hard lumps)">Type 1 - Hard separate lumps</option>
                  <option value="Type 2 (Sausage-shaped but lumpy)">Type 2 - Sausage shape but lumpy</option>
                  <option value="Type 3 (Like a sausage but with cracks)">Type 3 - Sausage shape with cracks</option>
                  <option value="Type 4 (Like a sausage, smooth and soft)">Type 4 - Smooth soft sausage (Ideal)</option>
                  <option value="Type 5 (Soft blobs with clear-cut edges)">Type 5 - Soft blobs clear edges</option>
                  <option value="Type 6 (Fluffy pieces, ragged edges, mushy)">Type 6 - Ragged mushy pieces</option>
                  <option value="Type 7 (Watery, no solid pieces)">Type 7 - Watery / Liquid stool</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Staining / Constipation Notes</label>
                <input 
                  type="text"
                  placeholder="e.g. Normal consistency, no pain."
                  value={newBowel.notes}
                  onChange={(e) => setNewBowel({ ...newBowel, notes: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-8.5 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Bowel Log
              </button>
            </form>

            {/* Bowel History List */}
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-slate-150 dark:border-slate-850">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500 text-[10px] uppercase">
                    <th className="p-3">Time</th>
                    <th className="p-3">Bristol Stool Type</th>
                    <th className="p-3">Clinical Notes</th>
                    <th className="p-3">Carer Signed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {bowelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-semibold text-slate-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400"/> {log.time}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.bristolType}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{log.notes}</td>
                      <td className="p-3 text-slate-400 font-semibold">{log.carer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: REPOSITIONING TURN RECORD CHART --- */}
      {activeTab === 'reposition' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-teal-50 border-l-4 border-teal-500 dark:bg-teal-950/20 p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
            <RefreshCw className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-teal-800 dark:text-teal-300">Pressure Area Turn Schedule</p>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
                Margaret has a Waterlow Score of 15 (Moderate Risk). Check skin integrity on heels, sacrum, and elbows during every 2-hourly rotation turn.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {/* Input Turn Form */}
            <form onSubmit={handleAddTurn} className="md:col-span-4 glass-card p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
              <h5 className="font-extrabold text-slate-900 dark:text-white">Record Rotation Turn</h5>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500">New Position</label>
                <select 
                  value={newTurn.position}
                  onChange={(e) => setNewTurn({ ...newTurn, position: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Left Side">Left Lateral Side</option>
                  <option value="Right Side">Right Lateral Side</option>
                  <option value="Back">Supine (Back)</option>
                  <option value="Chair">Sitting in Armchair</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Pressure Point Skin Integrity Check</label>
                <select 
                  value={newTurn.skinCheck}
                  onChange={(e) => setNewTurn({ ...newTurn, skinCheck: e.target.value })}
                  className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-semibold focus:border-brand-500"
                >
                  <option value="Healthy (No redness)">Intact skin (No redness)</option>
                  <option value="Mild Redness (Applied cream)">Non-blanching redness (Applied cream)</option>
                  <option value="Blistering / Sore (Flagged Nurse)">Redness / Sore (Flagged Nurse immediately)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-8.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Log Turn Record
              </button>
            </form>

            {/* Turn Log Timeline */}
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-slate-150 dark:border-slate-850">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500 text-[10px] uppercase">
                    <th className="p-3">Time</th>
                    <th className="p-3">Patient Position</th>
                    <th className="p-3">Pressure Points Integrity</th>
                    <th className="p-3">Carer Initial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {turnsToday.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400"/> {log.time}
                      </td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.position}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          log.skinCheck.includes('Healthy') ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-rose-50 text-rose-700 border-rose-250 animate-pulse'
                        }`}>
                          {log.skinCheck}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-semibold">{log.carer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DailyObservationCharts;
