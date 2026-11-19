const { Readable } = require('node:stream');
const csvParser = require('csv-parser');
const { parseStringPromise } = require('xml2js');
const { createEnhancedResearchTeamDataset, createEnhancedResearchTeamSubset } = require('./fixtures/research-team-llm');

const mlTheoryId = 'machine-learning-theory';
const visionProjectId = 'computer-vision-project';

async function parseCSV(text) {
  const rows = [];
  for await (const row of Readable.from([text]).pipe(csvParser({ strict: true }))) {
    rows.push(row);
  }
  return rows;
}

function nodeAttribute(graphml, id, name) {
  const key = graphml.key.find(({ $ }) => $.for === 'node' && $['attr.name'] === name);
  const node = graphml.graph[0].node.find(({ $ }) => $.id === id);
  return node.data.find(({ $ }) => $.key === key.$.id)._;
}

describe('Enhanced Research Team Export Tests', () => {
  let ultralink;

  beforeEach(() => {
    ultralink = createEnhancedResearchTeamDataset();
  });

  test('should export to JSON with vector metadata', () => {
    const serialized = ultralink.toJSON();
    expect(typeof serialized).toBe('string');
    const json = JSON.parse(serialized);

    const mlTheory = json.entities.find(entity => entity.id === mlTheoryId);
    expect(mlTheory.attributes.vector).toMatchObject({
      embedding: [0.23, 0.45, -0.12, 0.78],
      cluster: 'core-ml-concepts'
    });
    const visionProject = json.entities.find(entity => entity.id === visionProjectId);
    expect(visionProject.attributes.llm_insights.key_findings).toHaveLength(2);
    expect(visionProject.attributes.llm_insights).toEqual(
      ultralink.getEntity(visionProjectId).attributes.llm_insights
    );

    expect(json.metadata.cluster_analysis).toHaveLength(2);
    expect(json.metadata).toMatchObject({
      ...ultralink.metadata,
      entityCount: ultralink.entities.size,
      relationshipCount: ultralink.relationships.size
    });
  });

  test('should export to CSV with nested vector and LLM data', async () => {
    const csv = ultralink.toCSV();
    expect(csv['entities.csv']).toBe(csv.entities);
    expect(csv['relationships.csv']).toBe(csv.relationships);
    const rows = await parseCSV(csv['entities.csv']);
    expect(rows).toHaveLength(ultralink.entities.size);

    const mlTheory = rows.find(row => row.id === mlTheoryId);
    expect(JSON.parse(mlTheory.vector)).toEqual(ultralink.getEntity(mlTheoryId).attributes.vector);
    const visionProject = rows.find(row => row.id === visionProjectId);
    expect(JSON.parse(visionProject.llm_insights).key_findings[0].confidence).toBe(0.89);
  });

  test('should export to GraphML with vector attributes', async () => {
    const { graphml } = await parseStringPromise(ultralink.toGraphML());
    expect(JSON.parse(nodeAttribute(graphml, mlTheoryId, 'vector'))).toEqual(
      ultralink.getEntity(mlTheoryId).attributes.vector
    );
  });

  test('should export subsets while preserving vector metadata', () => {
    const technicalSubset = createEnhancedResearchTeamSubset('technical');
    const json = JSON.parse(technicalSubset.toJSON());
    expect(json.entities.some(entity => entity.id === 'alice-chen')).toBe(false);

    const mlTheory = json.entities.find(entity => entity.id === mlTheoryId);
    expect(mlTheory.attributes.vector).toEqual(ultralink.getEntity(mlTheoryId).attributes.vector);
    const visionProject = json.entities.find(entity => entity.id === visionProjectId);
    expect(visionProject.attributes.llm_insights).toEqual(
      ultralink.getEntity(visionProjectId).attributes.llm_insights
    );
    expect(json.metadata).toMatchObject(ultralink.metadata);
  });

  test('should handle large vector embeddings in exports', async () => {
    const embedding = Array.from({ length: 768 }, (_, index) => (index - 384) / 1024);
    const mlTheory = ultralink.getEntity(mlTheoryId);
    mlTheory.attributes.vector.embedding = embedding;
    mlTheory.vector = Float32Array.from(embedding);

    const json = JSON.parse(ultralink.toJSON({ includeVectors: true }));
    const exportedEntity = json.entities.find(entity => entity.id === mlTheoryId);
    expect(exportedEntity.attributes.vector.embedding).toEqual(embedding);
    expect(exportedEntity.vector).toEqual(embedding);
    expect(json.entities.find(entity => entity.id === visionProjectId)).not.toHaveProperty('vector');

    const rows = await parseCSV(ultralink.toCSV()['entities.csv']);
    expect(JSON.parse(rows.find(row => row.id === mlTheoryId).vector).embedding).toEqual(embedding);

    const { graphml } = await parseStringPromise(ultralink.toGraphML());
    expect(JSON.parse(nodeAttribute(graphml, mlTheoryId, 'vector')).embedding).toEqual(embedding);
  });

  test('should export temporal metadata correctly', async () => {
    const json = JSON.parse(ultralink.toJSON());
    const evolution = json.metadata.temporal_analysis.knowledge_evolution;
    expect(evolution.map(({ timeframe }) => timeframe)).toEqual(['2021-Q1', '2022-Q2']);

    // Check the source dates as entity attributes in the tabular and node exports.
    const rows = await parseCSV(ultralink.toCSV()['entities.csv']);
    const { graphml } = await parseStringPromise(ultralink.toGraphML());
    for (const [id, attribute, date] of [
      [visionProjectId, 'start_date', '2021-01-15'],
      ['vision-paper-2022', 'publication_date', '2022-06-15']
    ]) {
      expect(rows.find(row => row.id === id)[attribute]).toBe(date);
      expect(nodeAttribute(graphml, id, attribute)).toBe(date);
    }
  });

  test('should handle special characters in LLM-generated content', async () => {
    const finding = {
      statement: 'Test with <special> & "characters", \'quotes\'\nand a second line',
      confidence: 0.95
    };
    ultralink.getEntity(visionProjectId).attributes.llm_insights.key_findings.push(finding);

    const note = 'reviewer, "note"';
    ultralink.addLink(mlTheoryId, visionProjectId, 'reviews', {
      [note]: finding.statement,
      accepted: false,
      revision: 0
    });

    const json = JSON.parse(ultralink.toJSON());
    const visionProject = json.entities.find(entity => entity.id === visionProjectId);
    expect(visionProject.attributes.llm_insights.key_findings).toContainEqual(finding);

    const csv = ultralink.toCSV();
    const entities = await parseCSV(csv['entities.csv']);
    const insights = JSON.parse(entities.find(row => row.id === visionProjectId).llm_insights);
    expect(insights.key_findings).toContainEqual(finding);
    const relationships = await parseCSV(csv['relationships.csv']);
    expect(relationships.find(row => row.type === 'reviews')).toMatchObject({
      source: mlTheoryId,
      target: visionProjectId,
      [note]: finding.statement,
      accepted: 'false',
      revision: '0'
    });

    const { graphml } = await parseStringPromise(ultralink.toGraphML());
    const graphmlInsights = JSON.parse(nodeAttribute(graphml, visionProjectId, 'llm_insights'));
    expect(graphmlInsights.key_findings).toContainEqual(finding);
  });
}); 