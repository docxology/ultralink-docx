# UltraLink API Documentation

## Overview

UltraLink is a versatile system for managing plain text relational content. It allows you to:

- Parse content with embedded links (like Obsidian's wiki-link format)
- Create and manage entities with structured attributes
- Define relationships between entities
- Export the content to various formats
- Apply templates to different entity types
- Verify the integrity of relationships

## Core Components

### UltraLink

The main class that provides a unified interface for all functionality.

```javascript
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();
```

#### Methods

- **parse(content, sourceId)** - Parse content and extract entities and links
- **addCustomParser(regex, handler)** - Add a custom parser for a specific link format
- **createEntity(type, id, attributes)** - Create an entity based on a template
- **getEntity(id)** - Get an entity by ID
- **createLink(sourceId, targetId, type, metadata)** - Create a link between two entities
- **formatEntity(entityId)** - Format an entity according to its template
- **createExporter(format)** - Create an exporter for a specific format
- **exportAll(format)** - Export all entities to a specific format
- **exportEntity(entityId, format)** - Export a single entity to a specific format

### Entity

Represents an entity in the system (e.g., a person, place, concept).

```javascript
const { Entity } = require('ultralink');
const entity = new Entity('id', 'type', attributes);
```

#### Properties

- **id** - Unique identifier
- **type** - Entity type (e.g., "person", "place", "concept")
- **attributes** - Entity attributes
- **links** - Links to other entities

#### Methods

- **addLink(target, type, metadata)** - Add a link to another entity
- **toJSON()** - Convert to JSON representation

### Link

Represents a link between two entities.

```javascript
const { Link } = require('ultralink');
const link = new Link('source', 'target', 'type', metadata);
```

#### Properties

- **source** - Source entity ID
- **target** - Target entity ID
- **type** - Relationship type
- **metadata** - Additional metadata about the relationship

#### Methods

- **toString()** - Convert to string representation (Obsidian format)
- **toJSON()** - Convert to JSON representation

### EntityStore

Collection of entities with relationship management.

```javascript
const { EntityStore } = require('ultralink');
const store = new EntityStore();
```

#### Methods

- **addEntity(entity)** - Add an entity to the store
- **getEntity(id)** - Get an entity by ID
- **createEntity(id, type, attributes)** - Create and add an entity
- **createLink(sourceId, targetId, type, metadata)** - Create a link between two entities
- **toJSON()** - Convert all entities to JSON representation

### UltraLinkParser

Parser for extracting links and entities from content.

```javascript
const { UltraLinkParser } = require('ultralink');
const parser = new UltraLinkParser(store);
```

#### Methods

- **addCustomParser(regex, handler)** - Add a custom parser for a specific link format
- **parse(content, sourceId)** - Parse content and extract entities and links

## Exporters

### Exporter

Abstract base exporter class.

```javascript
const { Exporter } = require('ultralink');
```

#### Methods

- **exportAll()** - Export the entire entity store
- **exportEntity(entityId)** - Export a single entity
- **exportRelationshipType(type)** - Export a specific relationship type

### ObsidianExporter

Exporter for Obsidian markdown format.

```javascript
const { ObsidianExporter } = require('ultralink');
const exporter = new ObsidianExporter(store);
```

#### Methods

- **exportAll()** - Export all entities to Obsidian markdown format
- **exportEntity(entityId)** - Export a single entity to Obsidian markdown format
- **exportRelationshipType(type)** - Export all entities with a specific relationship type

## Entity Templates

UltraLink provides templates for common entity types:

- **person** - People with attributes like name, birthDate, occupation
- **place** - Places with attributes like location, coordinates, population
- **concept** - Concepts with attributes like field, definition, description
- **event** - Events with attributes like date, location, outcome

```javascript
const { EntityTemplates } = require('ultralink');
console.log(EntityTemplates.person.required); // ['name']
```

### Helper Functions

- **createEntityFromTemplate(store, type, id, attributes)** - Create an entity based on a template
- **formatEntity(entity)** - Format an entity according to its template

## Example Usage

```javascript
// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create an entity
const alanTuring = ultralink.createEntity('person', 'Alan Turing', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912',
  occupation: 'Mathematician, computer scientist'
});

// Parse content with Obsidian-style links
const content = 'Check out [[Alan Turing]]\'s work on computation.';
ultralink.parse(content, 'document1');

// Export to Obsidian format
const obsidianOutput = ultralink.exportAll('obsidian');
console.log(obsidianOutput['Alan Turing']);
```

## Custom Parsers

You can add custom parsers to handle different link formats:

```javascript
// Add a parser for @mentions
ultralink.addCustomParser(/@([a-zA-Z0-9_]+)/g, (match) => ({
  target: match[1],
  type: 'mention',
  metadata: { format: 'at-mention' }
}));

// Parse content with @mentions
const content = 'Check out @AlanTuring's work on computation.';
ultralink.parse(content, 'social_post');
```

## Extending UltraLink

UltraLink is designed to be extensible:

1. **Create custom entity templates** by adding to the EntityTemplates object
2. **Add custom exporters** by extending the Exporter class
3. **Add custom parsers** with the addCustomParser method
4. **Implement integrity checks** for relationships 