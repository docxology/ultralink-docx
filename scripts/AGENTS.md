# AGENTS.md — `ultralink-docx/scripts`

- Parent standard: [`../AGENTS.md`](../AGENTS.md).

## Thin-orchestrator contract

Scripts are orchestration ONLY: path bootstrap, logging, and a single
delegated call into a `src/` entrypoint.

- Business/data/plot/analysis logic lives in `src/` (importable + tested):
  research-team modules in `src/research-team/`, exporter logic in
  `src/lib/exporters/`.
- Scripts consume `src/` (or `data/`), never `tests/fixtures` or
  `tests/runners`. Shared data-as-code datasets live in
  `src/research-team/dataset*.js`; `tests/fixtures/research-team*.js` are
  re-export shims pointing at them.
- Scripts do not require other scripts: shared renderer logic is promoted to
  `src/research-team/` and both call it.

## Script inventory

| Script | Pattern | Delegates to | Output |
|--------|---------|--------------|--------|
| `run-research-team-pipeline.js` | Thin orchestrator | `src/research-team/pipeline.js` | `output/research-team/` silos + `generate-visuals.sh`, `logs/research-team/pipeline.log` |
| `generate-research-team-dashboard.js` | Thin orchestrator | `src/research-team/dashboard.js`, `src/research-team/dataset-llm.js` | `output/research-team/dashboard/` |
| `generate-research-team-visuals.js` | Thin orchestrator | `src/research-team/visuals.js` | `output/research-team/visuals/*.png|svg` |
| `validate-renderers.js` | Thin orchestrator | `src/research-team/dashboard.js`, `src/research-team/output-validator.js`, `src/research-team/dataset-llm.js` | `reports/validation/*.{json,html}` |
| `generate-system-visualizations.js` | Thin orchestrator | `src/lib/exporters/system-template-visualizer.js` | `output/system-visualizations/*.png` |
| `dashboard.js` | Client-side browser asset (not a CLI script) | consumed via `src/research-team/dashboard.js` copy | loaded by `output/research-team/dashboard/index.html` |

## Gotchas

- When adding logic to a script, put it in `src/research-team/` (or the
  relevant `src/` module) and keep the script a one-call orchestrator.
- `generate-research-team-visuals.js` needs Graphviz `dot` on PATH and
  consumes pipeline outputs — run the pipeline first.
- `validate-renderers.js` validates pipeline outputs plus the dashboard — run
  the pipeline (and dashboard) first.
