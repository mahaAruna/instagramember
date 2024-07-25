import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramProfileFollowersController extends Controller {
  @tracked followers = this.model;
  @service session;
  @service router;
  @tracked isConfirm = 'Follow';
  @tracked isHide = false;
  @tracked currentuser;
  @tracked currentUserName;
  // @tracked name =

  @tracked followingId;
  @service('websockets') websockets;

  socketRef = null;
  constructor() {
    super(...arguments);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );
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

  processJsonMessage(message) {
    // if(message.includes('Requested')){
    //     this.isConfirm = 'Requested'
    // }
    // if(message.type)
  }

  processTextMessage(message) {
    if (message.includes('/removed')) {
      var arr = message.split(' ');
      var name = arr[1];
      this.followers = this.followers.filter((x, y) => {
        x.userName !== name;
      });
    }
    if (message.includes('Requested')) {
      this.isConfirm = 'Requested';
      var arr = message.split(' ');

      this.currentUserName = arr[1];
    }
  }

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  }

  @action
  changePage(path, param, follow) {
    this.isHide = false;
    this.currentuser = follow;
    if (this.isChangeProfile) {
      this.router.transitionTo(path, param);
    }
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
  removeFollower(userName, event) {
    event.stopPropagation();
    const json = {
      userName: userName,
      reason: 'Remove',
    };
    this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
  }

  @action
  getImage(path) {
    return `data:image/png;base64,${path}`;
  }

  @action
  getIsFollow(id) {
    if (this.followingId.includes(id)) {
      return false;
    }
    return true;
  }

  @action
  sendConfirmationRequest(username, event) {
    event.stopPropagation();
    if (this.isConfirm === 'Confirm') {
      const json = {
        userName: username,
        reason: 'Confirm',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
    // if(this.isConfirm === 'Follow Back'){

    // }
    if (this.isConfirm === 'Follow' || this.isConfirm === 'Follow Back') {
      const json = {
        userName: username,
        reason: 'Follow',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
  }

  // @action
  // setCurrentUser(){
  //     this.currentuser
  // }

  @action
  getIsConfirm(username) {
    if (this.currentUserName && username === this.currentUserName) {
      return 'Requested';
    }
    return 'Follow';
  }
}
