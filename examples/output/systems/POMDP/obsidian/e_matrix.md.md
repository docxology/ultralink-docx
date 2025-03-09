---
type: matrix
id: e_matrix
---

# Policy Prior

## Metadata

- **Type**: matrix
- **ID**: e_matrix

## Attributes

- **symbol**: E
- **dimensions**: 2,1
- **description**: Defines the prior distribution over policies/actions
- **matrix_type**: policy_prior
- **matrix_data**: 0.5,0.5
- **row_labels**: a1,a2

## Relationships

### Outgoing

- **distributes_over** → [[action_space]] (Action Space)

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)

