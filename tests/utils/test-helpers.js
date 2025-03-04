/**
 * Test Helper Utilities
 * 
 * Common functions and fixtures for UltraLink tests
 */

const { UltraLink } = require('../../src/index');

/**
 * Create a sample UltraLink instance with predefined entities and relationships
 * @returns {UltraLink} A sample UltraLink instance
 */
function createSampleUltraLink() {
  const ultralink = new UltraLink();
  
  // Add some entities
  ultralink.createEntity('person', 'person1', { name: 'Alice', age: 30 });
  ultralink.createEntity('person', 'person2', { name: 'Bob', age: 25 });
  ultralink.createEntity('project', 'project1', { name: 'Project Alpha', status: 'active' });
  
  // Add some relationships
  ultralink.createLink('person1', 'project1', 'manages');
  ultralink.createLink('person2', 'project1', 'contributes_to');
  
  return ultralink;
}

/**
 * Create an empty UltraLink instance for tests
 * @returns {UltraLink} An empty UltraLink instance
 */
function createEmptyUltraLink() {
  return new UltraLink();
}

/**
 * Run a performance test and measure execution time
 * @param {Function} testFn - The function to test
 * @param {Number} iterations - Number of iterations to run
 * @returns {Object} Test results with average, min, max times
 */
function measurePerformance(testFn, iterations = 100) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    testFn();
    const end = process.hrtime.bigint();
    times.push(Number(end - start) / 1_000_000); // Convert to ms
  }
  
  return {
    average: times.reduce((sum, time) => sum + time, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    iterations
  };
}

/**
 * Assert that two UltraLink instances have the same content
 * @param {UltraLink} a - First UltraLink instance
 * @param {UltraLink} b - Second UltraLink instance 
 * @returns {Boolean} True if instances have the same content
 */
function assertUltraLinkEqual(a, b) {
  // Compare entity sizes
  if (a.entities.size !== b.entities.size) {
    return false;
  }
  
  // Compare relationship sizes
  if (a.relationships.size !== b.relationships.size) {
    return false;
  }
  
  // Compare all entities
  for (const [id, entity] of a.entities) {
    const otherEntity = b.entities.get(id);
    if (!otherEntity) {
      return false;
    }
    
    // Compare entity properties
    if (entity.type !== otherEntity.type) {
      return false;
    }
    
    // Compare attributes (deep equality check would be better in production)
    const aAttrs = JSON.stringify(entity.attributes);
    const bAttrs = JSON.stringify(otherEntity.attributes);
    if (aAttrs !== bAttrs) {
      return false;
    }
  }
  
  // Compare all relationships
  for (const [id, rel] of a.relationships) {
    const otherRel = b.relationships.get(id);
    if (!otherRel) {
      return false;
    }
    
    // Compare relationship properties
    if (rel.source !== otherRel.source || 
        rel.target !== otherRel.target || 
        rel.type !== otherRel.type) {
      return false;
    }
    
    // Compare attributes (deep equality check would be better in production)
    const aAttrs = JSON.stringify(rel.attributes);
    const bAttrs = JSON.stringify(otherRel.attributes);
    if (aAttrs !== bAttrs) {
      return false;
    }
  }
  
  return true;
}

module.exports = {
  createSampleUltraLink,
  createEmptyUltraLink,
  measurePerformance,
  assertUltraLinkEqual
}; 