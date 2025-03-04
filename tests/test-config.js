const path = require('path');

/**
 * Test Configuration
 * Centralized configuration for the UltraLink test suite
 */
module.exports = {
  // Output directories
  outputDir: path.join(__dirname, '../output'),
  systemsDir: path.join(__dirname, '../output/systems'),
  reportsDir: path.join(__dirname, '../output/reports'),
  
  // Test datasets
  testSystems: [
    {
      name: 'DesertEcosystem',
      datasetModule: './test-datasets',
      datasetFunction: 'createDesertEcosystemDataset',
      required: true
    },
    {
      name: 'ResearchTeam',
      datasetModule: './test-datasets',
      datasetFunction: 'createResearchTeamDataset',
      required: true
    }
  ],
  
  // Export formats to test
  exportFormats: [
    {
      name: 'GraphML',
      extension: '.graphml',
      required: true
    },
    {
      name: 'JSON',
      extension: '.json',
      required: true
    },
    {
      name: 'CSV',
      directory: 'csv',
      required: true
    },
    {
      name: 'Obsidian',
      directory: 'obsidian',
      required: true
    },
    {
      name: 'HTML Website',
      directory: 'website',
      required: true
    },
    {
      name: 'Full Blob',
      directory: 'full-blob',
      required: true
    }
  ],
  
  // Performance test settings
  performance: {
    smallDataset: {
      entities: 100,
      relationships: 200
    },
    mediumDataset: {
      entities: 1000,
      relationships: 2000
    },
    largeDataset: {
      entities: 10000,
      relationships: 20000
    },
    timeoutMs: 30000
  },
  
  // Validation settings
  validation: {
    entityRequiredFields: ['id', 'type', 'attributes'],
    relationshipRequiredFields: ['source', 'target', 'type'],
    validateVectors: true,
    validateTimestamps: true
  },
  
  // Report settings
  reporting: {
    includeTimings: true,
    includeCoverage: true,
    includeMemoryUsage: true,
    saveArtifacts: true
  }
}; 