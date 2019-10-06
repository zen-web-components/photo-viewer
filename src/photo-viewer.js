import { LitElement, html, css } from 'lit-element'

export const ID_CANVAS = 'canvas'

export const MODE_CONTENT = {
  CONTAIN: 'contain',
  COVER: 'cover',
}

const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num)

class ZenPhotoViewer extends LitElement {
  static get properties () {
    return {
      __loaded: Boolean,

      zoom: Number,
      rotationIndex: Number,
      src: String,
      mode: String,
      panPos: Object,
    }
  }

  static get styles () {
    return css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        width: 40rem;
        height: 30rem;
      }

      .canvas {
        width: 100%;
        height: 100%;
        background-color: #000;
      }
    `
  }

  constructor () {
    super()
    this.__initState()
    this.__initHandlers()
  }

  __initState () {
    this.zoom = 1
    this.rotationIndex = 0
    this.src = ''
    this.mode = MODE_CONTENT.CONTAIN
    this.panPos = { x: 0, y: 0 }

    this.__loaded = false
    this.__dragging = false
    this.__canReport = false
    this.__ctx = null

    this.__startPanPos = { x: 0, y: 0 }
    this.__startMousePos = { x: 0, y: 0 }

    this.__image = new Image()
    this.__image.onload = () => this.__handlers.load()

    this.onChange = () => {}
    this.onCapture = null
  }

  __initHandlers () {
    this.__handlers = {
      load: () => {
        this.__loaded = true
        this.__canReport = true
        this.constrain()
      },
      animate: () => {
        this.draw()
        requestAnimationFrame(this.__handlers.animate)
      },
      dragStart: e => {
        e.preventDefault()
        this.__startMousePos = this.getMousePosition(e)
        this.__dragging = true
      },
      dragEnd: e => {
        e.preventDefault()

        if (this.__loaded) {
          if (
            this.panPos.x !== this.__startPanPos.x ||
            this.panPos.y !== this.__startPanPos.y) {
            this.__canReport = true
          }

          this.__startMousePos = { x: 0, y: 0 }
          this.__startPanPos = { ...this.panPos }
          this.__dragging = false
        }
      },
      dragMove: e => {
        e.preventDefault()

        if (this.__loaded && this.__dragging) {
          const currentPos = this.getMousePosition(e)
          const mouseOffset = {
            x: currentPos.x - this.__startMousePos.x,
            y: currentPos.y - this.__startMousePos.y,
          }

          this.onChange(
            this.getConstrainedPanPos({
              x: mouseOffset.x + this.__startPanPos.x,
              y: mouseOffset.y + this.__startPanPos.y,
            })
          )
        }
      },
    }
  }

  connectedCallback () {
    super.connectedCallback()

    document.addEventListener('mouseup', this.__handlers.dragEnd)
    document.addEventListener('mousemove', this.__handlers.dragMove)
    document.addEventListener('touchend', this.__handlers.dragEnd)
    document.addEventListener('touchmove', this.__handlers.dragMove)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    document.removeEventListener('mouseup', this.__handlers.dragEnd)
    document.removeEventListener('mousemove', this.__handlers.dragMove)
    document.removeEventListener('touchend', this.__handlers.dragEnd)
    document.removeEventListener('touchmove', this.__handlers.dragMove)
  }

  draw () {
    const canvasEl = this.__elements.canvas
    const canvasWidth = canvasEl.clientWidth
    const canvasHeight = canvasEl.clientHeight
    const imageWidth = this.__image.width
    const imageHeight = this.__image.height

    canvasEl.width = canvasEl.clientWidth
    canvasEl.height = canvasEl.clientHeight

    this.__ctx.save()
    this.__ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    if (this.__loaded) {
      this.__ctx.translate(
        (canvasWidth / 2) + this.panPos.x,
        (canvasHeight / 2) + this.panPos.y
      )

      this.__ctx.scale(this.getImageScale(), this.getImageScale())
      this.__ctx.rotate(this.getAngle())
      this.__ctx.scale(this.zoom, this.zoom)
      this.__ctx.drawImage(
        this.__image,
        -imageWidth / 2,
        -imageHeight / 2,
        imageWidth,
        imageHeight,
      )
    }

    this.__ctx.restore()

    if (this.onCapture && this.__loaded && this.__canReport) {
      const data = this.__elements.canvas.toDataURL('image/jpeg')
      this.onCapture(data)

      this.__canReport = false
    }
  }

  constrain () {
    const result = this.getConstrainedPanPos(this.panPos)

    if (result.x !== this.panPos.x || result.y !== this.panPos.y) {
      this.onChange(result)
    }
  }

  getAngle () {
    return -this.rotationIndex * Math.PI / 2
  }

  getCanvasAspect () {
    const { clientWidth, clientHeight } = this.__elements.canvas
    return clientWidth / clientHeight
  }

  getImageAspect () {
    const rotated = this.rotationIndex % 2
    const { width, height } = this.__image
    return rotated ? height / width : width / height
  }

  getImageScale () {
    const rotated = this.rotationIndex % 2
    const canvasAspect = this.getCanvasAspect()
    const imageAspect = this.getImageAspect()
    const canvasWidth = this.__elements.canvas.clientWidth
    const canvasHeight = this.__elements.canvas.clientHeight
    const imageWidth = rotated ? this.__image.height : this.__image.width
    const imageHeight = rotated ? this.__image.width : this.__image.height

    switch (this.mode) {
      case MODE_CONTENT.CONTAIN:
        return canvasAspect >= imageAspect
          ? canvasHeight / imageHeight
          : canvasWidth / imageWidth

      case MODE_CONTENT.COVER:
        return imageAspect >= canvasAspect
          ? canvasHeight / imageHeight
          : canvasWidth / imageWidth
    }

    throw new Error(`Invalid content mode specified: ${this.mode}`)
  }

  getMaxExtents () {
    const rotated = this.rotationIndex % 2
    const canvasWidth = this.__elements.canvas.clientWidth
    const canvasHeight = this.__elements.canvas.clientHeight
    const imageWidth = rotated ? this.__image.height : this.__image.width
    const imageHeight = rotated ? this.__image.width : this.__image.height
    const scaleImageWidth = imageWidth * this.zoom * this.getImageScale()
    const scaleImageHeight = imageHeight * this.zoom * this.getImageScale()

    return {
      x: Math.max(0, scaleImageWidth - canvasWidth) / 2,
      y: Math.max(0, scaleImageHeight - canvasHeight) / 2,
    }
  }

  getConstrainedPanPos (input) {
    const ext = this.getMaxExtents()

    return {
      x: clamp(input.x, -ext.x, ext.x),
      y: clamp(input.y, -ext.y, ext.y),
    }
  }

  getMousePosition (e) {
    const rect = this.getBoundingClientRect()

    const isTouch = e.type.includes('touch')
    const clientPos = {
      x: isTouch ? e.touches[0].clientX : e.clientX,
      y: isTouch ? e.touches[0].clientY : e.clientY,
    }

    return {
      x: clientPos.x - rect.x,
      y: clientPos.y - rect.y,
    }
  }

  firstUpdated () {
    this.__elements = {
      canvas: this.shadowRoot.getElementById(ID_CANVAS),
    }

    this.__ctx = this.__elements.canvas.getContext('2d')
    this.__handlers.animate()

    this.constrain()
  }

  update (changedProps) {
    if (changedProps.has('src')) {
      this.__loaded = false
      this.__dragging = false
      this.__image.src = this.src
      this.__startPanPos = { x: 0, y: 0 }
      this.__startMousePos = { x: 0, y: 0 }
    }

    if (this.__elements) {
      if (changedProps.has('mode')) {
        this.constrain()
        this.__canReport = true
      }

      if (changedProps.has('zoom')) {
        this.constrain()
        this.__canReport = true
      }

      if (changedProps.has('panPos')) {
        this.constrain()
      }
    }

    super.update(changedProps)
  }

  render () {
    return html`
      <canvas
        id="${ID_CANVAS}"
        class="canvas"
        @mousedown="${this.__handlers.dragStart}"
        @touchstart="${this.__handlers.dragStart}"
      ></canvas>
    `
  }
}

window.customElements.define('zen-photo-viewer', ZenPhotoViewer)
