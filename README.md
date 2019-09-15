# zensen-photo-viewer

A photo viewer component for LitElement.

## Features

- Displays image
- Provides multiple content modes
- Provides a way to pan and zoom the photo

## Install

Using `npm`:

```
$ npm install @zensen/photo-viewer
```

Using `yarn`:

```
$ yarn add @zensen/photo-viewer
```

## API

```js
import { IMG_SRC_PORTRAIT } from './_resources'

import { MODE_CONTENT } from '@zensen/photo-viewer'

const ZOOM = 1.5

const PAN_COORDS = {
  x: 16,
  y: 32,
}

```

Cover Mode Usage
```js
const change = src => console.log('viewport src:', src)

... html`
  <zen-photo-viewer
    style="width: 400px; height: 300px;"
    .mode="${MODE_CONTENT.COVER)}"
    .src="${IMG_SRC_PORTRAIT}"
    .zoom="${ZOOM}"
    .panPos="${PAN_COORDS}"
    .onChange="${change}"
  ></zen-photo-viewer>
`
```

![alt text](./docs/cover.png "Cover Mode")

Contain Mode Usage
```js
const change = src => console.log('viewport src:', src)

... html`
  <zen-photo-viewer
    style="width: 400px; height: 300px;"
    .mode="${MODE_CONTENT.COVER)}"
    .src="${IMG_SRC_PORTRAIT}"
    .zoom="${ZOOM}"
    .panPos="${PAN_COORDS}"
    .onChange="${change}"
  ></zen-photo-viewer>
`
```

![alt text](./docs/contain.png "Contain Mode")
