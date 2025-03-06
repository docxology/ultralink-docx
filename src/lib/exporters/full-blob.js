/**
 * Full Blob Exporter
 * 
 * Export UltraLink data to a single serialized blob containing all formats.
 */

/**
 * Exports UltraLink data to a comprehensive JSON blob containing all export formats
 * @param {UltraLink} ultralink - The UltraLink instance to export
 * @param {Object} options - Export options
 * @returns {Object} - Object containing all export formats
 */
function toFullBlob(ultralink, options = {}) {
  const blob = {};
  
  // JSON export
  try {
    blob.json = ultralink.toJSON({ asString: false });
  } catch (error) {
    console.warn('Error generating JSON export:', error);
    blob.json = { entities: [], relationships: [] };
  }
  
  // CSV export
  try {
    blob.csv = ultralink.toCSV();
  } catch (error) {
    console.warn('Error generating CSV export:', error);
    blob.csv = '';
  }
  
  // GraphML export
  try {
    blob.graphml = ultralink.toGraphML();
  } catch (error) {
    console.warn('Error generating GraphML export:', error);
    blob.graphml = '';
  }
  
  // KIF export
  try {
    blob.kif = ultralink.toKIF();
  } catch (error) {
    console.warn('Error generating KIF export:', error);
    blob.kif = '';
  }
  
  // Bayesian Network export
  try {
    const bayesianExport = ultralink.toBayesianNetwork();
    blob.bayesian = { json: typeof bayesianExport === 'string' ? bayesianExport : JSON.stringify(bayesianExport) };
  } catch (error) {
    console.warn('Error generating Bayesian Network export:', error);
    blob.bayesian = { json: JSON.stringify({ nodes: [], edges: [] }) };
  }
  
  // Visualization export (SVG)
  try {
    const vizExport = ultralink.toVisualization({ format: 'svg' });
    if (typeof vizExport === 'object' && vizExport['graph.svg']) {
      blob.visualization = { svg: vizExport['graph.svg'] };
    } else {
      blob.visualization = { svg: typeof vizExport === 'string' ? vizExport : JSON.stringify(vizExport) };
    }
  } catch (error) {
    console.warn('Error generating Visualization export:', error);
    blob.visualization = { svg: '<svg width="100" height="100"></svg>' };
  }
  
  // Return the blob object directly instead of a JSON string
  return blob;
}

module.exports = { toFullBlob }; 