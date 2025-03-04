/**
 * UltraLink Integrity Checking Example
 * 
 * This example demonstrates how to use the integrity checking functionality.
 */

const { UltraLink } = require('../src');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create some valid entities
ultralink.createEntity('person', 'Alan Turing', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912',
  nationality: 'British',
  occupation: 'Mathematician'
});

ultralink.createEntity('place', 'Cambridge', {
  name: 'Cambridge',
  location: 'East of England',
  country: 'United Kingdom'
});

// Create a bidirectional relationship (valid)
ultralink.createBidirectionalLink('Alan Turing', 'Cambridge', 'associated_with');

// Create an entity with missing required attributes (invalid)
try {
  ultralink.createEntity('person', 'Invalid Person', {
    // Missing 'name' which is required for person type
    birthDate: '1900-01-01'
  });
} catch (error) {
  console.log('Error creating invalid person:', error.message);
}

// Directly use EntityStore to bypass validation (to create an invalid entity for demo)
ultralink.store.createEntity('Invalid Person', 'person', {
  birthDate: '1900-01-01'
  // Missing 'name' which is required for person type
});

// Create a link to a non-existent entity (invalid)
ultralink.createLink('Alan Turing', 'Non-existent Entity', 'knows');

// Create a unidirectional link for a relationship that should be bidirectional (invalid)
ultralink.createEntity('person', 'John von Neumann', {
  name: 'John von Neumann'
});

ultralink.createLink('Alan Turing', 'John von Neumann', 'colleague');
// Missing reverse link from John von Neumann to Alan Turing

// Run integrity checks
console.log('=== RUNNING INTEGRITY CHECKS ===');

// Check link targets
console.log('\n--- CHECKING LINK TARGETS ---');
const linkTargetsResult = ultralink.integrityChecker.checkLinkTargets();
console.log(linkTargetsResult.getReport());

// Check bidirectional relationships
console.log('\n--- CHECKING BIDIRECTIONAL RELATIONSHIPS ---');
const bidirectionalResult = ultralink.integrityChecker.checkBidirectionalRelationships(['associated_with', 'colleague']);
console.log(bidirectionalResult.getReport());

// Check entity attributes
console.log('\n--- CHECKING ENTITY ATTRIBUTES ---');
const attributesResult = ultralink.integrityChecker.checkEntityAttributes();
console.log(attributesResult.getReport());

// Run all checks at once
console.log('\n--- RUNNING ALL CHECKS ---');
const allChecksResult = ultralink.checkIntegrity({
  bidirectionalTypes: ['associated_with', 'colleague']
});
console.log(allChecksResult.getReport());

// Fix some issues
console.log('\n=== FIXING ISSUES ===');

// Fix the bidirectional relationship
ultralink.createLink('John von Neumann', 'Alan Turing', 'colleague');

// Fix the missing required attribute
const invalidPerson = ultralink.getEntity('Invalid Person');
if (invalidPerson) {
  invalidPerson.attributes.name = 'Fixed Person';
}

// Run checks again after fixes
console.log('\n--- RUNNING CHECKS AFTER FIXES ---');
const afterFixesResult = ultralink.checkIntegrity({
  bidirectionalTypes: ['associated_with', 'colleague']
});
console.log(afterFixesResult.getReport()); 