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
      include: ['src/components/Lightbox.tsx', 'src/components/Portfolio.tsx', 'src/components/ServicesGrid.tsx'],
      reports: ['text', 'html'],
      exclude: ['tests/e2e/**', '**/node_modules/**', '**/dist/**'],
      thresholds: {
        lines: 90,
        functions: 40,
        branches: 60,
        statements: 90
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
