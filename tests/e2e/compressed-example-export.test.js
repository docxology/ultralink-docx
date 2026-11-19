const fs = require('fs');
const path = require('path');
const { withNativeRenderer } = require('../utils/native-example-renderer');

const renderer = 'examples/render-examples.js';
const blobName = 'POMDP-full-compressed.blob';
const blobDir = 'examples/output/systems/POMDP/full-blob';
const renderPOMDP = `
  const assert = require('node:assert/strict');
  const { renderSystem, SYSTEMS } = require('./${renderer}');
  renderSystem('POMDP', SYSTEMS.POMDP).then(result => {
    assert.equal(result.ok, true, JSON.stringify(result.failures));
  });
`;

test('the example renderer writes a restorable compact Full Blob beside the pretty JSON', async () => {
  await withNativeRenderer(async (root, runNode) => {
    await runNode('-e', renderPOMDP);
    await runNode('-e', `
      const assert = require('node:assert/strict');
      const fs = require('node:fs');
      const { UltraLink } = require('./src');
      const { SYSTEMS } = require('./${renderer}');
      const compact = fs.readFileSync('./${blobDir}/${blobName}', 'utf8');
      const pretty = fs.readFileSync('./${blobDir}/POMDP-full.json', 'utf8');
      const archive = JSON.parse(compact);
      assert.equal(compact, JSON.stringify(archive));
      assert.equal(pretty, JSON.stringify(JSON.parse(pretty), null, 2));
      const fixture = SYSTEMS.POMDP();
      const restored = new UltraLink().fromFullBlob(compact, { compressed: true });
      const { entities, relationships, metadata } = fixture.toJSON({ asString: false });
      const actual = restored.toJSON({ asString: false });
      assert.deepEqual(actual.entities, entities);
      assert.deepEqual(actual.relationships, relationships);
      assert.equal(restored.relationships.size, fixture.relationships.size);
      assert.equal(archive.json.metadata.entityCount, metadata.entityCount);
      assert.equal(archive.json.metadata.relationshipCount, metadata.relationshipCount);
      const ids = edges => edges.map(edge => edge.id).sort();
      for (const entity of entities) {
        assert.deepEqual(ids(restored.getRelationships(entity.id, { direction: 'outgoing' })),
          ids(fixture.getRelationships(entity.id, { direction: 'outgoing' })));
        assert.deepEqual(ids(restored.getBacklinks(entity.id)), ids(fixture.getBacklinks(entity.id)));
      }
    `);
  });
});

test('a failed compressed write preserves the previous archive and makes the CLI fail', async () => {
  await withNativeRenderer(async (root, runNode) => {
    await runNode('-e', renderPOMDP);
    const directory = path.join(root, blobDir);
    const output = path.join(directory, blobName);
    const previous = fs.readFileSync(output);

    const preload = path.join(root, 'partial-blob-write.cjs');
    fs.writeFileSync(preload, `
      const fs = require('node:fs');
      const path = require('node:path');
      const write = fs.writeFileSync;
      fs.writeFileSync = (file, ...args) => {
        if (typeof file === 'string' && path.basename(file) === '${blobName}') {
          write(file, '{"partial":');
          throw new Error('simulated incomplete archive write');
        }
        return write(file, ...args);
      };
    `);
    await expect(runNode('--require', preload, renderer)).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(/POMDP \[full-blob\]: simulated incomplete archive write/)
    });
    expect(fs.readFileSync(output)).toEqual(previous);
    expect(fs.readdirSync(directory).sort()).toEqual(['ERROR-compressed.txt', blobName, 'POMDP-full.json']);
    expect(fs.readFileSync(path.join(directory, 'ERROR-compressed.txt'), 'utf8'))
      .toContain('simulated incomplete archive write');
  });
});
