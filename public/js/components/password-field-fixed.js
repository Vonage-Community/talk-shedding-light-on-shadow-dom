import { FormFieldFixed } from './form-field-fixed.js';

class PasswordFieldFixed extends FormFieldFixed {
  connectedCallback() {
    if (!this.hasAttribute('type')) this.setAttribute('type', 'password');
    if (!this.hasAttribute('icon')) this.setAttribute('icon', 'password');
    if (!this.hasAttribute('label')) this.setAttribute('label', 'Password');
    if (!this.hasAttribute('placeholder')) this.setAttribute('placeholder', '••••••••');
    super.connectedCallback();
  }
}

customElements.define('password-field-fixed', PasswordFieldFixed);
