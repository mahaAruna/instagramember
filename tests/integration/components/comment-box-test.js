import { module, test } from 'qunit';
import { setupRenderingTest } from 'emberapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | comment-box', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CommentBox />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <CommentBox>
        template block text
      </CommentBox>
    `);

    assert.dom().hasText('template block text');
  });
});
