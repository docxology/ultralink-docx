const { getEntityType } = require("../utils");

class BayesianNetworkExporter {
  constructor(ultralink) {
    this.ultralink = ultralink;
  }

  /**
   * Generate a Bayesian network representation of the system
   * @param {Object} options - Export options
   * @param {string} options.outputFormat - Output format ('json' or 'bif')
   * @param {string} options.systemName - System name
   * @returns {string|Object} The Bayesian network representation
   */
  export(options = {}) {
    const { 
      outputFormat = 'json',
      systemName  
    } = options;
    
    // Get system type from options or determine from entities if not provided
    const entities = Object.values(this.ultralink.store.entities || {});
    const systemType = systemName || this._determineSystemType(entities);
    
    // Generate variables from both predefined system variables and actual entities
    const systemVariables = this._generateSystemVariables(systemName || systemType);
    const entityVariables = this._generateEntityVariables(entities);
    const variables = [...systemVariables, ...entityVariables];
    
    // Generate relationships
    const relationships = this._generateRelationships(variables);

    if (outputFormat === 'json') {
      return {
        metadata: {
          type: systemName || systemType,
          timestamp: new Date().toISOString()
        },
        nodes: variables.map(v => ({
          id: v.name,
          type: v.type,
          outcomes: v.outcomes,
          comment: v.comment
        })),
        edges: relationships.map(r => ({
          source: r.for,
          target: r.given ? r.given[0] : null,
          probabilities: Array.isArray(r.table[0]) 
            ? r.table.map(row => row.map(p => parseFloat(p.toFixed(5))))
            : r.table.map(p => parseFloat(p.toFixed(5)))
        })).filter(e => e.target !== null)
      };
    } else if (outputFormat === 'bif') {
      return this._generateBIF(systemName || systemType, variables, relationships);
    } else {
      throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  }

  _determineSystemType(entities) {
    if (entities.length === 0) return 'Generic';

    // First try to get the system type from the first entity's type
    const firstEntity = entities[0];
    if (firstEntity && firstEntity.type) {
      const systemType = firstEntity.type.split('/')[0];
      if (['Car', 'ResearchTeam', 'DesertEcosystem', 'ActiveInferenceLab', 'USAHistory', 'NeurofeedbackResearch', 'HumanAnatomy'].includes(systemType)) {
        return systemType;
      }
    }

    // Try to determine from entity types and IDs
    const types = entities.map(e => getEntityType(e).toLowerCase());
    const ids = entities.map(e => e.id.toLowerCase());
    const allText = [...types, ...ids].join(' ');

    // Try to determine from relationships
    const relationships = Object.values(this.ultralink.store.relationships || {});
    const relTypes = relationships.map(r => r.type.toLowerCase());
    const relText = relTypes.join(' ');

    // Check for specific system types
    if (allText.includes('researcher') || allText.includes('research') || allText.includes('team') ||
        relText.includes('collaborates') || relText.includes('researches')) {
      return 'ResearchTeam';
    }

    if (allText.includes('ecosystem') || allText.includes('desert') || allText.includes('species') ||
        relText.includes('lives_in') || relText.includes('feeds_on')) {
      return 'DesertEcosystem';
    }

    if (allText.includes('inference') || allText.includes('lab') || allText.includes('experiment') ||
        relText.includes('experiments') || relText.includes('analyzes')) {
      return 'ActiveInferenceLab';
    }

    if (allText.includes('history') || allText.includes('usa') || allText.includes('historical') ||
        relText.includes('precedes') || relText.includes('influences')) {
      return 'USAHistory';
    }

    if (allText.includes('neurofeedback') || allText.includes('brain') || allText.includes('patient') ||
        relText.includes('monitors') || relText.includes('treats')) {
      return 'NeurofeedbackResearch';
    }

    if (allText.includes('anatomy') || allText.includes('organ') || allText.includes('tissue') ||
        relText.includes('connects') || relText.includes('functions')) {
      return 'HumanAnatomy';
    }

    if (allText.includes('car') || allText.includes('engine') || allText.includes('vehicle') ||
        relText.includes('powers') || relText.includes('drives')) {
      return 'Car';
    }

    // If no specific system type is found, try to determine from the first entity's type
    if (firstEntity && firstEntity.type) {
      const baseType = firstEntity.type.split('/')[0];
      if (baseType && baseType !== 'entity') {
        return baseType;
      }
    }

    return 'Generic';
  }

  _generateSystemVariables(systemType) {
    const variables = [];
    
    // Common variables for all systems
    variables.push({
      name: 'system_state',
      type: 'state',
      outcomes: ['good', 'fair', 'poor'],
      comment: 'Overall system state'
    });
    
    // System-specific variables
    switch (systemType) {
      case 'Car':
        variables.push(
          {
            name: 'engine_system',
            type: 'condition',
            outcomes: ['normal', 'warning', 'critical'],
            comment: 'Engine system status'
          },
          {
            name: 'electrical_system',
            type: 'condition',
            outcomes: ['normal', 'warning', 'critical'],
            comment: 'Electrical system status'
          },
          {
            name: 'hvac_system',
            type: 'condition',
            outcomes: ['normal', 'warning', 'critical'],
            comment: 'HVAC system status'
          }
        );
        break;
        
      case 'ResearchTeam':
        variables.push(
          {
            name: 'researcher_productivity',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Individual researcher productivity'
          },
          {
            name: 'project_success',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Project success rate'
          },
          {
            name: 'team_collaboration',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Team collaboration effectiveness'
          }
        );
        break;
        
      case 'DesertEcosystem':
        variables.push(
          {
            name: 'temperature',
            type: 'condition',
            outcomes: ['normal', 'high', 'extreme'],
            comment: 'Desert temperature conditions'
          },
          {
            name: 'rainfall',
            type: 'condition',
            outcomes: ['adequate', 'low', 'drought'],
            comment: 'Rainfall levels'
          },
          {
            name: 'soil_quality',
            type: 'condition',
            outcomes: ['good', 'fair', 'poor'],
            comment: 'Soil quality status'
          }
        );
        break;
        
      case 'ActiveInferenceLab':
        variables.push(
          {
            name: 'experiment_success',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Experiment success rate'
          },
          {
            name: 'model_accuracy',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Model prediction accuracy'
          },
          {
            name: 'data_quality',
            type: 'condition',
            outcomes: ['good', 'fair', 'poor'],
            comment: 'Quality of collected data'
          }
        );
        break;
        
      case 'USAHistory':
        variables.push(
          {
            name: 'political_climate',
            type: 'state',
            outcomes: ['stable', 'tense', 'volatile'],
            comment: 'Political climate state'
          },
          {
            name: 'economic_conditions',
            type: 'state',
            outcomes: ['growth', 'stable', 'recession'],
            comment: 'Economic conditions'
          },
          {
            name: 'social_change',
            type: 'state',
            outcomes: ['progressive', 'moderate', 'conservative'],
            comment: 'Social change dynamics'
          }
        );
        break;
        
      case 'NeurofeedbackResearch':
        variables.push(
          {
            name: 'brain_activity',
            type: 'condition',
            outcomes: ['normal', 'elevated', 'suppressed'],
            comment: 'Brain activity patterns'
          },
          {
            name: 'feedback_effectiveness',
            type: 'performance',
            outcomes: ['high', 'medium', 'low'],
            comment: 'Neurofeedback effectiveness'
          },
          {
            name: 'patient_progress',
            type: 'performance',
            outcomes: ['good', 'moderate', 'limited'],
            comment: 'Patient progress status'
          }
        );
        break;
        
      case 'HumanAnatomy':
        variables.push(
          {
            name: 'organ_function',
            type: 'condition',
            outcomes: ['normal', 'impaired', 'critical'],
            comment: 'Organ functionality'
          },
          {
            name: 'system_health',
            type: 'condition',
            outcomes: ['healthy', 'stressed', 'failing'],
            comment: 'Overall system health'
          },
          {
            name: 'tissue_condition',
            type: 'condition',
            outcomes: ['normal', 'inflamed', 'damaged'],
            comment: 'Tissue condition status'
          }
        );
        break;
    }
    
    return variables;
  }

  _generateEntityVariables(entities) {
    return entities.map(entity => ({
      name: entity.id,
      type: 'discrete',
      outcomes: ['true', 'false'],
      comment: `State of entity ${entity.id}`
    }));
  }

  _generateRelationships(variables) {
    const relationships = [];
    
    // Add base relationship for each variable
    variables.forEach(variable => {
      const relationship = {
        for: variable.name,
        given: null,
        table: []
      };
      
      // Generate probabilities based on variable type
      relationship.table = this._generateBaseProbabilities(variable);
      
      // Normalize probabilities to sum to 1
      if (Array.isArray(relationship.table[0])) {
        // Multi-dimensional table
        for (let i = 0; i < relationship.table.length; i++) {
          const sum = relationship.table[i].reduce((a, b) => a + b, 0);
          relationship.table[i] = relationship.table[i].map(p => p / sum);
        }
      } else {
        // One-dimensional table
        const sum = relationship.table.reduce((a, b) => a + b, 0);
        relationship.table = relationship.table.map(p => p / sum);
      }
      
      relationships.push(relationship);
    });
    
    // Add relationships between variables
    variables.forEach(variable => {
      const related = this._findRelatedVariables(variable, variables);
      if (related.length > 0) {
        relationships.push({
          for: variable.name,
          given: related.map(r => r.name),
          table: this._generateProbabilityTable(variable, related)
        });
      }
    });

    return relationships;
  }

  _findRelatedVariables(variable, variables) {
    // System-specific relationships
    const relationships = {
      // Car system
      engine_system: ['fuel_injection', 'engine_block', 'cooling_system'],
      electrical_system: ['battery', 'alternator'],
      hvac_system: ['electrical_system'],
      airbag_system: ['electrical_system'],
      brake_system: ['electrical_system'],

      // Research team
      project_success: ['researcher_productivity', 'team_collaboration', 'resource_availability'],
      publication_output: ['researcher_productivity', 'project_success'],

      // Desert ecosystem
      biodiversity: ['temperature', 'rainfall', 'soil_quality'],
      vegetation_cover: ['rainfall', 'soil_quality'],

      // Active inference lab
      model_performance: ['data_quality', 'computational_resources'],
      experiment_success: ['model_performance', 'data_quality'],
      algorithm_convergence: ['computational_resources', 'model_performance'],

      // USA History
      economic_growth: ['political_stability', 'technological_advancement'],
      social_change: ['economic_growth', 'political_stability'],
      international_relations: ['political_stability', 'economic_growth'],

      // Neurofeedback research
      feedback_accuracy: ['brain_activity', 'signal_quality'],
      patient_progress: ['feedback_accuracy', 'treatment_adherence'],

      // Human anatomy
      system_health: ['organ_function', 'cellular_activity'],
      tissue_integrity: ['cellular_activity', 'metabolic_rate'],
      organ_function: ['cellular_activity', 'metabolic_rate']
    };

    // Add relationships from actual entities
    const entityRelationships = Object.values(this.ultralink.store.relationships || {});
    entityRelationships.forEach(rel => {
      if (!relationships[rel.source]) {
        relationships[rel.source] = [];
      }
      relationships[rel.source].push(rel.target);
    });

    return variables.filter(v => 
      relationships[variable.name]?.includes(v.name)
    );
  }

  _generateProbabilityTable(variable, givenVariables = []) {
    // Get base probabilities for the variable
    const baseProbabilities = this._generateBaseProbabilities(variable);
    
    if (givenVariables.length === 0) {
      // Normalize probabilities to sum to 1
      const sum = baseProbabilities.reduce((a, b) => a + b, 0);
      return baseProbabilities.map(p => p / sum);
    }
    
    // Calculate table size based on given variables
    const tableSize = this._calculateTableSize(givenVariables);
    const table = [];
    
    // Generate probability table for each combination of given variables
    for (let i = 0; i < tableSize; i++) {
      // Create a row of probabilities
      const row = baseProbabilities.map(p => {
        // Add some variation based on the combination index
        const variation = (Math.sin(i * 0.5) * 0.1) + 1;
        return p * variation;
      });
      
      // Normalize row to sum to 1
      const rowSum = row.reduce((a, b) => a + b, 0);
      table.push(row.map(p => p / rowSum));
    }
    
    return table;
  }

  _generateBaseProbabilities(variable) {
    // Generate base probabilities based on variable type
    const type = variable.type || 'default';
    let probabilities;
    
    switch (type.toLowerCase()) {
      case 'state':
        probabilities = [0.7, 0.2, 0.1]; // good, fair, poor
        break;
      case 'performance':
        probabilities = [0.6, 0.3, 0.1]; // high, medium, low
        break;
      case 'condition':
        probabilities = [0.8, 0.15, 0.05]; // normal, warning, critical
        break;
      case 'binary':
        probabilities = [0.9, 0.1]; // true, false
        break;
      default:
        // Generate random probabilities that sum to approximately 1
        probabilities = [];
        const numOutcomes = variable.outcomes?.length || 2;
        for (let i = 0; i < numOutcomes; i++) {
          probabilities.push(Math.random());
        }
    }
    
    // Normalize probabilities to sum to 1
    const sum = probabilities.reduce((a, b) => a + b, 0);
    return probabilities.map(p => p / sum);
  }

  _calculateTableSize(givenVariables) {
    return givenVariables.reduce((size, variable) => 
      size * variable.outcomes.length, 1);
  }

  _generateBIF(systemName, variables, relationships) {
    // Generate BIF XML format
    const lines = [
      '<?xml version="1.0"?>',
      '<BIF VERSION="0.3">',
      '<NETWORK>',
      `<n>${systemName}</n>`,
      `<COMMENT>Bayesian Network representing ${systemName} system components and their dependencies</COMMENT>`,
      '',
      '<!-- Variables -->',
    ];
    
    // Add variables
    variables.forEach(variable => {
      lines.push(this._formatVariable(variable));
    });
    
    lines.push('');
    lines.push('<!-- Probability Distributions -->');
    
    // Add probability distributions
    relationships.forEach(relationship => {
      lines.push(this._formatDefinition(relationship));
    });
    
    lines.push('</NETWORK>');
    lines.push('</BIF>');
    
    return lines.join('\n');
  }

  _formatVariable(variable) {
    return `<VARIABLE TYPE="discrete">
    <NAME>${variable.name}</NAME>
    ${variable.outcomes.map(outcome => `    <OUTCOME>${outcome}</OUTCOME>`).join('\n')}
    <COMMENT>${variable.comment || ''}</COMMENT>
</VARIABLE>`;
  }

  _formatDefinition(relationship) {
    const lines = [
      '<DEFINITION>',
      `    <FOR>${relationship.for}</FOR>`
    ];
    
    // Add given variables if any
    if (relationship.given && relationship.given.length > 0) {
      relationship.given.forEach(given => {
        lines.push(`    <GIVEN>${given}</GIVEN>`);
      });
    }
    
    // Add probability table
    if (Array.isArray(relationship.table[0])) {
      // Multi-dimensional table
      const tableLines = relationship.table.map(row => 
        row.map(p => p.toFixed(5)).join(' ')
      );
      lines.push(`    <TABLE>${tableLines.join(' ')}</TABLE>`);
    } else {
      // One-dimensional table
      const tableValues = relationship.table.map(p => p.toFixed(5)).join(' ');
      lines.push(`    <TABLE>${tableValues}</TABLE>`);
    }
    
    lines.push('</DEFINITION>');
    return lines.join('\n');
  }
}

module.exports = BayesianNetworkExporter; 