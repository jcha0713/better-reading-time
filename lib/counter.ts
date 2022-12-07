interface Word {
  segment: string
}

export class Counter {
  public wpm: number
  public cpm: number
  public lang: string
  public words: Word[]

  constructor(words: Word[], lang = 'en', wpm = 270, cpm = 500) {
    this.words = words
    this.lang = lang
    this.wpm = wpm
    this.cpm = cpm
  }

  public getMinutes() {
    return this.getPrettyNumber(this.words.length / this.wpm)
  }

  public getPrettyNumber(minutes: number) {
    const prettyNumber = Math.ceil(Number.parseFloat(minutes.toFixed(2)))
    return prettyNumber
  }
}
