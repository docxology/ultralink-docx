---
type: model
id: pomdp_model
---

# Active Inference POMDP Model

## Metadata

- **Type**: model
- **ID**: pomdp_model

## Attributes

- **description**: A Partially Observable Markov Decision Process implemented with Active Inference
- **domain**: computational_neuroscience
- **model_type**: discrete
- **discount_factor**: 0.95
- **horizon**: 10
- **time_steps**: 100

## Relationships

### Outgoing

- **includes** → [[observation_space]] (Observation Space)
- **includes** → [[state_space]] (Latent State Space)
- **includes** → [[action_space]] (Action Space)
- **includes** → [[a_matrix]] (Observation Likelihood Matrix)
- **includes** → [[b_matrix]] (State Transition Matrix)
- **includes** → [[c_matrix]] (Preference Matrix)
- **includes** → [[d_matrix]] (Initial State Prior)
- **includes** → [[e_matrix]] (Policy Prior)

