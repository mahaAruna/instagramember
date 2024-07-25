import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class NotificationModel extends Model {
  @attr content;
  @belongsTo('user', { async: true, inverse: null }) user;
  @attr notifyTime;
  @attr status;
  @belongsTo('message', { async: true, inverse: null }) message;
  @attr type;
}
