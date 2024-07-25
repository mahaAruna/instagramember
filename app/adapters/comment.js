import RestAdapter from '@ember-data/adapter/rest';
import { service } from '@ember/service';

export default class CommentAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram/CommentServlet';

  pathForType(type) {
    if (type === '') {
      return 'GetAllMessages';
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
    if (query.post) {
      return `${this.host}?sessionId=${this.session.getSessionId()}&type=all&postId=${query.post}`;
    }
  }
}
