import { module, test } from 'qunit';
import { setupRenderingTest } from 'emberapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | post-icon', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<PostIcon />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <PostIcon>
        template block text
      </PostIcon>
    `);

    assert.dom().hasText('template block text');
  });
});
