import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @attr commentText;
  @attr commentedDate;
  @attr commentParent;
  @attr likesCount;
  @belongsTo('post', { async: true, inverse: null }) post;
  @belongsTo('user', { async: true, inverse: null }) user;
}
