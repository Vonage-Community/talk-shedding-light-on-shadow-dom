/**
 * A single CSSStyleSheet instance shared across all components that import it.
 * One object in memory — not N copies of the same CSS string.
 */
export const baseSheet = new CSSStyleSheet();
export const themeSheet = new CSSStyleSheet();

baseSheet.replaceSync(`
  :host {
    display: block;
    font-family: inherit;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  p {
    margin: 0 0 0.75rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  p:last-child { margin-bottom: 0; }
`);

themeSheet.replaceSync(`
  :host {
    --accent: #0070f3;
    --accent-text: #ffffff;
    --surface: #ffffff;
    --surface-alt: #f5f5f5;
    --border: #e0e0e0;
    --text: #1a1a1a;
    --text-muted: #666;
    --radius: 8px;
  }

  a { color: var(--accent); }
`);

/**
 * Update the theme at runtime — all components that adopted themeSheet
 * will reflect the change immediately, with no re-rendering.
 */
export function applyTheme(vars) {
  const rules = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  themeSheet.replaceSync(`
    :host {
      ${rules}
    }
    a { color: var(--accent); }
  `);
}
