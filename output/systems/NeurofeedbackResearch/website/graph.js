// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "eeg-neurofeedback",
      "type": "modality",
      "label": "EEG Neurofeedback",
      "attributes": {
        "name": "EEG Neurofeedback",
        "description": "Feedback based on electroencephalography (EEG) signals, measuring electrical activity of the brain.",
        "discovery_year": 1968,
        "signal_type": "electrical",
        "measurement_location": "scalp",
        "temporal_resolution": "milliseconds",
        "spatial_resolution": "centimeters",
        "cost_effectiveness": "high",
        "portability": "medium to high"
      }
    },
    {
      "id": "fmri-neurofeedback",
      "type": "modality",
      "label": "fMRI Neurofeedback",
      "attributes": {
        "name": "fMRI Neurofeedback",
        "description": "Feedback based on functional magnetic resonance imaging, measuring blood oxygen level-dependent (BOLD) response.",
        "discovery_year": 1995,
        "signal_type": "hemodynamic",
        "measurement_location": "whole brain",
        "temporal_resolution": "seconds",
        "spatial_resolution": "millimeters",
        "cost_effectiveness": "low",
        "portability": "low"
      }
    },
    {
      "id": "fnirs-neurofeedback",
      "type": "modality",
      "label": "fNIRS Neurofeedback",
      "attributes": {
        "name": "fNIRS Neurofeedback",
        "description": "Feedback based on functional near-infrared spectroscopy, measuring hemodynamic responses in the cortex.",
        "discovery_year": 2004,
        "signal_type": "hemodynamic",
        "measurement_location": "cortical surface",
        "temporal_resolution": "seconds",
        "spatial_resolution": "centimeters",
        "cost_effectiveness": "medium",
        "portability": "medium to high"
      }
    },
    {
      "id": "meg-neurofeedback",
      "type": "modality",
      "label": "MEG Neurofeedback",
      "attributes": {
        "name": "MEG Neurofeedback",
        "description": "Feedback based on magnetoencephalography, measuring magnetic fields produced by electrical activity in the brain.",
        "discovery_year": 1998,
        "signal_type": "magnetic",
        "measurement_location": "whole head",
        "temporal_resolution": "milliseconds",
        "spatial_resolution": "centimeters",
        "cost_effectiveness": "very low",
        "portability": "very low"
      }
    },
    {
      "id": "smr-training",
      "type": "protocol",
      "label": "SMR Training",
      "attributes": {
        "name": "SMR Training",
        "description": "Sensorimotor rhythm training, typically enhancing 12-15 Hz activity over sensorimotor cortex.",
        "target_frequency": "12-15 Hz",
        "typical_locations": [
          "C3",
          "C4",
          "Cz"
        ],
        "typical_applications": [
          "ADHD",
          "Epilepsy",
          "Sleep disorders"
        ],
        "development_year": 1972,
        "evidence_level": "high"
      }
    },
    {
      "id": "alpha-training",
      "type": "protocol",
      "label": "Alpha Training",
      "attributes": {
        "name": "Alpha Training",
        "description": "Enhancement of alpha rhythms (8-12 Hz), promoting relaxation and stress reduction.",
        "target_frequency": "8-12 Hz",
        "typical_locations": [
          "O1",
          "O2",
          "P3",
          "P4"
        ],
        "typical_applications": [
          "Anxiety",
          "Stress",
          "Creativity enhancement"
        ],
        "development_year": 1968,
        "evidence_level": "medium"
      }
    },
    {
      "id": "theta-training",
      "type": "protocol",
      "label": "Theta Training",
      "attributes": {
        "name": "Theta Training",
        "description": "Training focused on theta waves (4-8 Hz), often used for deep relaxation and memory enhancement.",
        "target_frequency": "4-8 Hz",
        "typical_locations": [
          "Fz",
          "Pz"
        ],
        "typical_applications": [
          "Memory enhancement",
          "Deep relaxation",
          "Trauma treatment"
        ],
        "development_year": 1975,
        "evidence_level": "medium"
      }
    },
    {
      "id": "beta-training",
      "type": "protocol",
      "label": "Beta Training",
      "attributes": {
        "name": "Beta Training",
        "description": "Enhancement of beta activity (15-20 Hz), promoting focus and attention.",
        "target_frequency": "15-20 Hz",
        "typical_locations": [
          "F3",
          "F4",
          "Fz"
        ],
        "typical_applications": [
          "ADHD",
          "Cognitive enhancement",
          "Performance optimization"
        ],
        "development_year": 1976,
        "evidence_level": "high"
      }
    },
    {
      "id": "alpha-theta-training",
      "type": "protocol",
      "label": "Alpha-Theta Training",
      "attributes": {
        "name": "Alpha-Theta Training",
        "description": "Training that promotes transitions between alpha and theta states, used for trauma, addiction and PTSD treatment.",
        "target_frequency": "4-12 Hz",
        "typical_locations": [
          "Pz",
          "Oz"
        ],
        "typical_applications": [
          "PTSD",
          "Addiction",
          "Trauma recovery",
          "Peak performance"
        ],
        "development_year": 1989,
        "evidence_level": "medium"
      }
    },
    {
      "id": "infra-low-frequency",
      "type": "protocol",
      "label": "Infra-Low Frequency Training",
      "attributes": {
        "name": "Infra-Low Frequency Training",
        "description": "Training of very slow brain oscillations below 0.5 Hz.",
        "target_frequency": "<0.5 Hz",
        "typical_locations": [
          "T3",
          "T4",
          "Fp1",
          "Fp2"
        ],
        "typical_applications": [
          "Complex trauma",
          "Mood disorders",
          "Migraine"
        ],
        "development_year": 2006,
        "evidence_level": "medium"
      }
    },
    {
      "id": "adhd-treatment",
      "type": "clinical_application",
      "label": "ADHD Treatment",
      "attributes": {
        "name": "ADHD Treatment",
        "description": "Application of neurofeedback for attention deficit hyperactivity disorder.",
        "target_symptoms": [
          "Inattention",
          "Hyperactivity",
          "Impulsivity"
        ],
        "typical_protocols": [
          "smr-training",
          "beta-training",
          "theta-beta-ratio"
        ],
        "efficacy_rating": "Level 5 - Efficacious and Specific",
        "research_volume": "high",
        "typical_session_count": "30-40"
      }
    },
    {
      "id": "anxiety-treatment",
      "type": "clinical_application",
      "label": "Anxiety Treatment",
      "attributes": {
        "name": "Anxiety Treatment",
        "description": "Application of neurofeedback for anxiety disorders.",
        "target_symptoms": [
          "Excessive worry",
          "Physiological arousal",
          "Avoidance behavior"
        ],
        "typical_protocols": [
          "alpha-training",
          "alpha-theta-training"
        ],
        "efficacy_rating": "Level 4 - Efficacious",
        "research_volume": "medium",
        "typical_session_count": "20-30"
      }
    },
    {
      "id": "epilepsy-treatment",
      "type": "clinical_application",
      "label": "Epilepsy Treatment",
      "attributes": {
        "name": "Epilepsy Treatment",
        "description": "Application of neurofeedback for seizure reduction in epilepsy.",
        "target_symptoms": [
          "Seizure frequency",
          "Seizure intensity"
        ],
        "typical_protocols": [
          "smr-training",
          "slow-cortical-potentials"
        ],
        "efficacy_rating": "Level 4 - Efficacious",
        "research_volume": "medium",
        "typical_session_count": "30-40"
      }
    },
    {
      "id": "insomnia-treatment",
      "type": "clinical_application",
      "label": "Insomnia Treatment",
      "attributes": {
        "name": "Insomnia Treatment",
        "description": "Application of neurofeedback for sleep disorders.",
        "target_symptoms": [
          "Sleep onset latency",
          "Sleep maintenance",
          "Sleep quality"
        ],
        "typical_protocols": [
          "smr-training",
          "z-score-training"
        ],
        "efficacy_rating": "Level 3 - Probably Efficacious",
        "research_volume": "low",
        "typical_session_count": "20-30"
      }
    },
    {
      "id": "ptsd-treatment",
      "type": "clinical_application",
      "label": "PTSD Treatment",
      "attributes": {
        "name": "PTSD Treatment",
        "description": "Application of neurofeedback for post-traumatic stress disorder.",
        "target_symptoms": [
          "Intrusive memories",
          "Hyperarousal",
          "Emotional dysregulation"
        ],
        "typical_protocols": [
          "alpha-theta-training",
          "infra-low-frequency"
        ],
        "efficacy_rating": "Level 3 - Probably Efficacious",
        "research_volume": "medium",
        "typical_session_count": "30-50"
      }
    },
    {
      "id": "sterman-mb",
      "type": "researcher",
      "label": "M. Barry Sterman",
      "attributes": {
        "name": "M. Barry Sterman",
        "description": "Pioneer of SMR neurofeedback training, first demonstrated efficacy in treating epilepsy.",
        "affiliation": "University of California, Los Angeles",
        "key_contributions": [
          "Discovery of SMR",
          "EEG biofeedback for epilepsy",
          "Sleep research"
        ],
        "active_years": "1967-2010",
        "key_publications": [
          "Sterman, M. B., & Friar, L. (1972). Suppression of seizures in an epileptic following sensorimotor EEG feedback training.",
          "Sterman, M. B. (2000). Basic concepts and clinical findings in the treatment of seizure disorders with EEG operant conditioning."
        ]
      }
    },
    {
      "id": "lubar-jf",
      "type": "researcher",
      "label": "Joel F. Lubar",
      "attributes": {
        "name": "Joel F. Lubar",
        "description": "Pioneer in applying neurofeedback to ADHD treatment.",
        "affiliation": "University of Tennessee",
        "key_contributions": [
          "ADHD neurofeedback protocols",
          "Theta/Beta ratio",
          "Quantitative EEG assessment"
        ],
        "active_years": "1976-2010",
        "key_publications": [
          "Lubar, J. F., & Shouse, M. N. (1976). EEG and behavioral changes in a hyperkinetic child concurrent with training of the sensorimotor rhythm (SMR).",
          "Lubar, J. F. (1991). Discourse on the development of EEG diagnostics and biofeedback for attention-deficit/hyperactivity disorders."
        ]
      }
    },
    {
      "id": "peniston-eg",
      "type": "researcher",
      "label": "Eugene G. Peniston",
      "attributes": {
        "name": "Eugene G. Peniston",
        "description": "Developer of the Peniston Protocol (alpha-theta training) for alcoholism and PTSD.",
        "affiliation": "Veterans Administration Hospital, Fort Lyon",
        "key_contributions": [
          "Alpha-Theta protocol",
          "PTSD treatment",
          "Substance abuse applications"
        ],
        "active_years": "1989-2005",
        "key_publications": [
          "Peniston, E. G., & Kulkosky, P. J. (1989). Alpha-theta brainwave training and beta-endorphin levels in alcoholics.",
          "Peniston, E. G., & Kulkosky, P. J. (1991). Alpha-theta brainwave neurofeedback for Vietnam veterans with combat-related post-traumatic stress disorder."
        ]
      }
    },
    {
      "id": "othmer-sf",
      "type": "researcher",
      "label": "Siegfried Othmer",
      "attributes": {
        "name": "Siegfried Othmer",
        "description": "Developer of infra-low frequency neurofeedback and clinical researcher.",
        "affiliation": "EEG Institute",
        "key_contributions": [
          "Infra-low frequency training",
          "Clinical applications across disorders",
          "Neurofeedback technology development"
        ],
        "active_years": "1985-present",
        "key_publications": [
          "Othmer, S., Othmer, S. F., & Kaiser, D. A. (1999). EEG biofeedback: An emerging model for its global efficacy.",
          "Othmer, S., & Othmer, S. F. (2009). Post traumatic stress disorder—The neurofeedback remedy."
        ]
      }
    },
    {
      "id": "eeg-amplifier",
      "type": "equipment",
      "label": "EEG Amplifier",
      "attributes": {
        "name": "EEG Amplifier",
        "description": "Device for amplifying and digitizing EEG signals from electrodes.",
        "types": [
          "Research grade",
          "Clinical grade",
          "Consumer grade"
        ],
        "key_specifications": [
          "Number of channels",
          "Sampling rate",
          "Resolution",
          "Noise level"
        ],
        "typical_cost_range": "$500 - $50,000",
        "development_trends": "Increasingly wireless, mobile, and user-friendly"
      }
    },
    {
      "id": "eeg-cap",
      "type": "equipment",
      "label": "EEG Cap/Headset",
      "attributes": {
        "name": "EEG Cap/Headset",
        "description": "Wearable cap or headset containing electrodes for EEG recording.",
        "types": [
          "Wet electrode caps",
          "Dry electrode headsets",
          "Hybrid systems"
        ],
        "key_specifications": [
          "Number of electrodes",
          "Electrode material",
          "Comfort",
          "Setup time"
        ],
        "typical_cost_range": "$200 - $5,000",
        "development_trends": "Dry electrode technology, faster setup, increased comfort"
      }
    },
    {
      "id": "nf-software",
      "type": "equipment",
      "label": "Neurofeedback Software",
      "attributes": {
        "name": "Neurofeedback Software",
        "description": "Software for signal processing, feedback generation, and session management.",
        "types": [
          "Clinical systems",
          "Research platforms",
          "Consumer applications"
        ],
        "key_specifications": [
          "Signal processing capabilities",
          "Protocol flexibility",
          "Data management",
          "User interface"
        ],
        "typical_cost_range": "$0 (open-source) - $15,000",
        "development_trends": "Cloud integration, AI-assisted protocol selection, improved visualizations"
      }
    },
    {
      "id": "sterman-epilepsy-1972",
      "type": "research_study",
      "label": "Suppression of seizures in an epileptic following sensorimotor EEG feedback training",
      "attributes": {
        "title": "Suppression of seizures in an epileptic following sensorimotor EEG feedback training",
        "authors": [
          "sterman-mb",
          "Friar, L."
        ],
        "year": 1972,
        "journal": "Electroencephalography and Clinical Neurophysiology",
        "key_findings": [
          "First demonstration of SMR training reducing seizure frequency",
          "Established foundation for neurofeedback in epilepsy treatment"
        ],
        "methodology": "Single case design with a female subject with epilepsy",
        "citation_count": 476,
        "study_type": "clinical case study"
      }
    },
    {
      "id": "lubar-adhd-1976",
      "type": "research_study",
      "label": "EEG and behavioral changes in a hyperkinetic child concurrent with training of the sensorimotor rhythm (SMR)",
      "attributes": {
        "title": "EEG and behavioral changes in a hyperkinetic child concurrent with training of the sensorimotor rhythm (SMR)",
        "authors": [
          "lubar-jf",
          "Shouse, M.N."
        ],
        "year": 1976,
        "journal": "Biofeedback and Self-regulation",
        "key_findings": [
          "First application of SMR training to ADHD symptoms",
          "Demonstrated reduction in hyperactivity",
          "Showed reversal of effects when training was reversed"
        ],
        "methodology": "ABA reversal design with a single hyperkinetic child",
        "citation_count": 543,
        "study_type": "clinical case study"
      }
    },
    {
      "id": "peniston-alcoholism-1989",
      "type": "research_study",
      "label": "Alpha-theta brainwave training and beta-endorphin levels in alcoholics",
      "attributes": {
        "title": "Alpha-theta brainwave training and beta-endorphin levels in alcoholics",
        "authors": [
          "peniston-eg",
          "Kulkosky, P.J."
        ],
        "year": 1989,
        "journal": "Alcoholism: Clinical and Experimental Research",
        "key_findings": [
          "Alpha-theta training reduced depression and anxiety in alcoholics",
          "Observed significant increases in beta-endorphin levels",
          "Demonstrated 13-month abstinence in treatment group"
        ],
        "methodology": "Controlled study with alcoholic participants",
        "citation_count": 312,
        "study_type": "controlled clinical trial"
      }
    },
    {
      "id": "arns-tdcs-2012",
      "type": "research_study",
      "label": "Neurophysiological predictors of non-response to rTMS in depression",
      "attributes": {
        "title": "Neurophysiological predictors of non-response to rTMS in depression",
        "authors": [
          "Arns, M.",
          "Several others"
        ],
        "year": 2012,
        "journal": "Journal of Affective Disorders",
        "key_findings": [
          "EEG alpha asymmetry predicted response to rTMS treatment",
          "Integration of neurofeedback with other neuromodulation techniques",
          "Personalized treatment approaches based on QEEG"
        ],
        "methodology": "Retrospective analysis of treatment outcomes",
        "citation_count": 227,
        "study_type": "retrospective analysis"
      }
    },
    {
      "id": "operant-conditioning",
      "type": "theoretical_framework",
      "label": "Operant Conditioning",
      "attributes": {
        "name": "Operant Conditioning",
        "description": "Learning framework where behavior is modified by consequences, applied to brain activity in neurofeedback.",
        "key_concepts": [
          "Reinforcement",
          "Instrumental learning",
          "Behavior shaping"
        ],
        "originators": [
          "B.F. Skinner"
        ],
        "relevance": "Provides core theoretical foundation for neurofeedback as a learning process"
      }
    },
    {
      "id": "neuroplasticity",
      "type": "theoretical_framework",
      "label": "Neuroplasticity",
      "attributes": {
        "name": "Neuroplasticity",
        "description": "Brain's ability to reorganize itself by forming new neural connections, the basis for long-term neurofeedback effects.",
        "key_concepts": [
          "Hebbian learning",
          "Synaptic plasticity",
          "Neural reorganization"
        ],
        "originators": [
          "Donald Hebb",
          "Michael Merzenich"
        ],
        "relevance": "Explains the lasting changes in brain function that result from neurofeedback training"
      }
    },
    {
      "id": "arousal-model",
      "type": "theoretical_framework",
      "label": "Arousal Model of Neurofeedback",
      "attributes": {
        "name": "Arousal Model of Neurofeedback",
        "description": "Framework explaining neurofeedback effects through optimizing cortical arousal levels.",
        "key_concepts": [
          "Optimal arousal",
          "Over/under-arousal",
          "Performance optimization"
        ],
        "originators": [
          "Karl Pribram",
          "Barry Sterman"
        ],
        "relevance": "Particularly relevant for ADHD, anxiety, and performance applications"
      }
    }
  ],
  "links": [
    {
      "source": "eeg-neurofeedback",
      "target": "smr-training",
      "type": "implements",
      "attributes": {
        "strength": "high",
        "description": "EEG neurofeedback is the primary modality for implementing SMR training"
      }
    },
    {
      "source": "eeg-neurofeedback",
      "target": "alpha-training",
      "type": "implements",
      "attributes": {
        "strength": "high",
        "description": "EEG neurofeedback is the primary modality for implementing alpha training"
      }
    },
    {
      "source": "eeg-neurofeedback",
      "target": "beta-training",
      "type": "implements",
      "attributes": {
        "strength": "high",
        "description": "EEG neurofeedback is the primary modality for implementing beta training"
      }
    },
    {
      "source": "eeg-neurofeedback",
      "target": "theta-training",
      "type": "implements",
      "attributes": {
        "strength": "high",
        "description": "EEG neurofeedback is the primary modality for implementing theta training"
      }
    },
    {
      "source": "eeg-neurofeedback",
      "target": "infra-low-frequency",
      "type": "implements",
      "attributes": {
        "strength": "high",
        "description": "EEG neurofeedback is used for implementing infra-low frequency training"
      }
    },
    {
      "source": "fmri-neurofeedback",
      "target": "alpha-training",
      "type": "implements",
      "attributes": {
        "strength": "low",
        "description": "fMRI can be used for alpha state training, but less commonly than EEG"
      }
    },
    {
      "source": "smr-training",
      "target": "adhd-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "high",
        "description": "SMR training is commonly used for ADHD treatment",
        "evidence_level": "high"
      }
    },
    {
      "source": "beta-training",
      "target": "adhd-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "high",
        "description": "Beta training is commonly used for ADHD treatment",
        "evidence_level": "high"
      }
    },
    {
      "source": "alpha-training",
      "target": "anxiety-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "high",
        "description": "Alpha training is frequently used for anxiety treatment",
        "evidence_level": "medium"
      }
    },
    {
      "source": "smr-training",
      "target": "epilepsy-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "high",
        "description": "SMR training was originally developed for and is still used in epilepsy treatment",
        "evidence_level": "medium"
      }
    },
    {
      "source": "alpha-theta-training",
      "target": "ptsd-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "high",
        "description": "Alpha-theta training is a core protocol for PTSD treatment",
        "evidence_level": "medium"
      }
    },
    {
      "source": "infra-low-frequency",
      "target": "ptsd-treatment",
      "type": "used_for",
      "attributes": {
        "strength": "medium",
        "description": "Infra-low frequency training is increasingly used for complex trauma and PTSD",
        "evidence_level": "emerging"
      }
    },
    {
      "source": "sterman-mb",
      "target": "smr-training",
      "type": "developed",
      "attributes": {
        "year": 1972,
        "description": "Sterman developed SMR training through his work with cats and later humans with epilepsy"
      }
    },
    {
      "source": "lubar-jf",
      "target": "beta-training",
      "type": "developed",
      "attributes": {
        "year": 1976,
        "description": "Lubar pioneered the application of beta training protocols for ADHD"
      }
    },
    {
      "source": "peniston-eg",
      "target": "alpha-theta-training",
      "type": "developed",
      "attributes": {
        "year": 1989,
        "description": "Peniston developed the alpha-theta protocol for alcoholism and PTSD"
      }
    },
    {
      "source": "othmer-sf",
      "target": "infra-low-frequency",
      "type": "developed",
      "attributes": {
        "year": 2006,
        "description": "Othmer pioneered infra-low frequency training for various clinical applications"
      }
    },
    {
      "source": "sterman-mb",
      "target": "sterman-epilepsy-1972",
      "type": "conducted",
      "attributes": {
        "role": "Principal Investigator",
        "description": "Sterman led this groundbreaking study on neurofeedback for epilepsy"
      }
    },
    {
      "source": "lubar-jf",
      "target": "lubar-adhd-1976",
      "type": "conducted",
      "attributes": {
        "role": "Principal Investigator",
        "description": "Lubar conducted this seminal study applying neurofeedback to ADHD"
      }
    },
    {
      "source": "peniston-eg",
      "target": "peniston-alcoholism-1989",
      "type": "conducted",
      "attributes": {
        "role": "Principal Investigator",
        "description": "Peniston led this influential study on alpha-theta training for alcoholism"
      }
    },
    {
      "source": "eeg-amplifier",
      "target": "eeg-neurofeedback",
      "type": "enables",
      "attributes": {
        "description": "EEG amplifiers are essential hardware components for EEG neurofeedback"
      }
    },
    {
      "source": "eeg-cap",
      "target": "eeg-neurofeedback",
      "type": "enables",
      "attributes": {
        "description": "EEG caps/headsets are required to collect brain signals for neurofeedback"
      }
    },
    {
      "source": "nf-software",
      "target": "smr-training",
      "type": "implements",
      "attributes": {
        "description": "Neurofeedback software provides the algorithmic implementation of SMR training protocols"
      }
    },
    {
      "source": "nf-software",
      "target": "alpha-training",
      "type": "implements",
      "attributes": {
        "description": "Neurofeedback software provides the algorithmic implementation of alpha training protocols"
      }
    },
    {
      "source": "operant-conditioning",
      "target": "smr-training",
      "type": "explains",
      "attributes": {
        "description": "Operant conditioning provides the theoretical basis for how SMR training works"
      }
    },
    {
      "source": "neuroplasticity",
      "target": "eeg-neurofeedback",
      "type": "explains",
      "attributes": {
        "description": "Neuroplasticity explains the long-term brain changes that result from neurofeedback training"
      }
    },
    {
      "source": "arousal-model",
      "target": "adhd-treatment",
      "type": "explains",
      "attributes": {
        "description": "The arousal model helps explain why neurofeedback is effective for ADHD"
      }
    }
  ]
};

