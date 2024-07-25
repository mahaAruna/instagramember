import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Route | followers', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:followers');
    assert.ok(route);
  });
});
