---
type: matrix
id: a_matrix
---

# Observation Likelihood Matrix

## Metadata

- **Type**: matrix
- **ID**: a_matrix

## Attributes

- **symbol**: A
- **dimensions**: 3,5
- **description**: Maps hidden states to observations (likelihood mapping)
- **matrix_type**: likelihood
- **matrix_data**: 0.8,0.3,0.1,0,0,0.2,0.6,0.7,0.3,0.1,0,0.1,0.2,0.7,0.9
- **precision**: 0.9
- **column_labels**: s1,s2,s3,s4,s5
- **row_labels**: o1,o2,o3

## Relationships

### Outgoing

- **maps_from** → [[observation_space]] (Observation Space)
- **maps_to** → [[state_space]] (Latent State Space)

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)

