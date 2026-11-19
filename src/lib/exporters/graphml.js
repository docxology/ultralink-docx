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
  // Key IDs must be unique across both nodes and edges.
  const usedIds = new Set(['type', 'relationship_type']);
  const nodeKeys = collectAttributeKeys(ultralink.entities.values(), usedIds);
  const edgeKeys = collectAttributeKeys(ultralink.relationships.values(), usedIds);

  let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="type" for="node" attr.name="type" attr.type="string"/>
`;
  graphml += declareKeys(nodeKeys, 'node');
  graphml += '  <key id="relationship_type" for="edge" attr.name="type" attr.type="string"/>\n';
  graphml += declareKeys(edgeKeys, 'edge');
  graphml += '  <graph id="G" edgedefault="directed">\n';

  for (const entity of ultralink.entities.values()) {
    graphml += `    <node id="${escapeXml(entity.id)}">
      <data key="type">${escapeXml(entity.type)}</data>
${attributeData(entity.attributes, nodeKeys)}    </node>
`;
  }

  for (const relationship of ultralink.relationships.values()) {
    graphml += `    <edge source="${escapeXml(relationship.source)}" target="${escapeXml(relationship.target)}">
      <data key="relationship_type">${escapeXml(relationship.type)}</data>
${attributeData(relationship.attributes, edgeKeys)}    </edge>
`;
  }

  return graphml + '  </graph>\n</graphml>';
}

function collectAttributeKeys(records, usedIds) {
  const keys = new Map();

  for (const { attributes } of records) {
    for (const name of Object.keys(attributes || {})) {
      if (name === 'type' || keys.has(name)) continue;

      // Retain usable attribute names as IDs when they do not collide.
      let id = name;
      if (!/^[A-Za-z_][\w.-]*$/.test(id) || usedIds.has(id)) {
        let next = usedIds.size;
        do {
          id = `d${next++}`;
        } while (usedIds.has(id));
      }
      keys.set(name, id);
      usedIds.add(id);
    }
  }

  return keys;
}

function declareKeys(keys, scope) {
  let xml = '';
  for (const [name, id] of keys) {
    xml += `  <key id="${id}" for="${scope}" attr.name="${escapeXml(name)}" attr.type="string"/>\n`;
  }
  return xml;
}

function attributeData(attributes, keys) {
  let xml = '';
  for (const [name, value] of Object.entries(attributes || {})) {
    const id = keys.get(name);
    if (id === undefined || value === undefined) continue;

    const text = typeof value === 'object' ? JSON.stringify(value) : value;
    if (text !== undefined) xml += `      <data key="${id}">${escapeXml(text)}</data>\n`;
  }
  return xml;
}

const XML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '\t': '&#9;',
  '\n': '&#10;',
  '\r': '&#13;'
};

function escapeXml(value) {
  return String(value).replace(/[&<>"'\t\n\r]/g, character => XML_ESCAPES[character]);
}

module.exports = { toGraphML }; 