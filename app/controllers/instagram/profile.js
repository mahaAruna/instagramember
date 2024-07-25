import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class InstagramProfileController extends Controller {
  @service('websockets') websockets;
  @service session;
  @service router;
  @tracked isFollowing = true;
  @tracked isMyProfile;
  @tracked user = this.model;
  @tracked followerCount = this.user.followersuser.length;
  @tracked followingCount = this.user.followingsuser.length;
  @tracked postCount = this.user.post.length;
  @tracked isPrivate;
  @tracked isFollowBack = false;
  @tracked showUnFollow = false;
  @tracked isConfirm = 'Follow';
  @tracked activeClass;
  @tracked src;
  @tracked postList;
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

  @action
  changePage(path) {
    this.router.transitionTo(path);
  }
  @action
  isAccountPrivate(isPrivate) {
    this.set('isaccountPrivate', isPrivate);
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
    if (message.type === 'Requested') {
      if (message.userName === this.user.userName) {
        this.isConfirm = 'Confirm';
      }
      this.isConfirm = 'Confirm';
    }
    if (message.type === 'FollowBack') {
      if (message.userName === this.user.userName) {
        this.isConfirm = 'Follow Back';
      }
    }
    if (message.type === 'UserStatus') {
      if (message.userName === this.user.userName) {
        this.activeClass = 'addGreen';
      }
    }
  }

  processTextMessage(message) {
    if (message.includes('Requested')) {
      var arr = message.split(' ');
      if (arr[1] === this.user.userName) {
        this.isConfirm = 'Requested';
      }
    }
    if (message.includes('Following')) {
      var arr = message.split(' ');
      if (arr[1] === this.user.userName) {
        this.isConfirm = 'Following';
      }
    }
  }

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  }

  @action
  sendConfirmationRequest(username) {
    if (this.isConfirm === 'Confirm') {
      const json = {
        userName: username,
        reason: 'Confirm',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
    if (this.isConfirm === 'Follow' || this.isConfirm === 'Follow Back') {
      const json = {
        userName: username,
        reason: 'Follow',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
  }

  @action
  setUnFollow() {
    return `If you change your mind, you will have to request to follow ${this.user.userName} 'again`;
  }

  @action
  onUnFollow() {
    var json = {
      userName: this.user.userName,
      reason: 'unFollow',
      isConfirm: 'false',
    };
    this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
  }

  @action
  changeToMessage() {
    this.router.transitionTo('instagram.messages.username', this.user.id);
  }
}
