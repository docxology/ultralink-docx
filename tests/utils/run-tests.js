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
  cyan: '\x1b[36m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m'
};

// Test suites to run in order
const testSuites = [
  { 
    name: 'Performance Tests',
    command: 'npx jest tests/performance',
    required: false
  },
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
  }
];

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Print a section header
 * @param {string} title - The section title
 */
function printSectionHeader(title) {
  const padding = '='.repeat(Math.max(0, 80 - title.length - 4));
  console.log(`\n${colors.bright}${colors.bgBlue}${colors.reset}${colors.bright} ${title} ${colors.dim}${padding}${colors.reset}\n`);
}

/**
 * Print a subsection header
 * @param {string} title - The subsection title
 */
function printSubsectionHeader(title) {
  console.log(`\n${colors.bright}${colors.cyan}▶ ${title}${colors.reset}\n`);
}

// Header
printSectionHeader('UltraLink Test Suite');

// Display test plan
printSubsectionHeader('Test Plan');
testSuites.forEach((suite, index) => {
  const required = suite.required 
    ? `${colors.green}(required)${colors.reset}` 
    : `${colors.yellow}(optional)${colors.reset}`;
  console.log(`   ${colors.bright}${index + 1}.${colors.reset} ${suite.name} ${required}`);
});

console.log('\n');

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
  
  printSectionHeader(`Running ${suite.name}`);
  
  try {
    const output = execSync(suite.command, { encoding: 'utf-8' });
    suiteReport.output = output;
    suiteReport.status = 'passed';
    suiteReport.exitCode = 0;
    testReport.summary.passed++;
    
    console.log(output);
    
    // Success message
    console.log(`\n${colors.bgGreen}${colors.bright} PASS ${colors.reset} ${colors.green}${suite.name} completed successfully${colors.reset}`);
  } catch (error) {
    suiteReport.status = 'failed';
    suiteReport.output = error.stdout || '';
    suiteReport.error = error.message;
    suiteReport.exitCode = error.status;
    testReport.summary.failed++;
    
    console.log(error.stdout || '');
    
    // Failure message
    console.log(`\n${colors.bgRed}${colors.bright} FAIL ${colors.reset} ${colors.red}${suite.name} failed with exit code ${error.status}${colors.reset}`);
    console.log(`   ${colors.dim}Test command:${colors.reset} ${suite.command}`);
    console.log(`   ${colors.red}Error details:${colors.reset} ${error.message}\n`);
    
    failedSuites.push(suite.name);
    
    if (suite.required) {
      allPassed = false;
    }
  }
  
  testReport.testSuites.push(suiteReport);
}

// Summary
printSectionHeader('Test Results Summary');

// Calculate summary statistics
const totalSuites = testSuites.length;
const passedSuites = testReport.summary.passed;
const failedSuitesCount = testReport.summary.failed;
const passPercentage = (passedSuites / totalSuites * 100).toFixed(2);

// Print summary table
console.log(`${colors.bright}Test Suites:${colors.reset}      ${passedSuites} passed, ${failedSuitesCount} failed, ${totalSuites} total`);
console.log(`${colors.bright}Pass Percentage:${colors.reset}  ${passPercentage}%`);
console.log(`${colors.bright}Timestamp:${colors.reset}        ${new Date().toISOString()}`);
console.log(`${colors.bright}Node Version:${colors.reset}     ${process.version}`);
console.log('\n');

if (allPassed) {
  console.log(`${colors.green}${colors.bright}✅ All required test suites passed!${colors.reset}\n`);
} else {
  console.log(`${colors.red}${colors.bright}❌ One or more required test suites failed: ${failedSuites.join(', ')}${colors.reset}\n`);
  
  // Save failure report
  const reportPath = path.join(outputDir, 'test-failures.json');
  fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2));
  console.log(`${colors.yellow}📝 Failure report saved to ${reportPath}${colors.reset}`);
  
  // Exit with error code
  process.exit(1);
}

// Save complete test report regardless of pass/fail status
const fullReportPath = path.join(outputDir, `test-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(fullReportPath, JSON.stringify(testReport, null, 2));

// All good!
process.exit(0); 