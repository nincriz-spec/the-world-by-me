
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/countries': {
        target: 'https://api.restcountries.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/countries/, '/countries/v5'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Authorization',
              'Bearer rc_live_demo'
            )
          })
        },
      },
    },
  },
})
