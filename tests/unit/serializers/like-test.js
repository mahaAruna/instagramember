import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Serializer | like', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('like');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('like', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
