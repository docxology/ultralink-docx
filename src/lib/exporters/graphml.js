/**
 * GraphML Exporter
 * 
 * Export UltraLink data to GraphML format for use with graph visualization tools.
 */

/**
 * Converts knowledge base to GraphML format
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @returns {string} GraphML XML string
 */
function toGraphML(ultralink, options = {}) {
  // Start GraphML document
  let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <graph id="G" edgedefault="directed">
`;

  // Collect all unique attribute keys from entities
  const attributeKeys = new Set();
  for (const entity of ultralink.entities.values()) {
    for (const key of Object.keys(entity.attributes || {})) {
      if (key !== 'type' && key !== 'name') {
        attributeKeys.add(key);
      }
    }
  }

  // Define node attribute keys
  graphml += `    <!-- Node attribute keys -->
    <key id="type" for="node" attr.name="type" attr.type="string"/>
    <key id="name" for="node" attr.name="name" attr.type="string"/>
`;

  // Add other attribute keys
  for (const key of attributeKeys) {
    graphml += `    <key id="${key}" for="node" attr.name="${key}" attr.type="string"/>
`;
  }

  // Define edge attribute keys
  graphml += `    <!-- Edge attribute keys -->
    <key id="relationship_type" for="edge" attr.name="type" attr.type="string"/>
`;

  // Add nodes (entities)
  for (const entity of ultralink.entities.values()) {
    graphml += `    <node id="${entity.id}">
      <data key="type">${entity.type}</data>
`;

    // Add name if available
    if (entity.attributes && entity.attributes.name) {
      graphml += `      <data key="name">${entity.attributes.name}</data>
`;
    }

    // Add other attributes
    for (const [key, value] of Object.entries(entity.attributes || {})) {
      if (key !== 'type' && key !== 'name' && value !== undefined) {
        graphml += `      <data key="${key}">${escapeXml(String(value))}</data>
`;
      }
    }

    graphml += `    </node>
`;
  }

  // Add edges (relationships)
  for (const relationship of ultralink.relationships.values()) {
    graphml += `    <edge source="${relationship.source}" target="${relationship.target}">
      <data key="relationship_type">${relationship.type}</data>
    </edge>
`;
  }

  // Close GraphML document
  graphml += `  </graph>
</graphml>`;

  return graphml;
}

/**
 * Helper function to escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = { toGraphML }; 