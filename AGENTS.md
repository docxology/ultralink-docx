# UltraLink (ultralink-docx) — Agent Notes

- Node/JS framework for relational content (entities, links, vector
  embeddings, temporal engine) with many export channels. `README.md` is the
  human entry point; extensive docs under `docs/` (per-subdir READMEs cover
  most areas — see coverage list below).
- Layout: `src/` (`index.js` + `core/{parser,types}.js`), `tests/` +
  `test.js` (jest; `jest.config.js`/`jest.setup.js`), `scripts/`, `examples/`,
  `output/` (generated export trees: systems/*, integration-tests, e2e-tests,
  html-website builds, visualization outputs), `report/`.
- Docs tree `docs/` includes `for-agents/` — read that first when working here.
- Independent public project (`docxology/ultralink-docx`); the parent standard
  it was adapted from is the template workspace's root agent guide.

## Gotchas

- `output/` and `examples/output/` are generated artifacts (many hundreds of
  files); do not document inside them individually and do not hand-edit.
- `src/index.js.bak` is a stale backup — ignore; do not delete (content-only
  edits policy).
- Badges/links in README reference an external `ultralink` GitHub org; treat
  as upstream boilerplate (unverified).

## Verify commands

- `npm install` then `npx jest` (from this directory) — (unverified on this
  machine; no run performed in the doc pass).

## Orientation (2026-08-31)

- Dated current-status + verify commands: [README.md](README.md)
  "Agent Orientation" section (first section after the badges).
- Canonical backlog: [TODO.md](TODO.md) — next actions live there, nowhere else.
- Agent doc hub: [docs/AGENTS.md](docs/AGENTS.md) — link, don't copy.
- Verify (executed 2026-08-31): `npm install` OK; `npx jest --ci --silent` ran
  with failures — see [TODO.md](TODO.md) Major section for the dated outcome.
