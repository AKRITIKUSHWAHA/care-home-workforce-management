import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Plus, 
  X,
  Edit3, 
  Eye, 
  Download, 
  User, 
  Search, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  UserCheck,
  Building,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  Printer
} from 'lucide-react';
import AccessDenied from '../shared/AccessDenied';

// Placeholders supported by the system
const PLACEHOLDERS = [
  { placeholder: '{{employee_name}}', label: 'Employee Name' },
  { placeholder: '{{employee_id}}', label: 'Employee ID' },
  { placeholder: '{{job_title}}', label: 'Job Title' },
  { placeholder: '{{department}}', label: 'Department' },
  { placeholder: '{{salary}}', label: 'Salary' },
  { placeholder: '{{start_date}}', label: 'Start Date' },
  { placeholder: '{{manager_name}}', label: 'Manager Name' },
  { placeholder: '{{email}}', label: 'Email' },
  { placeholder: '{{phone}}', label: 'Phone' },
  { placeholder: '{{address}}', label: 'Address' },
  { placeholder: '{{national_insurance_no}}', label: 'NI Number' },
  { placeholder: '{{contract_type}}', label: 'Contract Type' }
];

const replacePlaceholders = (content, emp, overrides = {}) => {
  if (!content) return '';
  let result = content;
  
  const mapping = {
    employee_name: emp.name || '',
    employee_id: emp.id || '',
    job_title: emp.title || '',
    department: emp.group || '',
    salary: overrides.salary !== undefined ? overrides.salary : (emp.salary || 'N/A'),
    start_date: overrides.start_date !== undefined ? overrides.start_date : (emp.startDate || 'N/A'),
    manager_name: emp.manager || '',
    email: emp.email || '',
    phone: emp.phone || '',
    address: emp.address || '',
    national_insurance_no: overrides.national_insurance_no !== undefined ? overrides.national_insurance_no : (emp.niNumber || 'N/A'),
    contract_type: overrides.contract_type !== undefined ? overrides.contract_type : (emp.contractType || 'N/A'),
  };

  Object.entries(mapping).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
};

