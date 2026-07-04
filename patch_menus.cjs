const fs = require('fs');
const files = [
  'src/config/sidebar/adminMenu.js',
  'src/config/sidebar/hrMenu.js',
  'src/config/sidebar/managerMenu.js',
  'src/config/sidebar/complianceMenu.js',
  'src/config/sidebar/employeeMenu.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('HeartPulse')) {
    content = content.replace(/}\s*from\s*'lucide-react';/, '  HeartPulse\n} from \'lucide-react\';');
  }
  if (!content.includes('care-planning')) {
    content = content.replace(/];\s*$/, '  ,{ id: \'care-planning\', label: \'Care Planning\', icon: HeartPulse }\n];\n');
  }
  fs.writeFileSync(file, content);
});
