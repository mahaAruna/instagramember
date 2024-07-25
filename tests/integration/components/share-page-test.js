import { module, test } from 'qunit';
import { setupRenderingTest } from 'emberapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | share-page', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SharePage />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <SharePage>
        template block text
      </SharePage>
    `);

    assert.dom().hasText('template block text');
  });
});
