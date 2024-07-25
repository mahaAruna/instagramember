import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Adapter | notification', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:notification');
    assert.ok(adapter);
  });
});
