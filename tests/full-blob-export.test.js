const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../src');
const { createDesertEcosystemDataset, createResearchTeamDataset } = require('./test-datasets');

test.each([
  ['DesertEcosystem', createDesertEcosystemDataset, 'saguaro'],
  ['ResearchTeam', createResearchTeamDataset, 'alice-chen']
])('%s Full Blob files contain real exports and round-trip the graph', (systemName, createDataset, entityId) => {
  const graph = createDataset();
  const { entities, relationships } = graph.toJSON({ asString: false });
  const relationship = relationships.find(rel => rel.source === entityId);
  const outputDir = path.join(__dirname, '..', 'output', 'systems', systemName, 'full-blob');
  const objectPath = path.join(outputDir, `${systemName}-full.json`);
  const compactPath = path.join(outputDir, `${systemName}-full-compressed.blob`);

  const blob = graph.toFullBlob();
  const compactBlob = graph.toFullBlob({ compressed: true });
  expect(typeof compactBlob).toBe('string');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(objectPath, JSON.stringify(blob, null, 2));
  fs.writeFileSync(compactPath, compactBlob);

  const objectFromDisk = JSON.parse(fs.readFileSync(objectPath, 'utf8'));
  const compactFromDisk = fs.readFileSync(compactPath, 'utf8');
  const compactObject = JSON.parse(compactFromDisk);
  expect(compactFromDisk).toBe(JSON.stringify(compactObject));

  for (const exported of [objectFromDisk, compactObject]) {
    expect(exported.json).toMatchObject({ entities, relationships });
    expect(exported.csv.entities).toContain(`\n${entityId},`);
    expect(exported.csv.relationships).toContain(`\n${entityId},${relationship.target},${relationship.type}`);
    expect(exported.graphml).toContain(`<node id="${entityId}">`);
    expect(exported.graphml).toContain(`<edge source="${entityId}" target="${relationship.target}">`);
    expect(exported.kif).toContain(`(${relationship.type} ${entityId} ${relationship.target})`);
    expect(JSON.parse(exported.bayesian.json).nodes.length).toBeGreaterThan(0);
    expect(exported.visualization.svg.match(/<circle\b/g)).toHaveLength(entities.length);
    expect(exported.visualization.svg.match(/<line\b/g)).toHaveLength(relationships.length);
    expect(exported.visualization.svg).not.toMatch(/NaN|undefined/);
  }

  for (const [artifact, options] of [[objectFromDisk, {}], [compactFromDisk, { compressed: true }]]) {
    const imported = new UltraLink();
    expect(imported.fromFullBlob(artifact, options)).toBe(imported);
    expect(imported.toJSON({ asString: false })).toMatchObject({ entities, relationships });
  }
});