---
type: matrix
id: c_matrix
---

# Preference Matrix

## Metadata

- **Type**: matrix
- **ID**: c_matrix

## Attributes

- **symbol**: C
- **dimensions**: 3,1
- **description**: Specifies the agent preferences over observations (as log probabilities)
- **matrix_type**: preference
- **matrix_data**: -3,0,3
- **row_labels**: o1,o2,o3
- **precision**: 1

## Relationships

### Outgoing

- **evaluates** → [[observation_space]] (Observation Space)

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)

