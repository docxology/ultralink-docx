# Export a supplied vector

Run this example from the [installed checkout](../getting-started/installation-guide.md).

```bash
node - <<'JS'
const assert = require('node:assert/strict');
const { UltraLink } = require('.');
const graph = new UltraLink();

graph.addEntity('redwood', 'tree', { vector: { source: 'local fixture' } });
graph.getEntity('redwood').vector = Float32Array.from([0.25, 0.75]);

const withVector = JSON.parse(graph.toJSON({ includeVectors: true })).entities[0];
assert.deepEqual(withVector.vector, [0.25, 0.75]);
assert.equal(withVector.attributes.vector.source, 'local fixture');

const plain = JSON.parse(graph.toJSON()).entities[0];
assert.equal(plain.attributes.vector.source, 'local fixture');
assert.equal(Object.hasOwn(plain, 'vector'), false);
console.log('Verified vector export and default metadata behavior.');
JS
```

See the [vector data guide](../core-features/vector-integration.md) for
the distinction between metadata and dedicated vectors.
