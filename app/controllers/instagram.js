import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InstagramController extends Controller {
  @service router;

  @service session;
  @service store;
  @tracked isSearch = false;
  @tracked isConfirm = false;
  @tracked searchValue = '';
  @tracked search = [];
  @tracked isShowNotification = false;
  @tracked isNotification = false;
  @tracked notificationCount;
  @tracked notification;
  @tracked notificationContent = 'Follow';
  @tracked notifyObj = {};
  @tracked user;
  @tracked messageText;
  @tracked isFollowBack = false;
  @service('websockets') websockets;
  @tracked messageContent;
  @tracked messageNotify = false;
  socketRef = null;
  @tracked message;
  @tracked currentPath = 'instagram.home';
  @tracked isSmall = true;
  @tracked notify;
  @tracked notifyProfile;
  @tracked notificationIds;
  @action
  changePage(path, param) {
    // event.stopPropagation();
    this.searchValue = '';
    this.isSearch = false;
    this.isNotification = false;
    this.currentPath = path;
    this.getColor(path);
    this.isSmall = true;
    if (
      path === 'instagram.messages' ||
      path === 'instagram.messages.username'
    ) {
      this.isSmall = false;
    }
    if (path === 'instagram.search') {
      this.isSearch = true;
      this.currentPath = path;
      this.isSmall = false;
      this.getColor(path);
    } else if (path === 'instagram.notifications') {
      this.isSmall = false;
      this.isNotification = true;
      this.currentPath = path;
      this.getColor(path);
      this.changeNotify();
    } else {
      if (param) {
        this.router.transitionTo(path, param);
      } else {
        this.router.transitionTo(path);
      }
    }
  }

  @action
  callForSearch() {
    fetch(
      `http://localhost:8080/Instagram/Search?sessionId=${this.session.getSessionId()}&search=${this.searchValue}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new error();
        }
        return response.json();
      })
      .then((data) => {
        this.search = data.users;
      });
  }

  @action
  hide() {
    this.isSearch = false;
    this.isNotification = false;
    if(this.currentPath === 'instagram.messages'){
      this.isSmall = false;
    }
    else{
    this.isSmall = true;
    
    this.currentPath = 'instagram.home';
    this.getColor('instagram.home');
    }
  }

  constructor() {
    super(...arguments);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  }

  myOpenHandler(event) {
    this.sendUserOpened();
    this.getCountNotify();
    console.log(`On open event has been called: ${event}`);
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
      this.isShowNotification = true;
      setTimeout(() => {
        this.isShowNotification = false;
      }, 5000);
      this.notify = message.Requested;
      this.notificationContent = 'Confirm';
    }
    if (message.type === 'Following') {
      this.isShowNotification = true;
      setTimeout(() => {
        this.isShowNotification = false;
      }, 5000);
      this.notify = message.Following;
      this.notificationContent = 'Follow Back';
    }
    if (message.type === 'FollowBack') {
      this.isShowNotification = false;
      this.message = message;
      this.notificationContent = 'Follow Back';
    }
    if (message.type === 'UserStatus') {
    }
    if (message.type === 'Message') {
      this.isShowNotification = true;
      this.messageNotify = true;
      this.messageContent = message.messageJson;
      this.notify = message.notifyJson;
      setTimeout(() => {
        this.isShowNotification = false;
      }, 5000);
    }
    if (message.type === 'Like') {
      this.isShowNotification = true;
      this.notify = message.Like;
      setTimeout(() => {
        this.isShowNotification = false;
      }, 5000);
    }
    if (message.type === 'Comment') {
      this.isShowNotification = true;
      this.notify = message.Comment;
      setTimeout(() => {
        this.isShowNotification = false;
      }, 50000);
    }
  }

  processTextMessage(message) {
    if (message.includes('Requested')) {
      var arr = message.split(' ');
      this.getNotificationContent('Requested');
      this.notificationContent = 'Requested';
    }
    if (message.includes('Following')) {
      var arr = message.split(' ');
      this.notificationContent = 'Following';
      this.getNotificationContent('Following');
      this.getValue(this.notificationContent);
    }
  }
  myCloseHandler(event) {
    var json = {
      type: 'Close',
    };
    this.socketRef.send(JSON.stringify(json));
  }

  @action
  sendButtonPressed() {
    this.socketRef.send('Hello Websocket World');
  }

  sendUserOpened() {
    let postDetails = { username: this.session.getUserName(), reason: 'add' };
    const postMessage = {
      type: 'user',
      user: postDetails,
    };
    this.socketRef.send(JSON.stringify(postMessage));
  }

  @action
  getCountNotify() {
    if (this.session.getSessionId() != null) {
      fetch(
        `http://localhost:8080/Instagram/Instagram?sessionId=${this.session.getSessionId()}`,
        {
          method: 'get',
        },
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.notificationIds = data.user.notifyIds;
          this.fetchForNotify();
        });
    }
  }

  @action
  changeNotify(path, param) {
    if (this.notify && this.notify.type === 'MESSAGE') {
      this.router.transitionTo(path, param);
    } else {
      this.isNotification = true;
      this.currentPath = 'instagram.notifications';
      this.getColor('instagram.notifications');
      fetch(
        `http://localhost:8080/Instagram/Notification?sessionId=${this.session.getSessionId()}&userName=${this.session.getUserName()}`,
        {
          method: 'get',
        },
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.notification = data.notification;
        });
    }
  }

  @action
  sendConfirmationRequest(username) {
    if (this.notificationContent === 'Confirm') {
      const json = {
        userName: username,
        reason: 'Confirm',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
    if (
      this.notificationContent === 'Follow' ||
      this.notificationContent === 'Follow Back'
    ) {
      const json = {
        userName: username,
        reason: 'Follow',
      };
      this.socketRef.send(JSON.stringify({ type: 'follow', follow: json }));
    }
  }

  @action
  getNotificationContent(content) {
    console.log('vonte' , content);
    if (content === 'Confirm') {
      this.notificationContent = 'Confirm';
      return 'Confirm';
    }
    else if (content === 'Follow'){
      // this.notificationContent = ''
      return 'Follow Back'
    } 
    else if (content === 'Follow Back') {
      this.notificationContent = 'Following';
      return 'Following';
    } else if (content === 'Following') {
      return 'Following';
    } else if (content === 'Requested') {
      return 'Requested';
    }
  }

  @action
  async fetchForNotify() {
    for (const element of this.notificationIds) {
      this.isShowNotification = true;

      try {
        const notify = await this.store.findRecord('notification', element);
        this.notify = notify;

        if (notify.type === 'Message') {
          var message = await this.store.peekRecord(
            'message',
            notify.message.id,
          );
          this.messageText = message.messageText;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.isShowNotification = false;
      } catch (error) {
        console.error('Error fetching notification:', error);
        this.isShowNotification = false;
      }
    }
  }

  @action
  getIsNotify(type) {
    return type !== 'MESSAGE';
  }

  @action
  getSrc(profileUrl) {
    if (profileUrl) {
      if (typeof profileUrl === 'string') {
        return `data:image/png;base64,${profileUrl}`;
      } else {
        return `data:image/png;base64,${profileUrl[0]}`;
      }
    }
  }

  @action
  getValue(content) {
    if (content == 'post' || content == 'Comment' || content == 'comment') {
      return false;
    }
    return true;
  }

  @action
  getPage(type, name, post) {
    if (type === 'LIKE' || type === 'COMMENT') {
      return this.changePage('instagram.post', post);
    }
  }

  @action
  getCommentText(notify) {
    if (notify.comment) {
      return notify.comment.commentText;
    }
  }

  @action
  getColor(path) {
    if (this.currentPath === path) {
      return true;
    }
    return false;
  }

  @action
  closeSearch() {
    this.searchValue = '';
  }

  @action
  hideSearch(){
    this.isSearch = false;
  }
}
