import { describe, expect, it } from 'vitest'
import { countReadingTime } from '../lib/index.js'
import { generateText } from './utils.js'

describe('reading time', () => {
  it('minutes', async () => {
    const minutes = await countReadingTime(generateText('ko', 6000))
    expect(minutes).toMatchInlineSnapshot('24')
  })
})
