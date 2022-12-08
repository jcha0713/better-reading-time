interface Word {
  text: string
  isCJK: boolean
}

interface Options {
  lang?: string
  wpm?: number
  cpm?: number
}

export class Counter {
  public wpm: number
  public cpm: number
  public lang: string
  public words: Word[]

  constructor(words: Word[], options: Options = {}) {
    const { lang = 'en', wpm = 270, cpm = 500 } = options
    this.words = words
    this.lang = lang
    this.wpm = wpm
    this.cpm = cpm
  }

  public getMinutes() {
    let chars = 0
    for (const word of this.words) {
      if (word.isCJK) {
        chars += word.text.length
      }
    }

    const CJKMinutes = chars / this.cpm
    const nonCJKMinutes =
      this.words.filter((word) => !word.isCJK).length / this.wpm

    console.log('CJK:', CJKMinutes)
    console.log('Non CJK:', nonCJKMinutes)

    return this.getPrettyNumber(CJKMinutes + nonCJKMinutes)
  }

  private getPrettyNumber(minutes: number) {
    const prettyNumber = Math.ceil(Number.parseFloat(minutes.toFixed(2)))
    return prettyNumber
  }
}
