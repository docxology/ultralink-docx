---
type: component
id: exhaust-system
---

# Exhaust System

## Metadata

- **Type**: component
- **ID**: exhaust-system

## Attributes

- **componentType**: Exhaust
- **description**: Complete exhaust system with catalytic converter
- **partNumber**: EX2023-CAT
- **weight**: 45kg
- **manufacturer**: ExhaustTech
- **status**: active

## Relationships

### Outgoing

- **contains** → [[catalytic-converter]] (Catalytic Converter)
- **contains** → [[muffler]] (Muffler)
- **connects_to** → [[engine-system]] (Hybrid Engine System)
- **documented_by** → [[exhaust-specifications]] (Exhaust System Specifications)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **outputs_to** ← [[engine-system]] (Hybrid Engine System)

