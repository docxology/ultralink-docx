# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T19:33:31.933Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: pomdp_model (type: model)
    pomdp_model ~ Normal(0.0, 1.0)
    pomdp_model_model_type ~ Categorical([0.5, 0.5])
    pomdp_model_discount_factor ~ Beta(1.0, 1.0)
    pomdp_model_horizon ~ Poisson(1.0)
    pomdp_model_time_steps ~ Poisson(1.0)
    # Entity: observation_space (type: space)
    observation_space ~ Categorical([0.33, 0.33, 0.34])
    observation_space_symbol ~ Categorical([0.5, 0.5])
    observation_space_dimensions ~ Dirichlet(ones(2))
    observation_space_observations ~ Dirichlet(ones(3))
    # Entity: state_space (type: space)
    state_space ~ Categorical([0.33, 0.33, 0.34])
    state_space_symbol ~ Categorical([0.5, 0.5])
    state_space_dimensions ~ Dirichlet(ones(2))
    state_space_states ~ Dirichlet(ones(3))
    # Entity: action_space (type: space)
    action_space ~ Categorical([0.33, 0.33, 0.34])
    action_space_symbol ~ Categorical([0.5, 0.5])
    action_space_dimensions ~ Dirichlet(ones(2))
    action_space_actions ~ Dirichlet(ones(2))
    # Entity: a_matrix (type: matrix)
    a_matrix ~ Normal(0.0, 1.0)
    a_matrix_symbol ~ Categorical([0.5, 0.5])
    a_matrix_dimensions ~ Dirichlet(ones(2))
    a_matrix_matrix_type ~ Categorical([0.5, 0.5])
    a_matrix_matrix_data ~ Dirichlet(ones(3))
    a_matrix_precision ~ Beta(1.0, 1.0)
    a_matrix_column_labels ~ Dirichlet(ones(3))
    a_matrix_row_labels ~ Dirichlet(ones(3))
    # Entity: b_matrix (type: matrix)
    b_matrix ~ Categorical([0.33, 0.33, 0.34])
    b_matrix_symbol ~ Categorical([0.5, 0.5])
    b_matrix_dimensions ~ Dirichlet(ones(3))
    b_matrix_matrix_type ~ Categorical([0.5, 0.5])
    b_matrix_matrix_data ~ Dirichlet(ones(2))
    b_matrix_action_labels ~ Dirichlet(ones(2))
    b_matrix_column_labels ~ Dirichlet(ones(3))
    b_matrix_row_labels ~ Dirichlet(ones(3))
    # Entity: c_matrix (type: matrix)
    c_matrix ~ Normal(0.0, 1.0)
    c_matrix_symbol ~ Categorical([0.5, 0.5])
    c_matrix_dimensions ~ Dirichlet(ones(2))
    c_matrix_matrix_type ~ Categorical([0.5, 0.5])
    c_matrix_matrix_data ~ Dirichlet(ones(3))
    c_matrix_row_labels ~ Dirichlet(ones(3))
    c_matrix_precision ~ Beta(1.0, 1.0)
    # Entity: d_matrix (type: matrix)
    d_matrix ~ Categorical([0.33, 0.33, 0.34])
    d_matrix_symbol ~ Categorical([0.5, 0.5])
    d_matrix_dimensions ~ Dirichlet(ones(2))
    d_matrix_matrix_type ~ Categorical([0.5, 0.5])
    d_matrix_matrix_data ~ Dirichlet(ones(3))
    d_matrix_row_labels ~ Dirichlet(ones(3))
    # Entity: e_matrix (type: matrix)
    e_matrix ~ Categorical([0.33, 0.33, 0.34])
    e_matrix_symbol ~ Categorical([0.5, 0.5])
    e_matrix_dimensions ~ Dirichlet(ones(2))
    e_matrix_matrix_type ~ Categorical([0.5, 0.5])
    e_matrix_matrix_data ~ Dirichlet(ones(2))
    e_matrix_row_labels ~ Dirichlet(ones(2))

    # Define relationships between variables
    # Relationship: pomdp_model (includes) observation_space-includes
    observation_space_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) state_space-includes
    state_space_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) action_space-includes
    action_space_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) a_matrix-includes
    a_matrix_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) b_matrix-includes
    b_matrix_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) c_matrix-includes
    c_matrix_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) d_matrix-includes
    d_matrix_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: pomdp_model (includes) e_matrix-includes
    e_matrix_includes ~ Bernoulli(sigmoid(pomdp_model))
    # Relationship: a_matrix (maps_from) observation_space-maps_from
    observation_space_maps_from ~ Normal(0.1 * a_matrix, 1.0)
    # Relationship: a_matrix (maps_to) state_space-maps_to
    state_space_maps_to ~ Normal(0.1 * a_matrix, 1.0)
    # Relationship: b_matrix (maps_from) state_space-maps_from
    state_space_maps_from ~ Normal(0.1 * b_matrix, 1.0)
    # Relationship: b_matrix (maps_to) state_space-maps_to
    state_space_maps_to ~ Normal(0.1 * b_matrix, 1.0)
    # Relationship: b_matrix (conditioned_on) action_space-conditioned_on
    action_space_conditioned_on ~ Normal(0.1 * b_matrix, 1.0)
    # Relationship: c_matrix (evaluates) observation_space-evaluates
    observation_space_evaluates ~ Normal(0.1 * c_matrix, 1.0)
    # Relationship: d_matrix (distributes_over) state_space-distributes_over
    state_space_distributes_over ~ Normal(0.1 * d_matrix, 1.0)
    # Relationship: e_matrix (distributes_over) action_space-distributes_over
    action_space_distributes_over ~ Normal(0.1 * e_matrix, 1.0)

    # Return variables of interest
    return (pomdp_model, observation_space, state_space, action_space, a_matrix, b_matrix, c_matrix, d_matrix, e_matrix)
end

# Test script for ultralink_model

function test_ultralink_model()
    # Create the model
    model = ultralink_model()

    # Run inference
    result = infer(
        model = model,
        data = (
            pomdp_model = rand(Normal(0.0, 1.0)),
            observation_space = rand(Normal(0.0, 1.0)),
            state_space = rand(Normal(0.0, 1.0)),
        )
    )

    # Access posterior distributions
    posterior_pomdp_model = result.posteriors[:pomdp_model]
    posterior_observation_space = result.posteriors[:observation_space]
    posterior_state_space = result.posteriors[:state_space]

    return result
end

# Run the test
test_ultralink_model()