---
type: component
id: hvac-system
---

# HVAC System

## Metadata

- **Type**: component
- **ID**: hvac-system

## Attributes

- **componentType**: HVAC
- **description**: Dual-zone climate control system
- **partNumber**: HVAC2023-DZ
- **weight**: 35kg
- **manufacturer**: ClimateControl Corp
- **status**: active

## Relationships

### Outgoing

- **contains** → [[ac-compressor]] (AC Compressor)
- **contains** → [[heater-core]] (Heater Core)
- **depends_on** → [[electrical-system]] (Electrical System)
- **documented_by** → [[hvac-specifications]] (HVAC Technical Specifications)
- **interacts_with** → [[cooling-system]] (Engine Cooling System)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **designs** ← [[hvac-engineer]] (Lisa Thompson)

