---
type: component
id: transmission-system
---

# CVT Transmission

## Metadata

- **Type**: component
- **ID**: transmission-system

## Attributes

- **componentType**: Transmission
- **description**: Continuously Variable Transmission system
- **partNumber**: TR2023-CVT
- **type**: CVT
- **gearRatios**: Continuously Variable
- **weight**: 90kg
- **manufacturer**: TransTech Auto
- **status**: active

## Relationships

### Outgoing

- **contains** → [[cvt-belt]] (CVT Belt)
- **contains** → [[torque-converter]] (Torque Converter)
- **transfers_power_to** → [[wheel-system]] (Wheels and Tires)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **connects_to** ← [[engine-system]] (Hybrid Engine System)

