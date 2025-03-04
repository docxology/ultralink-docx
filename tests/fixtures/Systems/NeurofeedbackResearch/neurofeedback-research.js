/**
 * Neurofeedback Research Test Fixtures
 * 
 * This module provides test data for a neurofeedback research scenario that demonstrates
 * UltraLink's capabilities across different export formats. The example includes:
 * - Neurofeedback modalities and techniques
 * - Researchers and practitioners in the field
 * - Equipment and technologies used
 * - Clinical applications and outcomes
 * - Research studies and their findings
 * - Theoretical frameworks and mechanisms
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete Neurofeedback Research dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createNeurofeedbackResearchDataset() {
  const ultralink = new UltraLink();
  
  // Neurofeedback Modalities
  const eegNf = ultralink.addEntity('eeg-neurofeedback', 'modality', {
    name: 'EEG Neurofeedback',
    description: 'Feedback based on electroencephalography (EEG) signals, measuring electrical activity of the brain.',
    discovery_year: 1968,
    signal_type: 'electrical',
    measurement_location: 'scalp',
    temporal_resolution: 'milliseconds',
    spatial_resolution: 'centimeters',
    cost_effectiveness: 'high',
    portability: 'medium to high'
  });
  
  const fmriNf = ultralink.addEntity('fmri-neurofeedback', 'modality', {
    name: 'fMRI Neurofeedback',
    description: 'Feedback based on functional magnetic resonance imaging, measuring blood oxygen level-dependent (BOLD) response.',
    discovery_year: 1995,
    signal_type: 'hemodynamic',
    measurement_location: 'whole brain',
    temporal_resolution: 'seconds',
    spatial_resolution: 'millimeters',
    cost_effectiveness: 'low',
    portability: 'low'
  });
  
  const fnirs = ultralink.addEntity('fnirs-neurofeedback', 'modality', {
    name: 'fNIRS Neurofeedback',
    description: 'Feedback based on functional near-infrared spectroscopy, measuring hemodynamic responses in the cortex.',
    discovery_year: 2004,
    signal_type: 'hemodynamic',
    measurement_location: 'cortical surface',
    temporal_resolution: 'seconds',
    spatial_resolution: 'centimeters',
    cost_effectiveness: 'medium',
    portability: 'medium to high'
  });
  
  const meg = ultralink.addEntity('meg-neurofeedback', 'modality', {
    name: 'MEG Neurofeedback',
    description: 'Feedback based on magnetoencephalography, measuring magnetic fields produced by electrical activity in the brain.',
    discovery_year: 1998,
    signal_type: 'magnetic',
    measurement_location: 'whole head',
    temporal_resolution: 'milliseconds',
    spatial_resolution: 'centimeters',
    cost_effectiveness: 'very low',
    portability: 'very low'
  });
  
  // EEG Protocols
  const smrTraining = ultralink.addEntity('smr-training', 'protocol', {
    name: 'SMR Training',
    description: 'Sensorimotor rhythm training, typically enhancing 12-15 Hz activity over sensorimotor cortex.',
    target_frequency: '12-15 Hz',
    typical_locations: ['C3', 'C4', 'Cz'],
    typical_applications: ['ADHD', 'Epilepsy', 'Sleep disorders'],
    development_year: 1972,
    evidence_level: 'high'
  });
  
  const alphaTraining = ultralink.addEntity('alpha-training', 'protocol', {
    name: 'Alpha Training',
    description: 'Enhancement of alpha rhythms (8-12 Hz), promoting relaxation and stress reduction.',
    target_frequency: '8-12 Hz',
    typical_locations: ['O1', 'O2', 'P3', 'P4'],
    typical_applications: ['Anxiety', 'Stress', 'Creativity enhancement'],
    development_year: 1968,
    evidence_level: 'medium'
  });
  
  const thetaTraining = ultralink.addEntity('theta-training', 'protocol', {
    name: 'Theta Training',
    description: 'Training focused on theta waves (4-8 Hz), often used for deep relaxation and memory enhancement.',
    target_frequency: '4-8 Hz',
    typical_locations: ['Fz', 'Pz'],
    typical_applications: ['Memory enhancement', 'Deep relaxation', 'Trauma treatment'],
    development_year: 1975,
    evidence_level: 'medium'
  });
  
  const betaTraining = ultralink.addEntity('beta-training', 'protocol', {
    name: 'Beta Training',
    description: 'Enhancement of beta activity (15-20 Hz), promoting focus and attention.',
    target_frequency: '15-20 Hz',
    typical_locations: ['F3', 'F4', 'Fz'],
    typical_applications: ['ADHD', 'Cognitive enhancement', 'Performance optimization'],
    development_year: 1976,
    evidence_level: 'high'
  });
  
  const alphaThetaTraining = ultralink.addEntity('alpha-theta-training', 'protocol', {
    name: 'Alpha-Theta Training',
    description: 'Training that promotes transitions between alpha and theta states, used for trauma, addiction and PTSD treatment.',
    target_frequency: '4-12 Hz',
    typical_locations: ['Pz', 'Oz'],
    typical_applications: ['PTSD', 'Addiction', 'Trauma recovery', 'Peak performance'],
    development_year: 1989,
    evidence_level: 'medium'
  });
  
  const infra_low = ultralink.addEntity('infra-low-frequency', 'protocol', {
    name: 'Infra-Low Frequency Training',
    description: 'Training of very slow brain oscillations below 0.5 Hz.',
    target_frequency: '<0.5 Hz',
    typical_locations: ['T3', 'T4', 'Fp1', 'Fp2'],
    typical_applications: ['Complex trauma', 'Mood disorders', 'Migraine'],
    development_year: 2006,
    evidence_level: 'medium'
  });
  
  // Clinical Applications
  const adhdApplication = ultralink.addEntity('adhd-treatment', 'clinical_application', {
    name: 'ADHD Treatment',
    description: 'Application of neurofeedback for attention deficit hyperactivity disorder.',
    target_symptoms: ['Inattention', 'Hyperactivity', 'Impulsivity'],
    typical_protocols: ['smr-training', 'beta-training', 'theta-beta-ratio'],
    efficacy_rating: 'Level 5 - Efficacious and Specific',
    research_volume: 'high',
    typical_session_count: '30-40'
  });
  
  const anxietyApplication = ultralink.addEntity('anxiety-treatment', 'clinical_application', {
    name: 'Anxiety Treatment',
    description: 'Application of neurofeedback for anxiety disorders.',
    target_symptoms: ['Excessive worry', 'Physiological arousal', 'Avoidance behavior'],
    typical_protocols: ['alpha-training', 'alpha-theta-training'],
    efficacy_rating: 'Level 4 - Efficacious',
    research_volume: 'medium',
    typical_session_count: '20-30'
  });
  
  const epilepsyApplication = ultralink.addEntity('epilepsy-treatment', 'clinical_application', {
    name: 'Epilepsy Treatment',
    description: 'Application of neurofeedback for seizure reduction in epilepsy.',
    target_symptoms: ['Seizure frequency', 'Seizure intensity'],
    typical_protocols: ['smr-training', 'slow-cortical-potentials'],
    efficacy_rating: 'Level 4 - Efficacious',
    research_volume: 'medium',
    typical_session_count: '30-40'
  });
  
  const insomniaApplication = ultralink.addEntity('insomnia-treatment', 'clinical_application', {
    name: 'Insomnia Treatment',
    description: 'Application of neurofeedback for sleep disorders.',
    target_symptoms: ['Sleep onset latency', 'Sleep maintenance', 'Sleep quality'],
    typical_protocols: ['smr-training', 'z-score-training'],
    efficacy_rating: 'Level 3 - Probably Efficacious',
    research_volume: 'low',
    typical_session_count: '20-30'
  });
  
  const ptsdApplication = ultralink.addEntity('ptsd-treatment', 'clinical_application', {
    name: 'PTSD Treatment',
    description: 'Application of neurofeedback for post-traumatic stress disorder.',
    target_symptoms: ['Intrusive memories', 'Hyperarousal', 'Emotional dysregulation'],
    typical_protocols: ['alpha-theta-training', 'infra-low-frequency'],
    efficacy_rating: 'Level 3 - Probably Efficacious',
    research_volume: 'medium',
    typical_session_count: '30-50'
  });
  
  // Key Researchers
  const sterman = ultralink.addEntity('sterman-mb', 'researcher', {
    name: 'M. Barry Sterman',
    description: 'Pioneer of SMR neurofeedback training, first demonstrated efficacy in treating epilepsy.',
    affiliation: 'University of California, Los Angeles',
    key_contributions: ['Discovery of SMR', 'EEG biofeedback for epilepsy', 'Sleep research'],
    active_years: '1967-2010',
    key_publications: [
      'Sterman, M. B., & Friar, L. (1972). Suppression of seizures in an epileptic following sensorimotor EEG feedback training.',
      'Sterman, M. B. (2000). Basic concepts and clinical findings in the treatment of seizure disorders with EEG operant conditioning.'
    ]
  });
  
  const lubar = ultralink.addEntity('lubar-jf', 'researcher', {
    name: 'Joel F. Lubar',
    description: 'Pioneer in applying neurofeedback to ADHD treatment.',
    affiliation: 'University of Tennessee',
    key_contributions: ['ADHD neurofeedback protocols', 'Theta/Beta ratio', 'Quantitative EEG assessment'],
    active_years: '1976-2010',
    key_publications: [
      'Lubar, J. F., & Shouse, M. N. (1976). EEG and behavioral changes in a hyperkinetic child concurrent with training of the sensorimotor rhythm (SMR).',
      'Lubar, J. F. (1991). Discourse on the development of EEG diagnostics and biofeedback for attention-deficit/hyperactivity disorders.'
    ]
  });
  
  const peniston = ultralink.addEntity('peniston-eg', 'researcher', {
    name: 'Eugene G. Peniston',
    description: 'Developer of the Peniston Protocol (alpha-theta training) for alcoholism and PTSD.',
    affiliation: 'Veterans Administration Hospital, Fort Lyon',
    key_contributions: ['Alpha-Theta protocol', 'PTSD treatment', 'Substance abuse applications'],
    active_years: '1989-2005',
    key_publications: [
      'Peniston, E. G., & Kulkosky, P. J. (1989). Alpha-theta brainwave training and beta-endorphin levels in alcoholics.',
      'Peniston, E. G., & Kulkosky, P. J. (1991). Alpha-theta brainwave neurofeedback for Vietnam veterans with combat-related post-traumatic stress disorder.'
    ]
  });
  
  const othmer = ultralink.addEntity('othmer-sf', 'researcher', {
    name: 'Siegfried Othmer',
    description: 'Developer of infra-low frequency neurofeedback and clinical researcher.',
    affiliation: 'EEG Institute',
    key_contributions: ['Infra-low frequency training', 'Clinical applications across disorders', 'Neurofeedback technology development'],
    active_years: '1985-present',
    key_publications: [
      'Othmer, S., Othmer, S. F., & Kaiser, D. A. (1999). EEG biofeedback: An emerging model for its global efficacy.',
      'Othmer, S., & Othmer, S. F. (2009). Post traumatic stress disorder—The neurofeedback remedy.'
    ]
  });
  
  // Equipment and Technologies
  const eegAmplifier = ultralink.addEntity('eeg-amplifier', 'equipment', {
    name: 'EEG Amplifier',
    description: 'Device for amplifying and digitizing EEG signals from electrodes.',
    types: ['Research grade', 'Clinical grade', 'Consumer grade'],
    key_specifications: ['Number of channels', 'Sampling rate', 'Resolution', 'Noise level'],
    typical_cost_range: '$500 - $50,000',
    development_trends: 'Increasingly wireless, mobile, and user-friendly'
  });
  
  const eegCap = ultralink.addEntity('eeg-cap', 'equipment', {
    name: 'EEG Cap/Headset',
    description: 'Wearable cap or headset containing electrodes for EEG recording.',
    types: ['Wet electrode caps', 'Dry electrode headsets', 'Hybrid systems'],
    key_specifications: ['Number of electrodes', 'Electrode material', 'Comfort', 'Setup time'],
    typical_cost_range: '$200 - $5,000',
    development_trends: 'Dry electrode technology, faster setup, increased comfort'
  });
  
  const nfSoftware = ultralink.addEntity('nf-software', 'equipment', {
    name: 'Neurofeedback Software',
    description: 'Software for signal processing, feedback generation, and session management.',
    types: ['Clinical systems', 'Research platforms', 'Consumer applications'],
    key_specifications: ['Signal processing capabilities', 'Protocol flexibility', 'Data management', 'User interface'],
    typical_cost_range: '$0 (open-source) - $15,000',
    development_trends: 'Cloud integration, AI-assisted protocol selection, improved visualizations'
  });
  
  // Research Studies
  const steermanEpilepsy = ultralink.addEntity('sterman-epilepsy-1972', 'research_study', {
    title: 'Suppression of seizures in an epileptic following sensorimotor EEG feedback training',
    authors: ['sterman-mb', 'Friar, L.'],
    year: 1972,
    journal: 'Electroencephalography and Clinical Neurophysiology',
    key_findings: [
      'First demonstration of SMR training reducing seizure frequency',
      'Established foundation for neurofeedback in epilepsy treatment'
    ],
    methodology: 'Single case design with a female subject with epilepsy',
    citation_count: 476,
    study_type: 'clinical case study'
  });
  
  const lubarADHD = ultralink.addEntity('lubar-adhd-1976', 'research_study', {
    title: 'EEG and behavioral changes in a hyperkinetic child concurrent with training of the sensorimotor rhythm (SMR)',
    authors: ['lubar-jf', 'Shouse, M.N.'],
    year: 1976,
    journal: 'Biofeedback and Self-regulation',
    key_findings: [
      'First application of SMR training to ADHD symptoms',
      'Demonstrated reduction in hyperactivity',
      'Showed reversal of effects when training was reversed'
    ],
    methodology: 'ABA reversal design with a single hyperkinetic child',
    citation_count: 543,
    study_type: 'clinical case study'
  });
  
  const penistonAlcoholism = ultralink.addEntity('peniston-alcoholism-1989', 'research_study', {
    title: 'Alpha-theta brainwave training and beta-endorphin levels in alcoholics',
    authors: ['peniston-eg', 'Kulkosky, P.J.'],
    year: 1989,
    journal: 'Alcoholism: Clinical and Experimental Research',
    key_findings: [
      'Alpha-theta training reduced depression and anxiety in alcoholics',
      'Observed significant increases in beta-endorphin levels',
      'Demonstrated 13-month abstinence in treatment group'
    ],
    methodology: 'Controlled study with alcoholic participants',
    citation_count: 312,
    study_type: 'controlled clinical trial'
  });
  
  const arnsTDCS = ultralink.addEntity('arns-tdcs-2012', 'research_study', {
    title: 'Neurophysiological predictors of non-response to rTMS in depression',
    authors: ['Arns, M.', 'Several others'],
    year: 2012,
    journal: 'Journal of Affective Disorders',
    key_findings: [
      'EEG alpha asymmetry predicted response to rTMS treatment',
      'Integration of neurofeedback with other neuromodulation techniques',
      'Personalized treatment approaches based on QEEG'
    ],
    methodology: 'Retrospective analysis of treatment outcomes',
    citation_count: 227,
    study_type: 'retrospective analysis'
  });
  
  // Theoretical Frameworks
  const operantConditioning = ultralink.addEntity('operant-conditioning', 'theoretical_framework', {
    name: 'Operant Conditioning',
    description: 'Learning framework where behavior is modified by consequences, applied to brain activity in neurofeedback.',
    key_concepts: ['Reinforcement', 'Instrumental learning', 'Behavior shaping'],
    originators: ['B.F. Skinner'],
    relevance: 'Provides core theoretical foundation for neurofeedback as a learning process'
  });
  
  const neuroplasticity = ultralink.addEntity('neuroplasticity', 'theoretical_framework', {
    name: 'Neuroplasticity',
    description: 'Brain\'s ability to reorganize itself by forming new neural connections, the basis for long-term neurofeedback effects.',
    key_concepts: ['Hebbian learning', 'Synaptic plasticity', 'Neural reorganization'],
    originators: ['Donald Hebb', 'Michael Merzenich'],
    relevance: 'Explains the lasting changes in brain function that result from neurofeedback training'
  });
  
  const arousalModel = ultralink.addEntity('arousal-model', 'theoretical_framework', {
    name: 'Arousal Model of Neurofeedback',
    description: 'Framework explaining neurofeedback effects through optimizing cortical arousal levels.',
    key_concepts: ['Optimal arousal', 'Over/under-arousal', 'Performance optimization'],
    originators: ['Karl Pribram', 'Barry Sterman'],
    relevance: 'Particularly relevant for ADHD, anxiety, and performance applications'
  });
  
  // Establish relationships between entities
  
  // Modality to Protocol relationships
  ultralink.addLink('eeg-neurofeedback', 'smr-training', 'implements', {
    strength: 'high',
    description: 'EEG neurofeedback is the primary modality for implementing SMR training'
  });
  
  ultralink.addLink('eeg-neurofeedback', 'alpha-training', 'implements', {
    strength: 'high',
    description: 'EEG neurofeedback is the primary modality for implementing alpha training'
  });
  
  ultralink.addLink('eeg-neurofeedback', 'beta-training', 'implements', {
    strength: 'high',
    description: 'EEG neurofeedback is the primary modality for implementing beta training'
  });
  
  ultralink.addLink('eeg-neurofeedback', 'theta-training', 'implements', {
    strength: 'high',
    description: 'EEG neurofeedback is the primary modality for implementing theta training'
  });
  
  ultralink.addLink('eeg-neurofeedback', 'infra-low-frequency', 'implements', {
    strength: 'high',
    description: 'EEG neurofeedback is used for implementing infra-low frequency training'
  });
  
  ultralink.addLink('fmri-neurofeedback', 'alpha-training', 'implements', {
    strength: 'low',
    description: 'fMRI can be used for alpha state training, but less commonly than EEG'
  });
  
  // Protocol to Application relationships
  ultralink.addLink('smr-training', 'adhd-treatment', 'used_for', {
    strength: 'high',
    description: 'SMR training is commonly used for ADHD treatment',
    evidence_level: 'high'
  });
  
  ultralink.addLink('beta-training', 'adhd-treatment', 'used_for', {
    strength: 'high',
    description: 'Beta training is commonly used for ADHD treatment',
    evidence_level: 'high'
  });
  
  ultralink.addLink('alpha-training', 'anxiety-treatment', 'used_for', {
    strength: 'high',
    description: 'Alpha training is frequently used for anxiety treatment',
    evidence_level: 'medium'
  });
  
  ultralink.addLink('smr-training', 'epilepsy-treatment', 'used_for', {
    strength: 'high',
    description: 'SMR training was originally developed for and is still used in epilepsy treatment',
    evidence_level: 'medium'
  });
  
  ultralink.addLink('alpha-theta-training', 'ptsd-treatment', 'used_for', {
    strength: 'high',
    description: 'Alpha-theta training is a core protocol for PTSD treatment',
    evidence_level: 'medium'
  });
  
  ultralink.addLink('infra-low-frequency', 'ptsd-treatment', 'used_for', {
    strength: 'medium',
    description: 'Infra-low frequency training is increasingly used for complex trauma and PTSD',
    evidence_level: 'emerging'
  });
  
  // Researcher to Protocol relationships
  ultralink.addLink('sterman-mb', 'smr-training', 'developed', {
    year: 1972,
    description: 'Sterman developed SMR training through his work with cats and later humans with epilepsy'
  });
  
  ultralink.addLink('lubar-jf', 'beta-training', 'developed', {
    year: 1976,
    description: 'Lubar pioneered the application of beta training protocols for ADHD'
  });
  
  ultralink.addLink('peniston-eg', 'alpha-theta-training', 'developed', {
    year: 1989,
    description: 'Peniston developed the alpha-theta protocol for alcoholism and PTSD'
  });
  
  ultralink.addLink('othmer-sf', 'infra-low-frequency', 'developed', {
    year: 2006,
    description: 'Othmer pioneered infra-low frequency training for various clinical applications'
  });
  
  // Researcher to Study relationships
  ultralink.addLink('sterman-mb', 'sterman-epilepsy-1972', 'conducted', {
    role: 'Principal Investigator',
    description: 'Sterman led this groundbreaking study on neurofeedback for epilepsy'
  });
  
  ultralink.addLink('lubar-jf', 'lubar-adhd-1976', 'conducted', {
    role: 'Principal Investigator',
    description: 'Lubar conducted this seminal study applying neurofeedback to ADHD'
  });
  
  ultralink.addLink('peniston-eg', 'peniston-alcoholism-1989', 'conducted', {
    role: 'Principal Investigator',
    description: 'Peniston led this influential study on alpha-theta training for alcoholism'
  });
  
  // Equipment relationships
  ultralink.addLink('eeg-amplifier', 'eeg-neurofeedback', 'enables', {
    description: 'EEG amplifiers are essential hardware components for EEG neurofeedback'
  });
  
  ultralink.addLink('eeg-cap', 'eeg-neurofeedback', 'enables', {
    description: 'EEG caps/headsets are required to collect brain signals for neurofeedback'
  });
  
  ultralink.addLink('nf-software', 'smr-training', 'implements', {
    description: 'Neurofeedback software provides the algorithmic implementation of SMR training protocols'
  });
  
  ultralink.addLink('nf-software', 'alpha-training', 'implements', {
    description: 'Neurofeedback software provides the algorithmic implementation of alpha training protocols'
  });
  
  // Theoretical framework relationships
  ultralink.addLink('operant-conditioning', 'smr-training', 'explains', {
    description: 'Operant conditioning provides the theoretical basis for how SMR training works'
  });
  
  ultralink.addLink('neuroplasticity', 'eeg-neurofeedback', 'explains', {
    description: 'Neuroplasticity explains the long-term brain changes that result from neurofeedback training'
  });
  
  ultralink.addLink('arousal-model', 'adhd-treatment', 'explains', {
    description: 'The arousal model helps explain why neurofeedback is effective for ADHD'
  });
  
  return ultralink;
}

/**
 * Create a subset of the Neurofeedback Research dataset
 * @param {string} subset - The subset to create
 * @returns {UltraLink} Populated UltraLink instance with a subset of the data
 */
function createNeurofeedbackResearchSubset(subset) {
  const ultralink = new UltraLink();
  
  // Implementation would go here based on the requested subset
  
  return ultralink;
}

module.exports = {
  createNeurofeedbackResearchDataset,
  createNeurofeedbackResearchSubset
}; 