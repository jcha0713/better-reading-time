import { describe, expect, it } from 'vitest'
import { Counter } from '../lib/counter.js'
import { Segmenter } from '../lib/segmenter.js'
import { generateText } from '../test/utils.js'

const lang = 'en'
const length = 10_000

const text = generateText(lang, length)
const segmenter = new Segmenter(text, lang, { granularity: 'word' })

describe('Counter Class', () => {
  it('should count words and compute reading time', async () => {
    const words = await segmenter.getWords()
    const counter = new Counter(words)
    const minutes = counter.getMinutes()
    expect(minutes).toMatchInlineSnapshot('38')
  })
})
