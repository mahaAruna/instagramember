import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CommentBoxComponent extends Component {
  @service router;

  @action
  addLike(event) {
    event.stopPropagation();
    if (this.args.onAdd) {
      this.args.onAdd(event, this.args.comment);
    }
    // this.args.commentLikeClick();
  }

  @action
  removeLike(event) {
    event.stopPropagation();
    if (this.args.onRemove) {
      this.args.onRemove(event, this.args.comment);
    }
    // this.args.removeLikeClick()
  }

  @action
  changePage() {
    if (this.args.path) {
      this.router.transitionTo(this.args.path, this.args.profileId);
    }
  }

  @action
  like() {
    return this.args.getIsLike(this.args.comment.likesCount, true);
  }
}
