import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Mail, 
  FileText, 
  Check, 
  X, 
  Send, 
  ArrowRight,
  Sparkles,
  Info,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Shield,
  Heart,
  Eye,
  Award
} from 'lucide-react';

const ADMISSION_ITEMS = [
  { id: 'agreement', label: 'Resident Placement Agreement' },
  { id: 'fees', label: 'Fees & Funding Agreement' },
  { id: 'profile', label: 'Resident Profile Completed' },
  { id: 'carePlan', label: 'CQC Care Plan Completed' },
  { id: 'riskAssessments', label: 'Clinical Risk Assessments' },
  { id: 'fundingConfirmed', label: 'Funding Approval Confirmed' },
  { id: 'lpaDetails', label: 'LPA Documentation Verified' },
  { id: 'emergencyContacts', label: 'Emergency Contacts Logged' },
  { id: 'propertyInventory', label: 'Property Inventory Complete' },
  { id: 'jewelleryRegister', label: 'Jewellery Register Updated' },
  { id: 'safeContents', label: 'Safe Contents Registered' },
  { id: 'consentForms', label: 'Consent Forms Completed' },
  { id: 'gpRegistration', label: 'GP Registration Completed' },
  { id: 'pharmacyDetails', label: 'Pharmacy & MAR Setup Done' },
  { id: 'roomPrepared', label: 'Bedroom Inspected & Prepared' },
  { id: 'welcomePack', label: 'Welcome Pack Issued' }
];

const DOCUMENT_ITEMS = [
  'Resident Agreement', 'Fees Agreement', 'Funding Information', 'Top-Up Agreement',
  'Resident Profile', 'Pre-Admission Assessment', 'Care Plan', 'Risk Assessments',
  'General Consent', 'Data Sharing Consent', 'GP Consent', 'Hospital Consent', 'Pharmacy Consent',
  'Family Communication', 'CCTV Consent (communal areas)', 'Photography Consent', 'Video Consent',
  'Website Consent', 'Newsletter Consent', 'Social Media Consent', 'Telephone Directory',
  'Emergency Contacts', 'LPA Documentation', 'Property Inventory', 'Clothing Inventory',
  'Jewellery Register', 'Safe Contents Register', 'Resident Finance Record', 'Property Returned Form'
];

const CONSENT_AREAS = [
  'Care and treatment', 'Emergency medical treatment', 'GP information sharing', 
  'Hospital information sharing', 'Pharmacy information sharing', 'District Nurse', 
  'Community healthcare', 'Local Authority', 'Family communication', 
  'Next of Kin communication', 'LPA communication', 'Photography (care records)', 
  'Photography (family updates)', 'Website photographs', 'Newsletter photographs', 
  'Social media photographs', 'Video recording', 'CCTV', 'Telephone directory', 
  'Activities', 'Hairdresser', 'Chiropody', 'Religious support', 'Email', 'SMS'
];

const BEDROOM_INVENTORY_ITEMS = [
  'Bed', 'Mattress', 'Mattress Cover', 'Pillow', 'Duvet', 'Wardrobe', 
  'Chest of Drawers', 'Bedside Cabinet', 'Chair', 'Television', 'Call Bell', 
  'Curtains', 'Blinds', 'Light Fittings', 'Radiator', 'Smoke Detector', 
  'Fire Door', 'Room Key', 'Window Restrictor', 'Flooring'
];

const PROPERTY_RETURNED_ITEMS = [
  'Clothing', 'Jewellery', 'Safe Contents', 'Personal Property', 'Mobility Equipment',
  'Wheelchair', 'Zimmer Frame', 'Walking Stick', 'Glasses', 'Dentures',
  'Hearing Aid', 'Medication', 'Money', 'Bank Cards', 'Keys', 'Documentation'
];

