/**
 * UltraLink - Knowledge Graph Management System
 * 
 * This is the main entry point for the UltraLink library.
 * It exports the UltraLink class and related utilities.
 */

const UltraLink = require('./ultralink');
const lib = require('./lib');

module.exports = {
  UltraLink,
  ...lib
}; 