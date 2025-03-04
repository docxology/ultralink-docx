/**
 * UltraLink Entity Templates
 * 
 * This module defines templates for common entity types like people, places, and concepts.
 */

/**
 * Templates for entity attributes based on type
 */
const EntityTemplates = {
  person: {
    required: ['name'],
    optional: ['birthDate', 'deathDate', 'nationality', 'occupation', 'bio'],
    defaultLinks: ['birthPlace', 'residence', 'employer', 'field'],
    formatter: (attributes) => {
      let output = `# ${attributes.name}\n\n`;
      output += `## Person\n\n`;
      
      if (attributes.birthDate) {
        output += `**Born:** ${attributes.birthDate}`;
        if (attributes.birthPlace) {
          output += ` in [[${attributes.birthPlace}]]`;
        }
        output += '\n\n';
      }
      
      if (attributes.deathDate) {
        output += `**Died:** ${attributes.deathDate}\n\n`;
      }
      
      if (attributes.nationality) {
        output += `**Nationality:** ${attributes.nationality}\n\n`;
      }
      
      if (attributes.occupation) {
        output += `**Occupation:** ${attributes.occupation}\n\n`;
      }
      
      if (attributes.bio) {
        output += `## Biography\n\n${attributes.bio}\n\n`;
      }
      
      return output;
    }
  },
  
  place: {
    required: ['name'],
    optional: ['location', 'coordinates', 'population', 'country', 'description'],
    defaultLinks: ['country', 'region', 'nearbyPlaces'],
    formatter: (attributes) => {
      let output = `# ${attributes.name}\n\n`;
      output += `## Place\n\n`;
      
      if (attributes.location) {
        output += `**Location:** ${attributes.location}\n\n`;
      }
      
      if (attributes.coordinates) {
        output += `**Coordinates:** ${attributes.coordinates}\n\n`;
      }
      
      if (attributes.population) {
        output += `**Population:** ${attributes.population}\n\n`;
      }
      
      if (attributes.country) {
        output += `**Country:** [[${attributes.country}]]\n\n`;
      }
      
      if (attributes.description) {
        output += `## Description\n\n${attributes.description}\n\n`;
      }
      
      return output;
    }
  },
  
  concept: {
    required: ['name'],
    optional: ['field', 'definition', 'description', 'origin', 'date'],
    defaultLinks: ['relatedConcepts', 'field', 'originatedBy'],
    formatter: (attributes) => {
      let output = `# ${attributes.name}\n\n`;
      output += `## Concept\n\n`;
      
      if (attributes.field) {
        output += `**Field:** [[${attributes.field}]]\n\n`;
      }
      
      if (attributes.definition) {
        output += `**Definition:** ${attributes.definition}\n\n`;
      }
      
      if (attributes.origin) {
        output += `**Origin:** ${attributes.origin}`;
        if (attributes.date) {
          output += ` (${attributes.date})`;
        }
        output += '\n\n';
      }
      
      if (attributes.description) {
        output += `## Description\n\n${attributes.description}\n\n`;
      }
      
      return output;
    }
  },
  
  event: {
    required: ['name', 'date'],
    optional: ['location', 'description', 'outcome', 'duration'],
    defaultLinks: ['participants', 'location', 'precededBy', 'followedBy'],
    formatter: (attributes) => {
      let output = `# ${attributes.name}\n\n`;
      output += `## Event\n\n`;
      
      if (attributes.date) {
        output += `**Date:** ${attributes.date}\n\n`;
      }
      
      if (attributes.location) {
        output += `**Location:** [[${attributes.location}]]\n\n`;
      }
      
      if (attributes.duration) {
        output += `**Duration:** ${attributes.duration}\n\n`;
      }
      
      if (attributes.outcome) {
        output += `**Outcome:** ${attributes.outcome}\n\n`;
      }
      
      if (attributes.description) {
        output += `## Description\n\n${attributes.description}\n\n`;
      }
      
      return output;
    }
  }
};

/**
 * Factory function to create an entity based on a template
 * @param {Object} store - EntityStore instance
 * @param {string} type - Entity type
 * @param {string} id - Entity ID
 * @param {Object} attributes - Entity attributes
 * @returns {Object} - Created entity
 */
function createEntityFromTemplate(store, type, id, attributes) {
  const template = EntityTemplates[type];
  
  if (!template) {
    throw new Error(`Unknown entity type: ${type}`);
  }
  
  // Check required attributes
  const missingAttributes = template.required.filter(attr => !attributes[attr]);
  
  if (missingAttributes.length > 0) {
    throw new Error(`Missing required attributes for ${type}: ${missingAttributes.join(', ')}`);
  }
  
  // Create entity
  const entity = store.createEntity(id, type, attributes);
  
  return entity;
}

/**
 * Format an entity according to its template
 * @param {Object} entity - Entity to format
 * @returns {string} - Formatted output
 */
function formatEntity(entity) {
  const template = EntityTemplates[entity.type];
  
  if (template && template.formatter) {
    return template.formatter(entity.attributes);
  }
  
  // Default formatter
  let output = `# ${entity.id}\n\n`;
  output += `## ${entity.type}\n\n`;
  
  for (const [key, value] of Object.entries(entity.attributes)) {
    output += `**${key}:** ${value}\n\n`;
  }
  
  return output;
}

module.exports = {
  EntityTemplates,
  createEntityFromTemplate,
  formatEntity
}; 