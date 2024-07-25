import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class InstagramExploreRoute extends Route {
  @service store;

  model() {
    var posts = this.store.query('post', { isAll: 'publicAll' });
    return posts;
  }

  setupController(controller, model) {
    controller.posts = model;
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.currentPath = 'instagram.explore';
    anothercontroller.getColor('instagram.explore');
    var postController = this.controllerFor('instagram.post');
    postController.postArray = model;
    postController.show = true;
  }
}
