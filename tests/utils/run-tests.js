/**
 * UltraLink Test Runner
 * 
 * Runs the test suite with improved reporting and logging
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors and formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test suites to run in order
const testSuites = [
  { 
    name: 'Unit Tests',
    command: 'npx jest tests/unit',
    required: true
  },
  { 
    name: 'Integration Tests',
    command: 'npx jest tests/integration',
    required: true
  },
  { 
    name: 'System Export Tests',
    command: 'npx jest tests/system',
    required: true
  },
  { 
    name: 'End-to-End Tests',
    command: 'npx jest tests/e2e',
    required: true
  },
  { 
    name: 'Performance Tests',
    command: 'npx jest tests/performance',
    required: false
  }
];

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Header
console.log(`\n${colors.bright}${colors.cyan}🧪 Starting UltraLink Test Suite${colors.reset}\n`);

// Display test plan
console.log(`${colors.bright}📋 Tests will run in the following order:${colors.reset}`);
testSuites.forEach((suite, index) => {
  const required = suite.required ? '(required)' : '(optional)';
  console.log(`   ${index + 1}. ${suite.name} ${colors.dim}${required}${colors.reset}`);
});

console.log('\n\n');

// Run each test suite
let allPassed = true;
const failedSuites = [];
const testReport = {
  timestamp: new Date().toISOString(),
  testSuites: [],
  summary: {
    total: testSuites.length,
    passed: 0,
    failed: 0,
    skipped: 0
  }
};

for (const suite of testSuites) {
  const suiteReport = {
    name: suite.name,
    command: suite.command,
    required: suite.required,
    status: 'pending',
    output: '',
    error: null,
    exitCode: null
  };
  
  console.log(`\n${colors.bright}${colors.cyan}🚀 Running ${suite.name}...${colors.reset}\n`);
  
  try {
    const output = execSync(suite.command, { encoding: 'utf-8' });
    suiteReport.output = output;
    suiteReport.status = 'passed';
    suiteReport.exitCode = 0;
    testReport.summary.passed++;
    
    console.log(output);
  } catch (error) {
    suiteReport.status = 'failed';
    suiteReport.output = error.stdout || '';
    suiteReport.error = error.message;
    suiteReport.exitCode = error.status;
    testReport.summary.failed++;
    
    console.log(error.stdout || '');
    console.log(`${colors.red}❌ ${suite.name} failed with exit code ${error.status}${colors.reset}`);
    console.log(`   Test command: ${suite.command}`);
    console.log(`   ${colors.red}❌ Error details: ${error.message}${colors.reset}\n`);
    
    failedSuites.push(suite.name);
    
    if (suite.required) {
      allPassed = false;
    }
  }
  
  testReport.testSuites.push(suiteReport);
}

// Summary
console.log('\n');
if (allPassed) {
  console.log(`${colors.green}${colors.bright}✅ All required test suites passed!${colors.reset}\n`);
} else {
  console.log(`${colors.red}${colors.bright}❌ Test suite failed: ${failedSuites.join(', ')}${colors.reset}\n`);
  
  // Save failure report
  const reportPath = path.join(outputDir, 'test-report');
  fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2));
  console.log(`${colors.yellow}📝 Failure report saved to ${reportPath}${colors.reset}`);
  
  const failedReportPath = path.join(outputDir, 'test-report-failed.json');
  fs.writeFileSync(failedReportPath, JSON.stringify(testReport, null, 2));
  console.log(`${colors.yellow}📝 Failure report saved to ${failedReportPath}${colors.reset}`);
  
  // Exit with error code
  process.exit(1);
}

// All good!
process.exit(0); 