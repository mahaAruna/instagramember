import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import {se}

export default class InstagramMessagesUsernameRoute extends Route {
  @service store;
  @tracked isActive;
  @service session;

  model(params) {
    let user = this.store.findRecord('user', params.user_name);
    var anotherCon = this.controllerFor('instagram.messages');
    var controller = this.controllerFor('instagram.messages.username');
    user.then((active) => {
      controller.user = active;
      controller.src = `data:image/png;base64,${active.profileUrl}`;
      this.isActive = active.isActive;
      this.getActive(controller, anotherCon);
    });

    fetch(
      `http://localhost:8080/Instagram/GetAllMessages?sessionId=${this.session.getSessionId()}&username=${params.user_name}`,
      {
        method: 'get',
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((message) => {
        controller.messageArray = [...message.messages];
        controller.newMessageArray = [];
        controller.newMessageArray = controller.messageArray.filter(
          (x, y) =>
            x.status === 'UNSEEN' && x.receiver == this.session.getUserName(),
        );
        controller.modelMessage = true;
        controller.newMessage;
        controller.content = [];
        controller.updateStatus();
      });

    return user;
  }

  getActive(controller, anotherCon) {
    if (this.isActive) {
      controller.activeStatus = 'Active Now';
    } else {
      if (anotherCon.activeTime === 'Active Now') {
        controller.activeStatus = anotherCon.activeTime;
      } else {
        controller.activeStatus = 'Active ' + anotherCon.activeTime + ' ago';
      }
    }
  }

  setupController(controller, model) {
    var anothercontroller = this.controllerFor('instagram');
    anothercontroller.isSmall = false;
  }

  deactivate() {
    var controller = this.controllerFor('instagram.messages.username');
    controller.user = '';
    controller.newMessageArray = '';
  }
}
