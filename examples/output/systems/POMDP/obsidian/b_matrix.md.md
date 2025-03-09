---
type: matrix
id: b_matrix
---

# State Transition Matrix

## Metadata

- **Type**: matrix
- **ID**: b_matrix

## Attributes

- **symbol**: B
- **dimensions**: 5,5,2
- **description**: Defines the dynamics of state transitions based on actions
- **matrix_type**: transition
- **matrix_data**: 0.9,0.2,0,0,0,0.1,0.7,0.2,0,0,0,0.1,0.7,0.2,0,0,0,0.1,0.7,0.1,0,0,0,0.1,0.9,0.9,0.1,0,0,0,0.1,0.7,0.1,0,0,0,0.2,0.7,0.1,0,0,0,0.2,0.7,0.1,0,0,0,0.2,0.9
- **action_labels**: a1,a2
- **column_labels**: s1,s2,s3,s4,s5
- **row_labels**: s1,s2,s3,s4,s5

## Relationships

### Outgoing

- **maps_from** → [[state_space]] (Latent State Space)
- **maps_to** → [[state_space]] (Latent State Space)
- **conditioned_on** → [[action_space]] (Action Space)

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)

