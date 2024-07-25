import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { didInsert } from '@ember/modifier';

export default class InstagramReelsController extends Controller {
  @service session;
  @service store;
  @tracked reels;
  @tracked users = new Map();
  @tracked showComment = false;
  @tracked currentCommentId = null;
  @service('websockets') websockets;
  socketRef = null;
  @tracked commentUsers = new Map();
  @tracked comments;
  @tracked commentText;
  @tracked commentList;
  @tracked commentCurrent;
  @tracked showCurrentComment;
@tracked searchValue;
@tracked searchValue;
  @tracked search;
  @tracked isShowShareList;
  @tracked shareList;
  @tracked selectedShareList;
  @tracked isSelected = false;
  @tracked messageText = '';

  @action
  changePage(path, param) {
    this.router.transitionTo(path, param);
  }
  constructor() {
    super(...arguments);

    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
      // 'ws://instagram.zcodeusers.in/Instagram/WebsocketSample'
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

  processJsonMessage(message) {
    if (message.type === 'Post') {
      var newPost = message.Post;
      this.store.findRecord('user', newPost.user.id).then((users) => {
        this.users.set(newPost.user.id, users);
      });
      this.post = [...this.post, newPost];
    }
    if (message.type === 'comment') {
      this.comments = [...this.comments, message.comment];
      this.showComment = true;
      this.commentText = '';
    }
    if(message.type === 'Send'){
      this.isShowShareList = false;
    }
    
  }

  processTextMessage(message) {
    if (message.includes('Requested')) {
      var arr = message.split(' ');
      this.notificationContent = 'Requested';
    }
    if (message.includes('Following')) {
      var arr = message.split(' ');
      this.notificationContent = 'Following';
    }
    if (message.includes('likeId comment')) {
      var arr = message.split(' ');
      var comment = this.commentLwist.filter((x, y) => {
        return x.id == arr[2];
      });
      // post.likesCount = post[0].likesCount.add(+this.session.getUserName())
      comment[0].likesCount = [
        ...comment[0].likesCount,
        +this.session.getUserName(),
      ];
      this.getIsLike(comment[0].likesCount, true);
    }
    if (message.includes('removeliked comment')) {
      var arr = message.split(' ');
      var comment = this.commentList.filter((x, y) => {
        return x.user.id == arr[2];
      });
      comment[0].likesCount = comment[0].likesCount.filter((x, y) => {
        return x != +this.session.getUserName();
      });
      this.getIsLike(comment[0].likesCount, false);
    }

    if (message.includes('Saved')) {
      var postId = message.split(' ')[1];
      var post = this.reels.filter((x) => x.id == postId);
      post[0].isSaved = true;
      // this.getIsSaved(post[0]);
    }
    if (message.includes('RemoveSaved')) {
      var postId = message.split(' ')[1];
      var post = this.reels.filter((x) => x.id == postId);
      post[0].isSaved = false;
      // this.getIsSaved(post[0]);
    }
  }

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
    var json = {
      type: 'Close',
    };
    this.socketRef.send(JSON.stringify(json));
  }

  @action
  getSrc(imageUrl) {
    if(!imageUrl){
      return ''
    }
    else if (typeof imageUrl === 'string') {
      return `data:image/png;base64,${imageUrl}`;
    } 
    else {
      return `data:image/png;base64,${imageUrl[0].substring(0, imageUrl[0].indexOf('*'))}`;
    }
  }

  @action
  check(id, want) {
    if (this.users.has(id + '')) {
      if (want === 'userName') {
        return this.users.get(id + '').userName;
      } else if (want === 'profile') {
        return `data:image/png;base64,${this.users.get(id + '').profileUrl}`;
      }
    }
  }

  @action
  addLike(post) {
    this.redheart = true;
    var like = {
      reason: 'add',
      user: this.session.getUserName(),
      type: 'post',
      post: post.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
    post.likesCount = [...post.likesCount, +this.session.getUserName()];
    this.getIsLike(post.likesCount, true);
  }

  @action
  removeLike(post) {
    this.redheart = false;
    var like = {
      reason: 'remove',
      user: this.session.getUserName(),
      type: 'post',
      post: post.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
    post.likesCount = post.likesCount.filter((x, y) => {
      return x != this.session.getUserName();
    });
    this.getIsLike(post.likesCount, false);
  }

  @action
  getIsLike(likesCount, forceUpdate = false) {
    if (forceUpdate) {
      return likesCount.includes(+this.session.getUserName());
    } else {
      return false;
    }
  }


  @action
  setComment(id){
    this.commentCurrent = id;

  }

  @action
  hideComment(){
    this.currentComment = null;
    this.showCurrentComment = false;
    this.getIsShow();
  }

  @action
  getIsCurrentComment(id){
    if(id){
      this.showCurrentComment = true;
    return this.commentCurrent === id;
    }
    else{
      return false;
    }
  }

  @action
  getIsShow(){
    return this.showCurrentComment
  }


  @action
  getProfileId(comment) {
    return comment.user.id;
  }

  @action
  getCommentUserProfile(id, want) {
    if (this.commentUsers.has(id + '')) {
      if (want === 'userName') {
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
async setComments(id) {
    let comments = await this.store.query('comment', { post: id });
    const userPromises = comments.map(async (comment, index) => {
        const user = await this.store.findRecord('user', comment.user.id);
        this.commentUsers.set(comment.user.id, user);
    });
    await Promise.all(userPromises);
    this.comments = comments;
}


  @action
  addLikeComment(event, comment) {
    event.stopPropagation();
    const like = {
      reason: 'add',
      user: this.session.getUserName(),
      type: 'comment',
      comment: comment.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'like', like: like }));
    comment.likesCount = [...comment.likesCount, +this.session.getUserName()];
    this.commentText = '';
    this.getIsLike(comment.likesCount, true);
  }

  @action
  removeLikeComment(event, comment) {
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
  callForComments(id) {
    this.setComments(id);
    // this.comments = [];
  }

  @action
  sendComment(post) {
    console.log('post ', post);
    console.log(this.commentText, 'commentText');
    this.showComment = true;
    var comment = {
      reason: 'new',
      commentText: this.commentText,
      postId: post.id,
      commentParentId: 0,
    };
    this.socketRef.send(JSON.stringify({ type: 'comment', comment: comment }));
  }

  @action
  over(type, event) {
    event.stopPropagation();
    let video;

    if (type === 'parent' || type === 'child') {
      let element = event.currentTarget;
      video = element.querySelector('video');
      if (video) {
        video.autoplay = true;
        video.play();
      }
    }
  }

  @action
  stop(type, event) {
    event.stopPropagation();
    let video;

    if (type === 'parent' || type === 'child') {
      let element = event.currentTarget;
      video = element.querySelector('video');
      if (video) {
        video.autoplay = false;
        video.pause();
      }
    }
  }

  @action
  setShowShareList(currentPost) {
    this.currentPost = currentPost;
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
  noDisplay(event) {
    if (event.target.tagName !== 'INPUT') {
      event.stopPropagation();
      this.isShowShareList = false;
    }
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
        postId: this.currentPost,
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

}
