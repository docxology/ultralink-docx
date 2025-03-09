---
type: component
id: cooling-system
---

# Engine Cooling System

## Metadata

- **Type**: component
- **ID**: cooling-system

## Attributes

- **componentType**: Cooling
- **description**: Liquid cooling system with electric pump
- **partNumber**: CS2023-LC
- **weight**: 25kg
- **manufacturer**: ThermalTech Systems
- **status**: active

## Relationships

### Outgoing

- **contains** → [[radiator]] (Radiator)
- **contains** → [[water-pump]] (Water Pump)
- **cools** → [[engine-system]] (Hybrid Engine System)
- **depends_on** → [[electrical-system]] (Electrical System)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **interacts_with** ← [[hvac-system]] (HVAC System)

