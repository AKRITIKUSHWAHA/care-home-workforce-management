import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, User, FileText, PlusCircle, Clock, ChevronLeft, AlertTriangle, Activity, BarChart2, Shield, AlertOctagon } from 'lucide-react';
import CareNoteForm from './components/CareNoteForm';
import CarePlanView from './components/CarePlanView';
import BehaviourChart from './components/BehaviourChart';
import DailyObservationCharts from './components/DailyObservationCharts';
import RestrictivePractices from './components/RestrictivePractices';
import SafeguardingActionRecords from './components/SafeguardingActionRecords';

const mockPatients = [
  { id: 1, name: 'Margaret Smith', age: 78, room: '101', status: 'Stable', lastNote: '2 hours ago', hasRefusedCare: false, profilePic: 'https://i.pravatar.cc/150?img=47' },
  { id: 2, name: 'Arthur Pendelton', age: 82, room: '104', status: 'Requires Attention', lastNote: '45 mins ago', hasRefusedCare: true, profilePic: 'https://i.pravatar.cc/150?img=11' },
  { id: 3, name: 'Margaret Atwood', age: 75, room: '202', status: 'Stable', lastNote: '5 hours ago', hasRefusedCare: false, profilePic: 'https://i.pravatar.cc/150?img=5' },
  { id: 4, name: 'John Miller', age: 88, room: '205', status: 'Critical Observation', lastNote: '10 mins ago', hasRefusedCare: true, profilePic: 'https://i.pravatar.cc/150?img=33' },
];

const CarePlanningDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'form' | 'plan' | 'behaviour' | 'charts'
  const [dashboardTab, setDashboardTab] = useState('residents'); // 'residents' | 'restrictive' | 'safeguarding'

  const [patients, setPatients] = useState([
    { id: 1, name: 'Margaret Smith', age: 78, room: '101', status: 'Stable', lastNote: '2 hours ago', hasRefusedCare: false, isOverdue: false, profilePic: 'https://i.pravatar.cc/150?img=47' },
    { id: 2, name: 'Arthur Pendelton', age: 82, room: '104', status: 'Requires Attention', lastNote: '45 mins ago', hasRefusedCare: true, isOverdue: false, profilePic: 'https://i.pravatar.cc/150?img=11' },
    { id: 3, name: 'Margaret Atwood', age: 75, room: '202', status: 'Stable', lastNote: '5 hours ago', hasRefusedCare: false, isOverdue: true, profilePic: 'https://i.pravatar.cc/150?img=5' },
    { id: 4, name: 'John Miller', age: 88, room: '205', status: 'Critical Observation', lastNote: '10 mins ago', hasRefusedCare: true, isOverdue: false, profilePic: 'https://i.pravatar.cc/150?img=33' },
  ]);

  const { careNotes, addCareNote } = useApp();

  const handleSaveNote = (patientId, noteData) => {
    const patientName = patients.find(p => p.id === patientId)?.name || 'Resident';
    addCareNote(patientId, patientName, noteData.notes, noteData.hasRefusedCare, 'John (Senior Carer)', undefined, noteData.weight);

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          hasRefusedCare: noteData.hasRefusedCare,
          lastNote: 'Just now',
          isOverdue: false
        };
      }
      return p;
    }));

    setCurrentView('list');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.room.includes(searchTerm)
  );

  if (currentView === 'form' && selectedPatient) {
    return (
      <div className="space-y-4 animate-fade-in pb-10">
        <button 
          onClick={() => setCurrentView('list')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <CareNoteForm 
          patientName={selectedPatient.name} 
          onSave={(noteData) => handleSaveNote(selectedPatient.id, noteData)}
          onBehaviourShortcut={() => setCurrentView('behaviour')}
        />
      </div>
    );
  }

  if (currentView === 'plan' && selectedPatient) {
    return (
      <div className="space-y-4 animate-fade-in pb-10">
        <button 
          onClick={() => setCurrentView('list')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <CarePlanView patientName={selectedPatient.name} />
      </div>
    );
  }

  if (currentView === 'behaviour' && selectedPatient) {
    return (
      <div className="space-y-4 animate-fade-in pb-10">
        <button 
          onClick={() => setCurrentView('list')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <BehaviourChart 
          patientName={selectedPatient.name} 
          onSave={() => setCurrentView('list')}
        />
      </div>
    );
  }

  if (currentView === 'charts' && selectedPatient) {
    return (
      <div className="space-y-4 animate-fade-in pb-10">
        <button 
          onClick={() => setCurrentView('list')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <DailyObservationCharts patientName={selectedPatient.name} />
      </div>
    );
  }


  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Mock Logged-in Banner */}
      <div className="bg-slate-800 text-white dark:bg-brand-900/50 dark:text-brand-100 text-sm font-medium py-2 px-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold">J</div>
          <span>Logged in as: <strong>John (Senior Carer)</strong></span>
        </div>
        <span className="opacity-75 text-xs">All notes will be recorded under this name</span>
      </div>

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Care Planning</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage patient care plans and submit quick care notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Sub-tab navigation */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850">
            <button
              onClick={() => setDashboardTab('residents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dashboardTab === 'residents' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
              }`}
            >
              Residents List
            </button>
            <button
              onClick={() => setDashboardTab('restrictive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dashboardTab === 'restrictive' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Restrictive Practices
            </button>
            <button
              onClick={() => setDashboardTab('safeguarding')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dashboardTab === 'safeguarding' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" /> Safeguarding Logs
            </button>
          </div>
          
          {/* Search Bar */}
          {dashboardTab === 'residents' && (
            <div className="relative w-full md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                placeholder="Search room/name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Tab Views */}
      {dashboardTab === 'restrictive' ? (
        <RestrictivePractices />
      ) : dashboardTab === 'safeguarding' ? (
        <SafeguardingActionRecords />
      ) : (
        <>
          {/* Patient List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => {
              const isRed = patient.hasRefusedCare || patient.isOverdue;
              return (
                <div key={patient.id} className={`bg-white dark:bg-slate-900 rounded-2xl border ${isRed ? 'border-red-400 shadow-sm shadow-red-100 dark:shadow-none dark:border-red-500/50' : 'border-slate-200 dark:border-slate-800 shadow-sm'} overflow-hidden hover:shadow-md transition-shadow group relative`}>
                  
                  <div className="absolute top-0 right-0 flex flex-col items-end z-10">
                    {patient.hasRefusedCare && (
                      <div className="bg-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-2.5 h-2.5" /> Refused Care
                      </div>
                    )}
                    {patient.isOverdue && (
                      <div className="bg-orange-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-2.5 h-2.5" /> Not Updated
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={patient.profilePic} alt={patient.name} className="h-12 w-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-850 shadow-sm" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{patient.name}</h3>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Room {patient.room} • Age {patient.age}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 w-fit">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-slate-605 dark:text-slate-300">Last note: {patient.lastNote}</span>
                    </div>
                  </div>
                  
                  <div className="flex divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-905/50">
                    <button 
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold text-slate-600 hover:text-[#2e6559] hover:bg-slate-50 dark:text-slate-400 dark:hover:text-[#3a8273] dark:hover:bg-slate-800 transition-colors"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setCurrentView('plan');
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      View Plan
                    </button>
                    <button 
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold text-[#2e6559] bg-[#2e6559]/5 hover:bg-[#2e6559]/10 dark:bg-[#3a8273]/10 dark:text-[#3a8273] dark:hover:bg-[#3a8273]/20 transition-colors"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setCurrentView('form');
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Note
                    </button>
                    <button 
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setCurrentView('charts');
                      }}
                    >
                      <BarChart2 className="h-4 w-4" />
                      Daily Charts
                    </button>
                    <button 
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setCurrentView('behaviour');
                      }}
                    >
                      <Activity className="h-4 w-4" />
                      ABC Chart
                    </button>
                  </div>

                </div>
              );
            })}
            
            {filteredPatients.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                No patients found matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* Recent Care Notes Timeline Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🗒️</span> Recent Care Notes Feed
            </h2>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {careNotes.map((note) => (
                <div 
                  key={note.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    note.hasRefusedCare 
                      ? 'bg-red-50/60 border-red-200 text-red-950 dark:bg-red-950/10 dark:border-red-900/40 dark:text-red-200 border-l-4 border-l-red-500' 
                      : 'bg-slate-50/50 border-slate-200 dark:bg-slate-800/20 dark:border-slate-800 text-slate-700 dark:text-slate-350'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        note.hasRefusedCare 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-705 dark:text-slate-300'
                      }`}>
                        {note.patientName}
                      </span>
                      {note.hasRefusedCare && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 uppercase tracking-wider">
                          ⚠️ Refused Care
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-405 font-medium">
                      <span>Logged by: <strong>{note.author}</strong></span>
                      <span>•</span>
                      <span>{note.time}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed leading-normal">{note.note}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default CarePlanningDashboard;
