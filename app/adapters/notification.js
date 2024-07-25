import RestAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class NotificationAdapter extends RestAdapter {
  @service session;
  host = 'http://localhost:8080/Instagram';

  pathForType(type) {
    if (type === 'notifications') {
      return 'Notification';
    } else if (type === 'notification') {
      return 'NotificationUser';
    }
  }

  urlForFindRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL('notification');
    return `${baseUrl}?sessionId=${this.session.getSessionId()}&notificationId=${id}`;
  }
}
