/**
 * Research Team Rendering Test Runner
 * 
 * Executes comprehensive rendering tests for the research team dataset
 * across all supported formats with detailed logging.
 */

const { createEnhancedResearchTeamDataset, createEnhancedResearchTeamSubset } = require('../fixtures/research-team-llm');
const fs = require('fs').promises;
const path = require('path');

// Configure logging
const LOG_DIR = path.join(__dirname, '../../logs/research-team');
const OUTPUT_DIR = path.join(__dirname, '../../output/research-team');

/**
 * Logger utility for detailed test execution tracking
 */
class RenderLogger {
  constructor(testName) {
    this.testName = testName;
    this.logs = [];
    this.startTime = Date.now();
  }

  log(message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    this.logs.push(entry);
    console.log(`[${this.testName}] ${message}`);
  }

  async save() {
    const logFile = path.join(LOG_DIR, `${this.testName}-${Date.now()}.log`);
    const content = this.logs.map(entry => 
      `[${entry.timestamp}] ${entry.message}\n${entry.data ? entry.data + '\n' : ''}`
    ).join('\n');
    
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.writeFile(logFile, content);
  }
}

/**
 * Test runner for rendering the research team dataset
 */
async function runResearchTeamRenderTests() {
  const logger = new RenderLogger('research-team-render');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Create full dataset
    logger.log('Creating enhanced research team dataset');
    const ultralink = createEnhancedResearchTeamDataset();
    logger.log('Dataset created', {
      entityCount: ultralink.entities.size,
      metadataKeys: Object.keys(ultralink.metadata)
    });

    // Test JSON export
    logger.log('Testing JSON export');
    const json = ultralink.toJSON();
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'research-team.json'),
      JSON.stringify(json, null, 2)
    );
    logger.log('JSON export completed', {
      entityCount: json.entities.length,
      format: 'JSON'
    });

    // Test CSV export
    logger.log('Testing CSV export');
    const csv = ultralink.toCSV();
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'research-team.csv'),
      csv
    );
    logger.log('CSV export completed', {
      lineCount: csv.split('\n').length,
      format: 'CSV'
    });

    // Test GraphML export
    logger.log('Testing GraphML export');
    const graphml = ultralink.toGraphML();
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'research-team.graphml'),
      graphml
    );
    logger.log('GraphML export completed', {
      format: 'GraphML',
      size: graphml.length
    });

    // Test Obsidian export
    logger.log('Testing Obsidian export');
    const obsidianDir = path.join(OUTPUT_DIR, 'obsidian');
    await fs.mkdir(obsidianDir, { recursive: true });
    
    const obsidianFiles = ultralink.toObsidian();
    for (const [filename, content] of Object.entries(obsidianFiles)) {
      await fs.writeFile(
        path.join(obsidianDir, `${filename}.md`),
        content
      );
    }
    logger.log('Obsidian export completed', {
      fileCount: Object.keys(obsidianFiles).length,
      format: 'Obsidian'
    });

    // Test subset exports
    const aspects = ['technical', 'collaboration', 'impact'];
    for (const aspect of aspects) {
      logger.log(`Testing ${aspect} subset export`);
      const subset = createEnhancedResearchTeamSubset(aspect);
      
      // Export subset to JSON
      const subsetJson = subset.toJSON();
      await fs.writeFile(
        path.join(OUTPUT_DIR, `research-team-${aspect}.json`),
        JSON.stringify(subsetJson, null, 2)
      );
      
      // Export subset to GraphML
      const subsetGraphml = subset.toGraphML();
      await fs.writeFile(
        path.join(OUTPUT_DIR, `research-team-${aspect}.graphml`),
        subsetGraphml
      );
      
      logger.log(`${aspect} subset export completed`, {
        entityCount: subset.entities.size,
        format: ['JSON', 'GraphML']
      });
    }

    // Test vector metadata handling
    logger.log('Testing vector metadata handling');
    const vectorStats = {
      totalVectors: 0,
      averageLength: 0,
      clusters: new Set()
    };

    for (const entity of ultralink.entities.values()) {
      if (entity.attributes.vector) {
        vectorStats.totalVectors++;
        vectorStats.averageLength += entity.attributes.vector.embedding.length;
        if (entity.attributes.vector.cluster) {
          vectorStats.clusters.add(entity.attributes.vector.cluster);
        }
      }
    }
    vectorStats.averageLength /= vectorStats.totalVectors;
    vectorStats.clusters = Array.from(vectorStats.clusters);

    logger.log('Vector metadata analysis completed', vectorStats);

    // Test temporal analysis
    logger.log('Testing temporal analysis');
    const temporalStats = {
      timeframes: ultralink.metadata.temporal_analysis.knowledge_evolution.map(e => e.timeframe),
      averageImpact: ultralink.metadata.temporal_analysis.knowledge_evolution.reduce(
        (acc, curr) => acc + curr.impact_score, 0
      ) / ultralink.metadata.temporal_analysis.knowledge_evolution.length
    };
    
    logger.log('Temporal analysis completed', temporalStats);

    logger.log('All rendering tests completed successfully');
  } catch (error) {
    logger.log('Error during rendering tests', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    await logger.save();
  }
}

// Execute tests if run directly
if (require.main === module) {
  runResearchTeamRenderTests().catch(console.error);
}

module.exports = { runResearchTeamRenderTests, RenderLogger }; 