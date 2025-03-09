#!/usr/bin/env node

/**
 * System Visualization Generator
 * 
 * This script generates system-specific visualizations with templated summaries as PNG files.
 * It uses the system-template-visualizer module to create customized visualizations for each
 * known system type.
 */

const path = require('path');
const fs = require('fs');
const { 
  generateSystemVisualization, 
  generateAllSystemVisualizations,
  SYSTEM_TEMPLATES
} = require('../src/lib/exporters/system-template-visualizer');

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), 'output', 'system-visualizations');
const DIMENSION_VARIANTS = [
  { width: 1200, height: 900, suffix: '-large' },
  { width: 800, height: 600, suffix: '-medium' },
  { width: 400, height: 300, suffix: '-small' }
];

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Main function to run the script
 */
async function main() {
  const args = process.argv.slice(2);
  const systemTypes = Object.keys(SYSTEM_TEMPLATES).filter(type => type !== 'default');
  
  console.log('System Visualization Generator');
  console.log('============================');
  console.log(`Available system types: ${systemTypes.join(', ')}`);
  console.log('');

  try {
    if (args.includes('--help') || args.includes('-h')) {
      showHelp();
      return;
    }

    // Extract specific system type if provided
    let specificSystem = null;
    for (const arg of args) {
      if (systemTypes.includes(arg.toLowerCase()) || arg.toLowerCase() === 'all') {
        specificSystem = arg.toLowerCase();
        break;
      }
    }

    // Check if dimensions are specified
    const dimensionVariants = args.includes('--all-sizes') ? 
      DIMENSION_VARIANTS : 
      [DIMENSION_VARIANTS[0]]; // Default to large size only

    if (specificSystem === 'all' || specificSystem === null) {
      console.log('Generating visualizations for all system types...');
      await generateAllVariants(systemTypes, dimensionVariants);
    } else {
      console.log(`Generating visualizations for system type: ${specificSystem}`);
      await generateForSystemType(specificSystem, dimensionVariants);
    }

    console.log('\nVisualization generation complete!');
    console.log(`Output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Error generating visualizations:', error);
    process.exit(1);
  }
}

/**
 * Generate all variants for all system types
 * 
 * @param {string[]} systemTypes - List of system types
 * @param {Array} dimensionVariants - List of dimension variants
 */
async function generateAllVariants(systemTypes, dimensionVariants) {
  let totalGenerated = 0;

  for (const systemType of systemTypes) {
    const systemResults = await generateForSystemType(systemType, dimensionVariants);
    totalGenerated += systemResults.length;
  }

  console.log(`\nTotal visualizations generated: ${totalGenerated}`);
}

/**
 * Generate all dimension variants for a specific system type
 * 
 * @param {string} systemType - System type to generate visualizations for
 * @param {Array} dimensionVariants - List of dimension variants
 * @returns {Array} List of generated file paths
 */
async function generateForSystemType(systemType, dimensionVariants) {
  const results = [];

  for (const dim of dimensionVariants) {
    const outputPath = await generateSystemVisualization(systemType, {
      width: dim.width,
      height: dim.height,
      outputDir: OUTPUT_DIR,
      filename: `${systemType}${dim.suffix}.png`
    });
    
    results.push(outputPath);
    console.log(`  ✓ Generated ${dim.width}x${dim.height} visualization for ${systemType}`);
  }

  return results;
}

/**
 * Show help information for the script
 */
function showHelp() {
  console.log('Usage: node generate-system-visualizations.js [options] [system-type]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h         Show this help message');
  console.log('  --all-sizes        Generate all size variants (large, medium, small)');
  console.log('');
  console.log('Arguments:');
  console.log('  system-type        Specific system type to generate (e.g., "pomdp", "car")');
  console.log('  all                Generate for all system types');
  console.log('');
  console.log('Examples:');
  console.log('  node generate-system-visualizations.js pomdp');
  console.log('  node generate-system-visualizations.js all --all-sizes');
}

// Run the script
main().catch(console.error); 