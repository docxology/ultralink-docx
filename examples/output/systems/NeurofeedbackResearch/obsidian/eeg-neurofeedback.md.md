---
type: modality
id: eeg-neurofeedback
---

# EEG Neurofeedback

## Metadata

- **Type**: modality
- **ID**: eeg-neurofeedback

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

### Outgoing

- **implements** → [[smr-training]] (SMR Training)
- **implements** → [[alpha-training]] (Alpha Training)
- **implements** → [[beta-training]] (Beta Training)
- **implements** → [[theta-training]] (Theta Training)
- **implements** → [[infra-low-frequency]] (Infra-Low Frequency Training)

### Incoming

- **enables** ← [[eeg-amplifier]] (EEG Amplifier)
- **enables** ← [[eeg-cap]] (EEG Cap/Headset)
- **explains** ← [[neuroplasticity]] (Neuroplasticity)

