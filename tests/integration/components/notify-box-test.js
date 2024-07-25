import { module, test } from 'qunit';
import { setupRenderingTest } from 'emberapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | notify-box', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<NotifyBox />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <NotifyBox>
        template block text
      </NotifyBox>
    `);

    assert.dom().hasText('template block text');
  });
});
