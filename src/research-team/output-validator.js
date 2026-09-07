const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;
const xml2js = require('xml2js');

class OutputValidator {
  constructor(outputDir) {
    this.outputDir = outputDir;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  addResult(name, passed, details = {}) {
    this.results.total++;
    if (passed) this.results.passed++;
    else this.results.failed++;
    
    this.results.tests.push({
      name,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  async validateJSON(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Validate structure
      assert(Array.isArray(data.entities), 'Entities should be an array');
      assert(data.metadata, 'Metadata should exist');
      
      // Validate required metadata
      assert(data.metadata.temporal_analysis, 'Should have temporal analysis');
      assert(data.metadata.graph_metrics, 'Should have graph metrics');
      assert(data.metadata.cluster_analysis, 'Should have cluster analysis');
      
      // Validate metadata structure
      assert(data.metadata.graph_metrics.density >= 0, 'Graph density should be non-negative');
      assert(Array.isArray(data.metadata.cluster_analysis), 'Cluster analysis should be an array');
      assert(Array.isArray(data.metadata.temporal_analysis.knowledge_evolution), 'Knowledge evolution should be an array');
      
      // Validate entity structure
      for (const entity of data.entities) {
        assert(entity.id, 'Entity should have ID');
        assert(entity.type, 'Entity should have type');
        assert(entity.attributes, 'Entity should have attributes');
        
        // Validate vector data if present
        if (entity.attributes.vector) {
          assert(Array.isArray(entity.attributes.vector.embedding), 'Vector embedding should be an array');
          assert(typeof entity.attributes.vector.cluster === 'string', 'Vector cluster should be a string');
          assert(typeof entity.attributes.vector.centroid_distance === 'number', 'Centroid distance should be a number');
        }
        
        // Validate LLM insights if present
        if (entity.attributes.llm_insights) {
          assert(Array.isArray(entity.attributes.llm_insights.key_findings), 'Key findings should be an array');
          for (const finding of entity.attributes.llm_insights.key_findings) {
            assert(finding.confidence >= 0 && finding.confidence <= 1, 'Confidence should be between 0 and 1');
          }
        }
      }

      this.addResult('JSON Validation', true, {
        entityCount: data.entities.length,
        metadataKeys: Object.keys(data.metadata),
        entityTypes: [...new Set(data.entities.map(e => e.type))],
        vectorClusters: [...new Set(data.entities
          .filter(e => e.attributes.vector)
          .map(e => e.attributes.vector.cluster))]
      });
    } catch (error) {
      this.addResult('JSON Validation', false, {
        error: error.message
      });
    }
  }

  async validateGraphML(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(content);
      
      // Validate GraphML structure
      assert(result.graphml, 'Should be valid GraphML');
      assert(result.graphml.graph, 'Should contain graph element');
      
      // Validate nodes and edges
      const graph = result.graphml.graph[0];
      assert(graph.node, 'Should have nodes');
      assert(graph.edge, 'Should have edges');
      
      // Validate key definitions
      assert(result.graphml.key, 'Should have key definitions');
      const keys = result.graphml.key;
      const keyIds = keys.map(k => k.$.id);
      
      // Validate required attributes
      assert(keyIds.includes('vector_embedding'), 'Should have vector embedding key');
      assert(keyIds.includes('vector_cluster'), 'Should have vector cluster key');
      assert(keyIds.includes('type'), 'Should have type key');
      
      // Validate node data
      for (const node of graph.node) {
        assert(node.$.id, 'Node should have ID');
        if (node.data) {
          const dataKeys = node.data.map(d => d.$.key);
          assert(dataKeys.length > 0, 'Node should have data attributes');
        }
      }

      this.addResult('GraphML Validation', true, {
        nodeCount: graph.node.length,
        edgeCount: graph.edge.length,
        attributeKeys: keyIds,
        hasMetadataNode: graph.node.some(n => n.$.id === 'metadata')
      });
    } catch (error) {
      this.addResult('GraphML Validation', false, {
        error: error.message
      });
    }
  }

  async validateCSV(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Validate header
      const header = lines[0].split(',');
      assert(header.includes('id'), 'Should have ID column');
      assert(header.includes('type'), 'Should have type column');
      
      // Validate required columns
      const requiredPrefixes = ['vector_', 'temporal_', 'llm_insights_', 'metadata_'];
      for (const prefix of requiredPrefixes) {
        assert(header.some(col => col.startsWith(prefix)), `Should have ${prefix} columns`);
      }
      
      // Validate data rows
      const dataRows = lines.slice(1).filter(line => line.trim());
      for (const row of dataRows) {
        const cells = row.split(',');
        assert(cells.length === header.length, 'Row should have same number of columns as header');
        assert(cells[0], 'Row should have non-empty ID');
      }

      // Analyze column categories
      const columnCategories = {
        vector: header.filter(h => h.startsWith('vector_')),
        temporal: header.filter(h => h.startsWith('temporal_')),
        llm: header.filter(h => h.startsWith('llm_insights_')),
        metadata: header.filter(h => h.startsWith('metadata_'))
      };

      this.addResult('CSV Validation', true, {
        columnCount: header.length,
        rowCount: dataRows.length,
        columnCategories,
        uniqueTypes: [...new Set(dataRows.map(row => row.split(',')[header.indexOf('type')]))]
      });
    } catch (error) {
      this.addResult('CSV Validation', false, {
        error: error.message
      });
    }
  }

  async validateObsidian(dirPath) {
    try {
      const files = await fs.promises.readdir(dirPath);
      assert(files.length > 0, 'Should have markdown files');
      
      const validations = await Promise.all(files.map(async file => {
        const content = await fs.promises.readFile(path.join(dirPath, file), 'utf8');
        
        // Basic structure validation
        const hasTitle = content.includes('# ');
        const hasLinks = content.includes('[[');
        const hasVector = content.includes('vector');
        const hasMetadata = content.includes('## Metadata');
        
        // Section validation
        const sections = content.split('\n## ').map(s => s.split('\n')[0]);
        
        return {
          file,
          valid: hasTitle && hasLinks && hasVector && hasMetadata,
          sections: sections.filter(Boolean),
          linkCount: (content.match(/\[\[.*?\]\]/g) || []).length,
          hasVectorData: content.includes('Vector Metadata'),
          hasLLMInsights: content.includes('LLM Insights')
        };
      }));

      this.addResult('Obsidian Validation', true, {
        fileCount: files.length,
        validations,
        allValid: validations.every(v => v.valid),
        averageLinkCount: validations.reduce((acc, v) => acc + v.linkCount, 0) / validations.length
      });
    } catch (error) {
      this.addResult('Obsidian Validation', false, {
        error: error.message
      });
    }
  }

  async validateHTML(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      
      // Basic structure validation
      assert(content.includes('<!DOCTYPE html>'), 'Should be HTML5');
      assert(content.includes('<title>'), 'Should have title');
      assert(content.includes('vector-viz'), 'Should include vector visualization');
      assert(content.includes('llm-insight'), 'Should include LLM insights');
      
      // Style validation
      const hasStyles = content.includes('<style>');
      const styleContent = content.match(/<style>(.*?)<\/style>/s)?.[1] || '';
      
      // Content validation
      const entityCount = (content.match(/<div class="entity">/g) || []).length;
      const vectorVizCount = (content.match(/<div class="vector-viz">/g) || []).length;
      const llmInsightCount = (content.match(/<div class="llm-insight">/g) || []).length;

      this.addResult('HTML Validation', true, {
        size: content.length,
        hasStyles,
        styleRules: styleContent.split('}').length - 1,
        entityCount,
        vectorVizCount,
        llmInsightCount,
        hasResponsiveDesign: styleContent.includes('@media')
      });
    } catch (error) {
      this.addResult('HTML Validation', false, {
        error: error.message
      });
    }
  }

