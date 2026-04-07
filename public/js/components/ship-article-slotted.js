class ShipArticleSlotted extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          font-family: inherit;
          max-width: 640px;
        }

        article {
          padding: 1.5rem;
        }

        ::slotted([slot="headline"]) {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
          line-height: 1.25;
          color: #1a1a1a;
        }

        ::slotted([slot="summary"]) {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          border-left: 3px solid #e0e0e0;
          padding-left: 0.75rem;
          margin: 0 0 1rem;
        }

        ::slotted([slot="details"]) {
          font-size: 0.9rem;
          color: #444;
          line-height: 1.7;
        }
      </style>

      <article>
        <slot name="headline"></slot>
        <slot name="summary"></slot>
        <slot name="details"></slot>
      </article>
    `;
  }
}

customElements.define('ship-article-slotted', ShipArticleSlotted);
