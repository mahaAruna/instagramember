import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Route | instagram/home', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:instagram/home');
    assert.ok(route);
  });
});
