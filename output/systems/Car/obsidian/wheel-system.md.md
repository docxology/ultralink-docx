---
type: component
id: wheel-system
---

# Wheels and Tires

## Metadata

- **Type**: component
- **ID**: wheel-system

## Attributes

- **componentType**: Wheel System
- **description**: Complete wheel system including rims and tires
- **partNumber**: WH2023-17A
- **count**: 4
- **weight**: 80kg
- **manufacturer**: RoadGrip Tire Co
- **status**: active

## Relationships

### Outgoing

- **contains** → [[rims]] (Alloy Rims)
- **contains** → [[tires]] (All-Season Tires)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **transfers_power_to** ← [[transmission-system]] (CVT Transmission)
- **acts_on** ← [[brake-system]] (Brake System)
- **supports** ← [[suspension-system]] (Suspension System)

