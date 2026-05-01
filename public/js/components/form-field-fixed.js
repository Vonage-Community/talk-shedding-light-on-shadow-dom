const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.114l4.758-2.876L1 5.383v5.731z"/>
</svg>`;

const LOCK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
</svg>`;

const ICONS = { email: EMAIL_ICON, password: LOCK_ICON };

class FormFieldFixed extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['label', 'type', 'icon', 'placeholder', 'required', 'name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals();
    this._connected = false;
  }

  get value() {
    return this.shadowRoot.querySelector('input')?.value ?? '';
  }

  set value(val) {
    const input = this.shadowRoot.querySelector('input');
    if (input) input.value = val;
    this._internals.setFormValue(val);
  }

  get form() { return this._internals.form; }
  get validity() { return this._internals.validity; }
  get validationMessage() { return this._internals.validationMessage; }
  get willValidate() { return this._internals.willValidate; }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this.shadowRoot.innerHTML) this.render();
  }

  _validate(value) {
    const input = this.shadowRoot.querySelector('input');
    if (this.hasAttribute('required') && !value.trim()) {
      this._internals.setValidity({ valueMissing: true }, 'This field is required.', input);
    } else {
      this._internals.setValidity({});
    }
  }

  render() {
    const label = this.getAttribute('label') || 'Field';
    const type = this.getAttribute('type') || 'text';
    const icon = this.getAttribute('icon');
    const placeholder = this.getAttribute('placeholder') || '';
    const required = this.hasAttribute('required');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: inherit; }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
          color: #374151;
        }

        .req { color: #dc2626; margin-left: 0.2em; }

        .input-wrapper {
          display: flex;
          align-items: stretch;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: #0070f3;
        }

        :host(:invalid) .input-wrapper {
          border-color: #dc2626;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.75rem;
          color: #6b7280;
          background: #f9fafb;
          border-right: 1px solid #d1d5db;
          flex-shrink: 0;
        }

        input {
          flex: 1;
          min-width: 0;
          padding: 0.6em 0.75em;
          font-size: 1rem;
          font-family: inherit;
          border: none;
          outline: none;
          background: transparent;
        }

        .error {
          display: none;
          margin-top: 0.3rem;
          font-size: 0.8rem;
          color: #dc2626;
        }

        :host(:invalid) .error {
          display: block;
        }
      </style>

      <label>
        ${label}
        ${required ? '<span class="req" aria-hidden="true">*</span>' : ''}
      </label>
      <div class="input-wrapper">
        ${icon ? `<span class="icon">${ICONS[icon] ?? icon}</span>` : ''}
        <input
          type="${type}"
          placeholder="${placeholder}"
          ${required ? 'aria-required="true"' : ''}
        />
      </div>
      <span class="error" role="alert"></span>
    `;

    const input = this.shadowRoot.querySelector('input');
    const error = this.shadowRoot.querySelector('.error');

    input.addEventListener('input', () => {
      this._internals.setFormValue(input.value);
      this._validate(input.value);
      error.textContent = this._internals.validationMessage;
    });

    this._validate(input.value);
    this._internals.setFormValue(input.value);
  }
}

customElements.define('form-field-fixed', FormFieldFixed);

export { FormFieldFixed, ICONS };
