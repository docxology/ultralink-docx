/**
 * Research Team pipeline — thin orchestrator.
 *
 * All pipeline logic (dataset creation, exports, HTML/DOT templates,
 * timestamped logging) lives in src/research-team/pipeline.js.
 */
const { runPipeline } = require('../src/research-team/pipeline');

runPipeline().catch(error => {
  console.error(`Fatal error in pipeline: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
