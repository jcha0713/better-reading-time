import fs from 'node:fs'
import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill'
// import wasmUrl from '../node_modules/intl-segmenter-polyfill/dist/break_iterator.wasm?url'

type charRange = [lowerBound: number, upperBound: number]

interface Word {
  text: string
  isCJK: boolean
}

export class Segmenter {
  public text: string
  public locale: string
  public options: { granularity: 'word' | 'grapheme' }
  public extendedCharRange: charRange[]

  constructor(text: string, locale?: string, extendedCharRange?: charRange[]) {
    this.text = text
    this.locale = locale ?? 'en'
    this.options = { granularity: 'word' }
    this.extendedCharRange = extendedCharRange ?? []
  }

  public async getWords(): Promise<Word[]> {
    const segments = await this.useSegmenter()
    const words = segments.map((segmentItem): Word => {
      return {
        text: segmentItem.segment,
        isCJK: this.isCJK(segmentItem.segment),
      }
    })
    return words
  }

  private isCJK(word: string): boolean {
    const charCode = word.charCodeAt(0)
    const CJKUnicodeRanges: charRange[] = [
      // Hiragana
      [0x30_41, 0x30_96],
      // Katakana
      [0x30_a0, 0x30_ff],
      // CJK Unified ideographs
      [0x4e_00, 0x9f_ff],
      // Hangul
      [0xac_00, 0xd7_a3],
      // CJK extensions
      [0x2_00_00, 0x2_eb_e0],
    ]

    this.extendedCharRange.forEach((range) => {
      if (range[0] > range[1]) {
        range.reverse()
      }

      CJKUnicodeRanges.push(range)
    })

    return CJKUnicodeRanges.some(
      ([low, high]) => charCode >= low && charCode <= high,
    )
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
