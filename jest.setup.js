// Create a simple DOM mock instead of using jsdom
class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.style = {};
    this.attributes = {};
    this.innerHTML = '';
    this.innerText = '';
  }

  appendChild(element) {
    this.children.push(element);
    return element;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  getElementsByTagName(tagName) {
    const result = [];
    if (this.tagName === tagName) {
      result.push(this);
    }
    this.children.forEach(child => {
      if (child.getElementsByTagName) {
        result.push(...child.getElementsByTagName(tagName));
      }
    });
    return result;
  }
}

class MockDocument {
  constructor() {
    this.body = new MockElement('body');
  }

  createElement(tagName) {
    return new MockElement(tagName);
  }

  getElementsByTagName(tagName) {
    return this.body.getElementsByTagName(tagName);
  }
}

class MockWindow {
  constructor() {
    this.document = new MockDocument();
    this.navigator = { userAgent: 'node' };
    this.Element = MockElement;
    this.HTMLElement = MockElement;
  }

  getComputedStyle() {
    return {};
  }
}

// Set up global DOM objects
const mockWindow = new MockWindow();
global.window = mockWindow;
global.document = mockWindow.document;
global.navigator = mockWindow.navigator;
global.HTMLElement = mockWindow.HTMLElement;
global.Element = mockWindow.Element;
global.getComputedStyle = mockWindow.getComputedStyle.bind(mockWindow);

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
        rect: jest.fn(),
        arc: jest.fn(),
        textAlign: 'left',
        font: '10px Arial',
        fillText: jest.fn(),
      };
    }

    toBuffer() {
      // Return a 1x1 transparent PNG as a buffer
      return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
    }

    toDataURL() {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
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
}, { virtual: true }); // Add virtual: true to prevent actual module resolution

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

if (global.window.HTMLCanvasElement) {
  global.window.HTMLCanvasElement.prototype.getContext = function(contextType) {
    if (contextType === '2d') {
      return createMockContext();
    }
    return null;
  };
}

// Mock SVG for D3.js
class SVGElement extends global.HTMLElement {}
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
  global.document.body.innerHTML = '';
});

// Cleanup function to be called after all tests
afterAll(() => {
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

// Mock d3 library
jest.mock('d3', () => {
  return {
    forceSimulation: jest.fn().mockReturnValue({
      nodes: jest.fn().mockReturnThis(),
      force: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      alpha: jest.fn().mockReturnThis(),
      alphaTarget: jest.fn().mockReturnThis(),
      restart: jest.fn(),
      tick: jest.fn(),
      stop: jest.fn()
    }),
    forceManyBody: jest.fn().mockReturnValue(jest.fn()),
    forceCenter: jest.fn().mockReturnValue(jest.fn()),
    forceCollide: jest.fn().mockReturnValue(jest.fn()),
    forceX: jest.fn().mockReturnValue(jest.fn()),
    forceY: jest.fn().mockReturnValue(jest.fn()),
    forceLink: jest.fn().mockReturnValue({
      id: jest.fn().mockReturnThis(),
      distance: jest.fn().mockReturnThis(),
      links: jest.fn().mockReturnThis()
    }),
    select: jest.fn().mockReturnValue({
      append: jest.fn().mockReturnValue({
        attr: jest.fn().mockReturnThis(),
        style: jest.fn().mockReturnThis(),
        append: jest.fn().mockReturnValue({
          attr: jest.fn().mockReturnThis(),
          style: jest.fn().mockReturnThis(),
          text: jest.fn().mockReturnThis()
        }),
        selectAll: jest.fn().mockReturnValue({
          data: jest.fn().mockReturnValue({
            enter: jest.fn().mockReturnValue({
              append: jest.fn().mockReturnValue({
                attr: jest.fn().mockReturnThis(),
                style: jest.fn().mockReturnThis(),
                text: jest.fn().mockReturnThis()
              })
            }),
            exit: jest.fn().mockReturnValue({
              remove: jest.fn()
            }),
            attr: jest.fn().mockReturnThis(),
            style: jest.fn().mockReturnThis()
          })
        })
      }),
      selectAll: jest.fn().mockReturnValue({
        data: jest.fn().mockReturnValue({
          enter: jest.fn().mockReturnValue({
            append: jest.fn().mockReturnValue({
              attr: jest.fn().mockReturnThis(),
              style: jest.fn().mockReturnThis()
            })
          }),
          exit: jest.fn().mockReturnValue({
            remove: jest.fn()
          }),
          attr: jest.fn().mockReturnThis(),
          style: jest.fn().mockReturnThis()
        })
      })
    }),
    drag: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis()
    }),
    zoom: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      transform: jest.fn()
    }),
    zoomIdentity: {
      translate: jest.fn().mockReturnValue({
        scale: jest.fn()
      })
    }
  };
}, { virtual: true });

// Mock cytoscape library
jest.mock('cytoscape', () => {
  return jest.fn().mockImplementation(() => {
    return {
      add: jest.fn(),
      layout: jest.fn().mockReturnValue({
        run: jest.fn()
      }),
      style: jest.fn(),
      on: jest.fn(),
      nodes: jest.fn().mockReturnValue({
        style: jest.fn()
      }),
      edges: jest.fn().mockReturnValue({
        style: jest.fn()
      })
    };
  });
}, { virtual: true });

// Configure Jest to handle ES modules in node_modules
module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!(chai)/)"
  ]
}; 