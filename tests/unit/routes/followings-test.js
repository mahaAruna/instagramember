import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Route | followings', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:followings');
    assert.ok(route);
  });
});
