import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@atoms': resolve(__dirname, 'src/components/atoms'),
      '@molecules': resolve(__dirname, 'src/components/molecules'),
      '@organisms': resolve(__dirname, 'src/components/organisms'),
      '@templates': resolve(__dirname, 'src/components/templates'),
      '@pages': resolve(__dirname, 'src/components/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@store': resolve(__dirname, 'src/store'),
      '@t': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
})
