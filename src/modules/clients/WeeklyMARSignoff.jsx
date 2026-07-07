import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Upload, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  UserCheck,
  FileText,
  Trash2,
  Lock,
  Eye,
  Search
} from 'lucide-react';

const WeeklyMARSignoff = () => {
  const { currentRole, employees, activeEmployeeId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Weekly MAR Data State
  const [marSheets, setMarSheets] = useState(() => {
    const saved = localStorage.getItem('weekly_mar_sheets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "W-MAR-1",
        weekStarting: "2026-06-01",
        fileName: "weekly_mar_chart_week1.pdf",
        uploadedBy: "Oliver (Registered Care Nurse)",
        uploadDate: "2026-06-07 05:00 PM",
        signatures: {
          manager: { signed: true, name: "Sarah Jenkins", date: "2026-06-08 09:30 AM" },
          deputy: { signed: true, name: "Marcus Vance", date: "2026-06-08 10:15 AM" },
          owner: { signed: true, name: "Admin User", date: "2026-06-08 02:45 PM" }
        },
        status: "Fully Approved"
      },
      {
        id: "W-MAR-2",
        weekStarting: "2026-06-08",
        fileName: "weekly_mar_chart_week2.pdf",
        uploadedBy: "Oliver (Registered Care Nurse)",
        uploadDate: "2026-06-14 06:15 PM",
        signatures: {
          manager: { signed: true, name: "Sarah Jenkins", date: "2026-06-15 08:30 AM" },
          deputy: { signed: true, name: "Marcus Vance", date: "2026-06-15 09:10 AM" },
          owner: { signed: false, name: "", date: "" }
        },
        status: "Pending Owner Signature"
      },
      {
        id: "W-MAR-3",
        weekStarting: "2026-06-15",
        fileName: "weekly_mar_chart_week3.pdf",
        uploadedBy: "Oliver (Registered Care Nurse)",
        uploadDate: "2026-06-21 08:00 PM",
        signatures: {
          manager: { signed: false, name: "", date: "" },
          deputy: { signed: false, name: "", date: "" },
          owner: { signed: false, name: "", date: "" }
        },
        status: "Awaiting Audits"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('weekly_mar_sheets', JSON.stringify(marSheets));
  }, [marSheets]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadWeek, setUploadWeek] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const activeEmp = employees.find(e => e.id === activeEmployeeId) || employees[0];

  const handleFileUploadSimulate = (e) => {
    e.preventDefault();
    if (!uploadWeek) {
      alert("Please select a week starting date.");
      return;
    }
    const exists = marSheets.some(s => s.weekStarting === uploadWeek);
    if (exists) {
      alert("A MAR sheet has already been uploaded for this week starting date.");
      return;
    }

    const newSheet = {
      id: `W-MAR-${Date.now()}`,
      weekStarting: uploadWeek,
      fileName: uploadedFile ? uploadedFile.name : `weekly_mar_chart_${uploadWeek}.pdf`,
      uploadedBy: `${activeEmp.name} (${activeEmp.title})`,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      signatures: {
        manager: { signed: false, name: "", date: "" },
        deputy: { signed: false, name: "", date: "" },
        owner: { signed: false, name: "", date: "" }
      },
      status: "Awaiting Audits"
    };

    setMarSheets(prev => [newSheet, ...prev]);
    setIsUploadModalOpen(false);
    setUploadWeek('');
    setUploadedFile(null);
  };

  const handleSignOff = (sheetId, roleType) => {
    setMarSheets(prev => prev.map(sheet => {
      if (sheet.id !== sheetId) return sheet;

      const updatedSignatures = { ...sheet.signatures };
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      if (roleType === 'manager') {
        updatedSignatures.manager = { signed: true, name: activeEmp.name, date: timestamp };
      } else if (roleType === 'deputy') {
        updatedSignatures.deputy = { signed: true, name: activeEmp.name, date: timestamp };
      } else if (roleType === 'owner') {
        updatedSignatures.owner = { signed: true, name: activeEmp.name, date: timestamp };
      }

      // Re-calculate overall status
      let newStatus = "Awaiting Audits";
      if (updatedSignatures.manager.signed && updatedSignatures.deputy.signed && updatedSignatures.owner.signed) {
        newStatus = "Fully Approved";
      } else if (updatedSignatures.manager.signed && updatedSignatures.deputy.signed) {
        newStatus = "Pending Owner Signature";
      } else if (updatedSignatures.manager.signed || updatedSignatures.deputy.signed) {
        newStatus = "Partially Signed";
      }

      return {
        ...sheet,
        signatures: updatedSignatures,
        status: newStatus
      };
    }));
  };

  const handleDeleteSheet = (sheetId) => {
    if (window.confirm("Are you sure you want to remove this weekly MAR sheet record?")) {
      setMarSheets(prev => prev.filter(s => s.id !== sheetId));
    }
  };

  const filteredSheets = marSheets.filter(sheet => 
    sheet.weekStarting.includes(searchQuery) || 
    sheet.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if current user role has permission to sign specific signatures
  const canSignManager = ['Admin', 'Manager', 'Compliance Officer'].includes(currentRole);
  const canSignDeputy = ['Admin', 'Compliance Officer', 'Manager'].includes(currentRole);
  const canSignOwner = ['Admin', 'HR'].includes(currentRole); // Represent Owner/NI role permissions

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fully Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Pending Owner Signature':
        return 'bg-amber-50 text-amber-750 border-amber-250 dark:bg-amber-955/20 dark:text-amber-400';
      case 'Partially Signed':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      {/* Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600 p-6 text-white shadow-md">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            Weekly MAR Auditing & Sign-off Matrix
          </h1>
          <p className="mt-0.5 text-xs text-brand-100 font-medium">
            Upload digitized weekly MAR medication charts and secure multi-signatory approvals.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="h-9 rounded-xl bg-white px-3.5 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            <span>Upload MAR Sheet</span>
          </button>
        </div>
      </div>

      {/* Search filter bar */}
      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by week starting or approval status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all w-full"
          />
        </div>
      </div>

      {/* Sheets Matrix Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSheets.map((sheet) => (
          <div key={sheet.id} className="glass-card rounded-3xl border border-slate-200/70 dark:border-slate-800/80 p-5 flex flex-col justify-between gap-5 transition-all hover:shadow-md">
            
            {/* Top Sheet Info */}
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2 border-b dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-850 dark:text-slate-200 leading-tight">
                    Week Starting: {sheet.weekStarting}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">Uploaded {sheet.uploadDate}</span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[8px] font-extrabold uppercase shrink-0 ${getStatusBadge(sheet.status)}`}>
                  {sheet.status}
                </span>
              </div>

              {/* Uploaded File Link */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-2xl border dark:border-slate-800 text-[10px] font-semibold">
                <span className="text-[#2e6559] dark:text-[#3a8273] font-bold flex items-center gap-1 cursor-pointer hover:underline truncate max-w-[170px]">
                  <FileText className="h-4 w-4 shrink-0" />
                  {sheet.fileName}
                </span>
                <span className="text-slate-400 truncate max-w-[100px]" title={sheet.uploadedBy}>{sheet.uploadedBy.split(' ')[0]}</span>
              </div>

              {/* Multi-Signature Matrix Checkoff */}
              <div className="space-y-2 border-t dark:border-slate-800 pt-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Approval Signature Matrix</span>
                
                {/* 1. Manager Signature */}
                <div className="flex items-center justify-between py-1.5 border-b border-dashed dark:border-slate-850 text-xs">
                  <span className="text-slate-500 font-bold text-[10px]">1. Home Manager:</span>
                  {sheet.signatures.manager.signed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1" title={sheet.signatures.manager.date}>
                      <UserCheck className="w-3.5 h-3.5" />
                      {sheet.signatures.manager.name}
                    </span>
                  ) : canSignManager ? (
                    <button
                      onClick={() => handleSignOff(sheet.id, 'manager')}
                      className="px-2.5 py-0.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-[8px] rounded border border-brand-500 transition-all uppercase"
                    >
                      Sign manager
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold text-[9px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Manager Pending
                    </span>
                  )}
                </div>

                {/* 2. Deputy Manager Signature */}
                <div className="flex items-center justify-between py-1.5 border-b border-dashed dark:border-slate-850 text-xs">
                  <span className="text-slate-500 font-bold text-[10px]">2. Deputy Manager:</span>
                  {sheet.signatures.deputy.signed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1" title={sheet.signatures.deputy.date}>
                      <UserCheck className="w-3.5 h-3.5" />
                      {sheet.signatures.deputy.name}
                    </span>
                  ) : canSignDeputy ? (
                    <button
                      onClick={() => handleSignOff(sheet.id, 'deputy')}
                      className="px-2.5 py-0.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-[8px] rounded border border-brand-500 transition-all uppercase"
                    >
                      Sign deputy
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold text-[9px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Deputy Pending
                    </span>
                  )}
                </div>

                {/* 3. Owner (NI) Signature */}
                <div className="flex items-center justify-between py-1.5 text-xs">
                  <span className="text-slate-500 font-bold text-[10px]">3. Owner / NI:</span>
                  {sheet.signatures.owner.signed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1" title={sheet.signatures.owner.date}>
                      <UserCheck className="w-3.5 h-3.5" />
                      {sheet.signatures.owner.name}
                    </span>
                  ) : canSignOwner ? (
                    <button
                      onClick={() => handleSignOff(sheet.id, 'owner')}
                      className="px-2.5 py-0.5 bg-[#2e6559] hover:bg-brand-700 text-white font-extrabold text-[8px] rounded border border-brand-600 transition-all uppercase"
                    >
                      Sign NI Owner
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold text-[9px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Owner Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2 justify-end border-t dark:border-slate-800 pt-3">
              <button 
                onClick={() => alert(`Reviewing Weekly MAR Sheet for starting date: ${sheet.weekStarting}.\nMedication administration logs match requirements.`)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                title="View MAR Log"
              >
                <Eye className="w-4 h-4" />
              </button>
              {['Admin', 'Manager'].includes(currentRole) && (
                <button 
                  onClick={() => handleDeleteSheet(sheet.id)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 rounded-lg text-rose-550 hover:text-rose-700 dark:text-rose-450 transition-colors"
                  title="Delete Sheet Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Upload Sheet Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-fade-in my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Upload Weekly MAR Chart</h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold font-sans">Digitize paper MAR files for review and signature sign-offs.</p>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFileUploadSimulate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Week Starting Date</label>
                <input 
                  type="date" 
                  required
                  value={uploadWeek}
                  onChange={(e) => setUploadWeek(e.target.value)}
                  className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select Document File</label>
                <div className="border-2 border-dashed border-slate-250 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-[#2e6559] dark:text-[#3a8273] mb-2 shrink-0" />
                  {uploadedFile ? (
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-350">{uploadedFile.name}</span>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold">Drag and drop MAR chart here</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">Supports PDF or Image files up to 10MB</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    id="mar-file-selector"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('mar-file-selector').click()}
                    className="mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200"
                  >
                    Select File
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2e6559] hover:bg-brand-555 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Upload & Dispatch to Signatories
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMARSignoff;
