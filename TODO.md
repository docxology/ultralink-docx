# TODO — ultralink-docx agent-ergonomics backlog

Created 2026-08-31 by the agent-ergonomics fleet pass (SHARED_FRAME.md).
Every finding below was verified against disk on 2026-08-31. Mark items
`[x]` as they are completed; do not delete history.

## Minor

- [x] `INDEX.md` "Work In Progress" table still flags `InferAnt_Stream_011.md` as to-develop-or-remove. It is a dated research stream note (2025-07-27); it now has an explicit local-note banner. Keep under review or archive it later.
  - Files: `INDEX.md`, `InferAnt_Stream_011.md`
- [x] `test.js` is a 3-line smoke snippet, not a test. README's Verify block now says so and points to the real suites.
  - Files: `README.md`, `test.js`
- [x] `debug-visualization.png` is 70 bytes (a broken/placeholder binary). Not linked from any entry doc; harmless. Verify before deleting: `grep -rn "debug-visualization" --include="*.md" .`
  - Files: `debug-visualization.png`
- [x] No root backlog file existed; `TODO.md` (this file) is now the canonical backlog.
  - Files: `TODO.md`

## Medium

- [x] Entry doc had no orientation ladder: no current-status answer, no authoritative next-actions pointer. Fixed in `README.md` "Project Status (2026-08-31)" + "For AI Agents" sections.
  - Files: `README.md`
- [x] Duplicated fact-class: root `AGENTS.md` vs `docs/AGENTS.md` vs `docs/for-agents/*` overlap; no single hub. Fixed: `docs/AGENTS.md` now declares the agent doc hub role; `AGENTS.md` points to it.
  - Files: `AGENTS.md`, `docs/AGENTS.md`
- [x] `docs/PROJECT_STATUS.md` made unhedged claims ("all tests passing") with no date or verification command. Added a dated verification-hedged header.
  - Files: `docs/PROJECT_STATUS.md`
- [x] `docs/TESTING.md` has a "Continuous Integration" section but no `.github/workflows/` exists in this repo (stale claim). Header note added; canonical verify command stated.
  - Files: `docs/TESTING.md`
- [x] `jest.config.js` sets `testMatch **/tests/**/*.test.js`, but tracked tests also include non-`.test.js` runnable files at `tests/` root (e.g. `full-blob-export.test.js` matches; `active-inference-lab-export.js` does not). Documented in README Verify block.
  - Files: `README.md`
- [x] ~828 pre-existing untracked files at dispatch (prior doc-fleet AGENTS/README pass + generated `output/`, `tests/output/`, `examples/output/`, `.obsidian/`). Untouched this pass except `TODO.md`, `REVIEW_LOG_2026-08-31.md`, and edited docs. A future pass should consider gitignoring generated output trees.
  - Files: `.gitignore` (future)

## Major

- [x] Verify commands were unverified ("npm install then npx jest — unverified"). Round 1 executed 2026-08-31 with dual Jest config bug: 28 suites failed to run ("beforeEach is not defined"). Round 2 fixed Jest config (setupFiles→setupFilesAfterEnv, removed package.json jest key), re-verified: **11 suites failed, 17 passed** (312 tests: 13 failed, 298 passed, 1 skipped). Exit 1. Details in `REVIEW_LOG_2026-08-31.md`. This is the repo's real gate status.
  - Files: `README.md`, `REVIEW_LOG_2026-08-31.md`, `jest.config.js`, `package.json`
- [ ] Source-code bug fixes are out of scope for this docs pass. The 3 failing tests are deferred to a code pass. How to check: `npx jest tests/unit/exporters/rxinfer.test.js` and `npx jest tests/unit` (visualization tests).
  - Files: `tests/unit/exporters/rxinfer.test.js`, `tests/unit/` (deferred)


## Round 2 (2026-08-31)

- [x] Fixed Jest configuration bugs that made the entire test suite unrunnable: (1) duplicate config (jest.config.js + package.json jest key) caused "Multiple configurations found" failure; (2) jest.config.js used setupFiles instead of setupFilesAfterEnv, causing "beforeEach is not defined" in every suite. After fixes: gate becomes runnable (11 failed, 17 passed, 312 tests total, exit 1).
  - Files: `jest.config.js`, `package.json`
- [ ] Source-code test failures remain out of scope for this docs pass. 13 failing tests across 11 suites persist after config fixes (primarily rxinfer, research-team-llm-export, graphml-export, full-blob-export). How to check: `npx jest --ci --silent` (now works without config errors).
  - Files: test source files (deferred to code pass)

