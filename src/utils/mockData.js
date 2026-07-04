// Complete, high-fidelity mock data system for Care Home workforce & compliance

export const INITIAL_EMPLOYEES = [
  {
    id: "EMP-001",
    name: "Abhina",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    dob: "1988-04-12",
    address: "24 Maple Drive, Birmingham, B12 6XY",
    phone: "+44 7700 900077",
    email: "abhina@swan-care.co.uk",
    emergencyContact: "David Jenkins (Spouse) - +44 7700 900088",
    title: "Senior Care Assistant",
    role: "Manager", // Manager UI Role
    group: "Care Staff Day",
    manager: "Admin User",
    holidayAllocation: 28,
    startDate: "2021-03-15",
    status: "Active",
    salary: "£42,000",
    niNumber: "JH 90 12 34 D",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-002",
    name: "Oliver",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    dob: "1992-08-23",
    address: "107 High Street, Birmingham, B4 7TA",
    phone: "+44 7700 900122",
    email: "oliver@swan-care.co.uk",
    emergencyContact: "Elena Carter (Mother) - +44 7700 900123",
    title: "Registered Care Nurse",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 30,
    startDate: "2022-06-10",
    status: "Active",
    salary: "£36,500",
    niNumber: "JC 23 45 67 C",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-003",
    name: "Aron",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    dob: "1995-11-02",
    address: "59 Primrose Avenue, Solihull, B91 3RD",
    phone: "+44 7700 900455",
    email: "aron@swan-care.co.uk",
    emergencyContact: "Father - +44 7700 900456",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Night",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2023-01-20",
    status: "Active",
    salary: "£24,000",
    niNumber: "AP 34 56 78 B",
    contractType: "Part-Time Permanent"
  },
  {
    id: "EMP-004",
    name: "Carol",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    dob: "1980-05-30",
    address: "12 Gorse Lane, Coventry, CV3 5FG",
    phone: "+44 7700 900233",
    email: "carol@swan-care.co.uk",
    emergencyContact: "Spouse - +44 7700 900234",
    title: "Head Cook",
    role: "Employee",
    group: "Cook",
    manager: "Abhina",
    holidayAllocation: 25,
    startDate: "2019-09-01",
    status: "Active",
    salary: "£28,000",
    niNumber: "TM 45 67 89 A",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-005",
    name: "Danielle",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    dob: "1990-02-14",
    address: "88 Kings Road, Birmingham, B11 4PR",
    phone: "+44 7700 900611",
    email: "danielle@swan-care.co.uk",
    emergencyContact: "Brother - +44 7700 900612",
    title: "Domestic Housekeeper",
    role: "Employee",
    group: "Domestic",
    manager: "Abhina",
    holidayAllocation: 25,
    startDate: "2023-05-15",
    status: "Active",
    salary: "£22,000",
    niNumber: "ER 56 78 90 D",
    contractType: "Zero-Hours Contract"
  },
  {
    id: "EMP-006",
    name: "Firos",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    dob: "1975-07-19",
    address: "41 Westbury Croft, Solihull, B90 2PL",
    phone: "+44 7700 900788",
    email: "firos@swan-care.co.uk",
    emergencyContact: "Spouse - +44 7700 900789",
    title: "Lead Compliance Officer",
    role: "Compliance Officer",
    group: "Care Staff Day",
    manager: "Admin User",
    holidayAllocation: 30,
    startDate: "2020-01-10",
    status: "Active",
    salary: "£38,000",
    niNumber: "MV 67 89 01 C",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-007",
    name: "Haritha",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    dob: "1997-09-05",
    address: "15 The Copse, Birmingham, B15 1QQ",
    phone: "+44 7700 900912",
    email: "haritha@swan-care.co.uk",
    emergencyContact: "Father - +44 7700 900913",
    title: "Receptionist & Front Desk Office",
    role: "Receptionist",
    group: "Domestic",
    manager: "Abhina",
    holidayAllocation: 25,
    startDate: "2022-10-01",
    status: "Active",
    salary: "£21,500",
    niNumber: "CB 78 90 12 B",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-008",
    name: "Harry",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    dob: "1993-03-27",
    address: "7 Silverwood Way, Birmingham, B29 4AA",
    phone: "+44 7700 900889",
    email: "harry@swan-care.co.uk",
    emergencyContact: "Mother - +44 7700 900880",
    title: "Junior Care Support",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-04-01",
    status: "Active",
    salary: "£23,500",
    niNumber: "LO 89 01 23 A",
    contractType: "Part-Time Temporary"
  },
  {
    id: "EMP-009",
    name: "Joel Jose",
    photo: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=120",
    dob: "1994-05-12",
    address: "12 Brookside, Birmingham, B14 5RT",
    phone: "+44 7700 900119",
    email: "joel.jose@swan-care.co.uk",
    emergencyContact: "Mary Jose (Mother) - +44 7700 900120",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Night",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-05-01",
    status: "Active",
    salary: "£23,500",
    niNumber: "JJ 12 34 56 A",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-010",
    name: "Kathy",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    dob: "1991-03-24",
    address: "99 Oak Road, Solihull, B92 1DF",
    phone: "+44 7700 900228",
    email: "kathy@swan-care.co.uk",
    emergencyContact: "John Smith (Brother) - +44 7700 900229",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2023-06-15",
    status: "Active",
    salary: "£24,000",
    niNumber: "KT 78 90 12 C",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-011",
    name: "Nathan",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    dob: "1989-12-10",
    address: "14 Forest Lane, Birmingham, B16 3TY",
    phone: "+44 7700 900331",
    email: "nathan@swan-care.co.uk",
    emergencyContact: "Rose Nathan (Spouse) - +44 7700 900332",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-01-10",
    status: "Active",
    salary: "£23,500",
    niNumber: "NT 34 56 78 D",
    contractType: "Part-Time Permanent"
  },
  {
    id: "EMP-012",
    name: "Sahil",
    photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120",
    dob: "1996-07-02",
    address: "223 Bristol Road, Birmingham, B29 6LG",
    phone: "+44 7700 900445",
    email: "sahil@swan-care.co.uk",
    emergencyContact: "M. Sahil (Father) - +44 7700 900446",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-02-15",
    status: "Active",
    salary: "£23,500",
    niNumber: "SL 90 12 34 B",
    contractType: "Full-Time Permanent"
  },
  {
    id: "EMP-013",
    name: "Chelsee",
    photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=120",
    dob: "1998-11-15",
    address: "5 Meadow View, Solihull, B90 3QQ",
    phone: "+44 7700 900551",
    email: "chelsee@swan-care.co.uk",
    emergencyContact: "Emma Chelsee (Mother) - +44 7700 900552",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-03-20",
    status: "Active",
    salary: "£23,500",
    niNumber: "CH 56 78 90 A",
    contractType: "Part-Time Permanent"
  },
  {
    id: "EMP-014",
    name: "Niranjala",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=120",
    dob: "1994-09-08",
    address: "8A Hill Top Road, Birmingham, B10 2PL",
    phone: "+44 7700 900662",
    email: "niranjala@swan-care.co.uk",
    emergencyContact: "K. Nadeeshani (Sister) - +44 7700 900663",
    title: "Care Support Worker",
    role: "Employee",
    group: "Care Staff Day",
    manager: "Abhina",
    holidayAllocation: 28,
    startDate: "2024-04-10",
    status: "Active",
    salary: "£23,500",
    niNumber: "NN 12 34 56 B",
    contractType: "Full-Time Permanent"
  }
];

