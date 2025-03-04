/**
 * Custom Jest Reporter
 * 
 * Enhanced test reporting with:
 * - Color-coded test status 
 * - Grouped test failures
 * - Timing information
 * - Detailed error reporting
 */

class CustomReporter {
  constructor(globalConfig, reporterOptions) {
    this.globalConfig = globalConfig;
    this.options = reporterOptions || {};
    this.totalTestSuites = 0;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.failedTestDetails = [];
    this.startTime = null;
  }

  onRunStart(test) {
    this.startTime = new Date();
    this.totalTestSuites = test.numTotalTestSuites;
    console.log('\n🔍 \x1b[1m\x1b[36mUltraLink Test Suite Starting\x1b[0m\n');
  }

  onTestResult(test, testResult) {
    const testFilePath = testResult.testFilePath;
    const fileName = testFilePath.split('/').pop();
    const relativePath = testFilePath.substring(process.cwd().length + 1);
    
    // Output test file info
    const icon = testResult.numFailingTests > 0 ? '❌' : '✅';
    const statusColor = testResult.numFailingTests > 0 ? '\x1b[31m' : '\x1b[32m';
    console.log(`${icon} ${statusColor}${relativePath}\x1b[0m - ${testResult.numPassingTests}/${testResult.numPassingTests + testResult.numFailingTests} tests passed`);
    
    // Update counters
    this.totalTests += testResult.numPassingTests + testResult.numFailingTests;
    this.passedTests += testResult.numPassingTests;
    this.failedTests += testResult.numFailingTests;
    
    // Collect failed test details for summary
    if (testResult.numFailingTests > 0) {
      const failures = testResult.testResults
        .filter(result => result.status === 'failed')
        .map(result => {
          return {
            title: result.title,
            ancestorTitles: result.ancestorTitles,
            file: relativePath,
            errorMessage: result.failureMessages
          };
        });
      
      this.failedTestDetails.push(...failures);
    }
  }

  onRunComplete(test, results) {
    const endTime = new Date();
    const duration = (endTime - this.startTime) / 1000;
    
    console.log('\n📊 \x1b[1m\x1b[36mTest Summary\x1b[0m');
    console.log(`   Total Test Suites: ${results.numTotalTestSuites}`);
    console.log(`   Total Tests: ${this.totalTests}`);
    console.log(`   Passed: \x1b[32m${this.passedTests}\x1b[0m`);
    console.log(`   Failed: \x1b[31m${this.failedTests}\x1b[0m`);
    console.log(`   Time: ${duration.toFixed(2)}s\n`);
    
    // Print failed test details
    if (this.failedTests > 0) {
      console.log('❌ \x1b[1m\x1b[31mFailed Tests Details:\x1b[0m');
      
      this.failedTestDetails.forEach((failure, index) => {
        console.log(`\n${index + 1}. \x1b[31m${failure.ancestorTitles.join(' › ')} › ${failure.title}\x1b[0m`);
        console.log(`   📄 File: ${failure.file}`);
        
        // Format and print error messages
        failure.errorMessage.forEach(message => {
          // Extract just the core error message
          const cleanMessage = message
            .split('\n')
            .filter(line => !line.includes('    at ')) // Remove stack trace
            .join('\n')
            .replace(/^\s*Error:/, '');
          
          console.log(`   🔴 ${cleanMessage.trim()}`);
        });
      });
      
      console.log('\n❗ \x1b[33mCheck the failed tests and fix the issues before proceeding.\x1b[0m\n');
    } else {
      console.log('✅ \x1b[32mAll tests passed successfully!\x1b[0m\n');
    }
  }
}

module.exports = CustomReporter; 