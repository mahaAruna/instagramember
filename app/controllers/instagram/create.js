import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class InstagramCreateController extends Controller {
  @service('websockets') websockets;
  @service session;
  @service store;
  @tracked base64Image;
  @tracked user = this.model;
  @tracked showInput = true;
  @tracked showCrop = false;
  @tracked showEdit = false;
  @tracked showCreate = false;
  @tracked caption = '';
  @tracked src;
  @tracked file;
  socketRef = null;
  @tracked showDiscard = false;
  @tracked isImage = false;
  @tracked isVideo = false;
  @tracked isShowEmoji = false;
  @tracked emojis = [];
  @tracked imageFileType = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg'];
  @tracked videoTypeFile = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm'];
  @tracked audioTypeFile = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'];

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
    }
    if (message.type === 'Send') {
    }
  }

  processTextMessage(message) {
    if (message === 'Sended') {
      this.rightContent = false;
    }
    if (message.includes('Added Successfully')) {
      this.showCreate = false;
      this.showCrop = false;
      this.showDiscard = false;
      this.showEdit = false;
      this.showInput = true;
      this.isShowEmoji = false;
      this.isImage = false;
      this.isVideo = false;
      this.caption = '';
    }
  }
  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
    thid.sendUserOpened();
  }

  @action
  getFile(event) {
    this.file = event.target.files[0];
    if (this.file) {
      var type = this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
      if (this.imageFileType.includes(type)) {
        this.isImage = true;
      } else if (this.videoTypeFile.includes(type)) {
        this.isVideo = true;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.base64Image = e.target.result;
        this.showInput = false;
        this.showCrop = true;
      };
      reader.readAsDataURL(this.file);
    }
  }

  @action
  changeToCrop() {
    this.showCrop = true;
    this.showEdit = false;
    this.isShowEmoji = false;
  }

  @action
  changeToEdit() {
    this.showEdit = true;
    this.showCrop = false;
    this.showCreate = false;
    this.isShowEmoji = false;
  }

  @action
  changeToCreate() {
    this.showCreate = true;
    this.showEdit = false;
    this.isShowEmoji = false;
  }

  @action
  showDiscardBox() {
    this.showDiscard = true;
  }

  @action
  discard() {
    this.showDiscard = false;
    this.showInput = true;
    this.showCrop = false;
  }
  @action
  onShare() {
    var formData = new FormData();
    formData.append('file1', this.file);
    formData.append('caption', this.caption);
    formData.append('sessionId', this.session.getSessionId());
    fetch(`http://localhost:8080/Instagram/AddPost`, {
      method: 'post',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.isAdded) {
          var post = {
            reason: 'showPost',
            showPost: data.post.id,
          };
          this.socketRef.send(JSON.stringify({ type: 'post', post: post }));
        }
      });
  }

  @action
  showEmoji() {
    var access_key = '1a2b4074ce3a7c7adfcac669e3b4814027e8d215';
    fetch(`https://emoji-api.com/emojis?access_key=${access_key}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.isShowEmoji = true;
        this.emojis = data;
      });
  }

  @action
  setText(emoji) {
    this.caption += emoji;
  }
}
