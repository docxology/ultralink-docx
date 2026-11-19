const fs = require('fs');
const path = require('path');
const { withNativeRenderer } = require('../utils/native-example-renderer');

const renderer = 'examples/render-examples.js';
const blobName = 'POMDP-full-compressed.blob';
const blobDir = 'examples/output/systems/POMDP/full-blob';
const fixedClock = `
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...args) { super(...(args.length ? args : [Date.now()])); }
    static now() { return 1735689600000; }
  };
`;
const renderPOMDP = `
  const assert = require('node:assert/strict');
  const { renderSystem, SYSTEMS } = require('./${renderer}');
  renderSystem('POMDP', SYSTEMS.POMDP).then(result => {
    assert.equal(result.ok, true, JSON.stringify(result.failures));
  });
`;

test('the example renderer writes a restorable compact Full Blob beside the pretty JSON', async () => {
  await withNativeRenderer(async (root, runNode) => {
    await runNode('-e', fixedClock + renderPOMDP);
    await runNode('-e', `
      ${fixedClock}
      const assert = require('node:assert/strict');
      const fs = require('node:fs');
      const { UltraLink } = require('./src');
      const { SYSTEMS } = require('./${renderer}');
      const compact = fs.readFileSync('./${blobDir}/${blobName}', 'utf8');
      const pretty = fs.readFileSync('./${blobDir}/POMDP-full.json', 'utf8');
      const fixture = SYSTEMS.POMDP();
      assert.equal(compact, fixture.toFullBlob({ compressed: true, throwOnError: true }));
      assert.equal(pretty, JSON.stringify(fixture.toFullBlob({ throwOnError: true }), null, 2));
      const archive = JSON.parse(compact);
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

test('an interrupted compressed write preserves the archive and reports the write error even if cleanup fails', async () => {
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
      let brokenStage;
      fs.writeFileSync = (file, ...args) => {
        if (typeof file === 'string' && path.basename(file) === '${blobName}') {
          write(file, '{"partial":');
          brokenStage = path.dirname(file);
          throw new Error('simulated incomplete archive write');
        }
        return write(file, ...args);
      };
      const remove = fs.rmSync;
      fs.rmSync = (file, ...args) => {
        remove(file, ...args);
        if (file === brokenStage) throw new Error('simulated staging cleanup failure');
      };
    `);
    await expect(runNode('--require', preload, renderer)).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(/Could not remove Full Blob staging directory.*simulated staging cleanup failure\n.*POMDP \[full-blob\]: simulated incomplete archive write/)
    });
    expect(fs.readFileSync(output)).toEqual(previous);
    expect(fs.readdirSync(directory).sort()).toEqual(['ERROR-compressed.txt', blobName, 'POMDP-full.json']);
    expect(fs.readFileSync(path.join(directory, 'ERROR-compressed.txt'), 'utf8'))
      .toContain('simulated incomplete archive write');
  });
});
