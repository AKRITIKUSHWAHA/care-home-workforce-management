import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Calendar, Clock, AlertCircle, X } from 'lucide-react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_DATE_MAP = {
  "Monday": "01 Jun 2026",
  "Tuesday": "02 Jun 2026",
  "Wednesday": "03 Jun 2026",
  "Thursday": "04 Jun 2026",
  "Friday": "05 Jun 2026",
  "Saturday": "06 Jun 2026",
  "Sunday": "07 Jun 2026"
};

const DayNotes = () => {
  const { 
    dayNotes, 
    addDayNote, 
    editDayNote, 
    deleteDayNote, 
    currentRole 
  } = useApp();

  const [selectedDay, setSelectedDay] = useState("Tuesday");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form states
  const [noteType, setNoteType] = useState("General Note");
  const [customNoteType, setCustomNoteType] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [notePriority, setNotePriority] = useState("Low");
  const [noteVisibility, setNoteVisibility] = useState("All Staff");

  // CQC Daily Shift Checklist States
  const [cqcStaffing, setCqcStaffing] = useState(true);
  const [cqcCareNotes, setCqcCareNotes] = useState(true);
  const [cqcMarCharts, setCqcMarCharts] = useState(true);
  const [cqcSafetyExits, setCqcSafetyExits] = useState(true);

  // Permissions helpers
  const isReceptionist = currentRole === 'Receptionist';
  const isEmployee = currentRole === 'Employee';
  const isCompliance = currentRole === 'Compliance Officer';
  const isManager = currentRole === 'Manager';
  const isAdmin = currentRole === 'Admin';

  const canCreateNotes = isAdmin || isManager || isCompliance;
  const canEditNotes = isAdmin || isManager || isCompliance;
  const canDeleteNotes = isAdmin || isManager;

  const canViewNote = (note) => {
    if (isAdmin || isManager) return true;
    if (isCompliance && note.visibility !== 'Managers Only') return true;
    if (isEmployee && note.visibility === 'All Staff') return true;
    return false;
  };

  const filteredNotes = dayNotes.filter(n => n.day === selectedDay && canViewNote(n));

  const handleSave = (e) => {
    e.preventDefault();
    const finalType = noteType === 'Other' ? (customNoteType || 'Other') : noteType;
    const noteData = {
      type: finalType,
      title: noteTitle,
      description: noteDescription,
      priority: notePriority,
      visibility: noteVisibility
    };

    const creatorName = currentRole === 'Compliance Officer' ? 'Compliance' : currentRole;

    if (editingNote) {
      editDayNote(editingNote.id, {
        ...noteData,
        updatedBy: creatorName
      });
    } else {
      addDayNote(selectedDay, {
        ...noteData,
        createdBy: creatorName
      });
    }

    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in p-1 max-w-[1200px] mx-auto relative">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Day Notes Dashboard</h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage and track care home historical logs and notifications</p>
        </div>
        {canCreateNotes && (
          <button
            onClick={() => {
              setEditingNote(null);
              setNoteType("General Note");
              setCustomNoteType("");
              setNoteTitle("");
              setNoteDescription("");
              setNotePriority("Low");
              setNoteVisibility("All Staff");
              setAddModalOpen(true);
            }}
            className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add Day Note</span>
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-4 items-start">
        {/* Left selector */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Select Day of Week</span>
          <div className="space-y-1">
            {DAYS.map(day => {
              const count = dayNotes.filter(n => n.day === day && canViewNote(n)).length;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all
                    ${isSelected 
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-955/20 dark:text-brand-400 border border-brand-200 dark:border-brand-900/50' 
                      : 'text-slate-650 hover:bg-slate-55 dark:hover:bg-slate-905'
                    }
                  `}
                >
                  <div className="text-left">
                    <p className="font-bold">{day}</p>
                    <span className="text-[10px] text-slate-400 font-normal">{DAY_DATE_MAP[day]}</span>
                  </div>
                  {count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[9px] font-extrabold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right notes list */}
        <div className="md:col-span-3 space-y-4">
          <div className="glass-card rounded-2xl p-5 min-h-[400px]">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <span>📌</span>
              <span>Notes for {selectedDay} ({DAY_DATE_MAP[selectedDay]})</span>
            </h3>

            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
                  <AlertCircle className="h-10 w-10 text-slate-300" />
                  <p className="italic text-xs">No day notes recorded for this date.</p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-855 bg-slate-50/40 dark:bg-slate-900/30 text-xs space-y-2 relative group hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border 
                          ${note.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30' : 
                            note.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-955/20 dark:text-amber-450 dark:border-rose-900/30' : 
                            'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                          }`}
                        >
                          {note.priority} Priority
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border dark:border-slate-800">
                          {note.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEditNotes && (
                          <button
                            onClick={() => {
                              setEditingNote(note);
                              const standardTypes = ["General Note", "Shift Note", "Management Note", "Clinical Note", "Visitor Note"];
                              if (standardTypes.includes(note.type)) {
                                setNoteType(note.type);
                                setCustomNoteType("");
                              } else {
                                setNoteType("Other");
                                setCustomNoteType(note.type);
                              }
                              setNoteTitle(note.title);
                              setNoteDescription(note.description);
                              setNotePriority(note.priority);
                              setNoteVisibility(note.visibility);
                              setAddModalOpen(true);
                            }}
                            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        {canDeleteNotes && (
                          <button
                            onClick={() => {
                              if (confirm("Delete this day note?")) {
                                deleteDayNote(note.id);
                              }
                            }}
                            className="text-[11px] font-bold text-rose-650 dark:text-rose-400 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{note.title}</h4>
                    {note.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed whitespace-pre-wrap">{note.description}</p>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-850/80 pt-2 mt-2 font-medium">
                      <span>Created by {note.createdBy}</span>
                      <span>{note.createdDate}</span>
                    </div>
                    {note.updatedBy && (
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        <span>Updated by {note.updatedBy}</span>
                        <span>{note.updatedDate}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Note Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-modal p-5 shadow-2xl relative animate-slide-up bg-white text-xs">
            <button 
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-205 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📌</span>
              <span>{editingNote ? 'Edit' : 'Add'} Day Note</span>
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Note Type</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="General Note">General Note</option>
                    <option value="Daily Shift Record">Daily Shift Record</option>
                    <option value="Shift Note">Shift Note</option>
                    <option value="Management Note">Management Note</option>
                    <option value="Clinical Note">Clinical Note</option>
                    <option value="Visitor Note">Visitor Note</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Date</label>
                  <input
                    type="text"
                    readOnly
                    value={`${selectedDay} (${DAY_DATE_MAP[selectedDay]})`}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-405 font-semibold cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {noteType === 'Other' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-555 block">Specify Note Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maintenance Note"
                    value={customNoteType}
                    onChange={(e) => setCustomNoteType(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white font-semibold"
                  />
                </div>
              )}

              {noteType === 'Daily Shift Record' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs font-semibold">
                  <span className="font-bold text-slate-705 dark:text-slate-300 block mb-1">CQC Compliance Checklist Verification:</span>
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cqcStaffing} 
                      onChange={(e) => setCqcStaffing(e.target.checked)} 
                      className="rounded border-slate-355 text-brand-655 focus:ring-brand-500" 
                    />
                    <span className="text-slate-600 dark:text-slate-400">Shift staffing fully compliant?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cqcCareNotes} 
                      onChange={(e) => setCqcCareNotes(e.target.checked)} 
                      className="rounded border-slate-355 text-brand-655 focus:ring-brand-500" 
                    />
                    <span className="text-slate-600 dark:text-slate-400">Care notes logs completed for all residents?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cqcMarCharts} 
                      onChange={(e) => setCqcMarCharts(e.target.checked)} 
                      className="rounded border-slate-355 text-brand-655 focus:ring-brand-500" 
                    />
                    <span className="text-slate-600 dark:text-slate-400">Medication MAR charts verified & signed off?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cqcSafetyExits} 
                      onChange={(e) => setCqcSafetyExits(e.target.checked)} 
                      className="rounded border-slate-355 text-brand-655 focus:ring-brand-500" 
                    />
                    <span className="text-slate-600 dark:text-slate-400">Building fire exits inspected & clear?</span>
                  </label>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-555 block">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Meeting at 4 PM"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-555 block">Description</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Brief description of the note details..."
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-555 block">Priority</label>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-555 block">Visibility</label>
                  <select
                    value={noteVisibility}
                    onChange={(e) => setNoteVisibility(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Managers Only">Managers Only</option>
                    <option value="Management & Compliance">Management & Compliance</option>
                    <option value="All Staff">All Staff</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl bg-brand-655 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-505/10 active:scale-[0.98]"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayNotes;
