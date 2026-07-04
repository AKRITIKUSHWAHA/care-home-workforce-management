const fs = require('fs');
const path = require('path');

const menusDir = path.join(__dirname, 'src', 'config', 'sidebar');
const files = [
  'adminMenu.js',
  'hrMenu.js',
  'managerMenu.js',
  'complianceMenu.js',
  'employeeMenu.js'
];

files.forEach(file => {
  const filePath = path.join(menusDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add HeartPulse to lucide-react imports if it's not there
  if (!content.includes('HeartPulse')) {
    content = content.replace(/}\s*from\s*'lucide-react';/, ',\n  HeartPulse\n} from \'lucide-react\';');
  }

  // Add the menu item if it's not there
  if (!content.includes('care-planning')) {
    content = content.replace(/];/, '  ,{ id: \'care-planning\', label: \'Care Planning\', icon: HeartPulse }\n];');
  }

  fs.writeFileSync(filePath, content);
  console.log('Patched', file);
});
