import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MenuBarComponent extends Component {
  @action
  handleClick(event) {
    event.stopPropagation();
    this.args.onClick(this.args.path, this.args.param, event);
  }

  @action
  getIsShow(){
    return this.args.isshow;
  }
}
