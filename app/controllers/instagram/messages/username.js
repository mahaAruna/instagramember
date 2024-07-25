import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramMessagesUsernameController extends Controller {
  @service router;
  @service session;
  @service store;
  @tracked newMessage;
  @tracked user = this.model;
  @tracked iconshow = true;
  @tracked text = '';
  @tracked showSend = false;
  @tracked textDiv = false;
  @tracked showmessage = false;
  @tracked content = [];
  @tracked messageArray = [];
  @tracked isMessageEmoji = false;
  @tracked isShowReactionRemoveBox = false;
  @tracked activeStatus;
  @tracked emojis = [];
  @tracked isReactionChange = false;
  @tracked newMessageArray = [];
  @tracked showSeenTime = false;
  @tracked isShowEmoji = false;
  @tracked isSeen = false;
  @tracked postSrc;
  @tracked getIsPost = false;
  @tracked replyId = 0;
  @tracked isShowReactEmoji = false;
  @tracked isClicked = false;
  //   @tracked src = `data:image/png;base64,${this.user.profileUrl}`;
  @tracked src;
  @service('websockets') websockets;
  @tracked postMap = new Map();
  @tracked postUser = new Map();
  socketRef = null;
  @tracked rightContent = false;
  @tracked modelMessage = false;
  @tracked forReply;
  @tracked isShowForwardBox = false;

  @action
  hideIcon(event) {
    if (this.text.length > 0) {
      this.iconshow = false;
      this.showSend = true;
    }
  }

  @action
  hide() {
    this.isShowEmoji = false;
    this.isShowReactEmoji = 0;
    this.isClicked = false;
  }

  constructor() {
    super(...arguments);
    this.getReactionClass = this.getReactionClass.bind(this);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  }

  myOpenHandler() {}

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
    if (message.type === 'Message') {
      this.showmessage = true;
      this.content = [...this.content, message.messageJson];
      // this.messageArray = [...this.messageArray, message.messageJson]
      if (message.messageJson.sender.id == this.user.id) {
        this.newMessageArray = [];
        this.isSeen = true;
        this.updateStatus(message.messageJson.id);
      }
    }
    if (message.type === 'Send') {
      this.showmessage = true;
      // this.messageArray = [...this.messageArray, message.Send]
    }
    if (message.type === 'Reaction') {
      var messageId = message.Reaction.id;
      this.messageArray.filter((x, y) => {
        x.id == messageId ? (x.reaction = message.Reaction.reaction) : '';
      });
      this.isReactionChange = true;
    }
  }

  processTextMessage(message) {
    if (message === 'Sended') {
      this.rightContent = false;
    }
  }
  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  }

  @action
  sendMessage() {
    this.isShowEmoji = false;
    this.rightContent = false;
    this.showmessage = true;
    this.textDiv = true;
    let currentTime = new Date();
    if (this.text && this.text !== '') {
      var message = {
        reason: 'send',
        messageText: this.text,
        receiver: this.user.id,
        replyId: this.replyId,
        senderTime: currentTime.toString(),
        receiverTime: '',
        postId: 0,
        reaction: ''
      };
      this.socketRef.send(
        JSON.stringify({ type: 'message', message: message }),
      );
      this.content = [...this.content, message];
      this.showSeenTime = true;
      this.text = '';
      this.isShowForwardBox = false;
    }
  }

  @action
  getSrc(id, type) {
    if (type === 'post') {
      if (this.postMap.has(id)) {
        var postImage = this.postMap.get(id).imageUrl[0];
        return `data:image/png;base64,${postImage.substring(0, postImage.indexOf('*'))}`;
      }
    }
    if (type === 'userImage') {
      if (this.postUser.has(id)) {
        var userImage = this.postUser.get(id).profileUrl;
        return `data:image/png;base64,${userImage}`;
      }
    }
    if (type === 'userName') {
      if (this.postUser.has(id)) {
        return this.postUser.get(id).userName;
      }
    }
  }

  @action
  changeToProfile(path) {
    this.modelMessage = false;
    this.router.transitionTo(path, this.user.id);
  }

  @action
  getClass(id) {
    return id + '' === this.session.getUserName();
  }

  @action
  showEmoji(type, id, event) {
    this.isClicked = true;
    var access_key = '1a2b4074ce3a7c7adfcac669e3b4814027e8d215';
    fetch(`https://emoji-api.com/emojis?access_key=${access_key}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (type === 'react') {
          this.isShowReactEmoji = id;
          this.isClicked = true;
        } else {
          this.isShowEmoji = true;
          this.isMessageEmoji = true;
        }
        this.emojis = data;
      });
  }

  @action
  isNewMessage(message) {
    return (
      this.getClass(message.receiver) &&
      this.newMessageArray.indexOf(message) === 0
    );
  }

  @action
  updateStatus(id) {
    if (this.isSeen) {
      this.store.findRecord('message', id).then((message) => {
        message.status = 'SEEN';
        message.save();
        this.newMessage = message;
      });
    } else {
      for (let i = 0; i < this.newMessageArray.length; i++) {
        var message = this.store
          .findRecord('message', this.newMessageArray[i].id)
          .then((message) => {
            message.status = 'SEEN';
            message.save();
          });
      }
    }
    this.showSeenTime = true;
  }

  @action
  getSeenTime() {
    if (this.newMessage) {
      if (this.newMessage.receiver.id + '' !== this.session.getUserName()) {
        var time = this.getTime(this.newMessage.recieveTime);
        return time;
      }
    } else if (this.newMessageArray.length > 0) {
      var lastMessage = this.newMessageArray.pop();
      if (lastMessage.receiver + '' !== this.user.id) {
        var time = this.getTime(lastMessage.recieveTime);
        return time;
      }
    } else if (this.messageArray.length > 0) {
      var lastMessage = this.messageArray.pop();
      if (lastMessage.receiver + '' !== this.session.getUserName()) {
        var time = this.getTime(lastMessage.recieveTime);
        return time;
      }
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
        return `Seen ${hours} h ago`;
      } else if (minutes > 0) {
        return `Seen ${minutes} min ago`;
      } else if (minutes === 0) {
        return 'Seen Just Now';
      } else {
        return 'Seen Just Now';
      }
    } else {
      return '';
    }
  }

  @action
  setText(emoji) {
    this.text += emoji;
  }

  @action
  isPost(message) {
    if (message.post) {
      return true;
    }
    return false;
  }

  @action
  async fetchPostSrc(message) {
    if (message.post) {
      let post = await this.store.findRecord('post', message.post);
      this.postMap.set(message.id, post);
      let user = await this.store.findRecord('user', post.user.id);
      this.postUser.set(message.post, user);
      this.getIsPost = true;
    }
  }

  @action
  showReel(id) {
    if (this.postMap.has(id)) {
      this.router.transitionTo('instagram.post', this.postMap.get(id).id);
    }
  }

  @action
  scrollDown(element) {
    var parent = element.parentNode;
    parent.scrollIntoView({ block: 'end' });
  }

  @action
  replyMessage(message, event) {
    this.isShowForwardBox = true;
    event.stopPropagation();
    this.forReply = message.messageText;
    this.replyId = message.id;
  }

  @action
  getIsNotEmpty(text) {
    if (text !== '') {
      return true;
    }
    return false;
  }

  @action
  closeReply() {
    this.isShowForwardBox = false;
  }

  @action
  getIsReply(id) {
    if (id > 0) {
      return true;
    }
    return false;
  }

  @action
  getReplyText(id) {
    var maha = this.messageArray.filter((x, y) => {
      if (x.id === id) {
        return x;
      }
    });
    return maha[0].messageText != '' ? maha[0].messageText : '';
  }

  @action
  getReplyUser(id, text, type) {

    if (type === 'current' && text.user) {
      console.log('in');
      if (text.user.id == +this.session.getUserName()) {
        var message = this.messageArray.filter((x, y) => {
          if (x.id === id) {
            return x;
          }
        });
        if (message[0].receiver != +this.session.getUserName()) {
          return `${this.user.name} replied to you`;
        } else {
          return `${this.user.name} replied to themself`;
        }
      }
    } else if (text.receiver == +this.session.getUserName()) {
      console.log('in in');
      var message = this.messageArray.filter((x, y) => {
        if (x.id === id) {
          return x;
        }
      });

      if (message[0].receiver != +this.session.getUserName()) {
        return `${this.user.name} replied to you`;
      } else {
        return `${this.user.name} replied to themself`;
      }
    } else {
      console.log('in in in');
      console.log('messagearray ', this.messageArray);
      var message = this.messageArray.filter((x, y) => {
        if (x.id === id) {
          console.log(x , 'x');
          return x;
        }
      });
      if (message[0].receiver != +this.session.getUserName()) {
        return 'You replied to yourself';
      } else {
        return `You replied to ${this.user.name}`;
      }
    }
  }

  @action
  getIsReactEmoji(id) {
    return this.isShowReactEmoji === id;
  }

  @action
  setIsReactEmoji(id) {
    if (!this.isClicked && !this.isMessageEmoji) {
      this.emojis = '';
      this.isShowReactEmoji = id;
    }
  }

  @action
  getIsReaction(text) {
    return text.reaction !== '' ? true : false;
  }

  @action
  getReaction(reaction) {
    return reaction;
  }

  @action
  addReaction(messageId, reaction) {
    var message = {
      reason: 'addReaction',
      id: messageId,
      reaction: reaction,
      receiver: this.user.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'message', message: message }));
  }

  getReactionClass(text) {
    if (
      this.getIsReply(text.replyId) &&
      text.receiver === +this.session.getUserName()
    ) {
      return 'reactionBox senderReaction replySenderReaction';
    } else if (
      !this.getIsReply(text.replyId) &&
      text.receiver === +this.session.getUserName()
    ) {
      return 'reactionBox senderReaction';
    } else if (this.getIsReply(text.replyId)) {
      return 'reactionBox replyReactionBox';
    } else {
      return 'reactionBox';
    }
  }

  @action
  showRemoveBox(event) {
    event.stopPropagation();
    this.isShowReactionRemoveBox = true;
  }
}
