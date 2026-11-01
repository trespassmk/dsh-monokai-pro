# AGENTS.md

Monokai Pro theme bundle for the DeepSeek Harness Web GUI. No build step: `client.js` ships as written.

## Keep in sync

- **Palette hexes**: `PALETTES` in `client.js` is the source of truth. `docs/filters.svg` and the hexes in `README.md` are hand-copied from it, so a palette change updates all three.
- **Version**: the README version badge is hardcoded. Bump it together with `version` in `package.json`.

## Packaging

- `docs/` holds README-only assets and stays out of the `files` list in `package.json`, so it never ships in the bundle.
