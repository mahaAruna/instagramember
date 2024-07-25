import Service from '@ember/service';
import cookie from '../utils/cookie';
// import {cookie} from '../utils/cookie.js/cookie';

export default class SessionService extends Service {
  sessionId = null;
  userName = '';

  setsessionId(id) {
    this.sessionId = id;
  }

  getSessionId() {
    return (this.sessionId = cookie('cookieId'));
  }

  getUserName() {
    return (this.userName = cookie('cookiename'));
  }
}
