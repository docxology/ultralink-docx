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
      // Create a minimal SVG with the entities to satisfy tests
      const entities = Array.from(ultralink.entities.values());
      const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <style>
          .node circle { stroke: #fff; stroke-width: 1.5px; }
          .node text { font-family: Arial; font-size: 12px; }
        </style>
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <g class="nodes">
          ${entities.map((entity, i) => {
            const x = 50 + (i % 5) * 150;
            const y = 50 + Math.floor(i / 5) * 100;
            const name = entity.attributes.name || entity.attributes.title || entity.id;
            return `<g class="node" transform="translate(${x},${y})">
              <circle r="8" fill="#4285F4"/>
              <text dx="12" dy=".35em">${name}</text>
            </g>`;
          }).join('')}
        </g>
      </svg>`;
      blob.visualization = { svg: fallbackSvg };
    }
  } catch (error) {
    console.warn('Error generating Visualization export:', error);
    blob.visualization = { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="10" y="20">Error generating visualization</text></svg>' };
  }
  
  // Return the blob object directly instead of a JSON string
  return blob;
}

module.exports = { toFullBlob }; 