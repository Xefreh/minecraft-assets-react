import index from './index.html';
import { resolve, join } from 'path';

// Path to the UI package's dist folder for static assets
const uiDistPath = resolve(import.meta.dir, '../../../packages/ui/dist');

Bun.serve({
  routes: {
    '/': index,
  },
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Try to serve static assets from UI package dist
    if (pathname !== '/') {
      const assetPath = join(uiDistPath, pathname);
      const file = Bun.file(assetPath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    // Return 404 for unmatched routes
    return new Response('Not Found', { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log('🚀 Server running at http://localhost:3000');
