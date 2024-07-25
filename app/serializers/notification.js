// app/serializers/notification.js
import RESTSerializer from '@ember-data/serializer/rest';

export default class NotificationSerializer extends RESTSerializer {
  //   normalizeResponse(store, primaryModelClass, payload, id, requestType) {
  //     payload.notification = payload.notification.map(notify => {
  //         return this.normalize(primaryModelClass, notify);
  //     })
  //     console.log(payload.notification);
  //     return this._super(store, primaryModelClass, payload, id, requestType);
  //   }
  //   normalize(modelClass, resourceHash) {
  //     console.log('notify', resourceHash);
  //     // Transform the fromUser relationship
  //     resourceHash.user = {
  //       id: resourceHash.user.id,
  //       type: 'user'
  //     };
  //     // Transform the toUser relationship
  //     resourceHash.toUser = {
  //       id: resourceHash.toUser.id,
  //       type: 'user'
  //     };
  //     console.log(resourceHash);
  //     return resourceHash;
  //   }
}
