/**
 * HTML Website Debug Script
 * 
 * This script generates HTML website output for manual inspection and debugging.
 */

const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../src');

// Ensure output directories exist
const OUTPUT_DIR = path.join(__dirname, '../output/systems');
const DESERT_DIR = path.join(OUTPUT_DIR, 'desert-ecosystem/html-website');
const RESEARCH_DIR = path.join(OUTPUT_DIR, 'research-team/html-website');

if (!fs.existsSync(DESERT_DIR)) {
  fs.mkdirSync(DESERT_DIR, { recursive: true });
}

if (!fs.existsSync(RESEARCH_DIR)) {
  fs.mkdirSync(RESEARCH_DIR, { recursive: true });
}

/**
 * Create a Research Team dataset
 */
function createResearchTeamDataset() {
  const ultralink = new UltraLink();
  
  // Add researchers
  ultralink.addEntity('alice', 'researcher', {
    name: 'Alice Chen',
    role: 'Principal Investigator',
    department: 'Biology',
    email: 'alice.chen@example.edu',
    publications: 42
  });
  
  ultralink.addEntity('bob', 'researcher', {
    name: 'Bob Smith',
    role: 'Postdoc',
    department: 'Biology',
    email: 'bob.smith@example.edu',
    publications: 18
  });
  
  // Add projects
  ultralink.addEntity('desert-ecology', 'project', {
    name: 'Desert Ecology Study',
    title: 'Desert Ecology Study',
    startDate: '2023-01-15',
    budget: 150000,
    status: 'Active'
  });
  
  ultralink.addEntity('climate-impact', 'project', {
    name: 'Climate Impact Assessment',
    title: 'Climate Impact Assessment',
    startDate: '2022-08-10',
    budget: 220000,
    status: 'Active'
  });
  
  // Add relationships
  ultralink.addLink('alice', 'desert-ecology', 'leads', {
    startDate: '2023-01-15',
    role: 'Principal Investigator'
  });
  
  ultralink.addLink('alice', 'climate-impact', 'contributes_to', {
    startDate: '2022-10-01',
    role: 'Consultant'
  });
  
  ultralink.addLink('bob', 'desert-ecology', 'works_on', {
    startDate: '2023-02-01',
    role: 'Data Analyst'
  });
  
  ultralink.addLink('bob', 'alice', 'reports_to', {
    startDate: '2023-02-01'
  });
  
  return ultralink;
}

/**
 * Create a Desert Ecosystem dataset
 */
function createDesertEcosystemDataset() {
  const ultralink = new UltraLink();
  
  // Add organisms
  ultralink.addEntity('saguaro', 'organism', {
    name: 'Saguaro Cactus',
    scientificName: 'Carnegiea gigantea',
    type: 'plant',
    height: '15-50 feet',
    lifespan: '150-200 years'
  });
  
  ultralink.addEntity('kangaroo-rat', 'organism', {
    name: 'Kangaroo Rat',
    scientificName: 'Dipodomys',
    type: 'mammal',
    weight: '100-150g',
    nocturnal: true
  });
  
  // Add environmental factors
  ultralink.addEntity('aridity', 'environmental_factor', {
    name: 'Aridity',
    description: 'Extremely dry conditions with minimal rainfall',
    annualRainfall: '3-15 inches'
  });
  
  // Add relationships
  ultralink.addLink('saguaro', 'aridity', 'adapts_to', {
    mechanism: 'Water storage in stem',
    efficiency: 0.95
  });
  
  ultralink.addLink('kangaroo-rat', 'aridity', 'adapts_to', {
    mechanism: 'Metabolic water production',
    efficiency: 0.88
  });
  
  return ultralink;
}

/**
 * Debug function to export and save HTML website files
 */
function debugHtmlWebsiteExport(system, ultralink, outputDir) {
  console.log(`Debugging HTML Website export for ${system}...`);
  
  console.log(`Entity count: ${ultralink.entities.size}`);
  console.log(`Relationship count: ${ultralink.relationships.size}`);
  
  // List entities and relationships
  console.log('Entities:');
  for (const [id, entity] of ultralink.entities.entries()) {
    console.log(` - ${id} (${entity.type}): ${entity.attributes.name || 'unnamed'}`);
  }
  
  console.log('Relationships:');
  for (const [key, rel] of ultralink.relationships.entries()) {
    console.log(` - ${rel.source} → ${rel.target} (${rel.type})`);
  }
  
  // Generate HTML Website with debugging
  console.log('Generating HTML Website...');
  
  let jsonData = '';
  try {
    // Get JSON string for debugging
    jsonData = ultralink.toJSON();
    console.log(`JSON data length: ${jsonData.length} bytes`);
    console.log(`JSON data preview: ${jsonData.substring(0, 100)}...`);
  } catch (error) {
    console.error('Error generating JSON:', error);
  }
  
  let htmlFiles = {};
  try {
    htmlFiles = ultralink.toHTMLWebsite({
      title: `${system} Network`,
      description: `Interactive visualization of ${system.toLowerCase()} relationships`
    });
    
    console.log(`Generated ${Object.keys(htmlFiles).length} HTML files`);
    
    // Save files
    for (const [filename, content] of Object.entries(htmlFiles)) {
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, content);
      console.log(`Saved ${filePath} (${content.length} bytes)`);
    }
    
    // Verify the output
    if (htmlFiles['index.html']) {
      console.log(`index.html content length: ${htmlFiles['index.html'].length} bytes`);
      // Log a sample of the output to check D3 data content
      const dataMatch = htmlFiles['index.html'].match(/const data = ([^;]+);/);
      if (dataMatch) {
        console.log('Found data in index.html:');
        console.log(dataMatch[1].substring(0, 200) + '...');
      } else {
        console.log('Could not find data in index.html');
      }
    } else {
      console.error('No index.html was generated!');
    }
  } catch (error) {
    console.error('Error in HTML Website generation:', error);
  }
  
  console.log(`HTML Website debug complete for ${system}`);
  console.log('-------------------------------------------');
}

// Debug Desert Ecosystem
const desertSystem = createDesertEcosystemDataset();
debugHtmlWebsiteExport('Desert Ecosystem', desertSystem, DESERT_DIR);

// Debug Research Team
const researchSystem = createResearchTeamDataset();
debugHtmlWebsiteExport('Research Team', researchSystem, RESEARCH_DIR);

console.log('All debug tests completed. Check the output directories for results:');
console.log(` - Desert Ecosystem: ${DESERT_DIR}`);
console.log(` - Research Team: ${RESEARCH_DIR}`); 