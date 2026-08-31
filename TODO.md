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