export const INITIAL_TEMPLATES = [
  {
    id: "temp-offer-letter",
    name: "Offer Letter",
    subject: "Official Offer of Employment",
    content: "Dear {{employee_name}},\n\nWe are pleased to offer you the role of {{job_title}} at AS Care.\n\nYour employee ID will be {{employee_id}} and you will be working in the {{department}} department.\n\nYour start date will be {{start_date}}.\n\nSalary: {{salary}}\nContract Type: {{contract_type}}\nReporting Manager: {{manager_name}}\n\nKind Regards,\n\nManagement Team\nAS Care Home",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Recruitment"
  },
  {
    id: "temp-interview-invitation",
    name: "Invitation for Interview",
    subject: "Invitation for Interview - Health Care Assistant",
    content: "Dear {{employee_name}},\n\nThank you for your application for the position of {{job_title}}. I am pleased to confirm that you have been short listed for an interview.\n\nThe interview will be held on {{start_date}} at 11.00am. Interviews will be held at Swan Care Home.\n\nThe interview will last approximately 1 hour and the panel will consist of Dursha K and Johanna E.\n\nI would be grateful if you would confirm whether or not you are able to attend the interview by contacting myself on dursha@ascareservices.co.uk.\n\nPlease let us know if you have any special requirements in order to attend and take part in the interview.\n\nYou are encouraged to visit the home prior to the interview and you can arrange this with us at a mutually convenient time.\n\nThanking you in anticipation.\n\nYours sincerely,\n\nDursha Krishan\nDirector of Swan care home",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: false,
    category: "Recruitment"
  },
  {
    id: "temp-id-verification",
    name: "ID Verification Form",
    subject: "Confirmation of Identity Form",
    content: "AIRAA SWAAN LTD - CONFIRMATION OF IDENTITY CHECK SHEET\n\n(To be completed by the Applicant and Verified by Manager)\n\nApplicant Full Name: {{employee_name}}\nPosition Applied For: {{job_title}}\nEmployee Reference ID: {{employee_id}}\nNational Insurance Number: {{national_insurance_no}}\nAddress: {{address}}\n\nIn order to confirm identity you need to present original identity documents. Please check original documents seen:\n\nGROUP 1 DOCUMENTS (Primary Trusted Credentials):\n[ ] Current Valid Passport\n[ ] Biometric Residence Permit (UK)\n[ ] Current Valid Photo Driving Licence\n[ ] UK Birth Certificate (issued at time of birth)\n\nGROUP 2b DOCUMENTS (Financial/Social History):\n[ ] Bank/Building Society Statement\n[ ] Utility Bill (Electricity, gas, water - NOT mobile contract)\n[ ] Council Tax Statement\n\nVERIFIER DECLARATION:\nI confirm that I have seen the original identity documents as indicated above and photocopies are attached.\n\nFull Name of Verifier: Sarah Jenkins\nRole: General Manager, AS Care\nSigned: Sarah Jenkins\nDate: {{start_date}}",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Recruitment"
  },
  {
    id: "temp-employment-offer-letter-swan",
    name: "Offer of Employment Letter (Swan Care)",
    subject: "Offer of employment Letter - Health Care Assistant",
    content: "Dear {{employee_name}},\n\nOffer of employment Letter\n\nWe would like to confirm our offer to you our offer of appointment as {{job_title}} and to confirm the principal terms of your appointment.\n\nThis offer is subject to the Company receiving two job reference(s) and 1 character reference(s) which are deemed to be satisfactory. Please confirm the names and addresses of the referees from whom the references can be taken.\n\nYour employment shall be subject to an initial probationary period of 6 months during which time your performance and conduct will be monitored.\n\nThis offer is also subject to you providing relevant documents proving your legal right to work in the UK. On your first day, you should bring your passport and P45.\n\nYou will initially be employed at AIRAA SWAAN LTD at 29 North Street, Tillingham, CM0 7TR. Your commencing salary will be £12.21 per hour payable 3rd of each month in arrears by BACS.\n\nPlease sign and date both copies of this Offer Letter to confirm that you accept the terms and conditions.\n\nYours sincerely,\n\nDursha Krishan\nDirector of AS Care",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Recruitment"
  },
  {
    id: "temp-jd-hca-lead",
    name: "Job Description: HCA Lead",
    subject: "Job Description - HCA Lead (Health Care Lead)",
    content: "AIRAA SWAAN LTD HCA Lead JOB DESCRIPTION\n\nJob Summary:\nAs a Health Care Lead, you will provide compassionate, person-centred care to elderly residents, many of whom may have dementia, limited mobility, or complex care needs. You play a critical role in supporting the care team, ensuring high-quality resident care, and maintaining accurate and timely documentation. You act as a key link between the management and care staff, providing leadership, guidance, and support.\n\nKey Responsibilities:\n1. Team Leadership & Support:\n- Supervise and support Health Care Assistants (HCAs).\n- Provide training, coaching, and mentorship to HCAs.\n- Assist with staff scheduling and shift cover arrangements.\n\n2. Documentation & Compliance:\n- Ensure HCAs complete all required paperwork accurately and on time.\n- Support the manager with care plans, audits, and compliance reports.\n- Monitor and review care records and PCS system entries.\n- Conduct regular spot checks on care documentation standards.\n\n3. Personal Care & Support:\n- Assist with washing, dressing, toileting, and grooming.\n- Ensure each resident has at least one bath weekly.\n- Provide a minimum of 30 minutes of personalised 1:1 time daily.\n\n4. Night Shift Duties (when assigned):\n- Ensure the home is clean, safe, and well-prepared for the following day.\n- Clean worktops, cushions, conservatory, and bathrooms.\n- Wake and support at least 4 residents using double hoists.\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-jd-cook",
    name: "Job Description: Cook",
    subject: "Job Description - Care Home Cook",
    content: "AIRAA SWAAN LTD COOK JOB DESCRIPTION\n\nJob Summary:\nAs a Care Home Cook, you are responsible for preparing nutritious, balanced, and enjoyable meals that meet the dietary needs of elderly residents, including soft/pureed diets, diabetic, low-salt, and allergy-specific requirements. You will manage kitchen cleanliness, stock control, and daily kitchen paperwork.\n\nKey Responsibilities:\n1. Meal Preparation & Service:\n- Prepare daily meals (breakfast, lunch, dinner, snacks) in line with the agreed menu.\n- Ensure portion control, presentation, and food temperatures are appropriate.\n\n2. Kitchen Cleanliness & HACCP Compliance:\n- Maintain high standards of kitchen cleanliness in accordance with food hygiene regulations.\n- Clean all cooking equipment, work surfaces, and kitchen areas thoroughly.\n\n3. Kitchen Paperwork:\n- Fridge & Freezer Temperatures (Record twice daily: morning/afternoon).\n- Cooked Food Temperatures (Record temperature before serving - minimum 75°C).\n- Food Labelling & Storage (Label all opened items with date and use-by date).\n- Cleaning Records (Tick off daily cleaning schedules with initials and time).\n- Delivery & Stock Records (Check quality and expiry dates of delivered items).\n- Waste Records (Log food wasted and reasons).\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-jd-domestic",
    name: "Job Description: Domestic Assistant",
    subject: "Job Description - Domestic Assistant / Housekeeper",
    content: "CAROL DOMESTIC JOB DESCRIPTION\n\nJob Purpose:\nTo maintain a clean, safe, and welcoming environment for residents, staff, and visitors. The Domestic Assistant ensures all housekeeping, laundry, and cleaning paperwork compliance requirements are met, and supports general care home operations.\n\nKey Responsibilities:\n1. Cleaning & Housekeeping:\n- Clean residents' rooms, communal areas, bathrooms, and corridors according to schedule.\n- Clean windows, kitchens, and other areas as required.\n- Empty bins, wash bins, and move bins to front/back on collection days.\n- Maintain high standards of hygiene and infection control.\n\n2. Laundry:\n- Wash, dry, iron, and store residents' clothing and household linen.\n- Ensure personal items are labelled and returned correctly.\n- Maintain laundry area cleanliness and organisation.\n\n3. Paperwork & Compliance:\n- Complete all required cleaning, kitchen, laundry, and safety documentation.\n- Maintain records to comply with CQC, Environmental Health, and internal audits.\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-jd-hca",
    name: "Job Description: Health Care Assistant",
    subject: "Job Description - Health Care Assistant (HCA)",
    content: "AIRAA SWAAN LTD HCA JOB DESCRIPTION\n\nJob Summary:\nAs a Health Care Assistant, you will provide compassionate, person-centred care to elderly residents, promoting dignity, independence, and respect. Working as part of a dedicated care team, you play a key role in supporting daily living tasks and maintaining accurate documentation.\n\nKey Responsibilities:\n1. Personal Care & Support:\n- Assist with washing, dressing, toileting, grooming, and oral hygiene.\n- Ensure each resident has at least one bath weekly, maintaining privacy.\n- Support safe mobility and transfers using hoists/wheelchairs.\n- Provide a minimum of 30 minutes of personalised 1:1 time daily with each resident.\n\n2. Monitoring & Documentation:\n- Monitor and report any changes in residents' physical or emotional condition.\n- Maintain accurate records of care delivered and update care plans accordingly.\n- Record shift handovers in the PCS system: 'No issues, all residents\' items and belongings are there.'\n\n3. Nutrition & Mealtime Support:\n- Assist with meal preparation and support residents with eating and drinking.\n- Encourage social interaction during mealtimes.\n\n4. Activities & Mental Wellbeing:\n- Use the activity book to plan, deliver, and record daily stimulating activities.\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-jd-manager",
    name: "Job Description: Care Home Manager",
    subject: "Job Description - Care Home Manager",
    content: "MANAGER JOB DESCRIPTION\n\nJob Summary:\nThe Care Home Manager is responsible for the overall management, leadership, governance, compliance, and day-to-day operation of the care home. The Manager will ensure that residents receive safe, effective, caring, responsive, and well-led care in accordance with CQC Fundamental Standards, company policies, and relevant legislation.\n\nKey Responsibilities:\n1. Leadership and Management:\n- Provide visible leadership across the service.\n- Manage staffing levels to ensure residents' needs are met safely.\n- Manage staff performance, appraisals, and supervisions.\n\n2. Resident Care & Quality Assurance:\n- Monitor care plans, risk assessments, and daily records.\n- Oversee admissions, assessments, reviews, and discharges.\n- Complete regular care audits and governance audits.\n\n3. CQC Compliance & Governance:\n- Ensure compliance with Health and Social Care Act 2008, CQC Standards, Mental Capacity Act 2005, and safeguarding legislation.\n- Lead CQC inspections and regulatory visits.\n\n4. Staffing and Human Resources:\n- Recruit, interview, and induct staff.\n- Monitor DBS checks, references, and right-to-work documentation.\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-jd-team-leader",
    name: "Job Description: Team Leader",
    subject: "Job Description - Care Team Leader",
    content: "AIRAA SWAAN LTD TEAM LEADER JOB DESCRIPTION\n\nJob Purpose:\nThe Team Leader is responsible for leading and supporting the care team on a shift-by-shift basis to ensure residents receive safe, effective, responsive, and person-centred care. The Team Leader acts as a role model for staff, ensures care is delivered in accordance with care plans and company policies, and supports the Manager in maintaining compliance with CQC regulations and the home's quality standards. The Team Leader is responsible for overseeing staff on duty, allocating work, monitoring care delivery, completing audits, and ensuring the safety, dignity, and wellbeing of all residents.\n\nKey Responsibilities:\n\n1. Leadership and Supervision:\n- Lead the care team during each shift.\n- Allocate duties and responsibilities to staff.\n- Provide support, guidance, and supervision to care staff.\n- Monitor staff performance and address poor practice immediately.\n- Act as a positive role model and promote best practice.\n- Conduct shift handovers and communicate important information effectively.\n- Escalate concerns to senior management appropriately.\n\n2. Resident Care:\n- Ensure residents receive safe, effective, compassionate, and person-centred care.\n- Monitor delivery of care throughout the shift.\n- Ensure care plans and risk assessments are followed.\n- Respond promptly to changes in residents' health and wellbeing.\n- Support staff with complex care needs where required.\n- Ensure residents are treated with dignity, respect, and compassion.\n- Promote independence and choice wherever possible.\n\n3. Medication Management:\n- Administer medication safely if trained and competent.\n- Complete medication audits and checks.\n- Ensure MAR charts are completed accurately.\n- Report medication errors or concerns immediately.\n- Liaise with pharmacies, GPs, and healthcare professionals as required.\n- Monitor medication stock levels and ordering requirements.\n\n4. Documentation and Record Keeping:\n- Ensure daily records are completed accurately and contemporaneously.\n- Monitor completion of:\n  * Care notes\n  * Fluid charts\n  * Food charts\n  * Repositioning charts\n  * Observation records\n  * Bowel charts\n  * Behaviour monitoring charts\n  * Incident and accident records\n- Ensure records are factual, accurate, and compliant.\n- Challenge and address poor record keeping immediately.\n\n5. Safeguarding:\n- Ensure safeguarding concerns are identified and reported promptly.\n- Follow safeguarding procedures at all times.\n- Promote a culture of openness and protection.\n- Support safeguarding investigations where required.\n- Protect residents from abuse, neglect, discrimination, and harm.\n\n6. Health and Safety:\n- Ensure safe working practices are followed.\n- Monitor moving and handling practices.\n- Complete environmental checks during shifts.\n- Report hazards immediately.\n- Ensure equipment is safe and fit for use.\n- Support fire safety procedures and emergency responses.\n- Ensure accident and incident forms are completed correctly.\n\n7. Infection Prevention and Control:\n- Monitor infection control practices.\n- Ensure staff follow hand hygiene procedures.\n- Ensure PPE is available and used appropriately.\n- Monitor cleanliness of the home.\n- Report infection concerns immediately.\n\n8. Staffing Responsibilities:\n- Ensure staffing levels are appropriate throughout the shift.\n- Monitor staff attendance and punctuality.\n- Provide support to new staff and agency workers.\n- Assist with induction and competency assessments.\n- Escalate staffing concerns to management.\n\n9. Communication:\n- Maintain effective communication with:\n  * Residents\n  * Families\n  * Staff\n  * Healthcare professionals\n  * Social workers\n  * District nurses\n  * GPs\n  * Visiting professionals\n- Ensure important information is communicated promptly.\n- Support relatives and respond professionally to concerns.\n\n10. Audits and Quality Assurance:\n- Complete delegated audits and checks.\n- Monitor compliance with care plans.\n- Identify areas requiring improvement.\n- Support action plans and quality improvement initiatives.\n- Participate in internal and external inspections.\n\n11. Emergency Responsibilities:\n- Act as the senior person on shift when required.\n- Respond appropriately to emergencies.\n- Coordinate evacuation procedures if necessary.\n- Ensure residents remain safe during incidents.\n- Escalate concerns promptly to management and emergency services when required.\n\nAdditional Responsibilities:\n- Complete daily walkarounds of the home.\n- Check staffing allocations and resident welfare.\n- Monitor residents identified as high risk.\n- Ensure repositioning schedules are followed.\n- Ensure pressure care interventions are completed.\n- Ensure call bells are answered promptly.\n- Monitor meal times and hydration support.\n- Ensure visitors are welcomed appropriately.\n- Support end-of-life care where required.\n- Participate in the on-call rota if requested.\n\nPerson Specification:\nEssential:\n- Experience working within a care home environment.\n- Good leadership and communication skills.\n- Knowledge of safeguarding and person-centred care.\n- Ability to lead and motivate staff.\n- Ability to complete accurate documentation.\n- Understanding of moving and handling procedures.\n- Good organisational skills.\nDesirable:\n- Medication administration training.\n- Experience supervising staff.\n- Knowledge of CQC regulations and Fundamental Standards.\n\nEmployee Signature: __________________\nDate: __________________",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Job Descriptions"
  },
  {
    id: "temp-contract",
    name: "Contract of Employment",
    subject: "Written Statement of Employment Particulars",
    content: "CONTRACT OF EMPLOYMENT\n\nThis document outlines the terms of employment between AS Care and {{employee_name}} (Employee ID: {{employee_id}}).\n\n1. Position: You are employed as {{job_title}}, reporting directly to {{manager_name}}.\n2. Department: {{department}}.\n3. Start Date: Your employment commenced on {{start_date}}.\n4. Salary: {{salary}}, paid monthly in arrears.\n5. Contract Type: {{contract_type}}.\n6. Address of Record: {{address}}.\n7. National Insurance No: {{national_insurance_no}}.\n\nKind Regards,\n\nManagement Team\nAS Care Home",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: true,
    category: "Contracts"
  },
  {
    id: "temp-probation",
    name: "Probation Confirmation Letter",
    subject: "Successful Completion of Probation Period",
    content: "Dear {{employee_name}},\n\nWe are writing to confirm that you have successfully completed your probationary period for the position of {{job_title}} in the {{department}} department.\n\nYour contract type remains {{contract_type}} and your reporting manager is {{manager_name}}. We appreciate your dedication and hard work since your start date of {{start_date}}.\n\nKind Regards,\n\nManagement Team\nAS Care Home",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: false,
    category: "Lifecycle"
  },
  {
    id: "temp-reference",
    name: "Reference Letter",
    subject: "Employment Reference - Confidential",
    content: "To Whom It May Concern,\n\nI am writing to confirm that {{employee_name}} is/was employed at AS Care as {{job_title}} from {{start_date}}.\n\nDuring their tenure in the {{department}} department, they reported to {{manager_name}}. Their contract type was {{contract_type}}.\n\nShould you require any further details regarding their employment history, please do not hesitate to contact our office.\n\nKind Regards,\n\nHR Department\nAS Care Home",
    includeLogo: true,
    requireManagerSignature: true,
    requireEmployeeSignature: false,
    category: "General"
  }
];


