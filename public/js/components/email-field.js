import { FormField, ICONS } from './form-field.js';

class EmailField extends FormField {
  connectedCallback() {
    if (!this.hasAttribute('type')) this.setAttribute('type', 'email');
    if (!this.hasAttribute('icon')) this.setAttribute('icon', 'email');
    if (!this.hasAttribute('label')) this.setAttribute('label', 'Email address');
    if (!this.hasAttribute('placeholder')) this.setAttribute('placeholder', 'you@example.com');
    super.connectedCallback();
  }
}

customElements.define('email-field', EmailField);
