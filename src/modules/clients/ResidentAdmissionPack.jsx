import React, { useState } from 'react';
import { 
  Printer, 
  Mail, 
  FileText, 
  Check, 
  X, 
  Send, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export default function ResidentAdmissionPack() {
  const [formData, setFormData] = useState({
    residentName: 'Eleanor Vance',
    previousAddress: '42 Meadow Lane, Birmingham, B12 8QP',
    nokName: 'Clive Vance',
    nokEmail: 'clive.vance@example.com',
    admissionDate: '2026-07-15',
    weeklyRate: '1250',
    fundingType: 'Private',
    selectedTemplate: 'agreement' // 'agreement', 'fees', 'consent'
  });

  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle', 'sending', 'sent'
  const [customEmailBody, setCustomEmailBody] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Robust printing helper
  const handlePrint = () => {
    const printContent = document.getElementById('contract-preview-document').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>AS Care Resident Admission Pack</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; font-size: 14px; }');
    printWindow.document.write('h1 { font-size: 22px; text-transform: uppercase; border-bottom: 2px solid #333; pb: 10px; margin-bottom: 20px; }');
    printWindow.document.write('h2 { font-size: 16px; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }');
    printWindow.document.write('.meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; }');
    printWindow.document.write('.meta-table td { padding: 8px 12px; border: 1px solid #ddd; }');
    printWindow.document.write('.meta-table td.label { font-weight: bold; background-color: #f9f9f9; width: 30%; }');
    printWindow.document.write('.signature-block { margin-top: 50px; display: flex; justify-content: space-between; }');
    printWindow.document.write('.sig-box { width: 45%; border-top: 1px solid #000; padding-top: 10px; text-align: center; font-size: 12px; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleOpenEmail = () => {
    const templateBody = `Dear ${formData.nokName},\n\nPlease find attached the Resident Admission Pack for ${formData.residentName}, scheduled for admission to AS Care Home on ${formData.admissionDate}.\n\nContract Details Summary:\n- Base Fee: £${formData.weeklyRate} per week\n- Funding: ${formData.fundingType}\n- Resident Address: ${formData.previousAddress}\n\nPlease review and e-sign the attached document at your earliest convenience.\n\nBest Regards,\nAS Care Home Management`;
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-850 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Resident Admission Pack Form</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              Enter the resident and agreement details below to update the contract preview in real-time.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
            {/* Template selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Document Template</label>
              <select
                name="selectedTemplate"
                value={formData.selectedTemplate}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
              >
                <option value="agreement">Resident Placement Agreement</option>
                <option value="fees">Fees & Financial Agreement</option>
                <option value="consent">Consent to Care & MCA Policy</option>
              </select>
            </div>

            {/* Resident Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Resident Full Name</label>
              <input
                type="text"
                name="residentName"
                value={formData.residentName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                placeholder="e.g. Margaret Thatcher"
              />
            </div>

            {/* Previous Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Previous Residence Address</label>
              <input
                type="text"
                name="previousAddress"
                value={formData.previousAddress}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                placeholder="Street address, city, postcode"
              />
            </div>

            {/* NOK Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Next of Kin Name</label>
                <input
                  type="text"
                  name="nokName"
                  value={formData.nokName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Next of Kin Email</label>
                <input
                  type="email"
                  name="nokEmail"
                  value={formData.nokEmail}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Rates & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Weekly Base Rate (£)</label>
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/45 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Funding type */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Funding Tier Category</label>
              <div className="flex gap-2">
                {['Private', 'Local Authority', 'NHS CHC'].map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fundingType: tier }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.fundingType === tier
                        ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/45 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-900'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons footer */}
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
            <p className="font-bold text-slate-800 dark:text-white">Print and Email Workflow</p>
            <p className="leading-relaxed">This form dynamically compiles regulatory placement contracts. Printing will create a physical document layout, while emailing will directly forward an e-signature request to the Next of Kin.</p>
          </div>
        </div>
      </div>

      {/* Document Preview Panel (Right) */}
      <div className="lg:col-span-7">
        <div className="glass-card bg-slate-100 dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-850 h-[680px] flex flex-col">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Document Preview (Live-Compile)</span>
            </span>
            <span className="text-[9px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full uppercase">
              Paper Layout
            </span>
          </div>

          {/* Paper content */}
          <div className="flex-1 overflow-y-auto mt-4 p-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl shadow-inner select-text scrollbar-thin text-xs leading-relaxed space-y-6">
            <div id="contract-preview-document" className="space-y-6">
              {formData.selectedTemplate === 'agreement' && (
                <>
                  <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">AS CARE RESIDENT PLACEMENT AGREEMENT</h1>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Placement Admission Pack & Contract terms</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">1. Placement Parties & Details</h2>
                    <table className="w-full text-left border border-slate-200 dark:border-slate-800 border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <td className="p-2 bg-slate-50 dark:bg-slate-900/60 font-bold w-1/3">Resident Full Name</td>
                          <td className="p-2">{formData.residentName || '[Awaiting input]'}</td>
                        </tr>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <td className="p-2 bg-slate-50 dark:bg-slate-900/60 font-bold">Previous Residence</td>
                          <td className="p-2">{formData.previousAddress || '[Awaiting input]'}</td>
                        </tr>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <td className="p-2 bg-slate-50 dark:bg-slate-900/60 font-bold">Next of Kin Contact</td>
                          <td className="p-2">{formData.nokName || '[Awaiting input]'} ({formData.nokEmail || '[Awaiting input]'})</td>
                        </tr>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <td className="p-2 bg-slate-50 dark:bg-slate-900/60 font-bold">Admission Target Date</td>
                          <td className="p-2">{formData.admissionDate ? new Date(formData.admissionDate).toLocaleDateString() : '[Awaiting input]'}</td>
                        </tr>
                        <tr>
                          <td className="p-2 bg-slate-50 dark:bg-slate-900/60 font-bold">Funding Allocation</td>
                          <td className="p-2">{formData.fundingType} (£{formData.weeklyRate}/week Base Fee)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">2. Placement Terms & Scope</h2>
                    <p>
                      This agreement documents the placement of <strong>{formData.residentName || '[Resident]'}</strong> in AS Care Home. 
                      The resident will receive standard 24-hour residential care services, meals, laundering, and personal assistance as outlined in their personal CQC care plan.
                    </p>
                    <p>
                      The initial placement trial period is set for 4 weeks starting from the admission date of <strong>{formData.admissionDate}</strong>. 
                      Either party may terminate this agreement within the trial period by giving 7 days written notice.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">3. Placement Signatures</h2>
                    <p className="text-[10px] text-slate-400">By signing below, the care provider and next of kin certify agreement to all standard terms.</p>
                    <div className="pt-8 flex justify-between gap-8 text-center text-[10px]">
                      <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                        Authorized Care Home Representative
                      </div>
                      <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                        Resident Next of Kin (Clive Vance)
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.selectedTemplate === 'fees' && (
                <>
                  <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">FEES & FINANCIAL AGREEMENT</h1>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Resident Funding Allocation Contract</p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">1. Rate Allocation Summary</h2>
                    <p>
                      The agreed placement fee for <strong>{formData.residentName || '[Resident]'}</strong> is set at a base rate of 
                      <strong> £{formData.weeklyRate}</strong> per week.
                    </p>
                    <p>
                      Funding Category: <strong>{formData.fundingType}</strong>. 
                      All fees are invoiced monthly in advance and are due within 14 days of invoice issue date.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">2. Fee Increase & Additional Costs</h2>
                    <p>
                      Fees are reviewed annually in April in response to statutory staff minimum wage updates and inflation. 
                      A minimum of 28 days written notice will be provided before any fee adjustments are made.
                    </p>
                    <p>
                      This base fee excludes personal items such as toiletries, hairdressing services, dry cleaning, and private taxi escorts.
                    </p>
                  </div>

                  <div className="pt-8 flex justify-between gap-8 text-center text-[10px]">
                    <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                      Representative Signature
                    </div>
                    <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                      Payer Next of Kin Signature
                    </div>
                  </div>
                </>
              )}

              {formData.selectedTemplate === 'consent' && (
                <>
                  <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">CONSENT TO CARE & TREATMENT</h1>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Mental Capacity Act (MCA) Agreement</p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">1. Scope of Consent</h2>
                    <p>
                      This document records consent for care routines provided to <strong>{formData.residentName || '[Resident]'}</strong>, 
                      including clinical observations, personal grooming care, and standard medical room treatments.
                    </p>
                    <p>
                      In the event of fluctuating mental capacity, care assessments will be conducted in accordance with the Mental Capacity Act 2005. 
                      Best interest decisions will involve Next of Kin <strong>{formData.nokName || '[NOK Name]'}</strong>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-extrabold text-sm border-b pb-1 dark:border-slate-800">2. Emergency Medical Consent</h2>
                    <p>
                      In emergency situations where contact with the next of kin is unavailable, AS Care staff are authorized to request ambulance transport and share medical history details with NHS clinical staff.
                    </p>
                  </div>

                  <div className="pt-8 flex justify-between gap-8 text-center text-[10px]">
                    <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                      Care Assessor Signature
                    </div>
                    <div className="w-[45%] border-t border-slate-900 pt-2 font-bold text-slate-500">
                      Resident or NOK Consent Signature
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Email Drawer Panel */}
      {showEmailPanel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-end z-50 animate-fade-in">
          <div className="glass-card bg-white dark:bg-slate-950 rounded-l-3xl w-full max-w-md h-full border-l border-slate-200 dark:border-slate-850 shadow-2xl flex flex-col animate-slide-left p-6">
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
