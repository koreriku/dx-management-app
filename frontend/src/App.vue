<script setup>
import { ref, onBeforeMount } from "vue";
import { useTheme } from "vuetify";
import { useRouter, useRoute } from "vue-router";
import { useDxStore } from "./stores/dxManagement.js";
import Button from "./components/parts/button.vue";

const store = useDxStore();
const theme = useTheme();
const router = useRouter();
const route = useRoute();
const drawer = ref(false);

onBeforeMount(() => {
  if (localStorage.getItem("theme")) {
    theme.global.name.value = localStorage.getItem("theme");
  }
  if (localStorage.getItem("fontSizeNum")) {
    store.fontSizeNum = localStorage.getItem("fontSizeNum");
  }
  store.getLastDayOfMonth();
});

const reloadGraph = () => {
  if (route.path === "/") {
    if (store.dxTitle == 2) {
      store.dxWgHomeUseGraph();
    } else {
      store.dxHomeUseGraph();
    }
  } else if (route.path === "/dx" && document.getElementById("chart")) {
    if (store.switchDx) {
      if (!store.insideDxVerticalList.includes(store.dxVertical)) {
        store.dxVertical = "部門";
      }
    } else {
      if (!store.outsideDxVerticalList.includes(store.dxVertical)) {
        store.dxVertical = "部門";
      }
    }
    store.createGraph(1, "chart", "top");
  } else if (route.path === "/dxWg" && document.getElementById("chart")) {
    store.createGraph(1, "chart", "top", "brewer.RdBu11");
  }
};
const changeTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
  reloadGraph();
};
const reloadDxLists = async () => {
  store.getLastDayOfMonth();
  await store.getSortInsideDxLists();
  store.searchDxWg();
  if (route.path === "/department") {
    store.loadDepartmentsForGanttChart();
  }
  reloadGraph();
};
const setFontSize = () => {
  reloadGraph();
  localStorage.setItem("fontSizeNum", Math.round(store.fontSizeNum));
};
</script>

