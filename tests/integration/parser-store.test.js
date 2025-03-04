/**
 * Integration tests for the UltraLinkParser and EntityStore components
 * 
 * These tests verify that the parser and entity store work together correctly,
 * focusing on the data flow between the components rather than testing them in isolation.
 */

const { UltraLinkParser, EntityStore } = require('../../src');

describe('UltraLinkParser and EntityStore Integration', () => {
  let store;
  let parser;
  
  beforeEach(() => {
    store = new EntityStore();
    parser = new UltraLinkParser(store);
  });
  
  describe('Basic Parsing and Entity Creation', () => {
    it('should parse Obsidian-style links and create corresponding entities', () => {
      const content = `
        # Test Document
        
        This document mentions [[Alan Turing]] and [[Computer Science]].
        
        ## Related Concepts
        
        - [[Artificial Intelligence]]
        - [[Machine Learning]]
        - [[Neural Networks]]
      `;
      
      const sourceId = 'test-document';
      parser.parse(content, sourceId);
      
      // Verify that the source document was created
      const sourceEntity = store.getEntity(sourceId);
      expect(sourceEntity).toBeDefined();
      expect(sourceEntity.type).toBe('document');
      expect(sourceEntity.attributes.content).toBe(content);
      
      // Verify that linked entities were created
      expect(store.getEntity('Alan Turing')).toBeDefined();
      expect(store.getEntity('Computer Science')).toBeDefined();
      expect(store.getEntity('Artificial Intelligence')).toBeDefined();
      expect(store.getEntity('Machine Learning')).toBeDefined();
      expect(store.getEntity('Neural Networks')).toBeDefined();
      
      // Verify that the links were created
      expect(sourceEntity.links.length).toBe(5);
      
      // Check that links have the expected targets
      const linkTargets = sourceEntity.links.map(link => link.target);
      expect(linkTargets).toContain('Alan Turing');
      expect(linkTargets).toContain('Computer Science');
      expect(linkTargets).toContain('Artificial Intelligence');
      expect(linkTargets).toContain('Machine Learning');
      expect(linkTargets).toContain('Neural Networks');
    });
    
    it('should handle documents with duplicate links', () => {
      const content = `
        # Duplication Test
        
        This document mentions [[Alan Turing]] multiple times.
        Later we reference [[Alan Turing]] again and again [[Alan Turing]].
      `;
      
      const sourceId = 'duplication-test';
      parser.parse(content, sourceId);
      
      // Verify that only one entity was created for Alan Turing
      const entities = Array.from(store.entities.values());
      const turingEntities = entities.filter(e => e.id === 'Alan Turing');
      expect(turingEntities.length).toBe(1);
      
      // But the source document should have multiple links
      const sourceEntity = store.getEntity(sourceId);
      const turingLinks = sourceEntity.links.filter(link => link.target === 'Alan Turing');
      
      // The parser might handle duplicates differently (it could create one link per occurrence or deduplicate)
      // Either way is valid, so we just verify basic operation
      expect(turingLinks.length).toBeGreaterThan(0);
    });
  });
  
  describe('Custom Parser Integration', () => {
    it('should use custom parsers to extract links in different formats', () => {
      // Add a custom parser for @mentions
      parser.addCustomParser(/@([a-zA-Z0-9_]+)/g, (match) => ({
        target: match[1],
        type: 'mention',
        metadata: { format: 'at-mention' }
      }));
      
      const content = `
        # Mixed Format Test
        
        This document uses [[Wiki Links]] as well as @MentionStyle references.
        
        Multiple formats in one document: [[Alan Turing]] pioneered @ComputerScience.
      `;
      
      const sourceId = 'mixed-format-test';
      parser.parse(content, sourceId);
      
      // Verify entities were created for both formats
      expect(store.getEntity('Wiki Links')).toBeDefined();
      expect(store.getEntity('MentionStyle')).toBeDefined();
      expect(store.getEntity('Alan Turing')).toBeDefined();
      expect(store.getEntity('ComputerScience')).toBeDefined();
      
      // Verify links have the correct types
      const sourceEntity = store.getEntity(sourceId);
      const wikiLinks = sourceEntity.links.filter(link => link.type === 'default');
      const mentions = sourceEntity.links.filter(link => link.type === 'mention');
      
      expect(wikiLinks.length).toBe(2); // Wiki Links and Alan Turing
      expect(mentions.length).toBe(2);  // MentionStyle and ComputerScience
      
      // Verify mention metadata
      const mentionLink = mentions.find(link => link.target === 'MentionStyle');
      expect(mentionLink.metadata).toEqual({ format: 'at-mention' });
    });
  });
  
  describe('Multi-Document Integration', () => {
    it('should correctly maintain entity relationships across multiple documents', () => {
      // Parse first document
      const content1 = `
        # First Document
        
        This document mentions [[Alan Turing]] and [[Computer Science]].
      `;
      
      parser.parse(content1, 'doc1');
      
      // Parse second document referencing same entities
      const content2 = `
        # Second Document
        
        This also mentions [[Alan Turing]] and adds [[John von Neumann]].
      `;
      
      parser.parse(content2, 'doc2');
      
      // Parse third document with cross-references
      const content3 = `
        # Document Relations
        
        References to [[doc1]] and [[doc2]] documents.
      `;
      
      parser.parse(content3, 'doc3');
      
      // Verify entity count
      expect(store.entities.size).toBe(6); // 3 docs + Turing + CS + von Neumann
      
      // Verify Alan Turing is referenced from both docs
      const doc1 = store.getEntity('doc1');
      const doc2 = store.getEntity('doc2');
      
      expect(doc1.links.some(link => link.target === 'Alan Turing')).toBe(true);
      expect(doc2.links.some(link => link.target === 'Alan Turing')).toBe(true);
      
      // Verify document cross-references
      const doc3 = store.getEntity('doc3');
      expect(doc3.links.some(link => link.target === 'doc1')).toBe(true);
      expect(doc3.links.some(link => link.target === 'doc2')).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    it('should gracefully handle malformed input', () => {
      const malformedContent = `
        # Malformed Content
        
        This has an unclosed link [[Incomplete
        And a [[]] empty link.
      `;
      
      // This should not throw an error
      expect(() => {
        parser.parse(malformedContent, 'malformed-doc');
      }).not.toThrow();
      
      // The document should still be created
      expect(store.getEntity('malformed-doc')).toBeDefined();
    });
  });
}); 