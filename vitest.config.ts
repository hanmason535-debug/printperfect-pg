import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    exclude: ['tests/e2e/**', '**/node_modules/**', '**/dist/**'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.tsx'],
      exclude: ['tests/e2e/**', '**/node_modules/**', '**/dist/**', 'src/components/ui/**'],
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
