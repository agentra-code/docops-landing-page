import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Agentra DocOps',
    short_name: 'DocOps',
    description: 'Phần mềm AI xử lý văn bản hành chính trường đại học',
    start_url: '/',
    display: 'browser',
    background_color: '#f9f9f7',
    theme_color: '#567f2e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
