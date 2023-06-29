<script setup>
import { useDxStore } from "../stores/dxManagement.js";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import InsideDxDetail from "./parts/insideDx/InsideDxDetail.vue";
import { useTheme } from "vuetify";
const theme = useTheme();

const store = useDxStore();

onBeforeMount(async () => {
  await store.getDepartments();
  await store.getInsideDxEffect();
  await store.getInsideDxState();
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
                    class="text-h2 title text-center d-flex justify-space-around"
                    @click="store.switchDx = !store.switchDx"
                  >
                    <span v-if="store.switchDx">社内DX</span>
                    <span v-else>社外DX</span>
                    <v-icon inline size="x-small">mdi-menu-swap</v-icon>
                  </h1>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col lg="6" md="6" sm="6" xs="12">
              <v-card class="mb-6 d-flex justify-space-between no-box-shadow">
                <v-card-title>DX件数</v-card-title>
                <v-card-item class="text-h2 text-right"
                  >{{ store.showInsideDxLists.length
                  }}<span class="text-h5"
                    >/{{ store.insideDxLists.length }}</span
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
                    <tr>
                      <th>部門</th>
                      <th>担当</th>
                      <th>業務</th>
                      <th>支援ツール</th>
                      <th>効果</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in [...store.showInsideDxLists.slice(0, 5)]"
                      class="tr-data"
                      @click="
                        store.insideDxItem = item;
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
                  </tbody>
                </v-table>
              </div>
            </v-card-item>
          </v-card>

          <v-dialog v-model="store.showDetailDialog" width="1100">
            <v-card bg-color="black" class="no-box-shadow transparent">
              <v-card-text>
                <InsideDxDetail />
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
                <v-card-title class="text-center">DX効果</v-card-title>
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
.title {
  cursor: pointer;
  align-items: center;
}

.table {
  min-width: 700px;
}
.title:hover {
  opacity: 0.7;
}
canvas {
  margin: 0 auto;
}
.scrollable-content {
  overflow-y: auto;
}
</style>
