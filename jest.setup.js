const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.getComputedStyle = dom.window.getComputedStyle;

// Mock canvas for Sharp - use a full mock instead of requiring the actual canvas module
jest.mock('canvas', () => {
  // Create a canvas mock
  class MockCanvas {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    getContext() {
      return {
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        clearRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
        drawImage: jest.fn(),
        createPattern: jest.fn(),
        measureText: jest.fn(() => ({ width: 10 })),
        createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
        putImageData: jest.fn(),
        getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        closePath: jest.fn(),
        clip: jest.fn(),
      };
    }

    toBuffer() {
      // Return a 1x1 transparent PNG as a buffer
      return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
    }
  }

  return {
    createCanvas: (width, height) => new MockCanvas(width, height),
    loadImage: () => Promise.resolve(new MockCanvas(10, 10)),
    registerFont: jest.fn(),
    Canvas: MockCanvas,
    Image: class {
      constructor() {
        this.src = '';
        this.width = 0;
        this.height = 0;
        this.onload = null;
      }
    },
  };
});

// Create a more robust canvas mock
const createMockContext = () => {
  return {
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    drawImage: jest.fn(),
    createPattern: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    closePath: jest.fn(),
    clip: jest.fn(),
  };
};

global.window.HTMLCanvasElement.prototype.getContext = function(contextType) {
  if (contextType === '2d') {
    return createMockContext();
  }
  return null;
};

// Mock SVG for D3.js
class SVGElement extends dom.window.HTMLElement {}
global.SVGElement = SVGElement;

// Store active timeouts for cleanup
const activeTimeouts = new Set();

// Mock requestAnimationFrame for D3.js with proper cleanup
global.requestAnimationFrame = function(callback) {
  const timeoutId = setTimeout(callback, 0);
  activeTimeouts.add(timeoutId);
  return timeoutId;
};

// Mock cancelAnimationFrame for D3.js with proper cleanup
global.cancelAnimationFrame = function(id) {
  activeTimeouts.delete(id);
  clearTimeout(id);
};

// Cleanup function to be called after each test
beforeEach(() => {
  // Reset any mocks
  jest.clearAllMocks();
});

afterEach(() => {
  // Clear all timeouts
  activeTimeouts.forEach(id => {
    clearTimeout(id);
  });
  activeTimeouts.clear();

  // Reset any DOM modifications
  dom.window.document.body.innerHTML = '';

  // Clear any D3 event listeners
  if (global.window.d3) {
    global.window.d3.select('body').selectAll('*').remove();
  }
});

// Cleanup function to be called after all tests
afterAll(() => {
  // Close the JSDOM window
  dom.window.close();
  
  // Clean up canvas resources
  if (global.window && global.window.HTMLCanvasElement) {
    delete global.window.HTMLCanvasElement.prototype.getContext;
  }
  
  // Clean up global namespace
  delete global.window;
  delete global.document;
  delete global.navigator;
  delete global.HTMLElement;
  delete global.Element;
  delete global.getComputedStyle;
  delete global.SVGElement;
  delete global.requestAnimationFrame;
  delete global.cancelAnimationFrame;
});

// Mock Sharp module
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => {
    return {
      resize: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(
        Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64')
      ),
      png: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      webp: jest.fn().mockReturnThis(),
      composite: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      flatten: jest.fn().mockReturnThis(),
      metadata: jest.fn().mockResolvedValue({ width: 100, height: 100 })
    };
  });
});

// Configure Jest to handle ES modules in node_modules
module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!(chai)/)"
  ]
}; 