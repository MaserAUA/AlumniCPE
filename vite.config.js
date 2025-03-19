import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip', // หรือ 'brotliCompress' สำหรับ Brotli
      ext: '.gz', // นามสกุลไฟล์ที่บีบอัด
    }),
  ],
});
