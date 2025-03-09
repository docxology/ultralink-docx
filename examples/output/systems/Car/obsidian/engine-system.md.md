---
type: component
id: engine-system
---

# Hybrid Engine System

## Metadata

- **Type**: component
- **ID**: engine-system

## Attributes

- **componentType**: Engine
- **description**: 2.0L hybrid engine with electric motor assistance
- **partNumber**: ENG2023-H20
- **weight**: 180kg
- **dimensions**: [object Object]
- **manufacturer**: PowerTech Industries
- **status**: active

## Relationships

### Outgoing

- **contains** → [[engine-block]] (Engine Block)
- **contains** → [[pistons]] (Piston Assembly)
- **contains** → [[fuel-injection]] (Fuel Injection System)
- **contains** → [[electric-motor]] (Electric Assist Motor)
- **depends_on** → [[electrical-system]] (Electrical System)
- **connects_to** → [[transmission-system]] (CVT Transmission)
- **documented_by** → [[engine-specifications]] (Engine Technical Specifications)
- **contains** → [[camshaft]] (Camshaft Assembly)
- **contains** → [[valves]] (Valve System)
- **contains** → [[crankshaft]] (Crankshaft)
- **outputs_to** → [[exhaust-system]] (Exhaust System)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **designs** ← [[engine-engineer]] (Michael Chen)
- **cools** ← [[cooling-system]] (Engine Cooling System)
- **connects_to** ← [[exhaust-system]] (Exhaust System)

