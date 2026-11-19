const fs = require('fs');
const path = require('path');
const { withNativeRenderer } = require('../utils/native-example-renderer');

function countFiles(directory) {
  return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile()).length;
}

function websiteFiles(directory) {
  return fs.readdirSync(directory, { recursive: true })
    .filter(name => fs.statSync(path.join(directory, name)).isFile())
    .sort();
}

describe('Statistics Tracking in Render Examples', () => {
  test.each([
    { label: 'successful render', blocked: [] },
    { label: 'partial render', blocked: ['POMDP.json', 'website/index.html'] }
  ])('reports files actually written for a $label', async ({ blocked }) => {
    await withNativeRenderer(async (root, runNode) => {
      const output = path.join(root, 'examples', 'output', 'systems', 'POMDP');

      await runNode('-e', `
        const fs = require('node:fs');
        const path = require('node:path');
        const { renderSystem, SYSTEMS } = require('./examples/render-examples.js');
        const [output, blockedFiles] = process.argv.slice(1);
        const blocked = JSON.parse(blockedFiles);
        (async () => {
          const complete = await renderSystem('POMDP', SYSTEMS.POMDP);
          if (blocked.length === 0) return complete;

          fs.renameSync(output, 'complete-output');
          // Real directory/file collisions, without making permission or
          // elevated-user assumptions.
          for (const name of blocked) fs.mkdirSync(path.join(output, name), { recursive: true });
          return await renderSystem('POMDP', SYSTEMS.POMDP);
        })().then(result => {
          fs.writeFileSync('result.json', JSON.stringify(result));
        }).catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `, output, JSON.stringify(blocked));
      const { systemName, ok, stats, failures } =
        JSON.parse(fs.readFileSync(path.join(root, 'result.json'), 'utf8'));
      const website = path.join(output, 'website');
      const files = websiteFiles(website);
      expect(systemName).toBe('POMDP');
      expect(stats.files).toBe(countFiles(output));
      expect(stats.formats['html-website']).toEqual({
        files: files.length,
        successful: files.length,
        warnings: 0,
        errors: blocked.length ? 1 : 0
      });
      expect(fs.readFileSync(path.join(website, 'graph.js'), 'utf8')).toContain('POMDP');
      expect(stats.formats.bayesian).toEqual({ files: 2, successful: 1, warnings: 1, errors: 0 });
      expect(fs.readFileSync(path.join(output, 'bayesian', 'POMDP.bif'), 'utf8')).toContain('<n>POMDP</n>');

      if (blocked.length) {
        const original = websiteFiles(path.join(root, 'complete-output', 'website'));
        expect(original).toContain('index.html');
        expect(files).toEqual(original.filter(name => name !== 'index.html'));
        expect(ok).toBe(false);
        expect(stats.errors).toBe(2);
        expect(stats.formats.json).toEqual({ files: 0, successful: 0, warnings: 0, errors: 1 });
        expect(failures).toEqual([
          { stage: 'json', message: expect.stringContaining('POMDP.json') },
          { stage: 'html-website', message: expect.stringContaining('index.html') }
        ]);
        expect(fs.readFileSync(path.join(output, 'POMDP.graphml'), 'utf8')).toContain('<edge ');
      } else {
        expect(ok).toBe(true);
        expect(failures).toEqual([]);
        expect(stats.errors).toBe(0);
        expect(fs.readFileSync(path.join(website, 'index.html'), 'utf8')).toContain('POMDP');
      }
    });
  });

  test('a failed website rerender preserves the previous website byte-for-byte', async () => {
    await withNativeRenderer(async (root, runNode) => {
      const { stdout, stderr } = await runNode('-e', `
        const assert = require('node:assert/strict');
        const fs = require('node:fs');
        const { UltraLink } = require('./src');
        const { renderSystem } = require('./examples/render-examples.js');
        const factory = detail => () => {
          const graph = new UltraLink();
          graph.addEntity('fixture', 'node', { name: 'Fixture', detail });
          return graph;
        };
        (async () => {
          const complete = await renderSystem('Rerender', factory('usable'));
          assert.equal(complete.ok, true);
          fs.cpSync('examples/output/systems/Rerender/website', 'previous-website', { recursive: true });
          const failed = await renderSystem('Rerender', factory(Symbol('unrenderable')));
          fs.writeFileSync('result.json', JSON.stringify(failed));
        })().catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `);

      const website = path.join(root, 'examples', 'output', 'systems', 'Rerender', 'website');
      const previous = path.join(root, 'previous-website');
      const diagnostic = 'ERROR-html-website.txt';
      const files = websiteFiles(previous);
      expect(files).toEqual(expect.arrayContaining(['index.html', 'graph.js', 'fixture.html']));
      for (const name of files) {
        expect(fs.readFileSync(path.join(website, name))).toEqual(fs.readFileSync(path.join(previous, name)));
      }
      expect(websiteFiles(website)).toEqual([...files, diagnostic].sort());

      const { ok, stats, failures } = JSON.parse(fs.readFileSync(path.join(root, 'result.json'), 'utf8'));
      expect(ok).toBe(false);
      expect(failures).toContainEqual({ stage: 'html-website', message: expect.stringContaining('Symbol') });
      expect(stats.formats['html-website']).toEqual({ files: 1, successful: 0, warnings: 1, errors: 1 });
      expect(fs.readFileSync(path.join(website, diagnostic), 'utf8')).toContain('Symbol');
      expect(stderr).toMatch(/Rerender \[html-website\]:.*Symbol/);
      expect(stdout.match(/Completed rendering Rerender/g)).toHaveLength(1);
    });
  });

  test('counts real diagnostics but rejects SVG bytes from the PNG exporter', async () => {
    await withNativeRenderer(async (root, runNode) => {
      await runNode('-e', `
        const fs = require('node:fs');
        const { renderSystem, SYSTEMS } = require('./examples/render-examples.js');
        const graph = SYSTEMS.POMDP();
        const json = graph.toJSON;
        graph.toJSON = function () {
          this.toJSON = json;
          throw new Error('fixture JSON export failed');
        };
        const visualize = graph.toVisualization.bind(graph);
        graph.toVisualization = async options => {
          if (options.format === 'png' && options.layout === 'force') {
            const svg = await visualize({ ...options, format: 'svg' });
            return { 'graph.png': Buffer.from(svg['graph.svg']) };
          }
          if (options.format === 'png' && options.layout === 'radial') {
            return { 'graph-radial.png': Buffer.from(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64'
            ) };
          }
          return visualize(options);
        };
        renderSystem('POMDP', () => graph).then(result => {
          fs.writeFileSync('result.json', JSON.stringify(result));
        }).catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `);

      const output = path.join(root, 'examples', 'output', 'systems', 'POMDP');
      const { ok, stats, failures } = JSON.parse(fs.readFileSync(path.join(root, 'result.json'), 'utf8'));
      expect(ok).toBe(false);
      expect(failures).toEqual([
        { stage: 'json', message: 'fixture JSON export failed' },
        { stage: 'visualization', message: expect.stringContaining('pomdp-graph.png') }
      ]);
      expect(stats.formats.json).toEqual({ files: 1, successful: 0, warnings: 1, errors: 1 });
      expect(stats.formats.visualization).toEqual({ files: 6, successful: 5, warnings: 1, errors: 1 });
      expect(stats.files).toBe(countFiles(output));
      expect(fs.readFileSync(path.join(output, 'ERROR-json.txt'), 'utf8')).toContain('fixture JSON export failed');
      expect(fs.existsSync(path.join(output, 'POMDP.json'))).toBe(false);
      expect(fs.existsSync(path.join(output, 'visualization', 'pomdp-graph.png'))).toBe(false);
      const placeholder = fs.readFileSync(path.join(output, 'visualization', 'pomdp-graph-radial.png'));
      expect([placeholder.readUInt32BE(16), placeholder.readUInt32BE(20)]).toEqual([1, 1]);
      expect(fs.readFileSync(path.join(output, 'visualization', 'pomdp-graph.svg'), 'utf8')).toContain('<line ');
    });
  });
});