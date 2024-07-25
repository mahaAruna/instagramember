import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NotifyBoxComponent extends Component {
  // @tracked type;
  @action
  setType(type) {
    this.type = type;
  }

  @action
  changePage() {
    if (this.args.path) {
      this.args.onClick(this.args.path, this.args.param);
    } else {
      this.args.onClick();
    }
  }
}
