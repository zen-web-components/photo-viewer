import { fixture, expect } from '@open-wc/testing'

import '../src/photo-viewer'

describe('zen-photo-viewer', () => {
  it('renders', () =>
    expect(
      fixture('<zen-photo-viewer></zen-photo-viewer>')
    ).to.eventually.exist)
})
