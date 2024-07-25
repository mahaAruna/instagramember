import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Controller | instagram/message', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:instagram/message');
    assert.ok(controller);
  });
});
