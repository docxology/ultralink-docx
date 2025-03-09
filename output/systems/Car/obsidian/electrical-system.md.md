---
type: component
id: electrical-system
---

# Electrical System

## Metadata

- **Type**: component
- **ID**: electrical-system

## Attributes

- **componentType**: Electrical
- **description**: Complete electrical system including battery and wiring
- **partNumber**: ES2023-12V
- **voltage**: 12V
- **weight**: 45kg
- **manufacturer**: PowerCircuit Electronics
- **status**: active

## Relationships

### Outgoing

- **contains** → [[battery]] (Hybrid Battery System)
- **connects_to** → [[infotainment]] (Infotainment System)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **depends_on** ← [[engine-system]] (Hybrid Engine System)
- **designs** ← [[electrical-engineer]] (Elena Rodriguez)
- **depends_on** ← [[hvac-system]] (HVAC System)
- **depends_on** ← [[airbag-system]] (Airbag System)
- **depends_on** ← [[seatbelt-system]] (Seatbelt System)
- **depends_on** ← [[cooling-system]] (Engine Cooling System)

