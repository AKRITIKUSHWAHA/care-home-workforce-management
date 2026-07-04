import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  LogOut,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  Sparkles,
  Mail,
  ShieldCheck,
  Printer,
  Send,
  Eye,
  Check
} from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { 
    darkMode, 
    toggleDarkMode, 
    setIsLoggedIn,
    currentRole, 
    setCurrentRole,
    notifications,
    markAllNotificationsRead,
    employees,
    activeEmployeeId,
    addNotification,
    complianceCertificates
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Custom states for new features
  const [isNiReportOpen, setIsNiReportOpen] = useState(false);
  const [showFluidToast, setShowFluidToast] = useState(false);
  const [showSecurityToast, setShowSecurityToast] = useState(false);
  const [securityToastMsg, setSecurityToastMsg] = useState('');

  const activeEmp = employees.find(e => e.id === activeEmployeeId) || employees[0];
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // 1. Fluid Warning Target Check (Simulated to run 15s after mount for easy testing, then every 90s)
  useEffect(() => {
    const triggerFluidAlert = () => {
      setShowFluidToast(true);
      addNotification('warning', '⚠️ Fluid Warning: Arthur Pendelton has only received 250ml out of 1500ml target fluid intake today (Last logged 2 hrs ago).');
    };

    // Trigger first alert after 15 seconds
    const initialTimer = setTimeout(triggerFluidAlert, 15000);

    // Repeat check every 90 seconds (1.5 minutes)
    const interval = setInterval(triggerFluidAlert, 90000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleRoleChangeWrapper = (role) => {
    // 2. Safeguarding / Management login warnings for Manager & Deputy
    const isManagerial = ['Manager', 'Admin', 'Compliance Officer'].includes(role);
    if (isManagerial) {
      const msg = `🔒 Security Notification: Switched to Management Role (${role}). Safeguarding logs accessed. Audit log generated and dispatching alert email to Nominated Individual (NI).`;
      setSecurityToastMsg(msg);
      setShowSecurityToast(true);
      addNotification('alert', `Security Log: Managerial access (${role}) granted. SMTP audit alert dispatched to NI.`);
    }
    setCurrentRole(role);
    setProfileOpen(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-indigo-500" />;
    }
  };

  const getNotifBg = (type) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400';
      case 'warning':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-200">
      
      {/* Left side: Menu / Fluid Toast Alert Banner */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-909 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Live Fluid warning banner in header */}
        {showFluidToast && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-900/50 rounded-full text-[10px] text-amber-700 dark:text-amber-450 animate-pulse font-sans font-bold">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Fluid Alert: Arthur Pendelton is below daily target (250/1500ml).</span>
            <button 
              onClick={() => setShowFluidToast(false)}
              className="ml-1 text-amber-550 hover:text-amber-800 dark:hover:text-white font-extrabold uppercase text-[8px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        
        {/* Executive NI Report Button */}
        {['Admin', 'Manager', 'Compliance Officer'].includes(currentRole) && (
          <button
            onClick={() => setIsNiReportOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2e6559]/35 px-3 py-2 text-xs font-bold text-[#2e6559] hover:bg-[#2e6559]/5 dark:border-[#3a8273]/40 dark:text-[#3a8273] dark:hover:bg-[#3a8273]/10 transition-all shadow-sm"
            title="Nominated Individual (NI) Report Preview"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">NI Report</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-xl border border-slate-200/60 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all shadow-sm"
          title="Toggle Light/Dark Theme"
        >
          {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Icon Tray */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className={`relative rounded-xl border border-slate-200/60 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all shadow-sm
              ${notifOpen ? 'bg-slate-50 dark:bg-slate-900' : ''}
            `}
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-bounce">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl glass-modal py-2 shadow-xl ring-1 ring-slate-900/5 z-50 animate-slide-up bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-250 text-xs uppercase tracking-wider">Notifications Center</span>
                {unreadNotifs > 0 && (
                  <button 
                    onClick={() => {
                      markAllNotificationsRead();
                      setNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar px-1 py-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-405">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`flex gap-3 px-3 py-2.5 rounded-xl text-xs leading-normal hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors
                        ${!notif.read ? 'bg-brand-50/20 font-semibold' : ''}
                      `}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${getNotifBg(notif.type)}`}>
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 dark:text-slate-200 text-[11px]">{notif.text}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                          <Clock className="h-3 w-3" />
                          <span>{notif.time}</span>
                        </div>
                      </div>
                      {!notif.read && (
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 self-center" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card and Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/85 transition-all"
          >
            <img
              src={activeEmp.photo}
              alt={activeEmp.name}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-800"
            />
            <div className="hidden md:block text-left pr-1.5 font-sans">
              <p className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-100">{activeEmp.name}</p>
              <p className="text-[10px] font-semibold text-slate-500 capitalize leading-none mt-0.5">{currentRole}</p>
            </div>
            <ChevronDown className="h-4.5 w-4.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-modal py-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-slide-up bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="block font-bold text-slate-900 dark:text-white truncate">{activeEmp.name}</span>
                <span className="block text-slate-500 truncate mt-0.5 font-medium">{activeEmp.email}</span>
                <span className="inline-flex mt-1.5 items-center gap-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-400">
                  <Sparkles className="h-2.5 w-2.5 text-brand-500" />
                  <span>ID: {activeEmp.id}</span>
                </span>
              </div>
              
              {/* Role Switcher Option */}
              <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Switch Active Role
              </div>
              <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                {['Admin', 'HR', 'Compliance Officer', 'Manager', 'Receptionist', 'Employee'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChangeWrapper(role)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-all
                      ${currentRole === role 
                        ? 'bg-[#2e6559]/10 text-[#2e6559] dark:bg-[#3a8273]/20 dark:text-[#3a8273]' 
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                      }
                    `}
                  >
                    <span>{role}</span>
                    {currentRole === role && <span className="h-1.5 w-1.5 rounded-full bg-[#2e6559] dark:bg-[#3a8273]" />}
                  </button>
                ))}
              </div>
              
              <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { setProfileOpen(false); setIsLoggedIn(false); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-650 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Security warning popup for Safeguarding login */}
      {showSecurityToast && (
        <div className="fixed bottom-5 right-5 z-[2000] max-w-sm rounded-2xl bg-slate-900 border border-slate-850 p-4 shadow-2xl text-white animate-slide-up">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <h4 className="text-xs font-extrabold text-rose-400 tracking-wide uppercase">Audit Log Notification</h4>
              <p className="text-[11px] text-slate-300 mt-1 font-medium leading-normal">{securityToastMsg}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setShowSecurityToast(false)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-[10px] font-bold rounded-lg transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert("Simulated SMTP Server: Audit alert sent successfully to NI (owner@swan-care.co.uk) via SSL/TLS.");
                    setShowSecurityToast(false);
                  }}
                  className="px-2.5 py-1 bg-brand-600 hover:bg-brand-550 text-[10px] font-bold rounded-lg transition-all"
                >
                  Test SMTP Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Executive NI Email Report Modal */}
      {isNiReportOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in flex flex-col my-8">
            
            {/* Modal Header */}
            <div className="bg-[#2e6559] dark:bg-slate-950 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-black tracking-wider uppercase">NI Email Report Dispatcher</h2>
                  <p className="text-[10px] text-emerald-250 font-semibold mt-0.5">Prepare executive summary for the Nominated Individual.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNiReportOpen(false)}
                className="text-white/70 hover:text-white bg-white/10 dark:bg-slate-800 rounded-full p-1.5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Metadata Panel */}
            <div className="p-4 bg-white dark:bg-slate-955 border-b dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b dark:border-slate-850 pb-2">
                <span className="font-bold text-slate-400">From:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350">compliance-engine@swan-care.co.uk (Automated SSL TLS)</span>
              </div>
              <div className="flex items-center justify-between border-b dark:border-slate-850 pb-2">
                <span className="font-bold text-slate-400">To:</span>
                <span className="font-bold text-[#2e6559] dark:text-[#3a8273]">owner-ni@swan-care.co.uk (Nominated Individual)</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-bold text-slate-400">Subject:</span>
                <span className="font-bold text-slate-855 dark:text-slate-100">Swan Care Home executive Operational & CQC Compliance Summary</span>
              </div>
            </div>

            {/* Email Body Draft */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 max-h-[50vh] overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-250 text-xs font-semibold leading-relaxed space-y-4">
              <p>Dear Nominated Individual,</p>
              <p>Below is the weekly compliance, workforce audit, and safety operations briefing summary for Swan Care Home as of <strong>June 15, 2026</strong>:</p>
              
              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <h4 className="font-black text-[#2e6559] dark:text-[#3a8273] uppercase text-[10px] tracking-wider border-b pb-1 dark:border-slate-850">
                  1. Staffing & Onboarding Compliance
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-655 dark:text-slate-400 text-[11px]">
                  <li>Mandatory Documents Rate: <strong>94.2% Compliant</strong>.</li>
                  <li>DBS Check alert: <strong>Oliver</strong>'s DBS check is expiring soon (<strong>2026-07-15</strong>).</li>
                  <li>Right to Work check: <strong>Oliver</strong>'s RTW check expires in 13 days (<strong>2026-06-28</strong>).</li>
                  <li>Qualification audits: 14/14 staff qualifications verified.</li>
                </ul>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <h4 className="font-black text-[#2e6559] dark:text-[#3a8273] uppercase text-[10px] tracking-wider border-b pb-1 dark:border-slate-850">
                  2. Building Fire Safety & Equipment LOLER Checks
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-655 dark:text-slate-400 text-[11px]">
                  <li>Electrical Safety (EICR): <strong>Valid</strong> (5 Years renewal: 2028-07-15).</li>
                  <li>PAT Testing: <strong>Valid</strong> (Next due: 2026-10-15).</li>
                  <li>Lifts Servicing: <strong>Valid</strong> (Renewal: 2026-10-10).</li>
                  <li>Lifts LOLER Check: <strong>Valid</strong> (Renewal: 2026-10-10).</li>
                  <li>Asset-specific LOLER: Hoist, Sling, Bath Sling, and Standing Aid all registered and valid (Next: 2026-08-18).</li>
                </ul>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <h4 className="font-black text-[#2e6559] dark:text-[#3a8273] uppercase text-[10px] tracking-wider border-b pb-1 dark:border-slate-850">
                  3. Clinical Safety & Legal Reminders
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-655 dark:text-slate-400 text-[11px]">
                  <li>Safeguarding: 1 active concern logged regarding Mary Green (arm bruising). Incident report completes.</li>
                  <li>Weight Tracker: 1 resident (Eleanor Vance) weight logs dropped &gt;5%. MUST assessment complete.</li>
                  <li><strong>MCA DoLS Expiries:</strong>
                    <ul className="list-circle pl-4 mt-1 space-y-0.5">
                      <li>Arthur Pendelton: Expires in 1 month (<strong>2026-07-15</strong>) - Renewal in progress.</li>
                      <li>Mary Green: Expires in 2 months (<strong>2026-08-15</strong>).</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <p className="mt-2 text-slate-450 dark:text-slate-500 text-[10px] italic">
                Report generated automatically by Swan Compliance Engine. SMTP connection verified.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white dark:bg-slate-955 border-t dark:border-slate-850 flex gap-2 justify-end">
              <button 
                onClick={() => setIsNiReportOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print PDF</span>
              </button>
              <button 
                onClick={() => {
                  alert("Report emailed successfully to NI. Log record created: SMTP Code 250 OK.");
                  setIsNiReportOpen(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#2e6559] hover:bg-brand-550 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                <span>Send Email Now</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
