# Build the software manuscript

Use a dedicated [Docxology Template](https://github.com/docxology/template)
checkout with Pandoc, pandoc-crossref and XeLaTeX. Run from the
UltraLink checkout:

```bash
template_dir=/absolute/path/to/template
git -C "$template_dir" switch --detach 87704feae0a4490ef7dad9c931d268e8c30273c2
mkdir -p "$template_dir/projects/working"
git worktree add --detach "$template_dir/projects/working/ultralink-docx" HEAD
cd "$template_dir"
uv sync --locked --python 3.14 --no-dev
uv run --no-sync python scripts/pipeline/stage_03_render.py --project working/ultralink-docx
uv run --no-sync python scripts/pipeline/stage_04_validate.py --project working/ultralink-docx
```

The formatted manuscript and validation reports are written to the
registered project's `output/` directory. The executable [graph example](getting-started/quick-start.md)
reproduces the evidence for the results table.
