import React, { useState } from 'react';

// Custom tag SVGs matching client screenshots exactly
const renderTagIcon = (id, isSelected) => {
  const activeStroke = isSelected ? "#2e6559" : "#78909c";
  
  switch (id) {
    case 'bp':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="22" y="25" width="56" height="50" rx="8" fill="#eceff1" stroke="#b0bec5" strokeWidth="3" />
          <rect x="30" y="32" width="40" height="24" rx="3" fill="#1e88e5" />
          <text x="50" y="49" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">120/80</text>
          <rect x="14" y="60" width="12" height="15" fill="#78909c" />
          <path d="M22 68 C26 68, 32 60, 32 50" fill="none" stroke="#78909c" strokeWidth="3" />
        </svg>
      );
    case 'temp':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M30 65 L40 65 L40 30 C40 25, 45 20, 50 20 L65 20 C70 20, 75 25, 75 30 L75 40 L45 55 L45 80 C45 83, 40 85, 35 85 C30 85, 25 80, 25 75 Z" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2.5" />
          <rect x="52" y="24" width="16" height="10" fill="#26a69a" />
          <line x1="40" y1="65" x2="35" y2="70" stroke="#00acc1" strokeWidth="3.5" />
        </svg>
      );
    case 'sugar':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M42 70 C42 82, 58 82, 58 70 C58 55, 50 40, 50 40 C50 40, 42 55, 42 70 Z" fill="#e53935" />
          <rect x="18" y="30" width="10" height="40" rx="2" fill="#90a4ae" stroke="#78909c" strokeWidth="1.5" />
          <rect x="20" y="35" width="6" height="8" fill="#1565c0" />
        </svg>
      );
    case 'pulse':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M50 82 C50 82, 12 55, 12 33 C12 20, 28 12, 38 20 C50 30, 50 30, 50 30 C50 30, 50 30, 62 20 C72 12, 88 20, 88 33 C88 55, 50 82, 50 82 Z" fill="#ea3e3c" />
          <path d="M8 45 L26 45 L34 20 L44 72 L52 40 L58 48 L76 48" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'respiration':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M35 30 L35 70 C35 70, 15 75, 15 50 C15 35, 25 30, 35 30 Z" fill="#ffab91" stroke="#ff8a65" strokeWidth="2.5" />
          <path d="M65 30 L65 70 C65 70, 85 75, 85 50 C85 35, 75 30, 65 30 Z" fill="#ffab91" stroke="#ff8a65" strokeWidth="2.5" />
          <path d="M50 15 L50 45" stroke="#ff8a65" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 45 L40 55 M50 45 L60 55" stroke="#ff8a65" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'neuro':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M30 45 C30 35, 40 30, 50 30 C60 30, 70 35, 70 45 C70 55, 60 60, 50 60 C40 60, 30 55, 30 45 Z" fill="#f8bbd0" stroke="#f48fb1" strokeWidth="2.5" />
          <path d="M50 30 L50 60" stroke="#f48fb1" strokeWidth="2" />
          <circle cx="45" cy="42" r="22" fill="none" stroke="#78909c" strokeWidth="5.5" />
          <line x1="61" y1="58" x2="80" y2="77" stroke="#78909c" strokeWidth="6.5" strokeLinecap="round" />
        </svg>
      );
    case 'insulin':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="18" y="42" width="22" height="34" rx="4" fill="#cfd8dc" stroke="#b0bec5" strokeWidth="2.5" />
          <rect x="22" y="34" width="14" height="8" fill="#e0e0e0" stroke="#b0bec5" strokeWidth="2" />
          <rect x="20" y="52" width="18" height="15" fill="#4caf50" />
          <line x1="75" y1="20" x2="42" y2="78" stroke="#78909c" strokeWidth="4.5" />
          <line x1="70" y1="18" x2="78" y2="24" stroke="#78909c" strokeWidth="4" />
          <line x1="38" y1="75" x2="45" y2="82" stroke="#78909c" strokeWidth="4" />
        </svg>
      );
    case 'cream':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="15" y="45" width="32" height="28" rx="6" fill="#eceff1" stroke="#b0bec5" strokeWidth="2.5" />
          <rect x="12" y="37" width="38" height="8" rx="2" fill="#ab47bc" />
          <path d="M55 75 L75 35 L85 40 L65 80 Z" fill="#ffffff" stroke="#b0bec5" strokeWidth="2" />
          <rect x="74" y="30" width="12" height="6" fill="#ab47bc" />
        </svg>
      );
    case 'blood-test':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M68 55 C68 65, 82 65, 82 55 C82 45, 75 35, 75 35 C75 35, 68 45, 68 55 Z" fill="#d32f2f" />
          <rect x="25" y="25" width="10" height="42" rx="2" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2.5" />
          <line x1="30" y1="18" x2="30" y2="25" stroke="#90a4ae" strokeWidth="3.5" />
          <line x1="22" y1="67" x2="38" y2="67" stroke="#90a4ae" strokeWidth="4" />
        </svg>
      );
    case 'agitated':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="50" r="42" fill="#ff9800" />
          <line x1="26" y1="38" x2="42" y2="45" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="74" y1="38" x2="58" y2="45" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="35" cy="52" r="5" fill="#ffffff" />
          <circle cx="65" cy="52" r="5" fill="#ffffff" />
          <path d="M34 72 Q50 60 66 72" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    case 'confused':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="50" r="42" fill="#9c27b0" />
          <circle cx="35" cy="46" r="5" fill="#ffffff" />
          <circle cx="65" cy="46" r="5" fill="#ffffff" />
          <line x1="35" y1="68" x2="65" y2="62" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
          <text x="50" y="26" fill="#ffffff" fontSize="24" fontWeight="bold" textAnchor="middle">?</text>
        </svg>
      );
    case 'wandering':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M25 45 C25 35, 35 35, 35 48 C35 60, 25 60, 25 45 Z" fill="#78909c" />
          <rect x="23" y="58" width="10" height="12" rx="3" fill="#78909c" />
          <path d="M65 55 C65 45, 75 45, 75 58 C75 70, 65 70, 65 55 Z" fill="#78909c" transform="rotate(15 70 58)" />
          <rect x="63" y="68" width="10" height="12" rx="3" fill="#78909c" transform="rotate(15 70 58)" />
        </svg>
      );
    case 'upset':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="50" r="42" fill="#0288d1" />
          <circle cx="36" cy="46" r="5" fill="#ffffff" />
          <circle cx="64" cy="46" r="5" fill="#ffffff" />
          <path d="M34 72 C40 62, 60 62, 66 72" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );
    case 'support':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M50 65 C50 65, 25 45, 25 30 C25 20, 35 15, 42 21 C50 28, 50 28, 50 28 C50 28, 50 28, 58 21 C65 15, 75 20, 75 30 C75 45, 50 65, 50 65 Z" fill="#e91e63" />
          <path d="M15 65 C25 55, 45 65, 50 78" fill="none" stroke="#b0bec5" strokeWidth="4" strokeLinecap="round" />
          <path d="M85 65 C75 55, 55 65, 50 78" fill="none" stroke="#b0bec5" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'social':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="35" r="18" fill="#3f51b5" />
          <path d="M25 78 C25 60, 75 60, 75 78 Z" fill="#3f51b5" />
          <rect x="68" y="60" width="16" height="14" rx="2" fill="#ffb300" />
        </svg>
      );
    case 'behaviour':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M50 12 L82 25 L82 50 C82 72, 68 85, 50 90 C32 85, 18 72, 18 50 L18 25 Z" fill="#7e57c2" />
          <text x="50" y="58" fill="#ffffff" fontSize="26" fontWeight="bold" textAnchor="middle">!</text>
        </svg>
      );
    case 'check-sleep':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M35 25 C35 45, 55 55, 75 50 C70 65, 50 75, 35 70 C20 65, 15 45, 25 30 Z" fill="#ffca28" />
          <polygon points="65,20 67,25 72,25 68,28 70,33 65,30 60,33 62,28 58,25 63,25" fill="#ffffff" />
        </svg>
      );
    case 'disturbed':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M35 25 C35 45, 55 55, 75 50 C70 65, 50 75, 35 70 C20 65, 15 45, 25 30 Z" fill="#b0bec5" />
          <path d="M10 70 L30 70 L38 55 L48 85 L56 65 L62 72 L80 72" fill="none" stroke="#ff5722" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'stay-bed':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="25" y="45" width="60" height="20" rx="3" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2.5" />
          <rect x="15" y="30" width="10" height="45" rx="2" fill="#78909c" />
          <rect x="75" y="45" width="10" height="30" rx="2" fill="#78909c" />
          <rect x="28" y="38" width="15" height="10" rx="2" fill="#ffffff" />
        </svg>
      );
    case 'monitoring':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M15 50 C30 25, 70 25, 85 50 C70 75, 30 75, 15 50 Z" fill="none" stroke="#26a69a" strokeWidth="5" />
          <circle cx="50" cy="50" r="14" fill="#26a69a" />
          <circle cx="50" cy="50" r="6" fill="#ffffff" />
        </svg>
      );
    case 'oxygen':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M25 45 C25 25, 75 25, 75 45 C75 65, 60 80, 50 80 C40 80, 25 65, 25 45 Z" fill="none" stroke="#00acc1" strokeWidth="5" />
          <line x1="50" y1="80" x2="50" y2="95" stroke="#00acc1" strokeWidth="5" />
          <path d="M30 45 L70 45" stroke="#00acc1" strokeWidth="3" />
        </svg>
      );
    case 'choking':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="35" cy="30" r="10" fill="#e53935" />
          <path d="M15 75 C15 55, 55 55, 55 75 Z" fill="#e53935" />
          <circle cx="62" cy="38" r="9" fill="#1e88e5" />
          <path d="M45 80 C45 65, 80 65, 80 80 Z" fill="#1e88e5" />
        </svg>
      );
    case 'catheter':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="30" y="35" width="40" height="42" rx="4" fill="#fff9c4" stroke="#fbc02d" strokeWidth="2.5" />
          <line x1="50" y1="15" x2="50" y2="35" stroke="#fbc02d" strokeWidth="3" />
          <rect x="42" y="77" width="16" height="8" fill="#fbc02d" />
        </svg>
      );
    case 'seizure':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M30 45 C30 35, 40 30, 50 30 C60 30, 70 35, 70 45 C70 55, 60 60, 50 60 Z" fill="#b3e5fc" stroke="#29b6f6" strokeWidth="2.5" />
          <polygon points="50,15 40,40 50,40 45,65 65,35 52,35" fill="#fbc02d" />
        </svg>
      );
    case 'iv-line':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="35" y="20" width="30" height="48" rx="4" fill="#e0f2f1" stroke="#26a69a" strokeWidth="2.5" />
          <line x1="50" y1="68" x2="50" y2="90" stroke="#26a69a" strokeWidth="3.5" />
          <circle cx="50" cy="80" r="4" fill="#26a69a" />
        </svg>
      );
    case 'wash':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M20 35 L80 35 L70 70 C70 75, 30 75, 20 70 Z" fill="#ffffff" stroke="#b0bec5" strokeWidth="3" />
          <path d="M50 15 L50 30" stroke="#b0bec5" strokeWidth="4" />
          <path d="M42 30 Q50 48, 50 55" fill="none" stroke="#29b6f6" strokeWidth="3" />
        </svg>
      );
    case 'handover':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="25" y="20" width="50" height="65" rx="4" fill="#a1887f" stroke="#8d6e63" strokeWidth="2.5" />
          <rect x="30" y="28" width="40" height="48" fill="#ffffff" />
          <line x1="36" y1="40" x2="64" y2="40" stroke="#78909c" strokeWidth="3" />
          <line x1="36" y1="52" x2="56" y2="52" stroke="#78909c" strokeWidth="3" />
          <rect x="42" y="14" width="16" height="8" rx="2" fill="#78909c" />
        </svg>
      );
    case 'manager':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="32" r="16" fill="#1e88e5" />
          <path d="M20 75 C20 58, 80 58, 80 75 Z" fill="#1e88e5" />
          <circle cx="72" cy="65" r="4.5" fill="#4caf50" />
        </svg>
      );
    case 'transport':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="20" y="35" width="50" height="28" rx="4" fill="#78909c" />
          <rect x="52" y="38" width="18" height="15" fill="#e0f7fa" />
          <circle cx="32" cy="65" r="10" fill="#37474f" />
          <circle cx="58" cy="65" r="10" fill="#37474f" />
        </svg>
      );
    case 'complaint':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M25 60 L45 60 L42 80 C40 85, 48 88, 52 82 L70 60 L78 60 C80 60, 82 58, 82 55 L82 35 C82 32, 80 30, 78 30 L40 30 C34 30, 30 35, 30 40 L30 45 L25 45 Z" fill="#e53935" transform="scale(1, -1) translate(0, -100)" />
        </svg>
      );
    case 'juice':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M35 25 L65 25 L58 85 L42 85 Z" fill="none" stroke={activeStroke} strokeWidth="4.5" />
          <path d="M37 40 L63 40 L59 81 L41 81 Z" fill="#ff9800" />
          <circle cx="50" cy="55" r="4" fill="#ffb74d" />
          <circle cx="45" cy="65" r="3" fill="#ffb74d" />
          <line x1="52" y1="12" x2="48" y2="45" stroke={activeStroke} strokeWidth="4.5" />
        </svg>
      );
    case 'tea':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M30 45 C30 35, 70 35, 70 45 C75 55, 75 75, 70 80 C60 85, 40 85, 30 80 C25 75, 25 55, 30 45 Z" fill="none" stroke={activeStroke} strokeWidth="4.5" />
          <path d="M28 58 L12 48 L15 42 L31 52 Z" fill="#eceff1" stroke={activeStroke} strokeWidth="3" />
          <path d="M68 50 C78 50, 84 64, 68 72" fill="none" stroke={activeStroke} strokeWidth="4.5" />
        </svg>
      );
    case 'lounge':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <rect x="25" y="44" width="50" height="28" rx="4" fill="none" stroke={activeStroke} strokeWidth="4.5" />
          <rect x="18" y="38" width="12" height="34" rx="4" fill="none" stroke={activeStroke} strokeWidth="4" />
          <rect x="70" y="38" width="12" height="34" rx="4" fill="none" stroke={activeStroke} strokeWidth="4" />
          <rect x="28" y="22" width="44" height="28" rx="6" fill="none" stroke={activeStroke} strokeWidth="4" />
        </svg>
      );
    case 'assistance':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M15 65 C15 50, 45 42, 60 55 L75 40 L85 50 L68 70 C55 85, 20 80, 15 65 Z" fill="none" stroke={activeStroke} strokeWidth="4.5" />
        </svg>
      );
    case 'emotional':
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <path d="M50 36 C50 36, 62 24, 68 32 C74 40, 50 58, 50 58 C50 58, 26 40, 32 32 C38 24, 50 36, 50 36 Z" fill="none" stroke={activeStroke} strokeWidth="4.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-9 h-9 mb-1.5 shrink-0">
          <circle cx="50" cy="50" r="35" fill="none" stroke={activeStroke} strokeWidth="5" />
          <circle cx="50" cy="50" r="12" fill={activeStroke} />
        </svg>
      );
  }
};

