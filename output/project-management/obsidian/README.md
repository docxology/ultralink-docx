# obsidian

Committed example output in the shape of an Obsidian vault: `index.md` plus one note per
entity (`person-1`, `person-2`, `project-a`, `task-1`, `task-2`).

- `index.md` is a wikilink index grouped by entity type, and each note carries the
  entity's fields; this is Markdown, not the app's own storage.
- The Obsidian exporter is `toObsidian` in
  [`../../../src/lib/exporters/obsidian.js`](../../../src/lib/exporters/obsidian.js),
  which the pipeline uses for its knowledge silo. Nothing in `src/` or `scripts/` names
  this particular folder, so read it as a committed example rather than output of a
  script that runs here.
- The sibling folder is [`../html-website-custom/`](../html-website-custom/).
