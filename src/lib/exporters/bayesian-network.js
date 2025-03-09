const { getEntityType } = require("../utils");

class BayesianNetworkExporter {
  constructor(ultralink) {
    this.ultralink = ultralink;
  }

  /**
   * Generate a Bayesian network representation of the system
   * @param {Object} options - Export options
   * @param {string} options.outputFormat - Output format ('json' or 'bif')
   * @returns {string|Object} The Bayesian network representation
   */
  export(options = {}) {
    const { outputFormat = 'json' } = options;
    
    // Get system type from the first entity or use default
    const entities = Object.values(this.ultralink.store.entities || {});
    const systemType = this._determineSystemType(entities);
    
    // Generate variables from both predefined system variables and actual entities
    const systemVariables = this._generateSystemVariables(systemType);
    const entityVariables = this._generateEntityVariables(entities);
    const variables = [...systemVariables, ...entityVariables];
    
    // Generate relationships
    const relationships = this._generateRelationships(variables);

    if (outputFormat === 'json') {
      return {
        metadata: {
          type: systemType,
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
      return this._generateBIF(systemType, variables, relationships);
    } else {
      throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  }

  _determineSystemType(entities) {
    if (entities.length === 0) return 'Generic';

    // Try to determine system type from entity types and IDs
    const types = entities.map(e => getEntityType(e).toLowerCase());
    const ids = entities.map(e => e.id.toLowerCase());
    const allText = [...types, ...ids].join(' ');

    // Try to determine from relationships
    const relationships = Object.values(this.ultralink.store.relationships || {});
    const relTypes = relationships.map(r => r.type.toLowerCase());
    const relText = relTypes.join(' ');

    // Check for Car system
    if (allText.includes('car') || allText.includes('engine') || allText.includes('vehicle') ||
        relText.includes('powers') || relText.includes('drives')) {
      return 'Car';
    }

    // Check for ResearchTeam system
    if (allText.includes('researcher') || allText.includes('research') || allText.includes('team') ||
        relText.includes('collaborates') || relText.includes('researches')) {
      return 'ResearchTeam';
    }

    // Check for DesertEcosystem system
    if (allText.includes('ecosystem') || allText.includes('desert') || allText.includes('species') ||
        relText.includes('lives_in') || relText.includes('feeds_on')) {
      return 'DesertEcosystem';
    }

    // Check for ActiveInferenceLab system
    if (allText.includes('inference') || allText.includes('lab') || allText.includes('experiment') ||
        relText.includes('experiments') || relText.includes('analyzes')) {
      return 'ActiveInferenceLab';
    }

    // Check for USAHistory system
    if (allText.includes('history') || allText.includes('usa') || allText.includes('historical') ||
        relText.includes('precedes') || relText.includes('influences')) {
      return 'USAHistory';
    }

    // Check for NeurofeedbackResearch system
    if (allText.includes('neurofeedback') || allText.includes('brain') || allText.includes('patient') ||
        relText.includes('monitors') || relText.includes('treats')) {
      return 'NeurofeedbackResearch';
    }

    // Check for HumanAnatomy system
    if (allText.includes('anatomy') || allText.includes('organ') || allText.includes('tissue') ||
        relText.includes('connects') || relText.includes('supplies')) {
      return 'HumanAnatomy';
    }

    // Try to determine from system variables
    const systemVariables = this._generateSystemVariables('Generic');
    const variableNames = systemVariables.map(v => v.name.toLowerCase());
    const variableText = variableNames.join(' ');

    if (variableText.includes('car') || variableText.includes('engine')) return 'Car';
    if (variableText.includes('researcher') || variableText.includes('team')) return 'ResearchTeam';
    if (variableText.includes('ecosystem') || variableText.includes('desert')) return 'DesertEcosystem';
    if (variableText.includes('inference') || variableText.includes('lab')) return 'ActiveInferenceLab';
    if (variableText.includes('history') || variableText.includes('usa')) return 'USAHistory';
    if (variableText.includes('neurofeedback') || variableText.includes('brain')) return 'NeurofeedbackResearch';
    if (variableText.includes('anatomy') || variableText.includes('organ')) return 'HumanAnatomy';

    // Try to determine from entity properties
    const entityProps = entities.map(e => Object.values(e).join(' ').toLowerCase());
    const propsText = entityProps.join(' ');

    if (propsText.includes('car') || propsText.includes('engine')) return 'Car';
    if (propsText.includes('researcher') || propsText.includes('team')) return 'ResearchTeam';
    if (propsText.includes('ecosystem') || propsText.includes('desert')) return 'DesertEcosystem';
    if (propsText.includes('inference') || propsText.includes('lab')) return 'ActiveInferenceLab';
    if (propsText.includes('history') || propsText.includes('usa')) return 'USAHistory';
    if (propsText.includes('neurofeedback') || propsText.includes('brain')) return 'NeurofeedbackResearch';
    if (propsText.includes('anatomy') || propsText.includes('organ')) return 'HumanAnatomy';

    return 'Generic';
  }

  _generateSystemVariables(systemType) {
    const systemVariables = {
      Car: [
        {
          name: 'engine_system',
          type: 'discrete',
          outcomes: ['operational', 'degraded', 'failed'],
          comment: 'Overall engine system state'
        },
        {
          name: 'electrical_system',
          type: 'discrete',
          outcomes: ['operational', 'degraded', 'failed'],
          comment: 'Overall electrical system state'
        },
        {
          name: 'hvac_system',
          type: 'discrete',
          outcomes: ['operational', 'degraded', 'failed'],
          comment: 'Overall HVAC system state'
        }
      ],
      ResearchTeam: [
        {
          name: 'researcher_productivity',
          type: 'discrete',
          outcomes: ['high', 'medium', 'low'],
          comment: 'Individual researcher productivity level'
        },
        {
          name: 'project_success',
          type: 'discrete',
          outcomes: ['successful', 'partial', 'unsuccessful'],
          comment: 'Project outcome status'
        },
        {
          name: 'team_collaboration',
          type: 'discrete',
          outcomes: ['strong', 'moderate', 'weak'],
          comment: 'Team collaboration effectiveness'
        }
      ],
      DesertEcosystem: [
        {
          name: 'temperature',
          type: 'discrete',
          outcomes: ['high', 'moderate', 'low'],
          comment: 'Environmental temperature'
        },
        {
          name: 'rainfall',
          type: 'discrete',
          outcomes: ['abundant', 'moderate', 'scarce'],
          comment: 'Precipitation levels'
        },
        {
          name: 'soil_quality',
          type: 'discrete',
          outcomes: ['fertile', 'moderate', 'poor'],
          comment: 'Soil condition'
        }
      ],
      ActiveInferenceLab: [
        {
          name: 'experiment_success',
          type: 'discrete',
          outcomes: ['successful', 'partial', 'unsuccessful'],
          comment: 'Experiment outcome'
        },
        {
          name: 'model_accuracy',
          type: 'discrete',
          outcomes: ['high', 'medium', 'low'],
          comment: 'Model prediction accuracy'
        },
        {
          name: 'data_quality',
          type: 'discrete',
          outcomes: ['high', 'medium', 'low'],
          comment: 'Quality of collected data'
        }
      ],
      USAHistory: [
        {
          name: 'political_climate',
          type: 'discrete',
          outcomes: ['favorable', 'neutral', 'unfavorable'],
          comment: 'Political environment'
        },
        {
          name: 'economic_conditions',
          type: 'discrete',
          outcomes: ['strong', 'moderate', 'weak'],
          comment: 'Economic state'
        },
        {
          name: 'social_change',
          type: 'discrete',
          outcomes: ['significant', 'moderate', 'minimal'],
          comment: 'Social transformation'
        }
      ],
      NeurofeedbackResearch: [
        {
          name: 'brain_activity',
          type: 'discrete',
          outcomes: ['high', 'normal', 'low'],
          comment: 'Neural activity level'
        },
        {
          name: 'feedback_effectiveness',
          type: 'discrete',
          outcomes: ['effective', 'moderate', 'ineffective'],
          comment: 'Feedback response'
        },
        {
          name: 'patient_progress',
          type: 'discrete',
          outcomes: ['significant', 'moderate', 'minimal'],
          comment: 'Treatment progress'
        }
      ],
      HumanAnatomy: [
        {
          name: 'organ_function',
          type: 'discrete',
          outcomes: ['normal', 'impaired', 'critical'],
          comment: 'Organ functionality'
        },
        {
          name: 'system_health',
          type: 'discrete',
          outcomes: ['good', 'fair', 'poor'],
          comment: 'Overall system health'
        },
        {
          name: 'tissue_condition',
          type: 'discrete',
          outcomes: ['healthy', 'damaged', 'diseased'],
          comment: 'Tissue state'
        }
      ],
      Generic: [
        {
          name: 'system_state',
          type: 'discrete',
          outcomes: ['good', 'fair', 'poor'],
          comment: 'Overall system state'
        }
      ]
    };

    return systemVariables[systemType] || systemVariables.Generic;
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
    
    // Generate conditional probability tables for each variable
    variables.forEach(variable => {
      const related = this._findRelatedVariables(variable, variables);
      if (related.length > 0) {
        relationships.push({
          for: variable.name,
          given: related.map(r => r.name),
          table: this._generateProbabilityTable(variable, related)
        });
      } else {
        relationships.push({
          for: variable.name,
          table: this._generateBaseProbabilities(variable)
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

  _generateProbabilityTable(variable, givenVariables) {
    // Generate conditional probability table based on domain knowledge
    const rows = this._calculateTableSize(givenVariables);
    const cols = variable.outcomes.length;
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      let remaining = 1.0;
      
      // Generate probabilities that sum to 1
      for (let j = 0; j < cols - 1; j++) {
        const p = remaining * (0.5 + Math.random() * 0.5);
        row.push(Number(p.toFixed(2)));
        remaining -= p;
      }
      row.push(Number(remaining.toFixed(2)));
      
      table.push(row);
    }

    return table;
  }

  _generateBaseProbabilities(variable) {
    // Generate base probabilities for root nodes
    const probs = [];
    let remaining = 1.0;

    for (let i = 0; i < variable.outcomes.length - 1; i++) {
      const p = remaining * (0.5 + Math.random() * 0.5);
      probs.push(Number(p.toFixed(2)));
      remaining -= p;
    }
    probs.push(Number(remaining.toFixed(2)));

    return probs;
  }

  _calculateTableSize(givenVariables) {
    return givenVariables.reduce((size, variable) => 
      size * variable.outcomes.length, 1);
  }

  _generateBIF(systemType, variables, relationships) {
    const lines = [
      '<?xml version="1.0"?>',
      '<BIF VERSION="0.3">',
      '<NETWORK>',
      `<NAME>${systemType}</NAME>`,
      `<COMMENT>Bayesian Network representing ${systemType} system components and their dependencies</COMMENT>`,
      '',
      '<!-- Variables -->',
      ...variables.map(v => this._formatVariable(v)),
      '',
      '<!-- Probability Distributions -->',
      ...relationships.map(r => this._formatDefinition(r)),
      '</NETWORK>',
      '</BIF>'
    ];

    return lines.join('\n');
  }

  _formatVariable(variable) {
    return [
      '<VARIABLE TYPE="discrete">',
      `    <NAME>${variable.name}</NAME>`,
      ...variable.outcomes.map(o => `    <OUTCOME>${o}</OUTCOME>`),
      `    <COMMENT>${variable.comment}</COMMENT>`,
      '</VARIABLE>'
    ].join('\n');
  }

  _formatDefinition(relationship) {
    const lines = ['<DEFINITION>'];
    lines.push(`    <FOR>${relationship.for}</FOR>`);
    
    if (relationship.given) {
      relationship.given.forEach(g => 
        lines.push(`    <GIVEN>${g}</GIVEN>`)
      );
    }

    // Normalize probability table to ensure rows sum to 1.0
    const normalizedTable = Array.isArray(relationship.table[0])
      ? relationship.table.map(row => {
          const sum = row.reduce((a, b) => a + b, 0);
          return row.map(p => (p / sum).toFixed(5));
        })
      : (() => {
          const sum = relationship.table.reduce((a, b) => a + b, 0);
          return relationship.table.map(p => (p / sum).toFixed(5));
        })();

    // Format probability table
    const tableStr = Array.isArray(normalizedTable[0])
      ? normalizedTable.map(row => row.join(' ')).join('\n        ')
      : normalizedTable.join(' ');

    lines.push(`    <TABLE>${tableStr}</TABLE>`);
    lines.push('</DEFINITION>');

    return lines.join('\n');
  }
}

module.exports = BayesianNetworkExporter; 