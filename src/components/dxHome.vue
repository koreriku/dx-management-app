<script setup>
import { useDxStore } from "../stores/dxManagement.js";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import dxDetail from "./parts/dx/dxDetail.vue";
import { useTheme } from "vuetify";
const theme = useTheme();

const store = useDxStore();

// const getDxColumnData = async () => {
//   if (store.switchDx) {
//     if (store.insideDxEffect.length === 0 && store.insideDxState.length === 0) {
//       await store.getInsideDxEffect();
//       await store.getInsideDxState();
//     }
//   } else {
//     if (
//       store.outsideDxIndustry.length === 0 &&
//       store.outsideDxState.length === 0 &&
//       store.outsideDxTechnology.length === 0
//     ) {
//       await store.getOutsideDxIndustry();
//       await store.getOutsideDxState();
//       await store.getOutsideDxTechnology();
//     }
//   }
// };

onBeforeMount(async () => {
  await store.getDepartments();
  await store.getInsideDxEffect();
  await store.getInsideDxState();
  await store.getOutsideDxIndustry();
  await store.getOutsideDxState();
  await store.getOutsideDxTechnology();
  await store.getSortInsideDxLists();
  store.dxHomeUseGraph();
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
            <v-col lg="6" md="6" sm="6" xs="12">
              <v-card v-card class="no-box-shadow">
                <v-card-item>
                  <h1
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
                  </h1>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col lg="6" md="6" sm="6" xs="12">
              <v-card class="mb-6 d-flex justify-space-between no-box-shadow">
                <v-card-title>DX件数</v-card-title>
                <v-card-item class="text-h2 text-right"
                  >{{ store.showDxLists.length
                  }}<span class="text-h5" v-if="store.switchDx"
                    >/{{ store.insideDxLists.length }}</span
                  ><span class="text-h5" v-else
                    >/{{ store.outsideDxLists.length }}</span
                  ></v-card-item
                >
              </v-card>
            </v-col>
          </v-row>

          <v-card class="no-box-shadow">
            <v-card-title class="text-center">部門別DX件数</v-card-title>
            <v-card-item>
              <div class="table-wrap">
                <canvas id="departmentChart" width="700" height="550"></canvas>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col lg="6" sm="12" xs="12">
          <v-card class="no-box-shadow">
            <v-card-title class="text-center">新着DX一覧</v-card-title>
            <v-card-item>
              <div class="table-wrap">
                <v-table density="compact" class="table" height="310">
                  <thead>
                    <tr v-if="store.switchDx">
                      <th>部門</th>
                      <th>担当</th>
                      <th>業務</th>
                      <th>支援ツール</th>
                      <th>効果</th>
                    </tr>
                    <tr v-else>
                      <th>部門</th>
                      <th>更新者</th>
                      <th>製品・サービス名</th>
                      <th>技術</th>
                      <th>状況</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-if="store.switchDx"
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
                      v-else
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

          <v-row class="mt-3">
            <v-col md="6">
              <v-card class="no-box-shadow">
                <v-card-title class="text-center">DX運用状況</v-card-title>
                <v-card-item>
                  <div class="table-wrap">
                    <canvas id="stateChart" width="300" height="250"></canvas>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col md="6">
              <v-card class="no-box-shadow">
                <v-card-title v-if="store.switchDx" class="text-center"
                  >DX効果</v-card-title
                >
                <v-card-title v-else class="text-center">DX業界別</v-card-title>
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
