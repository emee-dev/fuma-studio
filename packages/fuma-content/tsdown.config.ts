import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts', "bin/index.ts"],
    // platform: 'neutral',
    platform: 'node',
    dts: true,
  },
])
