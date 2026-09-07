/**
 * Research Team Output Validator
 *
 * Thin re-export shim: the validator implementation lives in
 * src/research-team/output-validator.js so that both tests and scripts consume
 * the same module (orchestration-scripts boundary).
 */
module.exports = require('../../src/research-team/output-validator');
