/**
 * End-to-End Test for Render Examples Script
 * 
 * This test verifies that the render-examples.js script works correctly
 * by testing its key functions with real UltraLink instances.
 */

const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const renderExamplesPath = require.resolve('../../examples/render-examples.js');
const sourcePath = require.resolve('../../src');

async function withNativeRenderer(check) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ultralink-render-'));
  try {
    // The renderer writes relative to __dirname. Copy it, but use the real
    // fixture modules and their installed dependencies from the project.
    fs.mkdirSync(path.join(root, 'examples'));
    fs.copyFileSync(renderExamplesPath, path.join(root, 'examples', 'render-examples.js'));
    fs.symlinkSync(path.join(__dirname, '..'), path.join(root, 'tests'), 'junction');

    const runNode = (script, ...args) => execFileAsync(process.execPath, ['-e', script, ...args], {
      cwd: root,
      timeout: 20000
    });
    await check(root, runNode);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

describe('E2E: Render Examples Script', () => {
  test('importing the renderer in native Node does not start rendering', async () => {
    await withNativeRenderer(async (root, runNode) => {
      const { stdout, stderr } = await runNode("require('./examples/render-examples.js')");
      expect(stdout).toBe('');
      expect(stderr).toBe('');
      expect(fs.existsSync(path.join(root, 'examples', 'output'))).toBe(false);
    });
  });

  test('should correctly create and render a test system', async () => {
    await withNativeRenderer(async (root, runNode) => {
      await runNode(`
        const { UltraLink } = require(process.argv[1]);
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
      `, sourcePath);

      const systems = path.join(root, 'examples', 'output', 'systems');
      expect(fs.readdirSync(systems)).toEqual(['TestSystem']);
      const output = path.join(systems, 'TestSystem');
      const graph = JSON.parse(fs.readFileSync(path.join(output, 'TestSystem.json'), 'utf8'));
      expect(graph.entities.map(entity => entity.id)).toEqual(['entity1', 'entity2']);
      expect(graph.relationships).toEqual([
        { source: 'entity1', target: 'entity2', type: 'related_to', attributes: {} }
      ]);
      const svg = fs.readFileSync(path.join(output, 'visualization', 'testsystem-graph.svg'), 'utf8');
      expect(svg).toContain('>Test Entity 1</text>');
      expect(svg).toContain('>Test Entity 2</text>');
      expect(svg).toContain('<line ');
    });
  });
  
  test('should generate placeholder content for visualization formats', () => {
    // Test the generatePlaceholderD3 function
    const renderExamples = require(renderExamplesPath);
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