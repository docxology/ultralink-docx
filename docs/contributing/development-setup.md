# Development and verification

Use the [installation guide](../getting-started/installation-guide.md)
to prepare a locked checkout. The package's test CLI exposes available
test groups through `npm run test:help`.

The focused data path uses the same lock, with an explicit set of
entity, export, and GraphML suites. It also works with the data-focused
installation that skips native dependency build scripts.

```bash
node node_modules/jest/bin/jest.js --runInBand --ci \
  tests/unit/entity.test.js \
  tests/unit/data-export.test.js \
  tests/format-tests/graphml-export.test.js
```

Use the full graphics environment for visualization and rendering
tests. Keep generated exports separate from the hand-maintained guides.
Use the [manuscript build](../manuscript-build.md) to verify the
software paper PDF and HTML.
