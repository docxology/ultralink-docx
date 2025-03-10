# ultralink_model.jl
# Generated by UltraLink on 2025-03-10T15:26:00.475Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions


@model function ultralink_model()
    # Define variables for entities
    # Entity: eeg-neurofeedback (type: modality)
    eeg_neurofeedback ~ Normal(0.0, 1.0)
    eeg_neurofeedback_discovery_year ~ Poisson(1.0)
    eeg_neurofeedback_signal_type ~ Categorical([0.5, 0.5])
    eeg_neurofeedback_measurement_location ~ Categorical([0.5, 0.5])
    eeg_neurofeedback_temporal_resolution ~ Categorical([0.5, 0.5])
    eeg_neurofeedback_spatial_resolution ~ Categorical([0.5, 0.5])
    eeg_neurofeedback_cost_effectiveness ~ Categorical([0.5, 0.5])
    eeg_neurofeedback_portability ~ Categorical([0.5, 0.5])
    # Entity: fmri-neurofeedback (type: modality)
    fmri_neurofeedback ~ Normal(0.0, 1.0)
    fmri_neurofeedback_discovery_year ~ Poisson(1.0)
    fmri_neurofeedback_signal_type ~ Categorical([0.5, 0.5])
    fmri_neurofeedback_measurement_location ~ Categorical([0.5, 0.5])
    fmri_neurofeedback_temporal_resolution ~ Categorical([0.5, 0.5])
    fmri_neurofeedback_spatial_resolution ~ Categorical([0.5, 0.5])
    fmri_neurofeedback_cost_effectiveness ~ Categorical([0.5, 0.5])
    fmri_neurofeedback_portability ~ Categorical([0.5, 0.5])
    # Entity: fnirs-neurofeedback (type: modality)
    fnirs_neurofeedback ~ Normal(0.0, 1.0)
    fnirs_neurofeedback_discovery_year ~ Poisson(1.0)
    fnirs_neurofeedback_signal_type ~ Categorical([0.5, 0.5])
    fnirs_neurofeedback_measurement_location ~ Categorical([0.5, 0.5])
    fnirs_neurofeedback_temporal_resolution ~ Categorical([0.5, 0.5])
    fnirs_neurofeedback_spatial_resolution ~ Categorical([0.5, 0.5])
    fnirs_neurofeedback_cost_effectiveness ~ Categorical([0.5, 0.5])
    fnirs_neurofeedback_portability ~ Categorical([0.5, 0.5])
    # Entity: meg-neurofeedback (type: modality)
    meg_neurofeedback ~ Normal(0.0, 1.0)
    meg_neurofeedback_discovery_year ~ Poisson(1.0)
    meg_neurofeedback_signal_type ~ Categorical([0.5, 0.5])
    meg_neurofeedback_measurement_location ~ Categorical([0.5, 0.5])
    meg_neurofeedback_temporal_resolution ~ Categorical([0.5, 0.5])
    meg_neurofeedback_spatial_resolution ~ Categorical([0.5, 0.5])
    meg_neurofeedback_cost_effectiveness ~ Categorical([0.5, 0.5])
    meg_neurofeedback_portability ~ Categorical([0.5, 0.5])
    # Entity: smr-training (type: protocol)
    smr_training ~ Normal(0.0, 1.0)
    smr_training_target_frequency ~ Categorical([0.5, 0.5])
    smr_training_typical_locations ~ Dirichlet(ones(3))
    smr_training_typical_applications ~ Dirichlet(ones(3))
    smr_training_development_year ~ Poisson(1.0)
    smr_training_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: alpha-training (type: protocol)
    alpha_training ~ Normal(0.0, 1.0)
    alpha_training_target_frequency ~ Categorical([0.5, 0.5])
    alpha_training_typical_locations ~ Dirichlet(ones(3))
    alpha_training_typical_applications ~ Dirichlet(ones(3))
    alpha_training_development_year ~ Poisson(1.0)
    alpha_training_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: theta-training (type: protocol)
    theta_training ~ Normal(0.0, 1.0)
    theta_training_target_frequency ~ Categorical([0.5, 0.5])
    theta_training_typical_locations ~ Dirichlet(ones(2))
    theta_training_typical_applications ~ Dirichlet(ones(3))
    theta_training_development_year ~ Poisson(1.0)
    theta_training_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: beta-training (type: protocol)
    beta_training ~ Normal(0.0, 1.0)
    beta_training_target_frequency ~ Categorical([0.5, 0.5])
    beta_training_typical_locations ~ Dirichlet(ones(3))
    beta_training_typical_applications ~ Dirichlet(ones(3))
    beta_training_development_year ~ Poisson(1.0)
    beta_training_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: alpha-theta-training (type: protocol)
    alpha_theta_training ~ Normal(0.0, 1.0)
    alpha_theta_training_target_frequency ~ Categorical([0.5, 0.5])
    alpha_theta_training_typical_locations ~ Dirichlet(ones(2))
    alpha_theta_training_typical_applications ~ Dirichlet(ones(3))
    alpha_theta_training_development_year ~ Poisson(1.0)
    alpha_theta_training_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: infra-low-frequency (type: protocol)
    infra_low_frequency ~ Normal(0.0, 1.0)
    infra_low_frequency_target_frequency ~ Categorical([0.5, 0.5])
    infra_low_frequency_typical_locations ~ Dirichlet(ones(3))
    infra_low_frequency_typical_applications ~ Dirichlet(ones(3))
    infra_low_frequency_development_year ~ Poisson(1.0)
    infra_low_frequency_evidence_level ~ Categorical([0.5, 0.5])
    # Entity: adhd-treatment (type: clinical_application)
    adhd_treatment ~ Categorical([0.33, 0.33, 0.34])
    adhd_treatment_target_symptoms ~ Dirichlet(ones(3))
    adhd_treatment_typical_protocols ~ Dirichlet(ones(3))
    adhd_treatment_research_volume ~ Categorical([0.5, 0.5])
    adhd_treatment_typical_session_count ~ Categorical([0.5, 0.5])
    # Entity: anxiety-treatment (type: clinical_application)
    anxiety_treatment ~ Categorical([0.33, 0.33, 0.34])
    anxiety_treatment_target_symptoms ~ Dirichlet(ones(3))
    anxiety_treatment_typical_protocols ~ Dirichlet(ones(2))
    anxiety_treatment_research_volume ~ Categorical([0.5, 0.5])
    anxiety_treatment_typical_session_count ~ Categorical([0.5, 0.5])
    # Entity: epilepsy-treatment (type: clinical_application)
    epilepsy_treatment ~ Categorical([0.33, 0.33, 0.34])
    epilepsy_treatment_target_symptoms ~ Dirichlet(ones(2))
    epilepsy_treatment_typical_protocols ~ Dirichlet(ones(2))
    epilepsy_treatment_research_volume ~ Categorical([0.5, 0.5])
    epilepsy_treatment_typical_session_count ~ Categorical([0.5, 0.5])
    # Entity: insomnia-treatment (type: clinical_application)
    insomnia_treatment ~ Categorical([0.33, 0.33, 0.34])
    insomnia_treatment_target_symptoms ~ Dirichlet(ones(3))
    insomnia_treatment_typical_protocols ~ Dirichlet(ones(2))
    insomnia_treatment_research_volume ~ Categorical([0.5, 0.5])
    insomnia_treatment_typical_session_count ~ Categorical([0.5, 0.5])
    # Entity: ptsd-treatment (type: clinical_application)
    ptsd_treatment ~ Categorical([0.33, 0.33, 0.34])
    ptsd_treatment_target_symptoms ~ Dirichlet(ones(3))
    ptsd_treatment_typical_protocols ~ Dirichlet(ones(2))
    ptsd_treatment_research_volume ~ Categorical([0.5, 0.5])
    ptsd_treatment_typical_session_count ~ Categorical([0.5, 0.5])
    # Entity: sterman-mb (type: researcher)
    sterman_mb ~ Categorical([0.33, 0.33, 0.34])
    sterman_mb_key_contributions ~ Dirichlet(ones(3))
    sterman_mb_active_years ~ Categorical([0.5, 0.5])
    sterman_mb_key_publications ~ Dirichlet(ones(2))
    # Entity: lubar-jf (type: researcher)
    lubar_jf ~ Categorical([0.33, 0.33, 0.34])
    lubar_jf_key_contributions ~ Dirichlet(ones(3))
    lubar_jf_active_years ~ Categorical([0.5, 0.5])
    lubar_jf_key_publications ~ Dirichlet(ones(2))
    # Entity: peniston-eg (type: researcher)
    peniston_eg ~ Categorical([0.33, 0.33, 0.34])
    peniston_eg_key_contributions ~ Dirichlet(ones(3))
    peniston_eg_active_years ~ Categorical([0.5, 0.5])
    peniston_eg_key_publications ~ Dirichlet(ones(2))
    # Entity: othmer-sf (type: researcher)
    othmer_sf ~ Categorical([0.33, 0.33, 0.34])
    othmer_sf_affiliation ~ Categorical([0.5, 0.5])
    othmer_sf_key_contributions ~ Dirichlet(ones(3))
    othmer_sf_active_years ~ Categorical([0.5, 0.5])
    othmer_sf_key_publications ~ Dirichlet(ones(2))
    # Entity: eeg-amplifier (type: equipment)
    eeg_amplifier ~ Categorical([0.33, 0.33, 0.34])
    eeg_amplifier_types ~ Dirichlet(ones(3))
    eeg_amplifier_key_specifications ~ Dirichlet(ones(3))
    eeg_amplifier_typical_cost_range ~ Categorical([0.5, 0.5])
    # Entity: eeg-cap (type: equipment)
    eeg_cap ~ Categorical([0.33, 0.33, 0.34])
    eeg_cap_types ~ Dirichlet(ones(3))
    eeg_cap_key_specifications ~ Dirichlet(ones(3))
    eeg_cap_typical_cost_range ~ Categorical([0.5, 0.5])
    # Entity: nf-software (type: equipment)
    nf_software ~ Categorical([0.33, 0.33, 0.34])
    nf_software_types ~ Dirichlet(ones(3))
    nf_software_key_specifications ~ Dirichlet(ones(3))
    # Entity: sterman-epilepsy-1972 (type: research_study)
    sterman_epilepsy_1972 ~ Normal(0.0, 1.0)
    sterman_epilepsy_1972_authors ~ Dirichlet(ones(2))
    sterman_epilepsy_1972_year ~ Poisson(1.0)
    sterman_epilepsy_1972_key_findings ~ Dirichlet(ones(2))
    sterman_epilepsy_1972_citation_count ~ Poisson(1.0)
    sterman_epilepsy_1972_study_type ~ Categorical([0.5, 0.5])
    # Entity: lubar-adhd-1976 (type: research_study)
    lubar_adhd_1976 ~ Normal(0.0, 1.0)
    lubar_adhd_1976_authors ~ Dirichlet(ones(2))
    lubar_adhd_1976_year ~ Poisson(1.0)
    lubar_adhd_1976_key_findings ~ Dirichlet(ones(3))
    lubar_adhd_1976_citation_count ~ Poisson(1.0)
    lubar_adhd_1976_study_type ~ Categorical([0.5, 0.5])
    # Entity: peniston-alcoholism-1989 (type: research_study)
    peniston_alcoholism_1989 ~ Normal(0.0, 1.0)
    peniston_alcoholism_1989_authors ~ Dirichlet(ones(2))
    peniston_alcoholism_1989_year ~ Poisson(1.0)
    peniston_alcoholism_1989_key_findings ~ Dirichlet(ones(3))
    peniston_alcoholism_1989_citation_count ~ Poisson(1.0)
    # Entity: arns-tdcs-2012 (type: research_study)
    arns_tdcs_2012 ~ Normal(0.0, 1.0)
    arns_tdcs_2012_authors ~ Dirichlet(ones(2))
    arns_tdcs_2012_year ~ Poisson(1.0)
    arns_tdcs_2012_key_findings ~ Dirichlet(ones(3))
    arns_tdcs_2012_citation_count ~ Poisson(1.0)
    # Entity: operant-conditioning (type: theoretical_framework)
    operant_conditioning ~ Categorical([0.33, 0.33, 0.34])
    operant_conditioning_key_concepts ~ Dirichlet(ones(3))
    operant_conditioning_originators ~ Dirichlet(ones(1))
    # Entity: neuroplasticity (type: theoretical_framework)
    neuroplasticity ~ Categorical([0.33, 0.33, 0.34])
    neuroplasticity_key_concepts ~ Dirichlet(ones(3))
    neuroplasticity_originators ~ Dirichlet(ones(2))
    # Entity: arousal-model (type: theoretical_framework)
    arousal_model ~ Categorical([0.33, 0.33, 0.34])
    arousal_model_key_concepts ~ Dirichlet(ones(3))
    arousal_model_originators ~ Dirichlet(ones(2))

    # Define relationships between variables
    # Relationship: eeg-neurofeedback (implements) smr-training-implements
    smr_training_implements ~ Normal(0.1 * eeg_neurofeedback, 1.0)
    eeg_neurofeedback_implements_smr_training_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: eeg-neurofeedback (implements) alpha-training-implements
    alpha_training_implements ~ Normal(0.1 * eeg_neurofeedback, 1.0)
    eeg_neurofeedback_implements_alpha_training_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: eeg-neurofeedback (implements) beta-training-implements
    beta_training_implements ~ Normal(0.1 * eeg_neurofeedback, 1.0)
    eeg_neurofeedback_implements_beta_training_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: eeg-neurofeedback (implements) theta-training-implements
    theta_training_implements ~ Normal(0.1 * eeg_neurofeedback, 1.0)
    eeg_neurofeedback_implements_theta_training_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: eeg-neurofeedback (implements) infra-low-frequency-implements
    infra_low_frequency_implements ~ Normal(0.1 * eeg_neurofeedback, 1.0)
    eeg_neurofeedback_implements_infra_low_frequency_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: fmri-neurofeedback (implements) alpha-training-implements
    alpha_training_implements ~ Normal(0.1 * fmri_neurofeedback, 1.0)
    fmri_neurofeedback_implements_alpha_training_implements_strength ~ Categorical([0.5, 0.5])
    # Relationship: smr-training (used_for) adhd-treatment-used_for
    adhd_treatment_used_for ~ Normal(0.1 * smr_training, 1.0)
    smr_training_used_for_adhd_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    smr_training_used_for_adhd_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: smr-training (used_for) epilepsy-treatment-used_for
    epilepsy_treatment_used_for ~ Normal(0.1 * smr_training, 1.0)
    smr_training_used_for_epilepsy_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    smr_training_used_for_epilepsy_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: beta-training (used_for) adhd-treatment-used_for
    adhd_treatment_used_for ~ Normal(0.1 * beta_training, 1.0)
    beta_training_used_for_adhd_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    beta_training_used_for_adhd_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: alpha-training (used_for) anxiety-treatment-used_for
    anxiety_treatment_used_for ~ Normal(0.1 * alpha_training, 1.0)
    alpha_training_used_for_anxiety_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    alpha_training_used_for_anxiety_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: alpha-theta-training (used_for) ptsd-treatment-used_for
    ptsd_treatment_used_for ~ Normal(0.1 * alpha_theta_training, 1.0)
    alpha_theta_training_used_for_ptsd_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    alpha_theta_training_used_for_ptsd_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: infra-low-frequency (used_for) ptsd-treatment-used_for
    ptsd_treatment_used_for ~ Normal(0.1 * infra_low_frequency, 1.0)
    infra_low_frequency_used_for_ptsd_treatment_used_for_strength ~ Categorical([0.5, 0.5])
    infra_low_frequency_used_for_ptsd_treatment_used_for_evidence_level ~ Categorical([0.5, 0.5])
    # Relationship: sterman-mb (developed) smr-training-developed
    smr_training_developed ~ Normal(0.1 * sterman_mb, 1.0)
    sterman_mb_developed_smr_training_developed_year ~ Poisson(1.0)
    # Relationship: sterman-mb (conducted) sterman-epilepsy-1972-conducted
    sterman_epilepsy_1972_conducted ~ Normal(0.1 * sterman_mb, 1.0)
    sterman_mb_conducted_sterman_epilepsy_1972_conducted_role ~ Categorical([0.5, 0.5])
    # Relationship: lubar-jf (developed) beta-training-developed
    beta_training_developed ~ Normal(0.1 * lubar_jf, 1.0)
    lubar_jf_developed_beta_training_developed_year ~ Poisson(1.0)
    # Relationship: lubar-jf (conducted) lubar-adhd-1976-conducted
    lubar_adhd_1976_conducted ~ Normal(0.1 * lubar_jf, 1.0)
    lubar_jf_conducted_lubar_adhd_1976_conducted_role ~ Categorical([0.5, 0.5])
    # Relationship: peniston-eg (developed) alpha-theta-training-developed
    alpha_theta_training_developed ~ Normal(0.1 * peniston_eg, 1.0)
    peniston_eg_developed_alpha_theta_training_developed_year ~ Poisson(1.0)
    # Relationship: peniston-eg (conducted) peniston-alcoholism-1989-conducted
    peniston_alcoholism_1989_conducted ~ Normal(0.1 * peniston_eg, 1.0)
    peniston_eg_conducted_peniston_alcoholism_1989_conducted_role ~ Categorical([0.5, 0.5])
    # Relationship: othmer-sf (developed) infra-low-frequency-developed
    infra_low_frequency_developed ~ Normal(0.1 * othmer_sf, 1.0)
    othmer_sf_developed_infra_low_frequency_developed_year ~ Poisson(1.0)
    # Relationship: eeg-amplifier (enables) eeg-neurofeedback-enables
    eeg_neurofeedback_enables ~ Normal(0.1 * eeg_amplifier, 1.0)
    # Relationship: eeg-cap (enables) eeg-neurofeedback-enables
    eeg_neurofeedback_enables ~ Normal(0.1 * eeg_cap, 1.0)
    # Relationship: nf-software (implements) smr-training-implements
    smr_training_implements ~ Normal(0.1 * nf_software, 1.0)
    # Relationship: nf-software (implements) alpha-training-implements
    alpha_training_implements ~ Normal(0.1 * nf_software, 1.0)
    # Relationship: operant-conditioning (explains) smr-training-explains
    smr_training_explains ~ Normal(0.1 * operant_conditioning, 1.0)
    # Relationship: neuroplasticity (explains) eeg-neurofeedback-explains
    eeg_neurofeedback_explains ~ Normal(0.1 * neuroplasticity, 1.0)
    # Relationship: arousal-model (explains) adhd-treatment-explains
    adhd_treatment_explains ~ Normal(0.1 * arousal_model, 1.0)

    # Return variables of interest
    return (eeg_neurofeedback, fmri_neurofeedback, fnirs_neurofeedback, meg_neurofeedback, smr_training, alpha_training, theta_training, beta_training, alpha_theta_training, infra_low_frequency, adhd_treatment, anxiety_treatment, epilepsy_treatment, insomnia_treatment, ptsd_treatment, sterman_mb, lubar_jf, peniston_eg, othmer_sf, eeg_amplifier, eeg_cap, nf_software, sterman_epilepsy_1972, lubar_adhd_1976, peniston_alcoholism_1989, arns_tdcs_2012, operant_conditioning, neuroplasticity, arousal_model)
end