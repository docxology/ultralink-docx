const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { createDesertEcosystemDataset, createResearchTeamDataset } = require('./test-datasets');

test.each([
  ['DesertEcosystem', createDesertEcosystemDataset, 'saguaro', 'aridity', 'adapts_to'],
  ['ResearchTeam', createResearchTeamDataset, 'alice-chen', 'nlp-project', 'leads']
])('%s website files describe the graph and link to the exported pages', (systemName, createDataset, source, target, type) => {
  const graph = createDataset();
  const { entities, relationships } = graph.toJSON({ asString: false });
  const title = `${systemName} - UltraLink Knowledge Graph`;
  const description = `Interactive exploration of the ${systemName} knowledge graph`;
  const files = graph.toHTMLWebsite({ title, description, theme: 'dark' });
  const outputDir = path.join(__dirname, '..', 'output', 'systems', systemName, 'website');
  const readArtifact = file => fs.readFileSync(path.join(outputDir, file), 'utf8');

  expect(Object.keys(files)).toEqual(expect.arrayContaining([
    'index.html', 'styles.css', 'styles/dark.css', 'graph.js',
    ...entities.map(entity => `${entity.id}.html`)
  ]));
  for (const [filename, contents] of Object.entries(files)) {
    const destination = path.join(outputDir, filename);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, contents);
  }

  // Parse the saved pages without fetching resources or running their scripts.
  const index = new JSDOM(readArtifact('index.html'));
  try {
    const { document } = index.window;
    expect(document.title).toBe(title);
    expect(document.querySelector('header p').textContent).toBe(description);
    expect(document.querySelector('.summary').textContent).toContain(`Total Entities: ${entities.length}`);
    expect(document.querySelector('.summary').textContent).toContain(`Total Relationships: ${relationships.length}`);
    expect(document.querySelector('#graph')).not.toBeNull();
    const links = Array.from(document.querySelectorAll('.entity-item a'), a => a.getAttribute('href'));
    expect(links.sort()).toEqual(entities.map(entity => `${entity.id}.html`).sort());

    for (const asset of document.querySelectorAll('link[rel="stylesheet"], script[src]')) {
      const filename = asset.getAttribute('href') || asset.getAttribute('src');
      expect(files).toHaveProperty([filename]);
      expect(readArtifact(filename).length).toBeGreaterThan(0);
    }
  } finally {
    index.window.close();
  }

  const entity = graph.getEntity(source);
  const page = new JSDOM(readArtifact(`${source}.html`));
  try {
    const { document } = page.window;
    expect(document.querySelector('h1').textContent).toBe(entity.attributes.name);
    expect(document.querySelector('.entity-details table').textContent).toContain(entity.type);
    const related = document.querySelector(`.relationships a[href="${target}.html"]`);
    expect(related.textContent).toBe(graph.getEntity(target).attributes.name);
    expect(related.parentElement.textContent).toContain(type);
    expect(readArtifact(`${target}.html`)).toContain('href="index.html"');
  } finally {
    page.window.close();
  }

  expect(readArtifact('styles.css')).toContain('--bg-color: #202124');
  const script = readArtifact('graph.js');
  expect(script).toContain('d3.forceSimulation');
  const [ , data ] = /^const data = ({[\s\S]*?^});$/m.exec(script);
  const { nodes, links } = JSON.parse(data);
  expect(nodes).toEqual(entities.map(({ id, type, attributes }) => ({
    id, type, attributes, label: attributes.name || attributes.title || id
  })));
  expect(links).toEqual(relationships.map(({ source, target, type, attributes }) => ({
    source, target, type, attributes
  })));
});