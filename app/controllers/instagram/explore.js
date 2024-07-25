import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class InstagramExploreController extends Controller {
  @tracked posts;
  @service router;

  @action
  getSrc(imageUrl) {
    return `data:image/png;base64,${imageUrl[0].substring(0, imageUrl[0].indexOf('*'))}`;
  }

  @action
  changetoPost(id) {
    this.router.transitionTo('instagram.post', id);
  }
}