// List of the 26 required compliance documents (combining CQC and new types)
export const MANDATORY_DOCS = [
  "Right To Work",
  "Employer Reference 1",
  "Employer Reference 2",
  "DBS Check",
  "Proof of Qualification",
  "GDPR Acknowledgment",
  "Employee Handbook",
  "Rehabilitation Form",
  "Health Questionnaire",
  "Contract of Employment",
  "Pension Form",
  "Payroll Form",
  "Application Form",
  "Proof Of Address",
  "Job Description",
  "Induction Record",
  "Other Documents"
];

// Build initial high-fidelity document state for employees
export const buildInitialDocuments = (employees) => {
  const docsState = {};
  
  employees.forEach((emp) => {
    const empNum = parseInt(emp.id.replace("EMP-", "")) || 0;
    
    docsState[emp.id] = MANDATORY_DOCS.map((doc, idx) => {
      // Seed for deterministic unique variation
      const seed = empNum * 13 + idx;
      
      // Vary states dynamically to feel populated and alive
      const shouldUpload = idx < 12 || 
        (emp.id === "EMP-003" && idx === 13) || 
        (emp.id === "EMP-004" && idx === 14);

      let uploadStatus = shouldUpload ? "Uploaded" : "Pending";
      let verifiedStatus = shouldUpload ? "Verified" : "Needs Verification";
      let expiryDate = "N/A";
      let status = shouldUpload ? "Verified" : "Not Uploaded";
      let fileName = shouldUpload ? (doc.toLowerCase().replace(/ /g, '_') + '.pdf') : "";
      let uploadedBy = shouldUpload ? emp.name : "";
      
      // Assign expiries to DBS Check and Right To Work
      if (doc === 'DBS Check' && shouldUpload) {
        expiryDate = emp.id === "EMP-002" ? "2026-07-15" : "2028-12-31";
      } else if (doc === 'Right To Work' && shouldUpload) {
        expiryDate = emp.id === "EMP-002" ? "2026-06-28" : "2028-12-31";
      }
      
      // Dynamic varied dates & times
      const uploadDay = (1 + (seed % 27)).toString().padStart(2, '0');
      let uploadDate = shouldUpload ? `2026-05-${uploadDay}` : "";
      let uploadTime = shouldUpload ? `${(8 + (seed % 4)).toString().padStart(2, '0')}:${(10 + (seed % 48)).toString().padStart(2, '0')} AM` : "";
      
      // Seeded verifier
      let verifiedBy = shouldUpload ? ((seed % 2 === 0) ? "Sarah Jenkins" : "Admin User") : "";
      
      const verifyDay = (1 + ((parseInt(uploadDay) + (seed % 3)) % 27)).toString().padStart(2, '0');
      let verificationDate = shouldUpload ? `2026-05-${verifyDay}` : "";
      let verificationTime = shouldUpload ? `${(1 + (seed % 5)).toString().padStart(2, '0')}:${(12 + (seed % 45)).toString().padStart(2, '0')} PM` : "";
      
      const notesOptions = [
        "Original seen and matches record.",
        "Original verified. Checked physical document copy.",
        "Approved after reviewing physical copy during audit.",
        "Verified details. Certified copy stored.",
        "Verification complete. Approved by management.",
        "CQC requirement satisfied. Original verified."
      ];
      let verificationNotes = shouldUpload ? notesOptions[seed % notesOptions.length] : "";
      let originalSeen = shouldUpload ? true : false;
      let rejectedBy = "";
      let rejectedDate = "";
      let rejectedTime = "";
      let rejectionReason = "";
      
      // Some employees are perfectly compliant, some have missing documents
      if (emp.id === "EMP-008" && idx > 5) {
        uploadStatus = "Pending";
        verifiedStatus = "Needs Verification";
        status = "Not Uploaded";
        expiryDate = "N/A";
        fileName = "";
        uploadedBy = "";
        uploadDate = "";
        uploadTime = "";
        verifiedBy = "";
        verificationDate = "";
        verificationTime = "";
        verificationNotes = "";
        originalSeen = false;
      } else if (emp.id === "EMP-005" && idx % 7 === 0) {
        uploadStatus = "Pending";
        verifiedStatus = "Needs Verification";
        status = "Not Uploaded";
        expiryDate = "N/A";
        fileName = "";
        uploadedBy = "";
        uploadDate = "";
        uploadTime = "";
        verifiedBy = "";
        verificationDate = "";
        verificationTime = "";
        verificationNotes = "";
        originalSeen = false;
      } else if (emp.id === "EMP-004" && doc === 'Other Documents') {
        uploadStatus = "Pending";
        verifiedStatus = "Needs Verification";
        status = "Rejected";
        expiryDate = "N/A";
        fileName = "other_docs.pdf";
        uploadedBy = emp.name;
        uploadDate = "2026-06-02";
        uploadTime = "11:20 AM";
        verifiedBy = "";
        verificationDate = "";
        verificationTime = "";
        verificationNotes = "";
        originalSeen = false;
        rejectedBy = seed % 2 === 0 ? "Sarah Jenkins" : "Admin User";
        rejectedDate = `2026-06-0${1 + (seed % 2)}`;
        rejectedTime = `0${2 + (seed % 3)}:40 PM`;
        rejectionReason = "Document blurry and unreadable";
      }

      // If uploaded but not verified, it's pending verification
      if (uploadStatus === "Uploaded" && verifiedStatus !== "Verified") {
        status = "Pending Verification";
      }
      
      const history = [];
      if (uploadStatus === "Uploaded" || status === "Rejected") {
        history.push({
          action: "Uploaded",
          user: emp.name,
          date: uploadDate || "2026-05-15",
          time: uploadTime || "10:30 AM"
        });
      }
      if (status === "Rejected") {
        history.push({
          action: "Rejected",
          user: rejectedBy,
          date: rejectedDate,
          time: rejectedTime,
          reason: rejectionReason
        });
      }
      if (verifiedStatus === "Verified") {
        history.push({
          action: "Original Seen Checked",
          user: verifiedBy,
          date: verificationDate,
          time: "02:10 PM"
        });
        history.push({
          action: "Verified",
          user: verifiedBy,
          date: verificationDate,
          time: verificationTime
        });
      }

      return {
        name: doc,
        uploadStatus,
        verifiedStatus,
        status,
        expiryDate,
        fileName,
        uploadedBy,
        uploadDate,
        uploadTime,
        verifiedBy,
        verificationDate,
        verificationTime,
        verificationNotes,
        originalSeen,
        rejectedBy,
        rejectedDate,
        rejectedTime,
        rejectionReason,
        employeeSignature: uploadStatus === "Uploaded" ? "E-Signed" : "Pending Signature",
        managerSignature: verifiedStatus === "Verified" ? "Verified By Manager" : "Pending Verification",
        complianceIndicator: uploadStatus === "Pending" 
          ? "Red" 
          : (expiryDate !== "N/A" && new Date(expiryDate) < new Date("2026-06-01")) 
            ? "Red" 
            : (expiryDate !== "N/A" && new Date(expiryDate) < new Date("2026-07-01"))
              ? "Amber"
              : "Green",
        history
      };
    });
  });
  
  return docsState;
};

