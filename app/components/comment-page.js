import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {service} from '@ember/service';

export default class CommentPageComponent extends Component {

    @action
    isShowUserBox(){
        return this.args.isShowUserBox;
    }
    @action
    getCommentUserProfile(id, text){
        if(this.args.getCommentUserProfile){
            return this.args.getCommentUserProfile(id, text);
        }
    }

    @action
    getTime(time){
        if(this.args.getTime){
           return this.args.getTime(time);
        }
    }
}
