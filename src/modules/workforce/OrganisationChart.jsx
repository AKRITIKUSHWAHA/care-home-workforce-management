import React from 'react';

export const OrganisationChart = () => {
  return (
    <div className="space-y-8 animate-fade-in p-6 bg-[#f8fafc] dark:bg-slate-950 rounded-3xl min-h-[600px] flex flex-col items-center">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black tracking-widest text-slate-800 dark:text-white uppercase font-sans">
          AS CARE
        </h1>
        <h2 className="text-lg font-bold tracking-wider text-slate-650 dark:text-slate-400 uppercase">
          ORGANISATION CHART
        </h2>
      </div>

      {/* Hierarchy Containers */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 mt-4">
        
        {/* Row 1: Nominated Individual */}
        <div className="flex justify-center w-full">
          <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-72 text-center shadow-md transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
            <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">NOMINATED INDIVIDUAL</span>
            <p className="text-sm font-bold text-white mt-1">Dursha Krishan</p>
          </div>
        </div>

        {/* Row 2: Registered Manager */}
        <div className="flex justify-center w-full">
          <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-72 text-center shadow-md transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
            <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">REGISTERED MANAGER</span>
            <p className="text-xs font-semibold text-white mt-1 italic opacity-90">Vacant / Recruitment</p>
          </div>
        </div>

        {/* Row 3: Home Manager */}
        <div className="flex justify-center w-full">
          <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-72 text-center shadow-md transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
            <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">HOME MANAGER</span>
            <p className="text-sm font-bold text-white mt-1">Paula Merry</p>
          </div>
        </div>

        {/* Row 4: 3 columns (Deputy Manager, Team Leader, Domestic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
          {/* Column 1: Deputy Manager */}
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-full text-center shadow-md min-h-[100px] flex flex-col justify-center transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
              <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">DEPUTY MANAGER</span>
              <p className="text-sm font-bold text-white mt-1">Sahil</p>
              <p className="text-[10px] text-white/90 font-semibold mt-1">
                (Working Towards Level 5 Leadership & Management)
              </p>
            </div>
          </div>

          {/* Column 2: Team Leader */}
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-full text-center shadow-md min-h-[100px] flex flex-col justify-center transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
              <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">TEAM LEADER</span>
              <p className="text-sm font-bold text-white mt-1">Haritha Sasidharan</p>
            </div>
          </div>

          {/* Column 3: Domestic */}
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-full text-center shadow-md min-h-[100px] flex flex-col justify-center transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
              <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">DOMESTIC</span>
              <p className="text-sm font-bold text-white mt-1">Carol</p>
            </div>
          </div>
        </div>

        {/* Row 5: Under Deputy Manager (HCA Leads & Health Care Assistants) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
          {/* HCA Leads (under Deputy Manager) */}
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-full text-center shadow-md transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
              <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">HCA LEADS</span>
              <div className="text-xs font-semibold text-white mt-1.5 space-y-0.5">
                <p>Abhina</p>
                <p>Harry</p>
                <p>Firos</p>
              </div>
            </div>
          </div>

          {/* Health Care Assistants (next to HCA Leads) */}
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="p-5 rounded-2xl bg-[#adc7c2] border border-[#91aba6] w-full text-center shadow-md transition-all hover:scale-[1.02] shadow-[#adc7c2]/10">
              <span className="text-[11px] font-black uppercase tracking-wider block text-white opacity-95">HEALTH CARE ASSISTANTS</span>
              <div className="text-xs font-semibold text-white mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-0.5">
                <span>Joel</span>
                <span>Niranjala</span>
                <span>Chelsee</span>
                <span>Kathy</span>
                <span>Nathan</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrganisationChart;
