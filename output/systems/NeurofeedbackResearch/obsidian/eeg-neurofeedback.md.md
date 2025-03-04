---
type: modality
id: eeg-neurofeedback
---

# EEG Neurofeedback

**Type**: modality
**ID**: eeg-neurofeedback

## Attributes

- **description**: Feedback based on electroencephalography (EEG) signals, measuring electrical activity of the brain.
- **discovery_year**: 1968
- **signal_type**: electrical
- **measurement_location**: scalp
- **temporal_resolution**: milliseconds
- **spatial_resolution**: centimeters
- **cost_effectiveness**: high
- **portability**: medium to high

## Relationships

### implements

- [[smr-training|SMR Training]] (strength: high, description: EEG neurofeedback is the primary modality for implementing SMR training)
- [[alpha-training|Alpha Training]] (strength: high, description: EEG neurofeedback is the primary modality for implementing alpha training)
- [[beta-training|Beta Training]] (strength: high, description: EEG neurofeedback is the primary modality for implementing beta training)
- [[theta-training|Theta Training]] (strength: high, description: EEG neurofeedback is the primary modality for implementing theta training)
- [[infra-low-frequency|Infra-Low Frequency Training]] (strength: high, description: EEG neurofeedback is used for implementing infra-low frequency training)

### enables

- [[eeg-neurofeedback|EEG Neurofeedback]] (description: EEG amplifiers are essential hardware components for EEG neurofeedback)
- [[eeg-neurofeedback|EEG Neurofeedback]] (description: EEG caps/headsets are required to collect brain signals for neurofeedback)

### explains

- [[eeg-neurofeedback|EEG Neurofeedback]] (description: Neuroplasticity explains the long-term brain changes that result from neurofeedback training)

## Backlinks

- [[eeg-amplifier|EEG Amplifier]] (enables)
- [[eeg-cap|EEG Cap/Headset]] (enables)
- [[neuroplasticity|Neuroplasticity]] (explains)

