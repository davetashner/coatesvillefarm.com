import { defineConfig } from 'vite';

export default {
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import './src/index.css';`,
      },
    },
  },
};