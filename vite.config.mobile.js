import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Mobile build config - builds with relative paths for Capacitor
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'fixIt-mobile/www',
      emptyOutDir: true,
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://fixit-01yy.onrender.com/api'),
      'import.meta.env.VITE_MOBILE': JSON.stringify('true')
    }
  }
})
