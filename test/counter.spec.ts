import { describe, expect, it } from 'vitest'
import { Counter } from '../lib/counter.js'
import { Segmenter } from '../lib/segmenter.js'
import { generateText } from '../test/utils.js'

describe('Counter Class', () => {
  it('should count english words and compute reading time', async () => {
    const lang = 'en'
    const length = 10_000

    const text = generateText(lang, length)
    const segmenter = new Segmenter(text, lang)

    const words = await segmenter.getWords()
    const counter = new Counter(words)
    const minutes = counter.getMinutes()
    expect(minutes).toMatchInlineSnapshot('38')
  })

  it('shoud count correctly even when korean and english are used', async () => {
    const lang = 'ko'
    const text =
      'hi안녕hello감사how합니다are you? 다음에 봬요. 조심히bye 들어가bye세요'
    const segmenter = new Segmenter(text, lang)

    const words = await segmenter.getWords()
    const texts = words.map((item) => item.text)
    const expected = [
      'hi',
      '안녕',
      'hello',
      '감사',
      'how',
      '합니다',
      'are',
      'you',
      '다음에',
      '봬요',
      '조심히',
      'bye',
      '들어가',
      'bye',
      '세요',
    ]
    expect(texts).toEqual(expected)

    console.log(texts)
    const counter = new Counter(words, { lang: 'en' })
    const minutes = counter.getMinutes()
    expect(minutes).toMatchInlineSnapshot('1')
  })
})