const categories = [
  {
    id: 'medical',
    title: 'Medical & Observations',
    items: [
      { id: 'bp', label: 'Blood pressure', color: 'text-red-500' },
      { id: 'temp', label: 'Temperature', color: 'text-orange-500' },
      { id: 'sugar', label: 'Blood sugar', color: 'text-red-600' },
      { id: 'pulse', label: 'Pulse', color: 'text-rose-500' },
      { id: 'respiration', label: 'Respiration', color: 'text-blue-400' },
      { id: 'neuro', label: 'Neuro Obs', color: 'text-purple-500' },
      { id: 'insulin', label: 'Insulin', color: 'text-emerald-500' },
      { id: 'cream', label: 'Cream', color: 'text-teal-400' },
      { id: 'blood-test', label: 'Blood test', color: 'text-red-500' }
    ]
  },
  {
    id: 'emotional',
    title: 'Emotional Support',
    items: [
      { id: 'agitated', label: 'Agitated', color: 'text-orange-500' },
      { id: 'confused', label: 'Confused', color: 'text-purple-400' },
      { id: 'wandering', label: 'Wandering', color: 'text-slate-500' },
      { id: 'upset', label: 'Upset', color: 'text-blue-500' },
      { id: 'support', label: 'Emotional support', color: 'text-pink-500' },
      { id: 'social', label: 'Social worker', color: 'text-indigo-500' },
      { id: 'behaviour', label: 'Behaviour Log', color: 'text-purple-500' }
    ]
  },
  {
    id: 'sleeping',
    title: 'Sleeping',
    items: [
      { id: 'check-sleep', label: 'Check sleep', color: 'text-indigo-400' },
      { id: 'disturbed', label: 'Disturbed', color: 'text-orange-500' },
      { id: 'stay-bed', label: 'Stay in bed', color: 'text-blue-500' },
      { id: 'monitoring', label: 'Monitoring', color: 'text-emerald-500' }
    ]
  },
  {
    id: 'interventions',
    title: 'Interventions & Equipment',
    items: [
      { id: 'oxygen', label: 'Oxygen level', color: 'text-blue-400' },
      { id: 'choking', label: 'Choking Interv.', color: 'text-red-500' },
      { id: 'catheter', label: 'New catheter', color: 'text-yellow-500' },
      { id: 'seizure', label: 'Epileptic seizure', color: 'text-orange-500' },
      { id: 'iv-line', label: 'IV line', color: 'text-teal-500' },
      { id: 'wash', label: 'Wash', color: 'text-blue-300' }
    ]
  },
  {
    id: 'processes',
    title: 'Processes',
    items: [
      { id: 'handover', label: 'Handover', color: 'text-slate-600' },
      { id: 'manager', label: 'Manager', color: 'text-blue-600' },
      { id: 'transport', label: 'Transport', color: 'text-slate-500' },
      { id: 'complaint', label: 'Complaint', color: 'text-red-500' }
    ]
  }
];

export const IconGridSelector = ({ selectedItems, toggleItem }) => {
  const [expandedCategory, setExpandedCategory] = useState('medical');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="bg-slate-55 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select one or many tags</h3>
      </div>
      
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {categories.map((category) => (
          <div key={category.id}>
            <button
              type="button"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                {category.title}
              </span>
              <span className="text-slate-400">
                {expandedCategory === category.id ? '▼' : '►'}
              </span>
            </button>
            
            {expandedCategory === category.id && (
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 bg-white dark:bg-slate-900 animate-fade-in">
                {category.items.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                          : 'border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'
                      }`}
                    >
                      {renderTagIcon(item.id, isSelected)}
                      <span className={`text-[10px] font-bold text-center leading-tight mt-1 ${
                        isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-650 dark:text-slate-400'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
