import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramReelsRoute extends Route {
  @service store;

  async model() {
    var controller = this.controllerFor('instagram.reels');
    var reels = await this.store.query('post', { isAll: 'reels' });
    const userPromises = reels.map(async (post, index) => {
      const user = await this.store.findRecord('user', post.user.id);
      controller.users.set(post.user.id, user);
    });
    await Promise.all(userPromises);
    controller.reels = reels;

    return reels;
  }

  setupController(controller, model) {
    controller.reels = model;
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.currentPath = 'instagram.reels';
    anothercontroller.getColor('instagram.reels');
  }
}
