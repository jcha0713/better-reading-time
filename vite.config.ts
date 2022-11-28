import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import { name } from './package.json'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name,
    },
  },
})
