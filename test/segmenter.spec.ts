import { describe, expect, it } from 'vitest'
import { Segmenter } from '../lib/segmenter.js'
import { Counter } from '../lib/counter.js'

describe('WordSegmenter Class', () => {
  describe('parameters', () => {
    it('has default locale parameter', () => {
      const segmenter = new Segmenter('hi, hello')
      expect(segmenter.locale).toBe('en')
    })

    it('takes new locale parameter', () => {
      const segmenter = new Segmenter('안녕', 'ko')
      expect(segmenter.locale).toBe('ko')
    })

    it('extends the char range', async () => {
      const segmenter = new Segmenter(
        'hi, hello, how are you? I am fine',
        'en',
        // lowercase alphabet
        [[0x00_61, 0x00_7a]],
      )
      expect(segmenter.extendedCharRange).toEqual([[0x00_61, 0x00_7a]])
      const words = await segmenter.getWords()
      const CJKCount = words.filter((word) => word.isCJK).length
      expect(CJKCount).toBe(7)
    })

    it('has default options parameter', () => {
      const segmenter = new Segmenter('hi, hello')
      expect(segmenter.options).toEqual({ granularity: 'word' })
    })
  })

  describe('korean', () => {
    it('should count korean words', async () => {
      const text = '안녕하세요 감사합니다 무엇을 도와드릴까요'
      const segmenter = new Segmenter(text, 'ko')
      const words = await segmenter.getWords()
      expect(words.length).toBe(4)
    })

    it('should count korean words with punctuations', async () => {
      const text = '안녕하세요. 감사합니다! 무엇을 도와드릴까요?'
      const segmenter = new Segmenter(text, 'ko')
      const words = await segmenter.getWords()
      expect(words.length).toBe(4)
    })
  })

  describe('english', () => {
    it('should count english words', async () => {
      const text = 'hi hello how are you'
      const segmenter = new Segmenter(text, 'en')
      const words = await segmenter.getWords()
      expect(words.length).toBe(5)
    })

    it('should count english words with punctuations', async () => {
      const text = 'hi! hello. how are you?'
      const segmenter = new Segmenter(text, 'en')
      const words = await segmenter.getWords()
      expect(words.length).toBe(5)
    })
  })
})
