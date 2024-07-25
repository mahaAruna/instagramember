import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UserBoxComponent extends Component {
  @tracked isSelected = false;
  @action
  changePage() {
    this.args.onClick(this.args.path, this.args.param);
    if (this.args.time) {
      this.args.onClick(this.args.path, this.args.param, this.args.time);
    }
  }

  @action
  onButton(event) {
    event.stopPropagation();
    if (this.args.onButton) {
      this.args.onButton();
    }
  }

  @action
  addShareList(event) {
    console.log('in addShareList');
    event.stopPropagation();
    if (this.args.addShareList) {
      this.args.addShareList(this.args.userId, event);
    }
    this.isSelected = true;
  }

  @action
  removeShareList(event) {
    console.log('in addShareList');
    event.stopPropagation();
    if (this.args.removeShareList) {
      this.args.removeShareList(this.args.userId, event);
    }
    this.isSelected = false;
  }
}
