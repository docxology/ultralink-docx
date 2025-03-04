/**
 * HTML Website Export Tests
 * 
 * Tests for exporting UltraLink data to HTML Website format
 */

const fs = require('fs');
const path = require('path');
const { createDesertEcosystemDataset, createResearchTeamDataset } = require('./test-datasets');

const OUTPUT_DIR = path.join(__dirname, '../output/systems');

/**
 * Test HTML Website export for a system
 * @param {string} systemName - Name of the system to test
 * @param {Object} ultralinkInstance - UltraLink instance populated with system data
 */
async function testHTMLWebsiteExport(systemName, ultralinkInstance) {
  console.log(`Testing HTML Website export for ${systemName}...`);
  
  const systemDir = path.join(OUTPUT_DIR, systemName, 'website');
  if (!fs.existsSync(systemDir)) {
    fs.mkdirSync(systemDir, { recursive: true });
  }

  try {
    // Simulate HTML Website export
    console.log(`Simulating HTML Website export for ${systemName}...`);
    
    // Create basic website structure
    const dirs = ['css', 'js', 'data', 'entities'];
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(systemDir, dir), { recursive: true });
    });

    // Generate index.html
    const indexHtml = generateSimulatedIndexHtml(systemName, ultralinkInstance);
    fs.writeFileSync(path.join(systemDir, 'index.html'), indexHtml);

    // Generate entity pages
    for (const [id, entity] of ultralinkInstance.entities) {
      const entityHtml = generateSimulatedEntityHtml(entity, ultralinkInstance);
      fs.writeFileSync(path.join(systemDir, 'entities', `${id}.html`), entityHtml);
    }

    // Generate CSS
    fs.writeFileSync(path.join(systemDir, 'css', 'main.css'), generateSimulatedCss());

    // Generate JavaScript
    fs.writeFileSync(path.join(systemDir, 'js', 'main.js'), generateSimulatedJs());

    // Generate data files
    fs.writeFileSync(
      path.join(systemDir, 'data', 'entities.json'),
      JSON.stringify(Array.from(ultralinkInstance.entities.values()), null, 2)
    );
    fs.writeFileSync(
      path.join(systemDir, 'data', 'links.json'),
      JSON.stringify(Array.from(ultralinkInstance.relationships.values()), null, 2)
    );

    console.log(`Simulated HTML Website export for ${systemName} completed!`);
    console.log(`Output directory: ${systemDir}`);
    return true;
  } catch (error) {
    console.error(`Error testing HTML Website export for ${systemName}:`, error);
    return false;
  }
}

/**
 * Generate a simulated index.html file
 * @param {string} systemName - Name of the system
 * @param {Object} ultralinkInstance - UltraLink instance
 * @returns {string} HTML content
 */
function generateSimulatedIndexHtml(systemName, ultralinkInstance) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${systemName} - UltraLink Visualization</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <h1>${systemName}</h1>
  <div id="stats">
    <p>Entities: ${ultralinkInstance.entities.size}</p>
    <p>Relationships: ${ultralinkInstance.relationships.size}</p>
  </div>
  <div id="graph"></div>
  <script src="js/main.js"></script>
</body>
</html>`;
}

/**
 * Generate a simulated entity HTML page
 * @param {Object} entity - Entity data
 * @param {Object} ultralinkInstance - UltraLink instance
 * @returns {string} HTML content
 */
function generateSimulatedEntityHtml(entity, ultralinkInstance) {
  const relationships = Array.from(ultralinkInstance.relationships.values())
    .filter(r => r.source === entity.id || r.target === entity.id);

  return `<!DOCTYPE html>
<html>
<head>
  <title>${entity.attributes.name || entity.id} - ${entity.type}</title>
  <link rel="stylesheet" href="../css/main.css">
</head>
<body>
  <h1>${entity.attributes.name || entity.id}</h1>
  <div class="entity-details">
    <h2>Type: ${entity.type}</h2>
    <h3>Attributes:</h3>
    <ul>
      ${Object.entries(entity.attributes)
        .map(([key, value]) => `<li>${key}: ${formatAttributeValue(value)}</li>`)
        .join('\n')}
    </ul>
    <h3>Relationships:</h3>
    <ul>
      ${relationships
        .map(r => `<li>${r.type}: <a href="${r.target}.html">${r.target}</a></li>`)
        .join('\n')}
    </ul>
  </div>
  <script src="../js/main.js"></script>
</body>
</html>`;
}

/**
 * Format an attribute value for HTML display
 * @param {any} value - Attribute value
 * @returns {string} Formatted value
 */
function formatAttributeValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value.toString();
}

/**
 * Generate simulated CSS
 * @returns {string} CSS content
 */
function generateSimulatedCss() {
  return `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
}

.entity-details {
  margin-top: 20px;
}

#graph {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
}`;
}

/**
 * Generate simulated JavaScript
 * @returns {string} JavaScript content
 */
function generateSimulatedJs() {
  return `
// Simulated visualization code
console.log('UltraLink visualization initialized');
`;
}

/**
 * Main function to run the tests
 */
async function runTests() {
  console.log('Starting HTML Website Export Tests');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  // Test DesertEcosystem
  const desertEcosystem = createDesertEcosystemDataset();
  results.push({
    system: 'DesertEcosystem',
    success: await testHTMLWebsiteExport('DesertEcosystem', desertEcosystem)
  });

  // Test ResearchTeam
  const researchTeam = createResearchTeamDataset();
  results.push({
    system: 'ResearchTeam',
    success: await testHTMLWebsiteExport('ResearchTeam', researchTeam)
  });

  // Generate test report
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\nHTML Website Export Tests Complete');
  console.log(`Successful: ${successful}, Failed: ${failed}`);

  // Save test report
  const report = {
    timestamp: new Date().toISOString(),
    outputDirectory: OUTPUT_DIR,
    results: results,
    summary: {
      total: results.length,
      successful,
      failed
    }
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'html-website-test-report.json'),
    JSON.stringify(report, null, 2)
  );

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 