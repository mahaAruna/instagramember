import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr name;
  @attr userName;
  @attr emailId;
  @attr gender;
  @attr bio;
  @attr profileUrl;
  @attr isPrivate;
  @attr isActive;
  @hasMany('user', { async: true, inverse: null }) followersuser;
  @hasMany('user', { async: true, inverse: null }) followingsuser;
  @hasMany('post', { async: true, inverse: null }) post;
  @hasMany('notification', { async: true, inverse: null }) notifications;
}
