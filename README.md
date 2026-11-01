# Monokai Pro Theme for DSH

A dark UI/UX theme for the DeepSeek Harness Web GUI, matching
[Monokai Pro](https://monokai.pro/): the warm charcoal canvas, the six-color
accent family, Monokai syntax highlighting, and a sharper, code-first type
stack. The colors are taken from the official Monokai Pro VS Code extension
(2.0.16), not approximated. Everything is delivered as a Cordis bundle with a
Client half, so it survives restarts and applies to the running page.

## What it changes

| Area | Detail |
| --- | --- |
| Filter variants | The six official palettes — **Monokai Pro, Classic, Octagon, Ristretto, Spectrum, Machine** — selectable as swatches in the settings row (dark scheme only, exactly like the real product) |
| Canvas & surfaces | Pro filter: `#2D2A2E` workspace, `#221F22` sidebar/status/title, `#19181A` deepest chrome, `#403E41` widgets, panels, menus and inputs — every filter maps its own `background`/`dark1`/`dark2`/`dimmed5` roles onto these |
| Text | `#FCFCFA` primary, `#C1C0C0` secondary, `#939293` tertiary, `#727072` captions, `#5B595C` dimmed (each filter's own ladder) |
| Accents | Yellow `#FFD866` brand/primary action, pink `#FF6188` errors, orange `#FC9867` warnings, green `#A9DC76` success, cyan `#78DCE8` info/syntax, purple `#AB9DF2` constants (per filter) |
| Code | Monokai Shiki tokens: pink keywords, yellow strings, green functions, purple constants, orange parameters, grey comments |
| Chrome | Sidebar active/hover states with a yellow accent wash, yellow (chrome accent) focus ring, themed scrollbars, toasts, tooltips and diffs |
| Typography | UI stack starts with Avenir Next → Inter → Segoe UI Variable Text; code stack starts with JetBrains Mono → Cascadia Code → Fira Code → SF Mono. A user-chosen font in **Settings → General → Font settings** still wins, because the themed value is `var(--dsh-font-family-text, …)` |
| Light mode | The official Monokai Pro Light counterpart (`#FAF4F2` canvas, `#EDE7E5` sidebar, `#E0DAD9` activity, `#29242A` text, accent hues `#E14775`/`#E16032`/`#CC7A0A`/`#269D69`/`#1C8CA8`/`#7058BE`) so switching Appearance to Light never leaves half-themed surfaces. The real product ships light as one fixed palette — filters apply to dark only — and this plugin does the same |

## Using it

1. Install the bundle (already done for this profile).
2. Reload the Web page once after installing or updating the bundle, so the
   browser loads the current `client.js` generation.
3. Open **Settings → General**. The **Monokai Pro** row sits after Transcript
   view.
4. The switch is on by default on first install, and that first activation also
   sets the appearance preference to **Dark**. Turning the switch off removes
   the token layer immediately and leaves the built-in palette in place.
5. Pick a filter with the swatches under the description: each dot previews the
   variant's canvas (lower-left half) and its pink accent (upper-right half).
   The selection persists per browser.

The switch state is browser-local (`localStorage`, key
`dsh.plugin.monokai-pro.enabled`), as is the filter choice
(`dsh.plugin.monokai-pro.variant`). The theme service persists only the
built-in `light` / `dark` / `system` preference, so a third-party layer cannot
store its own id in the Host settings document; the palette itself always
reapplies on reload.

## How it works

- `client.js` calls `ctx.theme.overrideTokens(packageId, tokens)` — a stacked
  alias-token layer over whatever built-in theme is active. Removing the layer
  restores exactly the tokens it covered; the base palette is never edited.
- `buildTokens(palette)` derives the whole layer from one filter's palette
  object, so adding a variant is adding twelve hex values, not touching the
  token map.
- Every value is supplied as a `{ light, dark }` pair, as the theme service
  requires.
- The row is contributed to the `settings.general.item` slot and uses only
  `--dsw-alias-*` tokens plus `role="switch"` / `aria-checked` /
  `aria-pressed` semantics.
- `index.js` is an empty Host half; the bundle exists so the profile can carry
  the Client row and the plugin stays visible in the plugin inventory.

## Palette reference

The Pro filter below is reverse-engineered from the official Monokai Pro VS
Code extension (`theme-monokai-pro-vscode` 2.0.16, `themes/Monokai Pro.json`
and `Monokai Pro Light.json`, kept in this repo as
`Monokai Pro-reference.json`). The other five filters are transcribed from the
official palettes as mirrored by `monokai-pro.nvim`
(`lua/monokai-pro/palette/*.lua`), whose Pro and Light entries match the
extension JSON value-for-value. Every value used by the token layer traces to
one of these hexes or to an alpha step the reference itself uses — no invented
colors remain in the dark scheme.

| Role | Pro dark | Light |
| --- | --- | --- |
| Background deepest | `#19181A` | `#E0DAD9` (activity) |
| Background deep | `#221F22` | `#EDE7E5` (sidebar/status) |
| Background | `#2D2A2E` | `#FAF4F2` |
| Surface | `#403E41` | `#FEFAF9` |
| Border | `#5B595C` | `#D3CDCC` |
| Focus | `#727072` | `#A59FA0` |
| Text soft | `#C1C0C0` | `#706B6E` |
| Text subtle | `#939293` | `#918C8E` |
| Text dimmed | `#727072` | `#BFB9BA` |
| Foreground | `#FCFCFA` | `#29242A` |
| Pink | `#FF6188` | `#E14775` |
| Orange | `#FC9867` | `#E16032` |
| Yellow | `#FFD866` | `#CC7A0A` |
| Green | `#A9DC76` | `#269D69` |
| Cyan | `#78DCE8` | `#1C8CA8` |
| Purple | `#AB9DF2` | `#7058BE` |

Detail washes follow the reference's own alpha steps rather than round-number
approximations: diff lines and gutters use the accent at `19` alpha, hover and
line-highlight washes `0C`, selections and scrollbar thumbs `26`, the active
scrollbar `59`, and drop targets `deep + BF` (`#221F22BF`).

## Files

```
package.json              bundle manifest, client export, locale and icon exports
cordis.patch.yml          inserts the monokai-pro row
index.js                  empty Host half
client.js                 filter palettes, token layer, settings row, row styles
locale/en.json            plugin inventory metadata (English)
locale/zh.json            plugin inventory metadata (Chinese)
icon.svg                  original mark: Monokai "M" over the six-color palette
Monokai Pro-reference.json  official extension theme JSON used as color reference
```
