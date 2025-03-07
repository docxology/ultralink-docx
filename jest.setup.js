// Mock browser environment for D3.js
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

// Mock canvas for Sharp
const { createCanvas } = require('canvas');
global.window.HTMLCanvasElement.prototype.getContext = function() {
  return createCanvas(300, 150).getContext('2d');
};

// Mock SVG for D3.js
class SVGElement extends dom.window.HTMLElement {}
global.SVGElement = SVGElement;

// Mock requestAnimationFrame for D3.js
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame for D3.js
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
}; 