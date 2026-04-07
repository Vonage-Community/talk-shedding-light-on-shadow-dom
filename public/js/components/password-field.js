import { FormField } from './form-field.js';

class PasswordField extends FormField {
  connectedCallback() {
    if (!this.hasAttribute('type')) this.setAttribute('type', 'password');
    if (!this.hasAttribute('icon')) this.setAttribute('icon', 'password');
    if (!this.hasAttribute('label')) this.setAttribute('label', 'Password');
    if (!this.hasAttribute('placeholder')) this.setAttribute('placeholder', '••••••••');
    super.connectedCallback();
  }
}

customElements.define('password-field', PasswordField);
