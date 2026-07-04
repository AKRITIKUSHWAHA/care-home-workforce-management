import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Car, Key, History, AlertTriangle, ChevronRight, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

const QRSecure = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePoints, setActivePoints] = useState(12);

  const [fleetVehicles, setFleetVehicles] = useState([
    { id: 1, name: 'Van #42 (Ford Transit)', status: 'In Use', user: 'David Chen', location: [51.51, -0.1] },
    { id: 2, name: 'Car #12 (Toyota Prius)', status: 'In Use', user: 'Emma Wilson', location: [51.52, -0.08] },
    { id: 3, name: 'Van #08 (Mercedes Sprinter)', status: 'Parked (Site A)', user: '-', location: [51.505, -0.09] },
  ]);

  const [recentScans, setRecentScans] = useState([
    { id: 1, user: 'Sarah Jenkins', type: 'Door Unlock', location: 'Main Entrance - Site A', coords: [51.512, -0.095], time: 'Just now', status: 'Granted', icon: Key },
    { id: 2, user: 'David Chen', type: 'Fleet Vehicle', location: 'Van #42 (Ford Transit)', coords: [51.51, -0.1], time: '2 mins ago', status: 'Granted', icon: Car },
    { id: 3, user: 'Unknown Device', type: 'Medication Room', location: 'Site B - South Wing', coords: [51.508, -0.088], time: '14 mins ago', status: 'Denied', icon: AlertTriangle },
    { id: 4, user: 'Emma Wilson', type: 'Door Unlock', location: 'Staff Room', coords: [51.511, -0.092], time: '25 mins ago', status: 'Granted', icon: Key },
    { id: 5, user: 'Dr. John Taylor', type: 'Door Unlock', location: 'Clinical Office', coords: [51.509, -0.091], time: '1 hour ago', status: 'Granted', icon: Key },
    { id: 6, user: 'Mark (Maintenance)', type: 'Door Unlock', location: 'Server Room', coords: [51.506, -0.093], time: '2 hours ago', status: 'Denied', icon: AlertTriangle },
    { id: 7, user: 'Sarah Jenkins', type: 'Fleet Vehicle', location: 'Van #42 (Returned)', coords: [51.51, -0.1], time: 'Yesterday', status: 'Granted', icon: Car },
  ]);

  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    // Simulate live movement for vehicles that are "In Use"
    const mapInterval = setInterval(() => {
      setFleetVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'In Use') {
          return {
            ...vehicle,
            location: [
              vehicle.location[0] + (Math.random() - 0.5) * 0.001,
              vehicle.location[1] + (Math.random() - 0.5) * 0.001
            ]
          };
        }
        return vehicle;
      }));
    }, 2500); // Move every 2.5 seconds

    // Simulate new live scans coming in
    const feedInterval = setInterval(() => {
      const mockUsers = ['Alice Brown', 'James Wilson', 'Dr. Smith', 'Unknown Device', 'Sophia Lee'];
      
      const locationData = [
        { name: 'Front Gate', coords: [51.515, -0.09] },
        { name: 'Medication Room', coords: [51.508, -0.088] },
        { name: 'Staff Area', coords: [51.511, -0.092] },
        { name: 'Kitchen', coords: [51.513, -0.085] },
        { name: 'Back Door', coords: [51.505, -0.098] }
      ];

      const mockTypes = ['Door Unlock', 'Fleet Vehicle', 'Time & Attendance'];
      
      const isGranted = Math.random() > 0.2; // 80% chance granted
      const loc = locationData[Math.floor(Math.random() * locationData.length)];
      
      const newScan = {
        id: Date.now(),
        user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        type: mockTypes[Math.floor(Math.random() * mockTypes.length)],
        location: loc.name,
        coords: loc.coords,
        time: 'Just now',
        status: isGranted ? 'Granted' : 'Denied',
        icon: isGranted ? Key : AlertTriangle
      };

      setRecentScans(prev => {
        const updated = [newScan, ...prev];
        return updated.slice(0, 15); // Keep max 15 items in feed
      });
    }, 6000); // Add a new scan every 6 seconds

    return () => {
      clearInterval(mapInterval);
      clearInterval(feedInterval);
    };
  }, []);

  const handleGenerateCode = () => {
    setActivePoints(prev => prev + 1);
    setIsModalOpen(false);
    
    // Add a dummy scan log for the new point
    const newLog = {
      id: Date.now(),
      user: 'System Admin',
      type: 'Code Generated',
      location: 'New Access Point',
      time: 'Just now',
      status: 'Granted',
      icon: QrCode
    };
    setRecentScans([newLog, ...recentScans]);
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 relative">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600 p-6 md:p-8 text-white shadow-lg shadow-brand-900/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <QrCode className="w-8 h-8" />
            QR Secure & Fleet
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            Manage digital access points and vehicle check-ins.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-10 rounded-xl bg-white px-4 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <QrCode className="h-4 w-4" />
          <span>Generate New Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active QR Codes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Door Access Card */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group cursor-pointer border border-slate-200/60 dark:border-slate-800/80">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.04]">
                <Key className="w-28 h-28 text-slate-800" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Door Access</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Site wide authentication</p>
                </div>
              </div>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{activePoints}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Active Points</p>
                </div>
              </div>
            </div>

            {/* Fleet Access Card */}
            <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group cursor-pointer border border-slate-200/60 dark:border-slate-800/80">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.04]">
                <Car className="w-28 h-28 text-slate-800" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Fleet Check-in</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Pool car verification</p>
                </div>
              </div>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100">5</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Vehicles in use</p>
                </div>
              </div>
            </div>

          </div>

          {/* Fleet Map Area */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 h-[400px] relative mt-4">
            <div className="absolute top-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                Live Fleet Tracking
              </h3>
            </div>
            <MapContainer 
              center={[51.51, -0.09]} 
              zoom={13} 
              className="h-full w-full z-0"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={selectedScan?.coords} />

              {fleetVehicles.map(vehicle => (
                <Marker key={vehicle.id} position={vehicle.location}>
                  <Popup className="rounded-xl overflow-hidden">
                    <div className="p-1">
                      <h3 className="font-bold text-slate-800">{vehicle.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">Driver: {vehicle.user}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${vehicle.status === 'In Use' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedScan && (
                <Marker position={selectedScan.coords}>
                  <Popup className="rounded-xl overflow-hidden">
                    <div className="p-1">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <selectedScan.icon className="w-4 h-4" />
                        {selectedScan.location}
                      </h3>
                      <p className="text-sm text-slate-600">User: {selectedScan.user}</p>
                      <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-bold rounded ${selectedScan.status === 'Granted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {selectedScan.status}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="glass-card rounded-2xl flex flex-col border border-slate-200/60 dark:border-slate-800/80 h-[500px]">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Live Scan Feed
            </h3>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto">
            {recentScans.map((scan) => (
              <div 
                key={scan.id} 
                onClick={() => setSelectedScan(scan)}
                className={`glass-card flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedScan?.id === scan.id ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'hover:-translate-y-1 hover:shadow-md'}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${scan.status === 'Granted' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-500 dark:bg-rose-500/10'}`}>
                  <scan.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{scan.user}</p>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">{scan.location}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${scan.status === 'Granted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                      {scan.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{scan.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Generate Code */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Generate Access QR</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Access Point Name</label>
                <input type="text" placeholder="e.g. Back Door Entrance" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Type</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                  <option>Door Unlock</option>
                  <option>Fleet Vehicle</option>
                  <option>Medication Room</option>
                </select>
              </div>
              
              <button 
                onClick={handleGenerateCode}
                className="w-full mt-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-colors"
              >
                Create & Print QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRSecure;