  async validateTimeline(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Structure validation
      assert(Array.isArray(data.events), 'Should have events array');
      assert(data.metadata, 'Should have timeline metadata');
      assert(data.metadata.start_date, 'Should have start date');
      assert(data.metadata.end_date, 'Should have end date');
      
      // Event validation
      for (const event of data.events) {
        assert(event.timeframe, 'Event should have timeframe');
        assert(Array.isArray(event.key_developments), 'Event should have key developments');
        assert(typeof event.impact_score === 'number', 'Event should have impact score');
        assert(event.impact_score >= 0 && event.impact_score <= 1, 'Impact score should be between 0 and 1');
      }
      
      // Timeline analysis
      const timeframes = data.events.map(e => e.timeframe);
      const impactScores = data.events.map(e => e.impact_score);
      const developmentCounts = data.events.map(e => e.key_developments.length);

      this.addResult('Timeline Validation', true, {
        eventCount: data.events.length,
        timeRange: `${data.metadata.start_date} to ${data.metadata.end_date}`,
        timeframes,
        averageImpact: impactScores.reduce((a, b) => a + b, 0) / impactScores.length,
        maxImpact: Math.max(...impactScores),
        averageDevelopments: developmentCounts.reduce((a, b) => a + b, 0) / developmentCounts.length
      });
    } catch (error) {
      this.addResult('Timeline Validation', false, {
        error: error.message
      });
    }
  }

  generateReport() {
    return {
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${((this.results.passed / this.results.total) * 100).toFixed(2)}%`
      },
      tests: this.results.tests
    };
  }
}

module.exports = OutputValidator; 