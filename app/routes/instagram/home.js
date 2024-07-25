import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramHomeRoute extends Route {
  @service store;
  @service session;

  beforeModel(transition) {
    // this._super(controller, model);
    var controller = this.controllerFor('instagram');
    controller.currentPath = 'instagram.home';
    controller.getColor('instagram.home');
  }

  async model() {
    const controller = this.controllerFor('instagram.home');
    this.store.findRecord('user', this.session.getUserName()).then((user) => {
      controller.user = user;
    });
    const posts = await this.store.query('post', { isAll: 'publicAll' });
    const userPromises = posts.map(async (post, index) => {
      const user = await this.store.findRecord('user', post.user.id);
      controller.users.set(post.user.id, user);
    });
    await Promise.all(userPromises);
    controller.post = posts;

    return posts;
  }
}
