---
type: space
id: observation_space
---

# Observation Space

## Metadata

- **Type**: space
- **ID**: observation_space

## Attributes

- **symbol**: o
- **dimensions**: 3,1
- **description**: The set of possible observations an agent can perceive
- **observations**: [object Object],[object Object],[object Object]

## Relationships

### Incoming

- **includes** ← [[pomdp_model]] (Active Inference POMDP Model)
- **maps_from** ← [[a_matrix]] (Observation Likelihood Matrix)
- **evaluates** ← [[c_matrix]] (Preference Matrix)

