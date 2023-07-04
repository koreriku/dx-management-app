import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import router from "./router";

import { createPinia } from "pinia";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const app = createApp(App);

const pinia = createPinia();

const lightColor = {
  // background: "#FAFAFA",
  green: "#4CAF50", // エクセル
  yellow: "#FB8C00", // 新規登録
  red: "#E53935", // 削除
  primary: "#1565C0", // 編集
  gray: "#FAFAFA", // 戻る、
  "grey-lighten-4": "#F5F5F5",
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: lightColor,
      },
      dark: {
        colors: {
          green: "#4CAF50",
          yellow: "#FB8C00",
          red: "#F44336",
          primary: "#1565C0",
          gray: "#FAFAFA",
          "grey-lighten-4": "#424242",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

app.use(router).use(pinia).use(vuetify).mount("#app");

export { vuetify };
