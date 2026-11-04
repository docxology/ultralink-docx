# research-team

Six Node modules that build and render the research-team sample: the dataset the
pipeline, dashboard, visuals and tests all read.

- `dataset.js` and `dataset-llm.js` are the data-as-code source (the second adds LLM
  metadata). `tests/fixtures/research-team.js` and `research-team-llm.js` are thin
  re-export shims pointing here, so tests and scripts consume the same data.
- `pipeline.js` runs the export pipeline, `dashboard.js` generates the dashboard,
  `visuals.js` renders the PNG and SVG figures, and `output-validator.js` checks
  generated output. Output locations are repo-root relative:
  `output/research-team/` for artifacts and `logs/research-team/` for the pipeline log.
- The scripts in [`../../scripts/`](../../scripts/) are thin orchestrators over these
  modules; the contract and the script-to-module table are in
  [`../../scripts/AGENTS.md`](../../scripts/AGENTS.md).
- What these modules produce is committed under
  [`../../output/research-team/`](../../output/research-team/).
- [`../../TODO.md`](../../TODO.md) records, in its round 2 (2026-08-31) entry, 13
  failing tests across 11 suites with `research-team-llm-export` named among them; read
  that entry before treating the suite as green.
