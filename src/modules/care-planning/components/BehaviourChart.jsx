import React, { useState } from 'react';
import { Save, AlertTriangle, Activity, MapPin, Clock, User, ShieldAlert, Check } from 'lucide-react';

const BehaviourChart = ({ patientName, onSave }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    duration: '',
    location: '',
    careNote: '',
    antecedent: '',
    behaviour: '',
    consequence: '',
    workerInvolved: 'John (Senior Carer)',
    serviceUserInvolved: patientName,
    newBehaviour: 'No',
    behaviourCategory: 'None',
    interventionUsed: 'None',
    restrictivePractice: 'None',
    incident: 'No'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (onSave) onSave();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" /> Behaviour (ABC) Chart
          </h2>
          <p className="text-purple-100 text-sm mt-1">Logging incident for {patientName}</p>
        </div>
        <AlertTriangle className="w-10 h-10 text-purple-200 opacity-50" />
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Date & Time
            </label>
            <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Duration (mins)
            </label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 30" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location
            </label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bedroom" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
          </div>
        </div>

        {/* Row 2: Care Note & ABC */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Care Note Summary</label>
            <textarea name="careNote" value={formData.careNote} onChange={handleChange} placeholder="Describe the overall incident..." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm min-h-[80px] focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Antecedent (Before)</label>
              <textarea name="antecedent" value={formData.antecedent} onChange={handleChange} placeholder="What happened right before?" className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-purple-500 dark:bg-purple-900/20 dark:border-purple-800 dark:text-white" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Behaviour (During)</label>
              <textarea name="behaviour" value={formData.behaviour} onChange={handleChange} placeholder="What was the actual behaviour?" className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-white" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Consequence (After)</label>
              <textarea name="consequence" value={formData.consequence} onChange={handleChange} placeholder="What happened immediately after?" className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 dark:bg-blue-900/20 dark:border-blue-800 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Row 3: Involved Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Worker Involved
            </label>
            <input type="text" name="workerInvolved" value={formData.workerInvolved} onChange={handleChange} className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400" readOnly />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Service User Involved
            </label>
            <input type="text" name="serviceUserInvolved" value={formData.serviceUserInvolved} onChange={handleChange} className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400" readOnly />
          </div>
        </div>

        {/* Row 4: Classification & Interventions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">New Behaviour?</label>
            <select name="newBehaviour" value={formData.newBehaviour} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Behaviour Category</label>
            <select name="behaviourCategory" value={formData.behaviourCategory} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <option value="None">None</option>
              <option value="Verbal Aggression">Verbal Aggression</option>
              <option value="Physical Aggression">Physical Aggression</option>
              <option value="Distress">Distress</option>
              <option value="Wandering">Wandering</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Intervention Used</label>
            <select name="interventionUsed" value={formData.interventionUsed} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <option value="None">None</option>
              <option value="Verbal De-escalation">Verbal De-escalation</option>
              <option value="Distraction">Distraction</option>
              <option value="Reassurance">Reassurance</option>
              <option value="Medication">Medication</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-orange-500" /> Restrictive Practice
            </label>
            <select name="restrictivePractice" value={formData.restrictivePractice} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <option value="None">None</option>
              <option value="Physical Restraint">Physical Restraint</option>
              <option value="Environmental">Environmental</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Incident logged?</label>
            <select name="incident" value={formData.incident} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-xl flex justify-center items-center gap-2 transition-colors">
            <Save className="w-5 h-5" /> Save Behaviour Log
          </button>
        </div>

      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-slide-up border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Behaviour Chart Logged!</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
              Successfully saved to incident records.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default BehaviourChart;
