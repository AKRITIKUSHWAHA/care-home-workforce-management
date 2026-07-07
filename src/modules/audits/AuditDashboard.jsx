import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import AuditRenderer from './core/AuditRenderer';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ClipboardList, 
  FileDown, 
  Plus, 
  Calendar,
  X,
  Trash2,
  Edit2,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Check,
  PlusCircle,
  BookOpen,
  Lock,
  Flame,
  Coffee,
  Paintbrush
} from 'lucide-react';

// Sub-components imports
import ManagerMonthlyChecklist from './components/ManagerMonthlyChecklist';
import LessonsLearntSummary from './components/LessonsLearntSummary';
import CustomerSurveys from './components/CustomerSurveys';
import MedicationRoomCleaning from '../shared/MedicationRoomCleaning';
import KitchenPaperwork from '../kitchen/KitchenPaperwork';
import CompetencyManagement from '../manager/CompetencyManagement';

const DEFAULT_AUDIT_CATEGORIES = [
  "Daily Walkround 2026",
  "Daily Chart Audit",
  "Weekly Medication Audit",
  "Monthly Medication Audit",
  "Care Plan Audit",
  "Mealtime Audit",
  "Dining Experience Audit",
  "Fire Audit",
  "Health & Safety Audit",
  "IPC Environment Audit",
  "Kitchen Audit",
  "Call Bell Audit",
  "Data Security Audit",
  "First Aid Audit",
  "Mattress Audit"
];

const AUDIT_GROUPS = [
  {
    name: "Fire Safety Compliance",
    key: "fire",
    icon: "🔥",
    categories: ["Fire Audit", "Fire Safety"]
  },
  {
    name: "Medication Compliance",
    key: "medication",
    icon: "💊",
    categories: [
      "Weekly Medication Audit",
      "Monthly Medication Audit"
    ]
  },
  {
    name: "Cleaning & Infection Control",
    key: "cleaning",
    icon: "🧹",
    categories: [
      "IPC Environment Audit",
      "Mattress Audit"
    ]
  },
  {
    name: "Kitchen & Food Safety",
    key: "kitchen",
    icon: "🍳",
    categories: [
      "Kitchen Audit",
      "Mealtime Audit",
      "Dining Experience Audit"
    ]
  },
  {
    name: "General Governance & Care Planning",
    key: "general",
    icon: "📋",
    categories: [
      "Daily Walkround 2026",
      "Daily Chart Audit",
      "Care Plan Audit",
      "Call Bell Audit",
      "Data Security Audit",
      "First Aid Audit",
      "Health & Safety Audit"
    ]
  }
];


