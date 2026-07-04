const fs = require('fs');
const path = require('path');

const files = [
  'src/modules/operations/ECMLive.jsx',
  'src/modules/operations/QRSecure.jsx',
  'src/modules/operations/Messages.jsx',
  'src/modules/clients/ClientRegister.jsx',
  'src/modules/clients/ClientSchedules.jsx',
  'src/modules/clients/MARChart.jsx',
  'src/modules/clients/CareNotes.jsx',
  'src/modules/clients/ClinicalObservations.jsx',
  'src/modules/clients/LegalCapacity.jsx',
  'src/modules/clients/EndOfLife.jsx',
  'src/modules/workforce/TrainingMatrix.jsx',
  'src/modules/workforce/Supervisions.jsx',
  'src/modules/workforce/DBSVetting.jsx',
  'src/modules/finance/VisitApproval.jsx',
  'src/modules/finance/Invoices.jsx',
  'src/modules/finance/Contracts.jsx',
  'src/modules/compliance/GovernanceHub.jsx',
  'src/modules/compliance/ComplianceBoard.jsx',
  'src/modules/compliance/StatutoryNotifications.jsx',
  'src/modules/safeguarding/SafeguardingHub.jsx',
  'src/modules/safeguarding/Concerns.jsx',
  'src/modules/safeguarding/Complaints.jsx'
];

files.forEach(file => {
  const absolutePath = path.join('c:/Kiaan/rota manegnment', file);
  const dir = path.dirname(absolutePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = path.basename(file, '.jsx');
  
  const content = `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">${componentName}</h2>
      <p className="text-slate-600">This module is under construction. It will include features from the xCare reference.</p>
    </div>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(absolutePath, content);
});

console.log('Created ' + files.length + ' placeholder components.');