// Weekly Rota Calendar state (Shift assignment)
// Days: Monday - Sunday
export const INITIAL_SHIFTS = [
  // Monday
  { id: "S-1", employeeId: "EMP-001", day: "Monday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-2", employeeId: "EMP-002", day: "Monday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-3", employeeId: "EMP-008", day: "Monday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-4", employeeId: "EMP-001", day: "Monday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-5", employeeId: "EMP-002", day: "Monday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-6", employeeId: "EMP-006", day: "Monday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-7", employeeId: "EMP-004", day: "Monday", type: "8AM–8PM", role: "Cook" },
  { id: "S-7-extra1", employeeId: "EMP-001", day: "Monday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-7-extra2", employeeId: "EMP-002", day: "Monday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-8", employeeId: "EMP-005", day: "Monday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-9", employeeId: "EMP-003", day: "Monday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-10", employeeId: "EMP-008", day: "Monday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-11", employeeId: "EMP-006", day: "Monday", type: "8PM–8AM", role: "Care Staff Night" },

  // Tuesday
  { id: "S-12", employeeId: "EMP-001", day: "Tuesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-13", employeeId: "EMP-002", day: "Tuesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-14", employeeId: "EMP-008", day: "Tuesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-15", employeeId: "EMP-001", day: "Tuesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-16", employeeId: "EMP-002", day: "Tuesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-17", employeeId: "EMP-006", day: "Tuesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-18", employeeId: "EMP-004", day: "Tuesday", type: "8AM–8PM", role: "Cook" },
  { id: "S-18-extra1", employeeId: "EMP-001", day: "Tuesday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-18-extra2", employeeId: "EMP-002", day: "Tuesday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-19", employeeId: "EMP-005", day: "Tuesday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-20", employeeId: "EMP-003", day: "Tuesday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-21", employeeId: "EMP-008", day: "Tuesday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-22", employeeId: "EMP-006", day: "Tuesday", type: "8PM–8AM", role: "Care Staff Night" },

  // Wednesday
  { id: "S-23", employeeId: "EMP-001", day: "Wednesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-24", employeeId: "EMP-002", day: "Wednesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-25", employeeId: "EMP-008", day: "Wednesday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-26", employeeId: "EMP-001", day: "Wednesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-27", employeeId: "EMP-002", day: "Wednesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-28", employeeId: "EMP-006", day: "Wednesday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-29", employeeId: "EMP-004", day: "Wednesday", type: "8AM–8PM", role: "Cook" },
  { id: "S-29-extra1", employeeId: "EMP-001", day: "Wednesday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-29-extra2", employeeId: "EMP-002", day: "Wednesday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-30", employeeId: "EMP-005", day: "Wednesday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-31", employeeId: "EMP-003", day: "Wednesday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-32", employeeId: "EMP-008", day: "Wednesday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-33", employeeId: "EMP-006", day: "Wednesday", type: "8PM–8AM", role: "Care Staff Night" },

  // Thursday
  { id: "S-34", employeeId: "EMP-001", day: "Thursday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-35", employeeId: "EMP-002", day: "Thursday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-36", employeeId: "EMP-008", day: "Thursday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-37", employeeId: "EMP-001", day: "Thursday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-38", employeeId: "EMP-002", day: "Thursday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-39", employeeId: "EMP-006", day: "Thursday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-40", employeeId: "EMP-004", day: "Thursday", type: "8AM–8PM", role: "Cook" },
  { id: "S-40-extra1", employeeId: "EMP-001", day: "Thursday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-40-extra2", employeeId: "EMP-002", day: "Thursday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-41", employeeId: "EMP-005", day: "Thursday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-42", employeeId: "EMP-003", day: "Thursday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-43", employeeId: "EMP-008", day: "Thursday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-44", employeeId: "EMP-006", day: "Thursday", type: "8PM–8AM", role: "Care Staff Night" },

  // Friday
  { id: "S-45", employeeId: "EMP-001", day: "Friday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-46", employeeId: "EMP-002", day: "Friday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-47", employeeId: "EMP-008", day: "Friday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-48", employeeId: "EMP-001", day: "Friday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-49", employeeId: "EMP-002", day: "Friday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-50", employeeId: "EMP-006", day: "Friday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-51", employeeId: "EMP-004", day: "Friday", type: "8AM–8PM", role: "Cook" },
  { id: "S-51-extra1", employeeId: "EMP-001", day: "Friday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-51-extra2", employeeId: "EMP-002", day: "Friday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-52", employeeId: "EMP-005", day: "Friday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-53", employeeId: "EMP-003", day: "Friday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-54", employeeId: "EMP-008", day: "Friday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-55", employeeId: "EMP-006", day: "Friday", type: "8PM–8AM", role: "Care Staff Night" },

  // Saturday
  { id: "S-56", employeeId: "EMP-001", day: "Saturday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-57", employeeId: "EMP-002", day: "Saturday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-58", employeeId: "EMP-008", day: "Saturday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-59", employeeId: "EMP-001", day: "Saturday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-60", employeeId: "EMP-002", day: "Saturday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-61", employeeId: "EMP-006", day: "Saturday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-62", employeeId: "EMP-004", day: "Saturday", type: "8AM–8PM", role: "Cook" },
  { id: "S-62-extra1", employeeId: "EMP-001", day: "Saturday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-62-extra2", employeeId: "EMP-002", day: "Saturday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-63", employeeId: "EMP-005", day: "Saturday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-64", employeeId: "EMP-003", day: "Saturday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-65", employeeId: "EMP-008", day: "Saturday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-66", employeeId: "EMP-006", day: "Saturday", type: "8PM–8AM", role: "Care Staff Night" },

  // Sunday
  { id: "S-67", employeeId: "EMP-001", day: "Sunday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-68", employeeId: "EMP-002", day: "Sunday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-69", employeeId: "EMP-008", day: "Sunday", type: "8AM–2PM", role: "Care Staff Day" },
  { id: "S-70", employeeId: "EMP-001", day: "Sunday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-71", employeeId: "EMP-002", day: "Sunday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-72", employeeId: "EMP-006", day: "Sunday", type: "2PM–8PM", role: "Care Staff Day" },
  { id: "S-73", employeeId: "EMP-004", day: "Sunday", type: "8AM–8PM", role: "Cook" },
  { id: "S-73-extra1", employeeId: "EMP-001", day: "Sunday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-73-extra2", employeeId: "EMP-002", day: "Sunday", type: "8AM–8PM", role: "Care Staff Day" },
  { id: "S-74", employeeId: "EMP-005", day: "Sunday", type: "8AM–2PM", role: "Domestic" },
  { id: "S-75", employeeId: "EMP-003", day: "Sunday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-76", employeeId: "EMP-008", day: "Sunday", type: "8PM–8AM", role: "Care Staff Night" },
  { id: "S-77", employeeId: "EMP-006", day: "Sunday", type: "8PM–8AM", role: "Care Staff Night" }
];

