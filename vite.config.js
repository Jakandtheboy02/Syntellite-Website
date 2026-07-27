import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        projectDetail: resolve(__dirname, 'project-detail.html'),
        contact: resolve(__dirname, 'contact.html'),
        clientPortal: resolve(__dirname, 'client-portal.html'),
      },
    },
  },
});
