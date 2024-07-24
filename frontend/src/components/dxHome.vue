<script setup>
import { useDxStore } from "../stores/dxManagement.js";
import { onBeforeMount, ref, watch } from "vue";
import dxDetail from "./parts/dx/dxDetail.vue";
import dxWgDetail from "./parts/dxWg/dxWgDetail.vue";

import { useTheme } from "vuetify";
const theme = useTheme();

const store = useDxStore();
// ホーム画面のタイトル(0:社内DX,1:社外DX,2:DXWG)
const dxTitle = ref(store.dxTitle);
if (store.dxTitle == 2) {
  dxTitle.value = 2;
} else {
  if (store.switchDx) {
    dxTitle.value = 0;
  } else {
    dxTitle.value = 1;
  }
}
const dxTitles = ref(["社内DX", "社外DX", "DXWG"]);
const changeTitle = () => {
  if (dxTitle.value == 0) {
    store.switchDx = true;
    store.dxTitle = 0;
    store.changeSwitchDx();
    store.search();
    store.dxHomeUseGraph();
  } else if (dxTitle.value == 1) {
    store.switchDx = false;
    store.dxTitle = 1;
    store.changeSwitchDx();
    store.search();
    store.dxHomeUseGraph();
  } else if (dxTitle.value == 2) {
    store.dxTitle = 2;
    store.changeSwitchDx();
    store.searchDxWg();
    store.dxWgHomeUseGraph();
  }
};

onBeforeMount(async () => {
  if (store.departments.length === 0) {
    await store.getDepartments();
  }

  if (store.insideDxEffect.length === 0) {
    await store.getInsideDxEffect();
  }
  if (store.insideDxState.length === 0) {
    await store.getInsideDxState();
  }

  if (store.outsideDxIndustry.length === 0) {
    await store.getOutsideDxIndustry();
  }
  if (store.outsideDxState.length === 0) {
    await store.getOutsideDxState();
  }
  if (store.outsideDxTechnology.length === 0) {
    await store.getOutsideDxTechnology();
  }

  if (store.insideDxLists.length === 0 || store.outsideDxLists.length === 0) {
    await store.getSortInsideDxLists();
  } else {
    await store.search();
  }

  if (store.dxWgEffects.length === 0) {
    await store.getDxWgEffect();
  }
  if (store.dxWgStates.length === 0) {
    await store.getDxWgState();
  }
  if (store.dxWgCategories.length === 0) {
    await store.getCategory();
  }
  if (store.dxWgs.length === 0) {
    await store.getDxWg();
  }
  changeTitle();
});
watch(dxTitle, (newTitle, oldTitle) => {
  changeTitle();
});
</script>

