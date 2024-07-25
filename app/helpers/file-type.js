import { helper } from '@ember/component/helper';

export function fileType(positional /*, named*/) {
  var arr = positional[0];
  if (arr[0].substring(arr[0].indexOf('*') + 1) === 'images') {
    return 'image';
  } else if (arr[0].substring(arr[0].indexOf('*') + 1) === 'videos') {
    return 'video';
  } else if (arr[0].substring(arr[0].indexOf('*') + 1) === 'audios') {
    return 'audio';
  }
}

export default helper(fileType);
