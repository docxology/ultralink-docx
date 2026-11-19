const assert = require('node:assert/strict');
const { UltraLink } = require('.');

function checkPackageSmoke() {
  const graph = new UltraLink();
  const test = graph.addEntity('test', 'test', { name: 'Test' });
  const peer = graph.addEntity('peer', 'test', { name: 'Peer' });
  const link = graph.addLink('test', 'peer', 'related_to', { weight: 1 });

  assert.deepEqual(graph.getEntity('test').attributes, { name: 'Test' });
  const { entities, relationships } = JSON.parse(graph.toJSON());
  assert.deepEqual(entities, [
    { id: 'test', type: 'test', attributes: { name: 'Test' }, metadata: test.metadata },
    { id: 'peer', type: 'test', attributes: { name: 'Peer' }, metadata: peer.metadata }
  ]);
  assert.deepEqual(relationships, [
    { id: link.id, source: 'test', target: 'peer', type: 'related_to', attributes: { weight: 1 }, metadata: link.metadata }
  ]);
}

if (typeof test === 'function') {
  test('the package entry point can create and export a knowledge graph', checkPackageSmoke);
} else if (require.main === module) {
  checkPackageSmoke();
  console.log('UltraLink package smoke passed');
}
