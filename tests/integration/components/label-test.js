import { module, test } from 'qunit';
import { setupRenderingTest } from 'emberapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | label', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Label />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Label>
        template block text
      </Label>
    `);

    assert.dom().hasText('template block text');
  });
});
