import RestAdapter from '@ember-data/adapter/rest';
import { service } from '@ember/service';

export default class MessageAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram';

  pathForType(type) {
    if (type === 'messages') {
      return 'GetAllMessages';
    } else if (type === 'get') {
      return 'MessageServlet';
    } else if (type === 'update') {
      return 'MessageServlet';
    }
  }

  urlForFindAll(modelName, snapshot) {
    var id = snapshot.adapterOptions.username;
    let baseUrl = this.buildURL('messages');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&username=${id}`;
  }

  urlForFindRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('get');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&messageId=${id}&type=get`;
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('update');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&messageId=${id}&type=update`;
  }
}
