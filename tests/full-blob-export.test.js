const fs = require('fs');
const path = require('path');
const { createDesertEcosystemDataset, createResearchTeamDataset } = require('./test-datasets');
const { UltraLink } = require('../src');

const OUTPUT_DIR = path.join(__dirname, '../output/systems');

async function testFullBlobExport(systemName, systemData) {
  console.log(`Exporting Full Blob for ${systemName}...`);
  
  try {
    // Create output directory
    const outputDir = path.join(__dirname, `../output/systems/${systemName}/full-blob`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Export uncompressed full blob
    const blob = systemData.toFullBlob();
    const uncompressedPath = path.join(outputDir, `${systemName}-full.json`);
    fs.writeFileSync(uncompressedPath, JSON.stringify(blob, null, 2));
    console.log(`Saved uncompressed Full Blob to ${uncompressedPath}`);
    
    // Export compressed full blob
    console.log(`Exporting compressed Full Blob for ${systemName}...`);
    const compressedBlob = systemData.toFullBlob({ compress: true });
    const compressedPath = path.join(outputDir, `${systemName}-full-compressed.blob`);
    fs.writeFileSync(compressedPath, compressedBlob);
    console.log(`Saved compressed Full Blob to ${compressedPath}`);
    
    // Test importing the blobs
    const newSystem = new UltraLink();
    newSystem.fromFullBlob(blob);
    console.log(`Successfully imported uncompressed blob with ${newSystem.entities.size} entities and ${newSystem.relationships.size} relationships`);
    
    const compressedSystem = new UltraLink();
    compressedSystem.fromFullBlob(compressedBlob, { compressed: true });
    console.log(`Successfully imported compressed blob with ${compressedSystem.entities.size} entities and ${compressedSystem.relationships.size} relationships`);
    
    return true;
  } catch (error) {
    console.error(`Error testing Full Blob export for ${systemName}:`, error);
    return false;
  }
}

async function runTests() {
  console.log('Starting Full Blob Export Tests');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  // Test DesertEcosystem
  const desertEcosystem = createDesertEcosystemDataset();
  results.push({
    system: 'DesertEcosystem',
    success: await testFullBlobExport('DesertEcosystem', desertEcosystem)
  });

  // Test ResearchTeam
  const researchTeam = createResearchTeamDataset();
  results.push({
    system: 'ResearchTeam',
    success: await testFullBlobExport('ResearchTeam', researchTeam)
  });

  // Generate test report
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\nFull Blob Export Tests Complete');
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
    path.join(OUTPUT_DIR, 'full-blob-test-report.json'),
    JSON.stringify(report, null, 2)
  );

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 