# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T17:35:36.015Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: circulatory_system (type: system)
    circulatory_system ~ Categorical([0.33, 0.33, 0.34])
    circulatory_system_functions ~ Dirichlet(ones(3))
    # Entity: respiratory_system (type: system)
    respiratory_system ~ Categorical([0.33, 0.33, 0.34])
    respiratory_system_functions ~ Dirichlet(ones(3))
    # Entity: nervous_system (type: system)
    nervous_system ~ Categorical([0.33, 0.33, 0.34])
    nervous_system_functions ~ Dirichlet(ones(3))
    nervous_system_components ~ Dirichlet(ones(3))
    # Entity: skeletal_system (type: system)
    skeletal_system ~ Normal(0.0, 1.0)
    skeletal_system_functions ~ Dirichlet(ones(3))
    skeletal_system_boneCount ~ Poisson(1.0)
    # Entity: muscular_system (type: system)
    muscular_system ~ Categorical([0.33, 0.33, 0.34])
    muscular_system_functions ~ Dirichlet(ones(3))
    muscular_system_types ~ Dirichlet(ones(3))
    # Entity: digestive_system (type: system)
    digestive_system ~ Categorical([0.33, 0.33, 0.34])
    digestive_system_functions ~ Dirichlet(ones(3))
    # Entity: endocrine_system (type: system)
    endocrine_system ~ Categorical([0.33, 0.33, 0.34])
    endocrine_system_functions ~ Dirichlet(ones(3))
    endocrine_system_majorGlands ~ Dirichlet(ones(3))
    # Entity: immune_system (type: system)
    immune_system ~ Categorical([0.33, 0.33, 0.34])
    immune_system_functions ~ Dirichlet(ones(3))
    immune_system_components ~ Dirichlet(ones(3))
    # Entity: heart (type: organ)
    heart ~ Categorical([0.33, 0.33, 0.34])
    heart_weight ~ Categorical([0.5, 0.5])
    heart_chambers ~ Dirichlet(ones(3))
    # Entity: lungs (type: organ)
    lungs ~ Normal(0.0, 1.0)
    lungs_count ~ Poisson(1.0)
    lungs_location ~ Categorical([0.5, 0.5])
    lungs_parts ~ Dirichlet(ones(3))
    # Entity: brain (type: organ)
    brain ~ Categorical([0.33, 0.33, 0.34])
    brain_location ~ Categorical([0.5, 0.5])
    brain_lobes ~ Dirichlet(ones(3))
    # Entity: liver (type: organ)
    liver ~ Categorical([0.33, 0.33, 0.34])
    liver_lobes ~ Dirichlet(ones(3))
    liver_functions ~ Dirichlet(ones(3))
    # Entity: kidneys (type: organ)
    kidneys ~ Normal(0.0, 1.0)
    kidneys_count ~ Poisson(1.0)
    kidneys_weight ~ Categorical([0.5, 0.5])
    # Entity: stomach (type: organ)
    stomach ~ Categorical([0.33, 0.33, 0.34])
    stomach_capacity ~ Categorical([0.5, 0.5])
    stomach_regions ~ Dirichlet(ones(3))
    # Entity: intestines (type: organ)
    intestines ~ Categorical([0.33, 0.33, 0.34])
    intestines_parts ~ Dirichlet(ones(2))
    intestines_smallIntestineLength ~ Categorical([0.5, 0.5])
    intestines_largeIntestineLength ~ Categorical([0.5, 0.5])
    intestines_location ~ Categorical([0.5, 0.5])
    # Entity: pancreas (type: organ)
    pancreas ~ Categorical([0.33, 0.33, 0.34])
    pancreas_weight ~ Categorical([0.5, 0.5])
    pancreas_functions ~ Dirichlet(ones(3))
    # Entity: spleen (type: organ)
    spleen ~ Categorical([0.33, 0.33, 0.34])
    spleen_functions ~ Dirichlet(ones(3))
    # Entity: skull (type: bone)
    skull ~ Normal(0.0, 1.0)
    skull_boneCount ~ Poisson(1.0)
    skull_majorBones ~ Dirichlet(ones(3))
    skull_functions ~ Dirichlet(ones(3))
    # Entity: vertebral_column (type: bone)
    vertebral_column ~ Normal(0.0, 1.0)
    vertebral_column_vertebraeCount ~ Poisson(1.0)
    vertebral_column_regions ~ Dirichlet(ones(3))
    vertebral_column_length ~ Categorical([0.5, 0.5])
    # Entity: ribcage (type: bone)
    ribcage ~ Normal(0.0, 1.0)
    ribcage_ribPairs ~ Poisson(1.0)
    ribcage_types ~ Dirichlet(ones(3))
    ribcage_functions ~ Dirichlet(ones(2))
    # Entity: femur (type: bone)
    femur ~ Normal(0.0, 1.0)
    femur_count ~ Poisson(1.0)
    femur_location ~ Categorical([0.5, 0.5])
    femur_length ~ Categorical([0.5, 0.5])
    # Entity: heart_muscle (type: muscle)
    heart_muscle ~ Categorical([0.33, 0.33, 0.34])
    heart_muscle_type ~ Categorical([0.5, 0.5])
    heart_muscle_control ~ Categorical([0.5, 0.5])
    heart_muscle_properties ~ Dirichlet(ones(3))
    # Entity: diaphragm (type: muscle)
    diaphragm ~ Categorical([0.33, 0.33, 0.34])
    diaphragm_type ~ Categorical([0.5, 0.5])
    # Entity: biceps_brachii (type: muscle)
    biceps_brachii ~ Categorical([0.33, 0.33, 0.34])
    biceps_brachii_type ~ Categorical([0.5, 0.5])
    biceps_brachii_control ~ Categorical([0.5, 0.5])
    # Entity: quadriceps (type: muscle)
    quadriceps ~ Categorical([0.33, 0.33, 0.34])
    quadriceps_type ~ Categorical([0.5, 0.5])
    quadriceps_control ~ Categorical([0.5, 0.5])
    quadriceps_location ~ Categorical([0.5, 0.5])
    quadriceps_components ~ Dirichlet(ones(3))
    # Entity: aorta (type: blood_vessel)
    aorta ~ Categorical([0.33, 0.33, 0.34])
    aorta_type ~ Categorical([0.5, 0.5])
    aorta_diameter ~ Categorical([0.5, 0.5])
    aorta_sections ~ Dirichlet(ones(3))
    # Entity: coronary_arteries (type: blood_vessel)
    coronary_arteries ~ Categorical([0.33, 0.33, 0.34])
    coronary_arteries_type ~ Categorical([0.5, 0.5])
    coronary_arteries_majorBranches ~ Dirichlet(ones(3))
    # Entity: pulmonary_arteries (type: blood_vessel)
    pulmonary_arteries ~ Categorical([0.33, 0.33, 0.34])
    pulmonary_arteries_type ~ Categorical([0.5, 0.5])
    pulmonary_arteries_branches ~ Dirichlet(ones(2))
    # Entity: vena_cava (type: blood_vessel)
    vena_cava ~ Categorical([0.33, 0.33, 0.34])
    vena_cava_type ~ Categorical([0.5, 0.5])
    vena_cava_components ~ Dirichlet(ones(2))
    vena_cava_diameter ~ Categorical([0.5, 0.5])
    # Entity: spinal_cord (type: nerve)
    spinal_cord ~ Categorical([0.33, 0.33, 0.34])
    spinal_cord_components ~ Dirichlet(ones(3))
    # Entity: vagus_nerve (type: nerve)
    vagus_nerve ~ Categorical([0.33, 0.33, 0.34])
    vagus_nerve_type ~ Categorical([0.5, 0.5])
    vagus_nerve_number ~ Categorical([0.5, 0.5])
    # Entity: sciatic_nerve (type: nerve)
    sciatic_nerve ~ Categorical([0.33, 0.33, 0.34])
    sciatic_nerve_type ~ Categorical([0.5, 0.5])
    sciatic_nerve_origin ~ Categorical([0.5, 0.5])
    # Entity: hypothalamus (type: nerve_center)
    hypothalamus ~ Categorical([0.33, 0.33, 0.34])
    hypothalamus_weight ~ Categorical([0.5, 0.5])
    hypothalamus_functions ~ Dirichlet(ones(3))
    # Entity: neuron (type: cell)
    neuron ~ Categorical([0.33, 0.33, 0.34])
    neuron_components ~ Dirichlet(ones(3))
    neuron_types ~ Dirichlet(ones(3))
    # Entity: red_blood_cell (type: cell)
    red_blood_cell ~ Categorical([0.33, 0.33, 0.34])
    red_blood_cell_shape ~ Categorical([0.5, 0.5])
    red_blood_cell_diameter ~ Categorical([0.5, 0.5])
    red_blood_cell_lifespan ~ Categorical([0.5, 0.5])
    # Entity: cardiomyocyte (type: cell)
    cardiomyocyte ~ Categorical([0.33, 0.33, 0.34])
    cardiomyocyte_length ~ Categorical([0.5, 0.5])
    cardiomyocyte_width ~ Categorical([0.5, 0.5])
    cardiomyocyte_properties ~ Dirichlet(ones(3))
    cardiomyocyte_function ~ Categorical([0.5, 0.5])
    # Entity: epithelial_tissue (type: tissue)
    epithelial_tissue ~ Categorical([0.33, 0.33, 0.34])
    epithelial_tissue_types ~ Dirichlet(ones(3))
    epithelial_tissue_functions ~ Dirichlet(ones(3))

    # Define relationships between variables
    # Relationship: circulatory_system (interacts_with) respiratory_system-interacts_with
    respiratory_system_interacts_with ~ Normal(0.1 * circulatory_system, 1.0)
    # Relationship: circulatory_system (regulated_by) nervous_system-regulated_by
    nervous_system_regulated_by ~ Normal(0.1 * circulatory_system, 1.0)
    # Relationship: muscular_system (attaches_to) skeletal_system-attaches_to
    skeletal_system_attaches_to ~ Normal(0.1 * muscular_system, 1.0)
    # Relationship: heart (part_of) circulatory_system-part_of
    circulatory_system_part_of ~ Normal(0.1 * heart, 1.0)
    # Relationship: heart (connects_to) aorta-connects_to
    aorta_connects_to ~ Normal(0.1 * heart, 1.0)
    # Relationship: heart (connects_to) vena_cava-connects_to
    vena_cava_connects_to ~ Normal(0.1 * heart, 1.0)
    # Relationship: lungs (part_of) respiratory_system-part_of
    respiratory_system_part_of ~ Normal(0.1 * lungs, 1.0)
    # Relationship: brain (part_of) nervous_system-part_of
    nervous_system_part_of ~ Normal(0.1 * brain, 1.0)
    # Relationship: brain (connects_to) spinal_cord-connects_to
    spinal_cord_connects_to ~ Normal(0.1 * brain, 1.0)
    # Relationship: skull (part_of) skeletal_system-part_of
    skeletal_system_part_of ~ Normal(0.1 * skull, 1.0)
    # Relationship: skull (protects) brain-protects
    brain_protects ~ Normal(0.1 * skull, 1.0)
    # Relationship: liver (part_of) digestive_system-part_of
    digestive_system_part_of ~ Normal(0.1 * liver, 1.0)
    # Relationship: kidneys (interacts_with) circulatory_system-interacts_with
    circulatory_system_interacts_with ~ Normal(0.1 * kidneys, 1.0)
    # Relationship: ribcage (protects) heart-protects
    heart_protects ~ Normal(0.1 * ribcage, 1.0)
    # Relationship: ribcage (protects) lungs-protects
    lungs_protects ~ Normal(0.1 * ribcage, 1.0)
    # Relationship: vertebral_column (protects) spinal_cord-protects
    spinal_cord_protects ~ Normal(0.1 * vertebral_column, 1.0)
    # Relationship: coronary_arteries (supplies) heart-supplies
    heart_supplies ~ Normal(0.1 * coronary_arteries, 1.0)
    # Relationship: pulmonary_arteries (connects_to) lungs-connects_to
    lungs_connects_to ~ Normal(0.1 * pulmonary_arteries, 1.0)
    # Relationship: vagus_nerve (innervates) heart-innervates
    heart_innervates ~ Normal(0.1 * vagus_nerve, 1.0)
    # Relationship: vagus_nerve (innervates) stomach-innervates
    stomach_innervates ~ Normal(0.1 * vagus_nerve, 1.0)
    # Relationship: hypothalamus (regulates) endocrine_system-regulates
    endocrine_system_regulates ~ Normal(0.1 * hypothalamus, 1.0)
    # Relationship: heart_muscle (composes) heart-composes
    heart_composes ~ Normal(0.1 * heart_muscle, 1.0)
    # Relationship: diaphragm (enables) respiratory_system-enables
    respiratory_system_enables ~ Normal(0.1 * diaphragm, 1.0)
    # Relationship: biceps_brachii (moves) femur-moves
    femur_moves ~ Normal(0.1 * biceps_brachii, 1.0)
    # Relationship: neuron (composes) nervous_system-composes
    nervous_system_composes ~ Normal(0.1 * neuron, 1.0)
    # Relationship: red_blood_cell (functions_in) circulatory_system-functions_in
    circulatory_system_functions_in ~ Normal(0.1 * red_blood_cell, 1.0)
    # Relationship: cardiomyocyte (composes) heart_muscle-composes
    heart_muscle_composes ~ Normal(0.1 * cardiomyocyte, 1.0)
    # Relationship: epithelial_tissue (lines) lungs-lines
    lungs_lines ~ Normal(0.1 * epithelial_tissue, 1.0)

    # Return variables of interest
    return (circulatory_system, respiratory_system, nervous_system, skeletal_system, muscular_system, digestive_system, endocrine_system, immune_system, heart, lungs, brain, liver, kidneys, stomach, intestines, pancreas, spleen, skull, vertebral_column, ribcage, femur, heart_muscle, diaphragm, biceps_brachii, quadriceps, aorta, coronary_arteries, pulmonary_arteries, vena_cava, spinal_cord, vagus_nerve, sciatic_nerve, hypothalamus, neuron, red_blood_cell, cardiomyocyte, epithelial_tissue)
end