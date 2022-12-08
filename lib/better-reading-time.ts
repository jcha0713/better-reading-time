import { Counter } from './counter.js'
import { Segmenter } from './segmenter.js'

interface Options {
  lang?: string
  wpm?: number
  cpm?: number
}

export async function countReadingTime(text: string, options: Options = {}) {
  const segmenter = new Segmenter(text, options?.lang ?? 'en')
  const words = await segmenter.getWords()
  const counter = new Counter(words, options)
  const minutes = counter.getMinutes()

  return minutes
}
