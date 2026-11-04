# validation

Renderer validation reports. The
[`../../scripts/validate-renderers.js`](../../scripts/validate-renderers.js) script
writes one JSON and one HTML file per run, named `validation-<epoch milliseconds>`, so
this folder collects one pair per run and nothing prunes it.

- The pair committed here is the run of 2026-09-07 09:17:40 UTC:
  `validation-1788772660722.json` and `validation-1788772660723.html`.
- Read the report rather than the file name. That report records
  `renderers.html.success: true` while its own `summary` counts 6 tests, 0 passed and 6
  failed, with messages such as "Should include LLM insights" and "Entities should be an
  array". The two fields disagree; the per-test results are what the run observed.
- It validates the dashboard renderer against generated output under
  [`../../output/research-team/`](../../output/research-team/). To reproduce, run the
  pipeline and the dashboard first and then the validator; the order matters and is
  stated in [`../../scripts/AGENTS.md`](../../scripts/AGENTS.md).
- This repository carries no CI configuration and no test reads this folder, so a report
  is a record of one run rather than a gate.
