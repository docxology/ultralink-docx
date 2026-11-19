/**
 * Full Blob Exporter
 * 
 * Export UltraLink data to a single serialized blob containing all formats.
 */

const { toGridSVG } = require('./visualization');
const { getErrorMessage } = require('../utils');

/**
 * Exports UltraLink data to a comprehensive JSON blob containing all export formats
 * @param {UltraLink} ultralink - The UltraLink instance to export
 * @param {Object} options - Export options
 * @param {boolean} [options.throwOnError=false] - Reject the bundle if an embedded export throws
 * @returns {Object} - Object containing all export formats
 */
function toFullBlob(ultralink, options = {}) {
  const blob = {};
  function componentFailed(format, error) {
    if (options?.throwOnError) {
      throw new Error(`Failed to generate embedded ${format} export: ${getErrorMessage(error)}`, { cause: error });
    }
    console.warn(`Error generating ${format} export:`, error);
  }
  
  // JSON export
  try {
    blob.json = ultralink.toJSON({ asString: false });
  } catch (error) {
    componentFailed('JSON', error);
    blob.json = { entities: [], relationships: [] };
  }
  
  // CSV export
  try {
    blob.csv = ultralink.toCSV();
  } catch (error) {
    componentFailed('CSV', error);
    blob.csv = '';
  }
  
  // GraphML export
  try {
    blob.graphml = ultralink.toGraphML();
  } catch (error) {
    componentFailed('GraphML', error);
    blob.graphml = '';
  }
  
  // KIF export
  try {
    blob.kif = ultralink.toKIF();
  } catch (error) {
    componentFailed('KIF', error);
    blob.kif = '';
  }
  
  // Bayesian Network export
  try {
    const bayesianExport = ultralink.toBayesianNetwork();
    blob.bayesian = { json: typeof bayesianExport === 'string' ? bayesianExport : JSON.stringify(bayesianExport) };
  } catch (error) {
    componentFailed('Bayesian Network', error);
    blob.bayesian = { json: JSON.stringify({ nodes: [], edges: [] }) };
  }
  
  blob.visualization = { svg: toGridSVG(ultralink) };
  
  // Return the blob object directly instead of a JSON string
  return blob;
}

module.exports = { toFullBlob }; 