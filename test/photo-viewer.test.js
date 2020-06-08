import '../src/photo-viewer'

import { _sinon, expect, genSuite } from '@zen-web-components/unit-test-helper'

genSuite('zen-photo-viewer', false, {
  onStart: _meta => {
  },
}, meta => {
  context('when...', () => {
    beforeEach(async () => {
      await meta.updateComplete()
    })

    it('passes', () => expect(true).to.be.true)
  })
})
