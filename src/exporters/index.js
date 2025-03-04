const { SpecializedExporter } = require('./base');
const specialized = require('./specialized');

module.exports = {
  SpecializedExporter,
  ...specialized
}; 