/**
 * Active Inference and Ant Colony Research Lab Test Fixtures
 * 
 * This module provides test data for a research lab studying Active Inference and Ant Colony
 * behavior. The dataset demonstrates UltraLink's capabilities for modeling complex research
 * environments with multiple interconnected elements:
 * - Researchers with various roles and expertise
 * - Research projects with funding and timelines
 * - Scientific concepts and theories
 * - Equipment and laboratory resources
 * - Publications and their relationships to projects and concepts
 * - Complex relationships between all these elements
 */

const { UltraLink } = require('../../../../src');

/**
 * Creates a research team dataset focused on Active Inference and Ant Colony research
 * @returns {UltraLink} Populated UltraLink instance
 */
function createActiveInferenceLabDataset() {
  const ultralink = new UltraLink();
  
  // Add researchers with various roles
  ultralink.addEntity('alice', 'researcher', {
    name: 'Dr. Alice Chen',
    role: 'Principal Investigator',
    department: 'Cognitive Science',
    email: 'alice.chen@example.edu',
    publications: 42,
    expertise: ['active inference', 'computational neuroscience', 'bayesian modeling'],
    yearsExperience: 15
  });
  
  ultralink.addEntity('bob', 'researcher', {
    name: 'Dr. Bob Smith',
    role: 'Senior Researcher',
    department: 'Biology',
    email: 'bob.smith@example.edu',
    publications: 28,
    expertise: ['ant colony behavior', 'entomology', 'swarm intelligence'],
    yearsExperience: 12
  });
  
  ultralink.addEntity('carol', 'researcher', {
    name: 'Dr. Carol Jimenez',
    role: 'Postdoctoral Researcher',
    department: 'Cognitive Science',
    email: 'carol.jimenez@example.edu',
    publications: 11,
    expertise: ['active inference', 'machine learning', 'cognitive modeling'],
    yearsExperience: 3
  });

  ultralink.addEntity('david', 'researcher', {
    name: 'David Wilson',
    role: 'PhD Student',
    department: 'Biology',
    email: 'david.wilson@example.edu',
    publications: 3,
    expertise: ['ant colony optimization', 'collective behavior', 'stigmergy'],
    yearsExperience: 3
  });

  ultralink.addEntity('emma', 'researcher', {
    name: 'Emma Taylor',
    role: 'PhD Student',
    department: 'Computer Science',
    email: 'emma.taylor@example.edu',
    publications: 4,
    expertise: ['machine learning', 'reinforcement learning', 'neural networks'],
    yearsExperience: 2
  });

  ultralink.addEntity('frank', 'researcher', {
    name: 'Dr. Frank Martinez',
    role: 'Research Associate',
    department: 'Mathematics',
    email: 'frank.martinez@example.edu',
    publications: 16,
    expertise: ['dynamical systems', 'chaos theory', 'mathematical modeling'],
    yearsExperience: 8
  });

  ultralink.addEntity('grace', 'researcher', {
    name: 'Grace Kim',
    role: 'Lab Technician',
    department: 'Biology',
    email: 'grace.kim@example.edu',
    publications: 0,
    expertise: ['ant husbandry', 'experiment design', 'data collection'],
    yearsExperience: 4
  });

  // Add research projects
  ultralink.addEntity('active-inference-model', 'project', {
    name: 'Active Inference Modeling of Collective Behavior',
    status: 'Active',
    startDate: '2023-01-15',
    endDate: '2025-01-14',
    funding: 750000,
    fundingSource: 'National Science Foundation',
    description: 'Developing computational models of collective behavior using the Active Inference framework'
  });
  
  ultralink.addEntity('ant-colony-study', 'project', {
    name: 'Ant Colony Decision Making Study',
    status: 'Active',
    startDate: '2023-06-01',
    endDate: '2024-12-31',
    funding: 250000,
    fundingSource: 'University Grant',
    description: 'Field study of ant colony decision-making processes in natural environments'
  });

  ultralink.addEntity('neural-basis', 'project', {
    name: 'Neural Basis of Active Inference',
    status: 'Planning',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    funding: 1200000,
    fundingSource: 'NIH',
    description: 'Investigation of neural mechanisms underlying active inference in biological systems'
  });

  // Add research concepts/topics
  ultralink.addEntity('active-inference', 'concept', {
    name: 'Active Inference',
    field: 'Computational Neuroscience',
    description: 'Framework for understanding perception and action based on free energy minimization',
    keyPapers: ['10.1038/nn.2635', '10.1016/j.tics.2009.04.005']
  });

  ultralink.addEntity('collective-behavior', 'concept', {
    name: 'Collective Behavior',
    field: 'Biology',
    description: 'Emergent properties and dynamics of group behavior in social organisms',
    keyPapers: ['10.1016/j.tree.2018.01.003']
  });

  ultralink.addEntity('swarm-intelligence', 'concept', {
    name: 'Swarm Intelligence',
    field: 'Computer Science',
    description: 'Collective problem-solving abilities emerging from local interactions',
    keyPapers: ['10.1007/s11721-007-0004-y']
  });

  // Add equipment/resources
  ultralink.addEntity('ant-tracking', 'equipment', {
    name: 'Ant Tracking System',
    type: 'Imaging',
    status: 'Operational',
    location: 'Main Lab',
    cost: 75000,
    purchaseDate: '2023-02-15',
    maintenanceSchedule: 'Monthly'
  });

  ultralink.addEntity('neural-recording', 'equipment', {
    name: 'Neural Recording Setup',
    type: 'Electrophysiology',
    status: 'Operational',
    location: 'Neuroscience Lab',
    cost: 150000,
    purchaseDate: '2023-05-01',
    maintenanceSchedule: 'Weekly'
  });

  ultralink.addEntity('computation-cluster', 'equipment', {
    name: 'High Performance Computing Cluster',
    type: 'Computing',
    status: 'Operational',
    location: 'Server Room',
    cost: 200000,
    purchaseDate: '2022-11-01',
    maintenanceSchedule: 'Monthly'
  });

  // Add publications
  ultralink.addEntity('paper-2023a', 'publication', {
    title: 'Active Inference Framework for Collective Behavior Analysis',
    authors: ['alice', 'carol', 'david'],
    journal: 'Nature Computational Science',
    year: 2023,
    doi: '10.1038/s41467-023-0001-1',
    citations: 15
  });

  ultralink.addEntity('paper-2023b', 'publication', {
    title: 'Decision Making Patterns in Ant Colonies: A Field Study',
    authors: ['bob', 'emma', 'frank'],
    journal: 'Behavioral Ecology',
    year: 2023,
    doi: '10.1093/beheco/2023-0002',
    citations: 8
  });

  ultralink.addEntity('paper-2024', 'publication', {
    title: 'Computational Models of Active Inference in Social Insects',
    authors: ['alice', 'bob', 'carol', 'david'],
    journal: 'PLOS Computational Biology',
    year: 2024,
    doi: '10.1371/journal.pcbi.2024-0001',
    citations: 3
  });

  // Add relationships

  // Research leadership
  ultralink.addLink('alice', 'active-inference-model', 'leads', {
    role: 'Principal Investigator',
    timeCommitment: 0.4
  });

  ultralink.addLink('bob', 'ant-colony-study', 'leads', {
    role: 'Principal Investigator',
    timeCommitment: 0.5
  });

  ultralink.addLink('carol', 'active-inference-model', 'contributes', {
    role: 'Lead Developer',
    timeCommitment: 0.6
  });

  ultralink.addLink('david', 'active-inference-model', 'contributes', {
    role: 'Data Analyst',
    timeCommitment: 0.8
  });

  ultralink.addLink('emma', 'ant-colony-study', 'contributes', {
    role: 'Field Researcher',
    timeCommitment: 0.7
  });

  ultralink.addLink('frank', 'ant-colony-study', 'contributes', {
    role: 'Lab Manager',
    timeCommitment: 0.3
  });

  // Project participation
  ultralink.addLink('bob', 'active-inference-model', 'contributes_to', {
    role: 'Co-Investigator',
    startDate: '2022-03-15'
  });

  ultralink.addLink('carol', 'active-inference-model', 'contributes_to', {
    role: 'Postdoc Researcher',
    startDate: '2022-05-01'
  });

  ultralink.addLink('david', 'ant-colony-study', 'contributes_to', {
    role: 'PhD Researcher',
    startDate: '2023-01-10'
  });

  ultralink.addLink('grace', 'ant-colony-study', 'contributes_to', {
    role: 'Lab Technician',
    startDate: '2023-01-10'
  });

  ultralink.addLink('carol', 'active-inference-model', 'contributes_to', {
    role: 'Lead Researcher',
    startDate: '2022-09-01'
  });

  ultralink.addLink('frank', 'ant-colony-study', 'contributes_to', {
    role: 'Mathematical Modeling',
    startDate: '2022-11-15'
  });

  ultralink.addLink('emma', 'ant-colony-study', 'contributes_to', {
    role: 'Algorithm Developer',
    startDate: '2024-01-05'
  });

  ultralink.addLink('david', 'ant-colony-study', 'contributes_to', {
    role: 'Behavioral Consultant',
    startDate: '2024-02-10',
    timeCommitment: '25%'
  });

  // Mentorship and reporting relationships
  ultralink.addLink('alice', 'david', 'mentors', {
    type: 'PhD Advisor',
    startDate: '2022-09-01'
  });

  ultralink.addLink('bob', 'emma', 'mentors', {
    type: 'PhD Advisor',
    startDate: '2022-09-01'
  });

  ultralink.addLink('alice', 'carol', 'mentors', {
    type: 'Postdoc Advisor',
    startDate: '2023-01-15'
  });

  ultralink.addLink('frank', 'emma', 'co_advises', {
    startDate: '2022-09-01'
  });

  ultralink.addLink('carol', 'alice', 'reports_to', {
    startDate: '2022-01-15'
  });

  ultralink.addLink('david', 'bob', 'reports_to', {
    startDate: '2021-09-01'
  });

  ultralink.addLink('emma', 'alice', 'reports_to', {
    startDate: '2022-09-01'
  });

  ultralink.addLink('grace', 'bob', 'reports_to', {
    startDate: '2020-05-15'
  });

  // Research concept relationships
  ultralink.addLink('active-inference-model', 'active-inference', 'applies', {
    centrality: 'Core',
    innovation: 'Novel application to collective behavior'
  });

  ultralink.addLink('ant-colony-study', 'collective-behavior', 'applies', {
    centrality: 'Core',
    innovation: 'Field validation of theoretical predictions'
  });

  ultralink.addLink('active-inference', 'collective-behavior', 'relates_to', {
    relationship: 'Theoretical framework application',
    strength: 'Strong'
  });

  // Equipment usage
  ultralink.addLink('ant-colony-study', 'ant-tracking', 'uses', {
    frequency: 'Daily',
    priority: 'High'
  });

  ultralink.addLink('active-inference-model', 'computation-cluster', 'uses', {
    frequency: 'Continuous',
    priority: 'High'
  });

  ultralink.addLink('neural-basis', 'neural-recording', 'uses', {
    frequency: 'Daily',
    priority: 'High'
  });

  // Publication authorship
  ultralink.addLink('alice', 'paper-2023a', 'authored', {
    contributionType: 'corresponding author',
    contributionPercentage: 40
  });

  ultralink.addLink('bob', 'paper-2023a', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('carol', 'paper-2023a', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('bob', 'paper-2023b', 'authored', {
    contributionType: 'corresponding author',
    contributionPercentage: 50
  });

  ultralink.addLink('emma', 'paper-2023b', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('frank', 'paper-2023b', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 20
  });

  ultralink.addLink('alice', 'paper-2024', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 25
  });

  ultralink.addLink('bob', 'paper-2024', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('carol', 'paper-2024', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('david', 'paper-2024', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('grace', 'paper-2024', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 20
  });

  // Publication-project relationships
  ultralink.addLink('paper-2023a', 'active-inference-model', 'results_from', {
    contribution: 'Primary theoretical framework'
  });

  ultralink.addLink('paper-2023b', 'ant-colony-study', 'results_from', {
    contribution: 'Initial field study findings'
  });

  ultralink.addLink('paper-2024', 'active-inference-model', 'results_from', {
    contribution: 'Computational modeling results'
  });

  ultralink.addLink('paper-2024', 'ant-colony-study', 'results_from', {
    contribution: 'Empirical validation'
  });

  // Publication-concept relationships
  ultralink.addLink('paper-2023a', 'active-inference', 'discusses', {
    depth: 'comprehensive'
  });

  ultralink.addLink('paper-2023b', 'collective-behavior', 'discusses', {
    depth: 'substantial'
  });

  ultralink.addLink('paper-2024', 'swarm-intelligence', 'discusses', {
    depth: 'comprehensive'
  });

  return ultralink;
}

/**
 * Create a subset of the Active Inference Lab dataset for specific testing needs
 * @param {string} subset The name of the subset to create
 * @returns {UltraLink} A subset of the full dataset
 */
function createActiveInferenceLabSubset(subset) {
  const ultralink = new UltraLink();
  
  switch (subset) {
    case 'core-team':
      // Create a subset with just the core research team and their relationships
      ultralink.createEntity('researcher', 'alice', {
        name: 'Dr. Alice Chen',
        role: 'Principal Investigator',
        department: 'Cognitive Science'
      });
      
      ultralink.createEntity('researcher', 'bob', {
        name: 'Dr. Bob Smith',
        role: 'Senior Researcher',
        department: 'Biology'
      });
      
      ultralink.createEntity('researcher', 'carol', {
        name: 'Dr. Carol Jimenez',
        role: 'Postdoctoral Researcher',
        department: 'Cognitive Science'
      });
      
      ultralink.createLink('alice', 'carol', 'mentors');
      ultralink.createLink('carol', 'alice', 'reports_to');
      break;
      
    case 'projects-only':
      // Create a subset with just the research projects
      ultralink.createEntity('project', 'active-inference-model', {
        name: 'Active Inference Modeling of Collective Behavior',
        status: 'Active'
      });
      
      ultralink.createEntity('project', 'ant-colony-study', {
        name: 'Ant Colony Decision Making Study',
        status: 'Active'
      });
      
      ultralink.createEntity('project', 'neural-basis', {
        name: 'Neural Basis of Active Inference',
        status: 'Planning'
      });
      break;
      
    case 'concepts-only':
      // Create a subset with just the research concepts
      ultralink.createEntity('concept', 'active-inference', {
        name: 'Active Inference'
      });
      
      ultralink.createEntity('concept', 'collective-behavior', {
        name: 'Collective Behavior'
      });
      
      ultralink.createEntity('concept', 'swarm-intelligence', {
        name: 'Swarm Intelligence'
      });
      break;
      
    default:
      throw new Error(`Unknown subset: ${subset}`);
  }
  
  return ultralink;
}

module.exports = {
  createActiveInferenceLabDataset,
  createActiveInferenceLabSubset
}; 