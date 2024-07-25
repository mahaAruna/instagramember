import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InstagramRoute extends Route {
  // @service store;
  @service router;
  @service session;
  @service store;

  beforeModel(transition) {
    // this._super(controller, model);
  }

  async model() {
    const isAuthenticated = this.session.getSessionId();
    if (isAuthenticated === null) {
      this.router.transitionTo('instagram.signin');
    } else {
      var user = this.store.findRecord('user', this.session.getUserName(), {
        adapterOptions: {
          sessionId: this.session.getSessionId(),
          username: this.session.getUserName(),
        },
      });

      var controller = this.controllerFor('instagram');
      controller.user = user;
      controller.currentPath = 'instagram.home';
    }

    return [
      // <i class="fa-solid fa-house"></i>
      // <i class="fa-solid fa-magnifying-glass"></i>
      {
        // <i class="fa-solid fa-house"></i>
        class: 'fa-solid fa-house menu-icon',
        text: 'Home',
        path: 'instagram.home',
      },
      {
        // <i class="fa fa-search" aria-hidden="true"></i>
        class: 'fa fa-search menu-icon',
        text: 'Search',
        path: 'instagram.search',
      },
      {
        // <i class="fa-regular fa-compass"></i>
        class: 'fa-regular fa-compass menu-icon',
        text: 'Explore',
        path: 'instagram.explore',
      },
      {
        // <i class="fa-light fa-clapperboard" style="color: #000000;"></i>
        class: 'fa-solid fa-clapperboard menu-icon',
        text: 'Reels',
        path: 'instagram.reels',
      },
      {
        // <i class="fa-solid fa-paper-plane" style="color: #ffffff;"></i>
        class: 'fa-solid fa-paper-plane menu-icon',
        text: 'Messages',
        path: 'instagram.messages',
      },
      {
        // <i class="fa-regular fa-heart" style="color: #fafafa;"></i>
        class: 'fa-regular fa-heart menu-icon',
        text: 'Notifications',
        path: 'instagram.notifications',
      },
      {
        // <i class="fa fa-plus-square" aria-hidden="true"></i>
        class: 'fa fa-plus-square menu-icon',
        text: 'Create',
        path: 'instagram.create',
      },
      {
        // <i class="fad fa-user-circle" style="--fa-primary-color: #cccccc; --fa-secondary-color: #cccccc;"></i>
        class: 'fa fa-user-circle menu-icon',
        text: 'Profile',
        path: `instagram.profile`,
        id: this.session.getUserName(),

        // style="--fa-primary-color: #cccccc; --fa-secondary-color: #cccccc
      },
    ];
  }

  setupController(controller, model) {
    // this._super(controller, model);

    controller.currentPath = 'instagram.home';
    controller.getColor('instagram.home');
  }
}
