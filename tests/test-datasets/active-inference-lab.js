/**
 * Active Inference Lab Test Dataset
 * 
 * This module provides test data for an active inference research lab.
 */

const { UltraLink } = require('../../src');

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
    expertise: ['active inference', 'free energy principle', 'predictive processing'],
    yearsExperience: 5
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
    title: 'Active Inference Modeling of Collective Behavior',
    startDate: '2022-03-15',
    endDate: '2025-03-14',
    budget: 750000,
    status: 'Active',
    fundingSource: 'National Science Foundation',
    description: 'Developing computational models of ant colony behavior using active inference principles'
  });
  
  ultralink.addEntity('ant-colony-tracking', 'project', {
    name: 'Ant Colony Tracking System',
    title: 'Ant Colony Tracking System',
    startDate: '2023-01-10',
    endDate: '2024-12-31',
    budget: 320000,
    status: 'Active',
    fundingSource: 'University Research Grant',
    description: 'Developing an advanced tracking system to monitor individual and collective ant behavior'
  });

  ultralink.addEntity('prediction-error-minimization', 'project', {
    name: 'Prediction Error Minimization in Insect Colonies',
    title: 'Prediction Error Minimization in Insect Colonies',
    startDate: '2022-09-01',
    endDate: '2024-08-31',
    budget: 450000,
    status: 'Active',
    fundingSource: 'Industry Partner - BioTech Innovations',
    description: 'Investigating how ant colonies minimize prediction error through collective behavior'
  });

  ultralink.addEntity('algorithm-development', 'project', {
    name: 'Bio-inspired Algorithm Development',
    title: 'Bio-inspired Algorithm Development',
    startDate: '2024-01-05',
    budget: 280000,
    status: 'New',
    fundingSource: 'Industry Partner - AI Systems Inc.',
    description: 'Translating ant colony behaviors into optimization algorithms for complex problems'
  });

  // Add research concepts/topics
  ultralink.addEntity('active-inference', 'concept', {
    name: 'Active Inference',
    description: 'A theory of brain function that combines perception and action through the minimization of free energy or prediction error',
    relatedFields: ['computational neuroscience', 'cognitive science', 'artificial intelligence'],
    keyPapers: ['Friston et al. 2006', 'Friston et al. 2010', 'Parr & Friston 2019']
  });

  ultralink.addEntity('ant-colony-behavior', 'concept', {
    name: 'Ant Colony Behavior',
    description: 'Collective behaviors exhibited by ant colonies, including foraging, nest building, and division of labor',
    relatedFields: ['entomology', 'collective intelligence', 'evolutionary biology'],
    keyPapers: ['Wilson 1971', 'Hölldobler & Wilson 1990', 'Gordon 2010']
  });

  ultralink.addEntity('free-energy-principle', 'concept', {
    name: 'Free Energy Principle',
    description: 'States that all adaptive systems minimize variational free energy, which bounds surprise',
    relatedFields: ['computational neuroscience', 'thermodynamics', 'information theory'],
    keyPapers: ['Friston 2010', 'Friston & Stephan 2007']
  });

  ultralink.addEntity('stigmergy', 'concept', {
    name: 'Stigmergy',
    description: 'Mechanism of indirect coordination among agents through modifications to the environment',
    relatedFields: ['collective behavior', 'self-organization', 'swarm intelligence'],
    keyPapers: ['Grassé 1959', 'Theraulaz & Bonabeau 1999']
  });

  ultralink.addEntity('predictive-coding', 'concept', {
    name: 'Predictive Coding',
    description: 'Framework proposing that the brain constantly generates predictions of sensory input and updates its models based on prediction errors',
    relatedFields: ['neuroscience', 'machine learning', 'cognitive science'],
    keyPapers: ['Rao & Ballard 1999', 'Clark 2013', 'Hohwy 2013']
  });

  // Add equipment/resources
  ultralink.addEntity('ant-colony-lab', 'equipment', {
    name: 'Ant Colony Laboratory',
    location: 'Building C, Room 305',
    size: '500 sq ft',
    features: ['Climate control', 'Observation chambers', 'Artificial nests'],
    speciesHoused: ['Lasius niger', 'Camponotus pennsylvanicus', 'Pogonomyrmex barbatus']
  });

  ultralink.addEntity('hpc-cluster', 'equipment', {
    name: 'High-Performance Computing Cluster',
    location: 'University Computing Center',
    processors: 128,
    totalRAM: '512GB',
    storageCapacity: '100TB',
    purpose: 'Running large-scale simulations and data analysis'
  });

  ultralink.addEntity('tracking-system', 'equipment', {
    name: 'Automated Tracking System',
    manufacturer: 'BioVision Technologies',
    cameras: 8,
    resolution: '4K',
    framerate: '120fps',
    software: 'AntTrack Pro 3.0'
  });

  ultralink.addEntity('environmental-chamber', 'equipment', {
    name: 'Environmental Test Chamber',
    manufacturer: 'EcoSim Systems',
    temperatureRange: '-10°C to 50°C',
    humidityControl: '10% to 95% RH',
    dimensions: '2m x 2m x 2m'
  });

  // Add publications
  ultralink.addEntity('paper-active-inference', 'publication', {
    name: 'Active Inference and Collective Behavior in Ant Colonies',
    authors: ['Chen, A.', 'Smith, B.', 'Jimenez, C.'],
    journal: 'Journal of Theoretical Biology',
    year: 2023,
    doi: '10.1234/jtb.2023.045',
    citations: 12
  });

  ultralink.addEntity('paper-tracking-system', 'publication', {
    name: 'Novel Tracking System for Monitoring Individual Ants in Colony Settings',
    authors: ['Smith, B.', 'Wilson, D.', 'Kim, G.'],
    journal: 'Methods in Ecology and Evolution',
    year: 2023,
    doi: '10.5678/mee.2023.078',
    citations: 8
  });

  ultralink.addEntity('paper-prediction-error', 'publication', {
    name: 'Prediction Error Minimization through Stigmergic Communication in Ants',
    authors: ['Jimenez, C.', 'Chen, A.', 'Martinez, F.'],
    journal: 'Frontiers in Computational Neuroscience',
    year: 2024,
    doi: '10.9012/fcn.2024.012',
    citations: 3
  });

  ultralink.addEntity('paper-algorithm', 'publication', {
    name: 'Bio-inspired Algorithms Based on Active Inference Principles',
    authors: ['Taylor, E.', 'Martinez, F.', 'Chen, A.'],
    journal: 'Nature Machine Intelligence',
    year: 2024,
    doi: '10.3456/nmi.2024.034',
    citations: 2
  });

  // Add relationships

  // Research leadership
  ultralink.addLink('alice', 'active-inference-model', 'leads', {
    role: 'Principal Investigator',
    startDate: '2022-03-15'
  });

  ultralink.addLink('bob', 'ant-colony-tracking', 'leads', {
    role: 'Principal Investigator',
    startDate: '2023-01-10'
  });

  ultralink.addLink('alice', 'prediction-error-minimization', 'leads', {
    role: 'Principal Investigator',
    startDate: '2022-09-01'
  });

  ultralink.addLink('frank', 'algorithm-development', 'leads', {
    role: 'Principal Investigator',
    startDate: '2024-01-05'
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

  ultralink.addLink('david', 'ant-colony-tracking', 'contributes_to', {
    role: 'PhD Researcher',
    startDate: '2023-01-10'
  });

  ultralink.addLink('grace', 'ant-colony-tracking', 'contributes_to', {
    role: 'Lab Technician',
    startDate: '2023-01-10'
  });

  ultralink.addLink('carol', 'prediction-error-minimization', 'contributes_to', {
    role: 'Lead Researcher',
    startDate: '2022-09-01'
  });

  ultralink.addLink('frank', 'prediction-error-minimization', 'contributes_to', {
    role: 'Mathematical Modeling',
    startDate: '2022-11-15'
  });

  ultralink.addLink('emma', 'algorithm-development', 'contributes_to', {
    role: 'Algorithm Developer',
    startDate: '2024-01-05'
  });

  ultralink.addLink('david', 'algorithm-development', 'contributes_to', {
    role: 'Behavioral Consultant',
    startDate: '2024-02-10',
    timeCommitment: '25%'
  });

  // Mentorship and reporting relationships
  ultralink.addLink('alice', 'carol', 'mentors', {
    startDate: '2022-01-15'
  });

  ultralink.addLink('bob', 'david', 'mentors', {
    startDate: '2021-09-01'
  });

  ultralink.addLink('alice', 'emma', 'mentors', {
    startDate: '2022-09-01'
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
    centrality: 'primary'
  });

  ultralink.addLink('active-inference-model', 'ant-colony-behavior', 'studies', {
    centrality: 'primary'
  });

  ultralink.addLink('active-inference-model', 'free-energy-principle', 'applies', {
    centrality: 'primary'
  });

  ultralink.addLink('ant-colony-tracking', 'ant-colony-behavior', 'studies', {
    centrality: 'primary'
  });

  ultralink.addLink('ant-colony-tracking', 'stigmergy', 'investigates', {
    centrality: 'secondary'
  });

  ultralink.addLink('prediction-error-minimization', 'predictive-coding', 'applies', {
    centrality: 'primary'
  });

  ultralink.addLink('prediction-error-minimization', 'ant-colony-behavior', 'studies', {
    centrality: 'primary'
  });

  ultralink.addLink('algorithm-development', 'active-inference', 'applies', {
    centrality: 'primary'
  });

  ultralink.addLink('algorithm-development', 'stigmergy', 'applies', {
    centrality: 'secondary'
  });

  // Researcher expertise
  ultralink.addLink('alice', 'active-inference', 'specializes_in', {
    yearsExperience: 12,
    expertiseLevel: 'expert'
  });

  ultralink.addLink('alice', 'free-energy-principle', 'specializes_in', {
    yearsExperience: 10,
    expertiseLevel: 'expert'
  });

  ultralink.addLink('bob', 'ant-colony-behavior', 'specializes_in', {
    yearsExperience: 15,
    expertiseLevel: 'expert'
  });

  ultralink.addLink('bob', 'stigmergy', 'specializes_in', {
    yearsExperience: 8,
    expertiseLevel: 'advanced'
  });

  ultralink.addLink('carol', 'predictive-coding', 'specializes_in', {
    yearsExperience: 5,
    expertiseLevel: 'advanced'
  });

  ultralink.addLink('carol', 'free-energy-principle', 'specializes_in', {
    yearsExperience: 4,
    expertiseLevel: 'intermediate'
  });

  ultralink.addLink('david', 'ant-colony-behavior', 'specializes_in', {
    yearsExperience: 3,
    expertiseLevel: 'intermediate'
  });

  ultralink.addLink('emma', 'active-inference', 'specializes_in', {
    yearsExperience: 2,
    expertiseLevel: 'beginner'
  });

  ultralink.addLink('frank', 'free-energy-principle', 'specializes_in', {
    yearsExperience: 6,
    expertiseLevel: 'advanced',
    focus: 'mathematical formulations'
  });

  // Equipment usage
  ultralink.addLink('ant-colony-tracking', 'tracking-system', 'uses', {
    usageFrequency: 'daily'
  });

  ultralink.addLink('ant-colony-tracking', 'ant-colony-lab', 'uses', {
    usageFrequency: 'daily'
  });

  ultralink.addLink('active-inference-model', 'hpc-cluster', 'uses', {
    usageFrequency: 'weekly',
    computeHours: 2000
  });

  ultralink.addLink('active-inference-model', 'ant-colony-lab', 'uses', {
    usageFrequency: 'weekly'
  });

  ultralink.addLink('prediction-error-minimization', 'environmental-chamber', 'uses', {
    usageFrequency: 'weekly'
  });

  ultralink.addLink('prediction-error-minimization', 'tracking-system', 'uses', {
    usageFrequency: 'weekly'
  });

  ultralink.addLink('algorithm-development', 'hpc-cluster', 'uses', {
    usageFrequency: 'daily',
    computeHours: 5000
  });

  // Publication authorship
  ultralink.addLink('alice', 'paper-active-inference', 'authored', {
    contributionType: 'corresponding author',
    contributionPercentage: 40
  });

  ultralink.addLink('bob', 'paper-active-inference', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('carol', 'paper-active-inference', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('bob', 'paper-tracking-system', 'authored', {
    contributionType: 'corresponding author',
    contributionPercentage: 50
  });

  ultralink.addLink('david', 'paper-tracking-system', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('grace', 'paper-tracking-system', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 20
  });

  ultralink.addLink('carol', 'paper-prediction-error', 'authored', {
    contributionType: 'corresponding author',
    contributionPercentage: 50
  });

  ultralink.addLink('alice', 'paper-prediction-error', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('frank', 'paper-prediction-error', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 20
  });

  ultralink.addLink('emma', 'paper-algorithm', 'authored', {
    contributionType: 'first author',
    contributionPercentage: 45
  });

  ultralink.addLink('frank', 'paper-algorithm', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 30
  });

  ultralink.addLink('alice', 'paper-algorithm', 'authored', {
    contributionType: 'co-author',
    contributionPercentage: 25
  });

  // Publication-project relationships
  ultralink.addLink('paper-active-inference', 'active-inference-model', 'resulted_from', {
    publicationType: 'primary research'
  });

  ultralink.addLink('paper-tracking-system', 'ant-colony-tracking', 'resulted_from', {
    publicationType: 'methods paper'
  });

  ultralink.addLink('paper-prediction-error', 'prediction-error-minimization', 'resulted_from', {
    publicationType: 'primary research'
  });

  ultralink.addLink('paper-algorithm', 'algorithm-development', 'resulted_from', {
    publicationType: 'primary research'
  });

  // Publication-concept relationships
  ultralink.addLink('paper-active-inference', 'active-inference', 'discusses', {
    depth: 'comprehensive'
  });

  ultralink.addLink('paper-active-inference', 'ant-colony-behavior', 'discusses', {
    depth: 'substantial'
  });

  ultralink.addLink('paper-tracking-system', 'ant-colony-behavior', 'discusses', {
    depth: 'moderate'
  });

  ultralink.addLink('paper-prediction-error', 'predictive-coding', 'discusses', {
    depth: 'comprehensive'
  });

  ultralink.addLink('paper-prediction-error', 'free-energy-principle', 'discusses', {
    depth: 'substantial'
  });

  ultralink.addLink('paper-algorithm', 'active-inference', 'discusses', {
    depth: 'substantial'
  });

  ultralink.addLink('paper-algorithm', 'stigmergy', 'discusses', {
    depth: 'moderate'
  });

  return ultralink;
}

module.exports = {
  createActiveInferenceLabDataset
}; 