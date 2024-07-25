import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InstagramAccountEditController extends Controller {
  @service router;
  @tracked user;
  @tracked name;
  @tracked userName;
  @tracked bio;
  @tracked gender;
  @tracked showPopUp = false;
  @tracked file;
  @tracked imageDataUrl;

  // @tracked formDatas = new FormData();
  @tracked obj = {};
  @action
  getGender() {
    return this.gender === 'Female' ? 'Male' : 'Female';
  }

  @action
  getObj(event) {
    event.preventDefault();
    let formDatas = new FormData();
    if (this.name) {
      formDatas.append('name', this.name);
    }
    formDatas.append('userName', this.userName);
    formDatas.append('gender', this.gender);
    formDatas.append('bio', this.bio);
    if (this.file) {
      formDatas.append('file', this.file);
    }
    formDatas.append('id', this.user.id);
    fetch('http://localhost:8080/Instagram/UpdateUser', {
      method: 'post',
      credentials: 'include',
      body: formDatas,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.isUpdate) {
          this.showPopUp = true;
          setTimeout(() => {
            this.showPopUp = false;
            this.router.transitionTo('instagram.profile', this.user.id);
          }, 2000);
        }
      });
  }

  @action
  getFile(event) {
    this.file = event.target.files[0];
  }

  @action
  updateGender(event) {
    this.set('gender', event.target.value);
  }
}
