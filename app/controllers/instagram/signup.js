import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class InstagramSignupController extends Controller {
  @service router;

  @tracked obj = {};
  @tracked path = '';
  @tracked selectedFile = '';
  @tracked file;
  @tracked result;
  @tracked className;
  @tracked showPopUp = false;
  @tracked base64Image;

  @action
  getObj(event, teacher) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('UserName', teacher.UserName);
    formData.append('Email', teacher.Email);
    formData.append('Password', teacher.Password);
    formData.append('Gender', teacher.Gender);
    formData.append('Bio', teacher.Bio);
    formData.append('Name', teacher.Name);
    formData.append('file', this.file);
    //instagram.zcodeusers.in/Login
    fetch('http://localhost:8080/Instagram/SignUp', {
      method: 'post',
      credentials: 'include',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((user) => {
        this.showPopUp = true;
        this.result = user.isSignUp;
        if (
          this.result ===
          ('Invalid Password' || 'Username already exists' || 'false')
        ) {
          this.className = 'redBox';
          setTimeout(() => {
            this.showPopUp = false;
          }, 5000);
        } else if (this.result === 'true') {
          this.result = 'Sign Up Successfully!';
          this.className = 'greenBox';
          setTimeout(() => {
            this.showPopUp = false;
            this.router.transitionTo('instagram.signin');
          }, 5000);
        }
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }

  @action
  getFile(event) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.base64Image = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }
}
