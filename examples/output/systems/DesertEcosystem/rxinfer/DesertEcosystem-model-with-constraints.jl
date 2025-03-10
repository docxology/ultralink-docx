# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T17:35:37.009Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: camel (type: animal)
    camel ~ Normal(0.0, 1.0)
    camel_scientificName ~ Categorical([0.5, 0.5])
    camel_lifespan ~ Poisson(1.0)
    camel_diet ~ Categorical([0.5, 0.5])
    camel_status ~ Categorical([0.5, 0.5])
    camel_adaptations ~ Dirichlet(ones(3))
    # Entity: fennec_fox (type: animal)
    fennec_fox ~ Normal(0.0, 1.0)
    fennec_fox_scientificName ~ Categorical([0.5, 0.5])
    fennec_fox_lifespan ~ Poisson(1.0)
    fennec_fox_diet ~ Categorical([0.5, 0.5])
    fennec_fox_status ~ Categorical([0.5, 0.5])
    fennec_fox_adaptations ~ Dirichlet(ones(3))
    # Entity: desert_monitor (type: animal)
    desert_monitor ~ Normal(0.0, 1.0)
    desert_monitor_scientificName ~ Categorical([0.5, 0.5])
    desert_monitor_lifespan ~ Poisson(1.0)
    desert_monitor_diet ~ Categorical([0.5, 0.5])
    desert_monitor_status ~ Categorical([0.5, 0.5])
    desert_monitor_adaptations ~ Dirichlet(ones(3))
    # Entity: sidewinder (type: animal)
    sidewinder ~ Normal(0.0, 1.0)
    sidewinder_scientificName ~ Categorical([0.5, 0.5])
    sidewinder_lifespan ~ Poisson(1.0)
    sidewinder_diet ~ Categorical([0.5, 0.5])
    sidewinder_status ~ Categorical([0.5, 0.5])
    sidewinder_adaptations ~ Dirichlet(ones(3))
    # Entity: scorpion (type: animal)
    scorpion ~ Normal(0.0, 1.0)
    scorpion_lifespan ~ Poisson(1.0)
    scorpion_diet ~ Categorical([0.5, 0.5])
    scorpion_status ~ Categorical([0.5, 0.5])
    scorpion_adaptations ~ Dirichlet(ones(3))
    # Entity: darkling_beetle (type: animal)
    darkling_beetle ~ Normal(0.0, 1.0)
    darkling_beetle_scientificName ~ Categorical([0.5, 0.5])
    darkling_beetle_lifespan ~ Poisson(1.0)
    darkling_beetle_diet ~ Categorical([0.5, 0.5])
    darkling_beetle_status ~ Categorical([0.5, 0.5])
    darkling_beetle_adaptations ~ Dirichlet(ones(3))
    # Entity: roadrunner (type: animal)
    roadrunner ~ Normal(0.0, 1.0)
    roadrunner_lifespan ~ Poisson(1.0)
    roadrunner_diet ~ Categorical([0.5, 0.5])
    roadrunner_status ~ Categorical([0.5, 0.5])
    roadrunner_adaptations ~ Dirichlet(ones(3))
    # Entity: desert_tortoise (type: animal)
    desert_tortoise ~ Normal(0.0, 1.0)
    desert_tortoise_scientificName ~ Categorical([0.5, 0.5])
    desert_tortoise_lifespan ~ Poisson(1.0)
    desert_tortoise_diet ~ Categorical([0.5, 0.5])
    desert_tortoise_status ~ Categorical([0.5, 0.5])
    desert_tortoise_adaptations ~ Dirichlet(ones(3))
    # Entity: cactus_wren (type: animal)
    cactus_wren ~ Normal(0.0, 1.0)
    cactus_wren_lifespan ~ Poisson(1.0)
    cactus_wren_diet ~ Categorical([0.5, 0.5])
    cactus_wren_status ~ Categorical([0.5, 0.5])
    cactus_wren_adaptations ~ Dirichlet(ones(3))
    # Entity: kangaroo_rat (type: animal)
    kangaroo_rat ~ Normal(0.0, 1.0)
    kangaroo_rat_scientificName ~ Categorical([0.5, 0.5])
    kangaroo_rat_lifespan ~ Poisson(1.0)
    kangaroo_rat_diet ~ Categorical([0.5, 0.5])
    kangaroo_rat_status ~ Categorical([0.5, 0.5])
    kangaroo_rat_adaptations ~ Dirichlet(ones(3))
    # Entity: gila_monster (type: animal)
    gila_monster ~ Normal(0.0, 1.0)
    gila_monster_scientificName ~ Categorical([0.5, 0.5])
    gila_monster_lifespan ~ Poisson(1.0)
    gila_monster_diet ~ Categorical([0.5, 0.5])
    gila_monster_status ~ Categorical([0.5, 0.5])
    gila_monster_adaptations ~ Dirichlet(ones(3))
    # Entity: javelina (type: animal)
    javelina ~ Normal(0.0, 1.0)
    javelina_scientificName ~ Categorical([0.5, 0.5])
    javelina_lifespan ~ Poisson(1.0)
    javelina_diet ~ Categorical([0.5, 0.5])
    javelina_status ~ Categorical([0.5, 0.5])
    javelina_adaptations ~ Dirichlet(ones(3))
    # Entity: saguaro (type: plant)
    saguaro ~ Normal(0.0, 1.0)
    saguaro_scientificName ~ Categorical([0.5, 0.5])
    saguaro_height ~ Poisson(1.0)
    saguaro_waterRequirement ~ Categorical([0.5, 0.5])
    saguaro_adaptations ~ Dirichlet(ones(3))
    # Entity: barrel_cactus (type: plant)
    barrel_cactus ~ Normal(0.0, 1.0)
    barrel_cactus_scientificName ~ Categorical([0.5, 0.5])
    barrel_cactus_height ~ Poisson(1.0)
    barrel_cactus_waterRequirement ~ Categorical([0.5, 0.5])
    barrel_cactus_adaptations ~ Dirichlet(ones(3))
    # Entity: mesquite (type: plant)
    mesquite ~ Normal(0.0, 1.0)
    mesquite_scientificName ~ Categorical([0.5, 0.5])
    mesquite_height ~ Poisson(1.0)
    mesquite_waterRequirement ~ Categorical([0.5, 0.5])
    mesquite_adaptations ~ Dirichlet(ones(3))
    # Entity: creosote_bush (type: plant)
    creosote_bush ~ Normal(0.0, 1.0)
    creosote_bush_scientificName ~ Categorical([0.5, 0.5])
    creosote_bush_height ~ Poisson(1.0)
    creosote_bush_waterRequirement ~ Categorical([0.5, 0.5])
    creosote_bush_adaptations ~ Dirichlet(ones(3))
    # Entity: desert_poppy (type: plant)
    desert_poppy ~ Normal(0.0, 1.0)
    desert_poppy_height ~ Poisson(1.0)
    desert_poppy_waterRequirement ~ Categorical([0.5, 0.5])
    desert_poppy_adaptations ~ Dirichlet(ones(3))
    # Entity: ocotillo (type: plant)
    ocotillo ~ Normal(0.0, 1.0)
    ocotillo_scientificName ~ Categorical([0.5, 0.5])
    ocotillo_height ~ Poisson(1.0)
    ocotillo_waterRequirement ~ Categorical([0.5, 0.5])
    ocotillo_adaptations ~ Dirichlet(ones(3))
    # Entity: brittlebush (type: plant)
    brittlebush ~ Normal(0.0, 1.0)
    brittlebush_scientificName ~ Categorical([0.5, 0.5])
    brittlebush_height ~ Poisson(1.0)
    brittlebush_waterRequirement ~ Categorical([0.5, 0.5])
    brittlebush_adaptations ~ Dirichlet(ones(3))
    # Entity: desert_ironwood (type: plant)
    desert_ironwood ~ Normal(0.0, 1.0)
    desert_ironwood_scientificName ~ Categorical([0.5, 0.5])
    desert_ironwood_height ~ Poisson(1.0)
    desert_ironwood_waterRequirement ~ Categorical([0.5, 0.5])
    desert_ironwood_adaptations ~ Dirichlet(ones(3))
    # Entity: agave (type: plant)
    agave ~ Normal(0.0, 1.0)
    agave_scientificName ~ Categorical([0.5, 0.5])
    agave_height ~ Poisson(1.0)
    agave_waterRequirement ~ Categorical([0.5, 0.5])
    agave_adaptations ~ Dirichlet(ones(3))
    # Entity: joshua_tree (type: plant)
    joshua_tree ~ Normal(0.0, 1.0)
    joshua_tree_scientificName ~ Categorical([0.5, 0.5])
    joshua_tree_height ~ Poisson(1.0)
    joshua_tree_waterRequirement ~ Categorical([0.5, 0.5])
    joshua_tree_adaptations ~ Dirichlet(ones(3))
    # Entity: prickly_pear (type: plant)
    prickly_pear ~ Normal(0.0, 1.0)
    prickly_pear_scientificName ~ Categorical([0.5, 0.5])
    prickly_pear_height ~ Poisson(1.0)
    prickly_pear_waterRequirement ~ Categorical([0.5, 0.5])
    prickly_pear_adaptations ~ Dirichlet(ones(3))
    # Entity: cholla_cactus (type: plant)
    cholla_cactus ~ Normal(0.0, 1.0)
    cholla_cactus_scientificName ~ Categorical([0.5, 0.5])
    cholla_cactus_height ~ Poisson(1.0)
    cholla_cactus_waterRequirement ~ Categorical([0.5, 0.5])
    cholla_cactus_adaptations ~ Dirichlet(ones(3))
    # Entity: other_plants (type: plant)
    other_plants ~ Categorical([0.33, 0.33, 0.34])
    other_plants_waterRequirement ~ Categorical([0.5, 0.5])
    other_plants_adaptations ~ Dirichlet(ones(3))
    # Entity: heat (type: abiotic_factor)
    heat ~ Categorical([0.33, 0.33, 0.34])
    heat_type ~ Categorical([0.5, 0.5])
    heat_impact ~ Categorical([0.5, 0.5])
    # Entity: temperature_variation (type: abiotic_factor)
    temperature_variation ~ Categorical([0.33, 0.33, 0.34])
    temperature_variation_type ~ Categorical([0.5, 0.5])
    temperature_variation_impact ~ Categorical([0.5, 0.5])
    # Entity: aridity (type: abiotic_factor)
    aridity ~ Categorical([0.33, 0.33, 0.34])
    aridity_type ~ Categorical([0.5, 0.5])
    aridity_impact ~ Categorical([0.5, 0.5])
    # Entity: sand_dunes (type: abiotic_factor)
    sand_dunes ~ Categorical([0.33, 0.33, 0.34])
    sand_dunes_type ~ Categorical([0.5, 0.5])
    sand_dunes_impact ~ Categorical([0.5, 0.5])
    # Entity: rocky_outcrops (type: abiotic_factor)
    rocky_outcrops ~ Categorical([0.33, 0.33, 0.34])
    rocky_outcrops_type ~ Categorical([0.5, 0.5])
    rocky_outcrops_impact ~ Categorical([0.5, 0.5])
    # Entity: oasis (type: abiotic_factor)
    oasis ~ Categorical([0.33, 0.33, 0.34])
    oasis_type ~ Categorical([0.5, 0.5])
    oasis_impact ~ Categorical([0.5, 0.5])
    # Entity: ephemeral_streams (type: abiotic_factor)
    ephemeral_streams ~ Categorical([0.33, 0.33, 0.34])
    ephemeral_streams_type ~ Categorical([0.5, 0.5])
    ephemeral_streams_impact ~ Categorical([0.5, 0.5])
    # Entity: sandy_soil (type: abiotic_factor)
    sandy_soil ~ Categorical([0.33, 0.33, 0.34])
    sandy_soil_type ~ Categorical([0.5, 0.5])
    sandy_soil_impact ~ Categorical([0.5, 0.5])
    # Entity: desert_pavement (type: abiotic_factor)
    desert_pavement ~ Categorical([0.33, 0.33, 0.34])
    desert_pavement_type ~ Categorical([0.5, 0.5])
    desert_pavement_impact ~ Categorical([0.5, 0.5])
    # Entity: desert_varnish (type: abiotic_factor)
    desert_varnish ~ Categorical([0.33, 0.33, 0.34])
    desert_varnish_type ~ Categorical([0.5, 0.5])
    desert_varnish_impact ~ Categorical([0.5, 0.5])
    # Entity: playa (type: abiotic_factor)
    playa ~ Categorical([0.33, 0.33, 0.34])
    playa_type ~ Categorical([0.5, 0.5])
    playa_impact ~ Categorical([0.5, 0.5])
    # Entity: flash_floods (type: abiotic_factor)
    flash_floods ~ Categorical([0.33, 0.33, 0.34])
    flash_floods_type ~ Categorical([0.5, 0.5])
    flash_floods_impact ~ Categorical([0.5, 0.5])
    # Entity: wash (type: microhabitat)
    wash ~ Categorical([0.33, 0.33, 0.34])
    wash_type ~ Categorical([0.5, 0.5])
    wash_area ~ Categorical([0.5, 0.5])
    # Entity: dune_field (type: microhabitat)
    dune_field ~ Categorical([0.33, 0.33, 0.34])
    dune_field_type ~ Categorical([0.5, 0.5])
    dune_field_area ~ Categorical([0.5, 0.5])
    dune_field_soilMoisture ~ Categorical([0.5, 0.5])
    # Entity: rocky_slope (type: microhabitat)
    rocky_slope ~ Categorical([0.33, 0.33, 0.34])
    rocky_slope_type ~ Categorical([0.5, 0.5])
    rocky_slope_area ~ Categorical([0.5, 0.5])
    rocky_slope_soilMoisture ~ Categorical([0.5, 0.5])
    # Entity: canyon (type: microhabitat)
    canyon ~ Categorical([0.33, 0.33, 0.34])
    canyon_type ~ Categorical([0.5, 0.5])
    canyon_area ~ Categorical([0.5, 0.5])
    canyon_soilMoisture ~ Categorical([0.5, 0.5])
    # Entity: pollination_yucca (type: interaction)
    pollination_yucca ~ Categorical([0.33, 0.33, 0.34])
    pollination_yucca_type ~ Categorical([0.5, 0.5])
    pollination_yucca_participants ~ Dirichlet(ones(2))
    pollination_yucca_strength ~ Categorical([0.5, 0.5])
    # Entity: nurse_plant (type: interaction)
    nurse_plant ~ Categorical([0.33, 0.33, 0.34])
    nurse_plant_type ~ Categorical([0.5, 0.5])
    nurse_plant_participants ~ Dirichlet(ones(2))
    nurse_plant_strength ~ Categorical([0.5, 0.5])
    # Entity: seed_dispersal (type: interaction)
    seed_dispersal ~ Categorical([0.33, 0.33, 0.34])
    seed_dispersal_type ~ Categorical([0.5, 0.5])
    seed_dispersal_participants ~ Dirichlet(ones(2))
    seed_dispersal_strength ~ Categorical([0.5, 0.5])
    # Entity: yucca_moth (type: animal)
    yucca_moth ~ Normal(0.0, 1.0)
    yucca_moth_lifespan ~ Beta(1.0, 1.0)
    yucca_moth_diet ~ Categorical([0.5, 0.5])
    yucca_moth_status ~ Categorical([0.5, 0.5])
    yucca_moth_adaptations ~ Dirichlet(ones(3))
    # Entity: coyote (type: animal)
    coyote ~ Normal(0.0, 1.0)
    coyote_scientificName ~ Categorical([0.5, 0.5])
    coyote_lifespan ~ Poisson(1.0)
    coyote_diet ~ Categorical([0.5, 0.5])
    coyote_status ~ Categorical([0.5, 0.5])
    coyote_adaptations ~ Dirichlet(ones(3))

    # Define relationships between variables
    # Relationship: camel (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * camel, 1.0)
    camel_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    camel_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: fennec_fox (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * fennec_fox, 1.0)
    fennec_fox_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    fennec_fox_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: darkling_beetle (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * darkling_beetle, 1.0)
    darkling_beetle_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    darkling_beetle_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: sidewinder (adapted_to) sand_dunes-adapted_to
    sand_dunes_adapted_to ~ Normal(0.1 * sidewinder, 1.0)
    sidewinder_adapted_to_sand_dunes_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    sidewinder_adapted_to_sand_dunes_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: sidewinder (lives_in) dune_field-lives_in
    dune_field_lives_in ~ Normal(0.1 * sidewinder, 1.0)
    sidewinder_lives_in_dune_field_lives_in_frequency ~ Categorical([0.5, 0.5])
    sidewinder_lives_in_dune_field_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: sidewinder (preys_on) kangaroo_rat-preys_on
    kangaroo_rat_preys_on ~ Normal(0.1 * sidewinder, 1.0)
    sidewinder_preys_on_kangaroo_rat_preys_on_frequency ~ Categorical([0.5, 0.5])
    sidewinder_preys_on_kangaroo_rat_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: desert_tortoise (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * desert_tortoise, 1.0)
    desert_tortoise_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    desert_tortoise_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: desert_tortoise (lives_in) rocky_slope-lives_in
    rocky_slope_lives_in ~ Normal(0.1 * desert_tortoise, 1.0)
    desert_tortoise_lives_in_rocky_slope_lives_in_frequency ~ Categorical([0.5, 0.5])
    desert_tortoise_lives_in_rocky_slope_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: desert_tortoise (consumes) desert_poppy-consumes
    desert_poppy_consumes ~ Normal(0.1 * desert_tortoise, 1.0)
    desert_tortoise_consumes_desert_poppy_consumes_frequency ~ Categorical([0.5, 0.5])
    desert_tortoise_consumes_desert_poppy_consumes_method ~ Categorical([0.5, 0.5])
    # Relationship: kangaroo_rat (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * kangaroo_rat, 1.0)
    kangaroo_rat_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    kangaroo_rat_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: kangaroo_rat (lives_in) dune_field-lives_in
    dune_field_lives_in ~ Normal(0.1 * kangaroo_rat, 1.0)
    kangaroo_rat_lives_in_dune_field_lives_in_frequency ~ Categorical([0.5, 0.5])
    kangaroo_rat_lives_in_dune_field_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: kangaroo_rat (consumes) mesquite-consumes
    mesquite_consumes ~ Normal(0.1 * kangaroo_rat, 1.0)
    kangaroo_rat_consumes_mesquite_consumes_frequency ~ Categorical([0.5, 0.5])
    kangaroo_rat_consumes_mesquite_consumes_method ~ Categorical([0.5, 0.5])
    # Relationship: gila_monster (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * gila_monster, 1.0)
    gila_monster_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    gila_monster_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: gila_monster (lives_in) rocky_slope-lives_in
    rocky_slope_lives_in ~ Normal(0.1 * gila_monster, 1.0)
    gila_monster_lives_in_rocky_slope_lives_in_frequency ~ Categorical([0.5, 0.5])
    gila_monster_lives_in_rocky_slope_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: gila_monster (preys_on) cactus_wren-preys_on
    cactus_wren_preys_on ~ Normal(0.1 * gila_monster, 1.0)
    gila_monster_preys_on_cactus_wren_preys_on_frequency ~ Categorical([0.5, 0.5])
    gila_monster_preys_on_cactus_wren_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: cactus_wren (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * cactus_wren, 1.0)
    cactus_wren_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    cactus_wren_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: cactus_wren (lives_in) wash-lives_in
    wash_lives_in ~ Normal(0.1 * cactus_wren, 1.0)
    cactus_wren_lives_in_wash_lives_in_frequency ~ Categorical([0.5, 0.5])
    cactus_wren_lives_in_wash_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: javelina (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * javelina, 1.0)
    javelina_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    javelina_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: javelina (lives_in) canyon-lives_in
    canyon_lives_in ~ Normal(0.1 * javelina, 1.0)
    javelina_lives_in_canyon_lives_in_frequency ~ Categorical([0.5, 0.5])
    javelina_lives_in_canyon_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: javelina (consumes) prickly_pear-consumes
    prickly_pear_consumes ~ Normal(0.1 * javelina, 1.0)
    javelina_consumes_prickly_pear_consumes_frequency ~ Categorical([0.5, 0.5])
    javelina_consumes_prickly_pear_consumes_method ~ Categorical([0.5, 0.5])
    # Relationship: yucca_moth (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * yucca_moth, 1.0)
    yucca_moth_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    yucca_moth_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: yucca_moth (mutual_dependency) joshua_tree-mutual_dependency
    joshua_tree_mutual_dependency ~ Normal(0.1 * yucca_moth, 1.0)
    yucca_moth_mutual_dependency_joshua_tree_mutual_dependency_relationship ~ Categorical([0.5, 0.5])
    yucca_moth_mutual_dependency_joshua_tree_mutual_dependency_strength ~ Categorical([0.5, 0.5])
    # Relationship: coyote (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * coyote, 1.0)
    coyote_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    coyote_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: coyote (lives_in) canyon-lives_in
    canyon_lives_in ~ Normal(0.1 * coyote, 1.0)
    coyote_lives_in_canyon_lives_in_frequency ~ Categorical([0.5, 0.5])
    coyote_lives_in_canyon_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: coyote (preys_on) kangaroo_rat-preys_on
    kangaroo_rat_preys_on ~ Normal(0.1 * coyote, 1.0)
    coyote_preys_on_kangaroo_rat_preys_on_frequency ~ Categorical([0.5, 0.5])
    coyote_preys_on_kangaroo_rat_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: coyote (preys_on) desert_tortoise-preys_on
    desert_tortoise_preys_on ~ Normal(0.1 * coyote, 1.0)
    coyote_preys_on_desert_tortoise_preys_on_frequency ~ Categorical([0.5, 0.5])
    coyote_preys_on_desert_tortoise_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: saguaro (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * saguaro, 1.0)
    saguaro_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    saguaro_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: saguaro (grows_in) rocky_slope-grows_in
    rocky_slope_grows_in ~ Normal(0.1 * saguaro, 1.0)
    saguaro_grows_in_rocky_slope_grows_in_frequency ~ Categorical([0.5, 0.5])
    saguaro_grows_in_rocky_slope_grows_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: barrel_cactus (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * barrel_cactus, 1.0)
    barrel_cactus_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    barrel_cactus_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: mesquite (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * mesquite, 1.0)
    mesquite_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    mesquite_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: mesquite (grows_in) wash-grows_in
    wash_grows_in ~ Normal(0.1 * mesquite, 1.0)
    mesquite_grows_in_wash_grows_in_frequency ~ Categorical([0.5, 0.5])
    mesquite_grows_in_wash_grows_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: mesquite (facilitates) desert_poppy-facilitates
    desert_poppy_facilitates ~ Normal(0.1 * mesquite, 1.0)
    mesquite_facilitates_desert_poppy_facilitates_relationship ~ Categorical([0.5, 0.5])
    mesquite_facilitates_desert_poppy_facilitates_strength ~ Categorical([0.5, 0.5])
    # Relationship: creosote_bush (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * creosote_bush, 1.0)
    creosote_bush_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    creosote_bush_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: creosote_bush (inhibits) other_plants-inhibits
    other_plants_inhibits ~ Normal(0.1 * creosote_bush, 1.0)
    creosote_bush_inhibits_other_plants_inhibits_relationship ~ Categorical([0.5, 0.5])
    creosote_bush_inhibits_other_plants_inhibits_strength ~ Categorical([0.5, 0.5])
    # Relationship: ocotillo (adapted_to) temperature_variation-adapted_to
    temperature_variation_adapted_to ~ Normal(0.1 * ocotillo, 1.0)
    ocotillo_adapted_to_temperature_variation_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    ocotillo_adapted_to_temperature_variation_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: brittlebush (adapted_to) heat-adapted_to
    heat_adapted_to ~ Normal(0.1 * brittlebush, 1.0)
    brittlebush_adapted_to_heat_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    brittlebush_adapted_to_heat_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: brittlebush (grows_in) rocky_slope-grows_in
    rocky_slope_grows_in ~ Normal(0.1 * brittlebush, 1.0)
    brittlebush_grows_in_rocky_slope_grows_in_frequency ~ Categorical([0.5, 0.5])
    brittlebush_grows_in_rocky_slope_grows_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: desert_ironwood (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * desert_ironwood, 1.0)
    desert_ironwood_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    desert_ironwood_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: desert_ironwood (grows_in) wash-grows_in
    wash_grows_in ~ Normal(0.1 * desert_ironwood, 1.0)
    desert_ironwood_grows_in_wash_grows_in_frequency ~ Categorical([0.5, 0.5])
    desert_ironwood_grows_in_wash_grows_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: desert_ironwood (nurses) saguaro-nurses
    saguaro_nurses ~ Normal(0.1 * desert_ironwood, 1.0)
    desert_ironwood_nurses_saguaro_nurses_relationship ~ Categorical([0.5, 0.5])
    desert_ironwood_nurses_saguaro_nurses_strength ~ Categorical([0.5, 0.5])
    # Relationship: agave (adapted_to) aridity-adapted_to
    aridity_adapted_to ~ Normal(0.1 * agave, 1.0)
    agave_adapted_to_aridity_adapted_to_adaptationMechanism ~ Categorical([0.5, 0.5])
    agave_adapted_to_aridity_adapted_to_strength ~ Categorical([0.5, 0.5])
    # Relationship: joshua_tree (grows_in) sandy_soil-grows_in
    sandy_soil_grows_in ~ Normal(0.1 * joshua_tree, 1.0)
    joshua_tree_grows_in_sandy_soil_grows_in_frequency ~ Categorical([0.5, 0.5])
    joshua_tree_grows_in_sandy_soil_grows_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: joshua_tree (mutual_dependency) yucca_moth-mutual_dependency
    yucca_moth_mutual_dependency ~ Normal(0.1 * joshua_tree, 1.0)
    joshua_tree_mutual_dependency_yucca_moth_mutual_dependency_relationship ~ Categorical([0.5, 0.5])
    joshua_tree_mutual_dependency_yucca_moth_mutual_dependency_strength ~ Categorical([0.5, 0.5])
    # Relationship: scorpion (lives_in) rocky_slope-lives_in
    rocky_slope_lives_in ~ Normal(0.1 * scorpion, 1.0)
    scorpion_lives_in_rocky_slope_lives_in_frequency ~ Categorical([0.5, 0.5])
    scorpion_lives_in_rocky_slope_lives_in_dependency ~ Categorical([0.5, 0.5])
    # Relationship: desert_monitor (preys_on) scorpion-preys_on
    scorpion_preys_on ~ Normal(0.1 * desert_monitor, 1.0)
    desert_monitor_preys_on_scorpion_preys_on_frequency ~ Categorical([0.5, 0.5])
    desert_monitor_preys_on_scorpion_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: roadrunner (preys_on) scorpion-preys_on
    scorpion_preys_on ~ Normal(0.1 * roadrunner, 1.0)
    roadrunner_preys_on_scorpion_preys_on_frequency ~ Categorical([0.5, 0.5])
    roadrunner_preys_on_scorpion_preys_on_method ~ Categorical([0.5, 0.5])
    # Relationship: roadrunner (preys_on) sidewinder-preys_on
    sidewinder_preys_on ~ Normal(0.1 * roadrunner, 1.0)
    roadrunner_preys_on_sidewinder_preys_on_frequency ~ Categorical([0.5, 0.5])
    roadrunner_preys_on_sidewinder_preys_on_method ~ Categorical([0.5, 0.5])

    # Return variables of interest
    return (camel, fennec_fox, desert_monitor, sidewinder, scorpion, darkling_beetle, roadrunner, desert_tortoise, cactus_wren, kangaroo_rat, gila_monster, javelina, saguaro, barrel_cactus, mesquite, creosote_bush, desert_poppy, ocotillo, brittlebush, desert_ironwood, agave, joshua_tree, prickly_pear, cholla_cactus, other_plants, heat, temperature_variation, aridity, sand_dunes, rocky_outcrops, oasis, ephemeral_streams, sandy_soil, desert_pavement, desert_varnish, playa, flash_floods, wash, dune_field, rocky_slope, canyon, pollination_yucca, nurse_plant, seed_dispersal, yucca_moth, coyote)
