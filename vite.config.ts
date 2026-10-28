import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/taiwan-candidate-map/',
  plugins: [react()],
  build: {
    // 首頁是推薦問卷(index.html),地圖在 map.html
    rollupOptions: { input: { index: 'index.html', map: 'map.html' } },
  },
})
