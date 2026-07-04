const fs = require('fs');
let c = fs.readFileSync('buildRemainingUIs.cjs', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('buildRemainingUIs.cjs', c);
