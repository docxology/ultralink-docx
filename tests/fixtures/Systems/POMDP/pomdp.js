/**
 * Partially Observable Markov Decision Process (POMDP) Test Fixtures
 * 
 * This module provides test data for a POMDP implemented using Active Inference principles.
 * The dataset demonstrates UltraLink's capabilities for modeling computational systems with
 * formal mathematical structures.
 */

const { UltraLink } = require('../../../../src');

/**
 * Creates a POMDP dataset modeling Active Inference computational components
 * @returns {UltraLink} Populated UltraLink instance
 */
function createPOMDPDataset() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Add core entities
  ultralink.addEntity('pomdp_model', 'model', {
    name: 'Active Inference POMDP Model',
    description: 'A Partially Observable Markov Decision Process implemented with Active Inference',
    domain: 'computational_neuroscience',
    model_type: 'discrete',
    discount_factor: 0.95,
    horizon: 10,
    time_steps: 100
  });
  
  // Define observation space with specific observations
  ultralink.addEntity('observation_space', 'space', {
    name: 'Observation Space',
    symbol: 'o',
    dimensions: [3, 1],
    description: 'The set of possible observations an agent can perceive',
    observations: [
      { id: 'o1', name: 'Observation 1', description: 'Low sensory input' },
      { id: 'o2', name: 'Observation 2', description: 'Medium sensory input' },
      { id: 'o3', name: 'Observation 3', description: 'High sensory input' }
    ]
  });
  
  // Define state space with specific states
  ultralink.addEntity('state_space', 'space', {
    name: 'Latent State Space',
    symbol: 's',
    dimensions: [5, 1],
    description: 'The set of possible hidden states the environment can be in',
    states: [
      { id: 's1', name: 'State 1', description: 'Very low state value' },
      { id: 's2', name: 'State 2', description: 'Low state value' },
      { id: 's3', name: 'State 3', description: 'Medium state value' },
      { id: 's4', name: 'State 4', description: 'High state value' },
      { id: 's5', name: 'State 5', description: 'Very high state value' }
    ]
  });
  
  // Define action space with specific actions
  ultralink.addEntity('action_space', 'space', {
    name: 'Action Space',
    symbol: 'a',
    dimensions: [2, 1],
    description: 'The set of possible actions an agent can take',
    actions: [
      { id: 'a1', name: 'Action 1', description: 'Decrease value' },
      { id: 'a2', name: 'Action 2', description: 'Increase value' }
    ]
  });
  
  // A matrix (Likelihood/Observation) - probability of observations given states: P(o|s)
  ultralink.addEntity('a_matrix', 'matrix', {
    name: 'Observation Likelihood Matrix',
    symbol: 'A',
    dimensions: [3, 5],
    description: 'Maps hidden states to observations (likelihood mapping)',
    matrix_type: 'likelihood',
    matrix_data: [
      // Each row represents an observation, each column a state
      // Format: P(observation|state)
      [0.8, 0.3, 0.1, 0.0, 0.0], // P(o1|s1), P(o1|s2), ..., P(o1|s5)
      [0.2, 0.6, 0.7, 0.3, 0.1], // P(o2|s1), P(o2|s2), ..., P(o2|s5)
      [0.0, 0.1, 0.2, 0.7, 0.9]  // P(o3|s1), P(o3|s2), ..., P(o3|s5)
    ],
    precision: 0.9,
    column_labels: ['s1', 's2', 's3', 's4', 's5'],
    row_labels: ['o1', 'o2', 'o3']
  });
  
  // B matrix (Transition) - probability of state transitions given actions: P(s'|s,a)
  ultralink.addEntity('b_matrix', 'matrix', {
    name: 'State Transition Matrix',
    symbol: 'B',
    dimensions: [5, 5, 2],
    description: 'Defines the dynamics of state transitions based on actions',
    matrix_type: 'transition',
    // 3D matrix represented as an array of 2D matrices (one per action)
    matrix_data: [
      // Action 1 (Decrease value)
      [
        [0.9, 0.2, 0.0, 0.0, 0.0], // P(s1'|s1,a1), P(s1'|s2,a1), ..., P(s1'|s5,a1)
        [0.1, 0.7, 0.2, 0.0, 0.0], // P(s2'|s1,a1), P(s2'|s2,a1), ..., P(s2'|s5,a1)
        [0.0, 0.1, 0.7, 0.2, 0.0], // P(s3'|s1,a1), P(s3'|s2,a1), ..., P(s3'|s5,a1)
        [0.0, 0.0, 0.1, 0.7, 0.1], // P(s4'|s1,a1), P(s4'|s2,a1), ..., P(s4'|s5,a1)
        [0.0, 0.0, 0.0, 0.1, 0.9]  // P(s5'|s1,a1), P(s5'|s2,a1), ..., P(s5'|s5,a1)
      ],
      // Action 2 (Increase value)
      [
        [0.9, 0.1, 0.0, 0.0, 0.0], // P(s1'|s1,a2), P(s1'|s2,a2), ..., P(s1'|s5,a2)
        [0.1, 0.7, 0.1, 0.0, 0.0], // P(s2'|s1,a2), P(s2'|s2,a2), ..., P(s2'|s5,a2)
        [0.0, 0.2, 0.7, 0.1, 0.0], // P(s3'|s1,a2), P(s3'|s2,a2), ..., P(s3'|s5,a2)
        [0.0, 0.0, 0.2, 0.7, 0.1], // P(s4'|s1,a2), P(s4'|s2,a2), ..., P(s4'|s5,a2)
        [0.0, 0.0, 0.0, 0.2, 0.9]  // P(s5'|s1,a2), P(s5'|s2,a2), ..., P(s5'|s5,a2)
      ]
    ],
    action_labels: ['a1', 'a2'],
    column_labels: ['s1', 's2', 's3', 's4', 's5'],
    row_labels: ['s1', 's2', 's3', 's4', 's5']
  });
  
  // C matrix (Preference/Reward) - preferred observations (log probabilities)
  ultralink.addEntity('c_matrix', 'matrix', {
    name: 'Preference Matrix',
    symbol: 'C',
    dimensions: [3, 1],
    description: 'Specifies the agent preferences over observations (as log probabilities)',
    matrix_type: 'preference',
    matrix_data: [
      [-3.0], // log P(o1) - strongly unpreferred
      [0.0],  // log P(o2) - neutral
      [3.0]   // log P(o3) - strongly preferred
    ],
    row_labels: ['o1', 'o2', 'o3'],
    precision: 1.0
  });
  
  // D matrix (Initial state prior)
  ultralink.addEntity('d_matrix', 'matrix', {
    name: 'Initial State Prior',
    symbol: 'D',
    dimensions: [5, 1],
    description: 'Defines the prior distribution over initial states',
    matrix_type: 'prior',
    matrix_data: [
      [0.2], // P(s1) at t=0
      [0.2], // P(s2) at t=0
      [0.4], // P(s3) at t=0
      [0.1], // P(s4) at t=0
      [0.1]  // P(s5) at t=0
    ],
    row_labels: ['s1', 's2', 's3', 's4', 's5']
  });
  
  // E matrix (Policy prior)
  ultralink.addEntity('e_matrix', 'matrix', {
    name: 'Policy Prior',
    symbol: 'E',
    dimensions: [2, 1],
    description: 'Defines the prior distribution over policies/actions',
    matrix_type: 'policy_prior',
    matrix_data: [
      [0.5], // P(a1) - prior probability of action 1
      [0.5]  // P(a2) - prior probability of action 2
    ],
    row_labels: ['a1', 'a2']
  });
  
  // Add simple relationships
  ultralink.addRelationship('pomdp_model', 'observation_space', 'includes');
  ultralink.addRelationship('pomdp_model', 'state_space', 'includes');
  ultralink.addRelationship('pomdp_model', 'action_space', 'includes');
  ultralink.addRelationship('pomdp_model', 'a_matrix', 'includes');
  ultralink.addRelationship('pomdp_model', 'b_matrix', 'includes');
  ultralink.addRelationship('pomdp_model', 'c_matrix', 'includes');
  ultralink.addRelationship('pomdp_model', 'd_matrix', 'includes');
  ultralink.addRelationship('pomdp_model', 'e_matrix', 'includes');
  
  // Add parameter relationships
  ultralink.addRelationship('a_matrix', 'observation_space', 'maps_from');
  ultralink.addRelationship('a_matrix', 'state_space', 'maps_to');
  ultralink.addRelationship('b_matrix', 'state_space', 'maps_from');
  ultralink.addRelationship('b_matrix', 'state_space', 'maps_to');
  ultralink.addRelationship('b_matrix', 'action_space', 'conditioned_on');
  ultralink.addRelationship('c_matrix', 'observation_space', 'evaluates');
  ultralink.addRelationship('d_matrix', 'state_space', 'distributes_over');
  ultralink.addRelationship('e_matrix', 'action_space', 'distributes_over');
  
  return ultralink;
}

module.exports = {
  createPOMDPDataset
}; 