## Workflowz review — 2026-11-10

Reviewed against base `85af3994`. Bounded packet (18 source excerpts of 105 candidates); findings below cite only lines visible in this pass. Mocks/fallbacks in `jest.setup.js`, `tests/**` `jest.mock(...)` calls, and `examples/render-examples.js` `generatePlaceholderD3` are intentional test/example scaffolding and are not flagged. `.bak` files (`src/index.js.bak`, `examples/render-examples.js.bak`) are declared stale archives per `AGENTS.md` line 19 — leave alone.

### P1 — Production `toVisualization` swallows real errors and returns a "fallback" artifact indistinguishable from success

- [ ] **WL-2026-11-10-01** (P1) `src/lib/exporters/visualization.js:188-193` — the `default:` branch and the `catch (error)` branch both `console.warn/error` and then `return generateFallbackVisualization(...)`. The returned object's shape is identical to the success path (e.g. `{ 'graph-d3.html': d3Html }` at line 183 vs. the fallback return), so a caller doing `const out = await ul.toVisualization({ format: 'd3' })` cannot distinguish "rendered" from "D3 threw and we handed you a placeholder". `visualization-report.js:69-74` has to grep the HTML for the literal string `'Visualization Generation Failed'` to detect the fallback, which is the tell that the API contract is lossy.
  - Files: `src/lib/exporters/visualization.js`, `visualization-report.js`
  - Outcome: `toVisualization` either (a) throws / rejects on unsupported format and on generator error, or (b) returns a discriminated result (e.g. `{ fallback: true, reason, files }`). `visualization-report.js` stops relying on substring-matching generated HTML.
  - Acceptance probe (from repo root): `node -e "const {UltraLink}=require('./src'); const ul=new UltraLink(); ul.toVisualization({format:'no-such-format'}).then(r=>{ console.log(JSON.stringify(Object.keys(r)), r.fallback); }).catch(e=>{ console.log('threw:', e.message); })"` — must either print `threw: …` or print `… true`; must not silently return a normal-looking `{ 'graph-no-such-format.html': … }` with `fallback === undefined`.
  - Depends on: WL-2026-11-10-03 (shared helper signature). Constraint: `src/lib/exporters/visualization-helpers.js:714-729` documents the fallback as a deliberate "safety net"; preserve the helper, change only how the exporter signals fallback to its caller.

### P1 — `generateDot` does not escape GraphViz-special characters in entity ids, types, or link types

- [ ] **WL-2026-11-10-02** (P1) `src/research-team/pipeline.js:81-88` — ids and types are interpolated raw into a DOT string: `` `"${e.id}" [label="${e.id}\\n(${e.type})"];` `` and `` `"${sourceId}" -> "${link.target}" [label="${link.type}"];` ``. An entity id or relationship type containing `"`, `\`, or a newline produces malformed DOT, and `runPipeline` writes it unconditionally to `output/research-team/graph/research-team.dot` (lines 130-134). The sibling HTML template at lines 55-72 likewise interpolates `entity.id` / `entity.type` into HTML unescaped, so `<` in an id breaks the generated page.
  - Files: `src/research-team/pipeline.js`
  - Outcome: a small `escapeDot(s)` (handles `\\`, `"`, newlines) is applied to every interpolated value in `generateDot`, and an `escapeHtml(s)` is applied to `entity.id` / `entity.type` in `generateHtml`.
  - Acceptance probe (from repo root): `node -e "const {UltraLink}=require('./src'); const ul=new UltraLink(); ul.addEntity('a\"b','t<1>',{}); ul.addEntity('c','t',{}); ul.addLink('a\"b','c','r\"s',{}); const {runPipeline}=require('./src/research-team/pipeline');" ` then a focused unit check that `generateDot`/`generateHtml` output round-trips: the emitted `.dot` parses under `dot -Tcanon` (if graphviz installed) and the emitted HTML does not contain a raw `<1>` element. Minimal check: `node -e "const p=require('./src/research-team/pipeline'); /* re-export generateDot for the probe */"` and assert no unescaped `"` appears inside a quoted label.
  - Constraint: `generateDot` / `generateHtml` are currently module-private; export them (or extract into a small module) so the probe can call them directly instead of running the whole pipeline.

### P2 — `toBayesianNetwork` / network builder emits a hard-coded placeholder CPT of `{true: 0.5, false: 0.5}` presented as real parameters