export const INITIAL_OPEN_SHIFTS = [
  { id: "OS-1", day: "Wednesday", type: "8PM–8AM", role: "Care Staff Night", reason: "Amira needs assistance" },
  { id: "OS-2", day: "Thursday", type: "8AM–8PM", role: "Cook", reason: "Thomas on leave" },
  { id: "OS-3", day: "Saturday", type: "8AM–2PM", role: "Care Staff Day", reason: "Weekend extra cover" },
  { id: "OS-4", day: "Saturday", type: "8PM–8AM", role: "Care Staff Night", reason: "Standard vacancy" }
];

// Target/Required Staffing configuration
export const STAFF_REQUIREMENTS = {
  "Care Staff Day": 3,
  "Care Staff Night": 2,
  "Cook": 1,
  "Domestic": 1
};

// Shift Type timings representation
export const SHIFT_TIMINGS = {
  "8AM–2PM": "Day early (6 hrs)",
  "2PM–8PM": "Day late (6 hrs)",
  "8AM–8PM": "Full day (12 hrs)",
  "8PM–8AM": "Night shift (12 hrs)"
};

// Attendance logs
export const INITIAL_ATTENDANCE = [
  { id: "A-1", employeeId: "EMP-001", date: "2026-06-01", clockIn: "07:55 AM", clockOut: "02:02 PM", breaks: [{ start: "11:00 AM", end: "11:30 AM" }], status: "On Time", location: "Swan care home", latitude: 52.4862, longitude: -1.8904, geofenceStatus: "Inside", distance: 12, accuracy: "±5 meters" },
  { id: "A-2", employeeId: "EMP-002", date: "2026-06-01", clockIn: "08:15 AM", clockOut: "02:05 PM", breaks: [{ start: "12:00 PM", end: "12:30 PM" }], status: "Late", location: "Oakfield care home", latitude: 52.6369, longitude: -1.1398, geofenceStatus: "Inside", distance: 15, accuracy: "±5 meters" },
  { id: "A-3", employeeId: "EMP-004", date: "2026-06-01", clockIn: "07:50 AM", clockOut: "08:05 PM", breaks: [{ start: "01:00 PM", end: "01:45 PM" }], status: "On Time", location: "Birmingham medical", latitude: 52.4815, longitude: -1.9025, geofenceStatus: "Inside", distance: 9, accuracy: "±5 meters" },
  { id: "A-4", employeeId: "EMP-005", date: "2026-06-01", clockIn: "08:00 AM", clockOut: "02:00 PM", breaks: [{ start: "10:30 AM", end: "11:00 AM" }], status: "On Time", location: "Solihull hub", latitude: 52.4128, longitude: -1.7781, geofenceStatus: "Inside", distance: 8, accuracy: "±5 meters" },
  { id: "A-5", employeeId: "EMP-003", date: "2026-06-01", clockIn: "07:58 PM", clockOut: "Pending", breaks: [], status: "Active (Night)", location: "Oakfield care home", latitude: 52.6371, longitude: -1.1396, geofenceStatus: "Inside", distance: 14, accuracy: "±5 meters" },
];

