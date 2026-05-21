import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'node:path';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/';

export default defineConfig({
  base,
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
