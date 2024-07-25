import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramProfilePostController extends Controller {
  @tracked postList;
  @service router;

  @action
  getSrc(imageUrl) {
    if (typeof imageUrl === 'string') {
      return `data:image/png;base64,${imageUrl}`;
    } else {
      return `data:image/png;base64,${imageUrl[0].substring(0, imageUrl[0].indexOf('*'))}`;
    }
  }

  @action
  changeToPost(postId) {
    if (postId) {
      this.router.transitionTo('instagram.post', postId);
    }
  }
}
