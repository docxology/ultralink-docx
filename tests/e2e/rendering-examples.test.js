/**
 * End-to-End Test for Render Examples Script
 * 
 * This test verifies that the render-examples.js script works correctly
 * by testing its key functions with real UltraLink instances.
 */

const fs = require('fs');
const path = require('path');
const { withNativeRenderer } = require('../utils/native-example-renderer');

describe('E2E: Render Examples Script', () => {
  test('importing the renderer in native Node does not start rendering', async () => {
    await withNativeRenderer(async (root, runNode) => {
      const { stdout, stderr } = await runNode('-e', "require('./examples/render-examples.js')");
      expect(stdout).toBe('');
      expect(stderr).toBe('');
      expect(fs.existsSync(path.join(root, 'examples', 'output'))).toBe(false);
    });
  });

  test('should correctly create and render a test system', async () => {
    await withNativeRenderer(async (root, runNode) => {
      await runNode('-e', `
        const { UltraLink } = require('./src');
        const { renderSystem } = require('./examples/render-examples.js');

        (async () => {
          await renderSystem('TestSystem', () => {
            const ultralink = new UltraLink();
            ultralink.addEntity('entity1', 'test-type', { name: 'Test Entity 1' });
            ultralink.addEntity('entity2', 'test-type', { name: 'Test Entity 2' });
            ultralink.addLink('entity1', 'entity2', 'related_to');
            return ultralink;
          });
        })().catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `);

      const systems = path.join(root, 'examples', 'output', 'systems');
      expect(fs.readdirSync(systems)).toEqual(['TestSystem']);
      const output = path.join(systems, 'TestSystem');
      const graph = JSON.parse(fs.readFileSync(path.join(output, 'TestSystem.json'), 'utf8'));
      expect(graph.entities.map(entity => entity.id)).toEqual(['entity1', 'entity2']);
      const edge = { source: 'entity1', target: 'entity2', type: 'related_to', attributes: {} };
      expect(graph.relationships).toEqual([edge]);
      const blob = JSON.parse(fs.readFileSync(path.join(output, 'full-blob', 'TestSystem-full.json'), 'utf8'));
      expect(blob.json.relationships).toEqual([
        { ...edge, id: 'entity1_related_to_entity2', metadata: { created: expect.any(String), modified: expect.any(String) } }
      ]);
      const svg = fs.readFileSync(path.join(output, 'visualization', 'testsystem-graph.svg'), 'utf8');
      expect(svg).toContain('>Test Entity 1</text>');
      expect(svg).toContain('>Test Entity 2</text>');
      expect(svg).toContain('<line ');
    });
  });

  test('the CLI reports one blocked system without discarding the other seven graphs', async () => {
    await withNativeRenderer(async (root, runNode) => {
      const systems = path.join(root, 'examples', 'output', 'systems');
      const blocker = path.join(systems, 'HumanAnatomy');
      fs.mkdirSync(systems, { recursive: true });
      fs.writeFileSync(blocker, 'not a directory');

      await expect(runNode('examples/render-examples.js')).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringMatching(/HumanAnatomy \[output-directory\]:.*HumanAnatomy/),
        stdout: expect.not.stringContaining('RENDERING COMPLETE')
      });
      expect(fs.readFileSync(blocker, 'utf8')).toBe('not a directory');
      const rendered = ['ActiveInferenceLab', 'Car', 'DesertEcosystem', 'NeurofeedbackResearch', 'POMDP',
        'ResearchTeam', 'USAHistory'];
      expect(fs.readdirSync(systems).sort()).toEqual([...rendered, 'HumanAnatomy'].sort());
      for (const system of rendered) {
        const graph = JSON.parse(fs.readFileSync(path.join(systems, system, `${system}.json`), 'utf8'));
        expect(graph.relationships.length).toBeGreaterThan(0);
      }
    });
  });

  test('the CLI fails when only the embedded Bayesian export fails and preserves the prior bundle', async () => {
    await withNativeRenderer(async (root, runNode) => {
      const renderer = './examples/render-examples.js';
      await runNode('-e', `
        const { renderSystem, SYSTEMS } = require('${renderer}');
        renderSystem('POMDP', SYSTEMS.POMDP).then(({ ok }) => { if (!ok) process.exitCode = 1; });
      `);
      const output = path.join(root, 'examples', 'output', 'systems', 'POMDP');
      const blobPath = path.join(output, 'full-blob', 'POMDP-full.json');
      const before = fs.readFileSync(blobPath);
      expect(JSON.parse(JSON.parse(before).bayesian.json).nodes).not.toHaveLength(0);

      const preload = path.join(root, 'malformed-bayesian-input.cjs');
      fs.writeFileSync(preload, `
        const fixture = require('./tests/fixtures/Systems/POMDP/pomdp.js');
        const create = fixture.createPOMDPDataset;
        fixture.createPOMDPDataset = () => {
          const graph = create();
          // The standalone renderer supplies a system name; only the embedded export
          // autodetects it from the legacy store and reads the malformed type.
          graph.store.entities.pomdp_model = { id: 'pomdp_model', type: 42 };
          return graph;
        };
      `);
      await expect(runNode('--require', preload, renderer)).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringMatching(/POMDP \[full-blob\]:.*embedded Bayesian Network export.*split.*\n.*Rendering incomplete for POMDP/),
        stdout: expect.not.stringContaining('RENDERING COMPLETE')
      });
      expect(fs.readFileSync(blobPath)).toEqual(before);
      expect(fs.readFileSync(path.join(output, 'full-blob', 'ERROR-uncompressed.txt'), 'utf8'))
        .toContain('embedded Bayesian Network export');
      expect(fs.readdirSync(path.join(output, 'bayesian')).sort()).toEqual(['POMDP-bayesian.json', 'POMDP.bif']);
      const standalone = JSON.parse(fs.readFileSync(path.join(output, 'bayesian', 'POMDP-bayesian.json')));
      expect(standalone.nodes).toContainEqual(expect.objectContaining({ id: 'pomdp_model' }));
    });
  });
  
  test('should generate placeholder content for visualization formats', () => {
    // Test the generatePlaceholderD3 function
    const renderExamples = require('../../examples/render-examples.js');
    const d3Content = renderExamples.generatePlaceholderD3('TestSystem');
    
    // Verify the D3 placeholder content was generated with system-specific info
    expect(d3Content).toContain('TestSystem');
    
    // Test the generatePlaceholderCytoscape function
    const cytoscapeContent = renderExamples.generatePlaceholderCytoscape('TestSystem');
    
    // Verify the Cytoscape placeholder content was generated with system-specific info
    expect(cytoscapeContent).toContain('TestSystem');
    
    // Test the generatePlaceholderBIF function
    const bifContent = renderExamples.generatePlaceholderBIF('TestSystem');
    
    // Verify the BIF placeholder content was generated
    expect(bifContent).toContain('<n>TestSystem</n>');
    
    // Test the generatePlaceholderCompressedBlob function
    const blobContent = renderExamples.generatePlaceholderCompressedBlob('TestSystem');
    
    // Verify the compressed blob placeholder content was generated
    expect(blobContent.toString()).toContain('TestSystem');
  });
}); 