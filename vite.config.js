import { defineConfig } from 'vite'

export default defineConfig({
  base: '/', // Ensures paths like /favicon.ico are not prefixed with /assets/
})