import { describe, expect, it } from 'vitest'
import { Segmenter } from '../lib/segmenter.js'

describe('WordSegmenter Class', () => {
  describe('korean', () => {
    it('should count korean words', async () => {
      const text = '안녕하세요 감사합니다 무엇을 도와드릴까요'
      const segmenter = new Segmenter(text, 'ko', { granularity: 'word' })
      const words = await segmenter.getWords()
      expect(words.length).toBe(4)
    })

    it('should count korean words with punctuations', async () => {
      const text = '안녕하세요. 감사합니다! 무엇을 도와드릴까요?'
      const segmenter = new Segmenter(text, 'ko', { granularity: 'word' })
      const words = await segmenter.getWords()
      expect(words.length).toBe(4)
    })
  })

  describe('english', () => {
    it('should count english words', async () => {
      const text = 'hi hello how are you'
      const segmenter = new Segmenter(text, 'en', { granularity: 'word' })
      const words = await segmenter.getWords()
      expect(words.length).toBe(5)
    })

    it('should count english words with punctuations', async () => {
      const text = 'hi! hello. how are you?'
      const segmenter = new Segmenter(text, 'en', { granularity: 'word' })
      const words = await segmenter.getWords()
      expect(words.length).toBe(5)
    })
  })
})
