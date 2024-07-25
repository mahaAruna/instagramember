import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FormComponent extends Component {
  teacher = {
    path: '',
  };
  label = '';
  p = '';

  @tracked isInput = false;

  @action
  handlevalues(event, label) {
    if (label === 'undefined' || label === null) {
      this.teacher.path = event.target.value;
    } else {
      this.label = label.replace(' ', '');
      this.p = event.target.value;
      this.teacher[this.label] = this.p;
    }
  }

  @action
  getObj(event) {
    event.preventDefault();
    this.isInput = true;
    this.args.getObj(event, this.teacher);
  }
}
