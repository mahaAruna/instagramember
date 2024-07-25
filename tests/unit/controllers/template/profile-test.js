import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Controller | template/profile', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:template/profile');
    assert.ok(controller);
  });
});
