# Copilot Instructions

## Project Overview

This is a progressive Shadow DOM / Web Components demo site ("Shedding light on the Shadow DOM") built with vanilla JavaScript and Vite. It has no framework — every component is a hand-rolled custom element. The site is structured as a series of ~23 numbered example pages, each illustrating a specific Web Components concept.

## Commands

```bash
npm run dev    # Start Vite dev server (root: public/)
npx eslint .   # Lint all JS and HTML files
```

There is no test suite.

## Architecture

- `public/` is the Vite root — all HTML pages live at the top level of `public/`
- `public/js/components/` — individual custom element definitions, one per file
- `public/js/shared-styles.js` — shared `CSSStyleSheet` instances (`baseSheet`, `themeSheet`) adopted by components via `adoptedStyleSheets`
- `public/css/main.css` — global page styles (not component styles)
- `public/partials/` — Handlebars partials (`header.hbs`, `footer.hbs`) used by every page via `{{> header title="..." }}` / `{{> footer }}`

HTML pages are processed by `vite-plugin-handlebars`. Every page wraps its content with `{{> header ... }}` and `{{> footer }}`.

## Component Conventions

**Standard component shape:**
```js
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this.shadowRoot.innerHTML) this.render();
  }
  render() { this.shadowRoot.innerHTML = `...`; }
}
customElements.define('my-component', MyComponent);
```

**Shared stylesheets** — components that want shared base/theme styles adopt them in the constructor:
```js
this.shadowRoot.adoptedStyleSheets = [baseSheet, themeSheet];
```
Any additional component-specific `<style>` can still appear in `innerHTML` alongside adopted sheets.

**Template element** — some components pre-create a `<template>` at module scope and clone it in the constructor (see `exportparts-card.js`). Use this pattern when the HTML structure never changes and the component is stamped many times.

**Form-associated elements** use `static formAssociated = true` and `this._internals = this.attachInternals()` in the constructor. They proxy `value`, `form`, `validity`, `validationMessage`, and `willValidate` to `_internals`.

**Custom states** (`ElementInternals.states`) are managed by calling `this._internals.states.add(state)` / `.delete(state)`, then targeted in CSS with `:host(:state(loading))`.

**Inheritance hook** — `BaseNotification` defines `_afterRender()` as an empty hook. Subclasses override it to append to the already-rendered shadow root instead of overwriting `innerHTML`. Subclasses must:
1. Spread parent's `observedAttributes`: `[...super.observedAttributes, 'new-attr']`
2. Chain `super.attributeChangedCallback(...)` before handling their own attrs.

**Custom events** that need to cross shadow boundaries are dispatched with `{ bubbles: true, composed: true }`.

## Broken vs. Fixed Files

Files prefixed `broken-` are **intentionally incorrect** examples demonstrating common mistakes. Their corresponding `-fixed` counterparts show the correct implementation. Do not "fix" the broken files — they are the teaching material.

## ESLint Rules

- Single quotes, semicolons required
- 2-space indentation
- Trailing commas in multiline
- `public/**/*.js` files use browser globals; Node built-in checks are disabled for that scope
- Target: ES2022, Node ≥ 20
