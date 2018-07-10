/**
 * This code is mainly from
 *
 * https://soulwire.github.io/FontMetrics/
 * A lightweight JavaScript library for computing accurate font metrics such as x-height, cap height, ascent, descent and tittle for any loaded web font.
 *
 * and just adapted to typescript.
 */
namespace fe {
    export class FontMetrics {
        private initialized = false;
        private padding: number;
        private context: CanvasRenderingContext2D;
        private canvas: HTMLCanvasElement;

        private res:any[string];

        // ——————————————————————————————————————————————————
        // Settings
        // ——————————————————————————————————————————————————

        settings = {
          chars: {
            capHeight: 'S',
            baseline: 'n',
            xHeight: 'x',
            descent: 'p',
            ascent: 'h',
            tittle: 'i'
          }
        }

        constructor({fontFamily = 'Times',
          fontWeight = 'normal',
          fontSize = 200,
          origin = 'baseline'
        } = {}) {
          this.setFont(fontFamily, fontSize, fontWeight),
            this.res = {
            ...this.normalize(this.getMetrics(), fontSize, origin),
            fontFamily,
            fontWeight,
            fontSize
          }
        }

        getAscent(): number {
          return -this.res['ascent'];
        }

        getDescent(): number {
          return this.res['descent'];
        }
//        FontMetrics.settings = settings

        // ——————————————————————————————————————————————————
        // Methods
        // ——————————————————————————————————————————————————

        initialize() {
          this.canvas = document.createElement('canvas')
          this.context = this.canvas.getContext('2d')
          this.initialized = true
        }

        setFont(fontFamily, fontSize, fontWeight) {
          if (!this.initialized) this.initialize()
          this.padding = fontSize * 0.5
          this.canvas.width = fontSize * 2
          this.canvas.height = fontSize * 2 + this.padding
          this.context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
          this.context.textBaseline = 'top'
          this.context.textAlign = 'center'
        }

        setAlignment(baseline: string = 'top') {
          const ty = baseline === 'bottom' ? this.canvas.height : 0
          this.context.setTransform(1, 0, 0, 1, 0, ty)
          this.context.textBaseline = baseline
        }

        updateText(text: string) {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.context.fillText(text, this.canvas.width / 2, this.padding, this.canvas.width)
        }

        computeLineHeight(): number {
          const letter = 'A'
          this.setAlignment('bottom')
          const gutter = this.canvas.height - this.measureBottom(letter)
          this.setAlignment('top')
          return this.measureBottom(letter) + gutter
        }

        getPixels(text: string): Uint8ClampedArray {
          this.updateText(text)
          return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data
        }

        getFirstIndex(pixels: Uint8ClampedArray): number {
          for (let i = 3, n = pixels.length; i < n; i += 4) {
            if (pixels[i] > 0) return (i - 3) / 4
          } return pixels.length
        }

        getLastIndex(pixels: Uint8ClampedArray) {
          for (let i = pixels.length - 1; i >= 3; i -= 4) {
            if (pixels[i] > 0) return i / 4
          } return 0
        }

        normalize(metrics, fontSize, origin) {
          const result = {}
          const offset = metrics[origin]
          // RK for (let key in metrics) { result[key] = (metrics[key] - offset) / fontSize }
          for (let key in metrics) { result[key] = (metrics[key] - offset); }
          return result
        }

        measureTop(text: string): number {
          return Math.round(
            this.getFirstIndex(
              this.getPixels(text)
            ) / this.canvas.width
          ) - this.padding
        }

        measureBottom(text): number {
          return Math.round(
            this.getLastIndex(
              this.getPixels(text)
            ) / this.canvas.width
          ) - this.padding
        }

        getMetrics(chars = this.settings.chars) {
          return {
            capHeight: this.measureTop(chars.capHeight),
            baseline: this.measureBottom(chars.baseline),
            xHeight: this.measureTop(chars.xHeight),
            descent: this.measureBottom(chars.descent),
            bottom: this.computeLineHeight(),
            ascent: this.measureTop(chars.ascent),
            tittle: this.measureTop(chars.tittle),
            top: 0
          }
        }
    }
}
