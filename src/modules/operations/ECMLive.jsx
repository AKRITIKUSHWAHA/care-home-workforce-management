import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, AlertCircle, Search, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const ECMLive = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [fieldStaff] = useState([
    { id: 1, name: 'Sarah Jenkins', role: 'Senior Carer', status: 'On Time', location: [51.505, -0.09], time: '09:00 AM', client: 'Mrs. Smith' },
    { id: 2, name: 'David Chen', role: 'Support Worker', status: 'Late', location: [51.51, -0.1], time: '09:15 AM', client: 'Mr. Johnson' },
    { id: 3, name: 'Emma Wilson', role: 'Care Assistant', status: 'En Route', location: [51.515, -0.09], time: '09:30 AM', client: 'Mrs. Davis' },
    { id: 4, name: 'James Brown', role: 'Nurse', status: 'Completed', location: [51.50, -0.08], time: '08:45 AM', client: 'Mr. Taylor' },
  ]);

  // Make functionality work: Filter based on Search and Tabs
  const filteredStaff = fieldStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          staff.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'late' && staff.status === 'Late') || 
                       (activeTab === 'en-route' && staff.status === 'En Route');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 animate-fade-in p-2 h-full flex flex-col">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600 p-6 md:p-8 text-white shadow-lg shadow-brand-900/10 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <Navigation className="w-8 h-8" />
            ECM / GPS Live
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            Live operations tracking & call monitoring.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Sidebar Panel */}
        <div className="w-full lg:w-96 glass-card rounded-2xl flex flex-col overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-800/80">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff or clients..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={() => setActiveTab('all')} className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}>
                All
              </button>
              <button onClick={() => setActiveTab('late')} className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'late' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}>
                Late
              </button>
              <button onClick={() => setActiveTab('en-route')} className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'en-route' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}>
                En Route
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/10">
            {filteredStaff.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">No matching staff found.</div>
            ) : (
              filteredStaff.map((staff) => (
                <div 
                  key={staff.id} 
                  onClick={() => setSelectedStaff(staff)}
                  className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${selectedStaff?.id === staff.id ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'glass-card-hover hover:-translate-y-1'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{staff.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{staff.role}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      staff.status === 'On Time' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      staff.status === 'Late' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                      staff.status === 'Completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{staff.client}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{staff.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80">
          <MapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController center={selectedStaff?.location} />

            {filteredStaff.map(staff => (
              <Marker key={staff.id} position={staff.location}>
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1">
                    <h3 className="font-bold text-slate-800">{staff.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{staff.client}</p>
                    <span className="inline-block px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded">
                      {staff.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Floating Stats */}
          <div className="absolute top-6 right-6 z-[400] flex flex-col sm:flex-row gap-4">
            <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Time</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">84%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECMLive;
