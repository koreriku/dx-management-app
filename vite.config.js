import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "172.16.16.134",
    // port: 80, // 必要に応じてポート番号を変更してください
  },
});
