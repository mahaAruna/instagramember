import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramProfileFollowingsController extends Controller {
  @tracked followings = this.model;
  @service session;
  @service router;
  @tracked isHide = false;
  @tracked currentuser;
  @tracked isConfirm = 'Following';
  @service('websockets') websockets;
  @tracked showUnFollow = false;

  socketRef = null;
  constructor() {
    super(...arguments);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );

    // socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  }

  myMessageHandler(event) {
    let message;
    try {
      message = JSON.parse(event.data);
      console.log('JSON Message:', message);
    } catch (error) {
      message = event.data;
      console.log('Text Message:', message);
    }

    if (typeof message === 'object' && message.type) {
      this.processJsonMessage(message);
    } else if (typeof message === 'string') {
      this.processTextMessage(message);
    }
  }

  processJsonMessage(message) {}

  processTextMessage(message) {
    if (message.includes('unfollowed')) {
      this.isConfirm = 'Follow';
      var arr = message.split(' ');
      var name = arr[1];
      this.followings = this.followings.filter((x, y) => {
        return x.userName != name;
      });
      this.showUnFollow = false;
    }
  }

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  }

  @action
  changePage(path, param, follow) {
    this.isHide = false;
    this.currentuser = follow;
    this.router.transitionTo(path, param);
  }

  @action
  hide() {
    this.isHide = true;
    if (this.isHide) {
      this.router.transitionTo(
        'instagram.profile',
        this.currentuser ? this.currentuser.id : this.session.getUserName(),
      );
    }
  }

  @action
  unFollow(event) {
    event.stopPropagation();
    const json = {
      userName: this.currentuser.id,
      reason: 'unFollow',
    };
    this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
  }

  @action
  showBox(user, event) {
    this.currentuser = user;
    event.stopPropagation();
    this.showUnFollow = true;
  }

  @action
  setUnFollow() {
    return `If you change your mind, you will have to request to follow ${this.currentuser.userName} again`;
  }

  @action
  getImage(path) {
    return `data:image/png;base64,${path}`;
  }
}
