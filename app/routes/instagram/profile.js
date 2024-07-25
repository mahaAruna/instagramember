import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InstagramProfileRoute extends Route {
  @service store;
  @service session;
  @tracked currentUser;
  @tracked sessionId;
  @tracked userName;

  beforeModel(transition) {
    const isAuthenticated = this.session.getSessionId();
    if (isAuthenticated === null) {
      this.router.transitionTo('signin');
    } else {
      this.sessionId = isAuthenticated;
    }
    var controller = this.controllerFor('instagram');
    controller.currentPath = 'instagram.profile';
    controller.getColor('instagram.profile');
  }

  async model(params) {
    let user = await this.store.findRecord('user', params.username, {
      adapterOptions: { sessionId: this.sessionId, username: params.username },
    });

    await user.followersuser;
    await user.followingsuser;
    await user.post;
    return user;
  }

  afterModel(model, transition) {
    var user = model;
    var controller = this.controllerFor('instagram.profile');

    var json = { userName: user.id, sessionId: this.sessionId };
    fetch('http://localhost:8080/Instagram/Profile', {
      method: 'post',
      body: JSON.stringify(json),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.isFollower) {
          controller.isConfirm = data.isFollower;
        }
      });
  }

  setupController(controller, model) {
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.currentPath = 'instagram.profile';
    anothercontroller.getColor('instagram.profile');
    var controller = this.controllerFor('instagram.profile');
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

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('user', null);
    }
  }
}
