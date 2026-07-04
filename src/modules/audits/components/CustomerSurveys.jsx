import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Heart, Plus, Check, Star, User, MessageSquare } from 'lucide-react';

const SERVICE_USER_STATEMENTS = [
  "The staff make me feel safe.",
  "I can get information in a format I understand to help me make decisions about my care.",
  "I know who to contact if things aren’t right with my care.",
  "If I need other services, the practical issues, like sending notes and letters, are dealt with.",
  "I know what to do if I feel my health is deteriorating.",
  "Staff involve me, and people important to me, in decisions about changes to my care.",
  "The staff who provide my care listen to what I want and are able to provide it.",
  "My care is well coordinated between different teams and professionals.",
  "The care I receive helps me live the way I want to.",
  "My care is delivered respectfully and feels dignified.",
  "I am able to manage my care in ways that makes sense to me.",
  "I, and if needed people who care about me, are involved in planning my care.",
  "I am able to maintain contact with people and groups who matter to me.",
  "I have had the opportunity to plan ahead for important life events and record my wishes.",
  "I know how to access my care records and have been asked about record sharing.",
  "Staff encourage me to provide feedback about my care and then act on it."
];

const STAKEHOLDER_STATEMENTS = [
  "We work well with our partners to provide care which is safe.",
  "We share information in a measured but useful way enabling continuity of care.",
  "We share information so that people only need to tell their story once.",
  "We support people to manage their health and wellbeing and maximise their independence.",
  "People report that we treat them with kindness and respect their dignity.",
  "We treat colleagues from other organisations with kindness and respect.",
  "People report that we treat them as individuals.",
  "The care we provide is tailored to the needs of People and takes account of their abilities.",
  "We keep People at the heart of what we do and work in partnership with them.",
  "We understand our role in the provision of care and work collaboratively with other services."
];

const CustomerSurveys = () => {
  const { customerSurveys, addCustomerSurvey } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'new'
  const [surveyType, setSurveyType] = useState('Service User'); // 'Service User' | 'Stakeholder'
  
  // Form state
  const [respondent, setRespondent] = useState('');
  const [comments, setComments] = useState('');
  const [ratings, setRatings] = useState({});

  const handleRatingChange = (idx, value) => {
    setRatings(prev => ({
      ...prev,
      [idx]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!respondent) return;

    // Default unselected statements to Neutral (3)
    const activeStatements = surveyType === 'Service User' ? SERVICE_USER_STATEMENTS : STAKEHOLDER_STATEMENTS;
    const finalRatings = {};
    activeStatements.forEach((_, idx) => {
      finalRatings[`q${idx + 1}`] = ratings[idx] || 4; // default to Agree
    });

    const newSurvey = {
      id: `SV-${Date.now()}`,
      surveyType,
      date: new Date().toISOString().split('T')[0],
      respondent,
      ratings: finalRatings,
      comments
    };

    addCustomerSurvey(newSurvey);
    setViewMode('list');
    resetForm();
  };

  const resetForm = () => {
    setRespondent('');
    setComments('');
    setRatings({});
  };

  const getAvgScore = (type) => {
    const list = (customerSurveys || []).filter(s => s.surveyType === type);
    if (list.length === 0) return 0;
    
    let total = 0;
    let count = 0;
    list.forEach(s => {
      Object.values(s.ratings || {}).forEach(v => {
        total += parseInt(v);
        count++;
      });
    });
    return count > 0 ? (total / count).toFixed(1) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Surveys & Feedback</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">CQC-mapped feedback from service users, relatives, and professional stakeholders.</p>
        </div>
        <div>
          {viewMode === 'list' ? (
            <button
              onClick={() => setViewMode('new')}
              className="h-9 px-4 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Submit Survey Response
            </button>
          ) : (
            <button
              onClick={() => { setViewMode('list'); resetForm(); }}
              className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-bold"
            >
              Back to Responses
            </button>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Service User Rating Index</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{getAvgScore('Service User')}/5.0</span>
                  <span className="text-xs text-slate-400 font-bold">({(customerSurveys || []).filter(s => s.surveyType === 'Service User').length} forms)</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-655 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-brand-600" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Stakeholder Professional Satisfaction</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{getAvgScore('Stakeholder')}/5.0</span>
                  <span className="text-xs text-slate-400 font-bold">({(customerSurveys || []).filter(s => s.surveyType === 'Stakeholder').length} forms)</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-655 flex items-center justify-center">
                <Star className="w-5 h-5 fill-emerald-600" />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="glass-card bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Survey Submissions</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(customerSurveys || []).map(item => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        item.surveyType === 'Service User' ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                      }`}>
                        {item.surveyType}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">{item.respondent}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                  </div>
                  {item.comments && (
                    <div className="mt-2 text-slate-500 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                      <p className="italic">"{item.comments}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs font-semibold">
          <div className="border-b pb-4 border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">Record Survey Response</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Submit paper feedback forms dynamically into CQC compliance database.</p>
            </div>
            <div className="flex gap-2">
              <select
                value={surveyType}
                onChange={(e) => { setSurveyType(e.target.value); resetForm(); }}
                className="h-8 rounded-lg border px-2.5 font-bold"
              >
                <option value="Service User">Service User / Relative</option>
                <option value="Stakeholder">Professional Stakeholder</option>
              </select>
              <input
                type="text"
                required
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                className="h-8 rounded-lg border px-2.5 font-semibold w-52"
                placeholder={surveyType === 'Service User' ? "Respondent Name (or Anonymous)" : "Stakeholder Name & Role"}
              />
            </div>
          </div>

          {/* Rating Likert Grid */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-[#2e6559] uppercase tracking-wider text-[10px]">CQC Statement Statements</h5>
            <div className="space-y-3">
              {(surveyType === 'Service User' ? SERVICE_USER_STATEMENTS : STAKEHOLDER_STATEMENTS).map((statement, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50/50">
                  <span className="text-slate-705 dark:text-slate-305 pr-4">{idx + 1}. {statement}</span>
                  
                  {/* Rating Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border w-fit shrink-0">
                    {[
                      { label: 'Strongly Agree', val: 5 },
                      { label: 'Agree', val: 4 },
                      { label: 'Neutral', val: 3 },
                      { label: 'Disagree', val: 2 },
                      { label: 'Strongly Disagree', val: 1 }
                    ].map(btn => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => handleRatingChange(idx, btn.val)}
                        className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                          (ratings[idx] || 4) === btn.val 
                            ? 'bg-[#2e6559] text-white shadow-xs' 
                            : 'text-slate-550'
                        }`}
                      >
                        {btn.val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 border-t pt-4 border-slate-100 dark:border-slate-800">
            <label className="text-slate-500 block">General Comments or Feedback Details</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full rounded border p-3 h-20"
              placeholder="e.g. Service User expressed gratitude for dementia activities, would like more garden visits..."
            />
          </div>

          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#2e6559] hover:bg-[#1f4940] text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" /> Save Survey Entry
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerSurveys;
