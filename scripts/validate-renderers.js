const fs = require('fs');
const path = require('path');
const { generateDashboard } = require('./generate-research-team-dashboard');
const OutputValidator = require('../tests/runners/research-team-output-validator');

const RENDERERS = {
  html: generateDashboard,
  // Add other renderers as they're implemented
  // bayesian: generateBayesianGraph,
  // ontology: generateOntologyNetwork,
  // etc.
};

const OUTPUT_DIR = path.join(__dirname, '../output/research-team');
const REPORT_DIR = path.join(__dirname, '../reports/validation');

/**
 * Run and validate all renderers
 */
async function validateRenderers() {
  console.log('Starting renderer validation...');

  try {
    // Create report directory
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }

    // Initialize validation report
    const report = {
      timestamp: new Date().toISOString(),
      renderers: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    // Run each renderer and validate outputs
    for (const [name, renderer] of Object.entries(RENDERERS)) {
      console.log(`\nValidating ${name} renderer...`);
      
      try {
        // Run renderer
        await renderer();
        
        // Validate outputs
        const validator = new OutputValidator(OUTPUT_DIR);
        const validation = await validateRenderer(name, validator);
        
        // Add to report
        report.renderers[name] = validation;
        report.summary.total++;
        if (validation.success) {
          report.summary.passed++;
        } else {
          report.summary.failed++;
        }
        
        console.log(`${name} renderer validation ${validation.success ? 'passed' : 'failed'}`);
        if (validation.errors.length > 0) {
          console.log('Errors:');
          validation.errors.forEach(error => console.log(`- ${error}`));
        }
        
      } catch (error) {
        console.error(`Error validating ${name} renderer:`, error);
        report.renderers[name] = {
          success: false,
          errors: [error.message],
          details: null
        };
        report.summary.total++;
        report.summary.failed++;
      }
    }

    // Save validation report
    const reportPath = path.join(REPORT_DIR, `validation-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = generateHTMLReport(report);
    const htmlPath = path.join(REPORT_DIR, `validation-${Date.now()}.html`);
    fs.writeFileSync(htmlPath, htmlReport);

    console.log('\nValidation complete!');
    console.log(`Total renderers: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`\nReports saved to:`);
    console.log(`- JSON: ${reportPath}`);
    console.log(`- HTML: ${htmlPath}`);

  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
}

/**
 * Validate specific renderer outputs
 */
async function validateRenderer(name, validator) {
  const validation = {
    success: true,
    errors: [],
    details: {}
  };

  try {
    switch (name) {
      case 'html':
        // Validate HTML website outputs
        await validator.validateHTML(path.join(OUTPUT_DIR, 'dashboard/index.html'));
        await validator.validateJSON(path.join(OUTPUT_DIR, 'raw/research-team.json'));
        await validator.validateGraphML(path.join(OUTPUT_DIR, 'graph/research-team.graphml'));
        await validator.validateCSV(path.join(OUTPUT_DIR, 'raw/research-team.csv'));
        await validator.validateObsidian(path.join(OUTPUT_DIR, 'knowledge/obsidian'));
        await validator.validateTimeline(path.join(OUTPUT_DIR, 'temporal/timeline.json'));
        break;

      // Add validation for other renderers
      // case 'bayesian':
      //   await validateBayesianOutputs(validator);
      //   break;
      
      default:
        throw new Error(`Unknown renderer: ${name}`);
    }

    validation.details = validator.generateReport();

  } catch (error) {
    validation.success = false;
    validation.errors.push(error.message);
  }

  return validation;
}

/**
 * Generate HTML validation report
 */
function generateHTMLReport(report) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Renderer Validation Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .summary {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .renderer {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .success { color: #22c55e; }
    .failure { color: #ef4444; }
    .details {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-top: 15px;
    }
    pre {
      background: #f1f5f9;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>Renderer Validation Report</h1>
  <p>Generated: ${report.timestamp}</p>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total Renderers: ${report.summary.total}</p>
    <p>Passed: <span class="success">${report.summary.passed}</span></p>
    <p>Failed: <span class="failure">${report.summary.failed}</span></p>
  </div>

  <h2>Renderer Details</h2>
  ${Object.entries(report.renderers).map(([name, validation]) => `
    <div class="renderer">
      <h3>${name} Renderer</h3>
      <p>Status: <span class="${validation.success ? 'success' : 'failure'}">
        ${validation.success ? 'PASSED' : 'FAILED'}
      </span></p>
      ${validation.errors.length > 0 ? `
        <div class="errors">
          <h4>Errors:</h4>
          <ul>
            ${validation.errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${validation.details ? `
        <div class="details">
          <h4>Validation Details:</h4>
          <pre>${JSON.stringify(validation.details, null, 2)}</pre>
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>`;
}

// Run if executed directly
if (require.main === module) {
  validateRenderers().catch(console.error);
}

module.exports = { validateRenderers }; 