<template>
  <div
    class="container pb-15 mb-n15"
    :style="{
      backgroundColor: theme.global.name.value === 'light' ? '#fafafa' : '',
    }"
  >
    <div class="Dx">
      <v-row class="justify-space-around mb-3">
        <v-col lg="6" sm="12">
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <v-card v-card class="no-box-shadow">
                <v-card-item>
                  <v-window v-model="dxTitle" show-arrows>
                    <template v-slot:prev="{ props }">
                      <v-btn
                        icon
                        size="small"
                        @click="props.onClick"
                        class="ml-n3"
                      >
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:next="{ props }">
                      <v-btn
                        icon
                        size="small"
                        @click="props.onClick"
                        class="mr-n3"
                      >
                        <v-icon> mdi-chevron-right</v-icon>
                      </v-btn>
                    </template>
                    <v-window-item v-for="title of dxTitles">
                      <v-card class="d-flex justify-center align-center">
                        <span class="text-h3">{{ title }}</span>
                      </v-card>
                    </v-window-item>
                  </v-window>
                  <!-- <h1
                    class="text-h2"
                    @click="
                      store.switchDx = !store.switchDx;
                      store.changeSwitchDx();
                      store.search();
                      store.dxHomeUseGraph();
                    "
                  >
                    <v-row justify="space-between">
                      <v-col cols="auto">
                        <span v-if="store.switchDx">社内DX</span>
                        <span v-else>社外DX</span>
                      </v-col>
                      <v-col cols="auto">
                        <v-switch
                          v-model="store.switchDx"
                          inset
                          inline
                          hide-details="false"
                          color="#00bfff"
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </h1> -->
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <v-card class="mb-6 d-flex justify-space-between no-box-shadow">
                <v-card-title>DX件数</v-card-title>
                <v-card-item class="text-h2 text-right"
                  ><span v-if="dxTitle == 0"
                    ><span class="text-h3">{{ store.showDxLists.length }}</span
                    ><span class="text-h5"
                      >/{{ store.insideDxLists.length }}</span
                    ></span
                  ><span v-else-if="dxTitle == 1"
                    ><span class="text-h3">{{ store.showDxLists.length }}</span
                    ><span class="text-h5"
                      >/{{ store.outsideDxLists.length }}</span
                    ></span
                  ><span v-else-if="dxTitle == 2"
                    ><span class="text-h3">{{ store.showDxWgs.length }}</span
                    ><span class="text-h5"
                      >/{{ store.dxWgs.length }}</span
                    ></span
                  ></v-card-item
                >
              </v-card>
            </v-col>
          </v-row>

          <v-card class="no-box-shadow">
            <v-card-title
              class="text-center"
              v-if="dxTitle == 0 || dxTitle == 1"
              >部門別DX件数</v-card-title
            >
            <v-card-title class="text-center" v-if="dxTitle == 2"
              >対応部門別DX件数</v-card-title
            >
            <v-card-item>
              <div class="table-wrap">
                <canvas id="departmentChart" width="700" height="550"></canvas>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6" sm="12" xs="12">
          <v-card class="no-box-shadow">
            <v-card-title class="text-center">新着DX一覧</v-card-title>
            <v-card-item>
              <div class="table-wrap">
                <v-table density="compact" class="table" height="310">
                  <thead>
                    <tr v-if="dxTitle == 0">
                      <th>部門</th>
                      <th>担当</th>
                      <th>業務</th>
                      <th>支援ツール</th>
                      <th>効果</th>
                    </tr>
                    <tr v-else-if="dxTitle == 1">
                      <th>部門</th>
                      <th>更新者</th>
                      <th>製品・サービス名</th>
                      <th>技術</th>
                      <th>状況</th>
                    </tr>
                    <tr v-else-if="dxTitle == 2">
                      <th>対応部門</th>
                      <th>担当</th>
                      <th>内容</th>
                      <th>期限</th>
                      <th>状況</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-if="dxTitle == 0"
                      v-for="item in [...store.showDxLists.slice(0, 5)]"
                      class="tr-data"
                      @click="
                        store.dxItem = item;
                        store.showDetailDialog = true;
                      "
                    >
                      <td class="py-2">
                        {{ item.department }}
                      </td>
                      <td class="py-2">{{ item.staff }}</td>
                      <td class="py-2">{{ item.work }}</td>
                      <td class="py-2">{{ item.support_tool }}</td>
                      <td class="py-2">
                        {{ item.effect }}
                      </td>
                    </tr>
                    <tr
                      v-else-if="dxTitle == 1"
                      v-for="item in [...store.showDxLists.slice(0, 5)]"
                      class="tr-data"
                      @click="
                        store.dxItem = item;
                        store.showDetailDialog = true;
                      "
                    >
                      <td class="py-2">
                        {{ item.department }}
                      </td>
                      <td class="py-2">{{ item.changer }}</td>
                      <td class="py-2">{{ item.product }}</td>
                      <td class="py-2">
                        {{ store.showOutsideDxTechnology(item.technology) }}
                      </td>
                      <td class="py-2">
                        {{ item.state }}
                      </td>
                    </tr>
                    <tr
                      v-else-if="dxTitle == 2"
                      v-for="item in [...store.showDxWgs.slice(0, 5)]"
                      class="tr-data"
                      @click="
                        store.dxWg = item;
                        store.showDxWgDetailDialog = true;
                      "
                    >
                      <td class="py-2">
                        {{
                          store.convertArrayToText(item.support_department_name)
                        }}
                      </td>
                      <td class="py-2">{{ item.staff }}</td>
                      <td class="py-2">{{ item.support_content }}</td>
                      <td class="py-2">
                        {{ item.deadline }}
                      </td>
                      <td class="py-2">
                        {{ item.state_name }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-item>
          </v-card>

          <v-dialog v-model="store.showDetailDialog" width="1100">
            <v-card bg-color="black" class="no-box-shadow transparent">
              <v-card-text>
                <dxDetail />
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- DXWG詳細画面表示 -->
          <v-dialog v-model="store.showDxWgDetailDialog" width="1100">
            <v-card class="no-box-shadow">
              <v-card-text>
                <dxWgDetail />
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-row class="mt-3">
            <v-col cols="12" md="6">
              <v-card class="no-box-shadow">
                <v-card-title class="text-center">DX運用状況</v-card-title>
                <v-card-item>
                  <div class="table-wrap">
                    <canvas id="stateChart" width="300" height="250"></canvas>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="no-box-shadow">
                <v-card-title
                  v-if="dxTitle == 0 || dxTitle == 2"
                  class="text-center"
                  >DX効果</v-card-title
                >
                <v-card-title v-else-if="dxTitle == 1" class="text-center"
                  >DX業界別</v-card-title
                >

                <v-card-item>
                  <div class="table-wrap">
                    <canvas id="effectChart" width="300" height="250"></canvas>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.table {
  min-width: 700px;
}

canvas {
  margin: 0 auto;
}
</style>
