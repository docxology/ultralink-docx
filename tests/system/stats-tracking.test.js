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

  test.each([
    {
      scenario: 'Symbol-valued KIF attribute', stage: 'kif', message: 'replace',
      files: [['kif/{system}.kif', 'ERROR-kif.txt']]
    },
    {
      scenario: 'Bayesian entity named constructor', stage: 'bayesian', message: 'includes is not a function',
      files: [['bayesian/{system}-bayesian.json', 'ERROR-bayesian.txt']]
    },
    {
      scenario: 'Symbol-valued RxInfer entity type', stage: 'rxinfer', message: 'RxInfer.jl export failed',
      files: ['model', 'model-with-constraints', 'model-with-test']
        .map(format => [`rxinfer/{system}-${format}.jl`, `ERROR-${format}.txt`])
    },
    {
      scenario: 'unprintable Full Blob node label', stage: 'full-blob', message: 'Cannot convert object to primitive value',
      files: [['full-blob/{system}-full.json', 'ERROR-uncompressed.txt']]
    },
    {
      scenario: 'missing visualization node attributes', stage: 'visualization', message: "reading 'name'",
      files: ['.svg', '.png', '-radial.png', '-grid.png', '-cluster.png', '.d3.js', '.cytoscape.js']
        .map(ext => [`visualization/{lower}-graph${ext}`, `ERROR-{lower}-graph${ext}.txt`])
    },
    {
      scenario: 'unserializable interactive visualization label', stage: 'visualization', message: 'BigInt',
      files: ['d3', 'cytoscape']
        .map(format => [`visualization/{lower}-graph.${format}.js`, `ERROR-{lower}-graph.${format}.js.txt`])
    }
  ])('preserves output after a $scenario generation error', async spec => {
    await withNativeRenderer(async (root, runNode) => {
      await runNode('-e', `
        const assert = require('node:assert/strict');
        const fs = require('node:fs');
        const path = require('node:path');
        const { UltraLink } = require('./src');
        const { renderSystem } = require('./examples/render-examples.js');
        const { scenario, stage, message, files } = JSON.parse(process.argv[1]);

        const factory = (id, fail = false) => () => {
          const graph = new UltraLink({ systemName: 'Car' });
          const attributes = { name: id, detail: 'native fixture' };
          let type = 'node';
          if (fail) {
            switch (scenario) {
              case 'Symbol-valued KIF attribute': attributes.detail = Symbol('unrenderable'); break;
              case 'Bayesian entity named constructor': id = 'constructor'; break;
              case 'Symbol-valued RxInfer entity type': type = Symbol('unrenderable'); break;
              case 'unprintable Full Blob node label': attributes.name = { toString: null }; break;
              case 'unserializable interactive visualization label': attributes.name = 1n; break;
            }
          }
          const entity = graph.addEntity(id, type, attributes);
          graph.store.entities[id] = entity;
          if (fail && scenario === 'missing visualization node attributes') entity.attributes = null;
          return graph;
        };
        const paths = system => files.map(([name, diagnostic]) => {
          const expand = value => value.replace('{system}', system).replace('{lower}', system.toLowerCase());
          const output = path.join('examples', 'output', 'systems', system, expand(name));
          return [output, path.join(path.dirname(output), expand(diagnostic))];
        });
        const readValid = (file, entity) => {
          const content = fs.readFileSync(file);
          if (file.endsWith('.png')) {
            assert.equal(content.readBigUInt64BE(0), 0x89504e470d0a1a0an);
            assert.deepEqual([content.readUInt32BE(16), content.readUInt32BE(20)], [1200, 900]);
          } else {
            assert.ok(content.includes(entity), file + ' does not describe ' + entity);
          }
          return content;
        };
        const checkFailure = result => {
          assert.equal(result.ok, false);
          const failures = result.failures.filter(failure => failure.stage === stage);
          assert.equal(failures.length, files.length);
          assert.ok(failures.every(failure => failure.message.includes(message)), JSON.stringify(failures));
          assert.equal(result.stats.formats[stage].errors, files.length);
          assert.ok(result.stats.formats[stage].warnings >= files.length);
        };

        (async () => {
          const outputs = paths('Rerender');
          const good = await renderSystem('Rerender', factory('baseline'));
          assert.equal(good.ok, true);
          const before = outputs.map(([file]) => readValid(file, 'baseline'));

          checkFailure(await renderSystem('Rerender', factory('proposed', true)));
          outputs.forEach(([file, diagnostic], i) => {
            assert.deepEqual(fs.readFileSync(file), before[i], file);
            assert.ok(fs.readFileSync(diagnostic, 'utf8').includes(message), diagnostic);
          });

          checkFailure(await renderSystem('Fresh', factory('proposed', true)));
          for (const [file, diagnostic] of paths('Fresh')) {
            assert.equal(fs.existsSync(file), false, file);
            assert.ok(fs.readFileSync(diagnostic, 'utf8').includes(message), diagnostic);
          }

          const recovered = await renderSystem('Rerender', factory('recovered'));
          assert.equal(recovered.ok, true);
          outputs.forEach(([file], i) => assert.notDeepEqual(readValid(file, 'recovered'), before[i], file));
        })().catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `, JSON.stringify(spec));
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