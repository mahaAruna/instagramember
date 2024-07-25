import EmberRouter from '@ember/routing/router';
import config from 'emberapp/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('instagram', {path: '/'}, function () {
    this.route('home', { path: '/' }, function () {
      this.route('index', { path: '/' });
    });
    this.route('explore');
    this.route('reels');
    this.route('messages', function () {
      this.route('username', { path: '/:user_name' });
    });
    this.route('create');
    this.route('profile', { path: '/:username' }, function () {
      this.route('followings');
      this.route('followers');
      this.route('post', { path: '/' });
      this.route('saved');
    });
    this.route('signup');
    this.route('signin');
    this.route('account', function () {
      this.route('edit');
    });
    this.route('post', { path: 'post/:post_id' });
  });
  this.route('followers');
  this.route('followings');
});