<template>
  <v-app :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <v-app-bar scroll-behavior="elevate hide" class="custom-app-bar" app>
      <v-app-bar-title>
        <span class="title" @click="router.push('/')">
          <img src="../public/OEC_icon_transparent.png" class="icon mr-2" />
          <!-- <v-icon class="mr-2">mdi-github</v-icon> -->
          <h1 class="text-h6">DX Hub</h1>
        </span>
      </v-app-bar-title>
      <v-toolbar-items active class="toolbar">
        <v-btn to="/"
          ><v-icon size="large">mdi-home</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >ホーム</v-tooltip
          ></v-btn
        >
        <v-btn
          @click="
            store.switchDx = true;
            store.changeSwitchDx();
            store.search();
            reloadGraph();
            router.push('/dx');
          "
          >社内DX</v-btn
        >
        <v-btn
          @click="
            store.switchDx = false;
            store.changeSwitchDx();
            store.search();
            reloadGraph();
            router.push('/dx');
          "
          >社外DX</v-btn
        >
        <v-btn
          @click="
            store.changeSwitchDx();
            router.push('/dxWg');
          "
          >DXWG</v-btn
        >
        <v-btn
          @click="
            store.message = '';
            store.password = '';
            store.showUnlockModal = true;
          "
          >部署一覧</v-btn
        >
        <v-divider
          vertical
          inset
          class="mx-1 border-opacity-25"
          :color="{ white: theme.global.name.value === 'dark' }"
        ></v-divider>
        <v-text-field
          type="month"
          label="基準月"
          variant="outlined"
          density="compact"
          class="mx-1 mt-3"
          v-model="store.referenceMonth"
          @input="reloadDxLists"
        ></v-text-field>
        <v-btn @click="changeTheme">
          <v-icon v-if="theme.global.name.value === 'light'" size="large"
            >mdi-weather-sunny</v-icon
          >
          <v-icon v-else size="large">mdi-weather-night</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >テーマカラー</v-tooltip
          >
        </v-btn>
        <v-btn>
          <v-icon size="large">mdi-format-font-size-increase</v-icon>
          <v-tooltip activator="parent" location="bottom">文字サイズ</v-tooltip>
          <v-icon end> mdi-menu-down </v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-slider
                direction="vertical"
                v-model="store.fontSizeNum"
                @mouseup="setFontSize"
              ></v-slider>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn to="/manual"
          ><v-icon>mdi-help-circle-outline</v-icon
          ><v-tooltip activator="parent" location="bottom"
            >マニュアル</v-tooltip
          ></v-btn
        >
      </v-toolbar-items>

      <v-toolbar-items class="nav">
        <!--ハンバーガーリスト表示-->
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
          v-if="!drawer"
        ></v-app-bar-nav-icon>
        <v-app-bar-nav-icon
          v-else
          @click="drawer = !drawer"
          icon="mdi-close"
        ></v-app-bar-nav-icon>
        <v-text-field
          type="month"
          label="基準月"
          variant="outlined"
          density="compact"
          class="mx-2 mt-3 name"
          v-model="store.referenceMonth"
          @input="reloadDxLists"
        ></v-text-field>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          @click="router.push('/')"
          value="home"
          class="hamburger_font"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-alpha-d-box-outline"
          title="社内DX"
          value="inside"
          @click="
            store.switchDx = true;
            store.changeSwitchDx();
            store.search();
            router.push('/dx');
          "
          class="hamburger_font"
        ></v-list-item>
        <!--Todo outside設定-->
        <v-list-item
          prepend-icon=" mdi-alpha-d-box"
          title="社外DX"
          value="outside"
          @click="
            store.switchDx = false;
            store.changeSwitchDx();
            store.search();
            router.push('/dx');
          "
          class="hamburger_font"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-alpha-d"
          title="DXWG"
          @click="router.push('/dxWg')"
          value="dxWg"
          class="hamburger_font"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-office-building-cog"
          title="部署一覧"
          @click="
            store.message = '';
            store.password = '';
            store.showUnlockModal = true;
          "
          value="department"
          class="hamburger_font"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-help-circle-outline"
          title="マニュアル"
          @click="router.push('/manual')"
          value="マニュアル"
          class="hamburger-font"
        >
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list nav dense>
          <v-row dense>
            <v-col cols="8" mx-1 v-if="theme.global.name.value === 'light'"
              ><v-list-item
                prepend-icon="mdi-weather-sunny"
                title="light"
                class="hamburger_font"
              >
              </v-list-item
            ></v-col>

            <v-col cols="8" mx-1 v-else
              ><v-list-item
                prepend-icon="mdi-weather-night"
                title="dark"
                class="hamburger_font"
              >
              </v-list-item
            ></v-col>

            <v-col cols="4" mx-auto>
              <v-switch
                class="color"
                hide-details="false"
                :false-value="true"
                :true-value="false"
                inset
                @change="changeTheme"
              />
            </v-col>
          </v-row>

          <v-list-item
            prepend-icon="mdi-format-font-size-increase"
            title="文字サイズ"
            class="hamburger_font"
          ></v-list-item>
          <v-slider
            v-model="store.fontSizeNum"
            @mouseup="setFontSize"
            color="#00bfff"
          ></v-slider>
        </v-list>
      </template>
    </v-navigation-drawer>

    <div class="my-15">
      <router-view />
    </div>

    <v-footer class="custom-footer" app>
      <div class="text-center">&copy;{{ store.year }} DX Hub</div></v-footer
    >
  </v-app>

  <v-dialog
    v-model="store.showUnlockModal"
    width="400"
    :style="{ fontSize: store.calculateFontSize() * 0.95 + 'rem' }"
    style="line-height: 2rem"
  >
    <v-card class="card">
      <v-row>
        <v-col>
          <v-card-text class="text-medium-emphasis"
            >部署変更権限解除</v-card-text
          >
        </v-col>
        <v-col>
          <div class="mt-2 me-2" align="end">
            <Button
              color="gray"
              class="mr-3"
              @click="store.showUnlockModal = false"
              icon
              ><v-icon>mdi-arrow-u-left-bottom</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >戻る</v-tooltip
              ></Button
            >
          </div>
        </v-col>
      </v-row>
      <v-card-item>
        <v-text-field
          type="password"
          variant="outlined"
          label="パスワード"
          class="mt-2"
          @keyup.enter="store.unlockDepartmentChangeAuthority"
          v-model="store.password"
        ></v-text-field>
      </v-card-item>
      <div v-if="store.message" class="message">{{ store.message }}</div>
      <div class="mb-4" style="align-self: center">
        <Button
          type="submit"
          color="yellow"
          @click="store.unlockDepartmentChangeAuthority"
          icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom">OK</v-tooltip></Button
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.text-center {
  text-align: center;
  margin: 0 auto;
}
.image-container {
  background-color: transparent;
}
.title {
  display: flex;
  align-items: center;
  width: 100px;
  cursor: pointer;
}
.icon {
  width: 40px;
  height: 40px;
  /* filter: grayscale(100%); */
}
.custom-app-bar {
  border-bottom: 1px solid #ccc; /* 下線のスタイルを追加 */
  box-shadow: none !important;
}
.custom-footer {
  position: static !important;
  border-top: 1px solid #ccc;
}
.opacity:hover {
  opacity: 0.7;
}
.toolbar {
  display: none;
}
.nav {
  display: block;
}
.hamburger_font {
  font-size: 16px;
}
.color {
  color: #00bfff;
}
.btn {
  align-items: end;
}
.name {
  float: left;
}
.under {
  align-items: end;
}

@media screen and (min-width: 960px) {
  .nav {
    display: none;
  }
  .toolbar {
    display: flex;
  }
}
</style>
