import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SelectComponent extends Component {
  @action
  change(event) {
    this.args.onClick(event, this.args.label);
  }
}