// Color mapping function
function getColorByType(type) {
  const colors = {
    person: '#4285F4',     // Google Blue
    project: '#EA4335',    // Google Red
    organization: '#FBBC04', // Google Yellow
    place: '#34A853',      // Google Green
    concept: '#9C27B0',    // Purple
    event: '#FF9800',      // Orange
    article: '#795548',    // Brown
    technology: '#607D8B', // Blue Grey
    default: '#9E9E9E'     // Grey
  };
  
  return colors[type] || colors.default;
}

// Initialize graph with data
function initializeGraph(data) {
  const container = document.getElementById('graph');
  if (!container) {
    console.error('Graph container not found');
    return;
  }
  
  // Calculate dimensions
  const containerWidth = container.clientWidth || 800;
  const containerHeight = container.clientHeight || 600;
  const width = Math.min(containerWidth, window.innerWidth - 50);
  const height = Math.min(containerHeight, window.innerHeight - 200);
  
  // Create SVG container
  const svg = d3.select('#graph')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet');
  
  // Add a rect to capture zoom events
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent');
  
  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Create container group for zoom
  const g = svg.append('g');
  
  // Add defs for markers (arrowheads)
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999');
  
  // Create force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40));
  
  // Create container for links
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)');
  
  // Create container for nodes
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'node')
    .attr('data-id', d => d.id)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add circles to nodes
  node.append('circle')
    .attr('r', 8)
    .attr('fill', d => getColorByType(d.type));
  
  // Add text labels to nodes
  node.append('text')
    .text(d => d.label)
    .attr('x', 12)
    .attr('y', 4)
    .attr('font-family', 'Helvetica, Arial, sans-serif')
    .attr('font-size', '12px')
    .attr('text-anchor', 'start');
  
  // Add title tooltips
  node.append('title')
    .text(d => `${d.label} (${d.type})`);
  
  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Add filter controls
  const typeFilters = document.getElementById('type-filters');
  if (typeFilters) {
    const entityTypes = [...new Set(data.nodes.map(d => d.type))];
    entityTypes.forEach(type => {
      const filterDiv = document.createElement('div');
      filterDiv.className = 'filter-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `filter-${type}`;
      checkbox.checked = true;
      checkbox.addEventListener('change', updateFilters);
      
      const label = document.createElement('label');
      label.htmlFor = `filter-${type}`;
      label.textContent = type;
      label.style.color = getColorByType(type);
      
      filterDiv.appendChild(checkbox);
      filterDiv.appendChild(label);
      typeFilters.appendChild(filterDiv);
    });
  }
  
  function updateFilters() {
    const typeFilters = document.getElementById('type-filters');
    if (!typeFilters) return;
    
    const visibleTypes = [];
    Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
      if (input.checked) {
        const type = input.id.replace('filter-', '');
        visibleTypes.push(type);
      }
    });
    
    node.classed('hidden', d => !visibleTypes.includes(d.type));
    link.classed('hidden', d => {
      const sourceNode = data.nodes.find(node => node.id === (d.source.id || d.source));
      const targetNode = data.nodes.find(node => node.id === (d.target.id || d.target));
      return !sourceNode || !targetNode || 
             !visibleTypes.includes(sourceNode.type) || 
             !visibleTypes.includes(targetNode.type);
    });
  }
  
  // Setup zoom controls
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      const typeFilters = document.getElementById('type-filters');
      if (typeFilters) {
        Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
          input.checked = true;
        });
        updateFilters();
      }
    });
  }
  
  // Implement node selection functionality
  node.on('click', (event, d) => {
    // Reset all nodes and links
    node.classed('selected', false).classed('neighbor', false);
    link.classed('highlighted', false);
    
    // Highlight selected node
    d3.select(event.currentTarget).classed('selected', true);
    
    // Find and highlight connected nodes and links
    link.each(function(l) {
      if ((l.source.id === d.id || l.source === d.id) || 
          (l.target.id === d.id || l.target === d.id)) {
        d3.select(this).classed('highlighted', true);
        const otherId = (l.source.id === d.id || l.source === d.id) ? 
          (l.target.id || l.target) : (l.source.id || l.source);
        d3.select('[data-id="' + otherId + '"]').classed('neighbor', true);
      }
    });
  });
  
  // Double-click to open entity page
  node.on('dblclick', (event, d) => {
    window.location.href = d.id + '.html';
  });
  
  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Initialize the visualization when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGraph(data);
});