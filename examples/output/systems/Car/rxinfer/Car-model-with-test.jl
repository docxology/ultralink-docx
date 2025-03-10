# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T19:33:30.865Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: sedan-model (type: vehicle)
    sedan_model ~ Categorical([0.33, 0.33, 0.34])
    sedan_model_type ~ Categorical([0.5, 0.5])
    sedan_model_year ~ Categorical([0.5, 0.5])
    sedan_model_dimensions ~ Categorical([0.5, 0.5])
    sedan_model_weight ~ Categorical([0.5, 0.5])
    sedan_model_fuelType ~ Categorical([0.5, 0.5])
    sedan_model_fuelEfficiency ~ Categorical([0.5, 0.5])
    sedan_model_engineSize ~ Categorical([0.5, 0.5])
    sedan_model_status ~ Categorical([0.5, 0.5])
    # Entity: engine-system (type: component)
    engine_system ~ Categorical([0.33, 0.33, 0.34])
    engine_system_componentType ~ Categorical([0.5, 0.5])
    engine_system_partNumber ~ Categorical([0.5, 0.5])
    engine_system_weight ~ Categorical([0.5, 0.5])
    engine_system_dimensions ~ Categorical([0.5, 0.5])
    engine_system_manufacturer ~ Categorical([0.5, 0.5])
    engine_system_status ~ Categorical([0.5, 0.5])
    # Entity: engine-block (type: component)
    engine_block ~ Normal(0.0, 1.0)
    engine_block_componentType ~ Categorical([0.5, 0.5])
    engine_block_partNumber ~ Categorical([0.5, 0.5])
    engine_block_material ~ Categorical([0.5, 0.5])
    engine_block_cylinders ~ Poisson(1.0)
    engine_block_weight ~ Categorical([0.5, 0.5])
    engine_block_manufacturer ~ Categorical([0.5, 0.5])
    engine_block_status ~ Categorical([0.5, 0.5])
    # Entity: pistons (type: component)
    pistons ~ Normal(0.0, 1.0)
    pistons_componentType ~ Categorical([0.5, 0.5])
    pistons_partNumber ~ Categorical([0.5, 0.5])
    pistons_material ~ Categorical([0.5, 0.5])
    pistons_count ~ Poisson(1.0)
    pistons_weight ~ Categorical([0.5, 0.5])
    pistons_manufacturer ~ Categorical([0.5, 0.5])
    pistons_status ~ Categorical([0.5, 0.5])
    # Entity: fuel-injection (type: component)
    fuel_injection ~ Categorical([0.33, 0.33, 0.34])
    fuel_injection_componentType ~ Categorical([0.5, 0.5])
    fuel_injection_partNumber ~ Categorical([0.5, 0.5])
    fuel_injection_type ~ Categorical([0.5, 0.5])
    fuel_injection_pressure ~ Categorical([0.5, 0.5])
    fuel_injection_weight ~ Categorical([0.5, 0.5])
    fuel_injection_manufacturer ~ Categorical([0.5, 0.5])
    fuel_injection_status ~ Categorical([0.5, 0.5])
    # Entity: electric-motor (type: component)
    electric_motor ~ Categorical([0.33, 0.33, 0.34])
    electric_motor_componentType ~ Categorical([0.5, 0.5])
    electric_motor_partNumber ~ Categorical([0.5, 0.5])
    electric_motor_power ~ Categorical([0.5, 0.5])
    electric_motor_voltage ~ Categorical([0.5, 0.5])
    electric_motor_weight ~ Categorical([0.5, 0.5])
    electric_motor_manufacturer ~ Categorical([0.5, 0.5])
    electric_motor_status ~ Categorical([0.5, 0.5])
    # Entity: transmission-system (type: component)
    transmission_system ~ Categorical([0.33, 0.33, 0.34])
    transmission_system_componentType ~ Categorical([0.5, 0.5])
    transmission_system_partNumber ~ Categorical([0.5, 0.5])
    transmission_system_type ~ Categorical([0.5, 0.5])
    transmission_system_weight ~ Categorical([0.5, 0.5])
    transmission_system_manufacturer ~ Categorical([0.5, 0.5])
    transmission_system_status ~ Categorical([0.5, 0.5])
    # Entity: cvt-belt (type: component)
    cvt_belt ~ Categorical([0.33, 0.33, 0.34])
    cvt_belt_componentType ~ Categorical([0.5, 0.5])
    cvt_belt_partNumber ~ Categorical([0.5, 0.5])
    cvt_belt_weight ~ Categorical([0.5, 0.5])
    cvt_belt_manufacturer ~ Categorical([0.5, 0.5])
    cvt_belt_status ~ Categorical([0.5, 0.5])
    # Entity: torque-converter (type: component)
    torque_converter ~ Categorical([0.33, 0.33, 0.34])
    torque_converter_componentType ~ Categorical([0.5, 0.5])
    torque_converter_partNumber ~ Categorical([0.5, 0.5])
    torque_converter_diameter ~ Categorical([0.5, 0.5])
    torque_converter_weight ~ Categorical([0.5, 0.5])
    torque_converter_manufacturer ~ Categorical([0.5, 0.5])
    torque_converter_status ~ Categorical([0.5, 0.5])
    # Entity: chassis-system (type: component)
    chassis_system ~ Categorical([0.33, 0.33, 0.34])
    chassis_system_componentType ~ Categorical([0.5, 0.5])
    chassis_system_partNumber ~ Categorical([0.5, 0.5])
    chassis_system_weight ~ Categorical([0.5, 0.5])
    chassis_system_status ~ Categorical([0.5, 0.5])
    # Entity: interior-system (type: component)
    interior_system ~ Categorical([0.33, 0.33, 0.34])
    interior_system_componentType ~ Categorical([0.5, 0.5])
    interior_system_partNumber ~ Categorical([0.5, 0.5])
    interior_system_capacity ~ Categorical([0.5, 0.5])
    interior_system_weight ~ Categorical([0.5, 0.5])
    interior_system_status ~ Categorical([0.5, 0.5])
    # Entity: dashboard (type: component)
    dashboard ~ Categorical([0.33, 0.33, 0.34])
    dashboard_componentType ~ Categorical([0.5, 0.5])
    dashboard_partNumber ~ Categorical([0.5, 0.5])
    dashboard_features ~ Dirichlet(ones(3))
    dashboard_weight ~ Categorical([0.5, 0.5])
    dashboard_status ~ Categorical([0.5, 0.5])
    # Entity: seats (type: component)
    seats ~ Categorical([0.33, 0.33, 0.34])
    seats_componentType ~ Categorical([0.5, 0.5])
    seats_partNumber ~ Categorical([0.5, 0.5])
    seats_material ~ Categorical([0.5, 0.5])
    seats_features ~ Dirichlet(ones(3))
    seats_weight ~ Categorical([0.5, 0.5])
    seats_status ~ Categorical([0.5, 0.5])
    # Entity: infotainment (type: component)
    infotainment ~ Categorical([0.33, 0.33, 0.34])
    infotainment_componentType ~ Categorical([0.5, 0.5])
    infotainment_partNumber ~ Categorical([0.5, 0.5])
    infotainment_screenSize ~ Categorical([0.5, 0.5])
    infotainment_features ~ Dirichlet(ones(3))
    infotainment_weight ~ Categorical([0.5, 0.5])
    infotainment_status ~ Categorical([0.5, 0.5])
    # Entity: wheel-system (type: component)
    wheel_system ~ Normal(0.0, 1.0)
    wheel_system_componentType ~ Categorical([0.5, 0.5])
    wheel_system_partNumber ~ Categorical([0.5, 0.5])
    wheel_system_count ~ Poisson(1.0)
    wheel_system_weight ~ Categorical([0.5, 0.5])
    wheel_system_manufacturer ~ Categorical([0.5, 0.5])
    wheel_system_status ~ Categorical([0.5, 0.5])
    # Entity: rims (type: component)
    rims ~ Normal(0.0, 1.0)
    rims_componentType ~ Categorical([0.5, 0.5])
    rims_partNumber ~ Categorical([0.5, 0.5])
    rims_size ~ Categorical([0.5, 0.5])
    rims_material ~ Categorical([0.5, 0.5])
    rims_count ~ Poisson(1.0)
    rims_weight ~ Categorical([0.5, 0.5])
    rims_manufacturer ~ Categorical([0.5, 0.5])
    rims_status ~ Categorical([0.5, 0.5])
    # Entity: tires (type: component)
    tires ~ Normal(0.0, 1.0)
    tires_componentType ~ Categorical([0.5, 0.5])
    tires_partNumber ~ Categorical([0.5, 0.5])
    tires_size ~ Categorical([0.5, 0.5])
    tires_type ~ Categorical([0.5, 0.5])
    tires_count ~ Poisson(1.0)
    tires_weight ~ Categorical([0.5, 0.5])
    tires_manufacturer ~ Categorical([0.5, 0.5])
    tires_status ~ Categorical([0.5, 0.5])
    # Entity: brake-system (type: component)
    brake_system ~ Categorical([0.33, 0.33, 0.34])
    brake_system_componentType ~ Categorical([0.5, 0.5])
    brake_system_partNumber ~ Categorical([0.5, 0.5])
    brake_system_type ~ Categorical([0.5, 0.5])
    brake_system_features ~ Dirichlet(ones(3))
    brake_system_weight ~ Categorical([0.5, 0.5])
    brake_system_manufacturer ~ Categorical([0.5, 0.5])
    brake_system_status ~ Categorical([0.5, 0.5])
    # Entity: electrical-system (type: component)
    electrical_system ~ Categorical([0.33, 0.33, 0.34])
    electrical_system_componentType ~ Categorical([0.5, 0.5])
    electrical_system_partNumber ~ Categorical([0.5, 0.5])
    electrical_system_voltage ~ Categorical([0.5, 0.5])
    electrical_system_weight ~ Categorical([0.5, 0.5])
    electrical_system_status ~ Categorical([0.5, 0.5])
    # Entity: battery (type: component)
    battery ~ Categorical([0.33, 0.33, 0.34])
    battery_componentType ~ Categorical([0.5, 0.5])
    battery_partNumber ~ Categorical([0.5, 0.5])
    battery_capacity ~ Categorical([0.5, 0.5])
    battery_voltage ~ Categorical([0.5, 0.5])
    battery_weight ~ Categorical([0.5, 0.5])
    battery_status ~ Categorical([0.5, 0.5])
    # Entity: suspension-system (type: component)
    suspension_system ~ Categorical([0.33, 0.33, 0.34])
    suspension_system_componentType ~ Categorical([0.5, 0.5])
    suspension_system_partNumber ~ Categorical([0.5, 0.5])
    suspension_system_type ~ Categorical([0.5, 0.5])
    suspension_system_weight ~ Categorical([0.5, 0.5])
    suspension_system_manufacturer ~ Categorical([0.5, 0.5])
    suspension_system_status ~ Categorical([0.5, 0.5])
    # Entity: engine-specifications (type: specifications)
    engine_specifications ~ Categorical([0.33, 0.33, 0.34])
    engine_specifications_version ~ Categorical([0.5, 0.5])
    engine_specifications_lastUpdated ~ Categorical([0.5, 0.5])
    engine_specifications_author ~ Categorical([0.5, 0.5])
    engine_specifications_sections ~ Dirichlet(ones(3))
    # Entity: safety-standards (type: specifications)
    safety_standards ~ Categorical([0.33, 0.33, 0.34])
    safety_standards_version ~ Categorical([0.5, 0.5])
    safety_standards_lastUpdated ~ Categorical([0.5, 0.5])
    safety_standards_author ~ Categorical([0.5, 0.5])
    safety_standards_standards ~ Dirichlet(ones(3))
    # Entity: maintenance-guide (type: documentation)
    maintenance_guide ~ Categorical([0.33, 0.33, 0.34])
    maintenance_guide_documentType ~ Categorical([0.5, 0.5])
    maintenance_guide_version ~ Categorical([0.5, 0.5])
    maintenance_guide_lastUpdated ~ Categorical([0.5, 0.5])
    maintenance_guide_author ~ Categorical([0.5, 0.5])
    maintenance_guide_sections ~ Dirichlet(ones(3))
    # Entity: chief-engineer (type: person)
    chief_engineer ~ Categorical([0.5, 0.5])
    chief_engineer_department ~ Categorical([0.5, 0.5])
    chief_engineer_expertise ~ Dirichlet(ones(3))
    # Entity: engine-engineer (type: person)
    engine_engineer ~ Categorical([0.5, 0.5])
    engine_engineer_expertise ~ Dirichlet(ones(3))
    # Entity: electrical-engineer (type: person)
    electrical_engineer ~ Categorical([0.5, 0.5])
    electrical_engineer_expertise ~ Dirichlet(ones(3))
    # Entity: interior-designer (type: person)
    interior_designer ~ Categorical([0.5, 0.5])
    interior_designer_department ~ Categorical([0.5, 0.5])
    interior_designer_expertise ~ Dirichlet(ones(3))
    # Entity: manufacturing-plant (type: facility)
    manufacturing_plant ~ Normal(0.0, 1.0)
    manufacturing_plant_location ~ Categorical([0.5, 0.5])
    manufacturing_plant_size ~ Categorical([0.5, 0.5])
    manufacturing_plant_employees ~ Poisson(1.0)
    manufacturing_plant_established ~ Categorical([0.5, 0.5])
    # Entity: camshaft (type: component)
    camshaft ~ Categorical([0.33, 0.33, 0.34])
    camshaft_componentType ~ Categorical([0.5, 0.5])
    camshaft_partNumber ~ Categorical([0.5, 0.5])
    camshaft_material ~ Categorical([0.5, 0.5])
    camshaft_weight ~ Categorical([0.5, 0.5])
    camshaft_manufacturer ~ Categorical([0.5, 0.5])
    camshaft_status ~ Categorical([0.5, 0.5])
    # Entity: valves (type: component)
    valves ~ Normal(0.0, 1.0)
    valves_componentType ~ Categorical([0.5, 0.5])
    valves_partNumber ~ Categorical([0.5, 0.5])
    valves_material ~ Categorical([0.5, 0.5])
    valves_count ~ Poisson(1.0)
    valves_weight ~ Categorical([0.5, 0.5])
    valves_manufacturer ~ Categorical([0.5, 0.5])
    valves_status ~ Categorical([0.5, 0.5])
    # Entity: crankshaft (type: component)
    crankshaft ~ Categorical([0.33, 0.33, 0.34])
    crankshaft_componentType ~ Categorical([0.5, 0.5])
    crankshaft_partNumber ~ Categorical([0.5, 0.5])
    crankshaft_material ~ Categorical([0.5, 0.5])
    crankshaft_weight ~ Categorical([0.5, 0.5])
    crankshaft_manufacturer ~ Categorical([0.5, 0.5])
    crankshaft_status ~ Categorical([0.5, 0.5])
    # Entity: cooling-system (type: component)
    cooling_system ~ Categorical([0.33, 0.33, 0.34])
    cooling_system_componentType ~ Categorical([0.5, 0.5])
    cooling_system_partNumber ~ Categorical([0.5, 0.5])
    cooling_system_weight ~ Categorical([0.5, 0.5])
    cooling_system_manufacturer ~ Categorical([0.5, 0.5])
    cooling_system_status ~ Categorical([0.5, 0.5])
    # Entity: radiator (type: component)
    radiator ~ Categorical([0.33, 0.33, 0.34])
    radiator_componentType ~ Categorical([0.5, 0.5])
    radiator_partNumber ~ Categorical([0.5, 0.5])
    radiator_material ~ Categorical([0.5, 0.5])
    radiator_weight ~ Categorical([0.5, 0.5])
    radiator_manufacturer ~ Categorical([0.5, 0.5])
    radiator_status ~ Categorical([0.5, 0.5])
    # Entity: water-pump (type: component)
    water_pump ~ Categorical([0.33, 0.33, 0.34])
    water_pump_componentType ~ Categorical([0.5, 0.5])
    water_pump_partNumber ~ Categorical([0.5, 0.5])
    water_pump_type ~ Categorical([0.5, 0.5])
    water_pump_weight ~ Categorical([0.5, 0.5])
    water_pump_manufacturer ~ Categorical([0.5, 0.5])
    water_pump_status ~ Categorical([0.5, 0.5])
    # Entity: hvac-system (type: component)
    hvac_system ~ Categorical([0.33, 0.33, 0.34])
    hvac_system_componentType ~ Categorical([0.5, 0.5])
    hvac_system_partNumber ~ Categorical([0.5, 0.5])
    hvac_system_weight ~ Categorical([0.5, 0.5])
    hvac_system_manufacturer ~ Categorical([0.5, 0.5])
    hvac_system_status ~ Categorical([0.5, 0.5])
    # Entity: ac-compressor (type: component)
    ac_compressor ~ Categorical([0.33, 0.33, 0.34])
    ac_compressor_componentType ~ Categorical([0.5, 0.5])
    ac_compressor_partNumber ~ Categorical([0.5, 0.5])
    ac_compressor_type ~ Categorical([0.5, 0.5])
    ac_compressor_weight ~ Categorical([0.5, 0.5])
    ac_compressor_manufacturer ~ Categorical([0.5, 0.5])
    ac_compressor_status ~ Categorical([0.5, 0.5])
    # Entity: heater-core (type: component)
    heater_core ~ Categorical([0.33, 0.33, 0.34])
    heater_core_componentType ~ Categorical([0.5, 0.5])
    heater_core_partNumber ~ Categorical([0.5, 0.5])
    heater_core_material ~ Categorical([0.5, 0.5])
    heater_core_weight ~ Categorical([0.5, 0.5])
    heater_core_manufacturer ~ Categorical([0.5, 0.5])
    heater_core_status ~ Categorical([0.5, 0.5])
    # Entity: exhaust-system (type: component)
    exhaust_system ~ Categorical([0.33, 0.33, 0.34])
    exhaust_system_componentType ~ Categorical([0.5, 0.5])
    exhaust_system_partNumber ~ Categorical([0.5, 0.5])
    exhaust_system_weight ~ Categorical([0.5, 0.5])
    exhaust_system_manufacturer ~ Categorical([0.5, 0.5])
    exhaust_system_status ~ Categorical([0.5, 0.5])
    # Entity: catalytic-converter (type: component)
    catalytic_converter ~ Categorical([0.33, 0.33, 0.34])
    catalytic_converter_componentType ~ Categorical([0.5, 0.5])
    catalytic_converter_partNumber ~ Categorical([0.5, 0.5])
    catalytic_converter_type ~ Categorical([0.5, 0.5])
    catalytic_converter_weight ~ Categorical([0.5, 0.5])
    catalytic_converter_manufacturer ~ Categorical([0.5, 0.5])
    catalytic_converter_status ~ Categorical([0.5, 0.5])
    # Entity: muffler (type: component)
    muffler ~ Categorical([0.33, 0.33, 0.34])
    muffler_componentType ~ Categorical([0.5, 0.5])
    muffler_partNumber ~ Categorical([0.5, 0.5])
    muffler_material ~ Categorical([0.5, 0.5])
    muffler_weight ~ Categorical([0.5, 0.5])
    muffler_manufacturer ~ Categorical([0.5, 0.5])
    muffler_status ~ Categorical([0.5, 0.5])
    # Entity: airbag-system (type: component)
    airbag_system ~ Normal(0.0, 1.0)
    airbag_system_componentType ~ Categorical([0.5, 0.5])
    airbag_system_partNumber ~ Categorical([0.5, 0.5])
    airbag_system_airbagCount ~ Poisson(1.0)
    airbag_system_weight ~ Categorical([0.5, 0.5])
    airbag_system_manufacturer ~ Categorical([0.5, 0.5])
    airbag_system_status ~ Categorical([0.5, 0.5])
    # Entity: seatbelt-system (type: component)
    seatbelt_system ~ Normal(0.0, 1.0)
    seatbelt_system_componentType ~ Categorical([0.5, 0.5])
    seatbelt_system_partNumber ~ Categorical([0.5, 0.5])
    seatbelt_system_seatCount ~ Poisson(1.0)
    seatbelt_system_weight ~ Categorical([0.5, 0.5])
    seatbelt_system_manufacturer ~ Categorical([0.5, 0.5])
    seatbelt_system_status ~ Categorical([0.5, 0.5])
    # Entity: hvac-specifications (type: specifications)
    hvac_specifications ~ Categorical([0.33, 0.33, 0.34])
    hvac_specifications_version ~ Categorical([0.5, 0.5])
    hvac_specifications_lastUpdated ~ Categorical([0.5, 0.5])
    hvac_specifications_author ~ Categorical([0.5, 0.5])
    hvac_specifications_sections ~ Dirichlet(ones(3))
    # Entity: exhaust-specifications (type: specifications)
    exhaust_specifications ~ Categorical([0.33, 0.33, 0.34])
    exhaust_specifications_version ~ Categorical([0.5, 0.5])
    exhaust_specifications_lastUpdated ~ Categorical([0.5, 0.5])
    exhaust_specifications_author ~ Categorical([0.5, 0.5])
    exhaust_specifications_sections ~ Dirichlet(ones(3))
    # Entity: hvac-engineer (type: person)
    hvac_engineer ~ Categorical([0.5, 0.5])
    hvac_engineer_department ~ Categorical([0.5, 0.5])
    hvac_engineer_expertise ~ Dirichlet(ones(3))
    # Entity: safety-engineer (type: person)
    safety_engineer ~ Categorical([0.5, 0.5])
    safety_engineer_department ~ Categorical([0.5, 0.5])
    safety_engineer_expertise ~ Dirichlet(ones(3))
    # Entity: quality-manager (type: person)
    quality_manager ~ Categorical([0.5, 0.5])
    quality_manager_department ~ Categorical([0.5, 0.5])
    quality_manager_expertise ~ Dirichlet(ones(3))

    # Define relationships between variables
    # Relationship: sedan-model (contains) engine-system-contains
    engine_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) transmission-system-contains
    transmission_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) chassis-system-contains
    chassis_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) interior-system-contains
    interior_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) wheel-system-contains
    wheel_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) brake-system-contains
    brake_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) electrical-system-contains
    electrical_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) suspension-system-contains
    suspension_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (complies_with) safety-standards-complies_with
    safety_standards_complies_with ~ Normal(0.1 * sedan_model, 1.0)
    # Relationship: sedan-model (documented_by) maintenance-guide-documented_by
    maintenance_guide_documented_by ~ Normal(0.1 * sedan_model, 1.0)
    # Relationship: sedan-model (contains) cooling-system-contains
    cooling_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) hvac-system-contains
    hvac_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) exhaust-system-contains
    exhaust_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) airbag-system-contains
    airbag_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: sedan-model (contains) seatbelt-system-contains
    seatbelt_system_contains ~ Bernoulli(sigmoid(sedan_model))
    # Relationship: engine-system (contains) engine-block-contains
    engine_block_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (contains) pistons-contains
    pistons_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (contains) fuel-injection-contains
    fuel_injection_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (contains) electric-motor-contains
    electric_motor_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (depends_on) electrical-system-depends_on
    electrical_system_depends_on ~ Bernoulli(sigmoid(2.0 * engine_system))
    # Relationship: engine-system (connects_to) transmission-system-connects_to
    transmission_system_connects_to ~ Normal(0.1 * engine_system, 1.0)
    # Relationship: engine-system (documented_by) engine-specifications-documented_by
    engine_specifications_documented_by ~ Normal(0.1 * engine_system, 1.0)
    # Relationship: engine-system (contains) camshaft-contains
    camshaft_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (contains) valves-contains
    valves_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (contains) crankshaft-contains
    crankshaft_contains ~ Bernoulli(sigmoid(engine_system))
    # Relationship: engine-system (outputs_to) exhaust-system-outputs_to
    exhaust_system_outputs_to ~ Normal(0.1 * engine_system, 1.0)
    # Relationship: transmission-system (contains) cvt-belt-contains
    cvt_belt_contains ~ Bernoulli(sigmoid(transmission_system))
    # Relationship: transmission-system (contains) torque-converter-contains
    torque_converter_contains ~ Bernoulli(sigmoid(transmission_system))
    # Relationship: transmission-system (transfers_power_to) wheel-system-transfers_power_to
    wheel_system_transfers_power_to ~ Normal(0.1 * transmission_system, 1.0)
    # Relationship: interior-system (contains) dashboard-contains
    dashboard_contains ~ Bernoulli(sigmoid(interior_system))
    # Relationship: interior-system (contains) seats-contains
    seats_contains ~ Bernoulli(sigmoid(interior_system))
    # Relationship: interior-system (contains) infotainment-contains
    infotainment_contains ~ Bernoulli(sigmoid(interior_system))
    # Relationship: wheel-system (contains) rims-contains
    rims_contains ~ Bernoulli(sigmoid(wheel_system))
    # Relationship: wheel-system (contains) tires-contains
    tires_contains ~ Bernoulli(sigmoid(wheel_system))
    # Relationship: electrical-system (contains) battery-contains
    battery_contains ~ Bernoulli(sigmoid(electrical_system))
    # Relationship: electrical-system (connects_to) infotainment-connects_to
    infotainment_connects_to ~ Normal(0.1 * electrical_system, 1.0)
    # Relationship: brake-system (acts_on) wheel-system-acts_on
    wheel_system_acts_on ~ Normal(0.1 * brake_system, 1.0)
    # Relationship: suspension-system (supports) wheel-system-supports
    wheel_system_supports ~ Normal(0.1 * suspension_system, 1.0)
    # Relationship: suspension-system (attaches_to) chassis-system-attaches_to
    chassis_system_attaches_to ~ Normal(0.1 * suspension_system, 1.0)
    # Relationship: chief-engineer (oversees) sedan-model-oversees
    sedan_model_oversees ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: chief-engineer (supervises) engine-engineer-supervises
    engine_engineer_supervises ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: chief-engineer (supervises) electrical-engineer-supervises
    electrical_engineer_supervises ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: chief-engineer (supervises) interior-designer-supervises
    interior_designer_supervises ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: chief-engineer (supervises) hvac-engineer-supervises
    hvac_engineer_supervises ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: chief-engineer (supervises) safety-engineer-supervises
    safety_engineer_supervises ~ Normal(0.1 * chief_engineer, 1.0)
    # Relationship: engine-engineer (designs) engine-system-designs
    engine_system_designs ~ Normal(0.1 * engine_engineer, 1.0)
    # Relationship: engine-engineer (collaborates_with) electrical-engineer-collaborates_with
    electrical_engineer_collaborates_with ~ Normal(0.1 * engine_engineer, 1.0)
    # Relationship: electrical-engineer (designs) electrical-system-designs
    electrical_system_designs ~ Normal(0.1 * electrical_engineer, 1.0)
    # Relationship: electrical-engineer (designs) battery-designs
    battery_designs ~ Normal(0.1 * electrical_engineer, 1.0)
    # Relationship: electrical-engineer (collaborates_with) interior-designer-collaborates_with
    interior_designer_collaborates_with ~ Normal(0.1 * electrical_engineer, 1.0)
    # Relationship: interior-designer (designs) interior-system-designs
    interior_system_designs ~ Normal(0.1 * interior_designer, 1.0)
    # Relationship: manufacturing-plant (manufactures) sedan-model-manufactures
    sedan_model_manufactures ~ Normal(0.1 * manufacturing_plant, 1.0)
    # Relationship: cooling-system (contains) radiator-contains
    radiator_contains ~ Bernoulli(sigmoid(cooling_system))
    # Relationship: cooling-system (contains) water-pump-contains
    water_pump_contains ~ Bernoulli(sigmoid(cooling_system))
    # Relationship: cooling-system (cools) engine-system-cools
    engine_system_cools ~ Normal(0.1 * cooling_system, 1.0)
    # Relationship: cooling-system (depends_on) electrical-system-depends_on
    electrical_system_depends_on ~ Bernoulli(sigmoid(2.0 * cooling_system))
    # Relationship: hvac-system (contains) ac-compressor-contains
    ac_compressor_contains ~ Bernoulli(sigmoid(hvac_system))
    # Relationship: hvac-system (contains) heater-core-contains
    heater_core_contains ~ Bernoulli(sigmoid(hvac_system))
    # Relationship: hvac-system (depends_on) electrical-system-depends_on
    electrical_system_depends_on ~ Bernoulli(sigmoid(2.0 * hvac_system))
    # Relationship: hvac-system (documented_by) hvac-specifications-documented_by
    hvac_specifications_documented_by ~ Normal(0.1 * hvac_system, 1.0)
    # Relationship: hvac-system (interacts_with) cooling-system-interacts_with
    cooling_system_interacts_with ~ Normal(0.1 * hvac_system, 1.0)
    # Relationship: exhaust-system (contains) catalytic-converter-contains
    catalytic_converter_contains ~ Bernoulli(sigmoid(exhaust_system))
    # Relationship: exhaust-system (contains) muffler-contains
    muffler_contains ~ Bernoulli(sigmoid(exhaust_system))
    # Relationship: exhaust-system (connects_to) engine-system-connects_to
    engine_system_connects_to ~ Normal(0.1 * exhaust_system, 1.0)
    # Relationship: exhaust-system (documented_by) exhaust-specifications-documented_by
    exhaust_specifications_documented_by ~ Normal(0.1 * exhaust_system, 1.0)
    # Relationship: airbag-system (depends_on) electrical-system-depends_on
    electrical_system_depends_on ~ Bernoulli(sigmoid(2.0 * airbag_system))
    # Relationship: seatbelt-system (depends_on) electrical-system-depends_on
    electrical_system_depends_on ~ Bernoulli(sigmoid(2.0 * seatbelt_system))
    # Relationship: hvac-engineer (designs) hvac-system-designs
    hvac_system_designs ~ Normal(0.1 * hvac_engineer, 1.0)
    # Relationship: hvac-engineer (collaborates_with) electrical-engineer-collaborates_with
    electrical_engineer_collaborates_with ~ Normal(0.1 * hvac_engineer, 1.0)
    # Relationship: safety-engineer (designs) airbag-system-designs
    airbag_system_designs ~ Normal(0.1 * safety_engineer, 1.0)
    # Relationship: safety-engineer (designs) seatbelt-system-designs
    seatbelt_system_designs ~ Normal(0.1 * safety_engineer, 1.0)
    # Relationship: safety-engineer (collaborates_with) electrical-engineer-collaborates_with
    electrical_engineer_collaborates_with ~ Normal(0.1 * safety_engineer, 1.0)
    # Relationship: quality-manager (oversees_quality) sedan-model-oversees_quality
    sedan_model_oversees_quality ~ Normal(0.1 * quality_manager, 1.0)
    # Relationship: quality-manager (reports_to) chief-engineer-reports_to
    chief_engineer_reports_to ~ Normal(0.1 * quality_manager, 1.0)

    # Return variables of interest
    return (sedan_model, engine_system, engine_block, pistons, fuel_injection, electric_motor, transmission_system, cvt_belt, torque_converter, chassis_system, interior_system, dashboard, seats, infotainment, wheel_system, rims, tires, brake_system, electrical_system, battery, suspension_system, engine_specifications, safety_standards, maintenance_guide, chief_engineer, engine_engineer, electrical_engineer, interior_designer, manufacturing_plant, camshaft, valves, crankshaft, cooling_system, radiator, water_pump, hvac_system, ac_compressor, heater_core, exhaust_system, catalytic_converter, muffler, airbag_system, seatbelt_system, hvac_specifications, exhaust_specifications, hvac_engineer, safety_engineer, quality_manager)
end

# Test script for ultralink_model

function test_ultralink_model()
    # Create the model
    model = ultralink_model()

    # Run inference
    result = infer(
        model = model,
        data = (
            sedan_model = rand(Normal(0.0, 1.0)),
            engine_system = rand(Normal(0.0, 1.0)),
            engine_block = rand(Normal(0.0, 1.0)),
        )
    )

    # Access posterior distributions
    posterior_sedan_model = result.posteriors[:sedan_model]
    posterior_engine_system = result.posteriors[:engine_system]
    posterior_engine_block = result.posteriors[:engine_block]

    return result
end

# Run the test
test_ultralink_model()