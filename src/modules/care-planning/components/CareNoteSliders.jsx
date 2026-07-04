import React from 'react';

// Custom Help Level 3D Images matching handheld screenshot exactly
const renderHelpIcon = (id) => {
  switch (id) {
    case 'none':
      return <img src="/help_none.png" alt="None" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'little':
      return <img src="/help_little.png" alt="Little" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'fair':
      return <img src="/help_fair.png" alt="Fair amount" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'lot':
      return <img src="/help_lot.png" alt="A lot" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    default:
      return null;
  }
};

// Custom Happiness Face 3D Images matching client screenshots
const renderHappinessIcon = (id) => {
  switch (id) {
    case 'very-unhappy':
      return <img src="/emoji_very_unhappy.png" alt="Very unhappy" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'unhappy':
      return <img src="/emoji_unhappy.png" alt="Unhappy" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'ok':
      return <img src="/emoji_ok.png" alt="OK" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'happy':
      return <img src="/emoji_happy.png" alt="Happy" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    case 'very-happy':
      return <img src="/emoji_very_happy.png" alt="Very happy" className="w-12 h-12 mb-1 object-contain shrink-0" />;
    default:
      return null;
  }
};


export const CareNoteSliders = ({ formData, setFormData }) => {
  const helpOptions = [
    { id: 'none', label: 'None' },
    { id: 'little', label: 'Little' },
    { id: 'fair', label: 'Fair amount' },
    { id: 'lot', label: 'A lot' },
  ];

  const happinessOptions = [
    { id: 'very-unhappy', label: 'Very unhappy' },
    { id: 'unhappy', label: 'Unhappy' },
    { id: 'ok', label: 'OK' },
    { id: 'happy', label: 'Happy' },
    { id: 'very-happy', label: 'Very happy' },
  ];

  return (
    <div className="space-y-6">
      {/* Help Level */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-3">
          Level of help needed
        </label>
        <div className="grid grid-cols-4 gap-2">
          {helpOptions.map((opt) => {
            const isActive = formData.helpLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData({ ...formData, helpLevel: opt.id })}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#2e6559] bg-[#f4faf7] shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {renderHelpIcon(opt.id)}
                <span className={`text-xs font-bold text-center leading-tight mt-1 transition-colors ${
                  isActive ? 'text-[#2e6559]' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Happiness Level */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-3">
          Happiness
        </label>
        <div className="grid grid-cols-5 gap-2">
          {happinessOptions.map((opt) => {
            const isActive = formData.happiness === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData({ ...formData, happiness: opt.id })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#2e6559] bg-[#f4faf7] shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {renderHappinessIcon(opt.id)}
                <span className={`text-[10px] font-bold text-center leading-tight mt-1 transition-colors ${
                  isActive ? 'text-[#2e6559]' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
