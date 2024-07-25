import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SigninRoute extends Route {
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
        type: 'password',
        labelName: 'Password',
        name: 'password',
        placeholder: 'Enter your password',
        require: 'required',
        iclass: 'fa-solid fa-eye eye',
      },
    ];
  }
}
