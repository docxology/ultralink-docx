---
type: space
id: state_space
---

# Latent State Space

## Metadata

- **Type**: space
- **ID**: state_space

## Attributes

- **symbol**: s
- **dimensions**: 5,1
- **description**: The set of possible hidden states the environment can be in
- **states**: [object Object],[object Object],[object Object],[object Object],[object Object]

## Relationships

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)
- **maps_to** ← [[a_matrix]] (Observation Likelihood Matrix)
- **maps_from** ← [[b_matrix]] (State Transition Matrix)
- **maps_to** ← [[b_matrix]] (State Transition Matrix)
- **distributes_over** ← [[d_matrix]] (Initial State Prior)

