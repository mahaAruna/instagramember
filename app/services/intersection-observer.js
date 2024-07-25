import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class IntersectionObserverService extends Service {
  @tracked observer = null;

  constructor() {
    super(...arguments);
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
  }

  observe(element, callback) {
    element._intersectionCallback = callback;
    this.observer.observe(element);
  }

  unobserve(element) {
    this.observer.unobserve(element);
  }

  handleIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target._intersectionCallback(true);
      } else {
        entry.target._intersectionCallback(false);
      }
    });
  }
}
