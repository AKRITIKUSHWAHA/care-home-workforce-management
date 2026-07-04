import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Eye, Plus, Calendar, Clock, MapPin, User, AlertCircle, FileText, CheckCircle, 
  Search, Activity, Paperclip, ChevronRight, UserCheck, ShieldAlert, FileClock, 
  Trash2, ArrowLeft, Send, CheckCircle2, AlertTriangle, FileSpreadsheet, X, 
  TrendingUp, Settings, PlusCircle, Trash, Download, Sparkles, Sliders
} from 'lucide-react';

const RESIDENTS = [
  'Eleanor Vance',
  'Arthur Pendelton',
  'Mary Green',
  'Harold Smith',
  'Mary Berry'
];

const RESIDENT_PROFILES = {
  'Eleanor Vance': { room: 'Room 102', age: 84, risk: 'High Fall Risk', admissionDate: '2023-05-12', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', carerNotes: 'Requires 1-to-1 assistance when transferring from chair to walker.' },
  'Arthur Pendelton': { room: 'Room 205', age: 79, risk: 'Medium Mobility', admissionDate: '2024-02-18', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', carerNotes: 'Meds compliance should be checked daily. Prone to refusing morning doses.' },
  'Mary Green': { room: 'Room 114', age: 91, risk: 'High Dementia', admissionDate: '2022-09-01', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120', carerNotes: 'Gets disoriented during evening hours. Needs gentle reassurance.' },
  'Harold Smith': { room: 'Room 108', age: 82, risk: 'High Infection Risk', admissionDate: '2023-11-05', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', carerNotes: 'Monitor hydration levels closely. Log all fluid intakes.' },
  'Mary Berry': { room: 'Room 211', age: 87, risk: 'Medium Fall Risk', admissionDate: '2024-01-15', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', carerNotes: 'Uses walking frame. Ensure path is clear of clutter.' }
};

const getResidentProfile = (name) => {
  return RESIDENT_PROFILES[name] || { 
    room: 'Room 110', 
    age: 85, 
    risk: 'Standard Care', 
    admissionDate: '2024-01-10', 
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', 
    carerNotes: 'Follow standard care home observation plan.' 
  };
};

export default function ObservationFramework() {
  const {
    observations,
    observationTemplates,
    addObservationTemplate,
    addObservation,
    updateObservation,
    deleteObservation,
    addObservationNote,
    addObservationAttachment,
    employees,
    activeEmployeeId,
    currentRole
  } = useApp();

  const [activeTab, setActiveTab] = useState('logs'); // 'logs', 'trends', 'templates'
  const [viewState, setViewState] = useState('list'); // 'list', 'details'
  const [selectedObs, setSelectedObs] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResidentFilter, setSelectedResidentFilter] = useState('All');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Log Form State
  const [selectedResident, setSelectedResident] = useState(RESIDENTS[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('general'); // 'general' or template.id
  const [priority, setPriority] = useState('Low');
  const [location, setLocation] = useState('Lounge Area');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [assignedStaff, setAssignedStaff] = useState(activeEmployeeId);
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  const [formAttachments, setFormAttachments] = useState([]);

  // Trend State
  const [trendResident, setTrendResident] = useState(RESIDENTS[0]);
  const [trendTemplateId, setTrendTemplateId] = useState('temp-vital-signs');
  const [trendFieldName, setTrendFieldName] = useState('temp');

  // Custom Template Builder State
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Clinical');
  const [templateFields, setTemplateFields] = useState([
    { label: 'Field Label', type: 'number', unit: 'bpm', options: '', required: true }
  ]);

  // Active Employee
  const currentEmp = employees.find(e => e.id === activeEmployeeId);

  // Access check
  if (currentRole === 'Receptionist' || currentRole === 'HR') {
    return (
      <div className="glass-card rounded-3xl p-8 text-center max-w-xl mx-auto my-12 shadow-lg border border-slate-200 dark:border-slate-800">
        <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Your role ({currentRole}) does not have permission to access the Observation Framework. Please contact an administrator.
        </p>
      </div>
    );
  }

  // RBAC Helper functions
  const isTeamObservation = (obs) => {
    if (currentRole === 'Admin' || currentRole === 'Compliance Officer') return true;
    if (currentRole === 'Manager') {
      const assignedEmp = employees.find(e => e.id === obs.assignedStaff);
      return (
        obs.createdBy === activeEmployeeId ||
        obs.assignedStaff === activeEmployeeId ||
        (assignedEmp && assignedEmp.manager === currentEmp?.name)
      );
    }
    if (currentRole === 'Employee') {
      return obs.createdBy === activeEmployeeId || obs.assignedStaff === activeEmployeeId;
    }
    return false;
  };

  const canCreate = () => ['Admin', 'Manager', 'Employee'].includes(currentRole);
  const canEdit = (obs) => {
    if (!obs) return false;
    if (currentRole === 'Admin') return true;
    if (currentRole === 'Manager') return isTeamObservation(obs);
    if (currentRole === 'Employee') return obs.createdBy === activeEmployeeId && obs.status === 'Open';
    return false;
  };
  const canDelete = () => currentRole === 'Admin';
  const canAssign = () => ['Admin', 'Manager'].includes(currentRole);
  const canClose = () => ['Admin', 'Manager'].includes(currentRole);
  const canAddFollowUp = () => ['Admin', 'Manager'].includes(currentRole);
  const canManageTemplates = () => ['Admin', 'Manager', 'Compliance Officer'].includes(currentRole);

  // Filters logic
  const filteredObservations = observations
    .filter(isTeamObservation)
    .filter(obs => {
      const matchesSearch = obs.resident.toLowerCase().includes(searchQuery.toLowerCase()) || 
        obs.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (obs.description && obs.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesResident = selectedResidentFilter === 'All' || obs.resident === selectedResidentFilter;
      const matchesTemplate = selectedTemplateFilter === 'All' || 
        (selectedTemplateFilter === 'general' && !obs.templateId) || 
        obs.templateId === selectedTemplateFilter;
      const matchesPriority = priorityFilter === 'All' || obs.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || obs.status === statusFilter;
      return matchesSearch && matchesResident && matchesTemplate && matchesPriority && matchesStatus;
    });

  // Overdue follow-up check
  const isOverdue = (obs) => {
    if (!obs.followUpRequired || obs.status === 'Closed' || !obs.followUpDate) return false;
    return new Date(obs.followUpDate) < new Date();
  };

  // Stats
  const totalObs = filteredObservations.length;
  const openObs = filteredObservations.filter(o => o.status === 'Open').length;
  const closedObs = filteredObservations.filter(o => o.status === 'Closed').length;
  const highPriority = filteredObservations.filter(o => o.priority === 'High' && o.status === 'Open').length;
  const overdueFollowUps = filteredObservations.filter(isOverdue).length;

  // Form Handlers
  const handleTemplateChange = (id) => {
    setSelectedTemplateId(id);
    setDynamicAnswers({});
  };

  const handleDynamicAnswerChange = (fieldId, val) => {
    setDynamicAnswers(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    const isGeneral = selectedTemplateId === 'general';
    const activeTemplate = observationTemplates.find(t => t.id === selectedTemplateId);
    
    // Construct answers display notes
    let summaryText = '';
    if (!isGeneral && activeTemplate) {
      summaryText = activeTemplate.fields.map(f => {
        const val = dynamicAnswers[f.id];
        const displayVal = val === undefined || val === null ? 'N/A' : (typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val);
        return `${f.label}: ${displayVal}${f.unit ? ' ' + f.unit : ''}`;
      }).join(' | ');
    }

    const obsData = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      resident: selectedResident,
      type: isGeneral ? 'General' : activeTemplate.category,
      templateId: isGeneral ? null : selectedTemplateId,
      priority,
      location,
      description: isGeneral ? description : `Dynamic Chart Record [${activeTemplate.name}]: ${summaryText}. ${description}`,
      actionTaken: actionTaken || 'Monitored condition.',
      assignedStaff,
      createdBy: activeEmployeeId,
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : '',
      status: 'Open',
      answers: dynamicAnswers,
      attachments: formAttachments
    };

    addObservation(obsData);
    setIsFormOpen(false);

    // Reset Form
    setDescription('');
    setActionTaken('');
    setPriority('Low');
    setFollowUpRequired(false);
    setFollowUpDate('');
    setDynamicAnswers({});
    setFormAttachments([]);
  };

  const handleAddNote = (obsId, noteText) => {
    if (!noteText.trim()) return;
    const author = currentEmp ? currentEmp.name : 'System User';
    addObservationNote(obsId, noteText.trim(), author);
    
    // Update local detail view
    setTimeout(() => {
      const updated = observations.find(o => o.id === obsId);
      if (updated) setSelectedObs(updated);
    }, 100);
  };

  const handleAttachFile = (obsId) => {
    const fileNames = ['clinical_vitals_sheet.pdf', 'behavioral_log_photo.jpg', 'gp_notes.png', 'care_plan_annex.pdf'];
    const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
    const sizes = ['240 KB', '1.4 MB', '890 KB', '450 KB'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const author = currentEmp ? currentEmp.name : 'System User';
    
    addObservationAttachment(obsId, randomFile, randomSize, author);
    setTimeout(() => {
      const updated = observations.find(o => o.id === obsId);
      if (updated) setSelectedObs(updated);
    }, 100);
  };

  const handleStatusToggle = (obs) => {
    if (!canClose()) return;
    const nextStatus = obs.status === 'Open' ? 'Closed' : 'Open';
    updateObservation(obs.id, {
      ...obs,
      status: nextStatus
    });
    setTimeout(() => {
      const updated = observations.find(o => o.id === obs.id);
      if (updated) setSelectedObs(updated);
    }, 100);
  };

  const handleAssignStaff = (obs, staffId) => {
    if (!canAssign()) return;
    updateObservation(obs.id, {
      ...obs,
      assignedStaff: staffId
    });
    setTimeout(() => {
      const updated = observations.find(o => o.id === obs.id);
      if (updated) setSelectedObs(updated);
    }, 100);
  };

  // Add field to new template creator
  const addTemplateField = () => {
    setTemplateFields(prev => [...prev, { label: '', type: 'number', unit: '', options: '', required: false }]);
  };

  // Remove field
  const removeTemplateField = (idx) => {
    setTemplateFields(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx, key, val) => {
    setTemplateFields(prev => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  };

  // Submit new template
  const handleSaveTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    
    const fieldsToSave = templateFields.map((f, index) => ({
      id: `field-${index}-${Date.now()}`,
      label: f.label || `Field ${index + 1}`,
      type: f.type,
      unit: f.type === 'number' ? f.unit : '',
      options: f.type === 'select' ? f.options.split(',').map(o => o.trim()).filter(Boolean) : [],
      required: f.required
    }));

    addObservationTemplate(newTemplateName.trim(), newTemplateCategory, fieldsToSave);
    
    // Reset Template Creator
    setNewTemplateName('');
    setTemplateFields([{ label: '', type: 'number', unit: '', options: '', required: false }]);
    setActiveTab('logs');
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Time', 'Resident', 'Category', 'Priority', 'Location', 'Status', 'Creator', 'Assigned To', 'Notes/Description', 'Action Taken', 'Dynamic Fields JSON'];
    
    const rows = filteredObservations.map(obs => {
      const creator = employees.find(e => e.id === obs.createdBy)?.name || obs.createdBy || 'System';
      const assignee = employees.find(e => e.id === obs.assignedStaff)?.name || obs.assignedStaff || 'Unassigned';
      const fieldsStr = obs.answers ? JSON.stringify(obs.answers).replace(/"/g, '""') : '';
      
      return [
        obs.id,
        obs.date,
        obs.time,
        `"${obs.resident}"`,
        `"${obs.type}"`,
        obs.priority,
        `"${obs.location || ''}"`,
        obs.status,
        `"${creator}"`,
        `"${assignee}"`,
        `"${(obs.description || '').replace(/"/g, '""')}"`,
        `"${(obs.actionTaken || '').replace(/"/g, '""')}"`,
        `"${fieldsStr}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `observation_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock upload action inside log form
  const triggerFormMockUpload = () => {
    const simulatedFiles = [
      { name: 'carer_photo_injury.jpg', size: '320 KB', uploadedBy: currentEmp?.name || 'Carer', date: new Date().toISOString().split('T')[0] },
      { name: 'vital_signs_scan.png', size: '1.2 MB', uploadedBy: currentEmp?.name || 'Carer', date: new Date().toISOString().split('T')[0] }
    ];
    const pickedFile = simulatedFiles[Math.floor(Math.random() * simulatedFiles.length)];
    setFormAttachments(prev => [...prev, pickedFile]);
  };

  // SVG Chart Renderer
  const renderTrendsChart = () => {
    // Gather all observations for the resident & template
    const records = observations
      .filter(obs => obs.resident === trendResident && obs.templateId === trendTemplateId && obs.answers && obs.answers[trendFieldName] !== undefined)
      .map(obs => {
        const dateObj = new Date(`${obs.date}T${obs.time || '12:00'}`);
        return {
          dateStr: obs.date + ' ' + obs.time,
          value: parseFloat(obs.answers[trendFieldName]),
          rawDate: dateObj
        };
      })
      .sort((a, b) => a.rawDate - b.rawDate);

    if (records.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <Activity className="h-12 w-12 text-slate-350 mb-3 animate-pulse" />
          <h5 className="font-extrabold text-sm text-slate-800 dark:text-white">No Numeric Trends Found</h5>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Ensure you select a template containing numeric metrics (like Vital Signs) and log multiple observations for {trendResident}.
          </p>
        </div>
      );
    }

    // Chart Dimensions
    const width = 600;
    const height = 300;
    const padding = 45;

    const values = records.map(r => r.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal === 0 ? 10 : maxVal - minVal;
    
    // Add extra padding to chart bounds
    const yMin = Math.max(0, minVal - range * 0.15);
    const yMax = maxVal + range * 0.15;

    // Coordinate mapping
    const getX = (index) => {
      if (records.length <= 1) return padding + (width - padding * 2) / 2;
      return padding + (index / (records.length - 1)) * (width - padding * 2);
    };

    const getY = (val) => {
      return height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);
    };

    // Build SVG Path
    let pathD = '';
    records.forEach((r, idx) => {
      const x = getX(idx);
      const y = getY(r.value);
      if (idx === 0) {
        pathD = `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Plotting {records.length} readings over time (Range: {minVal.toFixed(1)} - {maxVal.toFixed(1)})
          </span>
          <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-bold dark:bg-brand-950/40">
            Dynamic Graph Engine
          </span>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 p-4 overflow-x-auto shadow-inner">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto text-slate-400">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const val = yMin + p * (yMax - yMin);
              const y = getY(val);
              return (
                <g key={i}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeDasharray="4 4" 
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <text 
                    x={padding - 10} 
                    y={y + 4} 
                    textAnchor="end" 
                    className="text-[9px] fill-slate-400 font-mono font-bold"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* X Axis Date labels */}
            {records.map((r, idx) => {
              if (records.length > 5 && idx % Math.ceil(records.length / 5) !== 0) return null;
              const x = getX(idx);
              const label = r.dateStr.split(' ')[0].substring(5); // Show MM-DD
              return (
                <g key={idx}>
                  <line 
                    x1={x} 
                    y1={height - padding} 
                    x2={x} 
                    y2={height - padding + 5} 
                    stroke="currentColor" 
                    className="text-slate-200 dark:text-slate-750" 
                  />
                  <text 
                    x={x} 
                    y={height - padding + 18} 
                    textAnchor="middle" 
                    className="text-[8px] fill-slate-400 font-bold"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Trend Line */}
            {records.length > 1 && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_2px_4px_rgba(99,102,241,0.2)] animate-draw"
              />
            )}

            {/* Markers */}
            {records.map((r, idx) => {
              const x = getX(idx);
              const y = getY(r.value);
              return (
                <g key={idx} className="group/node cursor-pointer">
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="5" 
                    fill="#6366f1" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    className="hover:r-7 transition-all"
                  />
                  <rect 
                    x={x - 25} 
                    y={y - 28} 
                    width="50" 
                    height="18" 
                    rx="4" 
                    fill="#1e293b" 
                    className="opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none"
                  />
                  <text 
                    x={x} 
                    y={y - 16} 
                    textAnchor="middle" 
                    fill="#ffffff" 
                    className="text-[9px] font-extrabold opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none font-mono"
                  >
                    {r.value.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header and Primary Navigation tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Scalable Observations</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1 ml-10">
            Log, track, and graph CQC-compliant resident charts using dynamic templates.
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 self-start md:self-auto">
          <button
            onClick={() => { setActiveTab('logs'); setViewState('list'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Observations Log
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Trends & Charts
          </button>
          {canManageTemplates() && (
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Manage Templates
            </button>
          )}
        </div>
      </div>

      {/* 1. OBSERVATIONS LOG TAB */}
      {activeTab === 'logs' && viewState === 'list' && (
        <div className="space-y-6">
          
          {/* Stats Bar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Logs</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{totalObs}</span>
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <Activity className="h-4 w-4"/>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-brand-500">
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">Open Cases</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{openObs}</span>
                <div className="h-8 w-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                  <AlertCircle className="h-4 w-4"/>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">High Priority</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{highPriority}</span>
                <div className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="h-4 w-4"/>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Overdue Alerts</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{overdueFollowUps}</span>
                <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                  <Clock className="h-4 w-4"/>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Closed / Archived</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{closedObs}</span>
                <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="h-4 w-4"/>
                </div>
              </div>
            </div>
          </div>

          {/* Action and Filters Area */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-55 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resident, description or ID..." 
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Filters */}
              <select 
                value={selectedResidentFilter}
                onChange={(e) => setSelectedResidentFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Residents</option>
                {RESIDENTS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <select 
                value={selectedTemplateFilter}
                onChange={(e) => setSelectedTemplateFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Templates</option>
                <option value="general">General (No Template)</option>
                {observationTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleExportCSV}
                className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-300 flex items-center gap-1.5 shadow-sm"
              >
                <Download className="h-4 w-4 text-emerald-500" />
                Export CSV
              </button>
              {canCreate() && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Log Observation
                </button>
              )}
            </div>
          </div>

          {/* Observations List Table */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-850">
                    <th className="p-4 font-bold">ID / Date</th>
                    <th className="p-4 font-bold">Resident Name</th>
                    <th className="p-4 font-bold">Category & Form</th>
                    <th className="p-4 font-bold">Priority</th>
                    <th className="p-4 font-bold">Assigned To</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredObservations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-400 font-semibold italic">
                        No observations found matching the specified filters.
                      </td>
                    </tr>
                  ) : (
                    filteredObservations.map(obs => {
                      const staff = employees.find(e => e.id === obs.assignedStaff);
                      const template = observationTemplates.find(t => t.id === obs.templateId);
                      return (
                        <tr key={obs.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">{obs.id}</span>
                            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {obs.date} {obs.time}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                            {obs.resident}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-700 dark:text-slate-350">{obs.type}</span>
                            <div className="text-[10px] text-brand-600 dark:text-brand-400 font-bold mt-0.5">
                              {template ? template.name : 'General Log'}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide
                              ${obs.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                obs.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              }
                            `}>
                              {obs.priority}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-655 dark:text-slate-400">
                            {staff ? staff.name : obs.assignedStaff || 'Unassigned'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide border flex items-center gap-1 w-fit
                              ${obs.status === 'Open' 
                                ? isOverdue(obs)
                                  ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400'
                                  : 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900/50 dark:bg-brand-900/20 dark:text-brand-400' 
                                : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'}
                            `}>
                              <span className={`h-1.5 w-1.5 rounded-full ${obs.status === 'Open' ? isOverdue(obs) ? 'bg-rose-500' : 'bg-brand-500' : 'bg-slate-400'}`} />
                              {obs.status} {isOverdue(obs) && '(Overdue)'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              onClick={() => { setSelectedObs(obs); setViewState('details'); }}
                              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg border border-brand-100 dark:border-brand-900/40"
                            >
                              View & Track
                            </button>
                            {canDelete() && (
                              <button 
                                onClick={() => deleteObservation(obs.id)}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. OBSERVATION DETAILS DRAWER VIEW */}
      {activeTab === 'logs' && viewState === 'details' && selectedObs && (
        <div className="grid gap-6 lg:grid-cols-3 animate-slide-up">
          
          {/* Back button header row */}
          <div className="lg:col-span-3 flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <button 
              onClick={() => setViewState('list')}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-850 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-300 transition-all flex items-center gap-1.5 font-bold"
            >
              <ArrowLeft className="h-4 w-4"/>
              Back to Observations Log
            </button>
            <div className="flex gap-2">
              {canClose() && selectedObs.status === 'Open' && (
                <button
                  onClick={() => handleStatusToggle(selectedObs)}
                  className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-4 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Close & Resolve Case
                </button>
              )}
              {selectedObs.status === 'Closed' && canClose() && (
                <button
                  onClick={() => handleStatusToggle(selectedObs)}
                  className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-4 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Reopen Case
                </button>
              )}
            </div>
          </div>

          {/* Details & Notes Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Details Card */}
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold uppercase text-slate-500">
                      Observation Log #{selectedObs.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide
                      ${selectedObs.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                        selectedObs.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }
                    `}>
                      {selectedObs.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    {selectedObs.resident}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Logged on {selectedObs.date} at {selectedObs.time}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border
                  ${selectedObs.status === 'Open' ? 'border-brand-200 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' : 'border-slate-200 bg-slate-100 text-slate-655 dark:bg-slate-850 dark:text-slate-400'}
                `}>
                  {selectedObs.status}
                </span>
              </div>

              {/* Core metadata */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Form Template</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-250">
                    {observationTemplates.find(t => t.id === selectedObs.templateId)?.name || 'General Form'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Location</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-250">{selectedObs.location || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged By</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-250">
                    {employees.find(e => e.id === selectedObs.createdBy)?.name || selectedObs.createdBy || 'System'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Staff</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-250">
                    {employees.find(e => e.id === selectedObs.assignedStaff)?.name || selectedObs.assignedStaff || 'Unassigned'}
                  </p>
                </div>
              </div>

              {/* Dynamic / Custom Form Answers */}
              {selectedObs.answers && Object.keys(selectedObs.answers).length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/60 dark:bg-slate-950/40 dark:border-slate-850 text-xs">
                  <h4 className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">Dynamic Field Readings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const template = observationTemplates.find(t => t.id === selectedObs.templateId);
                      if (!template) return null;
                      return template.fields.map(field => {
                        const answer = selectedObs.answers[field.id];
                        const displayAnswer = answer === undefined || answer === null
                          ? 'Not logged' 
                          : (typeof answer === 'boolean' 
                            ? (answer ? 'Yes' : 'No') 
                            : `${answer} ${field.unit || ''}`);
                        
                        return (
                          <div key={field.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                            <span className="font-bold text-slate-500">{field.label}:</span>
                            <span className="font-extrabold text-slate-800 dark:text-white bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border dark:border-slate-800 shadow-sm">{displayAnswer}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* Description & Action */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Carer Narrative Description</h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-250/60 dark:bg-slate-950/50 dark:border-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {selectedObs.description}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Immediate Corrective Actions taken</h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-250/60 dark:bg-slate-950/50 dark:border-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {selectedObs.actionTaken || 'No action recorded yet.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes History Card */}
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="font-black text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-brand-500" />
                Notes History ({selectedObs.notesHistory?.length || 0})
              </h4>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(!selectedObs.notesHistory || selectedObs.notesHistory.length === 0) ? (
                  <p className="text-xs text-slate-400 italic py-2">No notes logged for this observation.</p>
                ) : (
                  selectedObs.notesHistory.map((note, index) => (
                    <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800 text-xs">
                      <div className="flex justify-between font-bold text-slate-500 mb-1 text-[10px]">
                        <span>{note.authorName}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{note.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Add Note Comment</label>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const txt = e.target.noteText.value;
                  if (txt) {
                    handleAddNote(selectedObs.id, txt);
                    e.target.reset();
                  }
                }} className="flex gap-2">
                  <input 
                    name="noteText"
                    type="text" 
                    placeholder="Type a clinical note update..."
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                  <button 
                    type="submit" 
                    className="h-9 w-9 rounded-xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                  >
                    <Send className="h-4 w-4"/>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Sidebar Columns */}
          <div className="space-y-6">
            
            {/* Resident Profile Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-4">Resident Profile</h4>
              
              {(() => {
                const profile = getResidentProfile(selectedObs.resident);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={profile.photo} 
                        alt={selectedObs.resident} 
                        className="h-14 w-14 rounded-full object-cover border-2 border-brand-100 dark:border-brand-900"
                      />
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white">{selectedObs.resident}</h5>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{profile.room} • Age {profile.age}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-extrabold uppercase tracking-wide dark:bg-rose-955/20 dark:border-rose-900/40">
                          {profile.risk}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Key Care Directives</span>
                      <p className="text-slate-655 dark:text-slate-350 font-semibold leading-relaxed">{profile.carerNotes}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Assigned Staff Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-4">Assigned Care Staff</h4>
              
              {(() => {
                const staff = employees.find(e => e.id === selectedObs.assignedStaff);
                return (
                  <div className="space-y-4">
                    {staff ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={staff.photo} 
                          alt={staff.name} 
                          className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                        />
                        <div>
                          <h5 className="font-black text-slate-900 dark:text-white">{staff.name}</h5>
                          <p className="text-[10px] text-slate-500 font-semibold">{staff.title}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">ID: {staff.id}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No staff assigned to this observation.</p>
                    )}

                    {canAssign() && selectedObs.status === 'Open' && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Change Assignment</label>
                        <select 
                          value={selectedObs.assignedStaff || ''}
                          onChange={(e) => handleAssignStaff(selectedObs, e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white text-xs font-bold outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        >
                          <option value="">Unassigned</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.title})</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Follow-Up Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-3">Follow-Up Compliance</h4>
              
              {selectedObs.followUpRequired ? (
                <div className={`p-3 rounded-xl border text-xs ${isOverdue(selectedObs) ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'}`}>
                  <div className="flex justify-between font-bold mb-1">
                    <span>{isOverdue(selectedObs) ? '⚠️ Overdue follow-up' : '📅 Follow-up set'}</span>
                    <span className="font-mono">{selectedObs.followUpDate}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Carer review required on this date to assess stability.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No follow-up registered.</p>
              )}
            </div>

            {/* Evidence Attachments Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Attachments</h4>
                <button
                  onClick={() => handleAttachFile(selectedObs.id)}
                  className="text-[9px] font-bold text-brand-600 hover:text-brand-500 flex items-center gap-0.5"
                >
                  <Plus className="h-3 w-3" /> Add File
                </button>
              </div>

              <div className="space-y-2">
                {(!selectedObs.attachments || selectedObs.attachments.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No attachments.</p>
                ) : (
                  selectedObs.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-[11px] truncate">
                      <Paperclip className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-400">{file.size} • {file.uploadedBy}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. TRENDS & CHARTS PANEL TAB */}
      {activeTab === 'trends' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                Vitals & Metric Trend Grapher
              </h3>
              <p className="text-xs text-slate-500 mt-1">Plot numeric indicators over time to spot trends and medical risks.</p>
            </div>

            {/* Selectors */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Resident</label>
                <select 
                  value={trendResident}
                  onChange={(e) => setTrendResident(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                >
                  {RESIDENTS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Template</label>
                <select 
                  value={trendTemplateId}
                  onChange={(e) => {
                    setTrendTemplateId(e.target.value);
                    // Reset field selector to first field of new template
                    const template = observationTemplates.find(t => t.id === e.target.value);
                    if (template && template.fields.length > 0) {
                      const numField = template.fields.find(f => f.type === 'number');
                      setTrendFieldName(numField ? numField.id : template.fields[0].id);
                    }
                  }}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                >
                  {observationTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {(() => {
                const template = observationTemplates.find(t => t.id === trendTemplateId);
                const numericFields = template ? template.fields.filter(f => f.type === 'number') : [];
                
                return (
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Numeric Metric Field</label>
                    <select 
                      value={trendFieldName}
                      onChange={(e) => setTrendFieldName(e.target.value)}
                      disabled={numericFields.length === 0}
                      className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white disabled:opacity-50"
                    >
                      {numericFields.length === 0 ? (
                        <option value="">No numeric fields</option>
                      ) : (
                        numericFields.map(f => <option key={f.id} value={f.id}>{f.label} ({f.unit || 'unit'})</option>)
                      )}
                    </select>
                  </div>
                );
              })()}
            </div>
          </div>

          {renderTrendsChart()}
        </div>
      )}

      {/* 4. TEMPLATE MANAGEMENT TAB */}
      {activeTab === 'templates' && canManageTemplates() && (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Create Template Panel */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-850 pb-3">
              <PlusCircle className="h-5 w-5 text-emerald-550 dark:text-emerald-400" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Build Custom Template</h3>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Define custom CQC measurement charts.</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Template Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Skin Tear Log, Covid Check" 
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category / Grouping</label>
                <select 
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-white font-bold"
                >
                  <option value="Clinical">Clinical</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Behaviour">Behaviour</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Safeguarding">Safeguarding</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Custom Fields</label>
                  <button 
                    type="button" 
                    onClick={addTemplateField}
                    className="text-[10px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-350 flex items-center gap-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Field
                  </button>
                </div>

                {templateFields.map((field, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 dark:bg-slate-950/60 dark:border-slate-850 space-y-2.5 relative">
                    <button 
                      type="button" 
                      onClick={() => removeTemplateField(idx)}
                      disabled={templateFields.length === 1}
                      className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 disabled:opacity-30 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Label</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Temperature" 
                          value={field.label}
                          onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Type</label>
                        <select 
                          value={field.type}
                          onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white text-[11px] font-bold"
                        >
                          <option value="number">Number</option>
                          <option value="text">Short Text</option>
                          <option value="textarea">Paragraph Text</option>
                          <option value="select">Dropdown Select</option>
                          <option value="checkbox">Yes/No Checkbox</option>
                        </select>
                      </div>
                    </div>

                    {field.type === 'number' && (
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Measurement Unit</label>
                        <input 
                          type="text" 
                          placeholder="e.g. °C, ml, mmHg" 
                          value={field.unit}
                          onChange={(e) => handleFieldChange(idx, 'unit', e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white text-[11px]"
                        />
                      </div>
                    )}

                    {field.type === 'select' && (
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Options (comma separated)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Water, Tea, Juice" 
                          value={field.options}
                          onChange={(e) => handleFieldChange(idx, 'options', e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white text-[11px]"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <input 
                        type="checkbox" 
                        id={`req-${idx}`}
                        checked={field.required}
                        onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                      />
                      <label htmlFor={`req-${idx}`} className="text-[9px] font-bold text-slate-500 cursor-pointer">Required field</label>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="submit" 
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-550 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                Publish Template
              </button>
            </form>
          </div>

          {/* List of active templates */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active Observation Templates</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {observationTemplates.map(template => (
                <div key={template.id} className="glass-card rounded-2xl p-5 border border-slate-250/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                        {template.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">ID: {template.id}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white mt-2">{template.name}</h4>
                    
                    <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Field Schema:</span>
                      {template.fields.map((f, i) => (
                        <div key={i} className="flex justify-between text-[11px] font-semibold text-slate-655 dark:text-slate-455">
                          <span>• {f.label}</span>
                          <span className="font-mono text-[10px] text-slate-450 uppercase">{f.type}{f.unit ? ` (${f.unit})` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-4 italic">
                    Schema-driven form. Ready to log resident reports without changes.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. LOG OBSERVATION MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-850 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Log Resident Observation</h3>
                <p className="text-[11px] text-slate-500">Log medical vitals, behavioural entries, or safeguarding reports.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-450 hover:text-slate-700 dark:hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Resident</label>
                  <select 
                    value={selectedResident}
                    onChange={(e) => setSelectedResident(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    {RESIDENTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Form Template Schema</label>
                  <select 
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    <option value="general">General Form (Standard fields only)</option>
                    {observationTemplates.map(t => <option key={t.id} value={t.id}>{t.name} (Schema)</option>)}
                  </select>
                </div>
              </div>

              {/* Dynamic form inputs based on template */}
              {selectedTemplateId !== 'general' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-850 space-y-4">
                  <span className="text-[9px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
                    Dynamic Template Fields
                  </span>
                  
                  {(() => {
                    const template = observationTemplates.find(t => t.id === selectedTemplateId);
                    if (!template) return null;
                    return template.fields.map(field => (
                      <div key={field.id} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>

                        {field.type === 'number' && (
                          <div className="relative">
                            <input 
                              type="number"
                              step="any"
                              required={field.required}
                              value={dynamicAnswers[field.id] || ''}
                              onChange={(e) => handleDynamicAnswerChange(field.id, e.target.value)}
                              placeholder={`Enter numeric reading`}
                              className="w-full h-9 pl-3 pr-12 rounded-xl border border-slate-250 bg-white outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                            {field.unit && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-[10px]">
                                {field.unit}
                              </span>
                            )}
                          </div>
                        )}

                        {field.type === 'text' && (
                          <input 
                            type="text"
                            required={field.required}
                            value={dynamicAnswers[field.id] || ''}
                            onChange={(e) => handleDynamicAnswerChange(field.id, e.target.value)}
                            placeholder={`Short text value`}
                            className="w-full h-9 px-3 rounded-xl border border-slate-250 bg-white outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea 
                            required={field.required}
                            value={dynamicAnswers[field.id] || ''}
                            onChange={(e) => handleDynamicAnswerChange(field.id, e.target.value)}
                            placeholder={`Detailed assessment...`}
                            rows="2"
                            className="w-full p-2.5 rounded-xl border border-slate-250 bg-white outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-none"
                          />
                        )}

                        {field.type === 'select' && (
                          <select 
                            required={field.required}
                            value={dynamicAnswers[field.id] || ''}
                            onChange={(e) => handleDynamicAnswerChange(field.id, e.target.value)}
                            className="w-full h-9 px-3 rounded-xl border border-slate-250 bg-white outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white font-bold"
                          >
                            <option value="">Choose option...</option>
                            {field.options?.map((opt, oIdx) => <option key={oIdx} value={opt}>{opt}</option>)}
                          </select>
                        )}

                        {field.type === 'checkbox' && (
                          <div className="flex items-center gap-2 py-1">
                            <input 
                              type="checkbox"
                              id={`dyn-chk-${field.id}`}
                              checked={!!dynamicAnswers[field.id]}
                              onChange={(e) => handleDynamicAnswerChange(field.id, e.target.checked)}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                            />
                            <label htmlFor={`dyn-chk-${field.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                              Yes, flag/confirm this reading
                            </label>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* Standard Narrative inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location / Ward</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Room 12, Conservatory" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Narrative description */}
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Carer Observation Narrative</label>
                <textarea 
                  required
                  placeholder="Record full contextual details of the observation event..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Immediate Corrective Actions taken</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monitored for 30 minutes, re-offered medication" 
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Follow-up fields */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="followUp"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <label htmlFor="followUp" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Flag/require a follow-up review date
                  </label>
                </div>

                {followUpRequired && (
                  <div className="animate-fade-in">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Required Follow-up Date</label>
                    <input 
                      type="date"
                      required
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full h-8 px-2 rounded-lg border border-slate-250 bg-white outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800">
                <div className="flex gap-2 items-center">
                  <button 
                    type="button" 
                    onClick={triggerFormMockUpload}
                    className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-extrabold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-300 flex items-center gap-1 shadow-sm"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-indigo-500" />
                    Attach Mock File
                  </button>
                  <span className="text-[10px] text-slate-400">
                    {formAttachments.length} file(s) attached
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-extrabold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold shadow-md active:scale-95"
                  >
                    Save & Submit
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
