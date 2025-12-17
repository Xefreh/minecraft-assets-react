import index from './index.html';

Bun.serve({
  routes: {
    '/*': index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log('🚀 Server running at http://localhost:3000');
