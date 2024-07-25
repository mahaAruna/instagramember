import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Adapter | messages', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:messages');
    assert.ok(adapter);
  });
});
