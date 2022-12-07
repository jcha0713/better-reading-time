export function generateText(lang: string, length: number): string {
  const textLang = {
    en: 'hello',
    ko: '안녕',
  }
  // eslint-disable-next-line unicorn/no-new-array
  const words = new Array(length).fill(textLang[lang])
  const text = words.join(' ')
  return text
}
