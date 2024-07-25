import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InstagramSigninController extends Controller {
  @service router;
  @service store;

  @tracked className;
  @tracked result;
  @tracked isshowPopUp = false;

  @action
  getObj(event, teacher) {
    event.preventDefault();
    this.teacher = teacher;
    fetch('http://localhost:8080/Instagram/Login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(teacher),
    })
      .then((res) => {
        if (!res.ok) {
          throw new error();
        }
        return res.json();
      })
      .then((data) => {
        this.result = data.isLogin;
        this.isshowPopUp = true;
        if (
          this.result === "Username doesn't exists" ||
          this.result === 'Password is incorrect'
        ) {
          this.className = 'redBox';
          setTimeout(() => {
            this.isshowPopUp = false;
          }, 3000);
          if (this.result === 'Password is incorrect') {
            this.result =
              'Your password should be contains atleat 8 characters(mix of letters, numbers and symbols)';
          }
        } else if (this.result === 'true') {
          this.result = 'Login Successful!';
          this.className = 'greenBox';
          this.store.createRecord('user', {
            userName: teacher.UserName,
          });
          setTimeout(() => {
            this.isshowPopUp = false;
            this.router.transitionTo('instagram.home');
          }, 3000);
        }
      });
  }
}
