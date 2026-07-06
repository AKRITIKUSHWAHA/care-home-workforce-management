import React, { useState, useRef } from 'react';
import { CareNoteSliders } from './CareNoteSliders';
import { IconGridSelector } from './IconGridSelector';
import { 
  Save, Clock, Info, Check, ShieldAlert, Heart, X, Mic, MicOff
} from 'lucide-react';

// Custom SVG Icons matching the PCS screenshot exactly
const renderActivityIcon = (type, completed) => {
  const bgFill = completed ? "#003c00" : "#222222";
  
  switch (type) {
    case 'laundry':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Washing machine */}
          <rect x="22" y="16" width="56" height="68" rx="6" fill="#eceff1" stroke="#b0bec5" strokeWidth="4" />
          <line x1="22" y1="34" x2="78" y2="34" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="50" cy="58" r="20" fill="#e0f7fa" stroke="#b0bec5" strokeWidth="4" />
          <circle cx="50" cy="58" r="12" fill="#80deea" opacity="0.6" />
          <circle cx="34" cy="25" r="3" fill="#78909c" />
          <circle cx="44" cy="25" r="3" fill="#78909c" />
          <rect x="58" y="22" width="14" height="6" rx="1" fill="#e53935" />
        </svg>
      );
    case 'bed':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Bed & Sheet */}
          <rect x="15" y="44" width="70" height="42" rx="4" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="3" />
          <rect x="8" y="22" width="8" height="66" rx="2" fill="#78909c" />
          <rect x="84" y="44" width="8" height="44" rx="2" fill="#78909c" />
          <rect x="22" y="35" width="18" height="10" rx="2" fill="#ffffff" stroke="#b0bec5" strokeWidth="1.5" />
          <path d="M40 44 L83 44 L83 72 L40 72 Z" fill="#bbdefb" />
          <path d="M40 44 L56 60 L83 60 L83 44 Z" fill="#90caf9" />
        </svg>
      );
    case 'pad':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Diaper shape */}
          <path d="M12 40 C28 28, 72 28, 88 40 C78 78, 22 78, 12 40 Z" fill="#eceff1" stroke="#cfd8dc" strokeWidth="2.5" />
          <path d="M18 42 C30 35, 70 35, 82 42" fill="none" stroke="#b0bec5" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M26 45 C36 40, 64 40, 74 45" fill="none" stroke="#78909c" strokeWidth="3.5" />
        </svg>
      );
    case 'bowels':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Toilet paper roll */}
          <ellipse cx="50" cy="32" rx="24" ry="12" fill="#ffffff" stroke="#b0bec5" strokeWidth="3.5" />
          <ellipse cx="50" cy="32" rx="8" ry="4" fill="#8d6e63" />
          <rect x="26" y="32" width="48" height="32" fill="#ffffff" stroke="#b0bec5" strokeWidth="3.5" />
          <path d="M26 55 L26 84 L74 84 L74 32" fill="#ffffff" stroke="#b0bec5" strokeWidth="3.5" />
          <line x1="26" y1="64" x2="74" y2="64" stroke="#cfd8dc" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );
    case 'toilet_in':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Toilet bowl & down arrow */}
          <rect x="30" y="32" width="40" height="18" rx="3" fill="#ffffff" stroke="#b0bec5" strokeWidth="3" />
          <path d="M34 50 L66 50 C66 68, 60 80, 50 86 C40 80, 34 68, 34 50 Z" fill="#cfd8dc" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="50" cy="50" r="12" fill="#90a4ae" />
          <path d="M50 8 L50 28 M42 20 L50 28 L58 20" fill="none" stroke="#2e7d32" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'toilet_out':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Toilet bowl & up arrow */}
          <rect x="30" y="32" width="40" height="18" rx="3" fill="#ffffff" stroke="#b0bec5" strokeWidth="3" />
          <path d="M34 50 L66 50 C66 68, 60 80, 50 86 C40 80, 34 68, 34 50 Z" fill="#cfd8dc" stroke="#b0bec5" strokeWidth="3" />
          <circle cx="50" cy="50" r="12" fill="#90a4ae" />
          <path d="M50 28 L50 8 M42 16 L50 8 L58 16" fill="none" stroke="#1565c0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'two_assist':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Two carers holding hands */}
          <circle cx="34" cy="34" r="11" fill="#ffe082" />
          <path d="M18 78 C18 58, 50 58, 50 78 Z" fill="#ab47bc" />
          <circle cx="66" cy="34" r="11" fill="#ffe082" />
          <path d="M50 78 C50 58, 82 58, 82 78 Z" fill="#6a1b9a" />
          <path d="M42 58 Q50 48 58 58" fill="none" stroke="#ffe082" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'remains_bed':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Bed backdrop & lying body */}
          <rect x="15" y="46" width="70" height="38" rx="3" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2.5" />
          <rect x="8" y="28" width="8" height="58" rx="1" fill="#78909c" />
          <circle cx="32" cy="40" r="9" fill="#ffcc80" />
          <path d="M38 48 C42 48, 76 48, 76 62 L22 62 Z" fill="#3f51b5" />
          <path d="M42 56 L76 56 L78 80 L42 80 Z" fill="#90caf9" />
        </svg>
      );
    case 'repositioned':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Body symbol & circular arrows */}
          <circle cx="50" cy="34" r="8" fill="#ffe082" />
          <path d="M38 70 C38 52, 62 52, 62 70 Z" fill="#78909c" />
          <path d="M22 50 A28 28 0 0 1 78 50" fill="none" stroke="#2e7d32" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M78 50 A28 28 0 0 1 22 50" fill="none" stroke="#2e7d32" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="6 6" />
          <polygon points="70,54 78,50 82,58" fill="#2e7d32" stroke="#2e7d32" strokeWidth="1.5" />
          <polygon points="30,46 22,50 18,42" fill="#2e7d32" stroke="#2e7d32" strokeWidth="1.5" />
        </svg>
      );
    case 'checked':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Double carer heads & check badge */}
          <circle cx="36" cy="38" r="10" fill="#ffcc80" />
          <path d="M20 74 C20 58, 52 58, 52 74 Z" fill="#6a1b9a" />
          <circle cx="64" cy="38" r="10" fill="#ffe082" />
          <path d="M48 74 C48 58, 80 58, 80 74 Z" fill="#1565c0" />
          <circle cx="50" cy="62" r="16" fill="#4caf50" stroke="#ffffff" strokeWidth="3" />
          <path d="M43 62 L48 67 L57 56" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chatted':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Speech bubbles */}
          <path d="M15 42 C15 28, 44 28, 44 42 C44 55, 33 55, 27 58 L27 51 C15 51, 15 46, 15 42 Z" fill="#2e7d32" opacity="0.9" />
          <path d="M52 50 C52 36, 82 36, 82 50 C82 64, 71 64, 65 67 L65 60 C52 60, 52 54, 52 50 Z" fill="#6a1b9a" opacity="0.9" />
        </svg>
      );
    case 'check_ok':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          {/* Clock Check */}
          <circle cx="45" cy="45" r="24" fill="none" stroke="#ffffff" strokeWidth="4.5" />
          <line x1="45" y1="45" x2="45" y2="28" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="45" y1="45" x2="58" y2="45" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="68" cy="68" r="14" fill="#4caf50" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M62 68 L66 72 L74 64" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#78909c" strokeWidth="6" />
          <line x1="50" y1="50" x2="50" y2="26" stroke="#cfd8dc" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="50" y1="50" x2="70" y2="50" stroke="#cfd8dc" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    case 'pencil':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <rect x="22" y="22" width="56" height="56" rx="8" fill="none" stroke="#78909c" strokeWidth="6" />
          <path d="M36 64 L58 42 L64 48 L42 70 Z" fill="#ffffff" />
          <path d="M58 42 L64 36 L70 42 L64 48 Z" fill="#ffb74d" />
          <path d="M36 64 L33 71 L40 69 Z" fill="#37474f" />
        </svg>
      );
    case 'juice':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <path d="M35 25 L65 25 L58 85 L42 85 Z" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
          <path d="M37 40 L63 40 L59 81 L41 81 Z" fill="#ff9800" />
          <circle cx="50" cy="55" r="4" fill="#ffb74d" />
          <circle cx="45" cy="65" r="3" fill="#ffb74d" />
          <line x1="52" y1="12" x2="48" y2="45" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="52" y1="12" x2="62" y2="18" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'tea':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <path d="M30 45 C30 35, 70 35, 70 45 C75 55, 75 75, 70 80 C60 85, 40 85, 30 80 C25 75, 25 55, 30 45 Z" fill="#eceff1" stroke="#b0bec5" strokeWidth="3" />
          <path d="M28 58 L12 48 L15 42 L31 52 Z" fill="#eceff1" stroke="#b0bec5" strokeWidth="2.5" />
          <path d="M68 50 C78 50, 84 64, 68 72" fill="none" stroke="#78909c" strokeWidth="4" strokeLinecap="round" />
          <path d="M42 22 Q46 12 40 6" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 22 Q56 12 50 6" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'lounge':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <rect x="25" y="44" width="50" height="28" rx="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="3" />
          <rect x="18" y="38" width="12" height="34" rx="4" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
          <rect x="70" y="38" width="12" height="34" rx="4" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
          <rect x="28" y="22" width="44" height="28" rx="6" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
          <line x1="28" y1="72" x2="24" y2="86" stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="72" y1="72" x2="76" y2="86" stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'assistance':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <path d="M15 65 C15 50, 45 42, 60 55 L75 40 L85 50 L68 70 C55 85, 20 80, 15 65 Z" fill="#90caf9" stroke="#1e88e5" strokeWidth="3" />
          <rect x="74" y="28" width="12" height="22" rx="2" transform="rotate(45 80 39)" fill="#2196f3" />
          <rect x="10" y="60" width="16" height="14" rx="2" fill="#1e88e5" />
        </svg>
      );
    case 'emotional':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 object-contain rounded-md">
          <rect x="0" y="0" width="100" height="100" fill={bgFill} />
          <path d="M50 36 C50 36, 62 24, 68 32 C74 40, 50 58, 50 58 C50 58, 26 40, 32 32 C38 24, 50 36, 50 36 Z" fill="#e53935" />
          <circle cx="28" cy="62" r="8" fill="#ffe082" />
          <path d="M14 88 C14 74, 42 74, 42 88 Z" fill="#2e7d32" />
          <circle cx="72" cy="62" r="8" fill="#ffe082" />
          <path d="M58 88 C58 74, 86 74, 86 88 Z" fill="#1565c0" />
        </svg>
      );
    default:
      return null;
  }
};

