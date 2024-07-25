import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Adapter | like', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:like');
    assert.ok(adapter);
  });
});
