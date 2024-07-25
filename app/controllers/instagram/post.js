import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class InstagramPostController extends Controller {
  @service router;
  @service session;
  @service store;
  @tracked post = this.model;
  @tracked user;
  @tracked commentText;
  @tracked commentUsers = new Map();
  @tracked comments;
  @tracked isShowShareList = false;
  // @tracked showComment = false;
  // @tracked newComments = [];
  @service('websockets') websockets;
  @tracked postArray = [];
  @tracked search;
  @tracked searchValue = '';
  @tracked shareList;
  @tracked messageText = '';
  @tracked selectedShareList;
  @tracked isSelected = false;

  socketRef = null;

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

  async processJsonMessage(message) {
    if (message.type === 'comment') {
      this.comments = [...this.comments, message.comment];
      // this.showComment = true;
      await this.store
        .findRecord('user', message.comment.user.id)
        .then((user) => {
          if (!this.commentUsers.has(message.comment.user.id + '')) {
            this.commentUsers.set(message.comment.user.id + '', user);
          }
        });
      this.commentText = '';
    }
    if (message.type === 'Send') {
      this.isShowShareList = false;
    }
  }

  processTextMessage(message) {
    if (message.includes('likeId comment')) {
      var arr = message.split(' ');
      var comment = this.comments.filter((x, y) => {
        return x.id == arr[2];
      });
    }
    if (message.includes('removeliked comment')) {
      var arr = message.split(' ');
      var comment = this.comments.filter((x, y) => {
        return x.id == arr[2];
      });
    }
    if (message.includes('Saved')) {
      var postId = message.split(' ')[1];
      // var post = this.post.filter((x) => x.id == postId);
      this.post.isSaved = true;
      // this.getIsSaved(post[0]);
    }
    if (message.includes('RemoveSaved')) {
      // var postId = message.split(' ')[1];
      // var post = this.post.filter((x) => x.id == postId);
      this.post.isSaved = false;
      // this.getIsSaved(post[0]);
    }
  }

  myCloseHandler(event) {
    var json = {
      type: 'Close',
    };
    this.socketRef.send(JSON.stringify(json));
  }

  @action
  setShowShareList(currentPost) {
    // this.currentPost = currentPost;
    this.search = [];
    this.selectedShareList = [];
    this.isShowShareList = true;
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
        this.shareList = chatJson.chats;
      });
  }

  @action
  getSrc(imageUrl) {
    if (typeof imageUrl === 'string') {
      return `data:image/png;base64,${imageUrl}`;
    } else {
      return `data:image/png;base64,${imageUrl[0].substring(0, imageUrl[0].indexOf('*'))}`;
    }
  }

  @action
  changeToHome() {
    window.history.back();
    // this.router.replaceWith('instagram.home');
  }

  @action
  getCommentUserProfile(id, want) {
    console.log('in getCommengt');
    console.log('id ', id);
    console.log(this.commentUsers);
    console.log('want ', want);
    if (this.commentUsers.has(id + '')) {
      console.log('in');
      if (want === 'userName') {
        console.log('userName');
        console.log(this.commentUsers.get(id+ '').userName);
        return this.commentUsers.get(id + '').userName;
      } else if (want === 'profile') {
        return `data:image/png;base64,${this.commentUsers.get(id + '').profileUrl}`;
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
        return hours + 'h';
      } else if (minutes > 0) {
        return minutes + 'min';
      } else if (minutes === 0) {
        return '';
      }
    } else {
      return '';
    }
  }

  @action
  addLike(event, comment) {
    event.stopPropagation();
    const like = {
      reason: 'add',
      user: this.session.getUserName(),
      type: 'comment',
      comment: comment.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
    comment.likesCount = [...comment.likesCount, +this.session.getUserName()];
    this.getIsLike(comment.likesCount, true);
  }

  @action
  removeLike(event, comment) {
    event.stopPropagation();
    const like = {
      reason: 'remove',
      user: this.session.getUserName(),
      type: 'comment',
      comment: comment.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
    comment.likesCount = comment.likesCount.filter(
      (user) => user != this.session.getUserName(),
    );
    this.getIsLike(comment.likesCount, true);
  }

  @action
  getProfileId(comment) {
    return comment.user.id;
    // this.router.transitionTo('instagram.profile', )
  }

  @action
  getIsLike(likesCount, forceUpdate = false) {
    if (forceUpdate && likesCount) {
      return likesCount.includes(+this.session.getUserName());
    } else {
      return false;
    }
  }

  // @action
  // addLikePost(post) {
  //   var like = {
  //     reason: 'add',
  //     user: this.session.getUserName(),
  //     type: 'post',
  //     post: post.id,
  //   };
  //   this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
  //   this.post.likesCount = [
  //     ...this.post.likesCount,
  //     +this.session.getUserName(),
  //   ];
  //   this.getIsLike(this.post.likesCount, true);
  // }

  // @action
  // removeLikePost(post) {
  //   // this.redheart = false;
  //   var like = {
  //     reason: 'remove',
  //     user: this.session.getUserName(),
  //     type: 'post',
  //     post: post.id,
  //   };
  //   this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
  //   this.post.likesCount = this.post.likesCount.filter((x, y) => {
  //     return x != this.session.getUserName();
  //   });
  //   this.getIsLike(this.post.likesCount, false);
  // }

  @action
  sendComment() {
    this.showComment = true;
    var comment = {
      reason: 'new',
      commentText: this.commentText,
      postId: this.post.id,
      commentParentId: 0,
    };
    this.socketRef.send(JSON.stringify({ type: 'comment', comment: comment }));
  }

  @action
  getshowSideBar() {
    return this.postArray.length > 0;
  }

  @action
  changeNext(event) {
    var post = this.postArray.filter((x, y) => {
      if (x.id === this.post.id) {
        this.router.transitionTo('instagram.post', this.postArray[y + 1].id);
      }
    });
  }

  @action
  noDisplay(event) {
    if (event.target.tagName !== 'INPUT') {
      event.stopPropagation();
      this.isShowShareList = false;
    }
  }

  @action
  getFollow(id) {
    var follows = this.user.followingsuser;
  }
  @action
  addShareList(id, event) {
    console.log('in addShareList');
    event.stopPropagation();
    // this.selectedShareList = [...this.selectedShareList, ]
    console.log('isSelectec', this.isSelected);
    // this.isSelected = true;
    console.log('isSelected', this.isSelected);
    // if (this.isSelected) {
    this.selectedShareList.push(id);
    this.getIsSelected(id);
    // }
    this.notifyPropertyChange('selectedShareList');
  }

  @action
  removeShareList(id, event) {
    // if (!this.isSelected) {
    this.selectedShareList = this.selectedShareList.filter((x, y) => x !== id);
    // }
  }

  @action
  getIsSelected(id) {
    console.log('getIsSelected ');
    console.log(this.selectedShareList);
    console.log(id);
    // if (this.selectedShareList.length > 0) {
    return this.selectedShareList.includes(id);
    // }
  }

  @action
  preventClose(event) {
    event.stopPropagation();
  }

  @action
  sendMessage(event) {
    event.stopPropagation();
    console.log('in sendMessage');
    let currentTime = new Date();
    if (!this.messageText) {
      this.messageText = '';
    }
    console.log(this.selectedShareList);
    for (let i = 0; i < this.selectedShareList.length; i++) {
      var message = {
        reason: 'send',
        messageText: this.messageText,
        receiver: this.selectedShareList[i],
        senderTime: currentTime.toString(),
        receiverTime: '',
        postId: this.post.id,
        replyId: 0,
        reaction: '',
      };
      this.socketRef.send(
        JSON.stringify({ type: 'message', message: message }),
      );
    }
  }

  @action
  myfun(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  @action
  callForSearch(event) {
    this.searchValue = event.target.value;
    event.stopPropagation();
    event.stopImmediatePropagation();
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

  // @action
  // setShowShareList(currentPost) {
  //   this.search = [];
  //   this.selectedShareList = [];
  //   this.isShowShareList = true;
  //   fetch(
  //     `http://localhost:8080/Instagram/GetAllChats?sessionId=${this.session.getSessionId()}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   )
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((chatJson) => {
  //       this.shareList = chatJson.chats;
  //     });
  // }
}
