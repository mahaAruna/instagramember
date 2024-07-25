import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramPostRoute extends Route {
  @service store;

  async model(params) {
    var controller = this.controllerFor('instagram.post');
    let post = await this.store.findRecord('post', params.post_id);
    let user = await this.store.findRecord('user', post.user.id);
    let comments = await this.store.query('comment', { post: params.post_id });
    const userPromises = comments.map(async (comment, index) => {
      const user = await this.store.findRecord('user', comment.user.id);
      controller.commentUsers.set(comment.user.id, user);
    });
    await Promise.all(userPromises);

    return { post, user, comments };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('post', model.post);
    controller.set('user', model.user);
    controller.set('comments', model.comments);
  }
}
