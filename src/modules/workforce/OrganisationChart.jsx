import React from 'react';
import { Users, Shield, Award, UserCheck, Star } from 'lucide-react';

export const OrganisationChart = () => {
  const staffHierarchy = {
    role: 'Registered Manager',
    name: 'Sarah Jenkins',
    desc: 'CQC Registered Manager & Operations Lead',
    icon: Shield,
    color: 'bg-indigo-650 border-indigo-700 text-white shadow-indigo-500/20',
    subordinates: [
      {
        role: 'Deputy Manager / Lead Nurse',
        name: 'James Carter',
        desc: 'Clinical Quality & Staff Roster lead',
        icon: Award,
        color: 'bg-blue-600 border-blue-700 text-white shadow-blue-500/20',
        subordinates: [
          {
            role: 'Care Leads / Seniors',
            name: 'John & Team',
            desc: 'Daily shift allocations, medication audits',
            icon: Star,
            color: 'bg-emerald-600 border-emerald-700 text-white shadow-emerald-500/20',
            subordinates: [
              {
                role: 'Health Care Assistants (HCAs)',
                name: 'Carer Pool (12 staff)',
                desc: 'Daily personal care, hydration, logs',
                icon: UserCheck,
                color: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
              }
            ]
          },
          {
            role: 'Support Services Lead',
            name: 'Jane (Housekeeper) & Cook',
            desc: 'Infection control & nutritional support',
            icon: Users,
            color: 'bg-amber-600 border-amber-700 text-white shadow-amber-500/20'
          }
        ]
      }
    ]
  };

  const renderNode = (node) => {
    const NodeIcon = node.icon;
    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Node Box */}
        <div className={`p-4 rounded-2xl border-2 w-64 text-center shadow-lg transition-transform hover:scale-105 ${node.color}`}>
          <div className="mx-auto w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
            <NodeIcon className="w-5 h-5 text-current" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">{node.role}</span>
          <p className="text-sm font-extrabold">{node.name}</p>
          <p className="text-[10px] leading-relaxed mt-1 opacity-80 font-medium">{node.desc}</p>
        </div>

        {/* Subordinates Connector */}
        {node.subordinates && node.subordinates.length > 0 && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical Connector Line */}
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            
            {/* Subordinates Row */}
            <div className="flex justify-center gap-8 relative">
              {node.subordinates.map((sub, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Horizontal Connector Line for branches */}
                  {node.subordinates.length > 1 && (
                    <div 
                      className="absolute top-0 bg-slate-300 dark:bg-slate-700 h-0.5"
                      style={{
                        left: idx === 0 ? '50%' : '0',
                        right: idx === node.subordinates.length - 1 ? '50%' : '0',
                        width: '100%'
                      }}
                    />
                  )}
                  {/* Vertical Connector from branch line to child */}
                  {node.subordinates.length > 1 && <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />}
                  {renderNode(sub)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Users className="w-8 h-8 text-slate-350" />
            Organizational Structure & Governance Chart
          </h1>
          <p className="mt-1 text-sm text-slate-200 font-medium">
            Digitized management hierarchy, reporting chains, and functional care home roles.
          </p>
        </div>
      </div>

      {/* Hierarchy Render Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-x-auto flex justify-center">
        <div className="min-w-[650px] py-4">
          {renderNode(staffHierarchy)}
        </div>
      </div>
    </div>
  );
};

export default OrganisationChart;
