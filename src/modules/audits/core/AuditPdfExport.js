// Real client-side CSV serialization and PDF generation engines for CQC Audits

export const exportAuditToCsv = (audit, questions) => {
  if (!audit) return;
  
  // Define columns
  const headers = ["Audit ID", "Audit Category", "Target Pass Score", "Completed Score", "Auditor Name", "Auditor Role", "Scheduled Date", "Date Completed", "Status"];
  
  // Extract detail values
  const scoreText = audit.score !== null ? `${audit.score}%` : "Pending";
  const auditor = audit.details?.signatures?.auditor || "Assigned Officer";
  const auditorRole = audit.details?.signatures?.auditorRole || "Compliance Team";
  const dateComp = audit.lastCompleted || audit.scheduledDate || "N/A";
  
  const metaRow = [
    `"${audit.id || ''}"`,
    `"${audit.type || ''}"`,
    `"90%"`,
    `"${scoreText}"`,
    `"${auditor}"`,
    `"${auditorRole}"`,
    `"${audit.scheduledDate || ''}"`,
    `"${dateComp}"`,
    `"${audit.status || ''}"`
  ];
  
  // Compile CSV String
  let csvContent = "\uFEFF"; // Add Byte Order Mark for Excel UTF-8 compatibility
  csvContent += headers.join(",") + "\n";
  csvContent += metaRow.join(",") + "\n\n";
  
  if (questions && Array.isArray(questions)) {
    csvContent += "Question ID,CQC Standard Question,Status (YES/NO/NA),Comments/Findings\n";
    questions.forEach(q => {
      const qText = (q.question || "").replace(/"/g, '""');
      const qStatus = q.status || "YES";
      const qNotes = (q.notes || "").replace(/"/g, '""');
      csvContent += `"${q.id}","${qText}","${qStatus}","${qNotes}"\n`;
    });
  }

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `CQC_Audit_Report_${audit.id || 'export'}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerPrintLayout = () => {
  window.print();
};

// Dynamic PDF downloader using html2pdf.js bundle with CSS print fallbacks
export const downloadAuditAsPdf = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    const html2pdf = await loadHtml2Pdf();
    const opt = {
      margin:       10,
      filename:     filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  } catch (err) {
    console.error(err);
    // Fallback to native print
    window.print();
  }
};
