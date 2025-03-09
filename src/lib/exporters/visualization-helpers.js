/**
 * Visualization Helper Utilities
 * 
 * This module provides enhanced visualization functionality for UltraLink,
 * focusing on improving the PNG generation capabilities and fixing
 * common visualization issues.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Enhanced PNG generation from SVG
 * This function provides improved handling of SVG to PNG conversion
 * 
 * @param {string} svgString - SVG content to convert
 * @param {Object} options - Conversion options
 * @param {number} options.width - Width of the output PNG (defaults to source SVG width)
 * @param {number} options.height - Height of the output PNG (defaults to source SVG height)
 * @param {number} options.density - Pixel density for conversion (higher values = sharper images)
 * @param {string} options.style - Visual style to apply ('default', 'colorful', 'grayscale', 'minimal')
 * @returns {Promise<Buffer>} Promise resolving to PNG buffer
 */
async function enhancedSVGtoPNG(svgString, options = {}) {
  try {
    // Extract/parse width and height from SVG if not provided in options
    const width = options.width || extractDimensionFromSVG(svgString, 'width') || 800;
    const height = options.height || extractDimensionFromSVG(svgString, 'height') || 600;
    const density = options.density || 300; // Higher density for sharper images
    
    // Apply style modifications to SVG if requested
    let styledSvg = svgString;
    if (options.style) {
      styledSvg = applyStylingToSVG(svgString, options.style);
    }
    
    // Clean up SVG - ensure it has proper XML declaration and namespace
    const cleanSvg = ensureValidSVG(styledSvg);
    
    // Use Sharp to convert SVG to PNG with high quality settings
    const pngBuffer = await sharp(Buffer.from(cleanSvg))
      .resize({
        width: width,
        height: height,
        fit: 'contain'
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        quality: 100
      })
      .withMetadata({
        density: density
      })
      .toBuffer();
    
    return pngBuffer;
  } catch (error) {
    console.error('Error in enhancedSVGtoPNG:', error);
    // Return a proper fallback PNG
    return createFallbackPNG(options.width || 800, options.height || 600, 
      options.message || 'UltraLink Visualization');
  }
}

/**
 * Apply styling to SVG based on the requested style
 * 
 * @param {string} svgString - Original SVG content
 * @param {string} style - Style to apply ('default', 'colorful', 'grayscale', 'minimal')
 * @returns {string} Styled SVG content
 */
