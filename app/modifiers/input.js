import { modifier } from 'ember-modifier';

export default modifier((element) => {
  if (element.name === 'username') {
    element.focus();
  }
});