const AuditDashboard = () => {
  const { 
    audits, 
    submitAuditResult, 
    scheduleAudit, 
    deleteAudit,
    updateAuditAssignment,
    updateAuditActionPlans,
    addCustomAuditCategory,
    customAuditCategories,
    employees, 
    currentRole,
    currentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'dashboard', 'roster', 'actionPlans', 'checklist', 'lessons', 'surveys'
  const [selectedAudit, setSelectedAudit] = useState(null); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false); 

  // Section-specific tabs for custom submenus
  const [sectionTab, setSectionTab] = useState('audits'); // 'audits' | 'competency' | 'cleaning-log' | 'special-diets'

  // Roster schedule edit states
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editOfficerId, setEditOfficerId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editPersonAudited, setEditPersonAudited] = useState('');

  // Custom Audit Category Form State
  const [customCatName, setCustomCatName] = useState('');
  const [customQuestions, setCustomQuestions] = useState([
    { id: 'q-1', section: 'General Care', question: 'Are staff supporting residents according to care plan guidelines?' }
  ]);
  const [customSectionName, setCustomSectionName] = useState('General Care');
  const [newQuestionText, setNewQuestionText] = useState('');

  // Action Plan Resolution State
  const [resolvingAuditId, setResolvingAuditId] = useState(null);
  const [resolvingIdx, setResolvingIdx] = useState(null);
  const [resolverSignature, setResolverSignature] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  // Form states for scheduling a new audit
  const [newAuditType, setNewAuditType] = useState(DEFAULT_AUDIT_CATEGORIES[0]);
  const [newAuditDate, setNewAuditDate] = useState('');
  const [newAuditOfficer, setNewAuditOfficer] = useState(() => employees[0]?.id || '');
  const [newAuditArea, setNewAuditArea] = useState('');
  const [newAuditPersonAudited, setNewAuditPersonAudited] = useState('');

  // Sync category pre-filtering with sidebar selections
  useEffect(() => {
    if (currentView === 'audit-fire') {
      setSelectedGroup('fire');
      setSelectedCategory(null);
      setSectionTab('audits');
      setActiveTab('dashboard');
    } else if (currentView === 'audit-medication') {
      setSelectedGroup('medication');
      setSelectedCategory(null);
      setSectionTab('audits');
      setActiveTab('dashboard');
    } else if (currentView === 'audit-cleaning') {
      setSelectedGroup('cleaning');
      setSelectedCategory(null);
      setSectionTab('audits');
      setActiveTab('dashboard');
    } else if (currentView === 'audit-kitchen') {
      setSelectedGroup('kitchen');
      setSelectedCategory(null);
      setSectionTab('audits');
      setActiveTab('dashboard');
    } else {
      setSelectedGroup(null);
      // Keep activeTab if it's already something else, otherwise default to matrix
      if (activeTab === 'dashboard') setActiveTab('matrix');
    }
  }, [currentView]);

  // Combine default and custom categories
  const dynamicCategories = [...DEFAULT_AUDIT_CATEGORIES, ...(customAuditCategories || []).map(c => c.name)];

  // Group all categories dynamically for structured sidebar sections
  const getGroupedCategories = () => {
    const groups = AUDIT_GROUPS.map(g => ({ ...g, items: [] }));
    
    dynamicCategories.forEach(cat => {
      let found = false;
      for (let g of groups) {
        if (g.categories.some(c => c.toLowerCase() === cat.toLowerCase() || cat.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(cat.toLowerCase()))) {
          g.items.push(cat);
          found = true;
          break;
        }
      }
      if (!found) {
        groups[groups.length - 1].items.push(cat);
      }
    });
    
    return groups;
  };

  // Summary Metrics
  const upcomingCount = audits.filter(a => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Open').length;
  const completedCount = audits.filter(a => a.status === 'Completed').length;
  const failedCount = audits.filter(a => a.status === 'Completed' && a.score < 50).length;
  const overdueCount = audits.filter(a => a.status === 'Overdue').length;

  // Calculate Overall Compliance Score
  const completedAudits = audits.filter(a => a.status === 'Completed');
  const totalScoreSum = completedAudits.reduce((acc, a) => acc + (a.score || 0), 0);
  const overallComplianceScore = completedAudits.length > 0 
    ? Math.round(totalScoreSum / completedAudits.length) 
    : 94; 

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-455 animate-pulse';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400';
      case 'Pending':
      case 'Open':
        return 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-500/10 dark:text-amber-400';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  const handleStartAudit = (audit) => {
    setIsEditMode(false);
    setSelectedAudit(audit);
  };

  const handleEditAudit = (audit) => {
    setIsEditMode(true);
    setSelectedAudit(audit);
  };

  const handleSubmitAudit = (auditId, score, details) => {
    submitAuditResult(auditId, score, details);
    setSelectedAudit(null);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!newAuditDate || !newAuditOfficer) return;
    scheduleAudit(newAuditType, newAuditDate, newAuditOfficer, newAuditArea, newAuditPersonAudited);
    setScheduleModalOpen(false);
    setNewAuditArea('');
    setNewAuditPersonAudited('');
  };

  const handleSaveScheduleEdit = (auditId) => {
    updateAuditAssignment(auditId, editOfficerId, editDate, editStatus, editArea, editPersonAudited);
    setEditingScheduleId(null);
  };

  // Custom Category Add Question
  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      section: customSectionName,
      question: newQuestionText.trim()
    };
    setCustomQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (qId) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const handleCreateCustomCategorySubmit = (e) => {
    e.preventDefault();
    if (!customCatName.trim()) {
      alert('Please enter an audit category title.');
      return;
    }
    if (customQuestions.length === 0) {
      alert('Please add at least one question.');
      return;
    }
    addCustomAuditCategory(customCatName.trim(), customQuestions);
    setCustomCatName('');
    setCustomQuestions([{ id: 'q-1', section: 'General Care', question: 'Are staff supporting residents according to care plan guidelines?' }]);
    setActiveTab('roster'); 
  };

  // Action plan verification
  const openResolveModal = (auditId, idx) => {
    setResolvingAuditId(auditId);
    setResolvingIdx(idx);
    setResolverSignature('');
    setResolveModalOpen(true);
  };

  const handleResolveActionPlanSubmit = (e) => {
    e.preventDefault();
    if (!resolverSignature.trim()) return;

    const targetAudit = audits.find(a => a.id === resolvingAuditId);
    if (targetAudit && targetAudit.details?.actionPlans) {
      const updatedPlans = [...targetAudit.details.actionPlans];
      updatedPlans[resolvingIdx] = {
        ...updatedPlans[resolvingIdx],
        signedOff: `${resolverSignature} (Resolved ${new Date().toLocaleDateString('en-GB')})`
      };
      updateAuditActionPlans(resolvingAuditId, updatedPlans);
    }
    setResolveModalOpen(false);
    setResolvingAuditId(null);
    setResolvingIdx(null);
    setResolverSignature('');
  };

  // Compile central action plans registry data
  const centralActionPlans = [];
  audits.forEach(aud => {
    if (aud.details?.actionPlans && aud.details.actionPlans.length > 0) {
      aud.details.actionPlans.forEach((plan, planIdx) => {
        centralActionPlans.push({
          ...plan,
          auditId: aud.id,
          auditTitle: aud.type,
          scheduledDate: aud.scheduledDate,
          idx: planIdx
        });
      });
    }
  });

  // Filters
  const filteredAudits = audits.filter((aud) => {
    if (statusFilter === 'Completed' && aud.status !== 'Completed') return false;
    if (statusFilter === 'Pending' && aud.status !== 'Pending' && aud.status !== 'In Progress' && aud.status !== 'Open') return false;
    if (statusFilter === 'Overdue' && aud.status !== 'Overdue') return false;
    if (statusFilter === 'Failed' && (aud.status !== 'Completed' || aud.score >= 50)) return false;
    
    // Group pre-filtering (Fire, Meds, Cleaning, Kitchen submenus)
    if (selectedGroup) {
      const group = AUDIT_GROUPS.find(g => g.key === selectedGroup);
      if (group) {
        const isInGroup = group.categories.some(c => c.toLowerCase() === aud.type.toLowerCase() || aud.type.toLowerCase().includes(c.toLowerCase()));
        if (!isInGroup) return false;
      }
    }
    
    if (selectedCategory && aud.type !== selectedCategory) return false;
    return true;
  });

  // RAG Compliance Score Calculator
  const getLatestAudit = (categoryName) => {
    const catAudits = audits.filter(a => a.type.toLowerCase() === categoryName.toLowerCase() && a.status === 'Completed');
    if (catAudits.length === 0) return null;
    return catAudits.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))[0];
  };

  const getRAGStatus = (score) => {
    if (score === null || score === undefined) {
      return {
        label: 'Not Completed',
        bgClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-455',
        colorClass: 'text-rose-600 dark:text-rose-400',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-350'
      };
    }
    if (score < 50) {
      return {
        label: 'Failed',
        bgClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-455',
        colorClass: 'text-rose-600 dark:text-rose-400',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-350'
      };
    }
    if (score >= 50 && score <= 85) {
      return {
        label: 'Requires Improvement',
        bgClass: 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-955/30 dark:text-amber-400',
        colorClass: 'text-amber-600 dark:text-amber-400',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-350'
      };
    }
    return {
      label: 'Completed',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-350'
    };
  };

  // Render RAG Matrix Table
  const renderAuditMatrix = () => {
    // Filter categories by selectedGroup if active
    const activeCategories = dynamicCategories.filter(cat => {
      if (!selectedGroup) return true;
      const group = AUDIT_GROUPS.find(g => g.key === selectedGroup);
      if (!group) return true;
      return group.categories.some(c => c.toLowerCase() === cat.toLowerCase() || cat.toLowerCase().includes(c.toLowerCase()));
    });

    const getRowBorderClass = (score) => {
      if (score === null || score === undefined || score < 50) {
        return 'border-l-4 border-l-rose-500 dark:border-l-rose-600';
      }
      if (score >= 50 && score <= 85) {
        return 'border-l-4 border-l-amber-500 dark:border-l-amber-600';
      }
      return 'border-l-4 border-l-emerald-500 dark:border-l-emerald-600';
    };

    return (
      <div className="glass-card rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Audit Compliance Status Matrix</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Highlighting completed, failed audits, and areas requiring improvement.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">Completed (Over 85%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2.5 w-2.5 rounded bg-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">Requires Improvement (50-85%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2.5 w-2.5 rounded bg-rose-500" />
              <span className="text-slate-500 dark:text-slate-400">Not Completed/Failed (Under 50%)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-6">Audit Category</th>
                <th className="p-3.5">Target Frequency</th>
                <th className="p-3.5">Latest Audited Date</th>
                <th className="p-3.5">Assigned Auditor</th>
                <th className="p-3.5">Compliance Score</th>
                <th className="p-3.5">RAG Status Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
              {activeCategories.map((cat) => {
                const latest = getLatestAudit(cat);
                const score = latest ? latest.score : null;
                const status = getRAGStatus(score);
                const auditor = latest ? (employees.find(e => e.id === latest.officerId)?.name || 'Admin') : '—';
                const date = latest ? latest.scheduledDate : 'Not Conducted';

                return (
                  <tr key={cat} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors">
                    <td className={`p-3.5 pl-6 font-bold text-slate-900 dark:text-slate-100 ${getRowBorderClass(score)}`}>{cat}</td>
                    <td className="p-3.5 text-slate-400 dark:text-slate-500">{cat.includes('Weekly') ? 'Weekly' : 'Monthly'}</td>
                    <td className="p-3.5 font-mono">{date}</td>
                    <td className="p-3.5">{auditor}</td>
                    <td className="p-3.5 font-bold">
                      {score !== null ? (
                        <span className={status.colorClass}>{score}%</span>
                      ) : (
                        <span className="text-rose-500 font-bold">0%</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded border text-[9px] font-extrabold uppercase shrink-0 ${status.bgClass}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in p-1 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 dark:border-slate-850 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            <span>Audit & Compliance Center</span>
          </h2>
          {selectedGroup ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[10px] font-black uppercase tracking-wider">
                {selectedGroup.toUpperCase()} COMPLIANCE
              </span>
              <p className="text-xs text-slate-500 font-semibold">Pre-filtered audits for {AUDIT_GROUPS.find(g => g.key === selectedGroup)?.name}.</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Schedule, execute, and verify facility audits to maintain CQC ratings.</p>
          )}
        </div>

        {/* Action Buttons */}
        {(currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewAuditType(dynamicCategories[0]);
                setNewAuditOfficer(employees[0]?.id || '');
                setNewAuditDate(new Date().toISOString().split('T')[0]);
                setScheduleModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/10"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Schedule Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-250 transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Custom Audit</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 text-xs font-bold gap-2 overflow-x-auto whitespace-nowrap pb-1">
        <button
          onClick={() => {
            setActiveTab('matrix');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'matrix' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Audit Panel</span>
          {activeTab === 'matrix' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedGroup('medication');
            setSectionTab('audits');
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'dashboard' && selectedGroup === 'medication' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Medication Audits</span>
          {activeTab === 'dashboard' && selectedGroup === 'medication' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedGroup('kitchen');
            setSectionTab('audits');
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'dashboard' && selectedGroup === 'kitchen' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Kitchen Audits</span>
          {activeTab === 'dashboard' && selectedGroup === 'kitchen' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedGroup('cleaning');
            setSectionTab('audits');
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'dashboard' && selectedGroup === 'cleaning' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Cleaning Audits</span>
          {activeTab === 'dashboard' && selectedGroup === 'cleaning' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedGroup('fire');
            setSectionTab('audits');
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'dashboard' && selectedGroup === 'fire' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Fire Safety Audits</span>
          {activeTab === 'dashboard' && selectedGroup === 'fire' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedGroup(null);
            setSectionTab('audits');
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'dashboard' && selectedGroup === null ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>All Audits</span>
          {activeTab === 'dashboard' && selectedGroup === null && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('roster');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'roster' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Audit Roster & Schedule ({filteredAudits.length})</span>
          {activeTab === 'roster' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>
        
        <button
          onClick={() => {
            setActiveTab('actionPlans');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'actionPlans' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Action Plans Register ({centralActionPlans.filter(p => !p.signedOff).length} Active)</span>
          {activeTab === 'actionPlans' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('checklist');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'checklist' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Checklists</span>
          {activeTab === 'checklist' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('lessons');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'lessons' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Lessons Learnt Logs</span>
          {activeTab === 'lessons' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('surveys');
            setSelectedGroup(null);
          }}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'surveys' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-655'}`}
        >
          <span>Surveys & Feedback</span>
          {activeTab === 'surveys' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>
      </div>

      {/* RENDER TAB CONTENTS */}

      {activeTab === 'matrix' && renderAuditMatrix()}

      {activeTab === 'checklist' && <ManagerMonthlyChecklist />}
      {activeTab === 'lessons' && <LessonsLearntSummary />}
      {activeTab === 'surveys' && <CustomerSurveys />}

      {/* TAB 1: FACILITY AUDITS WITH SIDEBAR CATEGORIES */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          
          {/* Custom submenu integration toolbar */}
          {selectedGroup === 'medication' && (
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 w-fit gap-1 mb-2">
              <button
                onClick={() => setSectionTab('audits')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'audits' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Medication Audits
              </button>
              <button
                onClick={() => setSectionTab('competency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'competency' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Observation
              </button>
            </div>
          )}

          {selectedGroup === 'cleaning' && (
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 w-fit gap-1 mb-2">
              <button
                onClick={() => setSectionTab('audits')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'audits' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Cleaning Audits
              </button>
              <button
                onClick={() => setSectionTab('cleaning-log')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'cleaning-log' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" /> Meds Room Cleaning Daily Log
              </button>
            </div>
          )}

          {selectedGroup === 'kitchen' && (
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850 w-fit gap-1 mb-2">
              <button
                onClick={() => setSectionTab('audits')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'audits' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Kitchen Audits
              </button>
              <button
                onClick={() => setSectionTab('special-diets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sectionTab === 'special-diets' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" /> Special Diets & Kitchen logs
              </button>
            </div>
          )}

          {/* Conditional Sub-panels render */}
          {selectedGroup === 'medication' && sectionTab === 'competency' && (
            <div className="animate-fade-in">
              <CompetencyManagement />
            </div>
          )}

          {selectedGroup === 'cleaning' && sectionTab === 'cleaning-log' && (
            <div className="animate-fade-in">
              <MedicationRoomCleaning />
            </div>
          )}

          {selectedGroup === 'kitchen' && sectionTab === 'special-diets' && (
            <div className="animate-fade-in">
              <KitchenPaperwork />
            </div>
          )}

          {/* Normal Audits Panel dashboard (Categories + History Log) */}
          {(sectionTab === 'audits' || !selectedGroup) && (
            <div className="space-y-5">
              {/* STATS OVERVIEW */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="glass-card rounded-2xl p-4 flex flex-col justify-between shadow-xs bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Compliance</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{overallComplianceScore}%</span>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      +1.2%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        overallComplianceScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${overallComplianceScore}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-2">CQC Compliant Target (90%)</span>
                </div>

                <div className="glass-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Scheduled Audits</span>
                    <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{upcomingCount}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Active & Open</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-550 flex items-center justify-center dark:bg-indigo-950/20 shadow-xs shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Completed Audits</span>
                    <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-455">{completedCount}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Compliance signed off</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center dark:bg-emerald-950/20 shadow-xs shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Failed Audits</span>
                    <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-455">{failedCount}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Score below 50% target</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-505 flex items-center justify-center dark:bg-rose-950/20 shadow-xs shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Overdue Audits</span>
                    <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{overdueCount}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Action required now</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center dark:bg-amber-950/20 shadow-xs shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Audit Compliance Matrix Section (Visible on dashboard) */}
              {renderAuditMatrix()}

              {/* SPLIT PANE CONTAINER: Categories on Left + Log list on Right */}
              <div className="grid gap-5 lg:grid-cols-4 items-start">
                
                {/* LEFT COLUMN: Audit Categories (1/4 Width) */}
                <div className="glass-card rounded-2xl p-4 space-y-3.5 shadow-sm bg-white min-h-[500px] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Audit Categories</h3>
                    {selectedCategory && (
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="text-[10px] font-bold text-[#2e6559] hover:underline"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
                    {getGroupedCategories().map((group) => {
                      if (group.items.length === 0) return null;
                      // Filter groups according to submenu selection
                      if (selectedGroup && group.key !== selectedGroup) return null;

                      return (
                        <div key={group.key} className="space-y-1">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider select-none">
                            <span>{group.icon}</span>
                            <span>{group.name}</span>
                          </div>
                          <div className="pl-1 space-y-0.5">
                            {group.items.map((cat) => {
                              const isActive = selectedCategory === cat;
                              return (
                                <button
                                  key={cat}
                                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-all group relative
                                    ${isActive 
                                      ? 'bg-[#e9f2f0] text-[#2e6559] border-l-4 border-l-[#2e6559] shadow-sm dark:bg-slate-800 dark:text-[#4ad1b0]' 
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }
                                  `}
                                >
                                  <ClipboardList className={`h-3.5 w-3.5 shrink-0 transition-colors
                                    ${isActive ? 'text-[#2e6559] dark:text-[#4ad1b0]' : 'text-slate-400 group-hover:text-slate-500'}
                                  `} />
                                  <span className="truncate flex-1 pr-6">{cat}</span>
                                  
                                  <span 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newAudit = scheduleAudit(cat, new Date().toISOString().split('T')[0], employees[0]?.id || 'EMP-006');
                                      if (newAudit) {
                                        handleStartAudit(newAudit);
                                      }
                                    }}
                                    title={`Start ${cat} immediately`}
                                    className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-[#2e6559]/10 text-[#2e6559] hover:bg-[#2e6559] hover:text-white rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold text-xs"
                                  >
                                    +
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN: Audit Log Summary (3/4 Width) */}
                <div className="lg:col-span-3 glass-card rounded-2xl shadow-sm bg-white overflow-hidden min-h-[500px] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active & Completed Roster</h3>
                      {selectedCategory && (
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Filtering category: <strong className="text-slate-600 dark:text-slate-350">{selectedCategory}</strong></p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('roster')}
                      className="text-xs font-bold text-[#2e6559] dark:text-brand-400 hover:underline"
                    >
                      View Full Schedule
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3.5 pl-5">Audit Type</th>
                          <th className="p-3.5">Assigned Auditor</th>
                          <th className="p-3.5">Scheduled Date</th>
                          <th className="p-3.5">Score</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right pr-6">Action</th>
                        </tr>
                      </thead>
                      
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {filteredAudits.map((aud) => {
                          const officer = employees.find(e => e.id === aud.officerId) || employees[0];
                          const isCompleted = aud.status === 'Completed';
                          const isFailed = isCompleted && aud.score < 50;

                          return (
                            <tr key={aud.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors">
                              <td className="p-3.5 pl-5 font-bold text-[#2e6559] max-w-[200px] truncate">{aud.type}</td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <img src={officer.photo} alt="" className="h-5 w-5 rounded-full border object-cover" />
                                  <span>{officer.name}</span>
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-450">{aud.scheduledDate}</td>
                              <td className="p-3.5 font-bold">
                                {isCompleted ? (
                                  <span className={isFailed ? 'text-rose-600' : 'text-emerald-600'}>{aud.score}%</span>
                                ) : '—'}
                              </td>
                              <td className="p-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase shrink-0 ${getStatusBadge(aud.status)}`}>
                                  {isFailed ? 'Failed' : isCompleted ? 'Passed' : aud.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right pr-6">
                                <div className="flex gap-2 justify-end items-center">
                                  {isCompleted ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setIsEditMode(false);
                                          setSelectedAudit(aud);
                                        }}
                                        className="h-7 px-2.5 rounded-lg border border-slate-205 bg-white hover:bg-slate-50 text-slate-650 font-bold text-[10px] inline-flex items-center gap-1 transition-all shadow-sm active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                      >
                                        <FileDown className="h-3.5 w-3.5" />
                                        <span>View Report</span>
                                      </button>
                                      {(currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') && (
                                        <button
                                          onClick={() => handleEditAudit(aud)}
                                          className="h-7 px-2.5 rounded-lg border border-[#2e6559]/20 bg-[#2e6559]/10 hover:bg-[#2e6559]/20 text-[#2e6559] font-bold text-[10px] inline-flex items-center gap-1 transition-all shadow-sm active:scale-[0.98] dark:border-[#2e6559]/50 dark:text-[#4ad1b0] dark:hover:bg-[#2e6559]/30"
                                        >
                                          <span>Edit</span>
                                        </button>
                                      )}
                                    </>
                                  ) : (currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') ? (
                                    <button
                                      onClick={() => handleStartAudit(aud)}
                                      className="h-7 px-3 rounded-lg bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-[10px] transition-all shadow-sm active:scale-[0.98]"
                                    >
                                      Execute Audit
                                    </button>
                                  ) : (
                                    <span className="text-slate-350 text-[10px] font-semibold italic">No actions</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredAudits.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                              No audits registered for this category yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: ROSTER & ASSIGNMENTS */}
      {activeTab === 'roster' && (
        <div className="glass-card rounded-2xl shadow-sm bg-white overflow-hidden dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50/20">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Audit Roster Ledger</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Edit assignments, update target dates, change statuses, or delete scheduled logs.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-brand-500 font-semibold dark:border-slate-850 dark:bg-slate-800 dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending / Active</option>
                <option value="Failed">Failed Audits</option>
                <option value="Overdue">Overdue Audits</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 pl-5">Audit Type</th>
                  <th className="p-3.5">Area Checked</th>
                  <th className="p-3.5">Person Audited</th>
                  <th className="p-3.5">Assigned Auditor</th>
                  <th className="p-3.5">Target Rota Date</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-6">Roster Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                {filteredAudits.map((aud) => {
                  const officer = employees.find(e => e.id === aud.officerId) || employees[0];
                  const isCompleted = aud.status === 'Completed';
                  const isFailed = isCompleted && aud.score < 50;
                  const isEditing = editingScheduleId === aud.id;

                  return (
                    <tr key={aud.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-955/10 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-[#2e6559] max-w-[200px] truncate">{aud.type}</td>
                      
                      <td className="p-3.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editArea}
                            onChange={(e) => setEditArea(e.target.value)}
                            placeholder="e.g. Room 4"
                            className="h-8 rounded border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-2 text-xs font-semibold w-24"
                          />
                        ) : (
                          <span className="text-slate-500 font-semibold">{aud.area || '—'}</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPersonAudited}
                            onChange={(e) => setEditPersonAudited(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="h-8 rounded border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-2 text-xs font-semibold w-28"
                          />
                        ) : (
                          <span className="text-slate-500 font-semibold">{aud.personAudited || '—'}</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <select
                            value={editOfficerId}
                            onChange={(e) => setEditOfficerId(e.target.value)}
                            className="h-8 rounded border bg-slate-50 dark:bg-slate-800 dark:text-white px-2 text-xs font-semibold"
                          >
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <img src={officer.photo} alt="" className="h-6 w-6 rounded-full border object-cover" />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 leading-none">{officer.name}</p>
                              <span className="text-[8px] text-slate-400 capitalize block mt-0.5">{officer.title}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="h-8 rounded border bg-slate-50 dark:bg-slate-800 dark:text-white px-2 text-xs font-semibold"
                          />
                        ) : (
                          <span className="text-slate-500 font-semibold">{aud.scheduledDate}</span>
                        )}
                      </td>

                      <td className="p-3.5 font-bold">
                        {isCompleted ? (
                          <span className={`text-[10px] font-extrabold ${isFailed ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {aud.score}%
                          </span>
                        ) : '—'}
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="h-8 rounded border bg-slate-50 dark:bg-slate-800 dark:text-white px-2 text-xs font-semibold"
                          >
                            <option value="Pending">Open / Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed / Closed</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase shrink-0 ${getStatusBadge(aud.status)}`}>
                            {isFailed ? 'Failed' : isCompleted ? 'Passed' : aud.status}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right pr-6">
                        <div className="flex gap-1.5 justify-end items-center">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveScheduleEdit(aud.id)}
                                className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all flex items-center gap-0.5"
                              >
                                <Check className="h-3 w-3" /> Save
                              </button>
                              <button
                                onClick={() => setEditingScheduleId(null)}
                                className="h-7 px-2.5 rounded-lg border border-slate-205 text-slate-500 font-bold text-[10px]"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {isCompleted ? (
                                <button
                                  onClick={() => handleStartAudit(aud)}
                                  className="h-7 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-655 font-bold text-[10px] flex items-center gap-0.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                >
                                  <FileDown className="h-3 w-3" /> Report
                                </button>
                              ) : (currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') ? (
                                <button
                                  onClick={() => handleStartAudit(aud)}
                                  className="h-7 px-2.5 rounded-lg bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-[10px]"
                                >
                                  Execute
                                </button>
                              ) : null}

                              {(currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingScheduleId(aud.id);
                                      setEditOfficerId(aud.officerId);
                                      setEditDate(aud.scheduledDate);
                                      setEditStatus(aud.status);
                                      setEditArea(aud.area || '');
                                      setEditPersonAudited(aud.personAudited || '');
                                    }}
                                    className="h-7 w-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 dark:border-slate-700 dark:hover:bg-slate-800"
                                    title="Edit assignment/dates"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if(confirm('Are you sure you want to delete this scheduled audit?')) {
                                        deleteAudit(aud.id);
                                      }
                                    }}
                                    className="h-7 w-7 rounded-lg border border-rose-200/50 hover:bg-rose-50 text-rose-505 flex items-center justify-center dark:border-rose-900/30 dark:hover:bg-rose-950/20"
                                    title="Delete Scheduled Audit"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CENTRAL ACTION PLANS */}
      {activeTab === 'actionPlans' && (
        <div className="glass-card rounded-2xl shadow-sm bg-white overflow-hidden dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Central Action Plans Register</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Central ledger collecting all identified compliance deficits. Compliance officers must sign off on completion below.</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 pl-5">Source Audit</th>
                  <th className="p-3.5">Section</th>
                  <th className="p-3.5">Problem Identified</th>
                  <th className="p-3.5">Action Plan Corrective</th>
                  <th className="p-3.5">Owner</th>
                  <th className="p-3.5">Target Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-6">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-305 bg-white dark:bg-slate-900">
                {centralActionPlans.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400 font-bold italic">
                      Zero compliance action items registered. Perfect rating maintained!
                    </td>
                  </tr>
                ) : (
                  centralActionPlans.map((plan, index) => {
                    const resolved = !!plan.signedOff;
                    return (
                      <tr key={index} className="hover:bg-slate-50/45 dark:hover:bg-slate-950/10 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white">
                          <span className="block">{plan.auditTitle}</span>
                          <span className="text-[9px] text-slate-400 font-mono font-bold block mt-0.5">ID: {plan.auditId}</span>
                        </td>
                        <td className="p-3.5 text-slate-500">{plan.section}</td>
                        <td className="p-3.5 text-rose-650 font-bold">{plan.problem}</td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-200">{plan.actions}</td>
                        <td className="p-3.5 text-center">{plan.responsible}</td>
                        <td className="p-3.5 text-center font-mono text-slate-400">{plan.targetDate}</td>
                        
                        <td className="p-3.5">
                          {resolved ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold text-[9px] uppercase border border-emerald-200">
                              Resolved
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-455 font-extrabold text-[9px] uppercase border border-rose-200 animate-pulse">
                              Active Deficit
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right pr-6">
                          {resolved ? (
                            <span className="text-[9px] text-slate-400 italic block leading-snug truncate max-w-[150px]" title={plan.signedOff}>
                              {plan.signedOff}
                            </span>
                          ) : (currentRole === 'Admin' || currentRole === 'Compliance Officer' || currentRole === 'Manager') ? (
                            <button
                              onClick={() => openResolveModal(plan.auditId, plan.idx)}
                              className="h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all"
                            >
                              Verify & Sign-off
                            </button>
                          ) : (
                            <span className="text-slate-350 italic text-[10px]">No authority</span>
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
      )}

      {/* TAB 4: CUSTOM AUDIT CREATOR */}
      {activeTab === 'creator' && (
        <div className="glass-card rounded-2xl p-5 shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-brand-600" />
            <span>CQC Compliance Custom Audit Builder</span>
          </h3>
          
          <form onSubmit={handleCreateCustomCategorySubmit} className="mt-4 space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="font-bold text-slate-550 block">Audit Category Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Night Shift Supervision Audit"
                value={customCatName}
                onChange={(e) => setCustomCatName(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3 bg-slate-55/30">
              <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Configure Audit Questions Checklist</h4>
              
              <div className="flex gap-2">
                <div className="w-1/3">
                  <select
                    value={customSectionName}
                    onChange={(e) => setCustomSectionName(e.target.value)}
                    className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-2 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  >
                    <option value="General Care">General Care</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Safety & Environment">Safety & Environment</option>
                    <option value="Staff Performance">Staff Performance</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter compliance question..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 rounded-lg bg-[#2e6559] text-white font-bold text-xs"
                >
                  Add
                </button>
              </div>

              {/* Added Questions List */}
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {customQuestions.map(q => (
                  <div key={q.id} className="p-2 rounded bg-white dark:bg-slate-900 border flex justify-between items-center text-xs">
                    <div>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase tracking-wider text-slate-500 mr-2">{q.section}</span>
                      <span className="text-slate-750 dark:text-slate-250">{q.question}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-55 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-505 text-white font-bold shadow-md shadow-brand-500/10"
              >
                Register Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Audit execution portal modal */}
      {selectedAudit && createPortal(
        <div className="fixed inset-0 z-[9990] bg-slate-900/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto flex justify-center items-start animate-fade-in print:p-0">
          <button
            onClick={() => setSelectedAudit(null)}
            className="fixed top-4 right-4 z-[9995] h-10 w-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center font-bold shadow-md border border-slate-700/50 transition-all active:scale-95 print:hidden"
            title="Close and return to dashboard"
          >
            ✕
          </button>
          <div className="w-full max-w-[1250px] relative animate-slide-up mt-10 mb-10 print:mt-0 print:mb-0 print:max-w-full">
            <AuditRenderer 
              selectedAudit={selectedAudit}
              submitAuditResult={handleSubmitAudit}
              setSelectedAudit={setSelectedAudit}
              isEditMode={isEditMode}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Schedule Audit Modal */}
      {scheduleModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-modal p-5 shadow-2xl relative animate-slide-up bg-white dark:bg-slate-900 dark:text-slate-100 border dark:border-slate-850">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-605 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-brand-500" />
              <span>Schedule New Care Audit</span>
            </h3>
            
            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Select Audit Category *</label>
                <select
                  value={newAuditType}
                  onChange={(e) => setNewAuditType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                >
                  {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Scheduled Target Date *</label>
                <input
                  type="date"
                  required
                  value={newAuditDate}
                  onChange={(e) => setNewAuditDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-555 block">Assign Compliance Officer *</label>
                <select
                  value={newAuditOfficer}
                  onChange={(e) => setNewAuditOfficer(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Area / Room Checked *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Room 1, Kitchen Area"
                  value={newAuditArea}
                  onChange={(e) => setNewAuditArea(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Person Audited (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Staff member or Resident name"
                  value={newAuditPersonAudited}
                  onChange={(e) => setNewAuditPersonAudited(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold dark:bg-slate-850 dark:border-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold dark:border-slate-750 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/10 active:scale-[0.98]"
                >
                  Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Action Plan Resolution Sign-off Modal */}
      {resolveModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-modal p-5 shadow-2xl relative animate-slide-up bg-white dark:bg-slate-900 dark:text-slate-100 border dark:border-slate-850">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-655 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-emerald-600" />
              <span>Verify & Resolve Compliance Deficit</span>
            </h3>
            
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
              Before marking this action plan as resolved, you must verify that correct adjustments have been verified on the floor.
            </p>

            <form onSubmit={handleResolveActionPlanSubmit} className="mt-4 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Verifier Signature / Acknowledgment *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins, Registered Manager"
                  value={resolverSignature}
                  onChange={(e) => setResolverSignature(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-slate-205 hover:bg-slate-50 font-bold dark:border-slate-750 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Resolve Deficit
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default AuditDashboard;