function applyStylingToSVG(svgString, style) {
  try {
    // Default styling (do nothing)
    if (!style || style === 'default') {
      return svgString;
    }
    
    // Create style element if it doesn't exist
    let styleTag = '';
    const hasStyleTag = svgString.includes('<style');
    
    // Different styling options
    switch (style.toLowerCase()) {
      case 'colorful':
        styleTag = `
          <style>
            .node circle { fill: #6baed6; stroke: #3182bd; stroke-width: 1.5px; }
            .node text { font-family: Arial; font-size: 10px; fill: #333; }
            .node.type-person circle { fill: #fc9272; stroke: #de2d26; }
            .node.type-concept circle { fill: #a1d99b; stroke: #31a354; }
            .node.type-event circle { fill: #bcbddc; stroke: #756bb1; }
            .node.type-document circle { fill: #fdae6b; stroke: #e6550d; }
            .node.type-organization circle { fill: #9ecae1; stroke: #3182bd; }
            .node.type-location circle { fill: #e7cb94; stroke: #e6550d; }
            .node.type-model circle { fill: #c7e9c0; stroke: #41ab5d; }
            .node.type-matrix circle { fill: #fa9fb5; stroke: #c51b8a; }
            .node.type-space circle { fill: #bdbdbd; stroke: #636363; }
            .link { stroke: #999; stroke-opacity: 0.6; stroke-width: 1.5px; }
            .link.type-includes { stroke: #fd8d3c; stroke-width: 2px; }
            .link.type-uses { stroke: #6baed6; }
            .link.type-maps_from, .link.type-maps_to { stroke: #3182bd; stroke-dasharray: 3,3; }
            .link.type-evaluates { stroke: #e6550d; stroke-width: 2px; }
          </style>
        `;
        break;
        
      case 'grayscale':
        styleTag = `
          <style>
            .node circle { fill: #d9d9d9; stroke: #525252; stroke-width: 1.5px; }
            .node text { font-family: Arial; font-size: 10px; fill: #252525; }
            .node.type-person circle { fill: #bdbdbd; stroke: #636363; }
            .node.type-concept circle { fill: #969696; stroke: #525252; }
            .node.type-event circle { fill: #737373; stroke: #252525; }
            .node.type-document circle { fill: #d9d9d9; stroke: #969696; }
            .node.type-model circle { fill: #f0f0f0; stroke: #bdbdbd; }
            .link { stroke: #bdbdbd; stroke-opacity: 0.4; }
          </style>
        `;
        break;
        
      case 'minimal':
        styleTag = `
          <style>
            svg { background-color: #ffffff; }
            .node circle { fill: #f7f7f7; stroke: #999; stroke-width: 1px; }
            .node text { font-family: Arial; font-size: 8px; fill: #333; }
            .link { stroke: #e0e0e0; stroke-width: 0.5px; }
          </style>
        `;
        break;
        
      default:
        return svgString;
    }
    
    // Insert style tag into SVG
    if (hasStyleTag) {
      // Replace existing style tag
      return svgString.replace(/<style[^>]*>([\s\S]*?)<\/style>/, styleTag);
    } else {
      // Add style tag after svg opening tag
      return svgString.replace(/<svg([^>]*)>/, `<svg$1>${styleTag}`);
    }
  } catch (error) {
    console.error('Error applying styling to SVG:', error);
    return svgString; // Return original SVG if styling fails
  }
}

/**
 * Create a proper fallback PNG with text
 * 
 * @param {number} width - Width of the PNG
 * @param {number} height - Height of the PNG
 * @param {string} message - Text to display in the PNG
 * @returns {Promise<Buffer>} Promise resolving to PNG buffer
 */
async function createFallbackPNG(width = 800, height = 600, message = 'Fallback Visualization') {
  try {
    // Create a simple SVG with the message
    const fallbackSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">
        ${message}
      </text>
    </svg>`;
    
    // Convert to PNG
    const pngBuffer = await sharp(Buffer.from(fallbackSvg))
      .png({
        compressionLevel: 9,
        quality: 90
      })
      .toBuffer();
    
    return pngBuffer;
  } catch (error) {
    console.error('Error creating fallback PNG:', error);
    // If all else fails, return a 1x1 transparent PNG
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
  }
}

/**
 * Extract dimension value from SVG string
 * 
 * @param {string} svgString - SVG content
 * @param {string} dimension - Dimension to extract ('width' or 'height')
 * @returns {number|null} Extracted dimension or null if not found
 */
function extractDimensionFromSVG(svgString, dimension) {
  try {
    const regex = new RegExp(`${dimension}="([^"]+)"`, 'i');
    const match = svgString.match(regex);
    
    if (match && match[1]) {
      // Handle dimensions with units (px, em, etc.)
      const value = match[1].trim();
      const numericValue = parseFloat(value);
      
      if (!isNaN(numericValue)) {
        return numericValue;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting ${dimension} from SVG:`, error);
    return null;
  }
}

/**
 * Ensure the SVG has proper XML declaration and namespace
 * 
 * @param {string} svgString - SVG content
 * @returns {string} Properly formatted SVG
 */
function ensureValidSVG(svgString) {
  // Make sure we have a string
  if (typeof svgString !== 'string') {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"></svg>';
  }
  
  // Check if XML declaration is present, add if not
  if (!svgString.includes('<?xml')) {
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + svgString;
  }
  
  // Ensure SVG has xmlns attribute
  if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  return svgString;
}

module.exports = {
  enhancedSVGtoPNG,
  createFallbackPNG,
  extractDimensionFromSVG,
  ensureValidSVG,
  applyStylingToSVG
}; 