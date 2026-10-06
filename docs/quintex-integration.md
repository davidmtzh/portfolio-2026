# Quintex integration

The Unity web export lives in `public/game/quintex`. `GameTerminal` loads
`QuintexGame` after the existing cartridge and monitor startup sequence.
The iframe uses `/game/quintex/index.html` explicitly so Vite does not return
the portfolio's SPA fallback for the directory URL.

Keep the exported Build and TemplateData files together. The `.unityweb`
files use Unity's decompression fallback; do not add Content-Encoding headers.
Vite copies these files into the production build without bundling them.

The imported HTML contains one portfolio-specific addition: a same-origin
`quintex:pause` message listener. Preserve it when replacing the export.
It pauses gameplay when the arcade leaves view; resuming remains the player's
choice. Ejecting the cartridge unmounts the iframe.

The previous React placeholder remains in `src/components/GamePreview.jsx`
for rollback. No deployment is performed by copying a new export locally.
