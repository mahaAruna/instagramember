import RestAdapter from '@ember-data/adapter/rest';
import { service } from '@ember/service';

export default class PostAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram/AddPost';

  pathForType(type) {
    if (type === 'create') {
    } else if (type === 'get') {
    } else if (type === 'update') {
      return 'MessageServlet';
    }
  }

  urlForFindRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('get');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&postId=${id}&type=one`;
  }

  urlForFindAll(modelName, snapshot) {
    let baseUrl = this.buildURL('all');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&type=all`;
  }
  urlForCreateRecord(modelName, snapshot) {
    var images = snapshot.attributes().imageUrl;
    let baseUrl = this.buildURL('create');
    return `${baseUrl}`;
  }

  urlForQuery(query, modelName) {
    let baseUrl = this.buildURL('all');
    if (query.isAll === 'all') {
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${query.username}&type=user`;
    }
    if (query.isAll === 'publicAll') {
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&type=all`;
    }
    if (query.isAll === 'reels') {
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&type=reels`;
    }
    if (query.isAll === 'save') {
      return `${baseUrl}?sessionId=${this.session.getSessionId()}&type=save`;
    }
  }
}
