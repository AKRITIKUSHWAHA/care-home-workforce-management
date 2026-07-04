import React, { useState } from 'react';
import { ClipboardType, Search, Filter, Download, Plus, ChevronRight, MoreHorizontal, X, FileUp } from 'lucide-react';

const CareNotes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ "date": "", "client": "", "loggedBy": "", "note": "", status: 'Active' });

  const kpis = [
  {
    "label": "Notes Logged Today",
    "val": "284",
    "color": "from-blue-500 to-indigo-600"
  },
  {
    "label": "Requires Review",
    "val": "12",
    "color": "from-amber-500 to-orange-600"
  },
  {
    "label": "Incident Mentions",
    "val": "2",
    "color": "from-rose-500 to-red-600"
  }
];
  const schema = [
  {
    "id": "date",
    "label": "Date",
    "type": "date"
  },
  {
    "id": "client",
    "label": "Client",
    "type": "select",
    "options": [
      "Margaret Smith",
      "John Taylor",
      "Eleanor Davies"
    ]
  },
  {
    "id": "loggedBy",
    "label": "Logged By",
    "type": "select",
    "options": [
      "Sarah Jenkins",
      "David Chen"
    ]
  },
  {
    "id": "note",
    "label": "Care Note Details",
    "type": "textarea"
  }
];
  const columns = schema.slice(0, 4).map(f => f.label);
  const dataKeys = schema.slice(0, 4).map(f => f.id);
  const [tableData, setTableData] = useState([
  {
    "id": "1",
    "date": "2026-06-19",
    "client": "Margaret Smith",
    "loggedBy": "Sarah Jenkins",
    "note": "Ate full breakfast, mood is good.",
    "status": "Normal"
  },
  {
    "id": "2",
    "date": "2026-06-19",
    "client": "John Taylor",
    "loggedBy": "David Chen",
    "note": "Refused medication, doctor notified.",
    "status": "Alert"
  },
  {
    "id": "3",
    "date": "2026-06-19",
    "client": "Eleanor Davies",
    "loggedBy": "Emma Wilson",
    "note": "Family visited for 1 hour.",
    "status": "Normal"
  }
]);

  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now().toString(),
      ...formData
    };
    setTableData([newRecord, ...tableData]);
    setIsModalOpen(false);
    setFormData({ "date": "", "client": "", "loggedBy": "", "note": "", status: 'Active' });
  };

  const filteredData = tableData.filter(row => 
    String(row[dataKeys[0]] || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(row[dataKeys[1]] || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600 p-6 md:p-8 text-white shadow-lg shadow-brand-900/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <ClipboardType className="w-8 h-8" />
            Daily Care Notes
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            Log and review daily care notes and visit summaries.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 text-xs font-bold text-white transition-all flex items-center gap-1.5 backdrop-blur-sm">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 rounded-xl bg-white px-4 text-xs font-bold text-brand-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/80">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{kpi.val}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${kpi.color} text-white shadow-md`}>
              <ClipboardType className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Records</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-bold">{col}</th>
                ))}
                <th className="px-6 py-4 font-bold text-right">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{row[dataKeys[0]]}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row[dataKeys[1]]}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row[dataKeys[2]]}</td>
                  {columns.length > 3 && <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row[dataKeys[3]]}</td>}
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block
                      ${row.status.includes('Active') || row.status.includes('Completed') || row.status.includes('Valid') || row.status.includes('Green') || row.status.includes('Paid') || row.status.includes('Good') || row.status.includes('Given') || row.status.includes('Normal') || row.status.includes('0')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : row.status.includes('Alert') || row.status.includes('Red') || row.status.includes('Overdue') || row.status.includes('Escalate') || row.status.includes('Missing') || row.status.includes('Upheld') || row.status.includes('5')
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                      {row.status}
                    </span>
                    <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 text-center">
          <button className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center justify-center gap-1 w-full">
            View All Records <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-fade-in border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {schema.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows="4"
                      value={formData[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800 dark:text-slate-200 resize-none"
                    />
                  ) : field.type === 'file' ? (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                       <FileUp className="w-6 h-6 mb-2 text-brand-500" />
                       <span className="text-xs font-semibold">Click to upload document</span>
                    </div>
                  ) : (
                    <input 
                      type={field.type} 
                      value={formData[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800 dark:text-slate-200" 
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Alert</option>
                  <option>Normal</option>
                  <option>Valid</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleAddRecord}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold transition-all shadow-md shadow-brand-500/20 active:scale-[0.98]"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareNotes;
