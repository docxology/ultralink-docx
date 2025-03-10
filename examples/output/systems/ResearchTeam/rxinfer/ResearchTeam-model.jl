# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T15:25:57.398Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: alice-chen (type: person)
    alice_chen ~ Categorical([0.5, 0.5])
    alice_chen_expertise ~ Dirichlet(ones(3))
    alice_chen_joinDate ~ Categorical([0.5, 0.5])
    alice_chen_status ~ Categorical([0.5, 0.5])
    # Entity: bob-smith (type: person)
    bob_smith ~ Categorical([0.5, 0.5])
    bob_smith_title ~ Categorical([0.5, 0.5])
    bob_smith_expertise ~ Dirichlet(ones(2))
    bob_smith_joinDate ~ Categorical([0.5, 0.5])
    bob_smith_status ~ Categorical([0.5, 0.5])
    # Entity: carol-jones (type: person)
    carol_jones ~ Categorical([0.5, 0.5])
    carol_jones_title ~ Categorical([0.5, 0.5])
    carol_jones_expertise ~ Dirichlet(ones(2))
    carol_jones_joinDate ~ Categorical([0.5, 0.5])
    carol_jones_status ~ Categorical([0.5, 0.5])
    carol_jones_advisor ~ Categorical([0.5, 0.5])
    # Entity: david-patel (type: person)
    david_patel ~ Categorical([0.5, 0.5])
    david_patel_expertise ~ Dirichlet(ones(3))
    david_patel_joinDate ~ Categorical([0.5, 0.5])
    david_patel_status ~ Categorical([0.5, 0.5])
    # Entity: elena-rodriguez (type: person)
    elena_rodriguez ~ Categorical([0.5, 0.5])
    elena_rodriguez_title ~ Categorical([0.5, 0.5])
    elena_rodriguez_expertise ~ Dirichlet(ones(2))
    elena_rodriguez_joinDate ~ Categorical([0.5, 0.5])
    elena_rodriguez_status ~ Categorical([0.5, 0.5])
    # Entity: frank-zhang (type: person)
    frank_zhang ~ Categorical([0.5, 0.5])
    frank_zhang_title ~ Categorical([0.5, 0.5])
    frank_zhang_expertise ~ Dirichlet(ones(2))
    frank_zhang_joinDate ~ Categorical([0.5, 0.5])
    frank_zhang_status ~ Categorical([0.5, 0.5])
    frank_zhang_endDate ~ Categorical([0.5, 0.5])
    # Entity: grace-kim (type: person)
    grace_kim ~ Categorical([0.5, 0.5])
    grace_kim_title ~ Categorical([0.5, 0.5])
    grace_kim_expertise ~ Dirichlet(ones(2))
    grace_kim_joinDate ~ Categorical([0.5, 0.5])
    grace_kim_status ~ Categorical([0.5, 0.5])
    # Entity: computer-vision-project (type: project)
    computer_vision_project ~ Normal(0.0, 1.0)
    computer_vision_project_startDate ~ Categorical([0.5, 0.5])
    computer_vision_project_endDate ~ Categorical([0.5, 0.5])
    computer_vision_project_status ~ Categorical([0.5, 0.5])
    computer_vision_project_budget ~ Poisson(1.0)
    computer_vision_project_objectives ~ Dirichlet(ones(3))
    # Entity: nlp-project (type: project)
    nlp_project ~ Normal(0.0, 1.0)
    nlp_project_startDate ~ Categorical([0.5, 0.5])
    nlp_project_endDate ~ Categorical([0.5, 0.5])
    nlp_project_status ~ Categorical([0.5, 0.5])
    nlp_project_budget ~ Poisson(1.0)
    nlp_project_objectives ~ Dirichlet(ones(3))
    # Entity: federated-learning-project (type: project)
    federated_learning_project ~ Normal(0.0, 1.0)
    federated_learning_project_startDate ~ Categorical([0.5, 0.5])
    federated_learning_project_endDate ~ Categorical([0.5, 0.5])
    federated_learning_project_status ~ Categorical([0.5, 0.5])
    federated_learning_project_budget ~ Poisson(1.0)
    federated_learning_project_objectives ~ Dirichlet(ones(3))
    # Entity: quantum-ml-project (type: project)
    quantum_ml_project ~ Normal(0.0, 1.0)
    quantum_ml_project_startDate ~ Categorical([0.5, 0.5])
    quantum_ml_project_endDate ~ Categorical([0.5, 0.5])
    quantum_ml_project_status ~ Categorical([0.5, 0.5])
    quantum_ml_project_budget ~ Poisson(1.0)
    quantum_ml_project_objectives ~ Dirichlet(ones(3))
    # Entity: adaptive-robotics-project (type: project)
    adaptive_robotics_project ~ Normal(0.0, 1.0)
    adaptive_robotics_project_startDate ~ Categorical([0.5, 0.5])
    adaptive_robotics_project_endDate ~ Categorical([0.5, 0.5])
    adaptive_robotics_project_status ~ Categorical([0.5, 0.5])
    adaptive_robotics_project_budget ~ Poisson(1.0)
    adaptive_robotics_project_objectives ~ Dirichlet(ones(3))
    # Entity: vision-paper-2022 (type: publication)
    vision_paper_2022 ~ Normal(0.0, 1.0)
    vision_paper_2022_authors ~ Dirichlet(ones(2))
    vision_paper_2022_year ~ Poisson(1.0)
    vision_paper_2022_doi ~ Categorical([0.5, 0.5])
    vision_paper_2022_citations ~ Poisson(1.0)
    # Entity: nlp-paper-2023 (type: publication)
    nlp_paper_2023 ~ Normal(0.0, 1.0)
    nlp_paper_2023_authors ~ Dirichlet(ones(2))
    nlp_paper_2023_venue ~ Categorical([0.5, 0.5])
    nlp_paper_2023_year ~ Poisson(1.0)
    nlp_paper_2023_doi ~ Categorical([0.5, 0.5])
    nlp_paper_2023_citations ~ Poisson(1.0)
    # Entity: federated-paper-2023 (type: publication)
    federated_paper_2023 ~ Normal(0.0, 1.0)
    federated_paper_2023_authors ~ Dirichlet(ones(3))
    federated_paper_2023_year ~ Poisson(1.0)
    federated_paper_2023_doi ~ Categorical([0.5, 0.5])
    federated_paper_2023_citations ~ Poisson(1.0)
    # Entity: robotics-paper-2022 (type: publication)
    robotics_paper_2022 ~ Normal(0.0, 1.0)
    robotics_paper_2022_authors ~ Dirichlet(ones(2))
    robotics_paper_2022_year ~ Poisson(1.0)
    robotics_paper_2022_doi ~ Categorical([0.5, 0.5])
    robotics_paper_2022_citations ~ Poisson(1.0)
    # Entity: quantum-paper-2023 (type: publication)
    quantum_paper_2023 ~ Normal(0.0, 1.0)
    quantum_paper_2023_authors ~ Dirichlet(ones(2))
    quantum_paper_2023_year ~ Poisson(1.0)
    quantum_paper_2023_doi ~ Categorical([0.5, 0.5])
    quantum_paper_2023_citations ~ Poisson(1.0)
    # Entity: survey-paper-2023 (type: publication)
    survey_paper_2023 ~ Normal(0.0, 1.0)
    survey_paper_2023_authors ~ Dirichlet(ones(3))
    survey_paper_2023_year ~ Poisson(1.0)
    survey_paper_2023_doi ~ Categorical([0.5, 0.5])
    survey_paper_2023_citations ~ Poisson(1.0)
    # Entity: gpu-cluster (type: equipment)
    gpu_cluster ~ Categorical([0.33, 0.33, 0.34])
    gpu_cluster_location ~ Categorical([0.5, 0.5])
    gpu_cluster_specifications ~ Categorical([0.5, 0.5])
    gpu_cluster_status ~ Categorical([0.5, 0.5])
    gpu_cluster_purchaseDate ~ Categorical([0.5, 0.5])
    gpu_cluster_maintenanceSchedule ~ Categorical([0.5, 0.5])
    # Entity: robotics-lab (type: facility)
    robotics_lab ~ Normal(0.0, 1.0)
    robotics_lab_location ~ Categorical([0.5, 0.5])
    robotics_lab_equipment ~ Dirichlet(ones(2))
    robotics_lab_capacity ~ Poisson(1.0)
    robotics_lab_status ~ Categorical([0.5, 0.5])
    # Entity: quantum-computer (type: equipment)
    quantum_computer ~ Categorical([0.33, 0.33, 0.34])
    quantum_computer_location ~ Categorical([0.5, 0.5])
    quantum_computer_specifications ~ Categorical([0.5, 0.5])
    quantum_computer_status ~ Categorical([0.5, 0.5])
    quantum_computer_acquisitionDate ~ Categorical([0.5, 0.5])
    quantum_computer_contractRenewal ~ Categorical([0.5, 0.5])
    # Entity: hpc-cluster (type: equipment)
    hpc_cluster ~ Categorical([0.33, 0.33, 0.34])
    hpc_cluster_specifications ~ Categorical([0.5, 0.5])
    hpc_cluster_status ~ Categorical([0.5, 0.5])
    hpc_cluster_accessLevel ~ Categorical([0.5, 0.5])
    # Entity: data-collection-system (type: equipment)
    data_collection_system ~ Categorical([0.33, 0.33, 0.34])
    data_collection_system_location ~ Categorical([0.5, 0.5])
    data_collection_system_specifications ~ Categorical([0.5, 0.5])
    data_collection_system_status ~ Categorical([0.5, 0.5])
    data_collection_system_purchaseDate ~ Categorical([0.5, 0.5])
    # Entity: conference-room (type: facility)
    conference_room ~ Normal(0.0, 1.0)
    conference_room_location ~ Categorical([0.5, 0.5])
    conference_room_equipment ~ Dirichlet(ones(3))
    conference_room_capacity ~ Poisson(1.0)
    conference_room_status ~ Categorical([0.5, 0.5])
    # Entity: visualization-lab (type: facility)
    visualization_lab ~ Normal(0.0, 1.0)
    visualization_lab_location ~ Categorical([0.5, 0.5])
    visualization_lab_equipment ~ Dirichlet(ones(3))
    visualization_lab_capacity ~ Poisson(1.0)
    visualization_lab_status ~ Categorical([0.5, 0.5])
    # Entity: machine-learning-theory (type: knowledge-area)
    machine_learning_theory ~ Categorical([0.33, 0.33, 0.34])
    machine_learning_theory_topics ~ Dirichlet(ones(3))
    # Entity: computer-vision (type: knowledge-area)
    computer_vision ~ Categorical([0.33, 0.33, 0.34])
    computer_vision_topics ~ Dirichlet(ones(3))
    # Entity: nlp (type: knowledge-area)
    nlp ~ Categorical([0.33, 0.33, 0.34])
    nlp_topics ~ Dirichlet(ones(3))
    # Entity: privacy-ml (type: knowledge-area)
    privacy_ml ~ Categorical([0.33, 0.33, 0.34])
    privacy_ml_topics ~ Dirichlet(ones(3))
    # Entity: quantum-ml (type: knowledge-area)
    quantum_ml ~ Categorical([0.33, 0.33, 0.34])
    quantum_ml_topics ~ Dirichlet(ones(3))
    # Entity: robotics (type: knowledge-area)
    robotics ~ Categorical([0.33, 0.33, 0.34])
    robotics_topics ~ Dirichlet(ones(3))
    # Entity: reinforcement-learning (type: knowledge-area)
    reinforcement_learning ~ Categorical([0.33, 0.33, 0.34])
    reinforcement_learning_topics ~ Dirichlet(ones(3))
    # Entity: nsf-grant (type: funding)
    nsf_grant ~ Normal(0.0, 1.0)
    nsf_grant_amount ~ Poisson(1.0)
    nsf_grant_startDate ~ Categorical([0.5, 0.5])
    nsf_grant_endDate ~ Categorical([0.5, 0.5])
    nsf_grant_grantNumber ~ Categorical([0.5, 0.5])
    nsf_grant_type ~ Categorical([0.5, 0.5])
    # Entity: tech-partner (type: funding)
    tech_partner ~ Normal(0.0, 1.0)
    tech_partner_amount ~ Poisson(1.0)
    tech_partner_startDate ~ Categorical([0.5, 0.5])
    tech_partner_endDate ~ Categorical([0.5, 0.5])
    tech_partner_contractNumber ~ Categorical([0.5, 0.5])
    tech_partner_type ~ Categorical([0.5, 0.5])
    # Entity: university-fund (type: funding)
    university_fund ~ Normal(0.0, 1.0)
    university_fund_amount ~ Poisson(1.0)
    university_fund_startDate ~ Categorical([0.5, 0.5])
    university_fund_endDate ~ Categorical([0.5, 0.5])
    university_fund_grantNumber ~ Categorical([0.5, 0.5])
    university_fund_type ~ Categorical([0.5, 0.5])

    # Define relationships between variables
    # Relationship: alice-chen (leads) computer-vision-project-leads
    computer_vision_project_leads ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (contributes_to) nlp-project-contributes_to
    nlp_project_contributes_to ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (contributes_to) federated-learning-project-contributes_to
    federated_learning_project_contributes_to ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (mentors) carol-jones-mentors
    carol_jones_mentors ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (mentors) david-patel-mentors
    david_patel_mentors ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (authored) vision-paper-2022-authored
    vision_paper_2022_authored ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (authored) nlp-paper-2023-authored
    nlp_paper_2023_authored ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (authored) federated-paper-2023-authored
    federated_paper_2023_authored ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (authored) robotics-paper-2022-authored
    robotics_paper_2022_authored ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (authored) survey-paper-2023-authored
    survey_paper_2023_authored ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (expertise_in) computer-vision-expertise_in
    computer_vision_expertise_in ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: alice-chen (expertise_in) privacy-ml-expertise_in
    privacy_ml_expertise_in ~ Normal(0.1 * alice_chen, 1.0)
    # Relationship: bob-smith (leads) nlp-project-leads
    nlp_project_leads ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (contributes_to) federated-learning-project-contributes_to
    federated_learning_project_contributes_to ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (mentors) elena-rodriguez-mentors
    elena_rodriguez_mentors ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (authored) nlp-paper-2023-authored
    nlp_paper_2023_authored ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (authored) survey-paper-2023-authored
    survey_paper_2023_authored ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (expertise_in) nlp-expertise_in
    nlp_expertise_in ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: bob-smith (expertise_in) privacy-ml-expertise_in
    privacy_ml_expertise_in ~ Normal(0.1 * bob_smith, 1.0)
    # Relationship: carol-jones (contributes_to) computer-vision-project-contributes_to
    computer_vision_project_contributes_to ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (leads) adaptive-robotics-project-leads
    adaptive_robotics_project_leads ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (mentors) elena-rodriguez-mentors
    elena_rodriguez_mentors ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (authored) vision-paper-2022-authored
    vision_paper_2022_authored ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (authored) robotics-paper-2022-authored
    robotics_paper_2022_authored ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (uses) robotics-lab-uses
    robotics_lab_uses ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (expertise_in) machine-learning-theory-expertise_in
    machine_learning_theory_expertise_in ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (expertise_in) reinforcement-learning-expertise_in
    reinforcement_learning_expertise_in ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: carol-jones (expertise_in) robotics-expertise_in
    robotics_expertise_in ~ Normal(0.1 * carol_jones, 1.0)
    # Relationship: david-patel (leads) federated-learning-project-leads
    federated_learning_project_leads ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (contributes_to) quantum-ml-project-contributes_to
    quantum_ml_project_contributes_to ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (contributes_to) nlp-project-contributes_to
    nlp_project_contributes_to ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (mentors) elena-rodriguez-mentors
    elena_rodriguez_mentors ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (authored) federated-paper-2023-authored
    federated_paper_2023_authored ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (authored) quantum-paper-2023-authored
    quantum_paper_2023_authored ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (authored) survey-paper-2023-authored
    survey_paper_2023_authored ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (uses) hpc-cluster-uses
    hpc_cluster_uses ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (expertise_in) privacy-ml-expertise_in
    privacy_ml_expertise_in ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: david-patel (expertise_in) machine-learning-theory-expertise_in
    machine_learning_theory_expertise_in ~ Normal(0.1 * david_patel, 1.0)
    # Relationship: frank-zhang (leads) quantum-ml-project-leads
    quantum_ml_project_leads ~ Normal(0.1 * frank_zhang, 1.0)
    # Relationship: frank-zhang (authored) federated-paper-2023-authored
    federated_paper_2023_authored ~ Normal(0.1 * frank_zhang, 1.0)
    # Relationship: frank-zhang (authored) quantum-paper-2023-authored
    quantum_paper_2023_authored ~ Normal(0.1 * frank_zhang, 1.0)
    # Relationship: frank-zhang (uses) quantum-computer-uses
    quantum_computer_uses ~ Normal(0.1 * frank_zhang, 1.0)
    # Relationship: frank-zhang (expertise_in) quantum-ml-expertise_in
    quantum_ml_expertise_in ~ Normal(0.1 * frank_zhang, 1.0)
    # Relationship: elena-rodriguez (contributes_to) adaptive-robotics-project-contributes_to
    adaptive_robotics_project_contributes_to ~ Normal(0.1 * elena_rodriguez, 1.0)
    # Relationship: elena-rodriguez (contributes_to) computer-vision-project-contributes_to
    computer_vision_project_contributes_to ~ Normal(0.1 * elena_rodriguez, 1.0)
    # Relationship: elena-rodriguez (uses) visualization-lab-uses
    visualization_lab_uses ~ Normal(0.1 * elena_rodriguez, 1.0)
    # Relationship: elena-rodriguez (expertise_in) computer-vision-expertise_in
    computer_vision_expertise_in ~ Normal(0.1 * elena_rodriguez, 1.0)
    # Relationship: computer-vision-project (produced) vision-paper-2022-produced
    vision_paper_2022_produced ~ Normal(0.1 * computer_vision_project, 1.0)
    # Relationship: computer-vision-project (uses) gpu-cluster-uses
    gpu_cluster_uses ~ Normal(0.1 * computer_vision_project, 1.0)
    # Relationship: computer-vision-project (applies) computer-vision-applies
    computer_vision_applies ~ Normal(0.1 * computer_vision_project, 1.0)
    # Relationship: computer-vision-project (applies) machine-learning-theory-applies
    machine_learning_theory_applies ~ Normal(0.1 * computer_vision_project, 1.0)
    # Relationship: nlp-project (produced) nlp-paper-2023-produced
    nlp_paper_2023_produced ~ Normal(0.1 * nlp_project, 1.0)
    # Relationship: nlp-project (uses) gpu-cluster-uses
    gpu_cluster_uses ~ Normal(0.1 * nlp_project, 1.0)
    # Relationship: nlp-project (applies) nlp-applies
    nlp_applies ~ Normal(0.1 * nlp_project, 1.0)
    # Relationship: nlp-project (applies) machine-learning-theory-applies
    machine_learning_theory_applies ~ Normal(0.1 * nlp_project, 1.0)
    # Relationship: federated-learning-project (produced) federated-paper-2023-produced
    federated_paper_2023_produced ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: federated-learning-project (produced) survey-paper-2023-produced
    survey_paper_2023_produced ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: federated-learning-project (uses) gpu-cluster-uses
    gpu_cluster_uses ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: federated-learning-project (uses) hpc-cluster-uses
    hpc_cluster_uses ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: federated-learning-project (applies) privacy-ml-applies
    privacy_ml_applies ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: federated-learning-project (applies) machine-learning-theory-applies
    machine_learning_theory_applies ~ Normal(0.1 * federated_learning_project, 1.0)
    # Relationship: adaptive-robotics-project (produced) robotics-paper-2022-produced
    robotics_paper_2022_produced ~ Normal(0.1 * adaptive_robotics_project, 1.0)
    # Relationship: adaptive-robotics-project (uses) robotics-lab-uses
    robotics_lab_uses ~ Normal(0.1 * adaptive_robotics_project, 1.0)
    # Relationship: adaptive-robotics-project (uses) data-collection-system-uses
    data_collection_system_uses ~ Normal(0.1 * adaptive_robotics_project, 1.0)
    # Relationship: adaptive-robotics-project (applies) robotics-applies
    robotics_applies ~ Normal(0.1 * adaptive_robotics_project, 1.0)
    # Relationship: adaptive-robotics-project (applies) reinforcement-learning-applies
    reinforcement_learning_applies ~ Normal(0.1 * adaptive_robotics_project, 1.0)
    # Relationship: quantum-ml-project (produced) quantum-paper-2023-produced
    quantum_paper_2023_produced ~ Normal(0.1 * quantum_ml_project, 1.0)
    # Relationship: quantum-ml-project (uses) quantum-computer-uses
    quantum_computer_uses ~ Normal(0.1 * quantum_ml_project, 1.0)
    # Relationship: quantum-ml-project (uses) hpc-cluster-uses
    hpc_cluster_uses ~ Normal(0.1 * quantum_ml_project, 1.0)
    # Relationship: quantum-ml-project (applies) quantum-ml-applies
    quantum_ml_applies ~ Normal(0.1 * quantum_ml_project, 1.0)
    # Relationship: quantum-ml-project (applies) machine-learning-theory-applies
    machine_learning_theory_applies ~ Normal(0.1 * quantum_ml_project, 1.0)
    # Relationship: machine-learning-theory (foundational_for) computer-vision-foundational_for
    computer_vision_foundational_for ~ Normal(0.1 * machine_learning_theory, 1.0)
    # Relationship: machine-learning-theory (foundational_for) nlp-foundational_for
    nlp_foundational_for ~ Normal(0.1 * machine_learning_theory, 1.0)
    # Relationship: machine-learning-theory (foundational_for) privacy-ml-foundational_for
    privacy_ml_foundational_for ~ Normal(0.1 * machine_learning_theory, 1.0)
    # Relationship: machine-learning-theory (foundational_for) quantum-ml-foundational_for
    quantum_ml_foundational_for ~ Normal(0.1 * machine_learning_theory, 1.0)
    # Relationship: machine-learning-theory (foundational_for) reinforcement-learning-foundational_for
    reinforcement_learning_foundational_for ~ Normal(0.1 * machine_learning_theory, 1.0)
    # Relationship: reinforcement-learning (foundational_for) robotics-foundational_for
    robotics_foundational_for ~ Normal(0.1 * reinforcement_learning, 1.0)
    # Relationship: nsf-grant (funds) computer-vision-project-funds
    computer_vision_project_funds ~ Normal(0.1 * nsf_grant, 1.0)
    # Relationship: nsf-grant (funds) adaptive-robotics-project-funds
    adaptive_robotics_project_funds ~ Normal(0.1 * nsf_grant, 1.0)
    # Relationship: tech-partner (funds) federated-learning-project-funds
    federated_learning_project_funds ~ Normal(0.1 * tech_partner, 1.0)
    # Relationship: tech-partner (funds) nlp-project-funds
    nlp_project_funds ~ Normal(0.1 * tech_partner, 1.0)
    # Relationship: university-fund (funds) quantum-ml-project-funds
    quantum_ml_project_funds ~ Normal(0.1 * university_fund, 1.0)
    # Relationship: grace-kim (administers) computer-vision-project-administers
    computer_vision_project_administers ~ Normal(0.1 * grace_kim, 1.0)
    # Relationship: grace-kim (administers) nlp-project-administers
    nlp_project_administers ~ Normal(0.1 * grace_kim, 1.0)
    # Relationship: grace-kim (administers) federated-learning-project-administers
    federated_learning_project_administers ~ Normal(0.1 * grace_kim, 1.0)
    # Relationship: grace-kim (administers) quantum-ml-project-administers
    quantum_ml_project_administers ~ Normal(0.1 * grace_kim, 1.0)
    # Relationship: grace-kim (administers) adaptive-robotics-project-administers
    adaptive_robotics_project_administers ~ Normal(0.1 * grace_kim, 1.0)
    # Relationship: survey-paper-2023 (cites) federated-paper-2023-cites
    federated_paper_2023_cites ~ Normal(0.1 * survey_paper_2023, 1.0)
    # Relationship: survey-paper-2023 (cites) vision-paper-2022-cites
    vision_paper_2022_cites ~ Normal(0.1 * survey_paper_2023, 1.0)
    # Relationship: survey-paper-2023 (cites) nlp-paper-2023-cites
    nlp_paper_2023_cites ~ Normal(0.1 * survey_paper_2023, 1.0)
    # Relationship: robotics-paper-2022 (cites) vision-paper-2022-cites
    vision_paper_2022_cites ~ Normal(0.1 * robotics_paper_2022, 1.0)
    # Relationship: quantum-paper-2023 (cites) survey-paper-2023-cites
    survey_paper_2023_cites ~ Normal(0.1 * quantum_paper_2023, 1.0)

    # Return variables of interest
    return (alice_chen, bob_smith, carol_jones, david_patel, elena_rodriguez, frank_zhang, grace_kim, computer_vision_project, nlp_project, federated_learning_project, quantum_ml_project, adaptive_robotics_project, vision_paper_2022, nlp_paper_2023, federated_paper_2023, robotics_paper_2022, quantum_paper_2023, survey_paper_2023, gpu_cluster, robotics_lab, quantum_computer, hpc_cluster, data_collection_system, conference_room, visualization_lab, machine_learning_theory, computer_vision, nlp, privacy_ml, quantum_ml, robotics, reinforcement_learning, nsf_grant, tech_partner, university_fund)
end