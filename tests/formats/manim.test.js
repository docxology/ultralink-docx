const { expect } = require('chai');
const { UltraLink } = require('../../src');
const { createDesertEcosystemDataset } = require('../fixtures/Systems/DesertEcosystem/desert-ecosystem');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

function readSceneGraph(code) {
  const match = code.match(/^\s*graph = json\.loads\((".*")\)$/m);
  expect(match, 'the scene should load a serialized graph').not.to.be.null;
  return JSON.parse(JSON.parse(match[1]));
}

function commandAvailable(command, versionFlag = '--version') {
  const result = spawnSync(command, [versionFlag], { encoding: 'utf8', timeout: 10000 });
  if (result.error?.code === 'ENOENT') return false;
  if (result.error) throw result.error;
  expect(result.status, `${command} ${versionFlag}: ${result.stderr}`).to.equal(0);
  return true;
}

describe('Manim Format', () => {
  let ultralink;

  beforeEach(() => {
    ultralink = createDesertEcosystemDataset();
  });

  it('should generate valid Manim Python code for the actual graph', () => {
    const code = ultralink.toManim();
    expect(code).to.be.a('string');
    expect(code).to.include('from manim import *');
    expect(code).to.include('class UltraLinkGraph(Scene):');
    expect(code).to.include('def construct(self):');
    expect(code).to.include('Text(');
    expect(code).to.include('self.play(');
    expect(code).to.include('self.wait(');
    expect(code).to.include('Arrow(');

    const graph = readSceneGraph(code);
    const labels = new Map(graph.entities.map(entity => [entity.id, entity.label]));
    expect(labels.size).to.equal(ultralink.entities.size);
    expect(labels.get('saguaro')).to.equal('Saguaro Cactus');
    expect(labels.get('kangaroo_rat')).to.equal("Merriam's Kangaroo Rat");
    expect(labels.get('aridity')).to.equal('Aridity');
    expect(graph.relationships).to.deep.equal(Array.from(ultralink.relationships.values(), ({
      source, target, type
    }) => ({ source, target, type })));
    expect(graph.relationships).to.deep.include({ source: 'kangaroo_rat', target: 'aridity', type: 'adapted_to' });
    expect(graph.relationships).to.deep.include({ source: 'kangaroo_rat', target: 'dune_field', type: 'lives_in' });
  });

  it('should use the requested Manim theme, duration, narration and highlighting', () => {
    const code = ultralink.toManim({
      animationStyle: 'explanatory',
      visualTheme: 'dark',
      includeNarrationText: true,
      highlightCentralEntities: true,
      animationDuration: 60
    });
    expect(code).to.include('text_color = "#ece6e2"');
    expect(code).to.include('config.background_color = "#242428"');
    expect(code).to.include('duration = 60');
    expect(code).to.include('self.wait(max(beat, duration - self.time - beat))');
    expect(code).to.include('subtitle = Text("Follow the entities and their relationships"');
    expect(code).to.include('Indicate(entities[graph["centralEntity"]])');

    const { centralEntity, entities, relationships } = readSceneGraph(code);
    const degree = id => relationships.filter(rel => rel.source === id).length
      + relationships.filter(rel => rel.target === id).length;
    expect(degree(centralEntity)).to.equal(Math.max(...entities.map(entity => degree(entity.id))));

    const minimal = ultralink.toManim({ includeNarrationText: false, highlightCentralEntities: false });
    expect(minimal).not.to.include('subtitle = Text(');
    expect(minimal).not.to.include('Indicate(');
  });

  it('should label empty graphs without adding sample graph data', () => {
    for (const systemName of ['UltraLink', 'Car']) {
      const empty = new UltraLink();
      const code = empty.toManim({ systemName });
      expect(code).to.be.a('string');
      expect(code).to.include('from manim import *');
      expect(code).to.include('class UltraLinkGraph(Scene):');
      expect(code).to.include('def construct(self):');
      expect(code).to.include('Text("Empty Knowledge Graph"');
      expect(readSceneGraph(code)).to.deep.equal({ systemName, entities: [], relationships: [] });
      expect(empty.getStats()).to.include({ entityCount: 0, relationshipCount: 0 });
    }
  });

  it('should render mathematical attributes as MathTex', () => {
    const formula = String.raw`Q = \sigma A T^4`;
    ultralink.addEntity('heat-loss', 'formula', { title: 'Radiative heat loss', formula });
    const code = ultralink.toManim();

    expect(readSceneGraph(code).entities).to.deep.include({
      id: 'heat-loss', type: 'formula', label: 'Radiative heat loss', formula
    });
    expect(code).to.include('VGroup(*(MathTex(entity["formula"], color=text_color)');
    expect(code).to.include('for entity in graph["entities"] if entity.get("formula")');
    expect(code).to.include('formulas.arrange(DOWN)');
    expect(code).to.include('self.play(Write(formulas)');
  });

  it('should generate ordered animation stages for the title, nodes and edges', () => {
    const code = ultralink.toManim();
    expect(code.match(/self\.play\(/g).length).to.be.greaterThan(5);
    expect(code.match(/self\.wait\(/g).length).to.be.greaterThan(2);
    expect(code.indexOf('self.play(')).to.be.lessThan(code.indexOf('self.wait('));
    expect(code.indexOf('self.play(Write(title_group)')).to.be.lessThan(code.indexOf('FadeIn(group)'));
    expect(code.indexOf('FadeIn(group)')).to.be.lessThan(code.indexOf('Create(arrow)'));
  });

  it('should save a Python scene and render media when Manim is installed', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ultralink-manim-'));
    try {
      const systemName = 'Desert "Ecosystem"\nVisualization';
      const code = ultralink.toManim({
        systemName,
        animationStyle: 'explanatory',
        visualTheme: 'dark',
        includeNarrationText: true,
        highlightCentralEntities: true,
        animationDuration: 4
      });
      const pythonFile = path.join(directory, 'test_animation.py');
      fs.writeFileSync(pythonFile, code);
      const saved = fs.readFileSync(pythonFile, 'utf8');
      const graph = readSceneGraph(saved);
      expect(graph.systemName).to.equal(systemName);
      expect(graph.entities).to.have.lengthOf(ultralink.entities.size);
      expect(graph.relationships).to.have.lengthOf(ultralink.relationships.size);

      if (commandAvailable('python3')) {
        execFileSync('python3', [
          '-c', 'import ast, pathlib, sys; ast.parse(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))',
          pythonFile
        ], { timeout: 10000 });
      }

      if (commandAvailable('manim')) {
        const media = path.join(directory, 'media');
        execFileSync('manim', ['-ql', '--media_dir', media, pythonFile, 'UltraLinkGraph'], {
          cwd: directory, timeout: 240000
        });
        const videos = path.join(media, 'videos');
        const mp4s = fs.readdirSync(videos, { recursive: true })
          .filter(relative => path.basename(relative) === 'UltraLinkGraph.mp4');
        expect(mp4s).to.have.lengthOf(1);
        const mp4 = path.join(videos, mp4s[0]);
        expect(fs.statSync(mp4).size).to.be.greaterThan(0);

        if (commandAvailable('ffmpeg', '-version')) {
          const gif = path.join(directory, 'test_animation.gif');
          const framesDir = path.join(directory, 'frames');
          fs.mkdirSync(framesDir);
          const input = ['-hide_banner', '-loglevel', 'error', '-i', mp4];
          execFileSync('ffmpeg', [...input, '-vf', 'fps=10,scale=720:-1', gif], { timeout: 30000 });
          expect(fs.readFileSync(gif).subarray(0, 6).toString()).to.match(/^GIF8[79]a$/);
          execFileSync('ffmpeg', [
            ...input, '-vf', 'fps=1', path.join(framesDir, 'frame_%04d.png')
          ], { timeout: 30000 });
          const frames = fs.readdirSync(framesDir).filter(name => /^frame_\d+\.png$/.test(name));
          expect(frames.length).to.be.greaterThan(0);
          expect(fs.statSync(path.join(framesDir, frames[0])).size).to.be.greaterThan(0);
        }
      }
    } finally {
      fs.rmSync(directory, { recursive: true });
    }
  }, 300000);
});
