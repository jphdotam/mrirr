import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Get the repository name from package.json or environment variable
const base = process.env.NODE_ENV === 'production' ? '/mrirr/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: base,
})
