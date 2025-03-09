---
type: space
id: action_space
---

# Action Space

## Metadata

- **Type**: space
- **ID**: action_space

## Attributes

- **symbol**: a
- **dimensions**: 2,1
- **description**: The set of possible actions an agent can take
- **actions**: [object Object],[object Object]

## Relationships

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)
- **conditioned_on** ← [[b_matrix]] (State Transition Matrix)
- **distributes_over** ← [[e_matrix]] (Policy Prior)

