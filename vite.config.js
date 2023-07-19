import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "localhost",
    // port: 80, // 必要に応じてポート番号を変更してください
  },
});
