/**
 * UltraLink Database Export Example
 * 
 * This example demonstrates how to use the database exporter to generate SQL.
 */

const { UltraLink } = require('../src');
const fs = require('fs');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create some entities
ultralink.createEntity('person', 'Alan Turing', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912',
  nationality: 'British',
  occupation: 'Mathematician'
});

ultralink.createEntity('person', 'John von Neumann', {
  name: 'John von Neumann',
  birthDate: 'December 28, 1903',
  nationality: 'Hungarian-American',
  occupation: 'Mathematician'
});

ultralink.createEntity('concept', 'Computing Machine', {
  name: 'Computing Machine',
  field: 'Computer Science',
  definition: 'A device that manipulates data according to a set of instructions.'
});

ultralink.createEntity('place', 'Princeton', {
  name: 'Princeton',
  location: 'New Jersey, USA',
  country: 'United States'
});

// Add links between entities
ultralink.createLink('Alan Turing', 'Computing Machine', 'pioneered');
ultralink.createLink('John von Neumann', 'Computing Machine', 'developed', { aspect: 'architecture' });
ultralink.createLink('John von Neumann', 'Princeton', 'worked_at', { years: '1930-1957' });

// Export all entities to SQL format
const sqlOutput = ultralink.exportAll('database');

// Write SQL to file
fs.writeFileSync('ultralink-export.sql', sqlOutput);

console.log('=== DATABASE SQL EXPORT ===');
console.log('SQL export has been written to ultralink-export.sql');

// Extract just the relationships of a specific type
console.log('\n=== PIONEERED RELATIONSHIPS (SQL) ===');
const pioneeredSQL = ultralink.createExporter('database').exportRelationshipType('pioneered');
console.log(pioneeredSQL);

// Export a single entity
console.log('\n=== ALAN TURING (SQL) ===');
const turingSQL = ultralink.exportEntity('Alan Turing', 'database');
console.log(turingSQL.substring(0, 500) + '...'); // Show just the beginning for brevity 