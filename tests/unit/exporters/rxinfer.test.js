const UltraLink = require('../../../src/ultralink');
const RxInferExporter = require('../../../src/lib/exporters/rxinfer');

describe('RxInferExporter', () => {
  // Test basic functionality
  test('should export basic entities and relationships to RxInfer.jl', () => {
    // Setup test data
    const ultralink = new UltraLink();
    
    const entity1 = ultralink.addEntity('person1', 'person', {
      name: 'Alice',
      expertise: 0.8
    });
    
    const entity2 = ultralink.addEntity('concept1', 'concept', {
      name: 'Machine Learning'
    });
    
    ultralink.addRelationship(entity1.id, entity2.id, 'studies', {
      since: '2020-01-01',
      proficiency: 0.7
    });
    
    // Export to RxInfer.jl
    const rxinfer = ultralink.toRxInfer();
    
    // Validate output
    expect(rxinfer).toBeDefined();
    expect(typeof rxinfer).toBe('string');
    
    // Check if it includes expected Julia code elements
    expect(rxinfer).toContain('using RxInfer, Distributions');
    expect(rxinfer).toContain('@model function');
    expect(rxinfer).toContain('person1 ~');
    expect(rxinfer).toContain('concept1 ~');
    
    // Check for relationship representation
    expect(rxinfer).toContain('# Relationship: person1 (studies) concept1');
    
    // Check for attribute representation
    expect(rxinfer).toContain('person1_expertise ~');
  });
  
  // Test options handling
  test('should respect export options', () => {
    const ultralink = new UltraLink();
    
    // Add entity with vector
    const entity = ultralink.addEntity('concept1', 'concept', {
      name: 'Deep Learning'
    });
    
    // Manually add vector to the entity
    entity.vector = [0.1, 0.2, 0.3];
    
    // Test with vectors excluded (default)
    const rxinferWithoutVectors = ultralink.toRxInfer({
      includeVectors: false
    });
    
    // Test with vectors included
    const rxinferWithVectors = ultralink.toRxInfer({
      includeVectors: true
    });
    
    console.log("Entity with vector:", entity);
    console.log("Vector test output:", rxinferWithVectors);
    
    expect(rxinferWithoutVectors).not.toContain('concept1_vec');
    expect(rxinferWithVectors).toContain('concept1_vec ~');
    
    // Test model name option
    const customName = ultralink.toRxInfer({
      modelName: 'custom_knowledge_model'
    });
    
    expect(customName).toContain('@model function custom_knowledge_model');
    
    // Test constraints generation
    const withConstraints = ultralink.toRxInfer({
      includeConstraints: true
    });
    
    expect(withConstraints).toContain('@constraints function');
    
    // Test test script generation
    const withTest = ultralink.toRxInfer({
      includeTestScript: true
    });
    
    expect(withTest).toContain('function test_');
    expect(withTest).toContain('result = infer(');
  });
  
  // Test custom distribution mapping
  test('should apply custom distribution mappings', () => {
    const ultralink = new UltraLink();
    
    ultralink.addEntity('person1', 'person', {
      name: 'Bob'
    });
    
    const customMapping = ultralink.toRxInfer({
      distributionMapping: {
        'person': 'MvNormal(zeros(3), I)'
      }
    });
    
    expect(customMapping).toContain('person1 ~ MvNormal(zeros(3), I)');
  });
  
  // Test error handling
  test('should handle invalid inputs gracefully', () => {
    // Setup test case with problematic data
    const ultralink = new UltraLink();
    
    // Add entity with problematic content (e.g., very long description)
    ultralink.addEntity('problem1', 'problem', {
      description: 'This is a very long description that should not become a variable' + ' '.repeat(100) + 'end of description'
    });
    
    // Should not throw error
    expect(() => {
      ultralink.toRxInfer();
    }).not.toThrow();
    
    // Output should not include the long description as a variable
    const rxinfer = ultralink.toRxInfer();
    expect(rxinfer).not.toContain('problem1_description ~');
  });
  
  // Test different attribute types
  test('should handle different attribute types correctly', () => {
    const ultralink = new UltraLink();
    
    ultralink.addEntity('entity1', 'test', {
      booleanAttr: true,
      numberAttr: 42,
      floatAttr: 3.14,
      stringAttr: 'hello',
      arrayAttr: [1, 2, 3]
    });
    
    const rxinfer = ultralink.toRxInfer();
    
    // Boolean attributes should be mapped to Bernoulli
    expect(rxinfer).toContain('entity1_booleanAttr ~ Bernoulli');
    
    // Integer attributes should be mapped to Poisson or similar
    expect(rxinfer).toMatch(/entity1_numberAttr ~ (Poisson|Normal)/);
    
    // Float attributes should be mapped to Normal or similar
    expect(rxinfer).toMatch(/entity1_floatAttr ~ (Normal|Beta)/);
    
    // Array attributes should be mapped to Dirichlet or similar
    expect(rxinfer).toMatch(/entity1_arrayAttr ~ (Dirichlet|MvNormal)/);
  });
  
  // Test complex relationships
  test('should handle complex relationship networks', () => {
    const ultralink = new UltraLink();
    
    // Create a chain of entities
    const entity1 = ultralink.addEntity('entity1', 'node', { value: 1 });
    const entity2 = ultralink.addEntity('entity2', 'node', { value: 2 });
    const entity3 = ultralink.addEntity('entity3', 'node', { value: 3 });
    
    // Create a chain of relationships
    ultralink.addRelationship(entity1.id, entity2.id, 'connects_to');
    ultralink.addRelationship(entity2.id, entity3.id, 'connects_to');
    ultralink.addRelationship(entity3.id, entity1.id, 'connects_to'); // Create a cycle
    
    // Create bidirectional relationship
    ultralink.addRelationship(entity1.id, entity3.id, 'interacts_with');
    ultralink.addRelationship(entity3.id, entity1.id, 'interacts_with');
    
    const rxinfer = ultralink.toRxInfer();
    
    // Should have all three entities
    expect(rxinfer).toContain('entity1 ~');
    expect(rxinfer).toContain('entity2 ~');
    expect(rxinfer).toContain('entity3 ~');
    
    // Should have all relationships
    expect(rxinfer).toContain('# Relationship: entity1 (connects_to) entity2');
    expect(rxinfer).toContain('# Relationship: entity2 (connects_to) entity3');
    expect(rxinfer).toContain('# Relationship: entity3 (connects_to) entity1');
    expect(rxinfer).toContain('# Relationship: entity1 (interacts_with) entity3');
    expect(rxinfer).toContain('# Relationship: entity3 (interacts_with) entity1');
    
    // Cycle shouldn't cause any issues
    expect(() => ultralink.toRxInfer()).not.toThrow();
  });
  
  // Test with comments disabled
  test('should respect the includeComments option', () => {
    const ultralink = new UltraLink();
    
    ultralink.addEntity('entity1', 'test', { value: 1 });
    
    const withComments = ultralink.toRxInfer({
      includeComments: true
    });
    
    const withoutComments = ultralink.toRxInfer({
      includeComments: false
    });
    
    expect(withComments).toContain('# Entity:');
    expect(withoutComments).not.toContain('# Entity:');
  });
  
  // Test sanitization of variable names
  test('should sanitize variable names properly', () => {
    const ultralink = new UltraLink();
    
    // Add entities with names that need sanitization
    ultralink.addEntity('entity-with-dash', 'test', { value: 1 });
    ultralink.addEntity('entity.with.dots', 'test', { value: 2 });
    ultralink.addEntity('entity with spaces', 'test', { value: 3 });
    
    const rxinfer = ultralink.toRxInfer();
    
    // Dashes should be converted to underscores
    expect(rxinfer).toContain('entity_with_dash ~');
    
    // Dots should be converted to underscores
    expect(rxinfer).toContain('entity_with_dots ~');
    
    // Spaces should be converted to underscores
    expect(rxinfer).toContain('entity_with_spaces ~');
  });
}); 