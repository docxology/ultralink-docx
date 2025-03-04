/**
 * HTML Website Complex Visualization Test
 * 
 * This script generates an HTML website visualization for the complex
 * Active Inference and Ant Colony Research dataset to demonstrate the
 * capabilities of the enhanced HTML website export feature.
 */

const fs = require('fs');
const path = require('path');
const { createActiveInferenceLabDataset } = require('./test-datasets');

// Setup output directory
const OUTPUT_DIR = path.join(__dirname, '../output/visualizations/active-inference-lab');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create and configure the dataset
console.log('Creating Active Inference Lab dataset...');
const ultralink = createActiveInferenceLabDataset();

// Generate statistics about the dataset
console.log(`Dataset created with: 
- ${ultralink.entities.size} entities
- ${ultralink.relationships.size} relationships`);

// Count entity types
const entityTypes = {};
for (const entity of ultralink.entities.values()) {
  entityTypes[entity.type] = (entityTypes[entity.type] || 0) + 1;
}

console.log('Entity types:');
Object.entries(entityTypes).forEach(([type, count]) => {
  console.log(`- ${type}: ${count}`);
});

// Count relationship types
const relationshipTypes = {};
for (const rel of ultralink.relationships.values()) {
  relationshipTypes[rel.type] = (relationshipTypes[rel.type] || 0) + 1;
}

console.log('Relationship types:');
Object.entries(relationshipTypes).forEach(([type, count]) => {
  console.log(`- ${type}: ${count}`);
});

// Generate HTML website with the enhanced features
console.log('Generating HTML website...');

// Generate with default theme
const defaultThemeHtml = ultralink.toHTMLWebsite({
  title: 'Active Inference Research Lab Network',
  description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications',
  theme: 'default'
});

// Save files
console.log('Saving default theme files...');
const defaultThemeDir = path.join(OUTPUT_DIR, 'default-theme');
if (!fs.existsSync(defaultThemeDir)) {
  fs.mkdirSync(defaultThemeDir, { recursive: true });
}

Object.entries(defaultThemeHtml).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(defaultThemeDir, filename), content);
});

// Generate with academic theme (more suitable for research visualization)
const academicThemeHtml = ultralink.toHTMLWebsite({
  title: 'Active Inference Research Lab Network',
  description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications',
  theme: 'academic'
});

// Save files
console.log('Saving academic theme files...');
const academicThemeDir = path.join(OUTPUT_DIR, 'academic-theme');
if (!fs.existsSync(academicThemeDir)) {
  fs.mkdirSync(academicThemeDir, { recursive: true });
}

Object.entries(academicThemeHtml).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(academicThemeDir, filename), content);
});

// Generate with dark theme (for presentation mode)
const darkThemeHtml = ultralink.toHTMLWebsite({
  title: 'Active Inference Research Lab Network',
  description: 'Interactive visualization of research team structure, projects, concepts, equipment, and publications',
  theme: 'dark'
});

// Save files
console.log('Saving dark theme files...');
const darkThemeDir = path.join(OUTPUT_DIR, 'dark-theme');
if (!fs.existsSync(darkThemeDir)) {
  fs.mkdirSync(darkThemeDir, { recursive: true });
}

Object.entries(darkThemeHtml).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(darkThemeDir, filename), content);
});

console.log(`\nVisualization complete! View the HTML websites at:
- Default theme: ${defaultThemeDir}/index.html
- Academic theme: ${academicThemeDir}/index.html 
- Dark theme: ${darkThemeDir}/index.html`);

console.log('\nTry exploring the visualizations with the following features:');
console.log('1. Use the zoom controls to navigate the complex graph');
console.log('2. Filter entities by type to focus on specific aspects of the research network');
console.log('3. Search for specific entities like "Active Inference" or "Alice"');
console.log('4. Click on entities to view their details and relationships');
console.log('5. Navigate between related entities by clicking on relationship links');
console.log('6. Try different themes to see which works best for your presentation needs');
console.log('7. Test the responsive design by resizing your browser window'); 