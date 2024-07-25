import { helper } from '@ember/component/helper';

export default helper(function buttonContent(positional /*, named*/) {
  if (positional[0] === 'Follow Request') {
    return 'Confirm';
  }
  if (positional[0] === 'Follow Back') {
    return 'Follow Back';
  }
});