- [ ] **WL-2026-11-10-03** (P2) `src/lib/visualizers.js:1338-1343` — under `if (includeParameters) { network.nodes[nodeId].cpt = { 'true': 0.5, 'false': 0.5 }; }` with the comment `// Generate placeholder CPT if parameters requested`. The consumer asked for parameters and receives a fabricated uniform prior with no marker that it is synthetic; downstream Bayesian exporters (`src/lib/exporters/bayesian-network.js`, `rxinfer.js`) will serialize this as if it were a learned CPT. The same file at lines 325-329 silently substitutes `Math.random()` positions when an entity has no layout position, and lines 334-338 silently degrade force layout to grid — these are acceptable render fallbacks but the CPT case is data, not layout.
  - Files: `src/lib/visualizers.js`, `src/lib/exporters/bayesian-network.js`
  - Outcome: when `includeParameters` is requested and no real CPT is known, the node carries `cpt: null` plus `cptSynthetic: true` (or the field is omitted entirely) so exporters can refuse or annotate, rather than emitting `0.5/0.5` as if observed.
  - Acceptance probe (from repo root): `node -e "const v=require('./src/lib/visualizers'); /* build the network for a 2-node graph with includeParameters:true and assert node.cpt is null or node.cptSynthetic===true, and that JSON.stringify(node) no longer contains '\\\"true\\\":0.5' unless source data supplied it */"` — must not emit a bare `{true:0.5,false:0.5}` CPT for an entity whose attributes carry no probability data.
  - Depends on: none. Constraint: layout-only fallbacks at lines 325-338 are fine and must be left as-is; this item is scoped strictly to the placeholder CPT.

### P2 — `tests/system/placeholder.test.js` is an always-green suite that masks an empty system-test directory

- [ ] **WL-2026-11-10-04** (P2) `tests/system/placeholder.test.js:1-13` — the file's own header says it "exists to ensure the system tests suite doesn't fail due to missing tests", and the only assertion is `expect(true).toBe(true)`. With `jest.config.js` matching `**/tests/**/*.test.js`, this suite is picked up by the gate and increments the pass count while testing nothing, diluting the signal that TODO.md's Major section (lines 35-46, "11 suites failed, 17 passed") is tracking.
  - Files: `tests/system/placeholder.test.js`, `jest.config.js`, `TODO.md`
  - Outcome: either delete the placeholder (and let Jest's own "no tests found" handling apply only if the directory is genuinely empty), or replace the body with a skipped-todo (`test.todo`) so it is reported as pending rather than passing.
  - Acceptance probe (from repo root): `npx jest tests/system --ci` — the run summary must report `0 passed, 1 todo` (or the suite no longer appears); it must not report a passed `should pass as a placeholder` test.
  - Constraint: this is a harness-honesty fix, not a "write real system tests" task; writing new system tests is explicitly out of scope here.

### P3 — `tests/format-tests/system-specific-rendering.test.js` re-implements `generatePlaceholderBIF` / `generatePlaceholderCompressedBlob` by copy instead of importing them

- [ ] **WL-2026-11-10-05** (P3) `tests/format-tests/system-specific-rendering.test.js:25-26` states "Copy of the functions from render-examples.js for testing purposes", and lines 26-143 paste `generatePlaceholderBIF` (including the `systemSpecificConfig` table) and lines 145-150 paste `generatePlaceholderCompressedBlob`. The originals live in `examples/render-examples.js`. The test therefore asserts properties of a private clone — if the real renderer in `examples/render-examples.js` changes, this test still passes and the suite-specific configurations drift apart silently.
  - Files: `tests/format-tests/system-specific-rendering.test.js`, `examples/render-examples.js`
  - Outcome: `examples/render-examples.js` exports `generatePlaceholderBIF` and `generatePlaceholderCompressedBlob` (module.exports alongside its CLI behaviour), and the test requires them instead of redefining them.
  - Acceptance probe (from repo root): `node -e "const r=require('./examples/render-examples.js'); console.log(typeof r.generatePlaceholderBIF, typeof r.generatePlaceholderCompressedBlob)"` prints `function function`; then `npx jest tests/format-tests/system-specific-rendering.test.js --ci` runs against the imported functions and the duplicated bodies are gone from the test file.
  - Constraint: keep the CLI behaviour of `examples/render-examples.js` intact when adding exports (guard the script entry with `require.main === module` if it currently executes on require).