const AlarmClockBadge = () => (
  <div className="absolute bottom-0 left-0 w-[18px] h-[18px] rounded-full bg-[#1565c0] flex items-center justify-center border border-black/80">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4">
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 14 12" />
      <line x1="5" y1="5" x2="3" y2="7" strokeLinecap="round" />
      <line x1="19" y1="5" x2="21" y2="7" strokeLinecap="round" />
    </svg>
  </div>
);

const SmileyBadge = () => (
  <div className="absolute bottom-0 right-0 w-[18px] h-[18px] rounded-full bg-[#f1c232] flex items-center justify-center border border-black/80 shadow-sm animate-bounce-subtle">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#3e2723]" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1.5" fill="#3e2723" />
      <circle cx="15" cy="9" r="1.5" fill="#3e2723" />
      <path d="M8 14 Q12 17.5 16 14" fill="none" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

const CareNoteForm = ({ patientName = "Alan", onSave, onBehaviourShortcut }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLateEntry, setIsLateEntry] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setFormData(prev => {
        const textToAppend = `Resident ${patientName} is doing well today. Rested comfortably in the lounge, had orange juice, and was relaxed during care assistance.`;
        return {
          ...prev,
          notes: prev.notes ? `${prev.notes}\n${textToAppend}` : textToAppend
        };
      });
    }, 2000);
  };
  const [formData, setFormData] = useState({
    helpLevel: 'none',
    happiness: 'ok',
    duration: '15',
    type: 'usual', // usual, accident, incident, h/o
    notes: '',
    lateEntryTime: '',
    selectedTags: [],
    hasRefusedCare: false
  });

  // Timeline / Action states
  const [refusalCount, setRefusalCount] = useState(10);
  const [isRefusedCare, setIsRefusedCare] = useState(false);
  const [show24hModal, setShow24hModal] = useState(false);
  const commentsRef = useRef(null);

  const [activities, setActivities] = useState([
    {
      id: 'laundry',
      label: 'Did their laundry',
      time: '11:43',
      completed: true,
      text: 'Routine laundry was completed, washing and drying personal items.',
      type: 'laundry',
      showAlarm: false
    },
    {
      id: 'bed',
      label: 'Stripped made the bed',
      time: '11:43',
      completed: true,
      text: 'Stripped and made the bed with clean linens and sheets.',
      type: 'bed',
      showAlarm: false
    },
    {
      id: 'pad_check_1',
      label: 'Pad was checked',
      time: '11:43',
      completed: true,
      text: 'Continence pad checked. Found dry and comfortable.',
      type: 'pad',
      showAlarm: true
    },
    {
      id: 'bowels',
      label: 'Checked for bowels',
      time: '11:43',
      completed: true,
      text: 'Checked resident for bowel movement. Normal findings, no issues.',
      type: 'bowels',
      showAlarm: true
    },
    {
      id: 'toilet_in',
      label: 'Helped to get on to toilet',
      time: '11:43',
      completed: true,
      text: 'Supported resident to get onto the toilet safely.',
      type: 'toilet_in',
      showAlarm: true
    },
    {
      id: 'toilet_out',
      label: 'Helped to get out of toilet',
      time: '11:43',
      completed: true,
      text: 'Assisted resident in transferring safely off the toilet.',
      type: 'toilet_out',
      showAlarm: true
    },
    {
      id: 'two_assist',
      label: 'Needed a two handed assist',
      time: '11:43',
      completed: true,
      text: 'Required a two-handed assist from carers for safe transfer/mobility.',
      type: 'two_assist',
      showAlarm: false
    },
    {
      id: 'remains_bed',
      label: 'Resident remains in bed',
      time: '12:08',
      completed: true,
      text: 'Resident checked and remains resting safely in bed.',
      type: 'remains_bed',
      showAlarm: true
    },
    {
      id: 'pad_check_2',
      label: 'Pad was checked',
      time: '12:08',
      completed: true,
      text: 'Scheduled continence pad check completed. Pad changed and skin dry.',
      type: 'pad',
      showAlarm: true
    },
    {
      id: 'repositioned',
      label: 'Repositioned to avoid pressure',
      time: '12:08',
      completed: true,
      text: 'Resident was repositioned to avoid pressure build-up. Skin checked and intact.',
      type: 'repositioned',
      showAlarm: true
    },
    {
      id: 'checked_1',
      label: 'Checked',
      time: '12:09',
      completed: true,
      text: 'Safety check completed. Resident comfortable and safe.',
      type: 'checked',
      showAlarm: true
    },
    {
      id: 'checked_2',
      label: 'Checked',
      time: '12:09',
      completed: true,
      text: 'Hourly welfare check completed. No concerns.',
      type: 'checked',
      showAlarm: true
    },
    {
      id: 'chatted',
      label: 'Chatted',
      time: '13:00',
      completed: false,
      text: 'Spent time chatting and engaging with the resident to promote social interaction.',
      type: 'chatted',
      showAlarm: true
    },
    {
      id: 'check_ok_1',
      label: 'Check OK',
      time: '13:30',
      completed: false,
      text: 'Welfare check OK. Resident is settled.',
      type: 'check_ok',
      showAlarm: true
    },
    {
      id: 'check_ok_2',
      label: 'Check OK',
      time: '14:00',
      completed: false,
      text: 'Welfare check OK. All safety parameters met.',
      type: 'check_ok',
      showAlarm: true
    },
    {
      id: 'juice_log',
      label: 'Had a glass of fruit juice',
      time: '14:15',
      completed: false,
      text: 'Assisted resident with a cold glass of fruit juice for hydration.',
      type: 'juice',
      showAlarm: false
    },
    {
      id: 'tea_log',
      label: 'Had a cup of tea',
      time: '14:15',
      completed: false,
      text: 'Supported resident with a hot cup of tea.',
      type: 'tea',
      showAlarm: false
    },
    {
      id: 'lounge_log',
      label: 'Spent time in lounge',
      time: '14:15',
      completed: false,
      text: 'Resident was supported to spend time relaxing in the lounge.',
      type: 'lounge',
      showAlarm: false
    },
    {
      id: 'assistance_log',
      label: 'Offered assistance',
      time: '14:15',
      completed: false,
      text: 'Offered general assistance and support to resident, ensuring safety.',
      type: 'assistance',
      showAlarm: false
    },
    {
      id: 'emotional_log',
      label: 'Emotional support',
      time: '14:15',
      completed: false,
      text: 'Provided emotional support and reassurance, encouraging conversation.',
      type: 'emotional',
      showAlarm: false
    }
  ]);

  const handleToggleActivity = (id) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        const nextCompleted = !act.completed;
        
        // Update comments notes field
        setFormData(fd => {
          let updatedNotes = fd.notes || '';
          if (nextCompleted) {
            updatedNotes = updatedNotes ? `${updatedNotes}\n${act.text}` : act.text;
          } else {
            updatedNotes = updatedNotes.replace(act.text, '').trim();
            updatedNotes = updatedNotes.replace(/\n\n+/g, '\n');
          }
          return { ...fd, notes: updatedNotes };
        });
        
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return {
          ...act,
          completed: nextCompleted,
          time: nextCompleted ? currentTime : act.time
        };
      }
      return act;
    }));
  };

  const handleToggleRefused = () => {
    const nextRefused = !isRefusedCare;
    setIsRefusedCare(nextRefused);
    setRefusalCount(prev => nextRefused ? prev + 1 : prev - 1);
    setFormData(fd => {
      const refusalText = "Resident refused care/assistance at this time.";
      let updatedNotes = fd.notes || '';
      if (nextRefused) {
        updatedNotes = updatedNotes ? `${updatedNotes}\n${refusalText}` : refusalText;
      } else {
        updatedNotes = updatedNotes.replace(refusalText, '').trim();
        updatedNotes = updatedNotes.replace(/\n\n+/g, '\n');
      }
      return { ...fd, hasRefusedCare: nextRefused, notes: updatedNotes };
    });
  };

  const toggleTag = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedTags.includes(tagId);
      if (isSelected) {
        return { ...prev, selectedTags: prev.selectedTags.filter(t => t !== tagId) };
      } else {
        return { ...prev, selectedTags: [...prev.selectedTags, tagId] };
      }
    });
  };

  const handleSave = () => {
    console.log("Saving Note", formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (onSave) onSave(formData);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Session Active Carer Header */}
      <div className="bg-slate-800 text-white dark:bg-slate-900 dark:border dark:border-slate-800 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-[10px] font-bold">J</div>
          <span>Writing notes as: <strong>John (Senior Carer)</strong></span>
        </div>
        <span className="opacity-75 text-[10px] uppercase font-bold tracking-wider">Session Active</span>
      </div>

      {/* Header Info */}
      <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-300">
            Care note for {patientName}
          </h2>
          <p className="text-xs text-brand-700 dark:text-brand-400 mt-1">
            Tap any of the slider icons to add the information to the care note without typing it.
          </p>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 space-y-8">
        
        {/* Sliders Component */}
        <CareNoteSliders formData={formData} setFormData={setFormData} />

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Note Type Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['Unusual', 'Accident', 'Incident', 'h/o'].map((type) => {
            const val = type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type: val })}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  formData.type === val
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Icon Grid */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Quick Add Tags
          </label>
          <IconGridSelector selectedItems={formData.selectedTags} toggleItem={toggleTag} />
        </div>

        {/* Late Entry & Duration */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-brand-650 focus:ring-brand-600 bg-white"
                checked={isLateEntry}
                onChange={(e) => setIsLateEntry(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-705 dark:text-slate-300">Late entry</span>
            </label>
            
            {isLateEntry && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <input 
                  type="time" 
                  className="w-28 text-sm p-1.5 border border-slate-300 rounded-lg dark:bg-slate-900 dark:border-slate-606 dark:text-white"
                  value={formData.lateEntryTime || ''}
                  onChange={(e) => setFormData({ ...formData, lateEntryTime: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Clinical Measurements: Weight */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <label className="block text-sm font-semibold text-slate-750 dark:text-slate-350">
            Clinical Measurements
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-655 dark:text-slate-400">Log Resident's Weight</span>
              <p className="text-[10px] text-slate-400">If logged, this will automatically sync and update the resident's Weight ledger in the Malnutrition Tracker.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                step="0.1"
                placeholder="e.g. 72.5"
                className="w-32 h-9 text-xs rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
              <span className="text-xs font-bold text-slate-500">kg</span>
            </div>
          </div>
        </div>

        {/* Refused Care Alert Toggle */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-slate-705 dark:text-slate-300">Refused Care Alert</label>
            <p className="text-[11px] text-slate-500 leading-normal">Enable this if the resident refused any part of their care/support.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.hasRefusedCare || false}
              onChange={(e) => setFormData({ ...formData, hasRefusedCare: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-606 peer-checked:bg-red-500"></div>
          </label>
        </div>

        {/* Behaviour ABC Chart Shortcut */}
        <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-150 dark:border-purple-900/40 flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-650" />
              <span>Challenging Behaviour?</span>
            </label>
            <p className="text-[11px] text-purple-750 dark:text-purple-400 leading-normal">If resident exhibited challenging behaviour, log an ABC Chart record.</p>
          </div>
          <button
            type="button"
            onClick={onBehaviourShortcut}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          >
            Log Behaviour
          </button>
        </div>

        {/* Custom Timeline Care Activities Toolbar (PCS Style) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-707 dark:text-slate-300">
            Quick Care Activities (One-Click Log)
          </label>
          
          <div className="bg-black p-2 rounded-xl flex gap-1 overflow-x-auto select-none scrollbar-thin scrollbar-thumb-neutral-800">
            {/* 1. Refused Card */}
            <div 
              onClick={handleToggleRefused}
              className={`w-[90px] min-w-[90px] h-[120px] rounded-lg flex flex-col justify-between items-center text-center p-1.5 cursor-pointer select-none transition-all duration-200 border ${
                isRefusedCare 
                  ? 'bg-red-700 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-95' 
                  : 'bg-red-900 hover:bg-red-850 border-red-950'
              }`}
            >
              <span className="text-[9px] uppercase font-black tracking-wider text-white">Refused</span>
              <span className="text-3xl font-black text-white leading-none">{refusalCount}</span>
              <span className="text-[8px] leading-tight text-red-200">times in last 24h</span>
            </div>

            {/* Activities List */}
            {activities.map((item) => {
              const isCompleted = item.completed;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleActivity(item.id)}
                  className={`w-[90px] min-w-[90px] h-[120px] rounded-lg flex flex-col justify-between items-center text-center p-1.5 cursor-pointer select-none transition-all duration-200 border ${
                    isCompleted 
                      ? 'bg-[#003c00] border-[#083b0b]' 
                      : 'bg-[#222222] hover:bg-[#2e2e2e] border-neutral-800'
                  }`}
                >
                  {/* Time Header */}
                  <span className={`text-[9px] font-bold ${isCompleted ? 'text-white' : 'text-neutral-400'}`}>
                    {item.time} {isCompleted && '✓'}
                  </span>

                  {/* Icon Container */}
                  <div className={`relative w-11 h-11 flex items-center justify-center ${!isCompleted && 'grayscale opacity-70'}`}>
                    {renderActivityIcon(item.type, isCompleted)}
                    {item.showAlarm && <AlarmClockBadge />}
                    {isCompleted && <SmileyBadge />}
                  </div>

                  {/* Label */}
                  <span className={`text-[8.5px] font-bold leading-snug line-clamp-2 px-0.5 ${
                    isCompleted ? 'text-white' : 'text-neutral-300'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}

            {/* Action 1: Add daily record */}
            <div 
              onClick={() => commentsRef.current?.focus()}
              className="w-[90px] min-w-[90px] h-[120px] bg-[#222222] hover:bg-[#2e2e2e] border border-neutral-800 rounded-lg flex flex-col justify-between items-center text-center p-1.5 cursor-pointer select-none transition-all duration-200"
            >
              <span className="text-[9px] font-bold text-neutral-400">Now</span>
              <div className="w-11 h-11 flex items-center justify-center">
                {renderActivityIcon('pencil', false)}
              </div>
              <span className="text-[8.5px] font-bold leading-snug text-white">Add daily record</span>
            </div>

            {/* Action 2: 24 hour view */}
            <div 
              onClick={() => setShow24hModal(true)}
              className="w-[90px] min-w-[90px] h-[120px] bg-[#222222] hover:bg-[#2e2e2e] border border-neutral-800 rounded-lg flex flex-col justify-between items-center text-center p-1.5 cursor-pointer select-none transition-all duration-200"
            >
              <span className="text-[9px] font-bold text-neutral-400">See all</span>
              <div className="w-11 h-11 flex items-center justify-center">
                {renderActivityIcon('clock', false)}
              </div>
              <span className="text-[8.5px] font-bold leading-snug text-white">24 hour view</span>
            </div>

          </div>
        </div>

        {/* Care Plan Prompt Checklists */}
        <div className="bg-blue-50/60 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-800/50 p-4 rounded-xl space-y-2">
          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Care Plan Writing Prompts Guide
          </span>
          <p className="text-xs text-slate-500 leading-normal">
            For CQC compliance and outstanding care records, ensure your daily notes cover these key areas. Click any prompt to append it to your comments:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Morning routine', 'Evening routine', 'Bathing', 'Washing', 'Hair', 
              'Oral care', 'Dentures', 'Shaving', 'Skin inspection', 'Nail care', 
              'Dressing', 'Jewellery', 'Make-up'
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  const currentText = formData.notes || '';
                  const separator = currentText ? '\n' : '';
                  setFormData({
                    ...formData,
                    notes: currentText + separator + `[${prompt}: ]`
                  });
                  commentsRef.current?.focus();
                }}
                className="px-2 py-1 bg-white hover:bg-blue-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg text-[10.5px] font-semibold text-slate-600 dark:text-slate-350 transition-colors shadow-sm cursor-pointer"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Comments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
              Comments
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                isListening 
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Use Voice Note</span>
                </>
              )}
            </button>
          </div>
          <textarea 
            ref={commentsRef}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all min-h-[100px]"
            placeholder="Add any additional typed notes here..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-end z-10">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#7ac143] hover:bg-[#68a837] text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
        >
          <Save className="w-5 h-5" />
          Complete
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-slide-up border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-905/30 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Care Note Saved!</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
              Successfully added to patient's record.
            </p>
          </div>
        </div>
      )}

      {/* 📊 24 Hour Care Timeline Modal */}
      {show24hModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden text-white">
            <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <h3 className="text-sm font-black uppercase tracking-wider">24 Hour Care Log: {patientName}</h3>
              </div>
              <button 
                onClick={() => setShow24hModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 max-h-[350px] overflow-y-auto space-y-4">
              <div className="relative border-l border-neutral-800 ml-3 pl-4 space-y-4">
                {[
                  { time: '10:23', type: 'assistance', label: 'Offered assistance', desc: 'Offered general assistance and support to resident, ensuring safety.' },
                  { time: '10:23', type: 'emotional', label: 'General emotional', desc: 'Observed resident emotional state: calm, pleasant, and responsive.' },
                  { time: '10:23', type: 'pad', label: 'Pad check was', desc: 'Routine continence check completed. Pad was dry and clean.' },
                  { time: '10:15', type: 'chatted', label: 'Chatted', desc: 'Spent quality time chatting and engaging with the resident.' },
                  { time: '09:27', type: 'juice', label: 'Had a glass of fruit juice', desc: 'Assisted resident with a cold glass of fruit juice for hydration.' },
                  { time: '09:27', type: 'tea', label: 'Had a cup of tea', desc: 'Supported resident with a hot cup of tea.' },
                  { time: '09:27', type: 'lounge', label: 'Alan was in the lounge', desc: 'Alan was supported to spend time in the lounge. He was relaxed.' },
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border border-slate-900" />
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-slate-400 font-mono">{item.time}</span>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded">Completed</span>
                      </div>
                      <p className="text-xs font-bold text-slate-200">{item.label}</p>
                      <p className="text-[11px] text-slate-405 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShow24hModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-extrabold rounded-xl transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CareNoteForm;
