import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonComponent extends Component {
  @action
  handleClick() {
    if (this.args.onClick) {
      this.args.onClick(this.args.path);
    }
  }
}
