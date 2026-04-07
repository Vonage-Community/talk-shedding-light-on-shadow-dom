import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'node:path';

export default defineConfig({
  root: 'public',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
  },

  plugins: [
    handlebars({
      partialDirectory: [
        path.resolve(__dirname, 'public/partials'),
        path.resolve(__dirname, 'public'),
      ],
      context: {
        siteName: 'Shedding light on the Shadow Dom',
      },
    }),
  ],

});
