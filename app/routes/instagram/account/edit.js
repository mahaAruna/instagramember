import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramAccountEditRoute extends Route {
  @service store;
  @service session;

  model() {
    var user = this.store
      .findRecord('user', this.session.getUserName())
      .then((user) => {
        var controller = this.controllerFor('instagram.account.edit');
        controller.user = user;
        controller.imageDataUrl = `data:image/png;base64,${controller.user.profileUrl}`;
        controller.name = user.name;
        controller.userName = user.userName;
        controller.bio = user.bio;
        controller.gender = user.gender;
      });
  }
}
