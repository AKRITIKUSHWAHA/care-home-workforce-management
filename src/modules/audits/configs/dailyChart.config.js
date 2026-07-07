export const dailyChartConfig = {
  title: "Daily Chart Audit",
  category: "Compliance",
  frequency: "Daily",
  targetScore: 90,
  questions: [
  {
    "id": 1,
    "section": "Daily Notes Quality",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are daily notes completed contemporaneously and signed/attributed to the correct staff member?",
    "guidance": "Check timestamps, staff names and completeness."
  },
  {
    "id": 2,
    "section": "Daily Notes Quality",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are entries factual, professional, clear and free from vague phrases?",
    "guidance": "Review sample entries."
  },
  {
    "id": 3,
    "section": "Daily Notes Quality",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Do daily notes reflect actual care delivered and not just repeated generic wording?",
    "guidance": "Compare entries across shifts and residents."
  },
  {
    "id": 4,
    "section": "Care Plan Consistency",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Do daily notes match the current care plan instructions?",
    "guidance": "Cross-check sampled entries against care plan."
  },
  {
    "id": 5,
    "section": "Care Plan Consistency",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Where daily notes show a change, is the care plan updated or review triggered?",
    "guidance": "Check care plan review and handover."
  },
  {
    "id": 6,
    "section": "Triangulation",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Do daily notes triangulate with incidents/accidents recorded on the same date?",
    "guidance": "Compare notes with incident forms."
  },
  {
    "id": 7,
    "section": "Triangulation",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Do daily notes triangulate with MAR charts, refusals, PRN and medication changes?",
    "guidance": "Compare MAR, PRN, refusals and notes."
  },
  {
    "id": 8,
    "section": "Triangulation",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Do daily notes triangulate with risk assessments and changes in risk?",
    "guidance": "Check falls, nutrition, skin, mobility and choking risk changes."
  },
  {
    "id": 9,
    "section": "Triangulation",
    "regulation": "Reg 9/17",
    "kloe": "Responsive",
    "question": "Do daily notes record family feedback or communication where relevant?",
    "guidance": "Check family calls, concerns and updates."
  },
  {
    "id": 10,
    "section": "Preferences",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Do notes evidence resident preferences for personal care and routines?",
    "guidance": "Look for choices offered and respected."
  },
  {
    "id": 11,
    "section": "Preferences",
    "regulation": "Reg 9/10",
    "kloe": "Caring",
    "question": "Do notes evidence dignity, privacy and resident choice during personal care?",
    "guidance": "Review personal care entries."
  },
  {
    "id": 12,
    "section": "Independence",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Do notes record what the resident did independently and how staff promoted independence?",
    "guidance": "Check for enablement rather than task-only language."
  },
  {
    "id": 13,
    "section": "Resident Voice",
    "regulation": "Reg 9/10",
    "kloe": "Caring",
    "question": "Do notes include the resident’s voice, mood, choices or wishes where possible?",
    "guidance": "Review entries for person-centred detail."
  },
  {
    "id": 14,
    "section": "Communication",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Are communication needs, reassurance, distress or confusion recorded appropriately?",
    "guidance": "Check daily notes and dementia/communication plan."
  },
  {
    "id": 15,
    "section": "Food & Fluid",
    "regulation": "Reg 14",
    "kloe": "Effective",
    "question": "Do notes match food/fluid charts and identify poor intake?",
    "guidance": "Compare food/fluid charts, totals and notes."
  },
  {
    "id": 16,
    "section": "Food & Fluid",
    "regulation": "Reg 14/12",
    "kloe": "Safe",
    "question": "Are low fluid intake, weight loss or dietary concerns escalated with actions recorded?",
    "guidance": "Check escalation and professional contact."
  },
  {
    "id": 17,
    "section": "Nutrition Preferences",
    "regulation": "Reg 9/14",
    "kloe": "Responsive",
    "question": "Do notes record food and drink choices, dislikes or alternatives offered?",
    "guidance": "Review meal-related entries."
  },
  {
    "id": 18,
    "section": "SALT / Choking",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Do notes show swallowing guidance, texture and supervision requirements are followed?",
    "guidance": "Compare SALT plan, dining observation and notes."
  },
  {
    "id": 19,
    "section": "Medication",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Are medication refusals, side effects or PRN outcomes recorded in notes where required?",
    "guidance": "Cross-check MAR and notes."
  },
  {
    "id": 20,
    "section": "Topical Medicines",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Do notes/body maps/TMAR show creams and skin treatments were completed?",
    "guidance": "Cross-check TMAR, body map and notes."
  },
  {
    "id": 21,
    "section": "Skin Integrity",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Do notes evidence skin checks, repositioning and pressure care where required?",
    "guidance": "Check repositioning chart and daily notes."
  },
  {
    "id": 22,
    "section": "Skin Integrity",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Are redness, wounds, bruising or pressure damage recorded, body mapped and escalated?",
    "guidance": "Cross-check body map, wound record, senior/GP contact."
  },
  {
    "id": 23,
    "section": "Pressure Equipment",
    "regulation": "Reg 12/15",
    "kloe": "Safe",
    "question": "Are mattress/cushion settings or equipment issues recorded and escalated?",
    "guidance": "Check equipment chart and maintenance/actions."
  },
  {
    "id": 24,
    "section": "Mobility",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Do notes record mobility support, walking aids and changes in mobility?",
    "guidance": "Compare mobility care plan and notes."
  },
  {
    "id": 25,
    "section": "Falls",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Are falls, near misses or unsteadiness recorded consistently and escalated?",
    "guidance": "Compare daily notes, incident forms and falls analysis."
  },
  {
    "id": 26,
    "section": "Moving & Handling",
    "regulation": "Reg 12/18",
    "kloe": "Safe",
    "question": "Do notes reflect safe moving/handling requirements and equipment used?",
    "guidance": "Check hoist/rotunda/wheelchair instructions."
  },
  {
    "id": 27,
    "section": "Continence",
    "regulation": "Reg 9/10",
    "kloe": "Caring",
    "question": "Do notes record continence care respectfully and in line with toileting preferences?",
    "guidance": "Review continence entries."
  },
  {
    "id": 28,
    "section": "Bowels / UTI",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Are bowel issues, UTI signs, pain or changes escalated and followed up?",
    "guidance": "Check charts, notes and professional contacts."
  },
  {
    "id": 29,
    "section": "Personal Care",
    "regulation": "Reg 9/10",
    "kloe": "Caring",
    "question": "Do notes record personal care completed, refused or delayed with action taken?",
    "guidance": "Review AM/PM notes and care plan."
  },
  {
    "id": 30,
    "section": "Oral Care",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Is oral care recorded and are refusals/pain/denture issues escalated?",
    "guidance": "Check oral care plan and notes."
  },
  {
    "id": 31,
    "section": "Mood & Wellbeing",
    "regulation": "Reg 9",
    "kloe": "Caring",
    "question": "Do notes record mood, engagement, distress, loneliness or emotional support?",
    "guidance": "Review entries for mental wellbeing detail."
  },
  {
    "id": 32,
    "section": "Behaviour / Distress",
    "regulation": "Reg 12/13",
    "kloe": "Safe",
    "question": "Are behaviours of distress recorded with triggers, de-escalation and outcomes?",
    "guidance": "Check ABC/behaviour records and notes."
  },
  {
    "id": 33,
    "section": "Activities",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Do notes evidence meaningful activity linked to life history, culture, preferences or ability?",
    "guidance": "Check activity records and daily notes."
  },
  {
    "id": 34,
    "section": "Activities",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Do notes record 1:1 interaction for residents who decline group activities?",
    "guidance": "Check engagement notes."
  },
  {
    "id": 35,
    "section": "Family Communication",
    "regulation": "Reg 9/17",
    "kloe": "Responsive",
    "question": "Are family calls/visits/concerns recorded accurately with follow-up actions?",
    "guidance": "Check communication log and daily notes."
  },
  {
    "id": 36,
    "section": "Professional Contact",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Are GP, nurse, SALT, dietitian, OT or emergency contacts recorded with outcome and follow-up?",
    "guidance": "Check professional contact records."
  },
  {
    "id": 37,
    "section": "Escalation",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Are signs of deterioration escalated promptly to senior staff/manager/professionals?",
    "guidance": "Check notes, handover and action taken."
  },
  {
    "id": 38,
    "section": "Escalation",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Is there evidence the escalation was followed up and closed?",
    "guidance": "Check manager review and next-day notes."
  },
  {
    "id": 39,
    "section": "Handover",
    "regulation": "Reg 12/17",
    "kloe": "Safe",
    "question": "Are key changes from daily notes transferred to handover/allocation?",
    "guidance": "Cross-check handover and allocation sheets."
  },
  {
    "id": 40,
    "section": "Handover",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are care plan updates shared with staff via handover/allocation?",
    "guidance": "Check staff communication and handover documentation."
  },
  {
    "id": 41,
    "section": "Night Notes",
    "regulation": "Reg 9/12",
    "kloe": "Responsive",
    "question": "Do night notes record sleep, checks, repositioning, continence, distress and risks?",
    "guidance": "Review night records."
  },
  {
    "id": 42,
    "section": "Call Bell",
    "regulation": "Reg 12/15",
    "kloe": "Safe",
    "question": "Are call bell concerns or response issues recorded and escalated?",
    "guidance": "Check call bell audit/fault logs and notes."
  },
  {
    "id": 43,
    "section": "Environment",
    "regulation": "Reg 15",
    "kloe": "Safe",
    "question": "Are environmental risks, room issues or equipment faults recorded and acted on?",
    "guidance": "Check maintenance log and notes."
  },
  {
    "id": 44,
    "section": "Infection Control",
    "regulation": "Reg 12",
    "kloe": "Safe",
    "question": "Are infection symptoms, isolation precautions or outbreaks recorded and escalated?",
    "guidance": "Check IPC records and daily notes."
  },
  {
    "id": 45,
    "section": "Safeguarding",
    "regulation": "Reg 13",
    "kloe": "Safe",
    "question": "Are safeguarding concerns, unexplained injuries or allegations recorded and escalated correctly?",
    "guidance": "Check safeguarding log and manager actions."
  },
  {
    "id": 46,
    "section": "Consent",
    "regulation": "Reg 11",
    "kloe": "Effective",
    "question": "Are refusals of care recorded with capacity/consent consideration and alternative offered?",
    "guidance": "Check MCA/best interest if repeated/high risk."
  },
  {
    "id": 47,
    "section": "Restrictions",
    "regulation": "Reg 11/13",
    "kloe": "Safe",
    "question": "Are restrictive practices or safety measures recorded consistently with MCA/DoLS?",
    "guidance": "Check sensor mats, bedrails, locked doors and notes."
  },
  {
    "id": 48,
    "section": "End of Life",
    "regulation": "Reg 9/10",
    "kloe": "Caring",
    "question": "Are comfort, pain, family contact and spiritual needs recorded for end-of-life care?",
    "guidance": "Review EOL notes and care plan."
  },
  {
    "id": 49,
    "section": "Record Gaps",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are missing or incomplete daily notes identified and corrected with a proper audit trail?",
    "guidance": "Check gaps and manager action."
  },
  {
    "id": 50,
    "section": "Record Consistency",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Do daily notes avoid contradictions with charts, MAR, incidents or care plan?",
    "guidance": "Triangulate sampled records."
  },
  {
    "id": 51,
    "section": "Resident Preferences",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Do notes show personal care, routines and independence preferences are followed?",
    "guidance": "Check resident-specific preferences."
  },
  {
    "id": 52,
    "section": "Resident Preferences",
    "regulation": "Reg 9",
    "kloe": "Responsive",
    "question": "Where preferences changed, was this recorded and care plan review triggered?",
    "guidance": "Check care plan update and family/resident feedback."
  },
  {
    "id": 53,
    "section": "Outcomes",
    "regulation": "Reg 9/17",
    "kloe": "Effective",
    "question": "Do notes evidence outcomes, wellbeing or progress rather than tasks only?",
    "guidance": "Review for outcome-focused recording."
  },
  {
    "id": 54,
    "section": "Action Tracker",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are audit shortfalls transferred to action tracker with owner, due date and priority?",
    "guidance": "Check action tracker link."
  },
  {
    "id": 55,
    "section": "Evidence Register",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Is evidence available to support the audit finding?",
    "guidance": "Check evidence register/file location."
  },
  {
    "id": 56,
    "section": "Management Oversight",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Has a senior/manager reviewed sampled daily notes and signed off?",
    "guidance": "Check audit sign-off."
  },
  {
    "id": 57,
    "section": "Management Oversight",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are red/high-risk findings escalated immediately?",
    "guidance": "Check immediate controls and manager notification."
  },
  {
    "id": 58,
    "section": "Trend Review",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Are repeated documentation issues added to RCA/repeat issues and lessons learned?",
    "guidance": "Check RCA and lessons learned tabs."
  },
  {
    "id": 59,
    "section": "Staff Competence",
    "regulation": "Reg 18",
    "kloe": "Effective",
    "question": "Do staff understand what must be recorded and when to escalate?",
    "guidance": "Question staff and review training/supervision if needed."
  },
  {
    "id": 60,
    "section": "Final Judgement",
    "regulation": "Reg 17",
    "kloe": "Well-led",
    "question": "Would the daily notes evidence safe, person-centred care if inspected today?",
    "guidance": "Auditor judgement after triangulation."
  }
]
};
