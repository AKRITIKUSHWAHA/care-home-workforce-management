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
  
  // It got completely corrupted, let's just restore them to a known good state based on typical structure.
  // Actually, I'll just write a script that completely rebuilds them from scratch to be 100% sure.
});
