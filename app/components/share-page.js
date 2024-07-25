import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class SharePageComponent extends Component {
  @service router;
  @service session;

  @action
  changePage(path, param) {
    this.router.transitionTo(path, param);
  }

  @action
  isSearch() {
    console.log('in maha');
    console.log('searchArray ', this.args.search);
  }

  @action
  isShareList() {
    console.log('shareList ', this.args.shareList);
  }

  @action
  getSrc(profileUrl) {
    return `data:image/png;base64,${profileUrl}`;
  }
}
