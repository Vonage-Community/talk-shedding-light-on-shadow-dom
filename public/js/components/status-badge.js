const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: inherit;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
    .label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2em 0.6em;
      border-radius: 9999px;
      background: #e5e7eb;
      color: #374151;
    }
  </style>
  <span class="dot" part="dot"></span>
  <span class="label" part="label"><slot>Badge</slot></span>
`;

class StatusBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('status-badge', StatusBadge);
