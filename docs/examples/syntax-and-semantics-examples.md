# UltraLink Syntax and Semantics Examples

This document provides practical examples of UltraLink's syntax and semantics across various use cases. These examples demonstrate the correct usage patterns and best practices for working with UltraLink.

## Table of Contents

1. [Basic Knowledge Graph Construction](#basic-knowledge-graph-construction)
2. [Academic Research Knowledge Graph](#academic-research-knowledge-graph)
3. [Product Documentation Knowledge Graph](#product-documentation-knowledge-graph)
4. [Organizational Knowledge Graph](#organizational-knowledge-graph)
5. [Educational Curriculum Knowledge Graph](#educational-curriculum-knowledge-graph)
6. [Historical Timeline Knowledge Graph](#historical-timeline-knowledge-graph)
7. [Medical Knowledge Graph](#medical-knowledge-graph)
8. [Software Architecture Knowledge Graph](#software-architecture-knowledge-graph)
9. [Semantic Search Examples](#semantic-search-examples)
10. [Multi-Format Export Examples](#multi-format-export-examples)

## Basic Knowledge Graph Construction

This example demonstrates the fundamental syntax for building a simple knowledge graph:

```javascript
const { UltraLink } = require('ultralink');

// Initialize UltraLink
const ultralink = new UltraLink({
  preventOverwrite: true,
  timestampEntities: true
});

// Creating entities
ultralink.addEntity('alice', 'person', {
  name: 'Alice Chen',
  age: 32,
  skills: ['programming', 'data analysis', 'project management']
});

ultralink.addEntity('bob', 'person', {
  name: 'Bob Smith',
  age: 28,
  skills: ['design', 'user research', 'prototyping']
});

ultralink.addEntity('project-x', 'project', {
  name: 'Project X',
  start_date: '2023-01-15',
  status: 'in_progress',
  description: 'A machine learning system for predictive analytics'
});

// Creating relationships
ultralink.addRelationship('alice', 'project-x', 'leads', {
  start_date: '2023-01-15',
  role: 'Project Manager'
});

ultralink.addRelationship('bob', 'project-x', 'works_on', {
  start_date: '2023-01-20',
  role: 'UX Designer'
});

ultralink.addRelationship('alice', 'bob', 'manages', {
  project: 'project-x'
});

// Simple querying
const projectLeads = ultralink.findRelationships({
  type: 'leads'
});

const inProgressProjects = ultralink.findEntities({
  type: 'project',
  attributes: {
    status: 'in_progress'
  }
});

// Export to JSON (basic format)
const jsonOutput = ultralink.toJSON({ pretty: true });
console.log(jsonOutput);
```

## Academic Research Knowledge Graph

This example demonstrates creating a knowledge graph for academic research:

```javascript
// Define custom entity types
ultralink.defineEntityType('research_paper', {
  parent: 'document',
  attributes: {
    title: { type: 'string', required: true },
    authors: { type: 'string[]', required: true },
    publication_date: { type: 'date' },
    journal: { type: 'string' },
    doi: { type: 'string' },
    abstract: { type: 'text' },
    keywords: { type: 'string[]' }
  }
});

ultralink.defineEntityType('research_concept', {
  parent: 'concept',
  attributes: {
    name: { type: 'string', required: true },
    definition: { type: 'text' },
    related_fields: { type: 'string[]' },
    importance: { type: 'number', min: 0, max: 1 }
  }
});

// Define relationship types
ultralink.defineRelationshipType('cites', {
  sourceTypes: ['research_paper'],
  targetTypes: ['research_paper'],
  attributes: {
    context: { type: 'text' },
    page_number: { type: 'number' },
    significance: { 
      type: 'enum', 
      values: ['supportive', 'contradictory', 'background']
    }
  }
});

ultralink.defineRelationshipType('introduces', {
  sourceTypes: ['research_paper'],
  targetTypes: ['research_concept'],
  attributes: {
    significance: { type: 'number', min: 0, max: 1 },
    first_mention_page: { type: 'number' }
  }
});

// Creating entities
ultralink.addEntity('paper-001', 'research_paper', {
  title: 'Attention Is All You Need',
  authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 
            'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
  publication_date: '2017-06-12',
  journal: 'Advances in Neural Information Processing Systems',
  doi: '10.48550/arXiv.1706.03762',
  abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
  keywords: ['transformer', 'attention mechanism', 'neural networks', 'sequence modeling']
});

ultralink.addEntity('paper-002', 'research_paper', {
  title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
  authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
  publication_date: '2018-10-11',
  journal: 'NAACL-HLT 2019',
  doi: '10.48550/arXiv.1810.04805',
  abstract: 'We introduce a new language representation model called BERT...',
  keywords: ['BERT', 'transformers', 'language representation', 'pre-training']
});

ultralink.addEntity('concept-transformer', 'research_concept', {
  name: 'Transformer Architecture',
  definition: 'A neural network architecture based on self-attention mechanisms...',
  related_fields: ['natural language processing', 'deep learning', 'neural networks'],
  importance: 0.95
});

// Creating relationships
ultralink.addRelationship('paper-001', 'concept-transformer', 'introduces', {
  significance: 0.98,
  first_mention_page: 1
});

ultralink.addRelationship('paper-002', 'paper-001', 'cites', {
  context: 'Fundamental architecture upon which BERT is built',
  significance: 'supportive'
});

// Vector-based search for relevant papers
const similarPapers = await ultralink.findSimilarToText(
  'self-attention mechanisms in language models', 
  {
    types: ['research_paper'],
    threshold: 0.7,
    limit: 5
  }
);
```

## Product Documentation Knowledge Graph

This example demonstrates creating a knowledge graph for product documentation:

```javascript
// Define custom entity types
ultralink.defineEntityType('feature', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text', required: true },
    status: { 
      type: 'enum', 
      values: ['planned', 'in_development', 'released', 'deprecated'],
      required: true
    },
    version_introduced: { type: 'string' },
    api_endpoints: { type: 'string[]' }
  }
});

ultralink.defineEntityType('tutorial', {
  parent: 'document',
  attributes: {
    title: { type: 'string', required: true },
    difficulty: { 
      type: 'enum', 
      values: ['beginner', 'intermediate', 'advanced'] 
    },
    estimated_time: { type: 'number' },
    prerequisites: { type: 'string[]' }
  }
});

// Creating entities
ultralink.addEntity('feature-auth', 'feature', {
  name: 'Authentication API',
  description: 'Secure authentication system with OAuth 2.0 support',
  status: 'released',
  version_introduced: '1.2.0',
  api_endpoints: ['/auth/login', '/auth/register', '/auth/refresh']
});

ultralink.addEntity('feature-analytics', 'feature', {
  name: 'Analytics Dashboard',
  description: 'Real-time analytics dashboard with customizable views',
  status: 'released',
  version_introduced: '1.5.0',
  api_endpoints: ['/analytics/metrics', '/analytics/reports']
});

ultralink.addEntity('tutorial-auth', 'tutorial', {
  title: 'Implementing Authentication',
  difficulty: 'intermediate',
  estimated_time: 45,
  prerequisites: ['Basic JavaScript', 'REST API Concepts']
});

// Creating relationships
ultralink.addRelationship('tutorial-auth', 'feature-auth', 'covers', {
  completeness: 0.9,
  sections: ['Basic Setup', 'User Registration', 'Login Flow', 'Token Refresh']
});

ultralink.addRelationship('feature-analytics', 'feature-auth', 'depends_on', {
  reason: 'Requires authentication for access control'
});

// Find all tutorials covering a specific feature
const authTutorials = ultralink.findRelationships({
  type: 'covers',
  targetEntity: { id: 'feature-auth' }
});

// Export to Obsidian markdown format
const obsidianOutput = ultralink.toObsidian({
  backlinks: true,
  includeTags: true
});
```

## Organizational Knowledge Graph

This example demonstrates creating a knowledge graph for organizational knowledge:

```javascript
// Define custom entity types
ultralink.defineEntityType('department', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    headcount: { type: 'number' },
    location: { type: 'string' },
    budget: { type: 'number' }
  }
});

ultralink.defineEntityType('employee', {
  parent: 'person',
  attributes: {
    name: { type: 'string', required: true },
    title: { type: 'string', required: true },
    hire_date: { type: 'date' },
    skills: { type: 'string[]' },
    email: { type: 'string' }
  }
});

ultralink.defineEntityType('project', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    status: { 
      type: 'enum', 
      values: ['planning', 'active', 'completed', 'on_hold', 'cancelled'] 
    },
    budget: { type: 'number' }
  }
});

// Creating entities
ultralink.addEntity('dept-engineering', 'department', {
  name: 'Engineering',
  description: 'Software development and technical operations',
  headcount: 45,
  location: 'Floor 3',
  budget: 2500000
});

ultralink.addEntity('emp-jane', 'employee', {
  name: 'Jane Doe',
  title: 'Senior Software Engineer',
  hire_date: '2021-03-15',
  skills: ['JavaScript', 'React', 'Node.js', 'GraphQL'],
  email: 'jane.doe@example.com'
});

ultralink.addEntity('project-redesign', 'project', {
  name: 'Website Redesign',
  description: 'Overhaul of company website with new design system',
  start_date: '2023-01-10',
  end_date: '2023-06-30',
  status: 'active',
  budget: 150000
});

// Creating relationships
ultralink.addRelationship('emp-jane', 'dept-engineering', 'belongs_to', {
  start_date: '2021-03-15',
  role: 'Senior Software Engineer'
});

ultralink.addRelationship('emp-jane', 'project-redesign', 'works_on', {
  role: 'Tech Lead',
  time_allocation: 0.7,
  start_date: '2023-01-10'
});

ultralink.addRelationship('dept-engineering', 'project-redesign', 'responsible_for', {
  executive_sponsor: 'John Smith',
  priority: 'high'
});

// Find all active projects in a department
const activeDepartmentProjects = ultralink.findEntities({
  type: 'project',
  attributes: {
    status: 'active'
  },
  filter: (project) => {
    const deptRelations = ultralink.findRelationships({
      type: 'responsible_for',
      sourceEntity: { id: 'dept-engineering' },
      targetEntity: { id: project.id }
    });
    return deptRelations.length > 0;
  }
});

// Export to CSV format
const csvOutput = ultralink.toCSV({ 
  attributesAsColumns: true 
});
```

## Educational Curriculum Knowledge Graph

This example demonstrates creating a knowledge graph for an educational curriculum:

```javascript
// Define custom entity types
ultralink.defineEntityType('course', {
  attributes: {
    name: { type: 'string', required: true },
    code: { type: 'string', required: true },
    credits: { type: 'number', required: true },
    description: { type: 'text' },
    level: { 
      type: 'enum', 
      values: ['introductory', 'intermediate', 'advanced', 'graduate'] 
    }
  }
});

ultralink.defineEntityType('learning_objective', {
  attributes: {
    description: { type: 'text', required: true },
    bloom_level: { 
      type: 'enum', 
      values: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'] 
    }
  }
});

ultralink.defineEntityType('assessment', {
  attributes: {
    name: { type: 'string', required: true },
    type: { 
      type: 'enum', 
      values: ['quiz', 'exam', 'project', 'paper', 'presentation'] 
    },
    weight: { type: 'number', min: 0, max: 100 }
  }
});

// Define relationship types
ultralink.defineRelationshipType('prerequisite', {
  sourceTypes: ['course'],
  targetTypes: ['course'],
  attributes: {
    required: { type: 'boolean', default: true },
    minimum_grade: { type: 'string' }
  }
});

// Creating entities
ultralink.addEntity('cs101', 'course', {
  name: 'Introduction to Computer Science',
  code: 'CS101',
  credits: 3,
  description: 'Fundamental concepts of programming and computer science',
  level: 'introductory'
});

ultralink.addEntity('cs201', 'course', {
  name: 'Data Structures and Algorithms',
  code: 'CS201',
  credits: 4,
  description: 'Implementation and analysis of fundamental data structures and algorithms',
  level: 'intermediate'
});

ultralink.addEntity('lo-cs101-1', 'learning_objective', {
  description: 'Write basic programs using variables, control structures, and functions',
  bloom_level: 'apply'
});

ultralink.addEntity('lo-cs101-2', 'learning_objective', {
  description: 'Explain basic principles of programming languages',
  bloom_level: 'understand'
});

ultralink.addEntity('assessment-cs101-midterm', 'assessment', {
  name: 'CS101 Midterm Exam',
  type: 'exam',
  weight: 30
});

// Creating relationships
ultralink.addRelationship('cs201', 'cs101', 'prerequisite', {
  required: true,
  minimum_grade: 'C'
});

ultralink.addRelationship('cs101', 'lo-cs101-1', 'has_objective');
ultralink.addRelationship('cs101', 'lo-cs101-2', 'has_objective');
ultralink.addRelationship('assessment-cs101-midterm', 'lo-cs101-1', 'assesses');
ultralink.addRelationship('assessment-cs101-midterm', 'lo-cs101-2', 'assesses');

// Find all prerequisites for a course
const findPrerequisites = (courseId, visited = new Set()) => {
  if (visited.has(courseId)) return [];
  
  visited.add(courseId);
  const prerequisites = [];
  
  const relationships = ultralink.findRelationships({
    type: 'prerequisite',
    sourceEntity: { id: courseId }
  });
  
  for (const rel of relationships) {
    const prereq = ultralink.getEntity(rel.target);
    prerequisites.push(prereq);
    
    // Recursively find prerequisites of prerequisites
    const deeperPrereqs = findPrerequisites(prereq.id, visited);
    prerequisites.push(...deeperPrereqs);
  }
  
  return prerequisites;
};

const cs201Prerequisites = findPrerequisites('cs201');

// Find all learning objectives assessed in a course
const courseObjectives = ultralink.findRelationships({
  type: 'has_objective',
  sourceEntity: { id: 'cs101' }
}).map(rel => ultralink.getEntity(rel.target));
```

## Historical Timeline Knowledge Graph

This example demonstrates creating a knowledge graph for historical events:

```javascript
// Define custom entity types
ultralink.defineEntityType('historical_event', {
  attributes: {
    name: { type: 'string', required: true },
    start_date: { type: 'date', required: true },
    end_date: { type: 'date' },
    description: { type: 'text' },
    location: { type: 'string' },
    significance: { type: 'number', min: 0, max: 1 }
  }
});

ultralink.defineEntityType('historical_figure', {
  parent: 'person',
  attributes: {
    name: { type: 'string', required: true },
    birth_date: { type: 'date' },
    death_date: { type: 'date' },
    nationality: { type: 'string' },
    occupation: { type: 'string[]' },
    biography: { type: 'text' }
  }
});

ultralink.defineEntityType('historical_period', {
  attributes: {
    name: { type: 'string', required: true },
    start_date: { type: 'date', required: true },
    end_date: { type: 'date' },
    description: { type: 'text' },
    defining_characteristics: { type: 'string[]' }
  }
});

// Define relationship types
ultralink.defineRelationshipType('participated_in', {
  sourceTypes: ['historical_figure'],
  targetTypes: ['historical_event'],
  attributes: {
    role: { type: 'string' },
    significance: { type: 'number', min: 0, max: 1 }
  }
});

// Creating entities
ultralink.addEntity('ww2', 'historical_event', {
  name: 'World War II',
  start_date: '1939-09-01',
  end_date: '1945-09-02',
  description: 'Global war involving many nations that resulted in 70-85 million fatalities',
  location: 'Global',
  significance: 0.98
});

ultralink.addEntity('churchill', 'historical_figure', {
  name: 'Winston Churchill',
  birth_date: '1874-11-30',
  death_date: '1965-01-24',
  nationality: 'British',
  occupation: ['Politician', 'Writer', 'Military Officer'],
  biography: 'British statesman who served as Prime Minister during World War II...'
});

ultralink.addEntity('cold-war', 'historical_period', {
  name: 'Cold War',
  start_date: '1947-03-12',
  end_date: '1991-12-26',
  description: 'Period of geopolitical tension between the Soviet Union and the United States and their allies',
  defining_characteristics: ['Nuclear Arms Race', 'Proxy Wars', 'Space Race', 'Ideological Conflict']
});

// Creating relationships
ultralink.addRelationship('churchill', 'ww2', 'participated_in', {
  role: 'Prime Minister of the United Kingdom',
  significance: 0.95
});

ultralink.addRelationship('ww2', 'cold-war', 'preceded', {
  influence: 'The aftermath of World War II created the conditions for the Cold War'
});

// Find all events a historical figure participated in
const churchillEvents = ultralink.findRelationships({
  type: 'participated_in',
  sourceEntity: { id: 'churchill' }
}).map(rel => ultralink.getEntity(rel.target));

// Create a timeline visualization
const timelineVisualization = await ultralink.toVisualization({
  format: 'timeline',
  entityTypes: ['historical_event', 'historical_period'],
  dateAttribute: 'start_date',
  endDateAttribute: 'end_date',
  title: 'Major Historical Events',
  colorBy: 'type'
});
```

## Medical Knowledge Graph

This example demonstrates creating a knowledge graph for medical information:

```javascript
// Define custom entity types
ultralink.defineEntityType('medical_condition', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    icd_10_code: { type: 'string' },
    symptoms: { type: 'string[]' },
    risk_factors: { type: 'string[]' },
    prevalence: { type: 'number', min: 0, max: 1 }
  }
});

ultralink.defineEntityType('medication', {
  attributes: {
    name: { type: 'string', required: true },
    generic_name: { type: 'string' },
    drug_class: { type: 'string' },
    description: { type: 'text' },
    dosage_forms: { type: 'string[]' },
    approved_uses: { type: 'string[]' }
  }
});

ultralink.defineEntityType('treatment', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    typical_duration: { type: 'string' },
    invasiveness: { 
      type: 'enum', 
      values: ['non_invasive', 'minimally_invasive', 'invasive'] 
    }
  }
});

// Define relationship types
ultralink.defineRelationshipType('treats', {
  sourceTypes: ['medication', 'treatment'],
  targetTypes: ['medical_condition'],
  attributes: {
    effectiveness: { type: 'number', min: 0, max: 1 },
    evidence_level: { 
      type: 'enum', 
      values: ['anecdotal', 'observational', 'clinical_trials', 'systematic_reviews'] 
    },
    side_effects: { type: 'string[]' }
  }
});

// Creating entities
ultralink.addEntity('hypertension', 'medical_condition', {
  name: 'Hypertension',
  description: 'Persistently elevated arterial blood pressure',
  icd_10_code: 'I10',
  symptoms: ['Headache', 'Shortness of breath', 'Nosebleeds'],
  risk_factors: ['Age', 'Family history', 'Obesity', 'High sodium diet'],
  prevalence: 0.3
});

ultralink.addEntity('lisinopril', 'medication', {
  name: 'Lisinopril',
  generic_name: 'Lisinopril',
  drug_class: 'ACE inhibitor',
  description: 'Medication used to treat high blood pressure and heart failure',
  dosage_forms: ['Tablet', 'Solution'],
  approved_uses: ['Hypertension', 'Heart failure', 'Post-myocardial infarction']
});

ultralink.addEntity('diet-dash', 'treatment', {
  name: 'DASH Diet',
  description: 'Dietary Approaches to Stop Hypertension - a diet plan rich in fruits, vegetables, and low-fat dairy products',
  typical_duration: 'Ongoing',
  invasiveness: 'non_invasive'
});

// Creating relationships
ultralink.addRelationship('lisinopril', 'hypertension', 'treats', {
  effectiveness: 0.85,
  evidence_level: 'clinical_trials',
  side_effects: ['Dry cough', 'Dizziness', 'Hypotension']
});

ultralink.addRelationship('diet-dash', 'hypertension', 'treats', {
  effectiveness: 0.7,
  evidence_level: 'systematic_reviews',
  side_effects: []
});

ultralink.addRelationship('hypertension', 'stroke', 'increases_risk_of', {
  risk_multiplier: 2.5,
  mechanism: 'Prolonged elevated blood pressure damages blood vessels'
});

// Find all treatments for a condition with effectiveness > 0.7
const effectiveTreatments = ultralink.findRelationships({
  type: 'treats',
  targetEntity: { id: 'hypertension' },
  attributes: {
    effectiveness: { $gt: 0.7 }
  }
}).map(rel => ({
  treatment: ultralink.getEntity(rel.source),
  effectiveness: rel.attributes.effectiveness
}));

// Export to a Bayesian network format for probabilistic reasoning
const bayesianOutput = ultralink.toBayesianNetwork({
  nodeTypes: ['medical_condition'],
  edgeTypes: ['increases_risk_of'],
  probabilityAttribute: 'risk_multiplier'
});
```

## Software Architecture Knowledge Graph

This example demonstrates creating a knowledge graph for software architecture:

```javascript
// Define custom entity types
ultralink.defineEntityType('component', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    type: { 
      type: 'enum', 
      values: ['service', 'library', 'database', 'ui', 'api'] 
    },
    language: { type: 'string' },
    version: { type: 'string' },
    repository: { type: 'string' }
  }
});

ultralink.defineEntityType('interface', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    protocol: { type: 'string' },
    endpoints: { type: 'string[]' }
  }
});

ultralink.defineEntityType('environment', {
  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    type: { 
      type: 'enum', 
      values: ['development', 'testing', 'staging', 'production'] 
    },
    cloud_provider: { type: 'string' },
    region: { type: 'string' }
  }
});

// Define relationship types
ultralink.defineRelationshipType('depends_on', {
  sourceTypes: ['component'],
  targetTypes: ['component', 'interface'],
  attributes: {
    dependency_type: { 
      type: 'enum', 
      values: ['runtime', 'build_time', 'development_time'] 
    },
    criticality: { type: 'number', min: 0, max: 1 }
  }
});

// Creating entities
ultralink.addEntity('auth-service', 'component', {
  name: 'Authentication Service',
  description: 'Handles user authentication and authorization',
  type: 'service',
  language: 'Node.js',
  version: '2.3.1',
  repository: 'github.com/example/auth-service'
});

ultralink.addEntity('user-service', 'component', {
  name: 'User Service',
  description: 'Manages user profiles and preferences',
  type: 'service',
  language: 'Java',
  version: '1.5.0',
  repository: 'github.com/example/user-service'
});

ultralink.addEntity('auth-api', 'interface', {
  name: 'Authentication API',
  description: 'RESTful API for authentication operations',
  protocol: 'HTTPS/REST',
  endpoints: ['/auth/login', '/auth/register', '/auth/refresh']
});

ultralink.addEntity('prod-env', 'environment', {
  name: 'Production',
  description: 'Customer-facing production environment',
  type: 'production',
  cloud_provider: 'AWS',
  region: 'us-west-2'
});

// Creating relationships
ultralink.addRelationship('auth-service', 'auth-api', 'implements', {
  version: '1.2.0'
});

ultralink.addRelationship('user-service', 'auth-service', 'depends_on', {
  dependency_type: 'runtime',
  criticality: 0.9
});

ultralink.addRelationship('auth-service', 'prod-env', 'deployed_in', {
  instances: 3,
  last_deployment: '2023-05-10'
});

// Find all components that depend on the auth service
const authDependencies = ultralink.findRelationships({
  type: 'depends_on',
  targetEntity: { id: 'auth-service' }
}).map(rel => ultralink.getEntity(rel.source));

// Create an architecture diagram
const architectureDiagram = await ultralink.toVisualization({
  format: 'architecture',
  entityTypes: ['component', 'interface'],
  relationshipTypes: ['implements', 'depends_on'],
  style: 'c4',
  title: 'System Architecture',
  groupBy: 'component.type'
});
```

## Semantic Search Examples

This example demonstrates various semantic search capabilities:

```javascript
// Basic semantic search for concepts
const searchResults = await ultralink.findSimilarToText(
  'machine learning models for image recognition', 
  {
    types: ['concept', 'research_paper'],
    threshold: 0.7,
    limit: 10
  }
);

// Find entities similar to an existing entity
const similarEntities = await ultralink.findSimilar('concept-neural-networks', {
  threshold: 0.75,
  types: ['concept'],
  excludeSelf: true,
  limit: 5
});

// Complex semantic search with filtering
const filteredResults = await ultralink.findSimilarToText(
  'authentication security best practices', 
  {
    filter: entity => {
      // Only include entities created or updated in the last year
      if (entity.metadata && entity.metadata.modified) {
        const modifiedDate = new Date(entity.metadata.modified);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return modifiedDate >= oneYearAgo;
      }
      return false;
    },
    threshold: 0.65,
    limit: 20
  }
);

// Semantic clustering
const clusters = await ultralink.findSemanticClusters({
  types: ['research_paper'],
  clusterCount: 5,
  algorithm: 'kmeans',
  dimensions: 2  // For simplified visualization
});

// Visualize semantic clusters
const clusterVisualization = await ultralink.toVisualization({
  format: 'scatter',
  data: clusters,
  title: 'Research Paper Clusters',
  colorBy: 'cluster',
  labelBy: 'attributes.title'
});
```

## Multi-Format Export Examples

This example demonstrates exporting the knowledge graph to various formats:

```javascript
// Export to JSON
const jsonOutput = ultralink.toJSON({
  pretty: true,
  includeMetadata: true
});
fs.writeFileSync('knowledge-graph.json', jsonOutput);

// Export to CSV (entities and relationships)
const csvOutput = ultralink.toCSV({ 
  delimiter: ',',
  includeHeaders: true,
  attributesAsColumns: true
});
fs.writeFileSync('entities.csv', csvOutput.entities);
fs.writeFileSync('relationships.csv', csvOutput.relationships);

// Export to GraphML for visualization in tools like Gephi
const graphmlOutput = ultralink.toGraphML({
  includeAttributes: true,
  prettyPrint: true
});
fs.writeFileSync('knowledge-graph.graphml', graphmlOutput);

// Export to Obsidian for knowledge management
const obsidianOutput = ultralink.toObsidian({
  backlinks: true,
  includeFrontMatter: true,
  includeTags: true
});

// Create Obsidian vault
const obsidianDir = path.join(__dirname, 'obsidian-vault');
fs.mkdirSync(obsidianDir, { recursive: true });
Object.entries(obsidianOutput).forEach(([id, content]) => {
  fs.writeFileSync(path.join(obsidianDir, `${id}.md`), content);
});

// Export to HTML website
const htmlOutput = ultralink.toHTMLWebsite({
  title: 'Knowledge Graph Explorer',
  description: 'Interactive exploration of the knowledge graph',
  theme: 'light',
  includeSearch: true,
  includeVisualization: true
});
fs.writeFileSync('knowledge-graph-website.html', htmlOutput);

// Export to vector database formats
const vectorOutput = ultralink.toVectorDB({
  format: 'pinecone',
  includeMetadata: true,
  dimensions: 384
});
fs.writeFileSync('vector-export.json', JSON.stringify(vectorOutput));
```

These examples demonstrate the versatility and power of UltraLink's syntax and semantic model across a wide range of knowledge graph applications. For full API documentation, see the [API Reference](../api/README.md) and [Syntax Reference](../reference/syntax-reference.md). 