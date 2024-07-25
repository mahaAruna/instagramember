import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Controller | instagram/profile/post', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:instagram/profile/post');
    assert.ok(controller);
  });
});