// Audits types
export const AUDIT_TYPES = [
  "Fire Audit",
  "Monthly Medication Audit",
  "Care Plan Audit",
  "Health & Safety Audit",
  "Infection Control Audit",
  "Dignity Audit",
  "Meal Nutrition Audit",
  "House Keeping Cleaning Standards",
  "Kitchen Audit"
];

// Audit records
export const INITIAL_AUDITS = [];

// Visitors log database
export const INITIAL_VISITORS = [
  { id: "VIS-101", name: "David Foster", company: "Premium Medical Supplies", phone: "+44 7911 123456", purpose: "Deliver Medical Stocks", visitingPerson: "Sarah Jenkins", clockIn: "2026-06-01 09:15 AM", clockOut: "2026-06-01 09:45 AM", status: "Signed Out" },
  { id: "VIS-102", name: "Helena Green", company: "Family Member", phone: "+44 7911 654321", purpose: "Visit resident Mary Green (Rm 14)", visitingPerson: "Mary Green (Resident)", clockIn: "2026-06-01 10:30 AM", clockOut: "Still Inside", status: "Currently Inside" },
  { id: "VIS-103", name: "Dr. Alistair Cook", company: "NHS Birmingham Clinic", phone: "+44 7911 888999", purpose: "Routine Resident Health Audits", visitingPerson: "Nurse James Carter", clockIn: "2026-06-01 11:10 AM", clockOut: "Still Inside", status: "Currently Inside" }
];

// Leave applications database
export const INITIAL_LEAVE = [
  { id: "LV-201", employeeId: "EMP-002", type: "Annual Leave", start: "2026-06-12", end: "2026-06-16", days: 4, reason: "Family Holiday trip", status: "Pending" },
  { id: "LV-202", employeeId: "EMP-004", type: "Annual Leave", start: "2026-06-04", end: "2026-06-05", days: 2, reason: "Doctor Checkup & Rest", status: "Approved" },
  { id: "LV-203", employeeId: "EMP-003", type: "Compassionate Leave", start: "2026-05-10", end: "2026-05-12", days: 3, reason: "Family emergency", status: "Approved" },
  { id: "LV-204", employeeId: "EMP-005", type: "Annual Leave", start: "2026-07-20", end: "2026-07-27", days: 6, reason: "Summer Trip", status: "Pending" }
];

// Notifications
export const INITIAL_NOTIFICATIONS = [
  { id: "N-1", type: "alert", text: "Wednesday Night Shift is understaffed (Care Staff Night: 1/2)", time: "10 mins ago", read: false },
  { id: "N-2", type: "info", text: "Medication Audit is due tomorrow", time: "2 hrs ago", read: false },
  { id: "N-3", type: "warning", text: "Right To Work document for James Carter is expiring on 2026-06-15", time: "5 hrs ago", read: false },
  { id: "N-4", type: "info", text: "Leave Request pending: James Carter (12 Jun - 16 Jun)", time: "1 day ago", read: true },
  { id: "N-5", type: "success", text: "New open shift claimed: Saturday Care Day by Liam O'Connor", time: "2 days ago", read: true }
];

export const INITIAL_DAY_NOTES = [
  {
    id: "DN-1",
    day: "Tuesday",
    type: "Management Note",
    title: "Staff Meeting at 4 PM",
    description: "All available staff must attend the weekly briefing.",
    priority: "Medium",
    visibility: "All Staff",
    createdBy: "Manager",
    createdDate: "02 Jun 2026 09:30"
  },
  {
    id: "DN-2",
    day: "Tuesday",
    type: "Clinical Note",
    title: "GP Visit at 11 AM",
    description: "Dr. Cook visiting for routine checkups.",
    priority: "High",
    visibility: "All Staff",
    createdBy: "Admin",
    createdDate: "02 Jun 2026 08:00"
  },
  {
    id: "DN-3",
    day: "Tuesday",
    type: "Clinical Note",
    title: "Medication Delivery Arrived",
    description: "Monthly care stocks received at front desk.",
    priority: "Medium",
    visibility: "Management & Compliance",
    createdBy: "Compliance",
    createdDate: "02 Jun 2026 10:15"
  }
];

