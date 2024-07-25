import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Route | instagram/explore', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:instagram/explore');
    assert.ok(route);
  });
});
