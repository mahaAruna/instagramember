import RestAdapter from '@ember-data/adapter/rest';
import { service } from '@ember/service';

export default class LikeAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram';

  pathForType(type) {
    if (type === 'users') {
      return 'LikeServlet';
    } else if (type === 'get') {
      return 'LikeServlet';
    } else if (type === 'update') {
      return 'MessageServlet';
    }
  }

  urlForFindRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('get');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&likeId=${id}&type=get`;
  }

  urlForQuery(query, modelName) {
    let baseUrl = this.buildURL('users');
    if (query.type === 'users') {
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&type=${query.type}&postId=${query.postId}`;
    }
  }
}
