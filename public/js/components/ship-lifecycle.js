class ShipLifecycle extends HTMLElement {
  static get observedAttributes() {
    return ['ship-name', 'summary'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._log('constructor', 'Element created, shadow root attached.');
  }

  connectedCallback() {
    this._log('connectedCallback', 'Element added to the DOM.');
    this.render();
  }

  disconnectedCallback() {
    this._log('disconnectedCallback', 'Element removed from the DOM.');
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._log(
      'attributeChangedCallback',
      `"${name}" changed from ${JSON.stringify(oldVal)} → ${JSON.stringify(newVal)}`
    );
    if (this.shadowRoot.innerHTML) this.render();
  }

  _log(callback, detail) {
    console.log(`[ship-lifecycle] ${callback} — ${detail}`);
  }

  render() {
    const name = this.getAttribute('ship-name') || 'Unknown';
    const summary = this.getAttribute('summary') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          font-family: inherit;
          max-width: 640px;
          width: 100%;
        }

        article {
          padding: 1.5rem;
        }

        h2 {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
          line-height: 1.25;
          color: #1a1a1a;
        }

        p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          border-left: 3px solid #e0e0e0;
          padding-left: 0.75rem;
          margin: 0;
        }
      </style>

      <article>
        <h2>${name}</h2>
        <p>${summary}</p>
      </article>
    `;
  }
}

customElements.define('ship-lifecycle', ShipLifecycle);