export const INITIAL_OBSERVATIONS = [
  {
    id: 'OBS-001',
    date: '2026-06-01',
    time: '14:30',
    resident: 'Eleanor Vance',
    type: 'Fall Risk',
    customType: '',
    priority: 'High',
    location: 'Lounge Area',
    description: 'Resident appeared unsteady when transitioning from chair to walker.',
    notes: 'Assisted by care staff. No fall occurred.',
    actionTaken: 'Monitored for 30 minutes, advised to wait for assistance.',
    assignedStaff: 'EMP-002',
    createdBy: 'EMP-002',
    followUpRequired: true,
    followUpDate: '2026-06-03',
    status: 'Open',
    notesHistory: [
      { date: '2026-06-01 14:35', authorName: 'James Carter', comment: 'Assisted by care staff. No fall occurred.' }
    ],
    attachments: [
      { name: 'incident_report_draft.pdf', size: '150 KB', uploadedBy: 'James Carter', date: '2026-06-01' }
    ],
    timeline: [
      { date: '2026-06-01 14:30', action: 'Created', by: 'James Carter (EMP-002)' },
      { date: '2026-06-01 14:35', action: 'Assigned', by: 'James Carter (EMP-002)' }
    ]
  },
  {
    id: 'OBS-002',
    date: '2026-05-30',
    time: '09:15',
    resident: 'Arthur Pendelton',
    type: 'Refusal Of Care',
    customType: '',
    priority: 'Medium',
    location: 'Room 12',
    description: 'Refused morning medication.',
    notes: 'Stated he felt sick and did not want pills.',
    actionTaken: 'Reported to Head Nurse. Meds re-offered at 10:00 and accepted.',
    assignedStaff: 'EMP-003',
    createdBy: 'EMP-003',
    followUpRequired: false,
    followUpDate: '',
    status: 'Closed',
    notesHistory: [
      { date: '2026-05-30 09:20', authorName: 'Amira Patel', comment: 'Stated he felt sick.' }
    ],
    attachments: [],
    timeline: [
      { date: '2026-05-30 09:15', action: 'Created', by: 'Amira Patel (EMP-003)' },
      { date: '2026-05-30 09:20', action: 'Assigned', by: 'Amira Patel (EMP-003)' },
      { date: '2026-05-30 10:00', action: 'Closed', by: 'Sarah Jenkins (EMP-001)' }
    ]
  },
  {
    id: 'OBS-003',
    date: '2026-06-02',
    time: '08:00',
    resident: 'Eleanor Vance',
    type: 'Medication Concern',
    customType: '',
    priority: 'High',
    location: 'Clinical Room',
    description: 'Omission of morning blood pressure medication.',
    notes: 'Resident refused to take the medication, claiming she already had it.',
    actionTaken: 'Notified GP and monitored vitals.',
    assignedStaff: 'EMP-001',
    createdBy: 'EMP-002',
    followUpRequired: true,
    followUpDate: '2026-06-04',
    status: 'Open',
    notesHistory: [],
    attachments: [],
    timeline: [
      { date: '2026-06-02 08:00', action: 'Created', by: 'James Carter (EMP-002)' },
      { date: '2026-06-02 08:15', action: 'Assigned', by: 'Sarah Jenkins (EMP-001)' }
    ]
  },
  {
    id: 'OBS-004',
    date: '2026-06-02',
    time: '11:00',
    resident: 'Mary Green',
    type: 'Safeguarding',
    customType: '',
    priority: 'High',
    location: 'Room 14',
    description: 'Bruising observed on left forearm of unknown origin.',
    notes: 'Resident does not recall how it happened.',
    actionTaken: 'Completed incident form and uploaded photo.',
    assignedStaff: 'EMP-006',
    createdBy: 'EMP-001',
    followUpRequired: true,
    followUpDate: '2026-06-03',
    status: 'Open',
    notesHistory: [
      { date: '2026-06-02 11:30', authorName: 'Marcus Vance', comment: 'Compliance review started.' }
    ],
    attachments: [{ name: 'forearm_bruising.jpg', size: '420 KB', uploadedBy: 'Sarah Jenkins', date: '2026-06-02' }],
    timeline: [
      { date: '2026-06-02 11:00', action: 'Created', by: 'Sarah Jenkins (EMP-001)' },
      { date: '2026-06-02 11:15', action: 'Assigned', by: 'Marcus Vance (EMP-006)' },
      { date: '2026-06-02 11:30', action: 'Reviewed', by: 'Marcus Vance (EMP-006)' }
    ]
  },
  {
    id: 'OBS-005',
    date: '2026-06-02',
    time: '12:30',
    resident: 'Arthur Pendelton',
    type: 'Infection',
    customType: '',
    priority: 'Medium',
    location: 'Room 12',
    description: 'Suspected UTI. Nursing team monitoring hydration levels closely.',
    notes: 'GP visited and prescribed antibiotics.',
    actionTaken: 'Antibiotics administered. Hydration chart started.',
    assignedStaff: 'EMP-002',
    createdBy: 'EMP-003',
    followUpRequired: true,
    followUpDate: '2026-06-05',
    status: 'Open',
    notesHistory: [],
    attachments: [],
    timeline: [
      { date: '2026-06-02 12:30', action: 'Created', by: 'Amira Patel (EMP-003)' },
      { date: '2026-06-02 12:45', action: 'Assigned', by: 'James Carter (EMP-002)' }
    ]
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'COMP-001',
    staffMember: 'James Carter',
    employeeId: 'EMP-002',
    department: 'Nursing',
    type: 'Medication Competency',
    customType: '',
    assessorName: 'Dr. John Doe',
    assessmentDate: '2025-12-01',
    reviewDate: '2026-06-01',
    expiryDate: '2026-12-01',
    result: 'Pass',
    score: '95',
    comments: 'Excellent understanding of MAR charts and safe administration.',
    recommendations: 'Continue standard practice.',
    checklist: {
      'MAR Chart Understanding': true, 'Safe Administration': true, 'Hand Hygiene': true, 
      'Consent Procedures': true, 'Medication Storage': true, 'Controlled Drugs Handling': true, 
      'Record Keeping': true, 'PRN Medication Knowledge': true, 'Error Reporting': true
    },
    evidence: [{ name: 'practical_observation_record.pdf', size: '240 KB', date: '2025-12-01' }],
    renewalHistory: []
  },
  {
    id: 'COMP-002',
    staffMember: 'Elena Rostova',
    employeeId: 'EMP-005',
    department: 'Domestic',
    type: 'Fire Safety Competency',
    customType: '',
    assessorName: 'Sarah Jenkins',
    assessmentDate: '2025-05-15',
    reviewDate: '2025-11-15',
    expiryDate: '2026-05-15',
    result: 'Fail',
    score: '60',
    comments: 'Failed to demonstrate correct evacuation route.',
    recommendations: 'Retrain in 2 weeks.',
    checklist: {},
    evidence: [],
    renewalHistory: []
  },
  {
    id: 'COMP-003',
    staffMember: 'Amira Patel',
    employeeId: 'EMP-003',
    department: 'Care Staff Night',
    type: 'Medication Error Competency',
    customType: '',
    assessorName: 'Sarah Jenkins',
    assessmentDate: '2025-06-15',
    reviewDate: '2025-12-15',
    expiryDate: '2026-06-15',
    result: 'Pass',
    score: '88',
    comments: 'Good understanding of duties of candour and reporting timelines.',
    recommendations: 'Refresh competency training before expiry.',
    checklist: {
      'Error Identification': true, 'Near Miss Reporting': true, 'Duty Of Candour': true, 
      'Incident Reporting': true, 'Escalation Process': false, 'Documentation Requirements': true, 
      'Corrective Actions': true
    },
    evidence: [{ name: 'med_error_module_cert.png', size: '1.2 MB', date: '2025-06-15' }],
    renewalHistory: []
  },
  {
    id: 'COMP-004',
    staffMember: 'Liam O\'Connor',
    employeeId: 'EMP-008',
    department: 'Care Staff Day',
    type: 'Manual Handling Competency',
    customType: '',
    assessorName: 'Sarah Jenkins',
    assessmentDate: '2025-04-10',
    reviewDate: '2025-10-10',
    expiryDate: '2026-04-10',
    result: 'Pass',
    score: '82',
    comments: 'Demonstrated safe usage of hoist and slide sheets.',
    recommendations: 'Schedule renewal assessment.',
    checklist: {},
    evidence: [],
    renewalHistory: [{ date: '2025-04-10', action: 'Initial Certification', by: 'Sarah Jenkins' }]
  }
];

export const INITIAL_POLICIES = [
  { id: 'health-safety', name: 'Health & Safety Policy', description: 'Standards for safe work practices, hazard identification, and emergency procedures in the care home.', version: 'v3.2', category: 'Health & Safety' },
  { id: 'safeguarding', name: 'Safeguarding & Protection', description: 'Procedures for protecting vulnerable adults from abuse, neglect, and exploitation.', version: 'v4.1', category: 'Clinical & Care' },
  { id: 'gdpr', name: 'GDPR & Data Protection', description: 'Guidelines for handling resident personal information, medical records, and staff data privacy.', version: 'v2.0', category: 'Administrative' },
  { id: 'whistleblowing', name: 'Whistleblowing Policy', description: 'Channels and protections for reporting malpractice, safety concerns, or misconduct.', version: 'v2.5', category: 'Governance' },
  { id: 'infection-control', name: 'Infection Control & Prevention', description: 'Hygiene protocols, handwashing guides, and outbreak containment strategies.', version: 'v3.0', category: 'Health & Safety' }
];

export const INITIAL_POLICY_SIGNATURES = {
  'EMP-001': {
    'health-safety': { signed: true, signedAt: '2026-05-10 09:30 AM' },
    'safeguarding': { signed: true, signedAt: '2026-05-10 09:35 AM' },
    'gdpr': { signed: true, signedAt: '2026-05-10 09:40 AM' },
    'whistleblowing': { signed: true, signedAt: '2026-05-10 09:45 AM' },
    'infection-control': { signed: true, signedAt: '2026-05-10 09:50 AM' }
  },
  'EMP-002': {
    'health-safety': { signed: true, signedAt: '2026-05-12 11:20 AM' },
    'safeguarding': { signed: true, signedAt: '2026-05-12 11:25 AM' },
    'gdpr': { signed: false, signedAt: '' },
    'whistleblowing': { signed: true, signedAt: '2026-05-12 11:30 AM' },
    'infection-control': { signed: true, signedAt: '2026-05-12 11:35 AM' }
  },
  'EMP-003': {
    'health-safety': { signed: true, signedAt: '2026-05-15 08:45 PM' },
    'safeguarding': { signed: true, signedAt: '2026-05-15 08:50 PM' },
    'gdpr': { signed: true, signedAt: '2026-05-16 09:00 PM' },
    'whistleblowing': { signed: false, signedAt: '' },
    'infection-control': { signed: true, signedAt: '2026-05-15 08:55 PM' }
  },
  'EMP-004': {
    'health-safety': { signed: true, signedAt: '2026-05-11 07:15 AM' },
    'safeguarding': { signed: false, signedAt: '' },
    'gdpr': { signed: false, signedAt: '' },
    'whistleblowing': { signed: true, signedAt: '2026-05-11 07:20 AM' },
    'infection-control': { signed: true, signedAt: '2026-05-11 07:25 AM' }
  },
  'EMP-005': {
    'health-safety': { signed: true, signedAt: '2026-05-18 10:10 AM' },
    'safeguarding': { signed: true, signedAt: '2026-05-18 10:15 AM' },
    'gdpr': { signed: false, signedAt: '' },
    'whistleblowing': { signed: false, signedAt: '' },
    'infection-control': { signed: true, signedAt: '2026-05-18 10:20 AM' }
  },
  'EMP-006': {
    'health-safety': { signed: true, signedAt: '2026-05-09 10:00 AM' },
    'safeguarding': { signed: true, signedAt: '2026-05-09 10:05 AM' },
    'gdpr': { signed: true, signedAt: '2026-05-09 10:10 AM' },
    'whistleblowing': { signed: true, signedAt: '2026-05-09 10:15 AM' },
    'infection-control': { signed: true, signedAt: '2026-05-09 10:20 AM' }
  },
  'EMP-007': {
    'health-safety': { signed: true, signedAt: '2026-05-14 02:30 PM' },
    'safeguarding': { signed: true, signedAt: '2026-05-14 02:35 PM' },
    'gdpr': { signed: true, signedAt: '2026-05-14 02:40 PM' },
    'whistleblowing': { signed: false, signedAt: '' },
    'infection-control': { signed: true, signedAt: '2026-05-14 02:45 PM' }
  },
  'EMP-008': {
    'health-safety': { signed: false, signedAt: '' },
    'safeguarding': { signed: false, signedAt: '' },
    'gdpr': { signed: false, signedAt: '' },
    'whistleblowing': { signed: false, signedAt: '' },
    'infection-control': { signed: false, signedAt: '' }
  }
};

