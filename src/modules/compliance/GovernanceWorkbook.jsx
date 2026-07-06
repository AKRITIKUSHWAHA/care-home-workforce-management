import React, { useState } from 'react';
import { Award, ShieldAlert, CheckCircle, BarChart3, Star, TrendingUp, Compass, Plus, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GovernanceWorkbook = () => {
  const { currentRole } = useApp();
  const [governanceMetrics, setGovernanceMetrics] = useState([
    { id: '1', domain: 'Safe', score: 94, status: 'Outstanding', target: 90, details: 'Incident rates are low, all fire drills are updated.' },
    { id: '2', domain: 'Effective', score: 88, status: 'Good', target: 90, details: 'Supervision metrics met. Care plan reviews at 85%.' },
    { id: '3', domain: 'Caring', score: 96, status: 'Outstanding', target: 90, details: 'Exemplary client surveys, high resident satisfaction.' },
    { id: '4', domain: 'Responsive', score: 91, status: 'Good', target: 90, details: 'Call bell response averages 28 seconds.' },
    { id: '5', domain: 'Well-Led', score: 92, status: 'Outstanding', target: 90, details: 'Training matrix is up to date, DBS audit logs clear.' }
  ]);

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-indigo-800 to-indigo-600 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-350" />
            CQC Governance Ledger
          </h1>
          <p className="mt-1 text-sm text-indigo-100 font-medium">
            Digitized CQC domain compliance, quality audit ledgers, and institutional governance scores.
          </p>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {governanceMetrics.map((domain) => (
          <div key={domain.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                {domain.domain}
              </span>
              <span className={`text-[10px] font-bold ${domain.score >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {domain.score}%
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CQC Rating</span>
              <p className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-450 fill-amber-450" />
                {domain.status}
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${domain.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${domain.score}%` }}
              />
            </div>
            
            <p className="text-[10.5px] leading-relaxed text-slate-500 font-medium">
              {domain.details}
            </p>
          </div>
        ))}
      </div>

      {/* KPI summaries */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Governance Targets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Compliance Targets Progress
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Care Plan Audits Completed', current: 15, target: 15, unit: 'plans' },
              { label: 'DBS & Vetting Cleared', current: 14, target: 14, unit: 'staff' },
              { label: 'Mandatory Training compliance', current: 92, target: 95, unit: '%' },
              { label: 'Medication Audits Score', current: 98, target: 95, unit: '%' }
            ].map((target, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">{target.label}</span>
                  <span className="text-slate-800 dark:text-white">
                    {target.current}/{target.target}{target.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (target.current / target.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Actions Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Active Governance Watchlist
          </h3>

          <div className="space-y-2">
            {[
              { title: 'Update lift LOLER safety certification', due: 'In 18 days', status: 'Pending' },
              { title: 'DBS Renewal required for Senior Carer', due: 'In 5 days', status: 'Immediate Action' },
              { title: 'MUST review for 2 residents', due: 'Overdue by 2 days', status: 'Overdue' }
            ].map((watch, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{watch.title}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">{watch.due}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                  ${watch.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-405' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-450'}`}>
                  {watch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceWorkbook;
