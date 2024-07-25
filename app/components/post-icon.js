import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PostIconComponent extends Component {
  @service router;
  @service session;
  @service('websockets') websockets;
  @service store;
  @tracked socketRef;

  constructor() {
    super(...arguments);
    const socket = this.websockets.socketFor(
      'ws://localhost:8080/Instagram/WebsocketSample',
    );
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
    this.socketRef = socket;
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

  processJsonMessage(message) {}

  processTextMessage(message) {}

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
    var json = {
      type: 'Close',
    };
    this.socketRef.send(JSON.stringify(json));
  }

  @action
  changePage(path, param) {
    this.router.transitionTo(path, param);
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
  addLike(post) {
    //   this.redheart = true;
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
    //   this.redheart = false;
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
  setShowShareList(currentPost) {
    if (this.args.setShowShareList) {
      this.args.setShowShareList(currentPost);
    }
  }

  @action
  getIsSaved(post) {
    return post.isSaved;
  }

  @action
  savePost(savedPost, event) {
    //   this.savedPost = savedPost;
    event.stopPropagation();
    var savedPost = {
      reason: 'save',
      savedPostId: savedPost.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'post', post: savedPost }));
  }

  @action
  removeSavedPost(removePost, event) {
    event.stopPropagation();
    var removePost = {
      reason: 'removeSave',
      savedPostId: removePost.id,
    };
    this.socketRef.send(JSON.stringify({ type: 'post', post: removePost }));
  }

  @action
  showCurrentComment(){
    if(this.args.onClick){
        this.args.onClick(this.args.postId);
    }
  }

}
