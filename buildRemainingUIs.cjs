const fs = require('fs');
const path = require('path');

const templates = [
  // --- CLIENT RECORDS ---
  {
    file: 'src/modules/clients/ClientRegister.jsx',
    title: 'Client Register',
    icon: 'Users',
    desc: 'Manage service users, their profiles, and care levels.',
    kpis: [
      { label: 'Total Clients', val: '142', color: 'from-blue-500 to-indigo-600' },
      { label: 'High Dependency', val: '28', color: 'from-rose-500 to-red-600' },
      { label: 'New Admissions', val: '12', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'fullName', label: 'Full Name', type: 'text' },
      { id: 'location', label: 'Location/Wing', type: 'select', options: ['North Wing', 'South Wing', 'Community'] },
      { id: 'careLevel', label: 'Care Level', type: 'select', options: ['Residential', 'Nursing', 'High Dependency'] },
      { id: 'nhsNumber', label: 'NHS Number', type: 'text' },
      { id: 'funding', label: 'Funding', type: 'select', options: ['Private', 'Local Authority', 'NHS CHC'] },
    ],
    data: [
      { id: 'C-1001', fullName: 'Margaret Smith', location: 'North Wing', careLevel: 'High Dependency', nhsNumber: '111 222 3333', status: 'Active' },
      { id: 'C-1002', fullName: 'John Taylor', location: 'South Wing', careLevel: 'Residential', nhsNumber: '444 555 6666', status: 'Active' },
      { id: 'C-1003', fullName: 'Eleanor Davies', location: 'North Wing', careLevel: 'Nursing', nhsNumber: '777 888 9999', status: 'Hospital' },
    ]
  },
  {
    file: 'src/modules/clients/ClientSchedules.jsx',
    title: 'Client Schedules',
    icon: 'Calendar',
    desc: 'Daily visit planning and care routines.',
    kpis: [
      { label: 'Scheduled Visits Today', val: '315', color: 'from-brand-500 to-brand-600' },
      { label: 'Completed', val: '142', color: 'from-emerald-500 to-teal-600' },
      { label: 'Missed / Late', val: '3', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'time', label: 'Time', type: 'time' },
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'carer', label: 'Carer Assigned', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'taskType', label: 'Task Type', type: 'select', options: ['Morning Routine', 'Medication', 'Lunch Prep', 'Bed Routine'] },
      { id: 'duration', label: 'Duration (Mins)', type: 'number' },
    ],
    data: [
      { id: '1', time: '08:00', client: 'Margaret Smith', carer: 'Sarah Jenkins', taskType: 'Morning Routine', status: 'Completed' },
      { id: '2', time: '09:30', client: 'John Taylor', carer: 'David Chen', taskType: 'Medication', status: 'Pending' },
      { id: '3', time: '11:00', client: 'Eleanor Davies', carer: 'Unassigned', taskType: 'Lunch Prep', status: 'Alert' },
    ]
  },
  {
    file: 'src/modules/clients/MARChart.jsx',
    title: 'MAR Chart & MedScan',
    icon: 'Pill',
    desc: 'Medication Administration Records and barcode scanning.',
    kpis: [
      { label: 'Meds Due (Next 2h)', val: '45', color: 'from-amber-500 to-orange-600' },
      { label: 'Administered Today', val: '128', color: 'from-emerald-500 to-teal-600' },
      { label: 'Missed Meds', val: '0', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'medication', label: 'Medication Name', type: 'text' },
      { id: 'dose', label: 'Dose', type: 'text' },
      { id: 'route', label: 'Route', type: 'select', options: ['Oral', 'Topical', 'Injection', 'Inhaler'] },
      { id: 'timeDue', label: 'Time Due', type: 'time' },
    ],
    data: [
      { id: '1', client: 'Margaret Smith', medication: 'Amlodipine', dose: '5mg', route: 'Oral', status: 'Given' },
      { id: '2', client: 'John Taylor', medication: 'Metformin', dose: '500mg', route: 'Oral', status: 'Due' },
      { id: '3', client: 'Eleanor Davies', medication: 'Paracetamol', dose: '1000mg', route: 'Oral', status: 'Pending' },
    ]
  },
  {
    file: 'src/modules/clients/CareNotes.jsx',
    title: 'Daily Care Notes',
    icon: 'ClipboardType',
    desc: 'Log and review daily care notes and visit summaries.',
    kpis: [
      { label: 'Notes Logged Today', val: '284', color: 'from-blue-500 to-indigo-600' },
      { label: 'Requires Review', val: '12', color: 'from-amber-500 to-orange-600' },
      { label: 'Incident Mentions', val: '2', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'loggedBy', label: 'Logged By', type: 'select', options: ['Sarah Jenkins', 'David Chen'] },
      { id: 'note', label: 'Care Note Details', type: 'textarea' },
    ],
    data: [
      { id: '1', date: '2026-06-19', client: 'Margaret Smith', loggedBy: 'Sarah Jenkins', note: 'Ate full breakfast, mood is good.', status: 'Normal' },
      { id: '2', date: '2026-06-19', client: 'John Taylor', loggedBy: 'David Chen', note: 'Refused medication, doctor notified.', status: 'Alert' },
      { id: '3', date: '2026-06-19', client: 'Eleanor Davies', loggedBy: 'Emma Wilson', note: 'Family visited for 1 hour.', status: 'Normal' },
    ]
  },
  {
    file: 'src/modules/clients/ClinicalObservations.jsx',
    title: 'Clinical Observations',
    icon: 'Activity',
    desc: 'Track Vitals, NEWS2 scores, and body maps.',
    kpis: [
      { label: 'Observations Today', val: '86', color: 'from-brand-500 to-brand-600' },
      { label: 'High NEWS2 Score', val: '4', color: 'from-rose-500 to-red-600' },
      { label: 'Routine Due', val: '18', color: 'from-amber-500 to-orange-600' }
    ],
    schema: [
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'sysBp', label: 'Systolic BP', type: 'number' },
      { id: 'diaBp', label: 'Diastolic BP', type: 'number' },
      { id: 'pulse', label: 'Pulse (bpm)', type: 'number' },
      { id: 'temp', label: 'Temperature (°C)', type: 'number' },
    ],
    data: [
      { id: '1', client: 'Margaret Smith', sysBp: '120', diaBp: '80', pulse: '72', status: '0 (Normal)' },
      { id: '2', client: 'John Taylor', sysBp: '145', diaBp: '95', pulse: '88', status: '3 (Monitor)' },
      { id: '3', client: 'Eleanor Davies', sysBp: '90', diaBp: '60', pulse: '110', status: '5 (Escalate)' },
    ]
  },
  {
    file: 'src/modules/clients/LegalCapacity.jsx',
    title: 'MCA, Consent & DoLS',
    icon: 'Scale',
    desc: 'Manage mental capacity assessments and Deprivation of Liberty Safeguards.',
    kpis: [
      { label: 'Active DoLS', val: '15', color: 'from-indigo-500 to-purple-600' },
      { label: 'Expiring (<30 Days)', val: '3', color: 'from-amber-500 to-orange-600' },
      { label: 'Pending Assessments', val: '5', color: 'from-blue-500 to-blue-600' }
    ],
    schema: [
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'assessmentType', label: 'Assessment Type', type: 'select', options: ['DoLS Standard', 'DoLS Urgent', 'MCA Form 3', 'Consent Form'] },
      { id: 'dateAuthorised', label: 'Date Authorised', type: 'date' },
      { id: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { id: 'document', label: 'Upload Document', type: 'file' },
    ],
    data: [
      { id: '1', client: 'Margaret Smith', assessmentType: 'DoLS Standard', dateAuthorised: '2026-01-12', expiryDate: '2027-01-12', status: 'Active' },
      { id: '2', client: 'John Taylor', assessmentType: 'MCA Form 3', dateAuthorised: '2026-03-05', expiryDate: '2026-09-05', status: 'Expiring' },
      { id: '3', client: 'Eleanor Davies', assessmentType: 'DoLS Urgent', dateAuthorised: 'Pending', expiryDate: 'Pending', status: 'Pending' },
    ]
  },
  {
    file: 'src/modules/clients/EndOfLife.jsx',
    title: 'End of Life & Passports',
    icon: 'Cross',
    desc: 'ReSPECT forms, DNACPR, and Hospital Care Passports.',
    kpis: [
      { label: 'DNACPR Active', val: '42', color: 'from-slate-500 to-slate-700' },
      { label: 'ReSPECT Forms', val: '38', color: 'from-emerald-500 to-teal-600' },
      { label: 'Missing Passports', val: '7', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'dnacpr', label: 'DNACPR Status', type: 'select', options: ['In Place', 'None', 'Pending'] },
      { id: 'respectForm', label: 'ReSPECT Form Completed?', type: 'select', options: ['Yes', 'No'] },
      { id: 'passport', label: 'Hospital Passport', type: 'select', options: ['Updated', 'Missing', 'Draft'] },
      { id: 'lastReviewed', label: 'Last Reviewed Date', type: 'date' },
    ],
    data: [
      { id: '1', client: 'Margaret Smith', dnacpr: 'In Place', respectForm: 'Yes', passport: 'Updated', status: 'Valid' },
      { id: '2', client: 'John Taylor', dnacpr: 'None', respectForm: 'No', passport: 'Missing', status: 'Action Required' },
      { id: '3', client: 'Eleanor Davies', dnacpr: 'In Place', respectForm: 'Yes', passport: 'Draft', status: 'Review Needed' },
    ]
  },
  // --- WORKFORCE ---
  {
    file: 'src/modules/workforce/TrainingMatrix.jsx',
    title: 'Training Matrix',
    icon: 'GraduationCap',
    desc: 'Mandatory training compliance and course tracking.',
    kpis: [
      { label: 'Total Compliance', val: '88%', color: 'from-emerald-500 to-teal-600' },
      { label: 'Expired Courses', val: '24', color: 'from-rose-500 to-red-600' },
      { label: 'Booked Training', val: '45', color: 'from-blue-500 to-indigo-600' }
    ],
    schema: [
      { id: 'employee', label: 'Employee', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'course', label: 'Course Name', type: 'select', options: ['Fire Safety', 'First Aid', 'Manual Handling', 'Safeguarding'] },
      { id: 'completionDate', label: 'Completion Date', type: 'date' },
      { id: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { id: 'certificate', label: 'Upload Certificate', type: 'file' },
    ],
    data: [
      { id: '1', employee: 'Sarah Jenkins', course: 'Fire Safety', completionDate: '2025-05-10', expiryDate: '2026-05-10', status: 'Expiring' },
      { id: '2', employee: 'David Chen', course: 'Manual Handling', completionDate: '2024-01-15', expiryDate: '2025-01-15', status: 'Expired' },
      { id: '3', employee: 'Emma Wilson', course: 'First Aid', completionDate: '2026-02-20', expiryDate: '2027-02-20', status: 'Valid' },
    ]
  },
  {
    file: 'src/modules/workforce/Supervisions.jsx',
    title: 'Supervisions & Appraisals',
    icon: 'Users',
    desc: 'Staff 1-to-1s, probations, and annual appraisals.',
    kpis: [
      { label: 'Completed (YTD)', val: '156', color: 'from-brand-500 to-brand-600' },
      { label: 'Overdue Supervisions', val: '12', color: 'from-rose-500 to-red-600' },
      { label: 'Upcoming Appraisals', val: '8', color: 'from-amber-500 to-orange-600' }
    ],
    schema: [
      { id: 'employee', label: 'Employee', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'manager', label: 'Manager Reviewing', type: 'select', options: ['Jane Doe', 'John Smith'] },
      { id: 'type', label: 'Review Type', type: 'select', options: ['1-to-1', 'Probation Review', 'Annual Appraisal', 'Return to Work'] },
      { id: 'date', label: 'Meeting Date', type: 'date' },
      { id: 'notes', label: 'Meeting Notes & Actions', type: 'textarea' },
    ],
    data: [
      { id: '1', employee: 'Sarah Jenkins', manager: 'Jane Doe', type: '1-to-1', date: '2026-05-12', status: 'Completed' },
      { id: '2', employee: 'David Chen', manager: 'Jane Doe', type: 'Probation Review', date: '2026-06-01', status: 'Overdue' },
      { id: '3', employee: 'Emma Wilson', manager: 'John Smith', type: 'Annual Appraisal', date: '2026-06-25', status: 'Upcoming' },
    ]
  },
  {
    file: 'src/modules/workforce/DBSVetting.jsx',
    title: 'DBS & Vetting',
    icon: 'ShieldCheck',
    desc: 'Pre-employment checks, Right to Work, and DBS renewals.',
    kpis: [
      { label: 'Valid DBS', val: '95%', color: 'from-emerald-500 to-teal-600' },
      { label: 'Renewals Due', val: '6', color: 'from-amber-500 to-orange-600' },
      { label: 'Pending Checks', val: '4', color: 'from-blue-500 to-indigo-600' }
    ],
    schema: [
      { id: 'employee', label: 'Employee', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Mike Newhire'] },
      { id: 'dbsNumber', label: 'DBS Certificate Number', type: 'text' },
      { id: 'issueDate', label: 'Issue Date', type: 'date' },
      { id: 'renewalDate', label: 'Renewal Date', type: 'date' },
      { id: 'document', label: 'Upload DBS Scan', type: 'file' },
    ],
    data: [
      { id: '1', employee: 'Sarah Jenkins', dbsNumber: '00192837465', issueDate: '2024-02-14', renewalDate: '2027-02-14', status: 'Valid' },
      { id: '2', employee: 'David Chen', dbsNumber: '00183746592', issueDate: '2023-06-10', renewalDate: '2026-06-10', status: 'Renewal Due' },
      { id: '3', employee: 'Mike Newhire', dbsNumber: 'Pending', issueDate: 'Pending', renewalDate: 'Pending', status: 'Pending Check' },
    ]
  },
  // --- FINANCE ---
  {
    file: 'src/modules/finance/VisitApproval.jsx',
    title: 'Visit Approval',
    icon: 'CheckCircle',
    desc: 'Approve completed visits from ECM for payroll processing.',
    kpis: [
      { label: 'Pending Approval', val: '342', color: 'from-amber-500 to-orange-600' },
      { label: 'Approved (This Week)', val: '1,204', color: 'from-emerald-500 to-teal-600' },
      { label: 'Disputed Visits', val: '8', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'date', label: 'Visit Date', type: 'date' },
      { id: 'carer', label: 'Carer', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'client', label: 'Client', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'actualTime', label: 'Actual Duration (Mins)', type: 'number' },
      { id: 'mileage', label: 'Mileage Claimed', type: 'number' },
    ],
    data: [
      { id: '1', date: '2026-06-01', carer: 'Sarah Jenkins', client: 'Margaret Smith', actualTime: '65', status: 'Pending' },
      { id: '2', date: '2026-06-01', carer: 'David Chen', client: 'John Taylor', actualTime: '30', status: 'Flagged' },
      { id: '3', date: '2026-06-01', carer: 'Emma Wilson', client: 'Eleanor Davies', actualTime: '92', status: 'Approved' },
    ]
  },
  {
    file: 'src/modules/finance/Invoices.jsx',
    title: 'Invoices',
    icon: 'FileSpreadsheet',
    desc: 'Invoice generation, billing, and payment tracking.',
    kpis: [
      { label: 'Unpaid Invoices', val: '£12,450', color: 'from-amber-500 to-orange-600' },
      { label: 'Overdue', val: '£3,200', color: 'from-rose-500 to-red-600' },
      { label: 'Paid (This Month)', val: '£45,800', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'invoiceId', label: 'Invoice Number', type: 'text' },
      { id: 'funder', label: 'Client / Funder', type: 'select', options: ['Local Authority', 'Private - M. Smith', 'Private - J. Taylor'] },
      { id: 'dateIssued', label: 'Date Issued', type: 'date' },
      { id: 'amount', label: 'Total Amount (£)', type: 'number' },
      { id: 'dueDate', label: 'Due Date', type: 'date' },
    ],
    data: [
      { id: '1', invoiceId: 'INV-2026-001', funder: 'Local Authority', dateIssued: '2026-06-01', amount: '4500.00', status: 'Paid' },
      { id: '2', invoiceId: 'INV-2026-002', funder: 'Private - M. Smith', dateIssued: '2026-06-01', amount: '850.00', status: 'Pending' },
      { id: '3', invoiceId: 'INV-2026-003', funder: 'Private - J. Taylor', dateIssued: '2026-05-15', amount: '1200.00', status: 'Overdue' },
    ]
  },
  {
    file: 'src/modules/finance/Contracts.jsx',
    title: 'Contracts',
    icon: 'Briefcase',
    desc: 'Funder contracts, rates, and commissioning details.',
    kpis: [
      { label: 'Active Contracts', val: '4', color: 'from-brand-500 to-brand-600' },
      { label: 'Private Clients', val: '42', color: 'from-indigo-500 to-purple-600' },
      { label: 'Expiring Contracts', val: '0', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'funderName', label: 'Funder Name', type: 'text' },
      { id: 'type', label: 'Contract Type', type: 'select', options: ['Commissioned', 'Private', 'NHS CHC'] },
      { id: 'baseRate', label: 'Base Hourly Rate (£)', type: 'number' },
      { id: 'startDate', label: 'Start Date', type: 'date' },
      { id: 'document', label: 'Upload Contract PDF', type: 'file' },
    ],
    data: [
      { id: '1', funderName: 'Local Authority (North)', type: 'Commissioned', baseRate: '21.50', startDate: '2025-01-01', status: 'Active' },
      { id: '2', funderName: 'NHS Continuing Care', type: 'Commissioned', baseRate: '24.00', startDate: '2025-04-01', status: 'Active' },
      { id: '3', funderName: 'Private Self-Funded', type: 'Private', baseRate: '25.00', startDate: '2025-01-01', status: 'Active' },
    ]
  },
  // --- COMPLIANCE ---
  {
    file: 'src/modules/compliance/GovernanceHub.jsx',
    title: 'Governance Hub',
    icon: 'Building2',
    desc: 'High-level KPI oversight and CQC quality signals.',
    kpis: [
      { label: 'Overall Quality Score', val: '92%', color: 'from-emerald-500 to-teal-600' },
      { label: 'Open Risks', val: '5', color: 'from-amber-500 to-orange-600' },
      { label: 'CQC Alerts', val: '0', color: 'from-brand-500 to-brand-600' }
    ],
    schema: [
      { id: 'domain', label: 'CQC Domain', type: 'select', options: ['Safe', 'Effective', 'Caring', 'Responsive', 'Well-Led'] },
      { id: 'metric', label: 'Metric Name', type: 'text' },
      { id: 'score', label: 'Current Score', type: 'text' },
      { id: 'trend', label: 'Trend', type: 'select', options: ['Improving', 'Stable', 'Declining'] },
      { id: 'actionPlan', label: 'Action Plan', type: 'textarea' },
    ],
    data: [
      { id: '1', domain: 'Safe', metric: 'Incident Rate', score: 'Low (1.2%)', trend: 'Improving', status: 'Good' },
      { id: '2', domain: 'Effective', metric: 'Care Plan Reviews', score: '85%', trend: 'Declining', status: 'Requires Improvement' },
      { id: '3', domain: 'Well-Led', metric: 'Staff Turnover', score: '8%', trend: 'Stable', status: 'Outstanding' },
    ]
  },
  {
    file: 'src/modules/compliance/ComplianceBoard.jsx',
    title: 'Compliance Board',
    icon: 'Shield',
    desc: 'Staff compliance RAG (Red, Amber, Green) tracking.',
    kpis: [
      { label: 'Fully Compliant', val: '78%', color: 'from-emerald-500 to-teal-600' },
      { label: 'Amber Warnings', val: '15%', color: 'from-amber-500 to-orange-600' },
      { label: 'Red Blocks', val: '7%', color: 'from-rose-500 to-red-600' }
    ],
    schema: [
      { id: 'employee', label: 'Employee', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'rightToWork', label: 'Right To Work Status', type: 'select', options: ['Valid', 'Expiring', 'Expired'] },
      { id: 'dbs', label: 'DBS Status', type: 'select', options: ['Valid', 'Expiring', 'Expired'] },
      { id: 'training', label: 'Training Status', type: 'select', options: ['Valid', 'Expiring', 'Expired'] },
    ],
    data: [
      { id: '1', employee: 'Sarah Jenkins', rightToWork: 'Valid', dbs: 'Valid', training: 'Valid', status: 'Green' },
      { id: '2', employee: 'David Chen', rightToWork: 'Valid', dbs: 'Expiring', training: 'Expired', status: 'Red' },
      { id: '3', employee: 'Emma Wilson', rightToWork: 'Valid', dbs: 'Valid', training: 'Expiring', status: 'Amber' },
    ]
  },
  {
    file: 'src/modules/compliance/StatutoryNotifications.jsx',
    title: 'Statutory Notifications',
    icon: 'Bell',
    desc: 'CQC & Local Authority notification tracking (Reg 18, 16, etc.).',
    kpis: [
      { label: 'Notifications Sent (YTD)', val: '12', color: 'from-brand-500 to-brand-600' },
      { label: 'Pending Submission', val: '1', color: 'from-amber-500 to-orange-600' },
      { label: 'Overdue', val: '0', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'refId', label: 'Reference ID', type: 'text' },
      { id: 'type', label: 'Notification Type', type: 'select', options: ['Serious Injury (Reg 18)', 'Safeguarding Alert', 'Police Incident', 'Death (Reg 16)'] },
      { id: 'eventDate', label: 'Date of Event', type: 'date' },
      { id: 'submissionDate', label: 'Submitted Date', type: 'date' },
      { id: 'document', label: 'Upload CQC Form', type: 'file' },
    ],
    data: [
      { id: '1', refId: 'NOT-001', type: 'Serious Injury (Reg 18)', eventDate: '2026-05-15', submissionDate: '2026-05-16', status: 'Submitted' },
      { id: '2', refId: 'NOT-002', type: 'Safeguarding Alert', eventDate: '2026-06-02', submissionDate: '', status: 'Drafting' },
      { id: '3', refId: 'NOT-003', type: 'Police Incident', eventDate: '2026-04-10', submissionDate: '2026-04-11', status: 'Closed' },
    ]
  },
  // --- SAFEGUARDING ---
  {
    file: 'src/modules/safeguarding/SafeguardingHub.jsx',
    title: 'Safeguarding Hub',
    icon: 'ShieldAlert',
    desc: 'Central dashboard for concerns, incidents, and reporting.',
    kpis: [
      { label: 'Open Investigations', val: '2', color: 'from-rose-500 to-red-600' },
      { label: 'Concerns Logged', val: '14', color: 'from-amber-500 to-orange-600' },
      { label: 'Closed (This Month)', val: '5', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'caseId', label: 'Case ID', type: 'text' },
      { id: 'type', label: 'Incident Type', type: 'select', options: ['Financial Abuse', 'Physical Abuse', 'Neglect', 'Medication Error', 'Other'] },
      { id: 'reportedBy', label: 'Reported By', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson', 'Family Member'] },
      { id: 'date', label: 'Incident Date', type: 'date' },
      { id: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
      { id: 'description', label: 'Detailed Description', type: 'textarea' },
    ],
    data: [
      { id: '1', caseId: 'SG-26-042', type: 'Financial Abuse Suspicion', reportedBy: 'Sarah Jenkins', date: '2026-06-01', status: 'Investigating' },
      { id: '2', caseId: 'SG-26-043', type: 'Unexplained Bruising', reportedBy: 'Emma Wilson', date: '2026-06-03', status: 'Referred to LA' },
      { id: '3', caseId: 'SG-26-040', type: 'Medication Error', reportedBy: 'David Chen', date: '2026-05-15', status: 'Closed' },
    ]
  },
  {
    file: 'src/modules/safeguarding/Concerns.jsx',
    title: 'Concerns Log',
    icon: 'Eye',
    desc: 'Record and track early warning signs and minor concerns.',
    kpis: [
      { label: 'New Concerns', val: '4', color: 'from-amber-500 to-orange-600' },
      { label: 'Escalated', val: '1', color: 'from-rose-500 to-red-600' },
      { label: 'Resolved', val: '32', color: 'from-emerald-500 to-teal-600' }
    ],
    schema: [
      { id: 'date', label: 'Date Noticed', type: 'date' },
      { id: 'client', label: 'Client Involved', type: 'select', options: ['Margaret Smith', 'John Taylor', 'Eleanor Davies'] },
      { id: 'category', label: 'Category', type: 'select', options: ['Weight Loss', 'Mood Change', 'Missed Calls', 'Hygiene'] },
      { id: 'loggedBy', label: 'Logged By', type: 'select', options: ['Sarah Jenkins', 'David Chen', 'Emma Wilson'] },
      { id: 'actionTaken', label: 'Immediate Action Taken', type: 'textarea' },
    ],
    data: [
      { id: '1', date: '2026-06-02', client: 'Margaret Smith', category: 'Weight Loss', loggedBy: 'Emma Wilson', status: 'Dietician Referral' },
      { id: '2', date: '2026-06-04', client: 'John Taylor', category: 'Mood Change', loggedBy: 'Sarah Jenkins', status: 'Monitoring' },
      { id: '3', date: '2026-06-05', client: 'Eleanor Davies', category: 'Missed Calls', loggedBy: 'David Chen', status: 'Escalated' },
    ]
  },
  {
    file: 'src/modules/safeguarding/Complaints.jsx',
    title: 'Formal Complaints',
    icon: 'FileWarning',
    desc: 'Manage and respond to formal complaints (Duty of Candour).',
    kpis: [
      { label: 'Active Complaints', val: '1', color: 'from-rose-500 to-red-600' },
      { label: 'Within 28d SLA', val: '1', color: 'from-emerald-500 to-teal-600' },
      { label: 'Upheld (YTD)', val: '2', color: 'from-amber-500 to-orange-600' }
    ],
    schema: [
      { id: 'complaintId', label: 'Complaint ID', type: 'text' },
      { id: 'receivedDate', label: 'Date Received', type: 'date' },
      { id: 'complainant', label: 'Complainant Type', type: 'select', options: ['Service User', 'Family Member', 'Staff', 'Other'] },
      { id: 'category', label: 'Complaint Category', type: 'select', options: ['Late Visit', 'Staff Attitude', 'Billing Issue', 'Care Quality'] },
      { id: 'details', label: 'Complaint Details', type: 'textarea' },
    ],
    data: [
      { id: '1', complaintId: 'CMP-004', receivedDate: '2026-06-01', complainant: 'Family Member', category: 'Late Visit', status: 'Investigating' },
      { id: '2', complaintId: 'CMP-003', receivedDate: '2026-04-15', complainant: 'Service User', category: 'Staff Attitude', status: 'Resolved (Upheld)' },
      { id: '3', complaintId: 'CMP-002', receivedDate: '2026-02-10', complainant: 'Family Member', category: 'Billing Issue', status: 'Resolved (Not Upheld)' },
    ]
  }
];

templates.forEach(t => {
  const absolutePath = path.join('c:/Kiaan/rota manegnment', t.file);
  const componentName = path.basename(t.file, '.jsx');
  
  // Create an initial state object based on the schema
  const initialStateKeys = t.schema.map(field => `"${field.id}": ""`).join(', ');

  const content = `import React, { useState } from 'react';
import { ${t.icon}, Search, Filter, Download, Plus, ChevronRight, MoreHorizontal, X, FileUp } from 'lucide-react';

const ${componentName} = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ${initialStateKeys}, status: 'Active' });

  const kpis = ${JSON.stringify(t.kpis, null, 2)};
  const schema = ${JSON.stringify(t.schema, null, 2)};
  const columns = schema.slice(0, 4).map(f => f.label);
  const dataKeys = schema.slice(0, 4).map(f => f.id);
  const [tableData, setTableData] = useState(${JSON.stringify(t.data, null, 2)});

  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now().toString(),
      ...formData
    };
    setTableData([newRecord, ...tableData]);
    setIsModalOpen(false);
    setFormData({ ${initialStateKeys}, status: 'Active' });
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
            <${t.icon} className="w-8 h-8" />
            ${t.title}
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            ${t.desc}
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
            <div className={\`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr \${kpi.color} text-white shadow-md\`}>
              <${t.icon} className="h-5 w-5" />
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
                    <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block
                      \${row.status.includes('Active') || row.status.includes('Completed') || row.status.includes('Valid') || row.status.includes('Green') || row.status.includes('Paid') || row.status.includes('Good') || row.status.includes('Given') || row.status.includes('Normal') || row.status.includes('0')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : row.status.includes('Alert') || row.status.includes('Red') || row.status.includes('Overdue') || row.status.includes('Escalate') || row.status.includes('Missing') || row.status.includes('Upheld') || row.status.includes('5')
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                      }\`}>
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

export default ${componentName};
`;

  fs.writeFileSync(absolutePath, content);
});

console.log('Successfully built ' + templates.length + ' premium UI components with SPECIALIZED logical schemas!');
