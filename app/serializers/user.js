import RestSerializer from '@ember-data/serializer/rest';

export default class UserSerializer extends RestSerializer {
  // normalizeResponse(store, primaryModelClass, payload, id, requestType) {
  //         payload = {
  //           users: [payload.user]
  //         };
  //         return this._super(store, primaryModelClass, payload, id, requestType);
  //       }
  //       normalize(modelClass, resourceHash) {
  //         // Normalize the followersuser and followingsuser relationships
  //         if (resourceHash.followersuser) {
  //           resourceHash.followersuser = resourceHash.followersuser.map(id => ({ id, type: 'user' }));
  //         }
  //         if (resourceHash.followingsuser) {
  //           resourceHash.followingsuser = resourceHash.followingsuser.map(id => ({ id, type: 'user' }));
  //         }
  //         // return this._super(modelClass, resourceHash);
  //         return resourceHash;
  //       }
  // }
}
