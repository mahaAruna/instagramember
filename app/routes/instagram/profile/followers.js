import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
export default class InstagramProfileFollowersRoute extends Route {
  @service session;
  @service store;

  async model() {
    var user = this.modelFor('instagram.profile');

    var parentParam = this.paramsFor('instagram.profile');
    let username = parentParam.username;
    var con = this.controllerFor('instagram.profile.followers');
    con.followingId = await user.followingsuser.then((following) => {
      return [...following];
    });
    var followers = this.store
      .query('user', { username: username, isFollower: true })
      .then((followers) => {
        con.followers = followers;
      });
    return followers;
  }
}
