import React, { useState, useEffect } from 'react';
import { User, Activity, Trash2, CheckCircle, RotateCw, Sparkles } from 'lucide-react';

const BodyMap = ({ patientName = "Alan" }) => {
  const [spots, setSpots] = useState([
    { id: 'spot-1', x: 120, y: 220, view: 'back', type: 'Pressure Sore Stage 2', severity: 'High', date: '08/06/2026', notes: 'Apply hydrocolloid dressing. Reposition resident every 2 hours.' },
    { id: 'spot-2', x: 110, y: 150, view: 'front', type: 'Bruising', severity: 'Low', date: '09/06/2026', notes: 'Slight discolouration from fall. No dressing needed.' },
    { id: 'spot-3', x: 85, y: 180, view: 'left', type: 'Skin Rash / Redness', severity: 'Medium', date: '12/06/2026', notes: 'Apply barrier cream twice daily after personal care.' }
  ]);

  const [activeView, setActiveView] = useState('front'); // 'front' | 'right' | 'back' | 'left'
  const [rotationAngle, setRotationAngle] = useState(0); // 0, 90, 180, 270 degrees
  const [selectedSpot, setSelectedSpot] = useState(null);

  // New Spot Form
  const [newSpotForm, setNewSpotForm] = useState({
    x: 0,
    y: 0,
    view: 'front',
    type: 'Pressure Sore Stage 1',
    severity: 'Medium',
    notes: ''
  });

  const [isAdding, setIsAdding] = useState(false);

  // Synchronize rotation angle with view selection
  useEffect(() => {
    switch (activeView) {
      case 'front': setRotationAngle(0); break;
      case 'right': setRotationAngle(90); break;
      case 'back': setRotationAngle(180); break;
      case 'left': setRotationAngle(270); break;
      default: setRotationAngle(0);
    }
  }, [activeView]);

  const handleBodyClick = (e, view) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    setNewSpotForm({
      x,
      y,
      view,
      type: 'Pressure Sore Stage 1',
      severity: 'Medium',
      notes: ''
    });
    setIsAdding(true);
    setSelectedSpot(null);
  };

  const handleAddSpotSubmit = (e) => {
    e.preventDefault();
    const newSpot = {
      id: `spot-${Date.now()}`,
      x: newSpotForm.x,
      y: newSpotForm.y,
      view: newSpotForm.view,
      type: newSpotForm.type,
      severity: newSpotForm.severity,
      date: new Date().toLocaleDateString('en-GB'),
      notes: newSpotForm.notes
    };
    setSpots(prev => [...prev, newSpot]);
    setIsAdding(false);
    setSelectedSpot(newSpot);
  };

  const handleDeleteSpot = (id) => {
    setSpots(prev => prev.filter(s => s.id !== id));
    if (selectedSpot && selectedSpot.id === id) {
      setSelectedSpot(null);
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'High': return 'bg-rose-500 text-white border-rose-600 ring-rose-500/30';
      case 'Medium': return 'bg-amber-500 text-white border-amber-600 ring-amber-500/30';
      case 'Low':
      default: return 'bg-indigo-500 text-white border-indigo-600 ring-indigo-500/30';
    }
  };

  // Human body profiles SVGs outlines
  const renderBodySVG = (view) => {
    switch (view) {
      case 'front':
        return (
          // Anterior front outline
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {/* Head & Neck */}
            <path d="M110,30 C122,30 128,38 128,48 C128,58 122,64 110,64 C98,64 92,58 92,48 C92,38 98,30 110,30 Z" className="stroke-cyan-500" />
            <path d="M104,64 L104,74 M116,64 L116,74" className="stroke-cyan-500" />
            {/* Torso & Shoulders */}
            <path d="M84,84 C95,74 125,74 136,84 L142,120 C146,140 148,160 146,180 L140,230 C136,240 134,242 128,242 L92,242 C86,242 84,240 80,230 L74,180 C72,160 74,140 78,120 Z" className="stroke-cyan-400" />
            {/* Arms */}
            <path d="M78,92 L62,150 C58,165 52,185 52,205 C52,215 56,220 62,220 C66,220 68,215 72,200 L80,140" className="stroke-cyan-400" />
            <path d="M142,92 L158,150 C162,165 168,185 168,205 C168,215 164,220 158,220 C154,220 152,215 148,200 L140,140" className="stroke-cyan-400" />
            {/* Legs */}
            <path d="M84,242 L80,310 C78,330 76,350 78,380 C79,388 74,394 84,394 C92,394 94,388 94,370 L98,310" className="stroke-cyan-500" />
            <path d="M136,242 L140,310 C142,330 144,350 142,380 C141,388 146,394 136,394 C128,394 126,388 126,370 L122,310" className="stroke-cyan-500" />
            {/* Anatomical Details (Chest, Abs, Knees) */}
            <path d="M96,120 L124,120 M92,160 C100,165 120,165 128,160" strokeDasharray="3,3" className="stroke-cyan-500/50" />
            <circle cx="86" cy="330" r="4" strokeDasharray="2,2" className="stroke-cyan-500/40" />
            <circle cx="134" cy="330" r="4" strokeDasharray="2,2" className="stroke-cyan-500/40" />
          </g>
        );
      case 'back':
        return (
          // Posterior back outline
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {/* Head & Neck */}
            <path d="M110,30 C122,30 128,38 128,48 C128,58 122,64 110,64 C98,64 92,58 92,48 Z" className="stroke-emerald-500" />
            <path d="M104,64 L104,74 M116,64 L116,74" className="stroke-emerald-500" />
            {/* Spine Line */}
            <path d="M110,74 L110,242" strokeDasharray="4,4" className="stroke-emerald-500/70" />
            {/* Torso & Shoulders */}
            <path d="M84,84 C95,74 125,74 136,84 L142,120 C146,140 148,160 146,180 L140,230 C136,240 134,242 128,242 L92,242 C86,242 84,240 80,230 L74,180 Z" className="stroke-emerald-400" />
            {/* Left and Right shoulder blades */}
            <path d="M94,100 C98,110 102,110 102,100" className="stroke-emerald-400/50" />
            <path d="M126,100 C122,110 118,110 118,100" className="stroke-emerald-400/50" />
            {/* Arms */}
            <path d="M78,92 L62,150 L52,205 C52,215 56,220 62,220 C66,220 72,200 L80,140" className="stroke-emerald-400" />
            <path d="M142,92 L158,150 L168,205 C168,215 164,220 158,220 C154,220 148,200 L140,140" className="stroke-emerald-400" />
            {/* Legs */}
            <path d="M84,242 L80,310 C78,330 76,350 78,380 C79,388 74,394 84,394 L98,310" className="stroke-emerald-500" />
            <path d="M136,242 L140,310 C142,330 144,350 142,380 C141,388 146,394 136,394 L122,310" className="stroke-emerald-500" />
          </g>
        );
      case 'left':
        return (
          // Left Lateral profile outline
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {/* Head (facing left) */}
            <path d="M116,30 C128,30 132,38 132,48 C132,58 126,64 116,64 C110,64 102,62 100,56 L96,52 L102,48 L98,42 L106,36 C108,32 112,30 116,30 Z" className="stroke-purple-500" />
            <path d="M110,64 L110,74" className="stroke-purple-500" />
            {/* Torso & Side Profile */}
            <path d="M116,74 C132,74 136,94 136,130 C136,160 132,190 128,215 C124,235 122,242 116,242 L98,242 C92,242 90,230 90,215 L94,130 C96,94 104,74 116,74 Z" className="stroke-purple-400" />
            {/* Left Arm hanging down */}
            <path d="M116,84 L108,140 L102,200 C100,210 104,215 110,215 C116,215 118,205 120,190 L126,130" className="stroke-purple-400" />
            {/* Left Leg side profile */}
            <path d="M102,242 L100,310 C98,335 96,360 98,382 C99,392 94,394 104,394 C112,394 114,385 114,370 L118,310" className="stroke-purple-500" />
          </g>
        );
      case 'right':
        return (
          // Right Lateral profile outline
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {/* Head (facing right) */}
            <path d="M104,30 C92,30 88,38 88,48 C88,58 94,64 104,64 C110,64 118,62 120,56 L124,52 L118,48 L122,42 L114,36 C112,32 108,30 104,30 Z" className="stroke-purple-500" />
            <path d="M110,64 L110,74" className="stroke-purple-500" />
            {/* Torso & Side Profile */}
            <path d="M104,74 C88,74 84,94 84,130 C84,160 88,190 92,215 C96,235 98,242 104,242 L122,242 C128,242 130,230 130,215 L126,130 C124,94 116,74 104,74 Z" className="stroke-purple-400" />
            {/* Right Arm hanging down */}
            <path d="M104,84 L112,140 L118,200 C120,210 116,215 110,215 C104,215 102,205 100,190 L94,130" className="stroke-purple-400" />
            {/* Right Leg side profile */}
            <path d="M118,242 L120,310 C122,335 124,360 122,382 C121,392 126,394 116,394 C108,394 106,385 106,370 L102,310" className="stroke-purple-500" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="border-b dark:border-slate-800 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <span>Interactive 3D Wound & Skin Integrity Map</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Click blueprint outlines to place wound marker pins. Slide rotation wheel to view body profiles.</p>
        </div>

        {/* 3D Rotation selectors */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 self-start sm:self-auto">
          <button
            onClick={() => { setActiveView('front'); setIsAdding(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'front' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => { setActiveView('right'); setIsAdding(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'right' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'
            }`}
          >
            Right Lateral
          </button>
          <button
            onClick={() => { setActiveView('back'); setIsAdding(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'back' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'
            }`}
          >
            Posterior (Back)
          </button>
          <button
            onClick={() => { setActiveView('left'); setIsAdding(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeView === 'left' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'
            }`}
          >
            Left Lateral
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Left Column: Holographic 3D Body Outline */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800 relative min-h-[480px] overflow-hidden">
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <span className="absolute top-3 left-4 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {activeView === 'front' ? 'Anterior (Front)' : activeView === 'back' ? 'Posterior (Back)' : activeView === 'left' ? 'Left Lateral' : 'Right Lateral'} Profile
          </span>

          <span className="absolute top-3 right-4 text-[9px] font-bold text-slate-400 text-right leading-relaxed select-none">
            Click model to<br/>log skin pin
          </span>

          {/* Interactive 3D Spinning Wrapper */}
          <div 
            className="relative cursor-crosshair w-[220px] h-[400px] select-none transition-transform duration-500 ease-out"
            style={{ 
              transform: `rotateY(${rotationAngle}deg)`,
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* SVG Layer (Counter-rotates internal drawings back so pins display correctly) */}
            <div 
              onClick={(e) => handleBodyClick(e, activeView)}
              className="w-full h-full relative"
              style={{ transform: `rotateY(${-rotationAngle}deg)` }}
            >
              <svg 
                className="w-full h-full text-slate-300 dark:text-slate-700" 
                viewBox="0 0 220 400" 
                fill="none"
              >
                {renderBodySVG(activeView)}
              </svg>

              {/* Render Wound Pins */}
              {spots.filter(s => s.view === activeView).map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedSpot(s); setIsAdding(false); }}
                  className={`absolute w-6.5 h-6.5 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center font-black text-[10px] border shadow-lg transition-all active:scale-95 animate-bounce ring-4 ${
                    getSeverityColor(s.severity)
                  } ${selectedSpot && selectedSpot.id === s.id ? 'ring-brand-500 scale-120 border-white' : ''}`}
                  style={{ left: s.x, top: s.y }}
                  title={`${s.type} (${s.severity} severity)`}
                >
                  !
                </button>
              ))}

              {/* Render temporary placement pin */}
              {isAdding && newSpotForm.view === activeView && (
                <div
                  className="absolute w-6.5 h-6.5 -ml-3.5 -mt-3.5 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-xs animate-pulse border-2 border-white shadow-lg"
                  style={{ left: newSpotForm.x, top: newSpotForm.y }}
                >
                  +
                </div>
              )}
            </div>
          </div>

          {/* 3D Rotation wheel helper */}
          <div className="w-full max-w-xs mt-4 flex items-center gap-3 bg-slate-100/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <RotateCw className="w-4 h-4 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
            <input 
              type="range" 
              min="0" 
              max="3" 
              value={activeView === 'front' ? 0 : activeView === 'right' ? 1 : activeView === 'back' ? 2 : 3}
              onChange={(e) => {
                const vals = ['front', 'right', 'back', 'left'];
                setActiveView(vals[parseInt(e.target.value)]);
                setIsAdding(false);
              }}
              className="w-full h-1.5 rounded bg-slate-250 dark:bg-slate-700 outline-none accent-[#2e6559] cursor-pointer"
            />
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">{rotationAngle}°</span>
          </div>

        </div>

        {/* Right Column: Wound Form & Observations Register */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Skin Observations List */}
          <div className="glass-card rounded-xl p-4 border border-slate-150 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-500" />
              <span>Logged Skin Deficits Register ({spots.length})</span>
            </h4>
            
            {spots.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No skin issues logged. Resident has fully intact skin integrity.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {spots.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => { setSelectedSpot(s); setIsAdding(false); setActiveView(s.view); }}
                    className={`p-2.5 rounded-xl border text-xs flex justify-between items-center cursor-pointer transition-all ${
                      selectedSpot && selectedSpot.id === s.id
                        ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20'
                        : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`h-1.5 w-1.5 rounded-full ${s.severity === 'High' ? 'bg-rose-500 animate-ping' : s.severity === 'Medium' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                        <span className="text-slate-800 dark:text-slate-200">{s.type}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">({s.view} view)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{s.notes}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-mono font-bold">{s.date}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSpot(s.id); }}
                        className="text-slate-400 hover:text-rose-500 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form area: Add or details views */}
          {isAdding ? (
            <form onSubmit={handleAddSpotSubmit} className="glass-card rounded-xl p-4 border border-brand-200 bg-brand-500/5 dark:border-brand-900/30 dark:bg-brand-950/10 space-y-3.5 text-xs animate-slide-up">
              <h4 className="font-extrabold text-xs text-brand-700 dark:text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Log New Skin integrity Pin</span>
              </h4>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550">Incident Type</label>
                  <select
                    value={newSpotForm.type}
                    onChange={(e) => setNewSpotForm({ ...newSpotForm, type: e.target.value })}
                    className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-bold focus:border-brand-500 dark:text-white"
                  >
                    <option value="Pressure Sore Stage 1">Pressure Sore Stage 1</option>
                    <option value="Pressure Sore Stage 2">Pressure Sore Stage 2</option>
                    <option value="Pressure Sore Stage 3">Pressure Sore Stage 3</option>
                    <option value="Pressure Sore Stage 4">Pressure Sore Stage 4</option>
                    <option value="Bruising">Bruising</option>
                    <option value="Tear / Cut">Skin Tear / Cut</option>
                    <option value="Rash">Skin Rash / Redness</option>
                    <option value="Other Wound">Other / Wound / Burn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550">Severity Level</label>
                  <select
                    value={newSpotForm.severity}
                    onChange={(e) => setNewSpotForm({ ...newSpotForm, severity: e.target.value })}
                    className="w-full h-8.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 outline-none font-bold focus:border-brand-500 dark:text-white"
                  >
                    <option value="Low">Low Severity</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="High">High Severity</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550">Treatment & Dressing Notes</label>
                <textarea
                  required
                  placeholder="e.g. Cleansed wound with normal saline. Applied hydrocolloid dressing. Reposition resident every 2 hours."
                  value={newSpotForm.notes}
                  onChange={(e) => setNewSpotForm({ ...newSpotForm, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg min-h-[70px] outline-none focus:border-brand-500 dark:text-white font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="h-8 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-sm"
                >
                  Place Marker
                </button>
              </div>
            </form>
          ) : selectedSpot ? (
            <div className="glass-card rounded-xl p-4 border border-slate-150 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 text-xs animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded font-black text-[8px] uppercase ${
                    selectedSpot.severity === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}>
                    {selectedSpot.severity} Severity
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5">{selectedSpot.type}</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{selectedSpot.date}</span>
              </div>

              <div className="bg-slate-55/40 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850 leading-relaxed font-semibold text-slate-600 dark:text-slate-350">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Treatment directives & dressing notes</span>
                {selectedSpot.notes}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="h-8.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 font-bold transition-colors"
                >
                  Clear Details
                </button>
              </div>
            </div>
          ) : (
            <div className="h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 italic bg-slate-50/20 select-none">
              Select a pin or click body outline to log skin integrity.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default BodyMap;
