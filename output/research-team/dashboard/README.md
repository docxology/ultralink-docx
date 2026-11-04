# dashboard

The generated research-team dashboard: `index.html`, its stylesheet `styles.css`, the
browser asset `dashboard.js`, and the network diagram under `assets/`.

- `generateDashboard` in `src/research-team/dashboard.js` writes this directory and
  `assets/`, and copies the browser asset in; regenerate it with the
  `scripts/generate-research-team-dashboard.js` script. The thin-orchestrator rule and
  the script table are in
  [`../../../scripts/AGENTS.md`](../../../scripts/AGENTS.md).
- `dashboard.js` here is byte-identical to `scripts/dashboard.js`; edit that asset and
  regenerate rather than editing the copy.
- The silos beside this folder are listed in [`../README.md`](../README.md).
