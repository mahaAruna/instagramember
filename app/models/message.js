import Model, { attr, belongsTo } from '@ember-data/model';

export default class MessageModel extends Model {
  @attr messageText;
  @belongsTo('user', { async: true, inverse: null }) receiver;
  @belongsTo('post', { async: true, inverse: null }) post;
  // @attr receiver;
  @attr sendTime;
  @attr recieveTime;
  @attr status;
  @attr replyId;
  @attr reaction;
}
