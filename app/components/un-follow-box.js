import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UnFollowBoxComponent extends Component {
  @action
  handleUnFollow(event) {
    this.args.onUnFollow(event);
  }

  @action
  handleCancel(event) {
    this.args.onCancel(event);
  }
}
