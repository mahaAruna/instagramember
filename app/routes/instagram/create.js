import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramCreateRoute extends Route {
  @service store;
  @service session;

  model() {
    let user = this.store.findRecord('user', this.session.getUserName(), {
      adapterOptions: {
        sessionId: this.sessionId,
        username: this.session.getUserName(),
      },
    });

    return user;
  }

  setupController(controller, model) {
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.currentPath = 'instagram.create';
    anothercontroller.getColor('instagram.create');
    var controller = this.controllerFor('instagram.create');
    controller.user = model;
    controller.followerCount = controller.user.followersuser.length;
    controller.followingCount = controller.user.followingsuser.length;
    controller.postCount = controller.user.post.length;
    if (model.profileUrl) {
      const profileUrl = `data:image/png;base64,${model.profileUrl}`;
      controller.src = profileUrl;
    }
    controller.isMyProfile = model.id === this.session.getUserName();
  }
}
