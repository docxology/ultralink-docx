/**
 * Research Team Test Suite Runner
 * 
 * Executes all research team tests and generates a comprehensive report
 */

const fs = require('fs');
const path = require('path');
const { runResearchTeamRenderTests } = require('./runners/research-team-render');
const OutputValidator = require('./runners/research-team-output-validator');
const { execSync } = require('child_process');

const REPORT_DIR = path.join(__dirname, '../reports/research-team');
const OUTPUT_DIR = path.join(__dirname, '../output/research-team');

/**
 * Test Report Generator with enhanced validation
 */
class TestReportGenerator {
  constructor() {
    this.results = {
      startTime: new Date(),
      endTime: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testSuites: [],
      outputValidation: null
    };
  }

  addTestSuite(name, passed, details) {
    this.results.testSuites.push({
      name,
      passed,
      details,
      timestamp: new Date()
    });
    
    this.results.totalTests++;
    if (passed) {
      this.results.passedTests++;
    } else {
      this.results.failedTests++;
    }
  }

  async runPipeline() {
    try {
      console.log('Running research team pipeline...');
      execSync('node scripts/run-research-team-pipeline.js', { stdio: 'inherit' });
      this.addTestSuite('Pipeline Execution', true, {
        message: 'Pipeline completed successfully'
      });
    } catch (error) {
      this.addTestSuite('Pipeline Execution', false, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async validateOutputs() {
    const validator = new OutputValidator(OUTPUT_DIR);
    
    // Validate raw data outputs
    await validator.validateJSON(path.join(OUTPUT_DIR, 'raw/research-team.json'));
    await validator.validateCSV(path.join(OUTPUT_DIR, 'raw/research-team.csv'));
    
    // Validate graph outputs
    await validator.validateGraphML(path.join(OUTPUT_DIR, 'graph/research-team.graphml'));
    
    // Validate document outputs
    await validator.validateHTML(path.join(OUTPUT_DIR, 'docs/research-team.html'));
    
    // Validate knowledge base
    await validator.validateObsidian(path.join(OUTPUT_DIR, 'knowledge/obsidian'));
    
    // Validate temporal analysis
    await validator.validateTimeline(path.join(OUTPUT_DIR, 'temporal/timeline.json'));
    
    this.results.outputValidation = validator.generateReport();
  }

  async generateReport() {
    this.results.endTime = new Date();
    const duration = this.results.endTime - this.results.startTime;

    const report = {
      summary: {
        startTime: this.results.startTime.toISOString(),
        endTime: this.results.endTime.toISOString(),
        duration: `${duration}ms`,
        totalTests: this.results.totalTests,
        passedTests: this.results.passedTests,
        failedTests: this.results.failedTests,
        successRate: `${((this.results.passedTests / this.results.totalTests) * 100).toFixed(2)}%`
      },
      testSuites: this.results.testSuites,
      outputValidation: this.results.outputValidation
    };

    await fs.promises.mkdir(REPORT_DIR, { recursive: true });
    
    // Save JSON report
    const reportFile = path.join(REPORT_DIR, `test-report-${Date.now()}.json`);
    await fs.promises.writeFile(reportFile, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(report);
    const htmlFile = path.join(REPORT_DIR, `test-report-${Date.now()}.html`);
    await fs.promises.writeFile(htmlFile, htmlReport);

    return { report, reportFile, htmlFile };
  }

  generateHtmlReport(report) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Research Team Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    .success { color: green; }
    .failure { color: red; }
    .test-suite { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
    .validation { background: #e1f5fe; padding: 15px; margin: 10px 0; }
    pre { background: #f8f8f8; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Research Team Test Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Start Time: ${report.summary.startTime}</p>
    <p>End Time: ${report.summary.endTime}</p>
    <p>Duration: ${report.summary.duration}</p>
    <p>Total Tests: ${report.summary.totalTests}</p>
    <p>Passed Tests: <span class="success">${report.summary.passedTests}</span></p>
    <p>Failed Tests: <span class="failure">${report.summary.failedTests}</span></p>
    <p>Success Rate: ${report.summary.successRate}</p>
  </div>

  <h2>Test Suites</h2>
  ${report.testSuites.map(suite => `
    <div class="test-suite">
      <h3>${suite.name}</h3>
      <p>Status: <span class="${suite.passed ? 'success' : 'failure'}">${suite.passed ? 'PASSED' : 'FAILED'}</span></p>
      <p>Timestamp: ${suite.timestamp}</p>
      <pre>${JSON.stringify(suite.details, null, 2)}</pre>
    </div>
  `).join('')}

  <h2>Output Validation</h2>
  <div class="validation">
    <h3>Validation Summary</h3>
    <p>Total Validations: ${report.outputValidation.summary.total}</p>
    <p>Passed: <span class="success">${report.outputValidation.summary.passed}</span></p>
    <p>Failed: <span class="failure">${report.outputValidation.summary.failed}</span></p>
    <p>Success Rate: ${report.outputValidation.summary.successRate}</p>
    
    <h3>Validation Details</h3>
    ${report.outputValidation.tests.map(test => `
      <div class="test-suite">
        <h4>${test.name}</h4>
        <p>Status: <span class="${test.passed ? 'success' : 'failure'}">${test.passed ? 'PASSED' : 'FAILED'}</span></p>
        <pre>${JSON.stringify(test.details, null, 2)}</pre>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  }
}

/**
 * Run all research team tests with enhanced validation
 */
async function runAllTests() {
  const reporter = new TestReportGenerator();

  try {
    // Run pipeline first
    await reporter.runPipeline();

    // Run render tests
    try {
      await runResearchTeamRenderTests();
      reporter.addTestSuite('Render Tests', true, {
        message: 'All render tests completed successfully'
      });
    } catch (error) {
      reporter.addTestSuite('Render Tests', false, {
        error: error.message,
        stack: error.stack
      });
    }

    // Run unit tests with Jest
    try {
      execSync('npx jest tests/research-team-llm.test.js', { stdio: 'inherit' });
      reporter.addTestSuite('Unit Tests', true, {
        message: 'All unit tests completed successfully'
      });
    } catch (error) {
      reporter.addTestSuite('Unit Tests', false, {
        error: error.message,
        stack: error.stack
      });
    }

    // Run export tests with Jest
    try {
      execSync('npx jest tests/research-team-llm-export.test.js', { stdio: 'inherit' });
      reporter.addTestSuite('Export Tests', true, {
        message: 'All export tests completed successfully'
      });
    } catch (error) {
      reporter.addTestSuite('Export Tests', false, {
        error: error.message,
        stack: error.stack
      });
    }

    // Validate all outputs
    await reporter.validateOutputs();

    // Generate and save report
    const { reportFile, htmlFile } = await reporter.generateReport();
    console.log(`
Test execution completed!
JSON Report: ${reportFile}
HTML Report: ${htmlFile}
    `);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, TestReportGenerator }; 