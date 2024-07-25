import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InstagramSignupRoute extends Route {
  @service store;
  model() {
    return [
      {
        type: 'text',
        name: 'username',
        labelName: 'User Name',
        placeholder: 'Enter your username',
        require: 'required',
      },
      {
        type: 'text',
        name: 'name',
        labelName: 'Name',
        placeholder: 'Enter your name',
      },
      {
        type: 'text',
        name: 'email',
        labelName: 'Email',
        placeholder: 'Enter your username',
        require: 'required',
      },
      {
        type: 'password',
        labelName: 'Password',
        name: 'password',
        placeholder: 'Enter your password',
        require: 'required',
        iclass: 'fa-solid fa-eye eye',
      },
      {
        type: 'select',
        labelName: 'Gender',
        name: 'gender',
        options: ['Male', 'Female'],
      },
      {
        type: 'text',
        labelName: 'Bio',
        name: 'bio',
        require: 'required',
      },
    ];
  }
}
