const fs = require('fs');

const file = 'c:/Kiaan/rota manegnment/src/routes/index.jsx';
let content = fs.readFileSync(file, 'utf8');

const imports = `
// --- NEW FEATURES IMPORTS ---
import ECMLive from '../modules/operations/ECMLive';
import QRSecure from '../modules/operations/QRSecure';
import Messages from '../modules/operations/Messages';
import ClientRegister from '../modules/clients/ClientRegister';
import ClientSchedules from '../modules/clients/ClientSchedules';
import MARChart from '../modules/clients/MARChart';
import CareNotes from '../modules/clients/CareNotes';
import ClinicalObservations from '../modules/clients/ClinicalObservations';
import LegalCapacity from '../modules/clients/LegalCapacity';
import EndOfLife from '../modules/clients/EndOfLife';
import TrainingMatrix from '../modules/workforce/TrainingMatrix';
import Supervisions from '../modules/workforce/Supervisions';
import DBSVetting from '../modules/workforce/DBSVetting';
import VisitApproval from '../modules/finance/VisitApproval';
import Invoices from '../modules/finance/Invoices';
import Contracts from '../modules/finance/Contracts';
import GovernanceHub from '../modules/compliance/GovernanceHub';
import ComplianceBoard from '../modules/compliance/ComplianceBoard';
import StatutoryNotifications from '../modules/compliance/StatutoryNotifications';
import SafeguardingHub from '../modules/safeguarding/SafeguardingHub';
import Concerns from '../modules/safeguarding/Concerns';
import Complaints from '../modules/safeguarding/Complaints';
`;

if (!content.includes('ECMLive')) {
  content = content.replace('export const AppRouter', imports + '\nexport const AppRouter');
}

const newCases = `
      case 'ecm-live': return <ECMLive />;
      case 'qr-secure': return <QRSecure />;
      case 'messages': return <Messages />;
      case 'client-register': return <ClientRegister />;
      case 'client-schedules': return <ClientSchedules />;
      case 'mar-chart': return <MARChart />;
      case 'care-notes': return <CareNotes />;
      case 'clinical-observations': return <ClinicalObservations />;
      case 'legal-capacity': return <LegalCapacity />;
      case 'end-of-life': return <EndOfLife />;
      case 'training-matrix': return <TrainingMatrix />;
      case 'supervisions': return <Supervisions />;
      case 'dbs-vetting': return <DBSVetting />;
      case 'visit-approval': return <VisitApproval />;
      case 'invoices': return <Invoices />;
      case 'contracts': return <Contracts />;
      case 'governance-hub': return <GovernanceHub />;
      case 'compliance-board': return <ComplianceBoard />;
      case 'statutory-notifications': return <StatutoryNotifications />;
      case 'safeguarding': return <SafeguardingHub />;
      case 'concerns': return <Concerns />;
      case 'complaints': return <Complaints />;
`;

// Inject into all switches before 'default:'
content = content.replace(/default:/g, newCases + '      default:');

fs.writeFileSync(file, content);
console.log('Updated index.jsx successfully');
