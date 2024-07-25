import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Model | notification', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('notification', {});
    assert.ok(model);
  });
});
