/**
 * UltraLink Integrity Checker
 * 
 * This module provides functionality to verify the integrity of the entity store.
 */

/**
 * Result of an integrity check
 */
class IntegrityCheckResult {
  constructor() {
    this.valid = true;
    this.errors = [];
    this.warnings = [];
  }
  
  /**
   * Add an error to the result
   * @param {string} message - Error message
   * @param {Object} data - Additional data about the error
   */
  addError(message, data = {}) {
    this.valid = false;
    this.errors.push({ message, data });
  }
  
  /**
   * Add a warning to the result
   * @param {string} message - Warning message
   * @param {Object} data - Additional data about the warning
   */
  addWarning(message, data = {}) {
    this.warnings.push({ message, data });
  }
  
  /**
   * Get a human-readable report of the check result
   * @returns {string} - Report
   */
  getReport() {
    let report = '';
    
    report += `Integrity Check Result: ${this.valid ? 'PASSED' : 'FAILED'}\n`;
    report += `${this.errors.length} errors, ${this.warnings.length} warnings\n\n`;
    
    if (this.errors.length > 0) {
      report += 'ERRORS:\n';
      this.errors.forEach((error, index) => {
        report += `${index + 1}. ${error.message}\n`;
        if (Object.keys(error.data).length > 0) {
          report += `   Details: ${JSON.stringify(error.data)}\n`;
        }
      });
      report += '\n';
    }
    
    if (this.warnings.length > 0) {
      report += 'WARNINGS:\n';
      this.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning.message}\n`;
        if (Object.keys(warning.data).length > 0) {
          report += `   Details: ${JSON.stringify(warning.data)}\n`;
        }
      });
    }
    
    return report;
  }
}

/**
 * Main integrity checker class
 */
class IntegrityChecker {
  constructor(store) {
    this.store = store;
  }
  
  /**
   * Check that all link targets exist
   * @returns {IntegrityCheckResult} - Check result
   */
  checkLinkTargets() {
    const result = new IntegrityCheckResult();
    
    for (const [id, entity] of this.store.entities) {
      for (const link of entity.links) {
        if (!this.store.getEntity(link.target)) {
          result.addError('Link target does not exist', {
            source: id,
            target: link.target,
            type: link.type
          });
        }
      }
    }
    
    return result;
  }
  
  /**
   * Check that bidirectional relationships are properly maintained
   * @param {Array} bidirectionalTypes - Types of relationships that should be bidirectional
   * @returns {IntegrityCheckResult} - Check result
   */
  checkBidirectionalRelationships(bidirectionalTypes = []) {
    const result = new IntegrityCheckResult();
    
    for (const [id, entity] of this.store.entities) {
      for (const link of entity.links) {
        // Skip if not a bidirectional type
        if (!bidirectionalTypes.includes(link.type)) continue;
        
        const target = this.store.getEntity(link.target);
        
        if (!target) {
          // This should be caught by checkLinkTargets
          continue;
        }
        
        // Check if the target has a link back to the source
        const hasReverseLink = target.links.some(
          targetLink => targetLink.target === id && targetLink.type === link.type
        );
        
        if (!hasReverseLink) {
          result.addError('Bidirectional relationship is missing reverse link', {
            source: id,
            target: link.target,
            type: link.type
          });
        }
      }
    }
    
    return result;
  }
  
  /**
   * Check that entity attributes conform to their templates
   * @returns {IntegrityCheckResult} - Check result
   */
  checkEntityAttributes() {
    const result = new IntegrityCheckResult();
    const { EntityTemplates } = require('../types/entity-templates');
    
    for (const [id, entity] of this.store.entities) {
      const template = EntityTemplates[entity.type];
      
      // Skip if no template for this entity type
      if (!template) continue;
      
      // Check required attributes
      const missingAttributes = template.required.filter(attr => !entity.attributes[attr]);
      
      if (missingAttributes.length > 0) {
        result.addError('Entity is missing required attributes', {
          entity: id,
          type: entity.type,
          missingAttributes
        });
      }
      
      // Check for unknown attributes
      const allKnownAttributes = [...template.required, ...(template.optional || [])];
      const unknownAttributes = Object.keys(entity.attributes).filter(
        attr => !allKnownAttributes.includes(attr)
      );
      
      if (unknownAttributes.length > 0) {
        result.addWarning('Entity has unknown attributes', {
          entity: id,
          type: entity.type,
          unknownAttributes
        });
      }
    }
    
    return result;
  }
  
  /**
   * Run all integrity checks
   * @param {Object} options - Check options
   * @returns {IntegrityCheckResult} - Combined check result
   */
  checkAll(options = {}) {
    const result = new IntegrityCheckResult();
    
    // Define default options
    const defaultOptions = {
      bidirectionalTypes: []
    };
    
    const checkOptions = { ...defaultOptions, ...options };
    
    // Run all checks
    const linkTargetsResult = this.checkLinkTargets();
    const bidirectionalResult = this.checkBidirectionalRelationships(checkOptions.bidirectionalTypes);
    const attributesResult = this.checkEntityAttributes();
    
    // Combine results
    result.valid = linkTargetsResult.valid && bidirectionalResult.valid && attributesResult.valid;
    result.errors = [
      ...linkTargetsResult.errors,
      ...bidirectionalResult.errors,
      ...attributesResult.errors
    ];
    result.warnings = [
      ...linkTargetsResult.warnings,
      ...bidirectionalResult.warnings,
      ...attributesResult.warnings
    ];
    
    return result;
  }
}

module.exports = {
  IntegrityCheckResult,
  IntegrityChecker
}; 