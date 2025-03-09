---
type: component
id: interior-system
---

# Interior System

## Metadata

- **Type**: component
- **ID**: interior-system

## Attributes

- **componentType**: Interior
- **description**: Complete interior setup including dash, seats, and trim
- **partNumber**: INT2023-STD
- **capacity**: 5 passengers
- **weight**: 180kg
- **manufacturer**: ComfortDesign Interiors
- **status**: active

## Relationships

### Outgoing

- **contains** → [[dashboard]] (Dashboard Assembly)
- **contains** → [[seats]] (Seating System)
- **contains** → [[infotainment]] (Infotainment System)

### Incoming

- **contains** ← [[sedan-model]] (Sedan XR5)
- **designs** ← [[interior-designer]] (James Wilson)