export default function ResidentAdmissionPack() {
  const [activeSubTab, setActiveSubTab] = useState('welcome'); // welcome, checklists, consent, property, signatures
  const [formData, setFormData] = useState({
    residentName: 'Arthur Pendelton',
    previousAddress: 'Room 205, Main Block, Birmingham Care Home',
    nokName: 'Sonya Pendelton',
    nokEmail: 'sonya.pendelton@example.com',
    nokPhone: '07700 900222',
    nokRelation: 'Daughter (Health LPA)',
    admissionDate: '2026-07-15',
    gpName: 'Dr. Hancock',
    gpSurgery: 'Tillingham Medical Centre',
    pharmacyName: 'Boots Pharmacy Care Team',
    weeklyRate: '1350',
    fundingType: 'Private',
    managerName: 'Sarah Jenkins',
    staffName: 'Abhina Carer',
    witnessName: 'James Carter (Team Leader)',
    representativeName: 'Sonya Pendelton',
    signDate: new Date().toISOString().split('T')[0],
    staffSignDate: new Date().toISOString().split('T')[0],
    witnessSignDate: new Date().toISOString().split('T')[0],
    repSignDate: new Date().toISOString().split('T')[0]
  });

  // Checklist state
  const [admissionChecklist, setAdmissionChecklist] = useState(
    ADMISSION_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );
  
  const [documentChecklist, setDocumentChecklist] = useState(
    DOCUMENT_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {})
  );

  // Consent Form responses
  const [consentResponses, setConsentResponses] = useState(
    CONSENT_AREAS.reduce((acc, item) => ({ ...acc, [item]: { response: 'Yes', comments: '' } }), {})
  );

  // Bedroom Property Inventory
  const [bedroomInventory, setBedroomInventory] = useState(
    BEDROOM_INVENTORY_ITEMS.reduce((acc, item) => ({ ...acc, [item]: { present: true, comments: 'Good condition' } }), {})
  );

  // Registers
  const [jewelleryRegister, setJewelleryRegister] = useState([
    { id: 1, description: 'Gold Wedding Band', qty: '1', condition: 'Worn, engraved', dateIn: '2026-07-15', dateOut: '' },
    { id: 2, description: 'Silver Pocket Watch', qty: '1', condition: 'Slight scratches', dateIn: '2026-07-15', dateOut: '' }
  ]);
  const [clothingRegister, setClothingRegister] = useState([
    { id: 1, description: 'Blue Knit Cardigan', qty: '2', condition: 'Good', dateIn: '2026-07-15', dateOut: '' },
    { id: 2, description: 'Wool Trousers', qty: '4', condition: 'Good', dateIn: '2026-07-15', dateOut: '' }
  ]);
  const [propertyRegister, setPropertyRegister] = useState([
    { id: 1, description: 'Sony Radio Player', qty: '1', condition: 'Functional', dateIn: '2026-07-15', dateOut: '' },
    { id: 2, description: 'Framed Family Photos', qty: '3', condition: 'Intact', dateIn: '2026-07-15', dateOut: '' }
  ]);
  const [safeContentsRegister, setSafeContentsRegister] = useState([
    { id: 1, description: 'LPA Health Certificate Copied', qty: '1', condition: 'Paper copy', dateIn: '2026-07-15', dateOut: '' },
    { id: 2, description: 'Emergency Cash Fund (£200)', qty: '1', condition: 'Sealed env', dateIn: '2026-07-15', dateOut: '' }
  ]);

  // Property Returned
  const [propertyReturned, setPropertyReturned] = useState(
    PROPERTY_RETURNED_ITEMS.reduce((acc, item) => ({ ...acc, [item]: { returned: false, comments: '' } }), {})
  );

  // Declaration checkboxes
  const [declarations, setDeclarations] = useState({
    readAndUnderstood: true,
    cctvPolicyExplained: true,
    dataConsentConfirmed: true,
    welcomePackIssued: true
  });

  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [customEmailBody, setCustomEmailBody] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleAdmissionItem = (id) => {
    setAdmissionChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleDocumentItem = (item) => {
    setDocumentChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleConsentResponseChange = (item, val) => {
    setConsentResponses(prev => ({
      ...prev,
      [item]: { ...prev[item], response: val }
    }));
  };

  const handleConsentCommentChange = (item, val) => {
    setConsentResponses(prev => ({
      ...prev,
      [item]: { ...prev[item], comments: val }
    }));
  };

  const handleBedroomInventoryToggle = (item) => {
    setBedroomInventory(prev => ({
      ...prev,
      [item]: { ...prev[item], present: !prev[item].present }
    }));
  };

  const handleBedroomInventoryComment = (item, val) => {
    setBedroomInventory(prev => ({
      ...prev,
      [item]: { ...prev[item], comments: val }
    }));
  };

  const handlePropertyReturnedToggle = (item) => {
    setPropertyReturned(prev => ({
      ...prev,
      [item]: { ...prev[item], returned: !prev[item].returned }
    }));
  };

  const handlePropertyReturnedComment = (item, val) => {
    setPropertyReturned(prev => ({
      ...prev,
      [item]: { ...prev[item], comments: val }
    }));
  };

  // Dynamic Register Helpers
  const addRegisterRow = (type) => {
    const newRow = { id: Date.now(), description: '', qty: '1', condition: 'Good', dateIn: formData.admissionDate, dateOut: '' };
    if (type === 'jewellery') setJewelleryRegister(prev => [...prev, newRow]);
    if (type === 'clothing') setClothingRegister(prev => [...prev, newRow]);
    if (type === 'property') setPropertyRegister(prev => [...prev, newRow]);
    if (type === 'safe') setSafeContentsRegister(prev => [...prev, newRow]);
  };

  const removeRegisterRow = (type, id) => {
    if (type === 'jewellery') setJewelleryRegister(prev => prev.filter(r => r.id !== id));
    if (type === 'clothing') setClothingRegister(prev => prev.filter(r => r.id !== id));
    if (type === 'property') setPropertyRegister(prev => prev.filter(r => r.id !== id));
    if (type === 'safe') setSafeContentsRegister(prev => prev.filter(r => r.id !== id));
  };

  const handleRegisterChange = (type, id, field, val) => {
    const update = (prev) => prev.map(r => r.id === id ? { ...r, [field]: val } : r);
    if (type === 'jewellery') setJewelleryRegister(update);
    if (type === 'clothing') setClothingRegister(update);
    if (type === 'property') setPropertyRegister(update);
    if (type === 'safe') setSafeContentsRegister(update);
  };

  // Robust printing helper
  const handlePrint = () => {
    const printContent = document.getElementById('contract-preview-document').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Swan Care Home Resident Admission Pack</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 12px; }
      h1 { font-size: 20px; font-weight: 850; color: #0f172a; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 20px; text-align: center; }
      h2 { font-size: 14px; font-weight: 700; color: #1e3a8a; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
      h3 { font-size: 12px; font-weight: 700; margin-top: 15px; color: #334155; }
      p { margin: 8px 0; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left; }
      th { background-color: #f8fafc; font-weight: bold; font-size: 11px; }
      .badge-yes { color: #15803d; font-weight: bold; }
      .badge-no { color: #b91c1c; font-weight: bold; }
      .badge-na { color: #64748b; font-weight: bold; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .signature-block { margin-top: 40px; page-break-inside: avoid; }
      .sig-row { display: flex; justify-content: space-between; margin-top: 25px; }
      .sig-col { width: 45%; border-top: 1px solid #000; padding-top: 5px; font-size: 10px; text-align: center; }
      .page-break { page-break-after: always; }
      .info-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 10px; margin: 15px 0; font-style: italic; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleOpenEmail = () => {
    const templateBody = `Dear ${formData.nokName},\n\nPlease find attached the comprehensive digitised Resident Admission Pack for ${formData.residentName}, scheduled for admission to Swan Care Home on ${formData.admissionDate}.\n\nPlacement Contract Details:\n- Weekly Base Fee: £${formData.weeklyRate}\n- Funding Type: ${formData.fundingType}\n- Main Contact Address: ${formData.previousAddress}\n\nWe have prepared all pre-admission documents, data sharing consents, communal area CCTV disclosures, and room checklists. Please review the attached contract details and complete your e-signature verification.\n\nBest Regards,\nSarah Jenkins\nRegistered Manager\nSwan Care Home`;
    setCustomEmailBody(templateBody);
    setShowEmailPanel(true);
    setEmailStatus('idle');
  };

  const handleSendEmail = () => {
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
      setTimeout(() => {
        setShowEmailPanel(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start text-slate-800 dark:text-slate-100">
      
      {/* Input Form Panel (Left) */}
      <div className="xl:col-span-5 space-y-6">
        <div className="glass-card bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-850 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Resident Admission Pack Form</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              Revamped high-fidelity digitization of the Swan Care Home pre-admission templates.
            </p>
          </div>

          {/* Form Section Navigation */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
            {[
              { id: 'welcome', label: 'Welcome & Info' },
              { id: 'checklists', label: 'Checklists' },
              { id: 'consent', label: 'Consents (26)' },
              { id: 'property', label: 'Registers & Room' },
              { id: 'signatures', label: 'Signatures' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* SUB-TAB 1: WELCOME & GENERAL INFO */}
            {activeSubTab === 'welcome' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Resident Full Name</label>
                  <input
                    type="text"
                    name="residentName"
                    value={formData.residentName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Previous Residence / Address</label>
                  <input
                    type="text"
                    name="previousAddress"
                    value={formData.previousAddress}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">NOK Name</label>
                    <input
                      type="text"
                      name="nokName"
                      value={formData.nokName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">NOK Relation</label>
                    <input
                      type="text"
                      name="nokRelation"
                      value={formData.nokRelation}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">NOK Email</label>
                    <input
                      type="email"
                      name="nokEmail"
                      value={formData.nokEmail}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">NOK Phone</label>
                    <input
                      type="text"
                      name="nokPhone"
                      value={formData.nokPhone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">GP Doctor</label>
                    <input
                      type="text"
                      name="gpName"
                      value={formData.gpName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 outline-none font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Weekly Fee (£)</label>
                    <input
                      type="number"
                      name="weeklyRate"
                      value={formData.weeklyRate}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 outline-none font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Admission Date</label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Funding Tier</label>
                  <select
                    name="fundingType"
                    value={formData.fundingType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                  >
                    <option value="Private">Private Funder (Self-funding)</option>
                    <option value="Local Authority">Local Authority (Council Funding)</option>
                    <option value="NHS CHC">NHS Continuing Healthcare (CHC)</option>
                  </select>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: CHECKLISTS */}
            {activeSubTab === 'checklists' && (
              <div className="space-y-5">
                {/* 1. Admission Checklist */}
                <div>
                  <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider mb-2">1. Pre-Admission Check Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {ADMISSION_ITEMS.map(item => (
                      <label key={item.id} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={admissionChecklist[item.id] || false}
                          onChange={() => handleToggleAdmissionItem(item.id)}
                          className="rounded border-slate-350 text-[#2e6559] focus:ring-[#2e6559]"
                        />
                        <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 truncate">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Document Checklist */}
                <div>
                  <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider mb-2">2. Mandatory Admission Document Checklist (28 items)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[220px] overflow-y-auto">
                    {DOCUMENT_ITEMS.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={documentChecklist[item] || false}
                          onChange={() => handleToggleDocumentItem(item)}
                          className="rounded border-slate-350 text-[#2e6559] focus:ring-[#2e6559]"
                        />
                        <span className="text-[10.5px] font-semibold text-slate-655 dark:text-slate-330 truncate">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: CONSENTS */}
            {activeSubTab === 'consent' && (
              <div className="space-y-4">
                <div className="bg-slate-55 p-3 rounded-2xl border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 space-y-1.5 mb-2">
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-wider flex items-center gap-1"><Info className="w-3.5 h-3.5" /> CCTV and Information Sharing</span>
                  <p className="text-[10.5px] leading-relaxed text-slate-500">CCTV operates in communal spaces only (not in private rooms/toilets) for safety. Footage is held securely for 7 days. Personal data is managed under UK GDPR and confidentiality laws.</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider">Specify Resident Consent Areas (26 Items)</h4>
                  
                  {CONSENT_AREAS.map(item => (
                    <div key={item} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-850 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10.5px] font-bold text-slate-805 dark:text-slate-300">{item}</span>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border dark:border-slate-700">
                          {['Yes', 'No', 'N/A'].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleConsentResponseChange(item, opt)}
                              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                                consentResponses[item]?.response === opt
                                  ? opt === 'Yes'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : opt === 'No'
                                    ? 'bg-rose-500 text-white shadow-sm'
                                    : 'bg-slate-500 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Add remarks or restrictions..."
                        value={consentResponses[item]?.comments || ''}
                        onChange={(e) => handleConsentCommentChange(item, e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 outline-none font-semibold text-[10px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: PROPERTY INVENTORIES & REGISTERS */}
            {activeSubTab === 'property' && (
              <div className="space-y-5">
                
                {/* 1. Bedroom Inventory */}
                <div>
                  <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider mb-2">1. Bedroom Property Inventory Checklist (20 Items)</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 max-h-[200px] overflow-y-auto">
                    {BEDROOM_INVENTORY_ITEMS.map(item => (
                      <div key={item} className="flex items-center justify-between gap-4 py-1 border-b border-slate-100 dark:border-slate-800 last:border-none">
                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={bedroomInventory[item]?.present || false}
                            onChange={() => handleBedroomInventoryToggle(item)}
                            className="rounded border-slate-350 text-[#2e6559] focus:ring-[#2e6559]"
                          />
                          <span className="text-[10.5px] font-semibold text-slate-655 dark:text-slate-300">{item}</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Condition comments..."
                          value={bedroomInventory[item]?.comments || ''}
                          onChange={(e) => handleBedroomInventoryComment(item, e.target.value)}
                          className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 outline-none font-semibold text-[10px] w-48 text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Sub-Registers with Dynamic Rows */}
                {['jewellery', 'clothing', 'property', 'safe'].map(regType => {
                  const regLabel = regType === 'jewellery' ? 'Jewellery Register' : regType === 'clothing' ? 'Clothing Register' : regType === 'property' ? 'General Property Register' : 'Safe Contents Register';
                  const list = regType === 'jewellery' ? jewelleryRegister : regType === 'clothing' ? clothingRegister : regType === 'property' ? propertyRegister : safeContentsRegister;
                  
                  return (
                    <div key={regType} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider">{regLabel}</h4>
                        <button
                          type="button"
                          onClick={() => addRegisterRow(regType)}
                          className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        {list.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No records added.</p>
                        ) : (
                          list.map(row => (
                            <div key={row.id} className="flex gap-2 items-center bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                              <input
                                type="text"
                                placeholder="Description"
                                value={row.description}
                                onChange={(e) => handleRegisterChange(regType, row.id, 'description', e.target.value)}
                                className="flex-1 bg-transparent border-b border-slate-150 focus:border-brand-500 text-[10px] font-semibold outline-none py-0.5"
                              />
                              <input
                                type="text"
                                placeholder="Qty"
                                value={row.qty}
                                onChange={(e) => handleRegisterChange(regType, row.id, 'qty', e.target.value)}
                                className="w-12 bg-transparent border-b border-slate-150 focus:border-brand-500 text-[10px] text-center font-semibold outline-none py-0.5"
                              />
                              <input
                                type="text"
                                placeholder="Condition"
                                value={row.condition}
                                onChange={(e) => handleRegisterChange(regType, row.id, 'condition', e.target.value)}
                                className="w-24 bg-transparent border-b border-slate-150 focus:border-brand-500 text-[10px] font-semibold outline-none py-0.5"
                              />
                              <button
                                type="button"
                                onClick={() => removeRegisterRow(regType, row.id)}
                                className="text-red-500 hover:text-red-650 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 3. Property Returned checklist */}
                <div>
                  <h4 className="font-extrabold text-[11px] text-[#2e6559] uppercase tracking-wider mb-2">3. Property Returned Form (16 Items)</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 max-h-[180px] overflow-y-auto">
                    {PROPERTY_RETURNED_ITEMS.map(item => (
                      <div key={item} className="flex items-center justify-between gap-4 py-1 border-b border-slate-100 dark:border-slate-800 last:border-none">
                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={propertyReturned[item]?.returned || false}
                            onChange={() => handlePropertyReturnedToggle(item)}
                            className="rounded border-slate-350 text-[#2e6559] focus:ring-[#2e6559]"
                          />
                          <span className="text-[10.5px] font-semibold text-slate-655 dark:text-slate-300">{item}</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Returned observations / comments..."
                          value={propertyReturned[item]?.comments || ''}
                          onChange={(e) => handlePropertyReturnedComment(item, e.target.value)}
                          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 outline-none font-semibold text-[10px] w-48 text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 5: SIGNATURES & DECLARATIONS */}
            {activeSubTab === 'signatures' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-[11px] text-slate-450 uppercase tracking-wider">Confirm Declarations</h4>
                  {Object.entries(declarations).map(([key, val]) => (
                    <label key={key} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => setDeclarations(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="rounded mt-0.5 border-slate-350 text-[#2e6559] focus:ring-[#2e6559]"
                      />
                      <span className="text-[11px] font-semibold leading-normal text-slate-600 dark:text-slate-300">
                        {key === 'readAndUnderstood' && 'I confirm that I have read, understood, and accept all terms within Pages 1 to 14 of the Resident Admission Pack.'}
                        {key === 'cctvPolicyExplained' && 'I confirm that CCTV policies in communal spaces, retention schedules, and access controls were explained.'}
                        {key === 'dataConsentConfirmed' && 'I agree to the information sharing protocols under the Data Protection Act and UK GDPR requirements.'}
                        {key === 'welcomePackIssued' && 'I acknowledge receipt of the Swan Care Home Welcome Pack and Fees Agreements.'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-[11px] text-slate-450 uppercase tracking-wider">Staff & Representative Validation</h4>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Staff Name</label>
                        <input
                          type="text"
                          name="staffName"
                          value={formData.staffName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Staff Sign Date</label>
                        <input
                          type="date"
                          name="staffSignDate"
                          value={formData.staffSignDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-805 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">NOK/Rep Name</label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Rep Sign Date</label>
                        <input
                          type="date"
                          name="repSignDate"
                          value={formData.repSignDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-805 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Witness Name</label>
                        <input
                          type="text"
                          name="witnessName"
                          value={formData.witnessName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Witness Sign Date</label>
                        <input
                          type="date"
                          name="witnessSignDate"
                          value={formData.witnessSignDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none font-semibold text-xs text-slate-805 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900 transition-all font-extrabold text-xs shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pack</span>
            </button>
            <button
              onClick={handleOpenEmail}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-500 text-white hover:bg-brand-600 transition-all font-extrabold text-xs shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Email NOK</span>
            </button>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-4 bg-brand-50/40 dark:bg-slate-900/40 border border-brand-100/50 dark:border-slate-850 rounded-3xl flex gap-3 text-xs">
          <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
          <div className="space-y-1 font-semibold text-slate-600 dark:text-slate-400">
            <p className="font-bold text-slate-800 dark:text-white">CQC Placement Pack Sync</p>
            <p className="leading-relaxed">This form dynamically compiles all regulatory placements, data sharing preferences, personal property lists, and consent forms for Swan Care Home. E-signature requests can be dispatched to Next of Kin.</p>
          </div>
        </div>
      </div>

      {/* Document Preview Panel (Right) */}
      <div className="xl:col-span-7">
        <div className="glass-card bg-slate-100 dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-850 h-[720px] flex flex-col">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Regulatory Document Output (Swan Care Home)</span>
            </span>
            <span className="text-[9px] font-extrabold bg-slate-250 dark:bg-slate-800 text-slate-600 dark:text-slate-450 px-2.5 py-0.5 rounded-full uppercase font-mono">
              Live Paper Preview
            </span>
          </div>

          {/* Compiled Document Render Container */}
          <div className="flex-1 overflow-y-auto mt-4 p-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl shadow-inner select-text scrollbar-thin text-xs leading-relaxed space-y-6">
            <div id="contract-preview-document" className="space-y-6 select-text text-[11px] leading-relaxed text-[#1e293b] font-sans">
              
              {/* PAGE 1: Welcome & values */}
              <div className="space-y-4">
                <div className="text-center pb-4 border-b-2 border-slate-900">
                  <h1 className="text-lg font-black tracking-tight text-slate-900">AS CARE SERVICES LTD</h1>
                  <h2 className="text-sm font-bold text-slate-700 tracking-wider">SWAN CARE HOME — RESIDENT ADMISSION PACK</h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Welcome and Placements Contract Details</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-[#1e3a8a] text-xs">Dear Resident, Family Member or Representative,</h3>
                  <p>On behalf of everyone at Swan Care Home, we would like to extend a warm welcome.</p>
                  <p>We understand that moving into a care home is an important life event, and our aim is to make this transition as comfortable, reassuring and positive as possible. We are committed to providing a safe, caring and homely environment where every resident is treated with dignity, compassion and respect.</p>
                  <p>At Swan Care Home we recognise that every person is unique. We provide person-centred care that reflects each resident's individual wishes, preferences, cultural background, beliefs and life experiences. Our team works closely with residents, relatives and healthcare professionals to ensure care is tailored to individual needs while promoting independence, choice and wellbeing.</p>
                  <p>Our experienced staff provide 24-hour support in a welcoming environment, encouraging residents to maintain their independence, participate in meaningful activities and enjoy the highest possible quality of life.</p>
                  <p>Kind regards,<br /><strong>Sarah Jenkins</strong><br /><span className="text-slate-400">Registered Manager</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <h4 className="font-bold text-[#1e3a8a] text-[10px] uppercase">Our Values</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[9.5px]">
                      <li>Treat every resident with dignity and respect</li>
                      <li>Provide safe, compassionate person-centred care</li>
                      <li>Respect privacy, individuality and diversity</li>
                      <li>Continuous improvement and listening to feedback</li>
                      <li>Comply with CQC regulations &amp; statutory frameworks</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <h4 className="font-bold text-[#1e3a8a] text-[10px] uppercase">Our Services Included</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[9.5px]">
                      <li>24-hour residential personal care</li>
                      <li>Dementia-friendly care &amp; nutritional support</li>
                      <li>Medication management &amp; GP reviews</li>
                      <li>Laundry, housekeeping &amp; active social groups</li>
                      <li>Regular CQC-aligned welfare reviews</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="page-break" />

              {/* PAGE 2: Checklists */}
              <div className="space-y-4 pt-6">
                <h2 className="text-xs font-extrabold text-[#1e3a8a] border-b pb-1">ADMISSION CHECKLISTS MATRIX</h2>
                
                <h3 className="font-bold text-slate-700">1. Pre-Admission Check Status</h3>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr>
                      <th className="w-3/4">Admission Checkpoint Requirement</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMISSION_ITEMS.map(item => (
                      <tr key={item.id}>
                        <td>{item.label}</td>
                        <td className="text-center">
                          {admissionChecklist[item.id] ? (
                            <span className="badge-yes">COMPLETED</span>
                          ) : (
                            <span className="badge-no">PENDING</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="font-bold text-slate-700">2. Mandatory Admission Document Checklist (28 items)</h3>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr>
                      <th className="w-3/4">Document Template Description</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENT_ITEMS.map(item => (
                      <tr key={item}>
                        <td>{item}</td>
                        <td className="text-center">
                          {documentChecklist[item] ? (
                            <span className="badge-yes">COMPLETED</span>
                          ) : (
                            <span className="badge-no">PENDING</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="page-break" />

              {/* PAGE 3: Comprehensive Consent */}
              <div className="space-y-4 pt-6">
                <h2 className="text-xs font-extrabold text-[#1e3a8a] border-b pb-1">COMPREHENSIVE RESIDENT CONSENT LEDGER</h2>
                <div className="info-box text-[9.5px]">
                  This comprehensive consent form details the clinical permissions, GP sharing agreements, local authority communication preferences, and communal CCTV consents.
                </div>

                <table className="w-full text-[9.5px]">
                  <thead>
                    <tr>
                      <th className="w-1/3">Consent Area / Permission</th>
                      <th className="w-24 text-center">Status Choice</th>
                      <th>Custom Remarks &amp; Restrictions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONSENT_AREAS.map(item => (
                      <tr key={item}>
                        <td className="font-bold">{item}</td>
                        <td className="text-center">
                          {consentResponses[item]?.response === 'Yes' && <span className="badge-yes">YES</span>}
                          {consentResponses[item]?.response === 'No' && <span className="badge-no">NO</span>}
                          {consentResponses[item]?.response === 'N/A' && <span className="badge-na">N/A</span>}
                        </td>
                        <td>{consentResponses[item]?.comments || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-2 border-t text-[9px] text-slate-500">
                  <h4 className="font-bold text-slate-700 uppercase">Communal CCTV &amp; Information Sharing Agreement</h4>
                  <p>Swan Care Home operates CCTV within communal areas (lounge, corridors, entrance) to ensure security and resident safety. CCTV is strictly excluded in bedrooms and private toilet areas. GDPR rules allow sharing of GP/Clinical information with NHS/District Nurses when necessary for safety or treatment.</p>
                </div>
              </div>

              <div className="page-break" />

              {/* PAGE 4: Property registers */}
              <div className="space-y-4 pt-6">
                <h2 className="text-xs font-extrabold text-[#1e3a8a] border-b pb-1">RESIDENT PROPERTY INVENTORY &amp; REGISTERS</h2>
                
                <h3 className="font-bold text-slate-700">1. Bedroom Property Inventory Checklist (20 Items)</h3>
                <table className="w-full text-[9px]">
                  <thead>
                    <tr>
                      <th className="w-1/2">Bedroom Item</th>
                      <th className="text-center">Present</th>
                      <th>Condition / Observations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BEDROOM_INVENTORY_ITEMS.map(item => (
                      <tr key={item}>
                        <td>{item}</td>
                        <td className="text-center font-bold text-[#2e6559]">
                          {bedroomInventory[item]?.present ? '✓' : '✗'}
                        </td>
                        <td>{bedroomInventory[item]?.comments || 'Standard condition'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="font-bold text-slate-700 mt-4">2. Valuable Registers Summary</h3>
                
                {/* Jewellery Register Table */}
                <h4 className="font-bold text-[#1e3a8a] text-[9.5px] uppercase mt-2">Valuable Jewellery Register</h4>
                <table className="w-full text-[9px]">
                  <thead>
                    <tr>
                      <th className="w-1/2">Description of Jewellery Item</th>
                      <th>Qty</th>
                      <th>Recorded Condition</th>
                      <th>Date In</th>
                      <th>Date Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jewelleryRegister.map(r => (
                      <tr key={r.id}>
                        <td>{r.description || '—'}</td>
                        <td>{r.qty}</td>
                        <td>{r.condition}</td>
                        <td>{r.dateIn}</td>
                        <td>{r.dateOut || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Other registers condensed summary */}
                <div className="grid grid-2 gap-4 mt-2">
                  <div>
                    <h4 className="font-bold text-slate-700 text-[9.5px] uppercase">Clothing Register (Items logged: {clothingRegister.length})</h4>
                    <table className="w-full text-[8.5px]">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clothingRegister.map(r => (
                          <tr key={r.id}>
                            <td>{r.description || '—'}</td>
                            <td>{r.qty} ({r.condition})</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-[9.5px] uppercase">General Property &amp; Safe Contents (Items logged: {propertyRegister.length + safeContentsRegister.length})</h4>
                    <table className="w-full text-[8.5px]">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyRegister.map(r => (
                          <tr key={r.id}>
                            <td>{r.description || '—'}</td>
                            <td>General Room ({r.qty})</td>
                          </tr>
                        ))}
                        {safeContentsRegister.map(r => (
                          <tr key={r.id}>
                            <td>{r.description || '—'}</td>
                            <td>Locked Safe ({r.qty})</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Property Returned Form */}
                <h3 className="font-bold text-slate-700 mt-4">3. Property Returned Form Check</h3>
                <table className="w-full text-[9px]">
                  <thead>
                    <tr>
                      <th className="w-1/2">Property Returned Item</th>
                      <th className="text-center">Returned</th>
                      <th>Returned Signature / Observation Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROPERTY_RETURNED_ITEMS.map(item => (
                      <tr key={item}>
                        <td>{item}</td>
                        <td className="text-center font-bold text-red-650">
                          {propertyReturned[item]?.returned ? 'YES' : 'NO / ON FILE'}
                        </td>
                        <td>{propertyReturned[item]?.comments || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="page-break" />

              {/* PAGE 5: Declarations & Signatures */}
              <div className="space-y-6 pt-6">
                <h2 className="text-xs font-extrabold text-[#1e3a8a] border-b pb-1">DECLARATIONS &amp; LEGAL AGREEMENT SIGNATURES</h2>
                
                <div className="space-y-2 text-[9.5px]">
                  <p>By signing below, the resident's Next of Kin/Representative, Care Home Assessor, and Witness confirm that:</p>
                  <ul className="list-decimal pl-4 space-y-1">
                    <li>All details recorded in this Resident Admission Pack (Pages 1 to 14) are correct and have been agreed.</li>
                    <li>The comprehensive consent responses are confirmed and will be synced to the resident's Care Plan.</li>
                    <li>Communal CCTV monitoring and UK GDPR privacy policies were explained and accepted.</li>
                    <li>The bedroom inventory and jewellery registers have been verified as accurate as of the admission date of <strong>{formData.admissionDate}</strong>.</li>
                  </ul>
                </div>

                {/* Signature boxes */}
                <div className="signature-block pt-10 text-[9.5px]">
                  <div className="sig-row">
                    <div className="sig-col">
                      <p><strong>{formData.representativeName || '[Representative]'}</strong></p>
                      <p className="mt-1">Resident Representative / Next of Kin</p>
                      <p className="text-[8.5px] mt-1 text-slate-400">Date: {formData.repSignDate} • e-Signed via AS Care</p>
                    </div>
                    <div className="sig-col">
                      <p><strong>{formData.staffName || '[Staff Nurse]'}</strong></p>
                      <p className="mt-1">Care Home Authorized Representative</p>
                      <p className="text-[8.5px] mt-1 text-slate-400">Date: {formData.staffSignDate} • e-Signed via AS Care</p>
                    </div>
                  </div>
                  <div className="sig-row mt-12">
                    <div className="sig-col">
                      <p><strong>{formData.witnessName || '[Witness Name]'}</strong></p>
                      <p className="mt-1">Witness Signature &amp; Title</p>
                      <p className="text-[8.5px] mt-1 text-slate-400">Date: {formData.witnessSignDate} • e-Signed via AS Care</p>
                    </div>
                    <div className="sig-col">
                      <p><strong>{formData.residentName || '[Resident Name]'}</strong></p>
                      <p className="mt-1">Resident Confirmation Signature</p>
                      <p className="text-[8.5px] mt-1 text-slate-400">Date: {formData.signDate} • Confirmed &amp; Agreed</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Email Drawer Panel */}
      {showEmailPanel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-end z-50 animate-fade-in">
          <div className="glass-card bg-white dark:bg-slate-955 rounded-l-3xl w-full max-w-md h-full border-l border-slate-200 dark:border-slate-850 shadow-2xl flex flex-col animate-slide-left p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-850">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Email Admission Pack</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Send Compiled Document to Next of Kin</p>
              </div>
              <button
                onClick={() => setShowEmailPanel(false)}
                className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email form fields */}
            <div className="flex-1 py-4 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">To</label>
                <input
                  type="email"
                  value={formData.nokEmail}
                  onChange={(e) => setFormData({ ...formData, nokEmail: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={`Resident Admission Pack - ${formData.residentName}`}
                  readOnly
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-slate-500"
                />
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-slate-400 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">Message Body</label>
                <textarea
                  value={customEmailBody}
                  onChange={(e) => setCustomEmailBody(e.target.value)}
                  rows={12}
                  className="w-full flex-1 bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all resize-none font-semibold text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Email send button */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end gap-3">
              <button
                onClick={() => setShowEmailPanel(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 transition-all text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={emailStatus !== 'idle'}
                className={`px-4 py-2.5 rounded-xl text-white shadow-md transition-all text-xs font-bold flex items-center gap-2 ${
                  emailStatus === 'sent'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-brand-500 hover:bg-brand-600'
                }`}
              >
                {emailStatus === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Pack</span>
                  </>
                )}
                {emailStatus === 'sending' && (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching...</span>
                  </>
                )}
                {emailStatus === 'sent' && (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Emailed successfully!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
