import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import FormComponent from './form';

export default class FormFieldComponent extends FormComponent {
  @tracked value = [];
  @tracked checkValues = '';
  @tracked label = '';
  @tracked inputType;
  @tracked className;

  @action
  validatename(event) {
    this.args.onClick(event, this.args.label);
  }

  @action
  showPassword(event) {
    event.stopPropagation();
    if (this.inputType === 'text') {
      this.inputType = 'password';
      this.className = 'fas fa-eye-slash eye';
    } else if (this.inputType === 'password') {
      this.inputType = 'text';
      this.className = 'fa-solid fa-eye eye';
    } else {
      if (this.args.inputtype === 'password') {
        this.inputType = 'text';
        this.className = 'fa-solid fa-eye eye';
      } else {
        this.inputType = 'password';
      }
    }
  }
}
