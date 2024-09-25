import vue from '@vitejs/plugin-vue'
import Doctor from 'unplugin-doctor'
import VueRouter from 'unplugin-vue-router'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Doctor(VueRouter, { dts: false }).vite({
      afterLoad(id, code) {
        console.log(id, code)
      },
    }),

    vue(),
  ],
})
