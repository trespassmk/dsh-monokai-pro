window.__ModuleLoader__.load({
  id: 'dsh-monokai-pro',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Package id; also names the theme override layer for inspection. */
    const PACKAGE = 'dsh-monokai-pro';
    /** Locale namespace owning the settings-row copy. */
    const NS = 'monokai-pro';
    /** Browser-local switch state; the theme service cannot persist third-party ids. */
    const STORAGE_KEY = 'dsh.plugin.monokai-pro.enabled';
    /** Browser-local filter variant, following the official Monokai Pro filters. */
    const VARIANT_KEY = 'dsh.plugin.monokai-pro.variant';
    /** Style tag identity, so reloading the plugin cannot duplicate its sheet. */
    const STYLE_ID = PACKAGE + '/settings.css';

    /**
     * Official Monokai Pro filter palettes (dark), transcribed from
     * monokai-pro.nvim's `palette/{pro,classic,octagon,machine,ristretto,
     * spectrum}.lua`, which mirror the official VS Code extension
     * (theme-monokai-pro-vscode). The Pro palette was verified value-for-value
     * against the extension JSON kept in this repo
     * (`Monokai Pro-reference.json` 2.0.16): background/dark1/dark2/text,
     * dimmed1-5 and the six accents all match exactly.
     *
     * Role map used below: canvas = `background`, sidebar/status = `dark1`,
     * deepest chrome = `dark2`, panels/widgets = `dimmed5`, controls =
     * `dimmed4`, captions/progress = `dimmed3`, tertiary = `dimmed2`,
     * secondary = `dimmed1`, primary text = `text`, accents 1-6 = pink,
     * orange, yellow, green, cyan, purple.
     */
    const PALETTES = {
      pro: {
        label: 'Monokai Pro',
        canvas: '#2d2a2e', deep: '#221f22', deepest: '#19181a',
        text: '#fcfcfa', soft: '#c1c0c0', subtle: '#939293',
        muted: '#727072', border: '#5b595c', panel: '#403e41',
        pink: '#ff6188', orange: '#fc9867', yellow: '#ffd866',
        green: '#a9dc76', cyan: '#78dce8', purple: '#ab9df2',
      },
      classic: {
        label: 'Monokai Classic',
        canvas: '#272822', deep: '#1d1e19', deepest: '#161613',
        text: '#fdfff1', soft: '#c0c1b5', subtle: '#919288',
        muted: '#6e7066', border: '#57584f', panel: '#3b3c35',
        pink: '#f92672', orange: '#fd971f', yellow: '#e6db74',
        green: '#a6e22e', cyan: '#66d9ef', purple: '#ae81ff',
      },
      octagon: {
        label: 'Filter Octagon',
        canvas: '#282a3a', deep: '#1e1f2b', deepest: '#161821',
        text: '#eaf2f1', soft: '#b2b9bd', subtle: '#888d94',
        muted: '#696d77', border: '#535763', panel: '#3a3d4b',
        pink: '#ff657a', orange: '#ff9b5e', yellow: '#ffd76d',
        green: '#bad761', cyan: '#9cd1bb', purple: '#c39ac9',
      },
      ristretto: {
        label: 'Filter Ristretto',
        canvas: '#2c2525', deep: '#211c1c', deepest: '#191515',
        text: '#fff1f3', soft: '#c3b7b8', subtle: '#948a8b',
        muted: '#72696a', border: '#5b5353', panel: '#403838',
        pink: '#fd6883', orange: '#f38d70', yellow: '#f9cc6c',
        green: '#adda78', cyan: '#85dacc', purple: '#a8a9eb',
      },
      spectrum: {
        label: 'Filter Spectrum',
        canvas: '#222222', deep: '#191919', deepest: '#131313',
        text: '#f7f1ff', soft: '#bab6c0', subtle: '#8b888f',
        muted: '#69676c', border: '#525053', panel: '#363537',
        pink: '#fc618d', orange: '#fd9353', yellow: '#fce566',
        green: '#7bd88f', cyan: '#5ad4e6', purple: '#948ae3',
      },
      machine: {
        label: 'Filter Machine',
        canvas: '#273136', deep: '#1d2528', deepest: '#161b1e',
        text: '#f2fffc', soft: '#b8c4c3', subtle: '#8b9798',
        muted: '#6b7678', border: '#545f62', panel: '#3a4449',
        pink: '#ff6d7e', orange: '#ffb270', yellow: '#ffed72',
        green: '#a2e57b', cyan: '#7cd5f1', purple: '#baa0f8',
      },
    };
    const VARIANT_IDS = Object.keys(PALETTES);
    const DEFAULT_VARIANT = 'pro';

    /**
     * The official Monokai Pro Light counterpart (extension JSON
     * "Monokai Pro Light.json", 2.0.16). The real product ships light as one
     * fixed palette — filters apply to dark only — so light never varies.
     */
    const LIGHT = {
      canvas: '#FAF4F2',      // editor canvas, input/menu background
      panel: '#FEFAF9',       // widgets, menus, panels, dropdowns
      sidebar: '#EDE7E5',     // sidebar, status bar, title bar
      activity: '#E0DAD9',    // activity bar, buttons
      border: '#D3CDCC',      // inputs, dropdowns, badges
      focus: '#A59FA0',       // focus borders, progress, comments
      soft: '#706B6E',        // secondary text, line-number active
      subtle: '#918C8E',      // tertiary text, icons, descriptions
      caption: '#BFB9BA',     // line numbers, dimmed
      text: '#29242A',        // primary text
      pink: '#E14775', orange: '#E16032', yellow: '#CC7A0A',
      green: '#269D69', cyan: '#1C8CA8', purple: '#7058BE',
    };

    /** One token value per color scheme, as the theme service requires. */
    const pair = (light, dark) => ({ light, dark });

    /**
     * Slightly darker chrome accent than the pure syntax yellow. Send buttons,
     * brand fills, focus rings and links sit on solid UI surfaces; the pure
     * `#ffd866` reads a bit loud there, so chrome darkens each filter's yellow
     * toward the canvas (~18%) while syntax tokens keep the pure accent.
     * Pro: `#ffd866` → `#e6c45f`.
     */
    function chromeAccent(p) {
      return 'color-mix(in srgb, ' + p.yellow + ' 82%, ' + p.canvas + ')';
    }

    /**
     * Alias-token layer for the selected Monokai Pro filter. Names come from
     * `@deepseek-ai/dsh-client-ui-theme`'s design-platform sheet; the layer
     * only overrides values, so any token added upstream keeps its built-in
     * default. Dark-side detail washes follow the reference JSON's own alpha
     * steps (`19` diff lines, `0c` hovers/line highlights, `26` selections and
     * scrollbars, `59` active scrollbar, `bf` drop targets) instead of
     * approximations, so nothing renders darker than the official theme.
     */
    function buildTokens(p) {
      const accent = chromeAccent(p);
      return {
        // Canvas and raised surfaces.
        '--dsw-alias-bg-base': pair(LIGHT.canvas, p.canvas),
        '--dsw-alias-bg-layer-1': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-layer-2': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-layer-3': pair(LIGHT.sidebar, p.panel),
        '--dsw-alias-bg-layer-4': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-l1': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-l2': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-overlay': pair(LIGHT.panel, p.panel),
        '--dsw-alias-bg-module-platform': pair(LIGHT.activity, p.panel),
        '--dsw-alias-bg-multi-select': pair(LIGHT.activity, p.panel),
        '--dsw-alias-bg-document-preview': pair(LIGHT.sidebar, p.deep),
        '--dsw-alias-label-document-preview': pair(LIGHT.subtle, p.soft),
        '--dsw-alias-bg-document-selection': pair(
          'color-mix(in srgb, ' + LIGHT.pink + ' 22%, transparent)',
          p.soft + '26',
        ),
        '--dsw-alias-bg-mask-drop': pair(LIGHT.activity + 'BF', p.deep + 'BF'),
        '--dsw-alias-bg-skeleton': pair(LIGHT.text + '0A', p.text + '0C'),

        // Strokes. The dark ladder scales with each filter's text color;
        // on the Pro canvas these blend to the reference's own values
        // (e.g. `0F` over #2d2a2e ≈ the reference `surface.border` #343235).
        '--dsw-alias-border-inverted': pair('#00000000', '#FFFFFF0F'),
        '--dsw-alias-border-inverted2': pair('#00000000', '#FFFFFF14'),
        '--dsw-alias-border-l1': pair(LIGHT.border + '4D', p.text + '0F'),
        '--dsw-alias-border-l2': pair(LIGHT.border, p.text + '1F'),
        '--dsw-alias-border-l2-darkmode-thin': pair(LIGHT.border + '80', p.text + '0F'),
        '--dsw-alias-border-l3': pair(LIGHT.focus, p.text + '29'),
        '--dsw-alias-border-l4': pair(LIGHT.focus + '80', p.text + '33'),

        // Brand and buttons — chrome uses the slightly darker accent so solid
        // fills (send button, brand badges) don't read as loud as syntax yellow.
        '--dsw-alias-brand-primary': pair(LIGHT.text, accent),
        '--dsw-alias-brand-primary-invert': pair(LIGHT.canvas, p.canvas),
        '--dsw-alias-brand-primary-new-colorprimary-new-color': pair(LIGHT.pink, accent),
        '--dsw-alias-brand-text': pair(LIGHT.text, accent),
        '--dsw-alias-button-contrast-fill': pair(LIGHT.text, p.text),
        '--dsw-alias-button-elevated-fill': pair(LIGHT.panel, p.panel),
        '--dsw-alias-button-floating-fill': pair(LIGHT.panel, p.panel),
        '--dsw-alias-button-floating-hover': pair(LIGHT.activity, p.panel),
        '--dsw-alias-button-ghost-active-border': pair(LIGHT.focus, p.muted),
        '--dsw-alias-button-ghost-active-fill': pair(LIGHT.activity, p.panel),
        '--dsw-alias-button-ghost-active-hover': pair(LIGHT.sidebar, p.panel),
        '--dsw-alias-button-info-fill': pair(LIGHT.yellow, accent),
        '--dsw-alias-button-info-hover': pair(LIGHT.yellow + 'CC', accent),
        '--dsw-alias-button-primary-dimmed': pair(LIGHT.activity, p.panel),
        '--dsw-alias-button-primary-hover': pair(LIGHT.pink + '1F', accent),

        // Toolbar buttons: the built-in sheet hardcodes neutral greys here;
        // Monokai uses its control/panel colors for these floating tools.
        '--dsw-alias-button-tool-bar-fill': pair(LIGHT.activity + '80', p.border + '80'),
        '--dsw-alias-button-tool-bar-hover': pair(LIGHT.activity + '99', p.border + '99'),
        '--dsw-alias-button-tool-bar-fill-invisible': pair(LIGHT.activity + '5C', p.deepest + '5C'),

        // Interaction washes (reference alpha steps: hover `0c`, active `26`).
        '--dsw-alias-interactive-bg-hover': pair(LIGHT.text + '0F', p.text + '0C'),
        '--dsw-alias-interactive-bg-hover-accent': pair(LIGHT.text + '14', 'color-mix(in srgb, ' + accent + ' 14%, transparent)'),
        '--dsw-alias-interactive-bg-hover-danger': pair(LIGHT.pink + '0D', p.pink + '26'),
        '--dsw-alias-interactive-bg-hover-solid': pair(LIGHT.activity, p.panel),
        '--dsw-alias-interactive-bg-active': pair(LIGHT.text + '24', p.text + '26'),

        // Type.
        '--dsw-alias-label-primary': pair(LIGHT.text, p.text),
        '--dsw-alias-label-primary-bluish': pair(LIGHT.text, p.text),
        '--dsw-alias-label-primary-dimmed': pair('#3A303B', p.text + '26'),
        '--dsw-alias-label-primary-foreground': pair(LIGHT.text, p.deep),
        '--dsw-alias-label-primary-inverted': pair(LIGHT.text, p.canvas),
        '--dsw-alias-label-secondary': pair(LIGHT.soft, p.soft),
        '--dsw-alias-label-tertiary': pair(LIGHT.subtle, p.subtle),
        '--dsw-alias-label-caption': pair(LIGHT.focus, p.muted),
        '--dsw-alias-label-dimmed': pair(LIGHT.caption, p.border),
        '--dsw-alias-label-shimmer': pair(
          'color-mix(in srgb, ' + LIGHT.text + ' 30%, transparent)',
          'color-mix(in srgb, ' + p.text + ' 45%, transparent)',
        ),
        '--dsw-alias-label-deep-diving': pair(LIGHT.purple, accent),
        '--dsw-alias-label-deep-diving-shimmer': pair(LIGHT.purple, accent),
        '--dsw-alias-menu-icon': pair(LIGHT.soft, p.soft),
        // Reference `textLink.foreground` is the yellow accent, not cyan.
        '--dsw-alias-link': pair(LIGHT.pink, accent),

        // Markdown and code surfaces.
        '--dsw-alias-markdown-citation': pair(LIGHT.activity, p.panel),
        '--dsw-alias-markdown-code-block-banner': pair(LIGHT.sidebar, p.panel),
        '--dsw-alias-markdown-code-block': pair(LIGHT.sidebar, p.deep),
        '--dsw-alias-markdown-code-segment-selected': pair(LIGHT.panel, p.panel),
        '--dsw-alias-markdown-code-segment-unselected': pair(LIGHT.activity, p.canvas),
        '--dsw-alias-markdown-inline-code': pair(LIGHT.activity, p.panel),
        '--dsw-alias-markdown-placeholder': pair(LIGHT.activity, p.panel),
        '--dsw-alias-markdown-tag': pair(LIGHT.activity, p.panel),

        // Shiki syntax highlighting (Monokai Pro token colors).
        '--shiki-token-constant': pair(LIGHT.purple, p.purple),
        '--shiki-token-string': pair(LIGHT.yellow, p.yellow),
        '--shiki-token-string-expression': pair(LIGHT.yellow, p.yellow),
        '--shiki-token-comment': pair(LIGHT.focus, p.muted),
        '--shiki-token-keyword': pair(LIGHT.pink, p.pink),
        '--shiki-token-parameter': pair(LIGHT.orange, p.orange),
        '--shiki-token-function': pair(LIGHT.green, p.green),
        '--shiki-token-punctuation': pair(LIGHT.subtle, p.subtle),
        '--shiki-token-link': pair(LIGHT.cyan, p.cyan),

        // Scrollbars (reference: c1c0c026 idle, fcfcfa26 hover, fcfcfa59 active).
        '--dsw-alias-scrollbar-bg-l1': pair(LIGHT.caption, p.soft + '26'),
        '--dsw-alias-scrollbar-bg-l2': pair(LIGHT.caption, p.text + '26'),
        '--dsw-alias-scrollbar-hover-l1': pair(LIGHT.focus, p.text + '26'),
        '--dsw-alias-scrollbar-hover-l2': pair(LIGHT.focus, p.text + '59'),

        // States. "Business" drives focus rings, carets, active tabs and chips
        // GUI-wide; the reference uses the yellow accent for all of these
        // (`tab.activeForeground`, `list.activeSelectionForeground`,
        // `activityBar.activeFocusBorder`), slightly darkened for chrome —
        // no blue remains.
        '--dsw-alias-state-business-primary': pair(LIGHT.yellow, accent),
        '--dsw-alias-state-business-tertiary': pair(
          LIGHT.yellow + '26',
          'color-mix(in srgb, ' + accent + ' 15%, transparent)',
        ),
        '--dsw-alias-state-error-primary': pair(LIGHT.pink, p.pink),
        '--dsw-alias-state-error-secondary': pair(p.pink + '99', p.pink + '99'),
        '--dsw-alias-state-idle-primary': pair(LIGHT.caption, p.border),
        '--dsw-alias-state-success-primary': pair(LIGHT.green, p.green),
        '--dsw-alias-state-success-secondary': pair(p.green + '99', p.green + '99'),
        '--dsw-alias-state-success-tertiary': pair(p.green + '26', p.green + '26'),
        '--dsw-alias-state-warn-label': pair(LIGHT.orange, p.orange),
        '--dsw-alias-state-warn-primary': pair(p.orange + 'CC', p.orange),
        '--dsw-alias-state-warn-secondary': pair(p.orange + '99', p.orange + '99'),
        '--dsw-alias-state-warn-tertiary': pair(p.orange + '26', p.orange + '26'),

        // Code diffs (reference alpha `19`, not `26`).
        '--dsw-alias-code-diff-added': pair(p.green + '19', p.green + '19'),
        '--dsw-alias-code-diff-deleted': pair(p.pink + '19', p.pink + '19'),
        '--dsw-alias-file-diff-added-bg': pair(p.green + '19', p.green + '19'),
        '--dsw-alias-file-diff-added-gutter': pair(p.green + '19', p.green + '19'),
        '--dsw-alias-file-diff-added-marker': pair(LIGHT.green, p.green),
        '--dsw-alias-file-diff-deleted-bg': pair(p.pink + '19', p.pink + '19'),
        '--dsw-alias-file-diff-deleted-gutter': pair(p.pink + '19', p.pink + '19'),
        '--dsw-alias-file-diff-deleted-marker': pair(LIGHT.pink, p.pink),

        // Notices and tooltips.
        '--dsw-alias-switch-thumb': pair(LIGHT.text, p.text),
        '--dsw-alias-toast-bg': pair(LIGHT.text, p.panel),
        '--dsw-alias-toast-label': pair(LIGHT.canvas, p.text),
        '--dsw-alias-tooltip-bg': pair(LIGHT.text, p.panel),
        '--dsw-alias-turn-trigger-bg': pair(LIGHT.activity, p.canvas),
        '--dsw-alias-turn-trigger-bg-hover': pair(LIGHT.sidebar, p.panel),

        // Shell-specific surfaces.
        '--dsw-specific-bubble': pair(LIGHT.activity, p.panel),
        '--dsw-specific-bubble-highlight': pair(LIGHT.activity, p.panel),
        '--dsw-specific-input-major': pair(LIGHT.panel, p.panel),
        '--dsw-specific-login-input': pair(LIGHT.sidebar, p.canvas),
        '--dsw-menu-surface-fill': pair(LIGHT.panel + 'E6', p.canvas + 'E6'),
        '--dsw-alias-menu-group-header-fill': pair(LIGHT.activity + 'F0', p.panel + 'F0'),
        '--dsw-specific-menu': pair(LIGHT.panel + 'F0', p.canvas + 'F0'),
        '--dsw-specific-selector': pair(LIGHT.activity, p.panel),
        '--dsw-specific-sidebar-fill': pair(LIGHT.sidebar, p.deep),
        '--dsw-specific-sidebar-nav-item-active-accent': pair(p.yellow + '66', 'color-mix(in srgb, ' + accent + ' 12%, transparent)'),
        '--dsw-specific-sidebar-nav-item-active': pair(LIGHT.activity, p.panel),
        '--dsw-specific-sidebar-nav-item-hover': pair(LIGHT.sidebar, p.panel),
        '--dsw-specific-tip': pair(LIGHT.activity, p.panel),

        // Onboarding surfaces (built-in values are DeepSeek-brand blues).
        '--dsw-alias-onboarding-accent': pair(LIGHT.yellow, accent),
        '--dsw-alias-onboarding-card-fill': pair(LIGHT.panel + 'CC', p.panel + 'CC'),
        '--dsw-alias-onboarding-secondary-fill': pair(LIGHT.panel, p.panel),
        '--dsw-alias-onboarding-checkbox-border': pair(LIGHT.border, p.border),

        // Shimmer gradients (literal stops by design).
        '--dsw-linear-gradient-think': pair(
          'linear-gradient(180deg, ' + LIGHT.canvas + ' 20.19%, ' + LIGHT.canvas + '00 100%)',
          'linear-gradient(180deg, ' + p.canvas + ' 20.19%, ' + p.canvas + '00 100%)',
        ),
        '--dsw-linear-think-select': pair(
          'linear-gradient(180deg, ' + LIGHT.activity + ' 20.19%, ' + LIGHT.activity + '00 100%)',
          'linear-gradient(180deg, ' + p.panel + ' 20.19%, ' + p.panel + '00 100%)',
        ),

        // Typography: Monokai Pro's geometric UI feel, and its code-first monospace.
        // The `var(--dsh-font-family-*)` reference keeps a user's Settings font ahead
        // of the themed stack, so this layer never overrides an explicit choice.
        '--dsw-font-family': pair(
          'var(--dsh-font-family-text, "Avenir Next", "Inter", "Segoe UI Variable Text", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif)',
          'var(--dsh-font-family-text, "Avenir Next", "Inter", "Segoe UI Variable Text", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif)',
        ),
        '--ds-font-family-code': pair(
          'var(--dsh-font-family-code, "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace)',
          'var(--dsh-font-family-code, "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace)',
        ),
      };
    }

    const EN = {
      'title': 'Monokai Pro',
      'badge': 'Theme',
      'description': 'Monokai Pro colors, syntax highlighting and typography for the whole interface, with the official filter variants. Turning it on switches the appearance to dark.',
      'enable': 'Enable the Monokai Pro theme',
      'disable': 'Disable the Monokai Pro theme',
      'variant': 'Color filter',
    };
    const ZH = {
      'title': 'Monokai Pro',
      'badge': '主题',
      'description': '为整个界面启用 Monokai Pro 配色、语法高亮与字体，并支持官方滤镜变体。开启后外观会切换为深色。',
      'enable': '启用 Monokai Pro 主题',
      'disable': '停用 Monokai Pro 主题',
      'variant': '色彩滤镜',
    };

    const listeners = new Set();
    let service = null;
    /** Disposer of the live token layer, so toggling and teardown restore the palette. */
    let layerDispose = null;
    let enabled = readEnabled();
    let variant = readVariant();

    function readEnabled() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off';
      } catch {
        return true;
      }
    }

    function hasStoredChoice() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        return true;
      }
    }

    function persist(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
      } catch {
        /* A blocked storage API only costs the preference, not the theme. */
      }
    }

    function readVariant() {
      try {
        const id = window.localStorage.getItem(VARIANT_KEY);
        return VARIANT_IDS.includes(id) ? id : DEFAULT_VARIANT;
      } catch {
        return DEFAULT_VARIANT;
      }
    }

    function persistVariant(id) {
      try {
        window.localStorage.setItem(VARIANT_KEY, id);
      } catch {
        /* A blocked storage API only costs the filter choice, not the theme. */
      }
    }

    function palette() {
      return PALETTES[variant] || PALETTES[DEFAULT_VARIANT];
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }

    function isEnabled() {
      return enabled;
    }

    function currentVariant() {
      return variant;
    }

    function notify() {
      for (const listener of [...listeners]) listener();
    }

    function applyLayer() {
      if (service === null) return;
      // Re-applying always rebinds: a previous handle may name a theme service
      // that was replaced or a layer that a fiber teardown already disposed.
      removeLayer();
      layerDispose = service.overrideTokens(PACKAGE, buildTokens(palette()));
    }

    function removeLayer() {
      const dispose = layerDispose;
      layerDispose = null;
      if (dispose === null) return;
      try {
        dispose();
      } catch {
        /* The owning theme service may already be disposed. */
      }
    }

    function preferDark() {
      if (service === null) return;
      try {
        if (service.getTheme().preference !== 'dark') service.setTheme('dark');
      } catch {
        /* A theme preference write is best-effort; the token layer still applies. */
      }
    }

    function setEnabled(next) {
      if (enabled === next) return;
      enabled = next;
      persist(next);
      if (next) {
        applyLayer();
        preferDark();
      } else {
        removeLayer();
      }
      notify();
    }

    function setVariant(next) {
      if (variant === next || !VARIANT_IDS.includes(next)) return;
      variant = next;
      persistVariant(next);
      // The light scheme is the fixed official Pro Light, so only rebind when
      // the layer is live; dark values are what changed.
      if (enabled) applyLayer();
      notify();
    }

    const CSS = `
.mkp_row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.mkp_main{display:flex;flex-direction:column;gap:4px;min-width:0}
.mkp_heading{display:flex;align-items:center;gap:8px}
.mkp_title{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}
.mkp_badge{padding:0 6px;border-radius:999px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-foreground);font-size:11px;line-height:16px}
.mkp_desc{max-width:56ch;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.mkp_variants{display:flex;align-items:center;gap:10px;margin-top:8px}
.mkp_variantsLabel{color:var(--dsw-alias-label-caption);font-size:11px;line-height:16px}
.mkp_variantGroup{display:flex;gap:6px}
.mkp_variant{box-sizing:border-box;width:18px;height:18px;padding:0;border:0;border-radius:50%;cursor:pointer;box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3)}
.mkp_variant:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.mkp_variantOn{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.mkp_switch{box-sizing:border-box;flex:none;width:40px;height:24px;margin-top:2px;padding:2px;border:0;border-radius:999px;background:var(--dsw-alias-state-idle-primary);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);cursor:pointer;transition:background .15s var(--ds-ease-in-out)}
.mkp_switch:hover{background:var(--dsw-alias-label-caption)}
.mkp_switch:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.mkp_switchOn,.mkp_switchOn:hover{background:var(--dsw-alias-brand-primary)}
.mkp_thumb{display:block;width:20px;height:20px;border-radius:50%;background:var(--dsw-alias-switch-thumb);box-shadow:0 1px 2px var(--dsw-alias-bg-mask-2);transition:transform .15s var(--ds-ease-in-out)}
.mkp_switchOn .mkp_thumb{transform:translateX(16px);background:var(--dsw-alias-label-primary-foreground)}
@media (prefers-reduced-motion:reduce){.mkp_switch,.mkp_thumb{transition:none}}
/* The HoverCard primitive hardcodes --dsw-hovercard-bg:#2C2C2E on the card
   element itself, so a :root token override never reaches it. Re-bind the
   private var to the themed panel surface; !important beats the local
   non-important definition, and unused custom properties cost nothing. */
*{--dsw-hovercard-bg:var(--dsw-alias-bg-layer-1)!important}
/* Focus ring follows the yellow business accent, matching tab.activeBorder
   / activityBar.activeFocusBorder from the VS Code reference. */
:root,:host{--dsw-focus-ring-color:var(--dsw-alias-state-business-primary)}
`;


    function installStyles() {
      if (typeof document === 'undefined') return;
      if (document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]') !== null) return;
      const tag = document.createElement('style');
      tag.dataset.plugin = PACKAGE;
      tag.dataset.pluginCss = STYLE_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    function removeStyles() {
      if (typeof document === 'undefined') return;
      for (const tag of document.querySelectorAll('style[data-plugin-css="' + STYLE_ID + '"]')) tag.remove();
    }

    /**
     * One swatch per filter: the variant's own canvas and primary accent split
     * diagonally, so the dots preview both the surface and the accent family.
     */
    function VariantPicker({ t }) {
      const active = React.useSyncExternalStore(subscribe, currentVariant, currentVariant);
      const tr = (key) => (typeof t === 'function' ? t(key) : key);
      return h('div', { className: 'mkp_variants' },
        h('span', { className: 'mkp_variantsLabel', id: 'mkp-variant-label' }, tr('variant')),
        h('div', {
          className: 'mkp_variantGroup',
          role: 'group',
          'aria-labelledby': 'mkp-variant-label',
        }, VARIANT_IDS.map((id) => {
          const p = PALETTES[id];
          const on = id === active;
          return h('button', {
            key: id,
            type: 'button',
            'aria-pressed': on,
            'aria-label': p.label,
            title: p.label,
            className: on ? 'mkp_variant mkp_variantOn' : 'mkp_variant',
            style: {
              background: 'linear-gradient(135deg, ' + p.canvas + ' 0 50%, ' + p.pink + ' 50% 100%)',
            },
            onClick: () => setVariant(id),
          });
        }))
      );
    }

    function MonokaiRow({ t }) {
      const on = React.useSyncExternalStore(subscribe, isEnabled, isEnabled);
      const tr = (key) => (typeof t === 'function' ? t(key) : key);
      return h('div', { className: 'mkp_row' },
        h('div', { className: 'mkp_main' },
          h('div', { className: 'mkp_heading' },
            h('span', { className: 'mkp_title' }, tr('title')),
            h('span', { className: 'mkp_badge' }, tr('badge'))
          ),
          h('div', { className: 'mkp_desc' }, tr('description')),
          h(VariantPicker, { t: tr })
        ),
        h('button', {
          type: 'button',
          role: 'switch',
          'aria-checked': on,
          'aria-label': tr(on ? 'disable' : 'enable'),
          className: on ? 'mkp_switch mkp_switchOn' : 'mkp_switch',
          onClick: () => setEnabled(!on),
        }, h('span', { className: 'mkp_thumb', 'aria-hidden': 'true' }))
      );
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        service = ctx.theme;
        const firstRun = !hasStoredChoice();
        if (firstRun) persist(enabled);

        ctx.effect(() => ctx.locale.register(NS, { en: EN, zh: ZH }), 'monokai-pro: settings copy');

        ctx.effect(() => {
          installStyles();
          if (enabled) {
            applyLayer();
            if (firstRun) preferDark();
          }
          return () => {
            removeLayer();
            removeStyles();
          };
        }, 'monokai-pro: theme layer');

        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'monokai-pro',
          order: 13,
          locale: NS,
        }, MonokaiRow));
      },
    };
  },
});
