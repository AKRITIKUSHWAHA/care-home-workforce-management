import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import logoImg from '../../../assets/logo.png';

const CallBellAudit = ({ selectedAudit, submitAuditResult, setSelectedAudit, isEditMode }) => {
  const { employees } = useApp();
  const isReadOnly = selectedAudit.status === 'Completed' && !isEditMode;
  const assignedOfficer = employees.find(e => e.id === selectedAudit.officerId) || employees[0];

  // Metadata states
  const [completedBy, setCompletedBy] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [staffOnDuty, setStaffOnDuty] = useState('4');
  const [adultsInService, setAdultsInService] = useState('15');

  // Visual Inspection states
  const [visualAnswers, setVisualAnswers] = useState({
    v1: 'YES',
    v2: 'YES',
    v3: 'YES',
    v4: 'YES'
  });
  const [visualComments, setVisualComments] = useState({
    v1: '',
    v2: '',
    v3: '',
    v4: ''
  });

  // Random Testing states
  const [randomTests, setRandomTests] = useState([
    { room: '12', response: '1m 45s', comments: 'Within expectation' },
    { room: '15', response: '2m 10s', comments: 'Within expectation' },
    { room: '8', response: '2m 50s', comments: 'Within expectation' },
    { room: '5', response: '1m 15s', comments: 'Within expectation' },
    { room: '22', response: '2m 05s', comments: 'Within expectation' }
  ]);
  const [avgResponseTime, setAvgResponseTime] = useState('2m 01s');
  const [expectationTime, setExpectationTime] = useState('3m 00s');
  const [actionsIdentified, setActionsIdentified] = useState('NO');

  // Resident Feedback states
  const [residentsFeedback, setResidentsFeedback] = useState({
    adult1Initials: 'MK',
    adult1Q1: 'YES',
    adult1Q2: 'YES',
    adult1Q3: 'Response is quick and friendly.',
    
    adult2Initials: 'RT',
    adult2Q1: 'YES',
    adult2Q2: 'YES',
    adult2Q3: 'Staff are always polite.',
    
    adult3Initials: 'JW',
    adult3Q1: 'YES',
    adult3Q2: 'YES',
    adult3Q3: 'Answered quickly.'
  });

  // Action Plan states
  const [actionPlans, setActionPlans] = useState([]);

  // Signatures
  const [auditorName, setAuditorName] = useState('');
  const [auditorRole, setAuditorRole] = useState('');
  const [managerComments, setManagerComments] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerSignDate, setManagerSignDate] = useState('');

  // Helper: parse response time string like "2m 15s" or "2:15" into total seconds
  const parseTimeToSeconds = (str) => {
    if (!str) return 0;
    const clean = str.trim().toLowerCase();
    
    const mMatches = clean.match(/(\d+)\s*m/);
    const sMatches = clean.match(/(\d+)\s*s/);
    
    let minutes = 0;
    let seconds = 0;
    
    if (mMatches) {
      minutes = parseInt(mMatches[1], 10);
    }
    if (sMatches) {
      seconds = parseInt(sMatches[1], 10);
    }
    
    if (!mMatches && !sMatches) {
      const colonParts = clean.split(':');
      if (colonParts.length === 2) {
        minutes = parseInt(colonParts[0], 10) || 0;
        seconds = parseInt(colonParts[1], 10) || 0;
      } else {
        seconds = parseInt(clean, 10) || 0;
      }
    }
    
    return (minutes * 60) + seconds;
  };

  // Helper: format total seconds into a string like "2m 15s"
  const formatSecondsToTime = (sec) => {
    if (!sec || isNaN(sec)) return '0s';
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  };

  // Recalculate average response time when randomTests array changes
  useEffect(() => {
    if (isReadOnly) return;
    const totalSec = randomTests.reduce((acc, curr) => acc + parseTimeToSeconds(curr.response), 0);
    const count = randomTests.filter(t => t.response && t.response.trim() !== '').length;
    if (count > 0) {
      setAvgResponseTime(formatSecondsToTime(totalSec / count));
    } else {
      setAvgResponseTime('0s');
    }
  }, [randomTests, isReadOnly]);

  // Load / Pre-populate data
  useEffect(() => {
    if (selectedAudit.status === 'Completed') {
      if (selectedAudit.details) {
        const details = selectedAudit.details;
        setCompletedBy(details.metadata?.completedBy || '');
        setAuditDate(selectedAudit.lastCompleted || selectedAudit.scheduledDate);
        setStaffOnDuty(details.metadata?.staffOnDuty || '4');
        setAdultsInService(details.metadata?.adultsInService || '15');
        setVisualAnswers(details.visualAnswers || {});
        setVisualComments(details.visualComments || {});
        setRandomTests(details.randomTests || []);
        setAvgResponseTime(details.metadata?.avgResponseTime || '');
        setExpectationTime(details.metadata?.expectationTime || '3m 00s');
        setActionsIdentified(details.metadata?.actionsIdentified || 'NO');
        setResidentsFeedback(details.residentsFeedback || {});
        setActionPlans(details.actionPlans || []);

        setAuditorName(details.signatures?.auditor || '');
        setAuditorRole(details.signatures?.auditorRole || '');
        setManagerComments(details.signatures?.managerComments || 'Audit reviewed. Procedures adhered to correctly.');
        setManagerName(details.signatures?.managerName || 'Sarah Jenkins');
        setManagerSignDate(details.signatures?.managerSignDate || selectedAudit.lastCompleted || selectedAudit.scheduledDate);
      } else {
        // Mock data pre-population based on score
        const scoreVal = selectedAudit.score !== null ? selectedAudit.score : 100;
        const totalQ = 10; // 4 visual + 6 resident feedback
        const yesCount = Math.round((totalQ * scoreVal) / 100);

        const tempVisualAnswers = {};
        const tempFeedback = {
          adult1Initials: 'MK', adult1Q3: 'Response is quick and friendly.',
          adult2Initials: 'RT', adult2Q3: 'Staff are always polite.',
          adult3Initials: 'JW', adult3Q3: 'Answered quickly.'
        };

        let currentYesCount = 0;
        // Distribute visual answers
        ['v1', 'v2', 'v3', 'v4'].forEach(k => {
          if (currentYesCount < yesCount) {
            tempVisualAnswers[k] = 'YES';
            currentYesCount++;
          } else {
            tempVisualAnswers[k] = 'NO';
          }
        });

        // Distribute resident answers
        for (let a = 1; a <= 3; a++) {
          ['Q1', 'Q2'].forEach(q => {
            const key = `adult${a}${q}`;
            if (currentYesCount < yesCount) {
              tempFeedback[key] = 'YES';
              currentYesCount++;
            } else {
              tempFeedback[key] = 'NO';
            }
          });
        }

        setVisualAnswers(tempVisualAnswers);
        setResidentsFeedback(tempFeedback);
        setCompletedBy(assignedOfficer?.name || '');
        setAuditDate(selectedAudit.lastCompleted || selectedAudit.scheduledDate);
        setStaffOnDuty('4');
        setAdultsInService('15');
        setRandomTests([
          { room: '12', response: '1m 45s', comments: 'Within expectation' },
          { room: '15', response: '2m 10s', comments: 'Within expectation' },
          { room: '8', response: '2m 50s', comments: 'Within expectation' },
          { room: '5', response: '1m 15s', comments: 'Within expectation' },
          { room: '22', response: '2m 05s', comments: 'Within expectation' }
        ]);
        setAvgResponseTime('2m 01s');
        setExpectationTime('3m 00s');
        
        const hasNoAnswers = Object.values(tempVisualAnswers).includes('NO') || 
                            ['adult1Q1', 'adult1Q2', 'adult2Q1', 'adult2Q2', 'adult3Q1', 'adult3Q2'].some(k => tempFeedback[k] === 'NO');
        setActionsIdentified(hasNoAnswers ? 'YES' : 'NO');

        const mockActions = [];
        if (tempVisualAnswers.v1 === 'NO') {
          mockActions.push({
            finding: 'Call bell in room 8 was dusty and button was stuck.',
            actionRequired: 'Clean the call bell immediately and check button mechanics.',
            responsiblePerson: 'Housekeeping / Care Team Lead',
            dateCompleted: selectedAudit.scheduledDate,
            signWhenCompleted: 'SJ'
          });
        }
        if (tempFeedback.adult3Q2 === 'NO') {
          mockActions.push({
            finding: 'Adult 3 (JW) was unsure how to use the pull cord in the bathroom.',
            actionRequired: 'Provide resident with immediate usage demonstration and record under care plan.',
            responsiblePerson: 'Key Worker',
            dateCompleted: selectedAudit.scheduledDate,
            signWhenCompleted: 'SJ'
          });
        }
        setActionPlans(mockActions);

        setAuditorName(assignedOfficer?.name || '');
        setAuditorRole(assignedOfficer?.title || '');
        setManagerComments(scoreVal < 90 ? 'Fail rating. Corrective action plan created.' : 'Compliance maintained successfully.');
        setManagerName('Sarah Jenkins');
        setManagerSignDate(selectedAudit.lastCompleted || selectedAudit.scheduledDate);
      }
    } else {
      // Conducting new audit - set default header info
      setCompletedBy(assignedOfficer?.name || '');
      setAuditDate(new Date().toISOString().split('T')[0]);
      setAuditorName(assignedOfficer?.name || '');
      setAuditorRole(assignedOfficer?.title || '');
      setManagerSignDate(new Date().toISOString().split('T')[0]);
      setManagerName('Sarah Jenkins');
    }
  }, [selectedAudit, isReadOnly]);

  // Handle visual answer toggle
  const toggleVisualAnswer = (id, val) => {
    if (isReadOnly) return;
    setVisualAnswers(prev => ({ ...prev, [id]: val }));
  };

  // Handle visual comments change
  const handleVisualCommentChange = (id, val) => {
    if (isReadOnly) return;
    setVisualComments(prev => ({ ...prev, [id]: val }));
  };

  // Handle random testing edits
  const handleRandomTestEdit = (index, field, value) => {
    if (isReadOnly) return;
    const next = [...randomTests];
    next[index] = { ...next[index], [field]: value };
    setRandomTests(next);
  };

  // Handle feedback initials edit
  const handleFeedbackInitials = (num, val) => {
    if (isReadOnly) return;
    setResidentsFeedback(prev => ({ ...prev, [`adult${num}Initials`]: val }));
  };

  // Handle feedback answer edit
  const toggleFeedbackAnswer = (num, qKey, val) => {
    if (isReadOnly) return;
    setResidentsFeedback(prev => ({ ...prev, [`adult${num}${qKey}`]: val }));
  };

  // Handle feedback comment edit
  const handleFeedbackComment = (num, val) => {
    if (isReadOnly) return;
    setResidentsFeedback(prev => ({ ...prev, [`adult${num}Q3`]: val }));
  };

  // Action plan edit helpers
  const handleActionChange = (index, field, value) => {
    const next = [...actionPlans];
    next[index] = { ...next[index], [field]: value };
    setActionPlans(next);
  };

  const addActionRow = () => {
    setActionPlans([
      ...actionPlans,
      { finding: '', actionRequired: '', responsiblePerson: '', dateCompleted: '', signWhenCompleted: '' }
    ]);
  };

  const deleteActionRow = (index) => {
    setActionPlans(actionPlans.filter((_, i) => i !== index));
  };

  // Calculate score based on: Visual Inspection (4 questions) + Resident feedback (6 questions)
  const getCalculatedScore = () => {
    let yesCount = 0;
    let totalCount = 0;

    // Visual Inspection
    ['v1', 'v2', 'v3', 'v4'].forEach(k => {
      const ans = visualAnswers[k];
      if (ans === 'YES') yesCount++;
      if (ans === 'YES' || ans === 'NO') totalCount++;
    });

    // Resident feedback
    for (let a = 1; a <= 3; a++) {
      ['Q1', 'Q2'].forEach(q => {
        const ans = residentsFeedback[`adult${a}${q}`];
        if (ans === 'YES') yesCount++;
        if (ans === 'YES' || ans === 'NO') totalCount++;
      });
    }

    if (totalCount === 0) return 100;
    return Math.round((yesCount / totalCount) * 100);
  };

  const calculatedScore = getCalculatedScore();

  const getRagRating = (score) => {
    if (score >= 90) return { label: 'GREEN', color: 'text-green-600 font-extrabold', bg: 'bg-green-150 border-green-400' };
    if (score >= 75) return { label: 'AMBER', color: 'text-amber-600 font-extrabold', bg: 'bg-amber-150 border-amber-400' };
    return { label: 'RED', color: 'text-red-600 font-extrabold', bg: 'bg-red-150 border-red-400' };
  };

  const rag = getRagRating(calculatedScore);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!auditorName || !auditorRole) {
      alert('Please fill in Assessor Name and Role.');
      return;
    }

    const details = {
      visualAnswers,
      visualComments,
      randomTests,
      residentsFeedback,
      actionPlans,
      metadata: {
        completedBy,
        auditDate,
        staffOnDuty,
        adultsInService,
        avgResponseTime,
        expectationTime,
        actionsIdentified,
        score: calculatedScore
      },
      signatures: {
        auditor: auditorName,
        auditorRole: auditorRole,
        date: auditDate,
        managerComments,
        managerName,
        managerSignDate
      }
    };

    submitAuditResult(selectedAudit.id, calculatedScore, details);
    setSelectedAudit(null);
  };

  return (
    <div className="bg-[#fcfdfd] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6 max-w-[1450px] mx-auto print:border-none print:shadow-none print:bg-white print:p-0">
      
      {/* Action Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 print:hidden">
        <button
          onClick={() => setSelectedAudit(null)}
          className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl border border-slate-200 text-xs font-semibold text-slate-650 hover:bg-slate-50 flex items-center gap-1.5 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => window.print()}
          className="h-11 md:h-9 px-4 text-sm md:text-xs rounded-xl border border-slate-200 text-xs font-semibold text-slate-650 hover:bg-slate-50 flex items-center gap-1.5 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* AS CARE Header Title Block */}
      <div className="flex flex-col md:flex-row items-center justify-between border-2 border-black p-4 bg-white dark:bg-slate-950 dark:border-slate-800 select-none">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black uppercase text-slate-850 dark:text-slate-100">AS CARE</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Quality & Compliance Division</p>
        </div>
        <div className="text-center my-3 md:my-0">
          <h2 className="text-xl font-extrabold uppercase text-[#203a43] dark:text-[#a1c4fd] tracking-wide">Call Bell Audit</h2>
        </div>
        <img src={logoImg} alt="AS Care Logo" className="h-12 w-auto object-contain dark:brightness-110" />
      </div>

      {/* Metadata and Score layout grids */}
      <div className="grid gap-6 md:grid-cols-2 select-none">
        
        {/* Left Metadata Grid Table */}
        <div className="border border-black dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 rounded-sm">
          <table className="w-full text-xs font-bold border-collapse">
            <tbody>
              <tr className="border-b border-black dark:border-slate-800">
                <td className="w-1/2 p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Completed By:</td>
                <td className="p-2 bg-white dark:bg-slate-900">
                  <input 
                    type="text" 
                    disabled={isReadOnly}
                    value={completedBy} 
                    onChange={e => setCompletedBy(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100"
                    placeholder="Enter assessor name"
                  />
                </td>
              </tr>
              <tr className="border-b border-black dark:border-slate-800">
                <td className="p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Date Completed:</td>
                <td className="p-2 bg-white dark:bg-slate-900">
                  <input 
                    type="date" 
                    disabled={isReadOnly}
                    value={auditDate} 
                    onChange={e => setAuditDate(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-black dark:border-slate-800">
                <td className="p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Number of Staff on Duty:</td>
                <td className="p-2 bg-white dark:bg-slate-900">
                  <input 
                    type="number" 
                    disabled={isReadOnly}
                    value={staffOnDuty} 
                    onChange={e => setStaffOnDuty(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-black dark:border-slate-800">
                <td className="p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Number of Adults in Service:</td>
                <td className="p-2 bg-white dark:bg-slate-900">
                  <input 
                    type="number" 
                    disabled={isReadOnly}
                    value={adultsInService} 
                    onChange={e => setAdultsInService(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100"
                  />
                </td>
              </tr>
              <tr className="border-b border-black dark:border-slate-800">
                <td className="p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Overall Audit Score:</td>
                <td className="p-2.5 bg-white dark:bg-slate-900 font-extrabold text-[#2a4365] dark:text-blue-400 text-sm">
                  {calculatedScore}%
                </td>
              </tr>
              <tr>
                <td className="p-2.5 bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold uppercase border-r border-black dark:border-slate-800">Compliance Status:</td>
                <td className="p-2 bg-white dark:bg-slate-900 font-extrabold text-xs">
                  <span className={`px-2.5 py-1 rounded border inline-block ${rag.bg} ${rag.color}`}>
                    {rag.label}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right side Scoring guide */}
        <div className="border border-black dark:border-slate-800 rounded-sm p-4 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-150 dark:border-slate-800 pb-1 uppercase tracking-wider">Scoring Guide & Targets</h3>
          <ul className="space-y-1.5 text-xs font-bold">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-emerald-600 dark:text-emerald-450">90% and above = Compliant (GREEN)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-amber-500">75% - 89% = Needs Improvement (AMBER)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600 shrink-0" />
              <span className="text-rose-600 dark:text-rose-455">Below 75% = High Risk (RED)</span>
            </li>
          </ul>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 font-semibold italic">
            Score is dynamically calculated based on "YES" answers in the Visual Inspection (4 questions) and Resident Feedback (6 questions) tables. Target compliance is set at 90%.
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">

        {/* Visual Inspection Table */}
        <div className="overflow-x-auto border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 text-xs">
          <table className="w-full text-left border-collapse min-w-[900px] text-black dark:text-white">
            <thead>
              <tr className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold border-b border-black dark:border-slate-800">
                <th className="p-2 border-r border-black dark:border-slate-800 w-[18%] text-center uppercase tracking-wider font-extrabold">Standard</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[45%] text-left uppercase tracking-wider font-extrabold">Criteria</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[8%] text-center uppercase tracking-wider font-extrabold">Yes</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[8%] text-center uppercase tracking-wider font-extrabold">No</th>
                <th className="p-2 w-[21%] text-left uppercase tracking-wider font-extrabold">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-100">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-850">
                <td rowSpan="4" className="p-3 border-r border-black dark:border-slate-800 align-middle text-center bg-[#d9e1f2] dark:bg-slate-800 font-black uppercase text-slate-800 dark:text-slate-200">
                  Visual Inspection of Call Bells
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800">
                  Each call bell is clean, buttons in place and in a working condition?
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v1', 'YES')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v1 === 'YES' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    YES
                  </button>
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v1', 'NO')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v1 === 'NO' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    NO
                  </button>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={visualComments.v1}
                    onChange={e => handleVisualCommentChange('v1', e.target.value)}
                    className="w-full p-1 bg-transparent border-none outline-none font-semibold text-slate-850 dark:text-slate-100 text-xs"
                    placeholder="Enter notes..."
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-850">
                <td className="p-2 border-r border-black dark:border-slate-800">
                  Call bells in rooms are within reach of the bed?
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v2', 'YES')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v2 === 'YES' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    YES
                  </button>
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v2', 'NO')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v2 === 'NO' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    NO
                  </button>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={visualComments.v2}
                    onChange={e => handleVisualCommentChange('v2', e.target.value)}
                    className="w-full p-1 bg-transparent border-none outline-none font-semibold text-slate-855 dark:text-slate-100 text-xs"
                    placeholder="Enter notes..."
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-855">
                <td className="p-2 border-r border-black dark:border-slate-800">
                  Call bells in communal areas are located within reaching distance?
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v3', 'YES')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v3 === 'YES' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    YES
                  </button>
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v3', 'NO')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v3 === 'NO' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    NO
                  </button>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={visualComments.v3}
                    onChange={e => handleVisualCommentChange('v3', e.target.value)}
                    className="w-full p-1 bg-transparent border-none outline-none font-semibold text-slate-855 dark:text-slate-100 text-xs"
                    placeholder="Enter notes..."
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-855">
                <td className="p-2 border-r border-black dark:border-slate-800">
                  Adults in their rooms have their call bell with them?
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v4', 'YES')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v4 === 'YES' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    YES
                  </button>
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => toggleVisualAnswer('v4', 'NO')}
                    className={`h-7 w-12 rounded font-bold text-[10px] ${
                      visualAnswers.v4 === 'NO' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-355'
                    }`}
                  >
                    NO
                  </button>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={visualComments.v4}
                    onChange={e => handleVisualCommentChange('v4', e.target.value)}
                    className="w-full p-1 bg-transparent border-none outline-none font-semibold text-slate-855 dark:text-slate-100 text-xs"
                    placeholder="Enter notes..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Random Testing Table */}
        <div className="overflow-x-auto border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 text-xs">
          <table className="w-full text-left border-collapse min-w-[900px] text-black dark:text-white">
            <thead>
              <tr className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold border-b border-black dark:border-slate-800">
                <th className="p-2 border-r border-black dark:border-slate-800 w-[18%] text-center uppercase tracking-wider font-extrabold">Standard</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[20%] text-center uppercase tracking-wider font-extrabold">Room Number</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[20%] text-center uppercase tracking-wider font-extrabold">Response Time (e.g. 2m 15s)</th>
                <th className="p-2 w-[42%] text-left uppercase tracking-wider font-extrabold">Comments / Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-100">
              {randomTests.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  {idx === 0 && (
                    <td rowSpan="8" className="p-3 border-r border-black dark:border-slate-800 align-middle text-center bg-[#d9e1f2] dark:bg-slate-800 font-black uppercase text-slate-800 dark:text-slate-200">
                      Random Testing
                    </td>
                  )}
                  <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={t.room}
                      onChange={e => handleRandomTestEdit(idx, 'room', e.target.value)}
                      className="w-full p-1 bg-transparent border-none outline-none font-bold text-center text-slate-850 dark:text-slate-100"
                      placeholder="e.g. 12"
                    />
                  </td>
                  <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={t.response}
                      onChange={e => handleRandomTestEdit(idx, 'response', e.target.value)}
                      className="w-full p-1 bg-transparent border-none outline-none font-bold text-center text-slate-850 dark:text-slate-100"
                      placeholder="e.g. 2m 15s"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={t.comments}
                      onChange={e => handleRandomTestEdit(idx, 'comments', e.target.value)}
                      className="w-full p-1 bg-transparent border-none outline-none text-slate-855 dark:text-slate-100 font-semibold"
                      placeholder="e.g. Checked by TL"
                    />
                  </td>
                </tr>
              ))}

              {/* Average Response Time Row */}
              <tr className="bg-slate-50 dark:bg-slate-855 border-t border-black dark:border-slate-800">
                <td colSpan="2" className="p-2 border-r border-black dark:border-slate-800 text-right uppercase tracking-wider font-extrabold text-slate-905 dark:text-white">
                  Average Response Time:
                </td>
                <td className="p-2 border-r border-black dark:border-slate-800 text-center font-extrabold text-[#2a4365] dark:text-blue-400 text-sm">
                  {avgResponseTime}
                </td>
                <td className="p-2 text-slate-400 dark:text-slate-500 italic text-[10px] font-medium">
                  Automatically calculated from room testing logs
                </td>
              </tr>

              {/* Service Expectation Time Row */}
              <tr className="bg-slate-50 dark:bg-slate-855 border-t border-black dark:border-slate-800">
                <td colSpan="2" className="p-2 border-r border-black dark:border-slate-800 text-right uppercase tracking-wider font-extrabold text-slate-905 dark:text-white">
                  Service Expectation Time:
                </td>
                <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={expectationTime}
                    onChange={e => setExpectationTime(e.target.value)}
                    className="w-full p-1 bg-transparent border-none outline-none font-extrabold text-center text-slate-850 dark:text-slate-100"
                    placeholder="e.g. 3m 00s"
                  />
                </td>
                <td className="p-2 text-slate-400 dark:text-slate-500 italic text-[10px] font-medium">
                  Maximum acceptable threshold time limit
                </td>
              </tr>

              {/* Any Actions Identified Row */}
              <tr className="bg-slate-50 dark:bg-slate-855 border-t border-black dark:border-slate-800">
                <td colSpan="2" className="p-2 border-r border-black dark:border-slate-800 text-right uppercase tracking-wider font-extrabold text-slate-905 dark:text-white">
                  Any Actions Identified?
                </td>
                <td colSpan="2" className="p-2 align-middle">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none text-slate-800 dark:text-slate-205">
                      <input
                        type="checkbox"
                        disabled={isReadOnly}
                        checked={actionsIdentified === 'YES'}
                        onChange={e => setActionsIdentified(e.target.checked ? 'YES' : 'NO')}
                        className="h-3.5 w-3.5 border-black dark:border-slate-800"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none text-slate-800 dark:text-slate-205">
                      <input
                        type="checkbox"
                        disabled={isReadOnly}
                        checked={actionsIdentified === 'NO'}
                        onChange={e => setActionsIdentified(e.target.checked ? 'NO' : 'YES')}
                        className="h-3.5 w-3.5 border-black dark:border-slate-800"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resident Feedback Section */}
        <div className="overflow-x-auto border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 text-xs">
          <table className="w-full text-left border-collapse min-w-[900px] text-black dark:text-white">
            <thead>
              <tr className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 dark:text-white font-extrabold border-b border-black dark:border-slate-800 text-center text-[11px]">
                <th colSpan="5" className="p-2 border-b border-black dark:border-slate-800">
                  Call Bell Feedback from Residents
                </th>
              </tr>
              <tr className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-905 border-b border-black dark:border-slate-800 text-center font-bold">
                <th className="p-2 border-r border-black dark:border-slate-800 w-[12%]">Adult</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[12%]">Initials</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[28%]">Do you know what your call bell is for?</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[28%]">Do you know how to use your call bell?</th>
                <th className="p-2 w-[20%] text-left pl-3">Comments on response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-100">
              {[1, 2, 3].map(num => (
                <tr key={num} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-2 border-r border-black dark:border-slate-800 text-center font-bold bg-[#d9e1f2]/20 dark:bg-slate-800/10">
                    Adult {num}
                  </td>
                  <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={residentsFeedback[`adult${num}Initials`] || ''}
                      onChange={e => handleFeedbackInitials(num, e.target.value)}
                      className="w-full p-1 bg-transparent border-none outline-none font-bold text-center text-slate-850 dark:text-slate-100 uppercase"
                      placeholder="e.g. MK"
                      maxLength="4"
                    />
                  </td>
                  <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => toggleFeedbackAnswer(num, 'Q1', 'YES')}
                        className={`h-6 px-3 rounded font-bold text-[9px] ${
                          residentsFeedback[`adult${num}Q1`] === 'YES' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => toggleFeedbackAnswer(num, 'Q1', 'NO')}
                        className={`h-6 px-3 rounded font-bold text-[9px] ${
                          residentsFeedback[`adult${num}Q1`] === 'NO' 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </td>
                  <td className="p-2 border-r border-black dark:border-slate-800 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => toggleFeedbackAnswer(num, 'Q2', 'YES')}
                        className={`h-6 px-3 rounded font-bold text-[9px] ${
                          residentsFeedback[`adult${num}Q2`] === 'YES' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => toggleFeedbackAnswer(num, 'Q2', 'NO')}
                        className={`h-6 px-3 rounded font-bold text-[9px] ${
                          residentsFeedback[`adult${num}Q2`] === 'NO' 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </td>
                  <td className="p-1 pl-3">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={residentsFeedback[`adult${num}Q3`] || ''}
                      onChange={e => handleFeedbackComment(num, e.target.value)}
                      className="w-full p-1 bg-transparent border-none outline-none font-semibold text-slate-855 dark:text-slate-100 text-xs"
                      placeholder="Response comments..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Plan Section */}
        <div className="overflow-x-auto border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 text-xs mt-6 select-none">
          <table className="w-full text-left border-collapse min-w-[900px] text-black dark:text-white">
            <thead>
              <tr className="bg-[#d9e1f2] dark:bg-slate-855 text-slate-905 dark:text-white font-extrabold border-b border-black dark:border-slate-800">
                <th colSpan={isReadOnly ? "5" : "6"} className="p-2 text-center text-xs uppercase tracking-wider font-extrabold border-b border-black dark:border-slate-850">
                  Audit Action Plan
                </th>
              </tr>
              <tr className="bg-[#d9e1f2] dark:bg-slate-855 text-slate-905 border-b border-black dark:border-slate-800 text-center font-bold">
                <th className="p-2 border-r border-black dark:border-slate-800 w-[24%]">Finding</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[32%]">Action Required</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[16%]">Responsible Person</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[13%]">Date Completed</th>
                <th className="p-2 border-r border-black dark:border-slate-800 w-[15%]">Sign When Completed</th>
                {!isReadOnly && <th className="p-2 w-8 text-center bg-[#d9e1f2] dark:bg-slate-800"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-black dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-100">
              {actionPlans.length === 0 ? (
                <tr>
                  <td colSpan={isReadOnly ? "5" : "6"} className="p-4 text-center italic text-slate-500 bg-white dark:bg-slate-955">
                    No action plan entries required (all standards met).
                  </td>
                </tr>
              ) : (
                actionPlans.map((ap, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-1 border-r border-black dark:border-slate-800">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={ap.finding}
                        onChange={e => handleActionChange(idx, 'finding', e.target.value)}
                        className="w-full p-1 bg-transparent border-none outline-none font-bold text-slate-850 dark:text-slate-100 text-xs text-[#c00000] dark:text-red-400"
                        placeholder="Finding description"
                      />
                    </td>
                    <td className="p-1 border-r border-black dark:border-slate-800">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={ap.actionRequired}
                        onChange={e => handleActionChange(idx, 'actionRequired', e.target.value)}
                        className="w-full p-1 bg-transparent border-none outline-none font-bold text-slate-850 dark:text-slate-100 text-xs text-[#c00000] dark:text-red-400"
                        placeholder="Action required details"
                      />
                    </td>
                    <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={ap.responsiblePerson}
                        onChange={e => handleActionChange(idx, 'responsiblePerson', e.target.value)}
                        className="w-full p-1 bg-transparent border-none outline-none font-bold text-slate-850 dark:text-slate-100 text-xs text-[#c00000] dark:text-red-400 text-center"
                        placeholder="Responsible person"
                      />
                    </td>
                    <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                      <input
                        type="date"
                        disabled={isReadOnly}
                        value={ap.dateCompleted}
                        onChange={e => handleActionChange(idx, 'dateCompleted', e.target.value)}
                        className="w-full p-1 bg-transparent border-none outline-none font-bold text-slate-850 dark:text-slate-100 text-xs text-[#c00000] dark:text-red-400 text-center"
                      />
                    </td>
                    <td className="p-1 border-r border-black dark:border-slate-800 text-center">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={ap.signWhenCompleted}
                        onChange={e => handleActionChange(idx, 'signWhenCompleted', e.target.value)}
                        className="w-full p-1 bg-transparent border-none outline-none font-bold text-slate-850 dark:text-slate-100 text-xs text-[#c00000] dark:text-red-400 text-center"
                        placeholder="Initials"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="p-2 text-center align-middle border-none">
                        <button
                          type="button"
                          onClick={() => deleteActionRow(idx)}
                          className="text-red-500 hover:text-red-700 font-extrabold text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isReadOnly && (
            <div className="p-2 bg-slate-50 dark:bg-slate-850 flex justify-end">
              <button
                type="button"
                onClick={addActionRow}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-750 text-white rounded font-bold text-[10px]"
              >
                + Add Action Row
              </button>
            </div>
          )}
        </div>

        {/* Auditor & Manager Signatures Row */}
        <div className="grid gap-6 md:grid-cols-2 mt-8 select-none">
          
          {/* Assessor Sign-off */}
          <div className="border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900 p-4 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-150 dark:border-slate-800 pb-1 uppercase tracking-wider">Assessor Sign-off</h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Assessor Name</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={auditorName}
                  onChange={e => setAuditorName(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-850 dark:border-slate-750 text-xs font-semibold outline-none w-full"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Assessor Role / Job Title</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={auditorRole}
                  onChange={e => setAuditorRole(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-850 dark:border-slate-750 text-xs font-semibold outline-none w-full"
                  placeholder="e.g. Care Team Leader"
                />
              </div>
            </div>
          </div>

          {/* Manager Countersign */}
          <div className="border border-black dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900 p-4 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-150 dark:border-slate-800 pb-1 uppercase tracking-wider">Manager Counter Sign-off</h4>
            
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Manager Comments</label>
                <textarea
                  disabled={isReadOnly}
                  value={managerComments}
                  onChange={e => setManagerComments(e.target.value)}
                  className="p-2.5 rounded-lg border border-slate-300 bg-white dark:bg-slate-855 dark:border-slate-750 text-xs font-semibold outline-none w-full resize-none"
                  rows="2"
                  placeholder="Comments on compliance checks and actions..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Manager Name</label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-855 dark:border-slate-750 text-xs font-semibold outline-none w-full"
                    placeholder="Sarah Jenkins"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Date Counter-signed</label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={managerSignDate}
                    onChange={e => setManagerSignDate(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-855 dark:border-slate-750 text-xs font-semibold outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        {!isReadOnly && (
          <div className="flex justify-end pt-4 print:hidden">
            <button
              type="submit"
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Complete & Submit Audit</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CallBellAudit;
