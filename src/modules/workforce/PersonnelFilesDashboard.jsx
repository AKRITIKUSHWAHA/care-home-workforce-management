import React, { useState } from 'react';
import { Users, ShieldCheck, AlertTriangle, CheckCircle, Plus, Trash2, Calendar, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonnelFilesDashboard = () => {
  const { employees, currentRole } = useApp();
  const [onboardingChecks, setOnboardingChecks] = useState([
    { id: '1', name: 'Sarah Jenkins', role: 'Manager', rtw: 'Compliant', dbs: 'Compliant', refs: 'Compliant', gpdr: 'Signed', contract: 'Signed', induction: 'Completed' },
    { id: '2', name: 'James Carter', role: 'Deputy Manager', rtw: 'Compliant', dbs: 'Compliant', refs: 'Compliant', gpdr: 'Signed', contract: 'Signed', induction: 'Completed' },
    { id: '3', name: 'John', role: 'Senior Carer', rtw: 'Compliant', dbs: 'Compliant', refs: 'Compliant', gpdr: 'Signed', contract: 'Signed', induction: 'Completed' },
    { id: '4', name: 'Jane', role: 'Domestic Housekeeper', rtw: 'Compliant', dbs: 'Compliant', refs: 'Compliant', gpdr: 'Signed', contract: 'Signed', induction: 'Completed' }
  ]);

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-teal-350" />
            Personnel Files & Compliance Audit Registry
          </h1>
          <p className="mt-1 text-sm text-teal-100 font-medium">
            Digitized HR files audit, Right to Work (RTW) verifications, DBS checks tracker, and signed employment contracts.
          </p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">RTW Cleared Staff</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
          </div>
          <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Active DBS Audits</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{onboardingChecks.length}</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Missing Declarations</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">0</p>
          </div>
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-955/20 text-amber-600 dark:text-amber-450 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Compliance Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">Staff Onboarding Check Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Designated Role</th>
                <th className="px-6 py-4">Right to Work (RTW)</th>
                <th className="px-6 py-4">DBS Check</th>
                <th className="px-6 py-4">References Logged</th>
                <th className="px-6 py-4">GDPR Signed</th>
                <th className="px-6 py-4">Contract Status</th>
                <th className="px-6 py-4 text-center">Induction Pack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {onboardingChecks.map((staff, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{staff.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{staff.role}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-450">{staff.rtw}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-450">{staff.dbs}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-450">{staff.refs}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-305">{staff.gpdr}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-305">{staff.contract}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-450">
                      {staff.induction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonnelFilesDashboard;
