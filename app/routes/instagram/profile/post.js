import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramProfilePostRoute extends Route {
  @service store;

  model() {
    var parentParam = this.paramsFor('instagram.profile');
    var username = parentParam.username;
    var postList = this.store.query('post', {
      username: username,
      isAll: 'all',
    });
    return postList;
  }

  setupController(controller, model) {
    var controller = this.controllerFor('instagram.profile.post');
    controller.postList = model;
  }
}
