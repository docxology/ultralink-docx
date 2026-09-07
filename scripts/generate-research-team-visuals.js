/**
 * Research Team visuals generator — thin orchestrator.
 *
 * All visualization logic (vector space, temporal heatmap, impact chart,
 * cluster analysis, network overview) lives in src/research-team/visuals.js.
 */
const { generateVisuals } = require('../src/research-team/visuals');

generateVisuals().catch(console.error);
