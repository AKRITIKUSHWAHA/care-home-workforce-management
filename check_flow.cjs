const fs = require('fs');

const menus = {
  Admin:      'src/config/sidebar/adminMenu.js',
  HR:         'src/config/sidebar/hrMenu.js',
  Compliance: 'src/config/sidebar/complianceMenu.js',
  Manager:    'src/config/sidebar/managerMenu.js',
  Employee:   'src/config/sidebar/employeeMenu.js',
};

const routes = {
  Admin:      ['dashboard','employees','verification-audit-log','rota','shift-planning','day-notes','attendance','leave','payroll','reports','visitor-tablet','audits','observation','competency','settings','document-templates','care-planning','policies-training','incidents'],
  HR:         ['dashboard','employees','leave','payroll','rota','shift-planning','day-notes','attendance','competency','settings','document-templates','care-planning','policies-training','incidents'],
  Compliance: ['dashboard','audits','rota','shift-planning','day-notes','attendance','observation','competency','settings','care-planning','policies-training','incidents'],
  Manager:    ['dashboard','employees','document-verification','rota','shift-planning','day-notes','attendance','leave','payroll','audits','observation','competency','settings','care-planning','policies-training','incidents'],
  Employee:   ['dashboard','employee-dashboard','rota','shift-planning','day-notes','attendance','my-documents','leave','payroll','observation','competency','settings','care-planning','policies-training','incidents'],
};

let allOk = true;
Object.keys(menus).forEach(role => {
  const content = fs.readFileSync(menus[role], 'utf8');
  const ids = [];
  const regex = /id:\s*'([^']+)'/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    ids.push(m[1]);
  }
  const routeIds = routes[role];
  const broken = ids.filter(id => {
    if (id === 'rota-group') return false;
    return !routeIds.includes(id);
  });
  if (broken.length > 0) {
    console.log('BROKEN in ' + role + ': ' + broken.join(', '));
    allOk = false;
  } else {
    console.log('OK: ' + role + ' (' + ids.length + ' items, all routed)');
  }
});

// Also check for document-templates vs my-documents in Employee
const empContent = fs.readFileSync('src/config/sidebar/employeeMenu.js', 'utf8');
if (empContent.includes("'document-templates'")) {
  console.log('WARNING: Employee sidebar uses document-templates but route is my-documents');
}

if (allOk) console.log('\nRESULT: ALL sidebar links have working routes. Flow is correct.');
else console.log('\nRESULT: Some links are broken - fix required.');
