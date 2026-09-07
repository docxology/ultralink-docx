# scripts

Thin orchestrator scripts for UltraLink. Testable logic lives in `src/`
(research-team modules under `src/research-team/`, exporter logic under
`src/lib/`); scripts only bootstrap paths, set up logging, and make a single
delegated call into a `src/` entrypoint.

Part of the local-only `projects/ongoing/` tree (never committed).

## Inventory

| Script | Purpose | Delegates to | Command |
|--------|---------|--------------|---------|
| `run-research-team-pipeline.js` | Runs the full research-team export pipeline: raw (JSON/CSV), graph (GraphML/DOT), documents (HTML), knowledge base (Obsidian), temporal (timeline JSON/HTML), plus a `generate-visuals.sh` helper | `src/research-team/pipeline.js` (which loads `src/research-team/dataset-llm.js`) | `node scripts/run-research-team-pipeline.js` |
| `generate-research-team-dashboard.js` | Generates the interactive research-team HTML dashboard (index.html, styles.css, client asset, GraphML asset) | `src/research-team/dashboard.js` + `src/research-team/dataset-llm.js` | `node scripts/generate-research-team-dashboard.js` |
| `generate-research-team-visuals.js` | Renders PNG/SVG visualizations (vector space, temporal heatmap, impact chart, cluster analysis, network overview) from the pipeline's JSON/DOT outputs; requires Graphviz `dot` on PATH | `src/research-team/visuals.js` | `node scripts/generate-research-team-visuals.js` (after the pipeline) |
| `validate-renderers.js` | Runs the dashboard renderer, validates its outputs (HTML/JSON/GraphML/CSV/Obsidian/timeline), and writes JSON + HTML validation reports | `src/research-team/dashboard.js`, `src/research-team/output-validator.js`, `src/research-team/dataset-llm.js` | `node scripts/validate-renderers.js` (after the pipeline) |
| `generate-system-visualizations.js` | Generates templated PNG visualizations for each known system type and dimension variant | `src/lib/exporters/system-template-visualizer.js` | `node scripts/generate-system-visualizations.js` (`--help` for options) |
| `dashboard.js` | Not a Node CLI script: client-side browser asset copied into the generated dashboard output and loaded by `index.html` | — (consumed by `generate-research-team-dashboard.js` via `src/research-team/dashboard.js`) | opened by the generated `output/research-team/dashboard/index.html` |

## Outputs

- `output/research-team/` — pipeline silos (`raw/`, `graph/`, `docs/`,
  `knowledge/`, `visuals/`, `temporal/`), `dashboard/`, and
  `generate-visuals.sh`
- `output/system-visualizations/` — system-template PNG variants
- `logs/research-team/pipeline.log` — timestamped pipeline log
- `reports/validation/` — validator JSON + HTML reports

## Typical run order

```bash
node scripts/run-research-team-pipeline.js        # produces raw/graph/docs/knowledge/temporal
node scripts/generate-research-team-dashboard.js  # produces dashboard/
node scripts/generate-research-team-visuals.js    # consumes raw/ + graph/ outputs
node scripts/validate-renderers.js                # validates dashboard + pipeline outputs
```