end

@constraints function ultralink_model_constraints()
    # Mean-field factorization
    q(camel, fennec_fox, desert_monitor, sidewinder, scorpion, darkling_beetle, roadrunner, desert_tortoise, cactus_wren, kangaroo_rat, gila_monster, javelina, saguaro, barrel_cactus, mesquite, creosote_bush, desert_poppy, ocotillo, brittlebush, desert_ironwood, agave, joshua_tree, prickly_pear, cholla_cactus, other_plants, heat, temperature_variation, aridity, sand_dunes, rocky_outcrops, oasis, ephemeral_streams, sandy_soil, desert_pavement, desert_varnish, playa, flash_floods, wash, dune_field, rocky_slope, canyon, pollination_yucca, nurse_plant, seed_dispersal, yucca_moth, coyote) = q(camel)q(fennec_fox)q(desert_monitor)q(sidewinder)q(scorpion)q(darkling_beetle)q(roadrunner)q(desert_tortoise)q(cactus_wren)q(kangaroo_rat)q(gila_monster)q(javelina)q(saguaro)q(barrel_cactus)q(mesquite)q(creosote_bush)q(desert_poppy)q(ocotillo)q(brittlebush)q(desert_ironwood)q(agave)q(joshua_tree)q(prickly_pear)q(cholla_cactus)q(other_plants)q(heat)q(temperature_variation)q(aridity)q(sand_dunes)q(rocky_outcrops)q(oasis)q(ephemeral_streams)q(sandy_soil)q(desert_pavement)q(desert_varnish)q(playa)q(flash_floods)q(wash)q(dune_field)q(rocky_slope)q(canyon)q(pollination_yucca)q(nurse_plant)q(seed_dispersal)q(yucca_moth)q(coyote)

    # Distribution family constraints
    q(camel) :: ExponentialFamily
    q(fennec_fox) :: ExponentialFamily
    q(desert_monitor) :: ExponentialFamily
    q(sidewinder) :: ExponentialFamily
    q(scorpion) :: ExponentialFamily
    q(darkling_beetle) :: ExponentialFamily
    q(roadrunner) :: ExponentialFamily
    q(desert_tortoise) :: ExponentialFamily
    q(cactus_wren) :: ExponentialFamily
    q(kangaroo_rat) :: ExponentialFamily
    q(gila_monster) :: ExponentialFamily
    q(javelina) :: ExponentialFamily
    q(saguaro) :: ExponentialFamily
    q(barrel_cactus) :: ExponentialFamily
    q(mesquite) :: ExponentialFamily
    q(creosote_bush) :: ExponentialFamily
    q(desert_poppy) :: ExponentialFamily
    q(ocotillo) :: ExponentialFamily
    q(brittlebush) :: ExponentialFamily
    q(desert_ironwood) :: ExponentialFamily
    q(agave) :: ExponentialFamily
    q(joshua_tree) :: ExponentialFamily
    q(prickly_pear) :: ExponentialFamily
    q(cholla_cactus) :: ExponentialFamily
    q(other_plants) :: ExponentialFamily
    q(heat) :: ExponentialFamily
    q(temperature_variation) :: ExponentialFamily
    q(aridity) :: ExponentialFamily
    q(sand_dunes) :: ExponentialFamily
    q(rocky_outcrops) :: ExponentialFamily
    q(oasis) :: ExponentialFamily
    q(ephemeral_streams) :: ExponentialFamily
    q(sandy_soil) :: ExponentialFamily
    q(desert_pavement) :: ExponentialFamily
    q(desert_varnish) :: ExponentialFamily
    q(playa) :: ExponentialFamily
    q(flash_floods) :: ExponentialFamily
    q(wash) :: ExponentialFamily
    q(dune_field) :: ExponentialFamily
    q(rocky_slope) :: ExponentialFamily
    q(canyon) :: ExponentialFamily
    q(pollination_yucca) :: ExponentialFamily
    q(nurse_plant) :: ExponentialFamily
    q(seed_dispersal) :: ExponentialFamily
    q(yucca_moth) :: ExponentialFamily
    q(coyote) :: ExponentialFamily
end