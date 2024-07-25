import { module, test } from 'qunit';

import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Adapter | comment', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:comment');
    assert.ok(adapter);
  });
});
