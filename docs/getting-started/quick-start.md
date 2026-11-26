# Build and export a graph

Install the locked dependencies using the [installation guide](installation-guide.md).
Run this example from the repository root. It parses each export and
checks the same directed relationship in all three formats.

```bash
node - <<'JS'
const assert = require('node:assert/strict');
const { parseStringPromise } = require('xml2js');
const { UltraLink } = require('.');

async function verify() {
  const graph = new UltraLink();
  graph.addEntity('redwood', 'tree', { name: 'Coast redwood' });
  graph.addEntity('grove', 'site', { name: 'Example grove' });
  graph.addLink('redwood', 'grove', 'grows_at');

  const json = JSON.parse(graph.toJSON());
  assert.equal(json.entities.length, 2);
  assert.deepEqual(json.relationships.map(({ source, target, type }) => [source, target, type]),
    [['redwood', 'grove', 'grows_at']]);

  const { graphml } = await parseStringPromise(graph.toGraphML());
  const exported = graphml.graph[0];
  assert.equal(exported.node.length, 2);
  assert.deepEqual(exported.edge.map(edge => [edge.$.source, edge.$.target, edge.data[0]._]),
    [['redwood', 'grove', 'grows_at']]);

  const csv = graph.toCSV();
  const entities = csv['entities.csv'].trim().split(/\r?\n/);
  const relationships = csv['relationships.csv'].trim().split(/\r?\n/);
  assert.equal(entities.length, 3);
  assert.equal(relationships.length, 2);
  assert.match(relationships[1], /redwood.*grove.*grows_at/);

  console.log('Verified 2 entities and 1 directed relationship in JSON, GraphML and CSV.');
}
verify().catch(error => { console.error(error); process.exitCode = 1; });
JS
```

`toJSON()` returns serialized JSON. `toGraphML()` returns an XML
string. `toCSV()` returns a filename-keyed collection of CSV
strings. The [format guides](../formats/README.md) describe additional
options and exports.
