import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramProfileSavedRoute extends Route {
  @service store;

  model() {
    var parentParam = this.paramsFor('instagram.profile');
    var savedList = this.store.query('post', { isAll: 'save' });
    return savedList;
  }

  setupController(controller, model) {
    var controller = this.controllerFor('instagram.profile.saved');
    controller.savedList = model;
  }
}
