const { expect } = require('chai');
const UltraLink = require('../../src/ultralink');
const { createDesertEcosystemDataset } = require('../fixtures/Systems/DesertEcosystem/desert-ecosystem');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Manim Format', () => {
  let ultralink;
  let testOutputDir;

  beforeEach(() => {
    ultralink = createDesertEcosystemDataset();
    testOutputDir = path.join(__dirname, '..', 'tmp', 'manim-test');
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test output directory
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should generate valid Manim Python code', () => {
    const manimCode = ultralink.toManim();
    
    // Basic structure checks
    expect(manimCode).to.be.a('string');
    expect(manimCode).to.include('from manim import *');
    expect(manimCode).to.include('class UltraLinkGraph(Scene):');
    expect(manimCode).to.include('def construct(self):');
    
    // Check for essential Manim components
    expect(manimCode).to.include('Text(');
    expect(manimCode).to.include('self.play(');
    expect(manimCode).to.include('self.wait(');
    
    // Check for entity representations
    expect(manimCode).to.include('saguaro');
    expect(manimCode).to.include('kangaroo-rat');
    expect(manimCode).to.include('aridity');
    
    // Check for relationship animations
    expect(manimCode).to.include('Arrow(');
    expect(manimCode).to.include('adapts_to');
    expect(manimCode).to.include('shares_habitat');
  });

  it('should generate Manim code with custom options', () => {
    const manimCode = ultralink.toManim({
      animationStyle: 'explanatory',
      visualTheme: 'dark',
      includeNarrationText: true,
      highlightCentralEntities: true,
      animationDuration: 60
    });
    
    // Check for custom options being applied
    expect(manimCode).to.include('font_color="#ece6e2"'); // Dark theme text color
    expect(manimCode).to.include('self.wait(2)'); // Animation timing
    expect(manimCode).to.include('Text('); // Narration text
    expect(manimCode).to.include('Indicate('); // Entity highlighting
  });

  it('should handle empty graphs gracefully', () => {
    const emptyUltralink = new UltraLink();
    const manimCode = emptyUltralink.toManim();
    
    // Should still generate valid Manim code
    expect(manimCode).to.be.a('string');
    expect(manimCode).to.include('from manim import *');
    expect(manimCode).to.include('class UltraLinkGraph(Scene):');
    expect(manimCode).to.include('def construct(self):');
    
    // Should include a message about empty graph
    expect(manimCode).to.include('Empty Knowledge Graph');
  });

  it('should include mathematical formulas when relevant', () => {
    const manimCode = ultralink.toManim();
    
    // Check for mathematical formula components
    expect(manimCode).to.include('MathTex(');
    expect(manimCode).to.include('VGroup(');
    expect(manimCode).to.include('arrange(DOWN)');
  });

  it('should generate valid animation sequences', () => {
    const manimCode = ultralink.toManim();
    
    // Check animation sequence structure
    const playCommands = (manimCode.match(/self\.play\(/g) || []).length;
    const waitCommands = (manimCode.match(/self\.wait\(/g) || []).length;
    
    // Should have multiple animations and wait commands
    expect(playCommands).to.be.greaterThan(5);
    expect(waitCommands).to.be.greaterThan(2);
    
    // Should have proper animation order
    expect(manimCode.indexOf('self.play(')).to.be.lessThan(manimCode.indexOf('self.wait('));
  });

  it('should generate actual Manim output if Manim is installed', async function() {
    this.timeout(300000); // Allow 5 minutes for Manim rendering
    
    // Check if Manim is installed
    let manimAvailable = false;
    try {
      execSync('manim --version', { stdio: 'ignore' });
      manimAvailable = true;
    } catch (error) {
      console.warn('⚠️ Skipping Manim output test - Manim not installed');
      this.skip();
      return;
    }
    
    if (manimAvailable) {
      // Generate Manim code
      const manimCode = ultralink.toManim({
        animationStyle: 'explanatory',
        visualTheme: 'dark',
        includeNarrationText: true,
        highlightCentralEntities: true
      });
      
      // Save Python script
      const pythonFile = path.join(testOutputDir, 'test_animation.py');
      fs.writeFileSync(pythonFile, manimCode);
      
      // Run Manim
      try {
        execSync(`manim -ql "${pythonFile}" UltraLinkGraph`, {
          stdio: ['ignore', 'pipe', 'pipe'],
          cwd: testOutputDir
        });
        
        // Check for output files
        const mediaDir = path.join(testOutputDir, 'media', 'videos');
        expect(fs.existsSync(mediaDir)).to.be.true;
        
        const mp4File = path.join(mediaDir, 'UltraLinkGraph.mp4');
        expect(fs.existsSync(mp4File)).to.be.true;
        
        // Check file size (should be non-zero)
        const stats = fs.statSync(mp4File);
        expect(stats.size).to.be.greaterThan(0);
        
        // Try to generate GIF
        try {
          const gifFile = path.join(testOutputDir, 'test_animation.gif');
          execSync(`ffmpeg -i "${mp4File}" -vf "fps=10,scale=720:-1" "${gifFile}"`, {
            stdio: ['ignore', 'pipe', 'pipe']
          });
          
          expect(fs.existsSync(gifFile)).to.be.true;
          const gifStats = fs.statSync(gifFile);
          expect(gifStats.size).to.be.greaterThan(0);
        } catch (error) {
          console.warn('⚠️ GIF conversion failed - ffmpeg might not be installed');
        }
        
        // Try to extract frames
        try {
          const framesDir = path.join(testOutputDir, 'frames');
          fs.mkdirSync(framesDir, { recursive: true });
          
          execSync(`ffmpeg -i "${mp4File}" -vf fps=1 "${framesDir}/frame_%04d.png"`, {
            stdio: ['ignore', 'pipe', 'pipe']
          });
          
          // Check for at least one frame
          const frames = fs.readdirSync(framesDir);
          expect(frames.length).to.be.greaterThan(0);
        } catch (error) {
          console.warn('⚠️ Frame extraction failed - ffmpeg might not be installed');
        }
      } catch (error) {
        console.error('Error during Manim rendering:', error.message);
        throw error;
      }
    }
  });
}); 