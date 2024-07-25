import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class InstagramMessagesRoute extends Route {
  @service store;
  @service session;

  model() {
    var controller = this.controllerFor('instagram.messages');
    var activeUsers = this.store
      .query('user', { isActive: true })
      .then((activers) => {
        controller.activeUsers = [...activers];
      });

    var user = this.store
      .findRecord('user', this.session.getUserName())
      .then((user) => {
        controller.user = user;
      });

    fetch(
      `http://localhost:8080/Instagram/GetAllChats?sessionId=${this.session.getSessionId()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((chatJson) => {
        controller.chats = chatJson.chats;
      });
  }

  setupController(controller, model) {
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.currentPath = 'instagram.messages';
    anothercontroller.getColor('instagram.messages');
    anothercontroller.isSmall = false;
  }
}
