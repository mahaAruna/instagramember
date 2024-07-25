import { module, test } from 'qunit';
import { setupTest } from 'emberapp/tests/helpers';

module('Unit | Service | intersection-observer', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:intersection-observer');
    assert.ok(service);
  });
});