export const TRAINING_COURSES = [
  { id: 'medication', name: 'Medication Administration' },
  { id: 'moving-handling', name: 'Moving & Handling' },
  { id: 'fire-safety', name: 'Fire Safety / Warden' },
  { id: 'infection-control', name: 'Infection Control (IPC)' },
  { id: 'dementia-care', name: 'Dementia Care' },
  { id: 'safeguarding', name: 'Safeguarding Adults' },
  { id: 'bls-first-aid', name: 'Basic Life Support & First Aid' },
  { id: 'food-hygiene', name: 'Food Hygiene' },
  { id: 'mca-dols', name: 'MCA & DoLS' },
  { id: 'gdpr', name: 'UK-GDPR' },
  { id: 'bowel-care', name: 'Bowel Care & Management' },
  { id: 'diabetes', name: 'Diabetes Awareness' },
  { id: 'dysphagia', name: 'Dysphagia Awareness' },
  { id: 'health-safety', name: 'Health & Safety (COSHH)' }
];

export const INITIAL_TRAINING_MATRIX = {
  'EMP-001': {
    'medication': '2025-09-27',
    'moving-handling': '2025-09-26',
    'fire-safety': '2025-09-26',
    'infection-control': '2025-09-26',
    'dementia-care': '2026-01-20',
    'safeguarding': '2025-09-27',
    'bls-first-aid': '2025-09-29',
    'food-hygiene': '2025-09-29',
    'mca-dols': '2026-01-20',
    'gdpr': '2026-02-16',
    'bowel-care': '2026-02-16',
    'diabetes': '2026-02-07',
    'dysphagia': '2026-01-20',
    'health-safety': '2026-01-20'
  },
  'EMP-002': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-05',
    'infection-control': '2025-11-26',
    'dementia-care': '',
    'safeguarding': '2025-11-24',
    'bls-first-aid': '2026-02-18',
    'food-hygiene': '',
    'mca-dols': '',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': ''
  },
  'EMP-003': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-10',
    'infection-control': '',
    'dementia-care': '',
    'safeguarding': '',
    'bls-first-aid': '',
    'food-hygiene': '',
    'mca-dols': '',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': '2026-02-11'
  },
  'EMP-004': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-05',
    'infection-control': '2025-11-26',
    'dementia-care': '2026-02-07',
    'safeguarding': '2025-11-24',
    'bls-first-aid': '2026-02-11',
    'food-hygiene': '2024-11-05',
    'mca-dols': '2026-02-26',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '2026-02-06',
    'dysphagia': '2026-02-08',
    'health-safety': '2026-02-06'
  },
  'EMP-005': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2024-07-25',
    'infection-control': '2024-07-25',
    'dementia-care': '2026-02-08',
    'safeguarding': '2025-11-24',
    'bls-first-aid': '2026-02-19',
    'food-hygiene': '2026-02-19',
    'mca-dols': '2025-03-30',
    'gdpr': '2026-02-17',
    'bowel-care': '2026-02-19',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': '2026-02-10'
  },
  'EMP-006': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-19',
    'infection-control': '2026-02-11',
    'dementia-care': '2026-01-23',
    'safeguarding': '2025-12-03',
    'bls-first-aid': '2026-02-22',
    'food-hygiene': '2026-02-22',
    'mca-dols': '2026-01-23',
    'gdpr': '2026-02-22',
    'bowel-care': '2026-02-22',
    'diabetes': '2026-02-11',
    'dysphagia': '2026-01-23',
    'health-safety': '2026-02-11'
  },
  'EMP-007': {
    'medication': '2025-09-27',
    'moving-handling': '',
    'fire-safety': '2025-12-10',
    'infection-control': '2025-11-26',
    'dementia-care': '2023-10-28',
    'safeguarding': '2025-09-12',
    'bls-first-aid': '2025-09-13',
    'food-hygiene': '2023-10-29',
    'mca-dols': '',
    'gdpr': '2023-10-29',
    'bowel-care': '2026-02-23',
    'diabetes': '2023-10-28',
    'dysphagia': '2026-01-20',
    'health-safety': '2023-10-29'
  },
  'EMP-008': {
    'medication': '2025-10-12',
    'moving-handling': '2025-10-11',
    'fire-safety': '2025-10-11',
    'infection-control': '2025-10-11',
    'dementia-care': '2026-01-20',
    'safeguarding': '2025-10-12',
    'bls-first-aid': '2025-09-25',
    'food-hygiene': '2025-10-12',
    'mca-dols': '2026-01-20',
    'gdpr': '2026-02-17',
    'bowel-care': '2026-02-18',
    'diabetes': '2026-02-07',
    'dysphagia': '2026-01-20',
    'health-safety': '2026-01-20'
  },
  'EMP-009': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-10',
    'infection-control': '2025-11-26',
    'dementia-care': '2026-01-21',
    'safeguarding': '2025-11-24',
    'bls-first-aid': '2026-03-03',
    'food-hygiene': '2026-02-23',
    'mca-dols': '2026-01-20',
    'gdpr': '',
    'bowel-care': '2026-02-23',
    'diabetes': '2026-02-12',
    'dysphagia': '2026-01-21',
    'health-safety': '2026-01-21'
  },
  'EMP-010': {
    'medication': '',
    'moving-handling': '2025-11-18',
    'fire-safety': '2025-12-10',
    'infection-control': '2025-11-26',
    'dementia-care': '2026-02-09',
    'safeguarding': '2024-07-13',
    'bls-first-aid': '2026-02-11',
    'food-hygiene': '2026-02-11',
    'mca-dols': '2026-02-09',
    'gdpr': '2026-02-11',
    'bowel-care': '2026-02-11',
    'diabetes': '2026-02-06',
    'dysphagia': '2026-02-06',
    'health-safety': '2025-03-06'
  },
  'EMP-011': {
    'medication': '',
    'moving-handling': '2026-04-13',
    'fire-safety': '2026-04-13',
    'infection-control': '',
    'dementia-care': '',
    'safeguarding': '',
    'bls-first-aid': '',
    'food-hygiene': '',
    'mca-dols': '2025-01-31',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': ''
  },
  'EMP-012': {
    'medication': '2026-04-19',
    'moving-handling': '',
    'fire-safety': '',
    'infection-control': '',
    'dementia-care': '',
    'safeguarding': '',
    'bls-first-aid': '',
    'food-hygiene': '',
    'mca-dols': '',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': ''
  },
  'EMP-013': {
    'medication': '',
    'moving-handling': '2026-04-13',
    'fire-safety': '2026-04-13',
    'infection-control': '',
    'dementia-care': '',
    'safeguarding': '',
    'bls-first-aid': '',
    'food-hygiene': '',
    'mca-dols': '',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': ''
  },
  'EMP-014': {
    'medication': '',
    'moving-handling': '2026-04-13',
    'fire-safety': '2026-04-13',
    'infection-control': '',
    'dementia-care': '',
    'safeguarding': '2026-04-13',
    'bls-first-aid': '',
    'food-hygiene': '',
    'mca-dols': '',
    'gdpr': '',
    'bowel-care': '',
    'diabetes': '',
    'dysphagia': '',
    'health-safety': ''
  }
};

