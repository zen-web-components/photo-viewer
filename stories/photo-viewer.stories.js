import { MODE_CONTENT } from '../src/photo-viewer'

import { storiesOf } from '@open-wc/demoing-storybook'
import { withKnobs, number, object, select } from '@storybook/addon-knobs'
import { html, css } from 'lit-element'

import { IMG_PORTRAIT, IMG_LANDSCAPE } from './_resources'

const STYLE_PORTRAIT = css`width: 30rem; height: 40rem;`

const OPTS_RANGE_CANVAS = {
  range: true,
  min: 60,
  max: 600,
  step: 1,
}

const OPTS_RANGE_ZOOM = {
  range: true,
  min: 1,
  max: 2,
  step: 0.01,
}

function genCanvasStyles () {
  const width = number('Canvas Width', 400, OPTS_RANGE_CANVAS)
  const height = number('Canvas Height', 300, OPTS_RANGE_CANVAS)
  return css`width: ${width}px; height: ${height}px;`
}

const stories = storiesOf('Photo Viewer', module)
stories.addDecorator(withKnobs)

stories.add('Contain CP IP', () =>
  html`
    <zen-photo-viewer
       style="${STYLE_PORTRAIT}"
      .src="${IMG_PORTRAIT}"
    ></zen-photo-viewer>
  `,
)

stories.add('Contain CL IP', () =>
  html`
    <zen-photo-viewer .src="${IMG_PORTRAIT}"></zen-photo-viewer>
  `,
)

stories.add('Contain CP IL', () =>
  html`
    <zen-photo-viewer
       style="${STYLE_PORTRAIT}"
      .src="${IMG_LANDSCAPE}"
    ></zen-photo-viewer>
  `,
)

stories.add('Contain CL IL', () =>
  html`
    <zen-photo-viewer .src="${IMG_LANDSCAPE}"></zen-photo-viewer>
  `,
)

stories.add('Cover CP IP', () =>
  html`
    <zen-photo-viewer
       style="${STYLE_PORTRAIT}"
      .mode="${MODE_CONTENT.COVER}"
      .src="${IMG_PORTRAIT}"
    ></zen-photo-viewer>
  `,
)

stories.add('Cover CL IP', () =>
  html`
    <zen-photo-viewer
      .mode="${MODE_CONTENT.COVER}"
      .src="${IMG_PORTRAIT}"
    ></zen-photo-viewer>
  `,
)

stories.add('Cover CP IL', () =>
  html`
    <zen-photo-viewer
       style="${STYLE_PORTRAIT}"
      .mode="${MODE_CONTENT.COVER}"
      .src="${IMG_LANDSCAPE}"
    ></zen-photo-viewer>
  `,
)

stories.add('Cover CL IL', () =>
  html`
    <zen-photo-viewer
      .mode="${MODE_CONTENT.COVER}"
      .src="${IMG_LANDSCAPE}"
    ></zen-photo-viewer>
  `,
)

stories.add('Configurable', () =>
  html`
    <zen-photo-viewer
      style="${genCanvasStyles()}"
      .mode="${select('Mode', MODE_CONTENT, MODE_CONTENT.CONTAIN)}"
      .src="${IMG_PORTRAIT}"
      .zoom="${number('Zoom', 1, OPTS_RANGE_ZOOM)}"
      .panPos="${object('Pan', { x: 0, y: 0 })}"
    ></zen-photo-viewer>
  `,
)
