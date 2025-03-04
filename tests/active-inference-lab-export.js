/**
 * Active Inference Lab Export Script
 * 
 * This script exports the Active Inference Lab dataset to all available
 * formats to demonstrate the rich visualizations and data representations.
 */

const fs = require('fs');
const path = require('path');
const { createActiveInferenceLabDataset } = require('./fixtures/Systems/ActiveInferenceLab/active-inference-lab');
const config = require('./test-config');

// Setup output directory
const outputDir = path.join(__dirname, '../output/systems/ActiveInferenceLab');

// Create main output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create and configure the dataset
console.log('Creating Active Inference Lab dataset...');
try {
  const ultralink = createActiveInferenceLabDataset();
  
  console.log('Dataset creation successful.');
  console.log('Ultralink object:', typeof ultralink);
  console.log('Properties:', Object.keys(ultralink));
  
  if (!ultralink.entities || !ultralink.links) {
    console.error('Error: Dataset missing required properties');
    console.error('ultralink:', ultralink);
    console.error('entities:', ultralink.entities);
    console.error('links:', ultralink.links);
    process.exit(1);
  }

  // Generate statistics about the dataset
  const entityCount = ultralink.entities.size;
  const relationshipCount = ultralink.links.size;
  console.log(`Entity count: ${entityCount}`);
  console.log(`Relationship count: ${relationshipCount}`);

  // Count entity types
  const entityTypes = {};
  for (const [id, entity] of ultralink.entities) {
    const type = entity.type;
    entityTypes[type] = (entityTypes[type] || 0) + 1;
  }
  console.log('Entity types:', entityTypes);

  // Count relationship types
  const relationshipTypes = {};
  for (const [sourceId, targets] of ultralink.links) {
    for (const link of targets) {
      const type = link.type;
      relationshipTypes[type] = (relationshipTypes[type] || 0) + 1;
    }
  }
  console.log('Relationship types:', relationshipTypes);

  // Export in all available formats
  console.log('\nExporting Active Inference Lab dataset to all formats...');
  
  // Debug available methods
  console.log('Available methods on ultralink:', Object.getOwnPropertyNames(Object.getPrototypeOf(ultralink)));
  console.log('Is toHTMLWebsite a function?', typeof ultralink.toHTMLWebsite === 'function');
  console.log('Is toFullBlob a function?', typeof ultralink.toFullBlob === 'function');

  // Export to JSON
  const jsonOutputDir = path.join(outputDir, 'json');
  if (!fs.existsSync(jsonOutputDir)) {
    fs.mkdirSync(jsonOutputDir, { recursive: true });
  }
  const jsonData = ultralink.toJSON({ pretty: true });
  const jsonFilePath = path.join(jsonOutputDir, 'active-inference-lab.json');
  fs.writeFileSync(jsonFilePath, jsonData);
  console.log(`Exported to JSON: ${jsonFilePath}`);

  // Export to GraphML
  const graphmlOutputDir = path.join(outputDir, 'graphml');
  if (!fs.existsSync(graphmlOutputDir)) {
    fs.mkdirSync(graphmlOutputDir, { recursive: true });
  }
  const graphmlData = ultralink.toGraphML();
  const graphmlFilePath = path.join(graphmlOutputDir, 'active-inference-lab.graphml');
  fs.writeFileSync(graphmlFilePath, graphmlData);
  console.log(`Exported to GraphML: ${graphmlFilePath}`);

  // Export to CSV
  const csvOutputDir = path.join(outputDir, 'csv');
  if (!fs.existsSync(csvOutputDir)) {
    fs.mkdirSync(csvOutputDir, { recursive: true });
  }
  const csvData = ultralink.toCSV();
  if (csvData.entities) {
    fs.writeFileSync(path.join(csvOutputDir, 'entities.csv'), csvData.entities);
  }
  if (csvData.relationships) {
    fs.writeFileSync(path.join(csvOutputDir, 'relationships.csv'), csvData.relationships);
  }
  console.log(`Exported to CSV: ${csvOutputDir}`);

  // Export to Obsidian
  const obsidianOutputDir = path.join(outputDir, 'obsidian');
  if (!fs.existsSync(obsidianOutputDir)) {
    fs.mkdirSync(obsidianOutputDir, { recursive: true });
  }
  const obsidianData = ultralink.toObsidian();
  for (const [filename, content] of Object.entries(obsidianData)) {
    fs.writeFileSync(path.join(obsidianOutputDir, `${filename}.md`), content);
  }
  console.log(`Exported to Obsidian: ${obsidianOutputDir}`);

  /* HTML Website export is not available in this version of UltraLink
  // Export to HTML website (default theme)
  const htmlDefaultOutputDir = path.join(outputDir, 'html-website');
  if (!fs.existsSync(htmlDefaultOutputDir)) {
    fs.mkdirSync(htmlDefaultOutputDir, { recursive: true });
  }
  const htmlData = ultralink.toHTMLWebsite({
    title: 'Active Inference Lab Network',
    description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications'
  });
  for (const [filename, content] of Object.entries(htmlData)) {
    fs.writeFileSync(path.join(htmlDefaultOutputDir, filename), content);
  }
  console.log(`Exported to HTML (default theme): ${htmlDefaultOutputDir}`);

  // Export to HTML website (academic theme)
  const htmlAcademicOutputDir = path.join(outputDir, 'html-website-academic');
  if (!fs.existsSync(htmlAcademicOutputDir)) {
    fs.mkdirSync(htmlAcademicOutputDir, { recursive: true });
  }
  const htmlAcademicData = ultralink.toHTMLWebsite({
    title: 'Active Inference Lab Network',
    description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications',
    theme: 'academic'
  });
  for (const [filename, content] of Object.entries(htmlAcademicData)) {
    fs.writeFileSync(path.join(htmlAcademicOutputDir, filename), content);
  }
  console.log(`Exported to HTML (academic theme): ${htmlAcademicOutputDir}`);

  // Export to HTML website (dark theme)
  const htmlDarkOutputDir = path.join(outputDir, 'html-website-dark');
  if (!fs.existsSync(htmlDarkOutputDir)) {
    fs.mkdirSync(htmlDarkOutputDir, { recursive: true });
  }
  const htmlDarkData = ultralink.toHTMLWebsite({
    title: 'Active Inference Lab Network',
    description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications',
    theme: 'dark'
  });
  for (const [filename, content] of Object.entries(htmlDarkData)) {
    fs.writeFileSync(path.join(htmlDarkOutputDir, filename), content);
  }
  console.log(`Exported to HTML (dark theme): ${htmlDarkOutputDir}`);
  */

  /* Full Blob export is not available in this version of UltraLink
  // Export to Full Blob
  const blobOutputDir = path.join(outputDir, 'full-blob');
  if (!fs.existsSync(blobOutputDir)) {
    fs.mkdirSync(blobOutputDir, { recursive: true });
  }
  const blobData = ultralink.toFullBlob();
  const blobFilePath = path.join(blobOutputDir, 'active-inference-lab.json');
  fs.writeFileSync(blobFilePath, blobData);
  console.log(`Exported to Full Blob: ${blobFilePath}`);

  // Export to Compressed Full Blob
  const compressedBlobOutputDir = path.join(outputDir, 'compressed-full-blob');
  if (!fs.existsSync(compressedBlobOutputDir)) {
    fs.mkdirSync(compressedBlobOutputDir, { recursive: true });
  }
  const compressedBlobData = ultralink.toFullBlob({ compress: true });
  const compressedBlobFilePath = path.join(compressedBlobOutputDir, 'active-inference-lab.json.gz');
  fs.writeFileSync(compressedBlobFilePath, compressedBlobData);
  console.log(`Exported to Compressed Full Blob: ${compressedBlobFilePath}`);
  */

  console.log('\nExport completed successfully!');
  console.log(`\nResults stored in ${outputDir}`);
  console.log('HTML visualizations can be viewed by opening the following files in your browser:');
  console.log(`- Default theme: ${path.join(htmlDefaultOutputDir, 'index.html')}`);
  console.log(`- Academic theme: ${path.join(htmlAcademicOutputDir, 'index.html')}`);
  console.log(`- Dark theme: ${path.join(htmlDarkOutputDir, 'index.html')}`);
} catch (error) {
  console.error('Error creating or processing dataset:', error);
  process.exit(1);
} 