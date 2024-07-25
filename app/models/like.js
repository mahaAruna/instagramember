import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class LikeModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) user;
  @belongsTo('post', { async: true, inverse: null }) post;
  @belongsTo('comment', { async: true, inverse: null }) comment;
  @belongsTo('message', { async: true, inverse: null }) message;
}
