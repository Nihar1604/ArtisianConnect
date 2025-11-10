const fs = require('fs');
const path = require('path');

const routeFiles = [
  './routes/api/user.js',
  './routes/api/cart.js',
  './routes/api/products.js',
  './routes/api/orders.js'
];

routeFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check for problematic patterns
  const problematicPatterns = [
    /router\.(get|post|put|delete|patch)\(['"]\/:\s*['"]/g,
    /router\.(get|post|put|delete|patch)\(['"].*:['"](?!\))/g,
    /router\.(get|post|put|delete|patch)\(['"][^'")]*:\s*\/['"]/g
  ];
  
  let hasIssue = false;
  problematicPatterns.forEach((pattern, idx) => {
    if (pattern.test(content)) {
      console.log(`⚠️  Found potential issue in ${file} (pattern ${idx + 1})`);
      hasIssue = true;
    }
  });
  
  if (!hasIssue) {
    console.log(`✅ ${file} looks clean`);
  }
});