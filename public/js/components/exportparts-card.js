import './status-badge.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      font-family: inherit;
      max-width: 380px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e0e0e0;
    }
    .title { font-weight: 700; font-size: 0.95rem; }
    .body  { padding: 1.1rem; font-size: 0.9rem; color: #444; line-height: 1.6; }
  </style>
  <div class="header">
    <span class="title" part="title"><slot name="title">Card</slot></span>
    <!--
      exportparts forwards status-badge's "dot" and "label" parts
      outward under new names: "badge-dot" and "badge-label".
      Without this attribute those parts would be invisible from outside.
    -->
    <status-badge part="badge" exportparts="dot: badge-dot, label: badge-label">
      <slot name="status">Active</slot>
    </status-badge>
  </div>
  <div class="body" part="body">
    <slot>Content</slot>
  </div>
`;

class ExportPartsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('exportparts-card', ExportPartsCard);
