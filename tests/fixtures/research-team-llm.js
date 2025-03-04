/**
 * Research Team LLM Test Fixtures
 * 
 * Enhanced version of the research team dataset that includes LLM-generated
 * content with vector metadata, statement justifications, distances, cluster
 * centroids, and critical parameters.
 */

const { UltraLink } = require('../../src');
const { createResearchTeamDataset } = require('./research-team');

/**
 * Create an enhanced research team dataset with LLM metadata
 * @returns {UltraLink} Populated UltraLink instance
 */
function createEnhancedResearchTeamDataset() {
  const ultralink = createResearchTeamDataset();
  
  // Add vector metadata to knowledge areas
  const mlTheory = ultralink.entities.get('machine-learning-theory');
  mlTheory.attributes.vector = {
    embedding: [0.23, 0.45, -0.12, 0.78], // Example vector embedding
    cluster: 'core-ml-concepts',
    centroid_distance: 0.12,
    similar_concepts: [
      { id: 'statistical-learning', similarity: 0.92 },
      { id: 'optimization-theory', similarity: 0.85 }
    ]
  };
  
  const computerVision = ultralink.entities.get('computer-vision');
  computerVision.attributes.vector = {
    embedding: [0.56, -0.23, 0.67, 0.11],
    cluster: 'applied-ml',
    centroid_distance: 0.15,
    similar_concepts: [
      { id: 'image-processing', similarity: 0.88 },
      { id: 'deep-learning', similarity: 0.82 }
    ]
  };
  
  // Add LLM-generated insights to projects
  const visionProject = ultralink.entities.get('computer-vision-project');
  visionProject.attributes.llm_insights = {
    key_findings: [
      {
        statement: "Novel low-light detection algorithm outperforms SOTA by 15%",
        justification: "Based on comparative analysis of benchmark results",
        confidence: 0.89,
        supporting_evidence: ['vision-paper-2022', 'benchmark-data-2023']
      },
      {
        statement: "Real-time processing achieved through innovative GPU optimization",
        justification: "Performance metrics from system logs and testing",
        confidence: 0.92,
        supporting_evidence: ['gpu-cluster-logs', 'performance-report-q2']
      }
    ],
    critical_parameters: {
      learning_rate: { value: 0.001, justification: "Optimal convergence in low-light conditions" },
      batch_size: { value: 32, justification: "Balance between memory usage and training stability" }
    },
    risk_assessment: {
      technical_risks: [
        { risk: "GPU memory constraints", probability: 0.4, impact: 0.7 },
        { risk: "Dataset bias in low-light conditions", probability: 0.3, impact: 0.8 }
      ]
    }
  };
  
  // Add research impact metrics
  const paperVision = ultralink.entities.get('vision-paper-2022');
  paperVision.attributes.impact_metrics = {
    citation_network: {
      vector: [0.34, 0.67, -0.21, 0.45],
      influential_citations: [
        {
          paper_id: "10.1234/vision2023.123",
          title: "Advances in Low-Light Computer Vision",
          impact_score: 0.85
        }
      ],
      research_threads: [
        {
          topic: "Low-light object detection",
          papers: ["vision-paper-2022", "vision2023.123", "lowlight2023.456"],
          coherence_score: 0.78
        }
      ]
    },
    methodology_assessment: {
      novelty_score: 0.82,
      reproducibility_score: 0.75,
      justification: "Novel approach with well-documented methodology and public code"
    }
  };
  
  // Add team collaboration insights
  const alice = ultralink.entities.get('alice-chen');
  alice.attributes.collaboration_metrics = {
    expertise_vector: [0.89, 0.76, 0.45, 0.23],
    team_impact: {
      mentorship_effectiveness: 0.92,
      project_contributions: [
        {
          project_id: 'computer-vision-project',
          role: 'lead',
          impact_score: 0.88,
          key_contributions: ["architecture_design", "methodology_development"]
        }
      ]
    },
    knowledge_transfer: {
      topics_taught: [
        {
          topic: "Computer Vision",
          students: ["carol-jones"],
          effectiveness_score: 0.85
        }
      ]
    }
  };
  
  // Add resource utilization analytics
  const gpuCluster = ultralink.entities.get('gpu-cluster');
  gpuCluster.attributes.utilization_analytics = {
    usage_patterns: {
      vector: [0.45, 0.78, 0.34, -0.12],
      peak_times: [
        { timeframe: "Mon-Fri 10:00-16:00", utilization: 0.92 },
        { timeframe: "Weekends", utilization: 0.45 }
      ],
      project_allocation: [
        {
          project_id: 'computer-vision-project',
          gpu_hours: 1200,
          efficiency_score: 0.88
        },
        {
          project_id: 'nlp-project',
          gpu_hours: 800,
          efficiency_score: 0.82
        }
      ]
    },
    optimization_recommendations: [
      {
        recommendation: "Implement job scheduling for better resource utilization",
        expected_impact: 0.25,
        justification: "Based on current usage patterns and peak time analysis"
      }
    ]
  };
  
  // Add knowledge graph metadata
  ultralink.metadata = {
    graph_metrics: {
      density: 0.45,
      clustering_coefficient: 0.67,
      average_path_length: 2.3
    },
    cluster_analysis: [
      {
        name: "core-ml-concepts",
        centroid: [0.34, 0.56, -0.23, 0.89],
        members: ["machine-learning-theory", "computer-vision", "nlp"],
        coherence: 0.82
      },
      {
        name: "applied-research",
        centroid: [0.67, -0.12, 0.45, 0.23],
        members: ["computer-vision-project", "nlp-project"],
        coherence: 0.75
      }
    ],
    temporal_analysis: {
      knowledge_evolution: [
        {
          timeframe: "2021-Q1",
          key_developments: ["computer-vision-project-start"],
          impact_score: 0.78
        },
        {
          timeframe: "2022-Q2",
          key_developments: ["vision-paper-publication"],
          impact_score: 0.85
        }
      ]
    }
  };
  
  return ultralink;
}

/**
 * Create a subset of the enhanced research team data focused on LLM insights
 * @param {String} aspect - Aspect to focus on ('technical', 'collaboration', 'impact')
 * @returns {UltraLink} UltraLink instance with focused subset
 */
function createEnhancedResearchTeamSubset(aspect) {
  const ultralink = new UltraLink();
  const fullDataset = createEnhancedResearchTeamDataset();
  
  switch (aspect) {
    case 'technical':
      // Focus on technical insights and metrics
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'project' || 
            entity.type === 'knowledge-area' ||
            entity.type === 'equipment') {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    case 'collaboration':
      // Focus on team collaboration and knowledge transfer
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'person' || 
            entity.attributes.collaboration_metrics ||
            entity.attributes.team_impact) {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    case 'impact':
      // Focus on research impact and citations
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'publication' ||
            entity.attributes.impact_metrics ||
            entity.attributes.citation_network) {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    default:
      throw new Error(`Unknown aspect: ${aspect}`);
  }
  
  // Copy graph metadata
  ultralink.metadata = fullDataset.metadata;
  
  return ultralink;
}

module.exports = {
  createEnhancedResearchTeamDataset,
  createEnhancedResearchTeamSubset
}; 