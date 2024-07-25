import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramMessageController extends Controller {
  @service session;
  @service router;
  @service store;
  @tracked user;
  @tracked isSearch = false;
  @tracked searchValue = '';
  @tracked searchArray = [];
  @tracked activeUsers = [];
  @tracked chats = [];
  @tracked isHideSearch = true;
  @service('websockets') websockets;
  socketRef = null;
  @tracked activeTime;

  @action
  changeToSearch(event) {
    event.stopPropagation();
    this.isSearch = true;

  }

  @action
  getUserName() {
    this.store.findRecord('user', this.session.getUserName());
  }

  @action
  stopHide(event){
    console.log('in focus');
    event.stopPropagation();
    this.isHideSearch = false;
  }

  @action
  callForSearch(event) {
    event.stopPropagation();
    this.isSearch = true;

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
        this.searchArray = data.users;
      });
  }
  constructor() {
    super(...arguments);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );
    socket.on('message', this.myMessageHandler, this);

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
    if (message.type === 'UserStatus') {
      if (message.isActive) {
        this.activeUsers = [...this.activeUsers, message.user];
      } else {
        this.activeUsers = this.activeUsers.filter(
          (x, y) => x.userName !== message.user.userName,
        );
      }
    }
  }

  processTextMessage(message) {}

  @action
  changePage(path, param, value) {
    this.router.transitionTo(path, param);
    this.isSearch = false;
    this.activeTime = value;
  }

  @action
  hideSearch() {
    console.log('in hide Search');
    console.log(this.isHideSearch, 'hideSearch');
    if(this.isHideSearch){
      this.isSearch = false;
    }
    else{
      this.isSearch = true;
    }
    this.isHideSearch = true;
  }


  @action
  getSrc(src) {
    return `data:image/png;base64,${src}`;
  }

  @action
  check(username) {
    return this.session.getUserName() != username;
  }

  @action
  getLastSeen(lastSeenTimeString, message) {
    if (lastSeenTimeString) {
      var time = this.getTime(lastSeenTimeString);
      if (time == 'Active Now') {
        return time;
      } else {
        return `Active ${time} ago`;
      }
    } else {
      return this.getMessage(message);
    }
  }

  @action
  getTime(time) {
    if (time) {
      const lastSeenTime = new Date(time);
      const currentTime = new Date();
      const timeDifferenceMs = currentTime - lastSeenTime;
      const timeDifferenceHours = timeDifferenceMs / 3600000;
      const timeDifferenceMinutes = timeDifferenceMs / 60000;
      const hours = Math.floor(timeDifferenceMinutes / 60);
      const minutes = Math.floor(timeDifferenceMinutes % 60);

      if (hours > 0) {
        return hours + 'h';
      } else if (minutes > 0) {
        return minutes + 'min';
      } else if (minutes === 0) {
        return 'Active Now';
      }
    } else {
      return 'Active Now';
    }
  }

  @action
  getMessage(message) {
    if (message.sender === +this.session.getUserName()) {
      var time = this.getTime(message.sendTime);
      return `${message.messageText}   •    ${time}`;
    } else if (message.receiver === +this.session.getUserName()) {
      var time = this.getTime(message.sendTime);
      return `${message.messageText}  •  ${time}`;
    }
  }
}