const HRDocumentTemplates = () => {
  const {
    currentRole,
    employees,
    documents,
    templates,
    addTemplate,
    updateTemplate,
    saveGeneratedDocument
  } = useApp();

  // Strict RBAC Guard
  if (currentRole !== 'HR') {
    return <AccessDenied />;
  }

  const [activeTab, setActiveTab] = useState('library'); // library, generator, history
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Editor State
  const [editorMode, setEditorMode] = useState('create'); // create, edit
  const [editId, setEditId] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'General',
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: false
  });

  const textareaRef = useRef(null);

  // Generator State
  const [genStep, setGenStep] = useState(1); // 1: select template & employee, 2: customize & preview
  const [genTemplateId, setGenTemplateId] = useState('');
  const [genEmployeeId, setGenEmployeeId] = useState('');
  const [genOverrides, setGenOverrides] = useState({
    salary: '',
    start_date: '',
    national_insurance_no: '',
    contract_type: ''
  });

  // Preview Modal / Drawer State
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewEmployee, setPreviewEmployee] = useState(employees[0]);
  const [previewOverrides, setPreviewOverrides] = useState({});
  const [isClassPreviewOpen, setIsClassPreviewOpen] = useState(false);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');

  // Insert placeholder at cursor helper
  const insertPlaceholder = (ph) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newValue = before + ph + after;
    setTemplateForm(prev => ({ ...prev, content: newValue }));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + ph.length;
    }, 50);
  };

  const handleEditTemplateClick = (t) => {
    setEditorMode('edit');
    setEditId(t.id);
    setTemplateForm({
      name: t.name,
      subject: t.subject || '',
      content: t.content,
      category: t.category || 'General',
      includeLogo: t.includeLogo !== undefined ? t.includeLogo : true,
      requireManagerSignature: t.requireManagerSignature !== undefined ? t.requireManagerSignature : true,
      requireEmployeeSignature: t.requireEmployeeSignature !== undefined ? t.requireEmployeeSignature : false
    });
    setIsEditorOpen(true);
  };

  const handleCreateNewClick = () => {
    setEditorMode('create');
    setEditId(null);
    setTemplateForm({
      name: '',
      subject: '',
      content: '',
      category: 'General',
      includeLogo: true,
      requireManagerSignature: true,
      requireEmployeeSignature: false
    });
    setIsEditorOpen(true);
  };

  const handleEditorSubmit = (e) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.content) {
      alert('Please enter a template name and content.');
      return;
    }

    if (editorMode === 'create') {
      const newTemplate = {
        id: `temp-${Date.now()}`,
        ...templateForm
      };
      addTemplate(newTemplate);
    } else {
      updateTemplate(editId, templateForm);
    }

    setIsEditorOpen(false);
  };

  // Pre-fill fields when selecting employee in Generator
  const handleGenEmployeeChange = (empId) => {
    setGenEmployeeId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setGenOverrides({
        salary: emp.salary || '',
        start_date: emp.startDate || '',
        national_insurance_no: emp.niNumber || '',
        contract_type: emp.contractType || ''
      });
    }
  };

  // Run PDF download using dynamic script loading
  const triggerPDFDownload = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const loadHtml2Pdf = () => {
      return new Promise((resolve, reject) => {
        if (window.html2pdf) {
          resolve(window.html2pdf);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(window.html2pdf);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    try {
      const html2pdf = await loadHtml2Pdf();
      const opt = {
        margin:       15,
        filename:     filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Triggering manual print options...');
      const printWin = window.open('', '_blank');
      printWin.document.write(`<html><head><title>${filename}</title><style>body { font-family: sans-serif; padding: 40px; } .letter-preview { width: 100%; }</style></head><body>${element.innerHTML}</body></html>`);
      printWin.document.close();
      printWin.print();
    }
  };

  const triggerPrint = (elementId, title) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>\${title}</title>
          <style>
            body { 
              font-family: sans-serif; 
              padding: 40px; 
              color: #334155;
              background-color: white;
            }
            .letter-preview {
              max-width: 800px;
              margin: 0 auto;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="letter-preview">
            \${element.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 250);
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (!genTemplateId || !genEmployeeId) {
      alert('Please select both a template and an employee.');
      return;
    }

    const template = templates.find(t => t.id === genTemplateId);
    const employee = employees.find(e => e.id === genEmployeeId);
    
    if (!template || !employee) return;

    // Rendered html output
    const cleanText = replacePlaceholders(template.content, employee, genOverrides);
    const dateStr = new Date().toLocaleDateString('en-GB');

    // Build letter HTML structure
    const generatedHtml = `
      <div class="p-8 bg-white text-slate-800 font-sans" style="font-size: 14px; line-height: 1.6; max-width: 800px; margin: 0 auto;">
        ${template.includeLogo ? `
          <div style="border-bottom: 2px solid #2e6559; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h1 style="color: #2e6559; font-size: 20px; font-weight: bold; margin: 0; text-transform: uppercase;">AS Care Home</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">12 Oakfield Lane, Birmingham, B29 4AA</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Tel: +44 121 555 0199 | email: admin@ascarehome.co.uk</p>
            </div>
            <div style="text-align: right;">
              <div style="background-color: #2e6559; color: white; width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; margin-left: auto;">AS</div>
              <span style="font-size: 8px; color: #94a3b8; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; display: block; margin-top: 4px;">CQC Regulated</span>
            </div>
          </div>
        ` : ''}
        
        <div style="text-align: right; margin-bottom: 24px; font-size: 12px; color: #64748b;">
          <strong>Date:</strong> ${dateStr}
        </div>

        <div style="margin-bottom: 24px;">
          <strong>To:</strong><br/>
          ${employee.name}<br/>
          ${employee.address || 'Address on record'}
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            ${template.subject || 'Official Communication'}
          </h2>
        </div>

        <div style="white-space: pre-wrap; color: #334155; margin-bottom: 40px; font-family: inherit;">${cleanText}</div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
          ${template.requireManagerSignature ? `
            <div>
              <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Authorized Signature</p>
              <div style="height: 35px; display: flex; align-items: flex-end;">
                <span style="font-family: 'Georgia', serif; font-style: italic; font-size: 16px; color: #2e6559; border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">Sarah Jenkins</span>
              </div>
              <p style="margin: 4px 0 0 0; font-weight: bold; color: #334155;">Sarah Jenkins</p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">General Manager, AS Care</p>
            </div>
          ` : '<div></div>'}

          ${template.requireEmployeeSignature ? `
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Employee Signature</p>
              <div style="height: 35px; display: flex; align-items: flex-end; justify-content: flex-end;">
                <span style="font-family: 'Georgia', serif; font-style: italic; font-size: 16px; color: #475569; border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">E-Signed by Employee</span>
              </div>
              <p style="margin: 4px 0 0 0; font-weight: bold; color: #334155;">${employee.name}</p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">Employee Acknowledgment</p>
            </div>
          ` : '<div></div>'}
        </div>
      </div>
    `;

    const docName = `${template.name} - ${employee.name}`;
    const fileName = `${template.name.toLowerCase().replace(/ /g, '_')}_${employee.name.toLowerCase().replace(/ /g, '_')}_${Date.now()}.pdf`;

    // Save in context
    saveGeneratedDocument(employee.id, docName, fileName, generatedHtml, "HR");

    // Switch step or trigger PDF download immediately
    setGenStep(1);
    setGenTemplateId('');
    setGenEmployeeId('');
    setActiveTab('history');

    // Trigger PDF download after rendering completes
    setTimeout(() => {
      const container = document.createElement('div');
      container.id = 'temp-pdf-generation-holder-hr';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.innerHTML = generatedHtml;
      document.body.appendChild(container);
      triggerPDFDownload('temp-pdf-generation-holder-hr', docName).then(() => {
        document.body.removeChild(container);
      });
    }, 100);
  };

  // Compile history list
  const generatedHistory = [];
  Object.entries(documents).forEach(([empId, empDocs]) => {
    const emp = employees.find(e => e.id === empId);
    empDocs.forEach(d => {
      if (d.isGenerated) {
        generatedHistory.push({
          ...d,
          employeeId: empId,
          employeeName: emp ? emp.name : 'Unknown',
          employeePhoto: emp ? emp.photo : ''
        });
      }
    });
  });

  // Sort history by date/time (newest first)
  generatedHistory.sort((a, b) => {
    const parseDateTime = (dStr, tStr) => {
      if (!dStr) return new Date(0);
      const [d, m, y] = dStr.split('/');
      return new Date(`${y}-${m}-${d} ${tStr || ''}`);
    };
    return parseDateTime(b.uploadDate, b.uploadTime) - parseDateTime(a.uploadDate, a.uploadTime);
  });

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter history
  const filteredHistory = generatedHistory.filter(h => {
    return h.name.toLowerCase().includes(historySearch.toLowerCase()) ||
           h.employeeName.toLowerCase().includes(historySearch.toLowerCase()) ||
           h.uploadedBy.toLowerCase().includes(historySearch.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in p-2 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-500" />
            <span>Document Automation Center</span>
          </h2>
          <p className="text-xs text-slate-500">Create, customize, and automatically generate personalized company letters and contracts.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewClick}
            className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-brand-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </button>
          
          <button
            onClick={() => {
              setGenStep(1);
              setGenTemplateId('');
              setGenEmployeeId('');
              setActiveTab('generator');
            }}
            className="h-9 px-4 rounded-xl bg-[#2e6559]/10 text-[#2e6559] hover:bg-[#2e6559]/20 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-950/60 font-bold text-xs flex items-center gap-1.5 transition-all border border-brand-200/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Document</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('library')}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'library' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <span>Templates Library</span>
          {activeTab === 'library' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'generator' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <span>Document Generator</span>
          {activeTab === 'generator' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 relative transition-all ${activeTab === 'history' ? 'text-[#2e6559] dark:text-[#3a8273]' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <span>Generation History</span>
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e6559] dark:bg-[#3a8273]" />}
        </button>
      </div>

      {/* Tab Contents */}

      {/* 1. LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-500 shadow-sm min-w-[150px]"
            >
              <option value="All">All Categories</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Contracts">Contracts</option>
              <option value="Lifecycle">Lifecycle</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center p-12 glass-card rounded-2xl border text-slate-400 italic">
              No document templates found matching your criteria.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map(t => (
                <div key={t.id} className="glass-card rounded-2xl border p-4 flex flex-col justify-between gap-4 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-extrabold text-[8px] border uppercase bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800">
                        {t.category || 'General'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditTemplateClick(t)}
                          className="h-6.5 w-6.5 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Template"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {/* NO TRASH BUTTON FOR HR */}
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 font-semibold">Subject: {t.subject || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-3 font-normal mt-1 block h-[45px] overflow-hidden leading-normal">
                      {t.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                    <button
                      onClick={() => {
                        setPreviewTemplate(t);
                        setPreviewEmployee(employees[0]);
                        setPreviewOverrides({
                          salary: employees[0].salary || '',
                          start_date: employees[0].startDate || '',
                          national_insurance_no: employees[0].niNumber || '',
                          contract_type: employees[0].contractType || ''
                        });
                        setIsClassPreviewOpen(true);
                      }}
                      className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-750 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setGenTemplateId(t.id);
                        setGenStep(1);
                        setActiveTab('generator');
                      }}
                      className="flex-1 h-7 rounded-lg bg-[#2e6559]/10 text-[#2e6559] hover:bg-[#2e6559]/20 dark:bg-[#3a8273]/20 dark:text-[#3a8273] transition-colors flex items-center justify-center gap-1 font-bold"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDITOR TEMPLATE */}
      {isEditorOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-modal max-w-4xl w-full rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative bg-white dark:bg-slate-950 animate-slide-up max-h-[calc(100vh-2rem)] flex flex-col justify-start">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="mr-2 h-7 px-2.5 rounded-lg border font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors text-xs flex items-center gap-1"
                >
                  Back
                </button>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {editorMode === 'create' ? 'Create Custom Document Template' : 'Edit Document Template'}
                </h3>
              </div>
              
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleEditorSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase text-[9px]">Template Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Probation Confirmation Letter"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Category</label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white"
                    >
                      <option value="Recruitment">Recruitment</option>
                      <option value="Contracts">Contracts</option>
                      <option value="Lifecycle">Lifecycle</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Letter Logo</label>
                    <div className="flex items-center h-10">
                      <label className="flex items-center gap-2 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={templateForm.includeLogo}
                          onChange={(e) => setTemplateForm({ ...templateForm, includeLogo: e.target.checked })}
                          className="rounded border-slate-350 text-brand-600 focus:ring-brand-500 h-4 w-4"
                        />
                        <span>Include Letterhead</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-500 uppercase text-[9px]">Document Subject / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Successful Completion of Probationary Period"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              {/* Placeholder insertion toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-brand-500" />
                    <span>Document Body & Placeholders *</span>
                  </label>
                  <span className="text-[9px] text-slate-400 font-bold">Click variables below to insert at cursor</span>
                </div>

                <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.map(p => (
                    <button
                      key={p.placeholder}
                      type="button"
                      onClick={() => insertPlaceholder(p.placeholder)}
                      className="h-6 px-2 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-700 dark:text-slate-300 font-extrabold text-[8px] uppercase tracking-wider transition-colors flex items-center gap-0.5"
                    >
                      <Plus className="h-2.5 w-2.5 text-brand-500" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <textarea
                  ref={textareaRef}
                  required
                  rows="12"
                  placeholder="Write template contents here. Use variables like {{employee_name}} which will auto-fill with profile details..."
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs border-t pt-3 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase text-[9px]">Signatures Configuration</label>
                  <div className="flex gap-4 items-center mt-2.5">
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={templateForm.requireManagerSignature}
                        onChange={(e) => setTemplateForm({ ...templateForm, requireManagerSignature: e.target.checked })}
                        className="rounded border-slate-355 text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Manager Signature Line</span>
                    </label>

                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={templateForm.requireEmployeeSignature}
                        onChange={(e) => setTemplateForm({ ...templateForm, requireEmployeeSignature: e.target.checked })}
                        className="rounded border-slate-355 text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Employee Signature Line</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end items-end h-full">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="h-9 px-4 rounded-xl border font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl bg-[#2e6559] hover:bg-[#2e6559]/90 text-white font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editorMode === 'create' ? 'Create Template' : 'Save Template'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 3. GENERATOR TAB */}
      {activeTab === 'generator' && (
        <div className="grid gap-6 lg:grid-cols-12 max-w-6xl">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerateSubmit} className="glass-card rounded-2xl border p-4 space-y-4 text-xs">
              <div className="border-b pb-3 mb-2 dark:border-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#2e6559]" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Document Generation Panel</h3>
              </div>

              {genStep === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Select Document Template *</label>
                    <select
                      value={genTemplateId}
                      onChange={(e) => setGenTemplateId(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                    >
                      <option value="">-- Choose Template --</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[9px]">Select Target Employee *</label>
                    <select
                      value={genEmployeeId}
                      onChange={(e) => handleGenEmployeeChange(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-2 outline-none focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} (${emp.id} - ${emp.title})</option>
                      ))}
                    </select>
                  </div>

                  {genTemplateId && genEmployeeId && (
                    <button
                      type="button"
                      onClick={() => setGenStep(2)}
                      className="w-full h-9 rounded-xl bg-[#2e6559] hover:bg-[#2e6559]/90 text-white font-bold flex items-center justify-center gap-1.5 transition-all mt-2"
                    >
                      <span>Continue to Customize</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[11px] font-semibold space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Template:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {templates.find(t => t.id === genTemplateId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Employee:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {employees.find(e => e.id === genEmployeeId)?.name}
                      </span>
                    </div>
                  </div>

                  {/* Override Variables Panel */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">Override Mapping Fields</h4>
                    
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[9px] block">Start Date</label>
                        <input
                          type="text"
                          value={genOverrides.start_date}
                          onChange={(e) => setGenOverrides({ ...genOverrides, start_date: e.target.value })}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:border-slate-800 dark:bg-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[9px] block">Salary Value</label>
                        <input
                          type="text"
                          value={genOverrides.salary}
                          onChange={(e) => setGenOverrides({ ...genOverrides, salary: e.target.value })}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:border-slate-800 dark:bg-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[9px] block">National Insurance No</label>
                        <input
                          type="text"
                          value={genOverrides.national_insurance_no}
                          onChange={(e) => setGenOverrides({ ...genOverrides, national_insurance_no: e.target.value })}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:border-slate-800 dark:bg-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[9px] block">Contract Type</label>
                        <input
                          type="text"
                          value={genOverrides.contract_type}
                          onChange={(e) => setGenOverrides({ ...genOverrides, contract_type: e.target.value })}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#2e6559] dark:border-slate-800 dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t pt-3 dark:border-slate-800 mt-2">
                    <button
                      type="button"
                      onClick={() => setGenStep(1)}
                      className="flex-1 h-9 rounded-xl border font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      <span>Generate & Store</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Live Preview Side */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-[9px]">Live Document Preview (A4 Page simulation)</span>
              {genTemplateId && genEmployeeId && genStep === 2 && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                  <Check className="h-3.5 w-3.5" />
                  <span>Placeholders mapped successfully</span>
                </div>
              )}
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white text-slate-800 shadow-lg overflow-hidden flex flex-col justify-start">
              {genTemplateId && genEmployeeId ? (
                (() => {
                  const template = templates.find(t => t.id === genTemplateId);
                  const employee = employees.find(e => e.id === genEmployeeId);
                  if (!template || !employee) return null;
                  
                  return (
                    <div id="live-generator-preview-holder" className="p-8 letter-preview relative text-sm leading-relaxed min-h-[550px] font-sans">
                      {/* Logo header */}
                      {template.includeLogo && (
                        <div className="border-b-2 border-[#2e6559] pb-4 mb-6 flex justify-between items-start">
                          <div>
                            <h1 className="text-lg font-bold tracking-wider text-[#2e6559] uppercase font-sans">AS CARE HOME</h1>
                            <p className="text-[10px] text-slate-400">12 Oakfield Lane, Birmingham, B29 4AA</p>
                            <p className="text-[10px] text-slate-400">Tel: +44 121 555 0199 | admin@ascarehome.co.uk</p>
                          </div>
                          <div className="text-right">
                            <div className="h-10 w-10 bg-[#2e6559] rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm ml-auto">
                              AS
                            </div>
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block mt-1">CQC REGULATED</span>
                          </div>
                        </div>
                      )}

                      <div className="text-right text-xs text-slate-400 mb-6">
                        <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                      </div>

                      <div className="mb-6 text-xs space-y-0.5">
                        <strong className="text-slate-500 block mb-0.5 text-[9px] uppercase tracking-wider">Recipient Details:</strong>
                        <p className="font-bold text-slate-800">{employee.name}</p>
                        <p className="text-slate-500">{employee.address}</p>
                      </div>

                      <div className="mb-5">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                          {template.subject || 'Official Communication'}
                        </h2>
                      </div>

                      <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-10 text-xs">
                        {replacePlaceholders(template.content, employee, genOverrides)}
                      </div>

                      {/* Signatures */}
                      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                        {template.requireManagerSignature ? (
                          <div>
                            <p className="text-slate-400 text-[9px] uppercase font-bold">Authorized Signature</p>
                            <div className="h-8 flex items-end">
                              <span className="font-serif italic text-sm text-[#2e6559] border-b border-dashed border-slate-200 pb-1">
                                Sarah Jenkins
                              </span>
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">Sarah Jenkins</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px]">General Manager, AS Care</p>
                          </div>
                        ) : <div />}

                        {template.requireEmployeeSignature ? (
                          <div className="text-right">
                            <p className="text-slate-400 text-[9px] uppercase font-bold">Employee Signature</p>
                            <div className="h-8 flex items-end justify-end">
                              <span className="font-serif italic text-sm text-slate-500 border-b border-dashed border-slate-200 pb-1 w-36">
                                E-Signed by Employee
                              </span>
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">{employee.name}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px]">Employee Acknowledgment</p>
                          </div>
                        ) : <div />}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-12 text-center text-slate-400 italic min-h-[400px] flex items-center justify-center">
                  Select a template and employee on the left to see the live document preview.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by document name, employee, or creator..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-10 pr-4 h-10 w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="p-3.5 pl-5">Document Name</th>
                    <th className="p-3.5">Employee</th>
                    <th className="p-3.5">Generated Stamp</th>
                    <th className="p-3.5">Generated By</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 italic">No document generation logs found.</td>
                    </tr>
                  ) : (
                    filteredHistory.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/45 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4.5 w-4.5 text-brand-500" />
                            <span>{h.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            {h.employeePhoto && (
                              <img src={h.employeePhoto} alt="" className="h-5 w-5 rounded-full object-cover border" />
                            )}
                            <span>{h.employeeName}</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-1 py-0.2 rounded border dark:border-slate-800">
                              {h.employeeId}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400 font-semibold">{h.uploadTime}, {h.uploadDate}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-extrabold text-[8px] border uppercase bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {h.uploadedBy}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const pseudoTemplate = {
                                  name: h.name,
                                  subject: h.name,
                                  content: '',
                                  includeLogo: false,
                                  requireManagerSignature: false,
                                  requireEmployeeSignature: false
                                };
                                setPreviewTemplate(pseudoTemplate);
                                setPreviewEmployee({
                                  ...employees.find(e => e.id === h.employeeId),
                                  __directHtml: h.contentHtml
                                });
                                setIsClassPreviewOpen(true);
                              }}
                              className="h-7 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors text-[9px] font-bold flex items-center gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View letter</span>
                            </button>

                            <button
                              onClick={() => {
                                const container = document.createElement('div');
                                container.id = 'temp-pdf-history-holder-hr';
                                container.style.position = 'absolute';
                                container.style.left = '-9999px';
                                container.innerHTML = h.contentHtml;
                                document.body.appendChild(container);
                                triggerPDFDownload('temp-pdf-history-holder-hr', h.name).then(() => {
                                  document.body.removeChild(container);
                                });
                              }}
                              className="h-7 px-3 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-950/60 transition-colors text-[9px] font-bold flex items-center gap-1"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW TEMPLATE */}
      {isClassPreviewOpen && previewTemplate && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-modal max-w-3xl w-full rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative bg-white dark:bg-slate-950 animate-slide-up max-h-[calc(100vh-2rem)] flex flex-col justify-start">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-brand-500" />
                <span>Document Viewer: {previewTemplate.name}</span>
              </h3>
              
              <div className="flex items-center gap-2 pr-6">
                <button
                  onClick={() => {
                    triggerPrint('modal-document-preview-holder-hr', previewTemplate.name);
                  }}
                  className="h-7 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold text-[9px] flex items-center gap-1 transition-all"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => {
                    triggerPDFDownload('modal-document-preview-holder-hr', previewTemplate.name);
                  }}
                  className="h-7 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[9px] flex items-center gap-1 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
                
                {!previewEmployee.__directHtml && (
                  <select
                    value={previewEmployee.id}
                    onChange={(e) => {
                      const emp = employees.find(em => em.id === e.target.value);
                      if (emp) {
                        setPreviewEmployee(emp);
                        setPreviewOverrides({
                          salary: emp.salary || '',
                          start_date: emp.startDate || '',
                          national_insurance_no: emp.niNumber || '',
                          contract_type: emp.contractType || ''
                        });
                      }
                    }}
                    className="h-7 px-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[9px] font-bold outline-none"
                  >
                    {employees.map(em => (
                      <option key={em.id} value={em.id}>{em.name} ({em.id})</option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  setIsClassPreviewOpen(false);
                }}
                className="absolute right-4 top-4 h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Plus className="h-4.5 w-4.5 rotate-45" />
              </button>
            </div>

            {/* Simulated A4 Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-100/60 dark:bg-slate-900/10">
              <div className="bg-white text-slate-800 shadow-md rounded-xl max-w-[800px] mx-auto overflow-hidden">
                
                {previewEmployee.__directHtml ? (
                  <div 
                    id="modal-document-preview-holder-hr"
                    dangerouslySetInnerHTML={{ __directHtml: undefined, __html: previewEmployee.__directHtml }} 
                  />
                ) : (
                  <div id="modal-document-preview-holder-hr" className="p-8 letter-preview relative text-xs leading-relaxed font-sans">
                    {/* Header */}
                    {previewTemplate.includeLogo && (
                      <div className="border-b-2 border-[#2e6559] pb-4 mb-6 flex justify-between items-start">
                        <div>
                          <h1 className="text-base font-bold tracking-wider text-[#2e6559] uppercase font-sans">AS CARE HOME</h1>
                          <p className="text-[9px] text-slate-400">12 Oakfield Lane, Birmingham, B29 4AA</p>
                          <p className="text-[9px] text-slate-400">Tel: +44 121 555 0199 | email: admin@ascarehome.co.uk</p>
                        </div>
                        <div className="text-right">
                          <div className="h-9 w-9 bg-[#2e6559] rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-sm ml-auto">
                            AS
                          </div>
                          <span className="text-[7px] uppercase tracking-wider font-extrabold text-slate-400 block mt-1">CQC REGULATED</span>
                        </div>
                      </div>
                    )}

                    <div className="text-right text-[10px] text-slate-400 mb-6">
                      <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                    </div>

                    <div className="mb-6 space-y-0.5">
                      <strong className="text-slate-500 block mb-0.5 text-[9px] uppercase tracking-wider">Recipient:</strong>
                      <p className="font-bold text-slate-800">{previewEmployee.name}</p>
                      <p className="text-slate-500">{previewEmployee.address}</p>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                        {previewTemplate.subject || 'Official Communication'}
                      </h2>
                    </div>

                    <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-350 mb-10 leading-relaxed font-normal">
                      {replacePlaceholders(previewTemplate.content, previewEmployee, previewOverrides)}
                    </div>

                    {/* Signatures */}
                    <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
                      {previewTemplate.requireManagerSignature ? (
                        <div>
                          <p className="text-slate-400 text-[8px] uppercase font-bold">Authorized Signature</p>
                          <div className="h-7 flex items-end">
                            <span className="font-serif italic text-xs text-[#2e6559] border-b border-dashed border-slate-200 pb-0.5">
                              Sarah Jenkins
                            </span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">Sarah Jenkins</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[9px]">General Manager, AS Care</p>
                        </div>
                      ) : <div />}

                      {previewTemplate.requireEmployeeSignature ? (
                        <div className="text-right">
                          <p className="text-slate-400 text-[8px] uppercase font-bold">Employee Signature</p>
                          <div className="h-7 flex items-end justify-end">
                            <span className="font-serif italic text-xs text-slate-500 border-b border-dashed border-slate-200 pb-0.5 w-32">
                              E-Signed by Employee
                            </span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 font-bold mt-1">{previewEmployee.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[9px]">Employee Acknowledgment</p>
                        </div>
                      ) : <div />}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default HRDocumentTemplates;
