---
type: matrix
id: d_matrix
---

# Initial State Prior

## Metadata

- **Type**: matrix
- **ID**: d_matrix

## Attributes

- **symbol**: D
- **dimensions**: 5,1
- **description**: Defines the prior distribution over initial states
- **matrix_type**: prior
- **matrix_data**: 0.2,0.2,0.4,0.1,0.1
- **row_labels**: s1,s2,s3,s4,s5

## Relationships

### Outgoing

- **distributes_over** → [[state_space]] (Latent State Space)

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)

