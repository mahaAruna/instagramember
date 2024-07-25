import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramProfileFollowingsRoute extends Route {
  @service session;
  @service store;

  model() {
    // this.modelFor('instagram')
    var parentParam = this.paramsFor('instagram.profile');
    let username = parentParam.username;
    var con = this.controllerFor('instagram.profile.followings');
    var followings = this.store
      .query('user', { username: username, isFollowing: true })
      .then((followings) => {
        con.followings = followings;
        con.showUnFollow = false;
      });
    return followings;
  }
}
