/**
 * Database Exporter
 * 
 * Exports UltraLink data to database-compatible formats.
 */

const { BaseExporter } = require('./base');

/**
 * Exporter for database formats
 */
class DatabaseExporter extends BaseExporter {
  constructor(store) {
    super(store);
  }
  
  /**
   * Generate SQL schema for entities and relationships
   * @returns {string} - SQL schema
   */
  generateSchema() {
    let sql = '';
    
    // Create entity types table
    sql += `
CREATE TABLE entity_types (
  type_id VARCHAR(50) PRIMARY KEY,
  description TEXT
);

`;
    
    // Create entities table
    sql += `
CREATE TABLE entities (
  entity_id VARCHAR(255) PRIMARY KEY,
  type_id VARCHAR(50) REFERENCES entity_types(type_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;
    
    // Create attributes table
    sql += `
CREATE TABLE attributes (
  attribute_id SERIAL PRIMARY KEY,
  entity_id VARCHAR(255) REFERENCES entities(entity_id),
  key VARCHAR(100),
  value TEXT,
  UNIQUE (entity_id, key)
);

`;
    
    // Create relationship types table
    sql += `
CREATE TABLE relationship_types (
  type_id VARCHAR(50) PRIMARY KEY,
  description TEXT,
  bidirectional BOOLEAN DEFAULT FALSE
);

`;
    
    // Create relationships table
    sql += `
CREATE TABLE relationships (
  relationship_id SERIAL PRIMARY KEY,
  source_id VARCHAR(255) REFERENCES entities(entity_id),
  target_id VARCHAR(255) REFERENCES entities(entity_id),
  type_id VARCHAR(50) REFERENCES relationship_types(type_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;
    
    // Create metadata table
    sql += `
CREATE TABLE relationship_metadata (
  metadata_id SERIAL PRIMARY KEY,
  relationship_id INTEGER REFERENCES relationships(relationship_id),
  key VARCHAR(100),
  value TEXT,
  UNIQUE (relationship_id, key)
);
`;
    
    return sql;
  }
  
  /**
   * Generate entity type INSERT statements
   * @returns {string} - SQL statements
   */
  generateEntityTypeInserts() {
    const entityTypes = new Set();
    
    for (const [_, entity] of this.store.entities) {
      entityTypes.add(entity.type);
    }
    
    let sql = '';
    for (const type of entityTypes) {
      sql += `INSERT INTO entity_types (type_id, description) VALUES ('${type}', '${type} entity type');\n`;
    }
    
    return sql;
  }
  
  /**
   * Generate relationship type INSERT statements
   * @returns {string} - SQL statements
   */
  generateRelationshipTypeInserts() {
    const relationshipTypes = new Set();
    
    for (const [_, entity] of this.store.entities) {
      for (const link of entity.links) {
        relationshipTypes.add(link.type);
      }
    }
    
    let sql = '';
    for (const type of relationshipTypes) {
      sql += `INSERT INTO relationship_types (type_id, description, bidirectional) VALUES ('${type}', '${type} relationship', FALSE);\n`;
    }
    
    return sql;
  }
  
  /**
   * Generate entity INSERT statements
   * @returns {string} - SQL statements
   */
  generateEntityInserts() {
    let sql = '';
    
    for (const [id, entity] of this.store.entities) {
      // Escape single quotes in ID
      const escapedId = id.replace(/'/g, "''");
      
      // Insert entity
      sql += `INSERT INTO entities (entity_id, type_id) VALUES ('${escapedId}', '${entity.type}');\n`;
      
      // Insert attributes
      for (const [key, value] of Object.entries(entity.attributes)) {
        // Skip null or undefined values
        if (value === null || value === undefined) continue;
        
        // Escape single quotes in value
        const escapedValue = String(value).replace(/'/g, "''");
        sql += `INSERT INTO attributes (entity_id, key, value) VALUES ('${escapedId}', '${key}', '${escapedValue}');\n`;
      }
    }
    
    return sql;
  }
  
  /**
   * Generate relationship INSERT statements
   * @returns {string} - SQL statements
   */
  generateRelationshipInserts() {
    let sql = '';
    let relationshipId = 1;
    
    for (const [id, entity] of this.store.entities) {
      // Escape single quotes in ID
      const escapedId = id.replace(/'/g, "''");
      
      for (const link of entity.links) {
        // Escape single quotes in target
        const escapedTarget = link.target.replace(/'/g, "''");
        
        // Insert relationship
        sql += `INSERT INTO relationships (relationship_id, source_id, target_id, type_id) VALUES (${relationshipId}, '${escapedId}', '${escapedTarget}', '${link.type}');\n`;
        
        // Insert metadata
        for (const [key, value] of Object.entries(link.metadata)) {
          // Skip null or undefined values
          if (value === null || value === undefined) continue;
          
          // Escape single quotes in value
          const escapedValue = String(value).replace(/'/g, "''");
          sql += `INSERT INTO relationship_metadata (relationship_id, key, value) VALUES (${relationshipId}, '${key}', '${escapedValue}');\n`;
        }
        
        relationshipId++;
      }
    }
    
    return sql;
  }
  
  /**
   * Export the entire entity store to SQL format
   * @returns {string} - SQL statements
   */
  exportAll() {
    let sql = '';
    
    // Generate schema
    sql += '-- Schema\n';
    sql += this.generateSchema();
    sql += '\n';
    
    // Generate entity type inserts
    sql += '-- Entity Types\n';
    sql += this.generateEntityTypeInserts();
    sql += '\n';
    
    // Generate relationship type inserts
    sql += '-- Relationship Types\n';
    sql += this.generateRelationshipTypeInserts();
    sql += '\n';
    
    // Generate entity inserts
    sql += '-- Entities and Attributes\n';
    sql += this.generateEntityInserts();
    sql += '\n';
    
    // Generate relationship inserts
    sql += '-- Relationships and Metadata\n';
    sql += this.generateRelationshipInserts();
    
    return sql;
  }
  
  /**
   * Export a single entity to SQL format
   * @param {string} entityId - ID of the entity to export
   * @returns {string} - SQL statements
   */
  exportEntity(entityId) {
    const entity = this.store.getEntity(entityId);
    
    if (!entity) {
      throw new Error(`Entity not found: ${entityId}`);
    }
    
    let sql = '';
    
    // Escape single quotes in ID
    const escapedId = entityId.replace(/'/g, "''");
    
    // Insert entity
    sql += `INSERT INTO entities (entity_id, type_id) VALUES ('${escapedId}', '${entity.type}');\n`;
    
    // Insert attributes
    for (const [key, value] of Object.entries(entity.attributes)) {
      // Skip null or undefined values
      if (value === null || value === undefined) continue;
      
      // Escape single quotes in value
      const escapedValue = String(value).replace(/'/g, "''");
      sql += `INSERT INTO attributes (entity_id, key, value) VALUES ('${escapedId}', '${key}', '${escapedValue}');\n`;
    }
    
    // Insert relationships
    let relationshipId = 1; // This would normally be a sequence in the database
    
    for (const link of entity.links) {
      // Escape single quotes in target
      const escapedTarget = link.target.replace(/'/g, "''");
      
      // Insert relationship
      sql += `INSERT INTO relationships (relationship_id, source_id, target_id, type_id) VALUES (${relationshipId}, '${escapedId}', '${escapedTarget}', '${link.type}');\n`;
      
      // Insert metadata
      for (const [key, value] of Object.entries(link.metadata)) {
        // Skip null or undefined values
        if (value === null || value === undefined) continue;
        
        // Escape single quotes in value
        const escapedValue = String(value).replace(/'/g, "''");
        sql += `INSERT INTO relationship_metadata (relationship_id, key, value) VALUES (${relationshipId}, '${key}', '${escapedValue}');\n`;
      }
      
      relationshipId++;
    }
    
    return sql;
  }
  
  /**
   * Export all entities with a specific relationship type
   * @param {string} type - Relationship type to export
   * @returns {string} - SQL statements
   */
  exportRelationshipType(type) {
    let sql = '';
    
    for (const [id, entity] of this.store.entities) {
      const relevantLinks = entity.links.filter(link => link.type === type);
      
      if (relevantLinks.length > 0) {
        // Escape single quotes in ID
        const escapedId = id.replace(/'/g, "''");
        
        for (const link of relevantLinks) {
          // Escape single quotes in target
          const escapedTarget = link.target.replace(/'/g, "''");
          
          // Insert relationship
          sql += `INSERT INTO relationships (source_id, target_id, type_id) VALUES ('${escapedId}', '${escapedTarget}', '${type}');\n`;
        }
      }
    }
    
    return sql;
  }
}

module.exports = {
  DatabaseExporter
}; 