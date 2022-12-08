import fs from 'node:fs'
import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill'
// import wasmUrl from '../node_modules/intl-segmenter-polyfill/dist/break_iterator.wasm?url'

type Options = {
  granularity: 'word' | 'grapheme'
}

interface Word {
  segment: string
}

export class Segmenter {
  public text: string
  public locale: string
  public options: Options

  constructor(text: string, locale: string, options: Options) {
    this.text = text
    this.locale = locale
    this.options = options
  }

  public async getWords(): Promise<Word[]> {
    const segments = await this.useSegmenter()
    const words = segments.map((segmentItem) => {
      return segmentItem.segment
    })
    return words
  }

  private async useSegmenter() {
    if (this.hasNativeSegmenter()) {
      console.log('polyfill not used!')
      // @ts-expect-error Intl.Segmenter might not exist
      const segmenter = new Intl.Segmenter(this.locale, this.options)
      const segments = [...segmenter.segment(this.text)].filter(
        (segment) => segment.isWordLike,
      )
      return segments
    }

    const wasmBuffer = fs.readFileSync(
      'node_modules/intl-segmenter-polyfill/break_iterator.wasm',
    )
    const wasmBinary = new Uint8Array(wasmBuffer)
    // const PolyfillSegmenter = await createIntlSegmenterPolyfill(fetch(wasmUrl))
    const PolyfillSegmenter = await createIntlSegmenterPolyfill(wasmBinary)
    const segmenter = new PolyfillSegmenter(this.locale, this.options)
    console.log('polyfill used!')

    return segmenter.segment(this.text).filter((segment) => segment.isWordLike)
  }

  private hasNativeSegmenter(): boolean {
    return typeof Intl !== 'undefined' && 'Segmenter' in Intl
  }
}
