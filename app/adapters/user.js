import RestAdapter from '@ember-data/adapter/rest';
import { service } from '@ember/service';

export default class UserAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram';

  pathForType(type) {
    if (type === 'followers') {
      return 'GetFollowers';
    } else if (type === 'followings') {
      return 'GetFollowings';
    } else if (type === 'user') {
      return 'Profile';
    } else if (type === 'activeusers') {
      return 'ActiveUsers';
    }
  }

  urlForFindRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('user');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${id}`;
  }

  urlForFindAll(modelName, snapshot) {
    let baseUrl = this.buildURL('activeusers');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${this.session.getUserName()}`;
  }

  urlForQuery(query, modelName) {
    if (query.isActive) {
      let baseUrl = this.buildURL('activeusers');
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${this.session.getUserName()}`;
    } else if (query.isFollower) {
      let baseUrl = this.buildURL('followers');
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${query.username}&isFollower=${query.isFollower}`;
    } else if (query.isFollowing) {
      let baseUrl = this.buildURL('followings');
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${query.username}&isFollowing=${query.isFollowing}`;
    }
  }
}
