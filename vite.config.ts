import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Production URL path prefix (must end with `/`). */
export function resolveAppBase(): string {
  if (process.env.GITHUB_PAGES === 'true') {
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'codex-web'
    return `/${repo}/`
  }
  const custom = process.env.VITE_BASE?.trim()
  if (custom) {
    return custom.endsWith('/') ? custom : `${custom}/`
  }
  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: resolveAppBase(),
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
