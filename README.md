# Mermaid Diagram Editor

Visual-first, fully client-side Mermaid editor (Mermaid **12.0.0**). Sketch flowcharts on a map, then see Mermaid’s real layout (and export that). Non-flowchart samples use a single preview plus Source — no split panes.

**Note:** Mermaid ignores free-form node positions. The sketch map is for building flowcharts easily; use **Flow** (north–south / east–west) to steer Mermaid’s layout.

Live demo: https://jajera.github.io/mermaid-diagram-editor/

## Features

- Sketch map + Mermaid result split for flowcharts only (drag the divider to resize)
- Single preview pane for other diagram types (click labels to edit; Source for full code)
- 36 templates across structure, planning, charts, and railroad (see Load template…)
- Mermaid **12.0.0** (ZenUML not bundled)
- Flow direction: N→S, S→N, W→E, E→W (flowcharts)
- Snap / fit on the sketch map
- Mermaid source drawer (flowchart: Apply to sketch; other types: live code edit)
- Dark / light / auto theme
- Auto-save to `localStorage`
- No backend — static files only

## Quick start

```bash
git clone https://github.com/jajera/mermaid-diagram-editor.git
cd mermaid-diagram-editor
python3 -m http.server 8000
```

Open http://127.0.0.1:8000/

## License

MIT
