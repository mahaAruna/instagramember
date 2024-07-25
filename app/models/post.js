import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class PostModel extends Model {
  @attr caption;
  @attr imageUrl;
  @attr postedDate;
  @belongsTo('user', { async: true, inverse: null }) user;
  @attr likesCount;
  @attr commentsCount;
  @attr isSaved;
}
