import React, { useState } from 'react';
import { Save, Edit3, User, ChevronDown, ChevronUp, Paperclip, Upload, AlertTriangle, Phone, MapPin, Heart, Shield, Stethoscope, Briefcase, Check, AlertOctagon, UserCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import BodyMap from './BodyMap';
import RiskAssessments from './RiskAssessments';
import RestrictivePractices from './RestrictivePractices';
import SafeguardingActionRecords from './SafeguardingActionRecords';
import { cqcGuidance } from '../configs/cqcGuidance';
import { personalTemplates, dementiaTemplates } from '../configs/cqcTemplates';

const CareNotesTab = ({ patientName }) => {
  const { careNotes, addCareNote } = useApp();
  const [newNote, setNewNote] = useState('');
  const [hasRefusedCare, setHasRefusedCare] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredNotes = careNotes.filter(
    (n) => n.patientName.toLowerCase() === patientName.toLowerCase()
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const patientMap = {
      'Margaret Smith': 1,
      'Arthur Pendelton': 2,
      'Margaret Atwood': 3,
      'John Miller': 4
    };
    const patientId = patientMap[patientName] || 999;

    addCareNote(
      patientId,
      patientName,
      newNote,
      hasRefusedCare,
      'John (Senior Carer)',
      'Just now'
    );
    
    setNewNote('');
    setHasRefusedCare(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Add Care Note Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Log Care Note for {patientName}</h3>
          <p className="text-xs text-slate-500">Record a new care activity, support update, or clinical observations.</p>
        </div>

        <textarea
          required
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="e.g. Assisted resident with afternoon hydration. Checked skin integrity, no signs of redness..."
          className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasRefusedCare}
              onChange={(e) => setHasRefusedCare(e.target.checked)}
              className="rounded border-slate-350 text-red-650 focus:ring-red-650"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Resident Refused Care Alert ⚠️
            </span>
          </label>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#7ac143] hover:bg-[#68a837] text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Log Note</span>
          </button>
        </div>

        {isSuccess && (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-450 animate-pulse">
            ✓ Care note logged successfully and synced to profile.
          </p>
        )}
      </form>

      {/* Historical Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider">Historical Care Notes Logs</h3>

        {filteredNotes.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No care notes logged for this resident yet.</p>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 pl-6 space-y-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="relative animate-fade-in">
                {/* Timeline Bullet */}
                <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${
                  note.hasRefusedCare ? 'border-red-500' : 'border-[#7ac143]'
                }`} />

                <div className={`p-4 rounded-xl border ${
                  note.hasRefusedCare
                    ? 'bg-red-50/60 border-red-250 text-red-950 dark:bg-red-950/10 dark:border-red-900/40 dark:text-red-200 border-l-4 border-l-red-500'
                    : 'bg-slate-50/50 border-slate-200 dark:bg-slate-850/30 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {note.author}
                      </span>
                      {note.hasRefusedCare && (
                        <span className="text-[9px] font-black uppercase text-red-650 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-md">
                          Refused Care
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {note.time}
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed leading-normal">{note.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const mockPlanData = {
  profilePic: 'https://i.pravatar.cc/150?img=47',
  nextReviewDate: '01/12/2026',
  isOverdue: false,
  contacts: [
    { role: 'Doctor', name: 'Dr. Hancock', details: 'Tillingham Medical Centre', icon: Stethoscope },
    { role: 'Social Worker', name: 'Jane Smith', details: 'County Council', icon: Briefcase },
    { role: 'Power of Attorney', name: 'Clive Smith', details: 'Son (Finance & Health)', icon: Shield },
    { role: 'Next of Kin', name: 'Ann Smith', details: 'Wife - 07700 900111', icon: Heart }
  ],
  sections: {
  // 1. Personal Profile
  personalProfile: {
    fullName: 'Margaret Smith',
    preferredName: 'Margaret',
    dob: '01/01/1940',
    gpDetails: 'Dr. Jones, City Clinic',
    nextOfKin: 'John Smith (Son) - 07700 900000',
    keyContacts: 'Sarah (Daughter)',
    religion: 'Church of England',
    preferredRoutines: 'Prefers to be called Margaret. Enjoys having her hair done weekly.',
    lifeHistory: 'Lived independently for most of her life. Former teacher.',
    likesDislikes: 'Likes matching outfits. Dislikes feeling rushed.'
  },
  // 2. Communication
  communication: 'Wears hearing aids and glasses. Staff should speak clearly, face her, and allow time for responses.',
  // 3. Mobility
  mobility: 'Requires assistance from one member of staff when walking short distances using her Zimmer frame. Uses wheelchair for long distances.',
  // 4. Falls Risk
  fallsRisk: 'High risk. Previous falls history. Ensure environment remains clutter-free and encourage use of walking aid.',
  // 5. Personal Care
  personalCare: 'Requires assistance with washing, dressing, and creams. Prefers female carers. Prefers a shower twice weekly.',
  // 6. Continence
  continence: 'Requires continence checks every 2–3 hours and assistance with pad changes.',
  // 7. Nutrition
  nutrition: 'Requires assistance with hot drinks. Normal diet, no allergies.',
  // 8. Medication
  medication: 'Requires full administration of prescribed medication.',
  // 9. Skin Integrity
  skinIntegrity: 'Intact skin. Waterlow Score 15 (Moderate Risk). Apply prescribed emollient cream twice daily.',
  // 10. Mental Health
  mentalHealth: 'Can become anxious if feeling rushed. Approach calmly and explain tasks.',
  // 11. Dementia Care
  dementiaCare: 'Mild memory difficulties. Responds well to gentle reminders.',
  // 12. Activities
  activities: 'Enjoys gardening, classical music, and discussing local history.',
  // 13. Sleep
  sleep: 'Sleeps well but requires 2-hourly checks to ensure comfort.',
  // 14. Health Conditions
  healthConditions: 'Advanced osteoarthritis affecting both knees.',
  // 15. End of Life
  endOfLife: 'Has an active DNACPR. Prefers to remain at the home.'
  }
};

const writingHelperTemplates = {
  communication: [
    { label: 'Hearing Aid Routine', text: '[Sensory needs: Right-ear hearing aid. Cleaned daily by night staff. Batteries checked weekly.]' },
    { label: 'Speech Support', text: '[Communication: Needs clear, slow speech. Face-to-face contact. Use visual choice cards.]' },
    { label: 'Reading & Visual Aids', text: '[Aids used: Large-print documents, glasses for reading, picture charts for meals.]' }
  ],
  mobility: [
    { label: 'Zimmer Frame', text: '[Mobility: Zimmer frame used. Needs standby supervision of 1 carer for transfers.]' },
    { label: 'LOLER Hoist Protocol', text: '[Transfer: Mechanical hoist transfer. Requires 2-carer assist at all times. Medium clip sling.]' },
    { label: 'Safe Footwear', text: '[Footwear: Non-slip supportive shoes. Orthotic inserts. Check shoe fit monthly.]' }
  ],
  fallsRisk: [
    { label: 'FRAT Score Profile', text: '[Falls Risk: FRAT score of 18 (High Risk). Sensor mat active next to bed.]' },
    { label: 'Bed & Safety Height', text: '[Environment: Low-profile profiling bed kept at lowest height. Call bell within easy reach.]' },
    { label: 'Clutter-Free Rooms', text: '[Checks: Room corridors clear of clutter. Staff to check foot alignment during walking.]' }
  ],
  personalCare: [
    { label: 'Bathing Choice', text: '[Hygiene preference: Shower twice weekly on Mon/Thu. Prefers female carers. Warm room required.]' },
    { label: 'Skin Care & Creams', text: '[Skin Care: Doublebase cream applied to legs daily. Assess pressure areas daily during washes.]' },
    { label: 'Oral & Dentures', text: '[Oral Care: Brush teeth twice daily. Soak dentures overnight in container.]' }
  ],
  continence: [
    { label: 'Toileting Regime', text: '[Toileting: Prompt every 2 hours. Bowel motions logged using Bristol Stool Chart.]' },
    { label: 'Pad Profile & Creams', text: '[Pad Profile: TENA Slip Super (Size Medium). Change 4-hourly. Use Cavilon barrier cream.]' },
    { label: 'Infection Monitoring', text: '[UTI Checks: Monitor urine color. Report foul smell immediately to team leader.]' }
  ],
  nutrition: [
    { label: 'Diet consistency', text: '[Diet: Normal diet. Fork-mashable. Must be cut into bite-sized pieces.]' },
    { label: 'Fluid Balance Target', text: '[Hydration: Target 1500ml daily. Record in ml. Prefers cold squash or hot tea.]' },
    { label: 'MUST score & Weight', text: '[Nutrition check: MUST score of 1. Weigh monthly. Log food intake %.]' }
  ],
  medication: [
    { label: 'MAR Level Support', text: '[Medication: Level 1 support. Administer with water. Check MAR charts after each round.]' },
    { label: 'PRN Protocol', text: '[PRN Meds: PRN Paracetamol 1g for joint pain, max 4 times daily. Log pain scores.]' }
  ],
  skinIntegrity: [
    { label: 'Waterlow Parameters', text: '[Skin Integrity: Waterlow score of 16 (High Risk). Foam mattress. Reposition 4-hourly in bed.]' },
    { label: 'Dressings & Nurses', text: '[Wounds: Minor skin tear on left forearm. Dressings changed every 3 days by District Nurse.]' }
  ],
  mentalHealth: [
    { label: 'Anxiety Indicators', text: '[Mood: Can experience low mood in evenings. Engage in 1-to-1 conversation about family.]' },
    { label: 'Dementia Reassurance', text: '[Cognition: Reassure when disoriented. Avoid conflicting statements. Validation therapy.]' }
  ],
  dementiaCare: [
    { label: 'Cognitive Baseline', text: '[Cognition: Mild dementia. Needs orientation prompts. Reassure about routine regularly.]' },
    { label: 'Memory Helpers', text: '[Memory: Prefers structured schedules. Display daily orientation calendar on bedroom wall.]' }
  ],
  activities: [
    { label: 'Social Interests', text: '[Activities: Prefers small group activities. Loves quiz night. Does not like loud bingo.]' },
    { label: 'Garden Walks', text: '[Outdoors: Enjoys walking in the home garden with family. Needs 1 carer standby.]' }
  ],
  sleep: [
    { label: 'Night Routine', text: '[Sleeping: Settles after warm milk. Leave low-level light on in bathroom. Check 2-hourly.]' },
    { label: 'PRN Sleep Aids', text: '[Sleep Aids: PRN Zopiclone available if distressed. Administered as per protocol.]' }
  ],
  healthConditions: [
    { label: 'Osteoarthritis', text: '[Conditions: Advanced osteoarthritis affecting knees. Administer gel as prescribed.]' },
    { label: 'Diabetes Monitoring', text: '[Medical: Type 2 Diabetes. Blood glucose monitored weekly. Keep record in glucose log.]' }
  ]
};

const CqcStructuredSection = ({ title, field, data, isEditing, onChange, isExpanded, onToggle, template }) => {
  const [isReviewed, setIsReviewed] = useState(false);

  const cqcData = React.useMemo(() => {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      return {
        why: data.why || '',
        how: data.how || '',
        good: data.good || '',
        poor: data.poor || '',
        when: data.when || '',
        who: data.who || '',
        record: data.record || '',
        dignity: data.dignity || '',
        success: data.success || '',
        evidence: data.evidence || ''
      };
    }
    return {
      why: typeof data === 'string' ? data : '',
      how: '',
      good: '',
      poor: '',
      when: '',
      who: '',
      record: '',
      dignity: '',
      success: '',
      evidence: ''
    };
  }, [data]);

  const handleFieldChange = (key, val) => {
    onChange(field, { ...cqcData, [key]: val });
  };

  const handlePrepopulate = () => {
    if (template) {
      onChange(field, {
        why: template.why,
        how: template.how,
        good: template.good,
        poor: template.poor,
        when: template.when,
        who: template.who,
        record: template.record,
        dignity: template.dignity,
        success: template.success,
        evidence: template.evidence
      });
    }
  };

  const cqcFields = [
    { key: 'why', label: '• WHY it matters', color: 'border-blue-200 bg-blue-50/20 text-blue-900 dark:bg-blue-950/20 dark:text-blue-200', placeholder: 'Explain why this intervention is important for the resident...' },
    { key: 'how', label: '• HOW to do it safely', color: 'border-emerald-200 bg-emerald-50/20 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200', placeholder: 'Detail step-by-step instructions for safe delivery...' },
    { key: 'good', label: '• WHAT good practice looks like', color: 'border-teal-200 bg-teal-50/20 text-teal-900 dark:bg-teal-950/20 dark:text-teal-200', placeholder: 'Provide examples of positive, dignified care outcomes...' },
    { key: 'poor', label: '• WHAT poor practice looks like', color: 'border-red-200 bg-red-50/20 text-red-900 dark:bg-red-955/20 dark:text-red-200', placeholder: 'Outline actions/behaviors staff must avoid...' },
    { key: 'when', label: '• WHEN to escalate concerns', color: 'border-amber-200 bg-amber-50/20 text-amber-900 dark:bg-amber-955/20 dark:text-amber-200', placeholder: 'Detail trigger warning signs that require escalation...' },
    { key: 'who', label: '• WHO should be informed', color: 'border-indigo-200 bg-indigo-50/20 text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200', placeholder: 'Specify staff roles or external bodies to notify...' },
    { key: 'record', label: '• WHAT should be recorded', color: 'border-purple-200 bg-purple-50/20 text-purple-900 dark:bg-purple-950/20 dark:text-purple-200', placeholder: 'What logs, charts or daily notes must be completed...' },
    { key: 'dignity', label: '• HOW the intervention promotes dignity, independence & wellbeing', color: 'border-pink-200 bg-pink-50/20 text-pink-900 dark:bg-pink-955/20 dark:text-pink-200', placeholder: 'How does this promote choice, privacy, and reablement...' },
    { key: 'success', label: '• HOW success will be measured', color: 'border-cyan-200 bg-cyan-50/20 text-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-200', placeholder: 'SMART measurable outcomes for the resident...' },
    { key: 'evidence', label: '• WHAT evidence an inspector expects to see', color: 'border-slate-200 bg-slate-50/20 text-slate-900 dark:bg-slate-900/50 dark:text-slate-350', placeholder: 'Evidence demonstrating that the care plan is actively followed...' }
  ];

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border ${!isReviewed ? 'border-red-400 dark:border-red-500/50 shadow-sm shadow-red-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800 shadow-sm'} overflow-hidden mb-3 transition-colors`}>
      <div className="w-full flex items-center justify-between p-4 bg-slate-55/60 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm ${!isReviewed ? 'text-red-650 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{title}</span>
          {!isReviewed && <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Not Updated</span>}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 animate-fade-in border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CQC compliance sections</span>
            {isEditing && template && (
              <button
                type="button"
                onClick={handlePrepopulate}
                className="flex items-center gap-1 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-lg px-2.5 py-1 text-[9.5px] font-bold uppercase transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-white" />
                <span>Auto-draft standard templates</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {cqcFields.map((fieldItem) => (
              <div 
                key={fieldItem.key} 
                className={`p-3 rounded-xl border dark:border-slate-800 dark:bg-slate-850/50 flex flex-col justify-between ${fieldItem.color}`}
              >
                <div>
                  <label className="block text-[9.5px] font-black uppercase tracking-wider mb-1.5 opacity-80">
                    {fieldItem.label}
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      className="w-full p-2.5 text-xs bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-205 dark:border-slate-700 rounded-xl outline-none focus:ring-1 focus:ring-brand-500 font-semibold leading-normal"
                      value={cqcData[fieldItem.key] || ''}
                      onChange={(e) => handleFieldChange(fieldItem.key, e.target.value)}
                      placeholder={fieldItem.placeholder}
                    />
                  ) : (
                    <p className="text-xs font-semibold leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-300">
                      {cqcData[fieldItem.key] || <span className="text-slate-400 italic">Pending input...</span>}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Review Action */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Section Review</span>
            <button 
              type="button"
              onClick={() => setIsReviewed(!isReviewed)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isReviewed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350 hover:bg-green-150'}`}
            >
              {isReviewed ? 'Reviewed ✓' : 'Mark as Reviewed'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

const CarePlanView = ({ patientName = "Margaret Smith", onBack }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [carePlanSubTab, setCarePlanSubTab] = useState('personal'); // 'personal' | 'dementia'

  const [planData, setPlanData] = useState(() => {
    const saved = localStorage.getItem(`carePlan_${patientName}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.personalCarePlan) parsed.personalCarePlan = {};
        if (!parsed.dementiaCarePlan) parsed.dementiaCarePlan = {};
        return parsed;
      } catch (e) {}
    }
    return {
      ...mockPlanData,
      personalCarePlan: {},
      dementiaCarePlan: {}
    };
  });

  const [expandedSection, setExpandedSection] = useState('morningRoutine');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'bodymap' | 'assessments'

  // 🛡️ MULTI-ROLE APPROVAL WORKFLOW STATE
  const [approval, setApproval] = useState({
    status: 'Approved', // 'Draft' | 'Reviewed' | 'Approved' | 'Locked'
    steps: [
      { step: 1, role: 'Drafted by Carer', by: 'John (Senior Carer)', at: '05/06/2026 09:15', done: true },
      { step: 2, role: 'Reviewed by Team Leader', by: 'James Carter (Registered Nurse)', at: '06/06/2026 14:00', done: true },
      { step: 3, role: 'Approved & Locked by Manager', by: 'Sarah Jenkins (General Manager)', at: '07/06/2026 10:30', done: true },
    ]
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null); // { type, label }
  const [approvalPin, setApprovalPin] = useState('');
  const [approvalError, setApprovalError] = useState('');

  const isLocked = approval.status === 'Locked' || approval.status === 'Approved';

  const handleChange = (field, value) => {
    setPlanData(prev => {
      if (carePlanSubTab === 'personal') {
        return {
          ...prev,
          personalCarePlan: {
            ...(prev.personalCarePlan || {}),
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          dementiaCarePlan: {
            ...(prev.dementiaCarePlan || {}),
            [field]: value
          }
        };
      }
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    localStorage.setItem(`carePlan_${patientName}`, JSON.stringify(planData));
    // After save, reset to Draft for re-review
    setApproval(prev => ({
      ...prev,
      status: 'Draft',
      steps: [
        { step: 1, role: 'Drafted by Carer', by: 'John (Senior Carer)', at: new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}), done: true },
        { step: 2, role: 'Reviewed by Team Leader', by: '—', at: 'Pending', done: false },
        { step: 3, role: 'Approved & Locked by Manager', by: '—', at: 'Pending', done: false },
      ]
    }));
    setTimeout(() => { setShowSuccess(false); }, 2000);
  };

  const handleApprovalAction = () => {
    if (approvalPin !== '1234') {
      setApprovalError('Incorrect PIN. Try: 1234');
      return;
    }
    setApprovalError('');
    const now = new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
    if (approvalAction.type === 'review') {
      setApproval(prev => ({
        status: 'Reviewed',
        steps: [
          prev.steps[0],
          { step: 2, role: 'Reviewed by Team Leader', by: 'James Carter (Team Leader)', at: now, done: true },
          { step: 3, role: 'Approved & Locked by Manager', by: '—', at: 'Pending', done: false },
        ]
      }));
    } else if (approvalAction.type === 'approve') {
      setApproval(prev => ({
        status: 'Locked',
        steps: [
          prev.steps[0],
          prev.steps[1],
          { step: 3, role: 'Approved & Locked by Manager', by: 'Sarah Jenkins (Manager)', at: now, done: true },
        ]
      }));
    } else if (approvalAction.type === 'revise') {
      setApproval({
        status: 'Draft',
        steps: [
          { step: 1, role: 'Drafted by Carer', by: 'John (Senior Carer)', at: now, done: true },
          { step: 2, role: 'Reviewed by Team Leader', by: '—', at: 'Pending', done: false },
          { step: 3, role: 'Approved & Locked by Manager', by: '—', at: 'Pending', done: false },
        ]
      });
    }
    setShowApprovalModal(false);
    setApprovalPin('');
  };

  const personalSections = [
    { id: 'morningRoutine', title: '1. Morning Routine' },
    { id: 'eveningRoutine', title: '2. Evening Routine' },
    { id: 'bathing', title: '3. Bathing & Showering' },
    { id: 'washing', title: '4. Washing & Daily Hygiene' },
    { id: 'hairCare', title: '5. Hair Care & Styling' },
    { id: 'oralCare', title: '6. Oral Care' },
    { id: 'dentures', title: '7. Dentures Care' },
    { id: 'shaving', title: '8. Shaving & Grooming' },
    { id: 'skinInspection', title: '9. Skin Inspection' },
    { id: 'nailCare', title: '10. Nail Care' },
    { id: 'dressing', title: '11. Dressing & Clothing' },
    { id: 'jewellery', title: '12. Jewellery & Make-up' },
    { id: 'continence', title: '13. Continence Management' },
    { id: 'feminineCare', title: '14. Feminine Care' },
    { id: 'toileting', title: '15. Toileting Assistance' },
    { id: 'privacy', title: '16. Privacy & Modesty (CQC Reg 10)' },
    { id: 'independence', title: '17. Independence & Reablement' },
    { id: 'preferredCarers', title: '18. Preferred Carers Choice' },
    { id: 'communication', title: '19. Communication Preferences' },
    { id: 'positioning', title: '20. Positioning & Pressure Care' },
    { id: 'pain', title: '21. Pain Management' },
    { id: 'equipment', title: '22. Equipment Checks (LOLER)' },
    { id: 'pressureChecks', title: '23. Pressure Area Checks (Waterlow)' },
    { id: 'infectionControl', title: '24. Infection Control & PPE' },
    { id: 'escalation', title: '25. Escalation & Warning Signs (NEWS2)' },
    { id: 'review', title: '26. Care Plan Reviews' },
    { id: 'expectedOutcomes', title: '27. Expected Outcomes (SMART)' }
  ];

  const dementiaSections = [
    { id: 'diagnosis', title: '1. Diagnosis & Stage' },
    { id: 'memory', title: '2. Memory & Cognitive Function' },
    { id: 'orientation', title: '3. Orientation Support' },
    { id: 'communication', title: '4. Dementia Communication Guide' },
    { id: 'decisionMaking', title: '5. Decision Making & Mental Capacity Act' },
    { id: 'confusion', title: '6. Confusion & Reassurance' },
    { id: 'nightBehaviour', title: '7. Night-time Behaviour' },
    { id: 'sundowning', title: '8. Sundowning Support' },
    { id: 'distress', title: '9. Distress & Hallucinations' },
    { id: 'repetitiveQuestions', title: '10. Repetitive Questions Response' },
    { id: 'lifeStory', title: '11. Personal History & Life Story' },
    { id: 'familyHistory', title: '12. Family History' },
    { id: 'favouriteTopics', title: '13. Favourite Topics & Hobbies' },
    { id: 'sensorySupport', title: '14. Sensory Support & Music' },
    { id: 'environment', title: '15. Environment & Lighting' },
    { id: 'sleepHydration', title: '16. Sleep, Hydration & Nutrition' },
    { id: 'medicationSafeguarding', title: '17. Medication & Safeguarding (DoLS)' },
    { id: 'staffSayings', title: '18. Dementia Communication guide (what to say/never say)' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* ⚠️ CLINICAL WARNING FLAGS & BANNERS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-rose-50 border-l-4 border-rose-500 dark:bg-rose-950/20 p-3 rounded-xl flex items-center gap-2.5 shadow-sm">
          <AlertOctagon className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <div>
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">DNACPR Status</span>
            <p className="text-xs font-extrabold text-rose-800 dark:text-rose-300">ACTIVE DNACPR ORDER ON FILE</p>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 dark:bg-amber-950/20 p-3 rounded-xl flex items-center gap-2.5 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-450 shrink-0" />
          <div>
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block">Allergies Warning</span>
            <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300">Severe Penicillin Allergy</p>
          </div>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 dark:bg-indigo-950/20 p-3 rounded-xl flex items-center gap-2.5 shadow-sm sm:col-span-2 lg:col-span-1">
          <AlertTriangle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <span className="text-[9px] font-black text-indigo-550 uppercase tracking-widest block">Dietary Safety Warning</span>
            <p className="text-xs font-extrabold text-indigo-800 dark:text-indigo-300">High Choking Hazard (Pureed)</p>
          </div>
        </div>
      </div>

      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <img src={planData.profilePic} alt={patientName} className="h-16 w-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-850 shadow-sm" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Care Plan: {patientName}</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
              <span className="text-[10px] font-extrabold bg-blue-150 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-0.5 rounded-full w-fit border border-blue-200/50">CQC Compliant</span>
              <span className="text-[10px] font-extrabold bg-amber-150 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit border border-amber-200/50">
                <AlertTriangle className="w-3.5 h-3.5" /> Review Due: {planData.nextReviewDate}
              </span>
            </div>
          </div>
        </div>
        
        {/* Modify/Save Button (Only shows if activeTab is profile/accordions) */}
        {activeTab === 'profile' && (
          <div className="shrink-0 w-full sm:w-auto">
            {isLocked ? (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Plan Locked &amp; Approved</span>
              </div>
            ) : !isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full justify-center flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-bold text-xs transition-colors border dark:border-slate-800"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Modify Plan
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="w-full justify-center flex items-center gap-2 bg-[#7ac143] hover:bg-[#68a837] text-white px-5 py-2 rounded-xl font-black text-xs shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab Selection Bar (Full Width, Scrollable on Mobile) */}
      <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border dark:border-slate-850 flex overflow-x-auto scrollbar-none gap-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'profile' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Personal &amp; Dementia Care Plans
        </button>
        <button
          onClick={() => setActiveTab('bodymap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'bodymap' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Wound Body Map
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'assessments' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Risk Assessments
        </button>
        <button
          onClick={() => setActiveTab('restrictive')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'restrictive' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Restrictive Practices
        </button>
        <button
          onClick={() => setActiveTab('safeguarding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'safeguarding' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Safeguarding Logs
        </button>
        <button
          onClick={() => setActiveTab('carenotes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'carenotes' ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Care Notes
        </button>
      </div>

      {/* RENDER DYNAMIC TAB VIEWS */}
      
      {/* A. WOUND BODY MAP TAB */}
      {activeTab === 'bodymap' && (
        <BodyMap patientName={patientName} />
      )}

      {/* B. CLINICAL RISK ASSESSMENTS TAB */}
      {activeTab === 'assessments' && (
        <RiskAssessments patientName={patientName} />
      )}

      {/* D. RESTRICTIVE PRACTICES TAB */}
      {activeTab === 'restrictive' && (
        <RestrictivePractices patientName={patientName} />
      )}

      {/* E. SAFEGUARDING RECORDS TAB */}
      {activeTab === 'safeguarding' && (
        <SafeguardingActionRecords patientName={patientName} />
      )}

      {/* F. CARE NOTES HISTORIC LOG TAB */}
      {activeTab === 'carenotes' && (
        <CareNotesTab patientName={patientName} />
      )}

      {/* C. STANDARD ACCORDIONS VIEW TAB */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Accordion Sections (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Sub-tab selection for Personal vs Dementia Care Plan */}
            <div className="flex border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 gap-2 mb-4">
              <button 
                type="button"
                onClick={() => { setCarePlanSubTab('personal'); setExpandedSection('morningRoutine'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${carePlanSubTab === 'personal' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white border dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
              >
                📋 Personal Care Plan (27 Sections)
              </button>
              <button 
                type="button"
                onClick={() => { setCarePlanSubTab('dementia'); setExpandedSection('diagnosis'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${carePlanSubTab === 'dementia' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white border dark:border-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
              >
                🧠 Dementia Care Plan (18 Sections)
              </button>
            </div>

            {carePlanSubTab === 'personal' ? (
              <div className="space-y-1">
                {personalSections.map(section => (
                  <CqcStructuredSection 
                    key={section.id}
                    title={section.title}
                    field={section.id}
                    data={(planData.personalCarePlan || {})[section.id]}
                    isEditing={isEditing}
                    onChange={handleChange}
                    isExpanded={expandedSection === section.id}
                    onToggle={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    template={personalTemplates[section.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {dementiaSections.map(section => (
                  <CqcStructuredSection 
                    key={section.id}
                    title={section.title}
                    field={section.id}
                    data={(planData.dementiaCarePlan || {})[section.id]}
                    isEditing={isEditing}
                    onChange={handleChange}
                    isExpanded={expandedSection === section.id}
                    onToggle={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    template={dementiaTemplates[section.id]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Contacts & Workflow Sign-off */}
          <div className="space-y-4">
            
            {/* 🛡️ CQC CARE PLAN REVIEW/APPROVAL WORKFLOW */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  Care Plan Sign-Off
                </h3>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  approval.status === 'Locked' || approval.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : approval.status === 'Reviewed'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {approval.status === 'Locked' ? '🔒 LOCKED' : approval.status === 'Approved' ? '✅ APPROVED' : approval.status === 'Reviewed' ? '👁 REVIEWED' : '✏️ DRAFT'}
                </span>
              </div>

              {/* Step Timeline */}
              <div className="space-y-3">
                {approval.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                      s.done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                    }`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${ s.done ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600' }`}>{s.role}</p>
                      {s.done ? (
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.by} • {s.at}</p>
                      ) : (
                        <p className="text-[10px] text-slate-300 dark:text-slate-600">Awaiting sign-off…</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                {(approval.status === 'Locked' || approval.status === 'Approved') && (
                  <button
                    onClick={() => { setApprovalAction({ type: 'revise', label: 'Send Back for Revision' }); setShowApprovalModal(true); }}
                    className="w-full py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs font-bold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    ↩ Send Back for Revision
                  </button>
                )}
                {approval.status === 'Draft' && (
                  <button
                    onClick={() => { setApprovalAction({ type: 'review', label: 'Team Leader Review Sign-Off' }); setShowApprovalModal(true); }}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    👁 Team Leader — Sign Review
                  </button>
                )}
                {approval.status === 'Reviewed' && (
                  <button
                    onClick={() => { setApprovalAction({ type: 'approve', label: 'Manager Final Approval & Lock' }); setShowApprovalModal(true); }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    🔒 Manager — Approve &amp; Lock Plan
                  </button>
                )}
              </div>
            </div>

            {/* Professional Contacts */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4 text-xs uppercase tracking-wider">Professional Contacts</h3>
              <div className="space-y-3">
                {planData.contacts.map((contact, idx) => {
                  const Icon = contact.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{contact.role}</p>
                        {isEditing ? (
                          <div className="mt-1 space-y-1">
                            <input 
                              type="text" 
                              className="w-full p-1.5 border border-slate-300 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800 dark:text-white"
                              value={contact.name}
                              onChange={(e) => {
                                const newContacts = [...planData.contacts];
                                newContacts[idx] = { ...contact, name: e.target.value };
                                setPlanData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                              placeholder="Name"
                            />
                            <input 
                              type="text" 
                              className="w-full p-1.5 border border-slate-300 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800 dark:text-white"
                              value={contact.details}
                              onChange={(e) => {
                                const newContacts = [...planData.contacts];
                                newContacts[idx] = { ...contact, details: e.target.value };
                                setPlanData(prev => ({ ...prev, contacts: newContacts }));
                              }}
                              placeholder="Details/Phone/Location"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{contact.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contact.details}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => {
                    const newContacts = [...planData.contacts, { role: 'Custom', name: '', details: '', icon: User }];
                    setPlanData(prev => ({ ...prev, contacts: newContacts }));
                  }}
                  className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
                >
                  + Add Contact
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-slide-up border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Care Plan Updated!</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
              Saved. Plan returned to Draft — pending Team Leader review.
            </p>
          </div>
        </div>
      )}

      {/* 🔐 Approval PIN Confirmation Modal */}
      {showApprovalModal && approvalAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-slide-up mx-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">{approvalAction.label}</h3>
                <p className="text-xs text-slate-400">Enter your staff PIN to confirm</p>
              </div>
            </div>
            <input
              type="password"
              maxLength={6}
              value={approvalPin}
              onChange={e => { setApprovalPin(e.target.value); setApprovalError(''); }}
              placeholder="Enter PIN (demo: 1234)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
            />
            {approvalError && <p className="text-xs text-red-500 text-center font-bold mb-2">{approvalError}</p>}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => { setShowApprovalModal(false); setApprovalPin(''); setApprovalError(''); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovalAction}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CarePlanView;
