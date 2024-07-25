import { helper } from '@ember/component/helper';

export default helper(function whichContent(positional) {
  if (positional[0] === 'Button') {
    return 'showButton';
  }
  if (positional[0] === 'Confirm') {
    return 'requested to follow you ';
  } else if (positional[0] === 'Follow Back' || positional[0] === 'Follow' || positional[0] === 'Following') {
    return 'started following you';
  } else if (positional[0] === 'post') {
    return 'liked your post';
  } else if (positional[0] === 'comment') {
    return 'liked your comment';
  } else if (positional[0] === 'Comment') {
    return 'commented';
  }

  // return positional;
});
