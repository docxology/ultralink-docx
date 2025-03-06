/**
 * UltraLink - Knowledge Graph Management System
 * 
 * This is the main entry point for the UltraLink library.
 * It exports the UltraLink class and related utilities.
 */

const UltraLink = require('./ultralink');
const lib = require('./lib');
const { UltraLinkParser } = require('./core/parser');
const { EntityStore } = require('./core/types');

module.exports = {
  UltraLink,
  UltraLinkParser,
  EntityStore,
  ...lib
}; 