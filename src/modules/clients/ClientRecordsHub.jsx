import React, { useState } from 'react';
import { 
  UserPlus, 
  Calendar, 
  Pill, 
  ClipboardType, 
  Activity, 
  Scale, 
  Cross,
  FileCheck2,
  Users,
  ShieldCheck,
  FileText
} from 'lucide-react';
import ClientRegister from './ClientRegister';
import ClientSchedules from './ClientSchedules';
import MARChart from './MARChart';
import CareNotes from './CareNotes';
import ClinicalObservations from './ClinicalObservations';
import LegalCapacity from './LegalCapacity';
import EndOfLife from './EndOfLife';
import ExternalServices from './ExternalServices';
import WeeklyMARSignoff from './WeeklyMARSignoff';
import ResidentComplianceMatrix from './ResidentComplianceMatrix';
import ResidentAdmissionPack from './ResidentAdmissionPack';

const ClientRecordsHub = () => {
  const [activeTab, setActiveTab] = useState('register');

  const tabs = [
    { id: 'register', label: 'Client Register', icon: UserPlus },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'external', label: 'External Services', icon: Users },
    { id: 'mar', label: 'MAR Chart', icon: Pill },
    { id: 'weekly-mar', label: 'Weekly MAR Sign-off', icon: FileCheck2 },
    { id: 'notes', label: 'Care Notes', icon: ClipboardType },
    { id: 'obs', label: 'Observations', icon: Activity },
    { id: 'legal', label: 'MCA & DoLS', icon: Scale },
    { id: 'eol', label: 'End of Life', icon: Cross },
    { id: 'compliance-matrix', label: 'Resident Document Matrix', icon: ShieldCheck },
    { id: 'admission-pack', label: 'Admission Pack', icon: FileText }
  ];

  return (
    <div className="space-y-4 animate-fade-in p-1">
      {/* Tab Navigation */}
      <div className="glass-card rounded-2xl p-2 border border-slate-200/60 dark:border-slate-800/80 overflow-x-auto flex gap-2 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-500 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2 relative">
        {activeTab === 'register' && <div className="animate-fade-in"><ClientRegister /></div>}
        {activeTab === 'schedules' && <div className="animate-fade-in"><ClientSchedules /></div>}
        {activeTab === 'external' && <div className="animate-fade-in"><ExternalServices /></div>}
        {activeTab === 'mar' && <div className="animate-fade-in"><MARChart /></div>}
        {activeTab === 'weekly-mar' && <div className="animate-fade-in"><WeeklyMARSignoff /></div>}
        {activeTab === 'notes' && <div className="animate-fade-in"><CareNotes /></div>}
        {activeTab === 'obs' && <div className="animate-fade-in"><ClinicalObservations /></div>}
        {activeTab === 'legal' && <div className="animate-fade-in"><LegalCapacity /></div>}
        {activeTab === 'eol' && <div className="animate-fade-in"><EndOfLife /></div>}
        {activeTab === 'compliance-matrix' && <div className="animate-fade-in"><ResidentComplianceMatrix /></div>}
        {activeTab === 'admission-pack' && <div className="animate-fade-in"><ResidentAdmissionPack /></div>}
      </div>
    </div>
  );
};

export default ClientRecordsHub;
