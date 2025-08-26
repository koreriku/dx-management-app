<script setup>
import { ref, onBeforeMount, nextTick } from "vue";
import Button from "./parts/button.vue";
import dxTitle from "./parts/dx/dxTitle.vue";
import { useDxStore } from "../stores/dxManagement.js";
import dxWgList from "./parts/dxWg/dxWgList.vue";
import dxWgRegister from "./parts/dxWg/dxWgRegister.vue";
import dxWgSearchItemInput from "./parts/dxWg/dxWgSearchItemInput.vue";

const store = useDxStore();
store.changeThemeColorForDxWg();
store.dxTitle = 2;

let showList = ref(false);
const showGraphDialog = ref(false);

let tableHeight = 0;
let tableWidth = 0;
onBeforeMount(async () => {
  tableHeight = store.tableHeightAdjustment();
  tableWidth = store.tableWidthAdjustment();
  store.dxVertical = "課題対応部門";
  store.chartTitle = "";
});

const createGraph = () => {
  nextTick(() => {
    store.createGraph(1, "chart", "top", "brewer.RdBu11");
  });
};

const detailedSearchDialog = ref(false);
store.resetDxItem();

const judgeShowDxWgRegisterUnlockModal = () => {
  if (store.isDxWgRegisterAuthority) {
    store.resetDxWgItem();
    store.showDxWgRegisterDialog = true;
  } else {
    store.showDxWgRegisterUnlockModal = true;
  }
};
</script>

<template>
  <div class="container">
    <dxTitle title="DXWG" sub-title="進捗状況" />
    <div class="d-flex justify-space-between mb-5">
      <div class="d-flex">
        <Button
          color="yellow"
          @click="judgeShowDxWgRegisterUnlockModal"
          class="mr-3"
          v-if="showList === 'true'"
          icon
          ><v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">新規登録</v-tooltip>
        </Button>

        <v-menu
          v-model="detailedSearchDialog"
          :close-on-content-click="false"
          location="end"
          :style="{ fontSize: store.calculateFontSize() + 'rem' }"
          width="1000"
        >
          <template v-slot:activator="{ props }">
            <Button
              id="detailSearch"
              color="primary"
              class="mr-3"
              v-bind="props"
              v-if="showList === 'true'"
              icon
              ><v-icon>mdi-magnify</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >詳細検索</v-tooltip
              >
            </Button>
          </template>
          <v-card>
            <v-row>
              <v-col>
                <v-card-text>詳細絞り込み</v-card-text>
              </v-col>
              <v-col>
                <div class="mt-2" align="end">
                  <Button
                    color="gray"
                    class="mr-2"
                    @click="
                      store.resetDxWgItem();
                      store.startDate = null;
                      store.endDate = null;
                    "
                    icon
                    ><v-icon>mdi-restore</v-icon>
                    <v-tooltip activator="parent" location="right"
                      >検索条件リセット</v-tooltip
                    ></Button
                  >
                  <Button
                    color="gray"
                    @click="
                      store.resetDxWgItem();
                      detailedSearchDialog = !detailedSearchDialog;
                    "
                    icon
                    ><v-icon>mdi-arrow-u-left-bottom</v-icon>
                    <v-tooltip activator="parent" location="right"
                      >戻る</v-tooltip
                    ></Button
                  >
                </div>
              </v-col>
            </v-row>
            <v-card-item>
              <dxWgSearchItemInput />
            </v-card-item>

            <div class="mb-4 text-center" style="align-self: center">
              <Button
                color="primary"
                @click="
                  store.isDxWgDetailedFilter = true;
                  store.searchDxWgWord = null;
                  store.searchDxWg();
                  store.sortDxWg(false);
                  detailedSearchDialog = false;
                "
                icon
                ><v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="right"
                  >絞り込み</v-tooltip
                ></Button
              >
            </div>
          </v-card>
        </v-menu>

        <div v-if="showList === 'false'">
          <Button
            color="primary"
            @click="showGraphDialog = !showGraphDialog"
            class="mr-3 mb-2"
            icon
          >
            <v-icon>mdi-chart-bar</v-icon>
            <v-tooltip activator="parent" location="bottom">グラフ</v-tooltip>
          </Button>

          <Button
            color="green"
            @click="store.createDxWgExcel"
            class="mr-3 mb-2"
            icon
          >
            <v-icon>mdi-microsoft-excel</v-icon>

            <v-tooltip activator="parent" location="bottom"
              >エクセル出力</v-tooltip
            >
          </Button>
        </div>
        <Button
          color="grey"
          class="mr-3 mb-2"
          v-if="store.isDxWgSearched"
          @click="
            store.searchDxWgWord = null;
            store.isDxWgSearched = false;
            store.isDxWgDetailedFilter = false;
            store.resetDxWgItem();
            store.searchDxWg();
            store.sortDxWg(false);
          "
          icon
          ><v-icon>mdi-restore</v-icon>
          <v-tooltip activator="parent" location="right"
            >リセット</v-tooltip
          ></Button
        >
      </div>

      <div style="width: 600px" class="d-flex">
      <v-select
          v-model="store.selectedDxWgYear"
          :items="['全て',...store.dxWgYears]"
          density="compact"
          variant="outlined"
          label="年度"
          class="mr-2"
          style="max-width: 150px"
          @update:model-value="
            () => {
              store.getDxWg();
            }
          "
        ></v-select>
        <v-text-field
          label="キーワード検索"
          variant="outlined"
          density="compact"
          class="mx-2"
          v-model="store.searchDxWgWord"
          append-inner-icon="mdi-magnify"
          @keyup.enter="
            store.isDxWgDetailedFilter = false;
            store.filteringWord = null;
            store.searchDxWg();
          "
        ></v-text-field>
      </div>
    </div>

    <v-dialog
      v-model="store.showDxWgRegisterUnlockModal"
      width="400"
      :style="{ fontSize: store.calculateFontSize() * 0.95 + 'rem' }"
      style="line-height: 2rem"
    >
      <v-card class="card">
        <v-row>
          <v-col>
            <v-card-text class="text-medium-emphasis">登録権限解除</v-card-text>
          </v-col>
          <v-col>
            <div class="mt-2 me-2" align="end">
              <Button
                color="gray"
                class="mr-3"
                @click="store.showDxWgRegisterUnlockModal = false"
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
            @keyup.enter="store.unlockDxWgRegisterAuthority"
            v-model="store.password"
          ></v-text-field>
        </v-card-item>
        <div v-if="store.message" class="message">{{ store.message }}</div>
        <div class="mb-4" style="align-self: center">
          <Button
            type="submit"
            color="yellow"
            @click="store.unlockDxWgRegisterAuthority"
            icon
            ><v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >OK</v-tooltip
            ></Button
          >
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showGraphDialog"
      width="400"
      :style="{ fontSize: store.calculateFontSize() + 'rem' }"
    >
      <v-card>
        <v-row>
          <v-col>
            <v-card-text>グラフ作成</v-card-text>
          </v-col>
          <v-col>
            <div class="mt-2 me-2" align="end">
              <Button
                color="gray"
                @click="showGraphDialog = !showGraphDialog"
                icon
                ><v-icon>mdi-arrow-u-left-bottom</v-icon>
                <v-tooltip activator="parent" location="right"
                  >戻る</v-tooltip
                ></Button
              >
            </div>
          </v-col>
        </v-row>

        <v-select
          v-model="store.dxVertical"
          :items="store.dxWgVerticalList"
          label="横軸"
          class="ma-5 mb-0"
          variant="outlined"
        ></v-select>

        <!-- <v-select
          v-model="store.insideDxHorizontal"
          :items="store.insideDxHorizontalList"
          label="縦軸"
          class="ma-5 my-0"
          variant="outlined"
          disabled
        ></v-select> -->
        <v-select
          v-model="store.dxChart"
          :items="store.dxChartList"
          label="グラフの種類"
          class="ma-5 my-0"
          variant="outlined"
        ></v-select>
        <div class="mb-4" style="align-self: center">
          <Button
            color="primary"
            @click="
              createGraph();
              showGraphDialog = !showGraphDialog;
            "
            icon
            ><v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="right"
              >作成</v-tooltip
            ></Button
          >
        </div>
      </v-card>
    </v-dialog>

    <v-card border flat>
      <v-tabs v-model="showList" bg-color="grey-lighten-4">
        <v-tab value="true"
          ><v-icon class="custom-icon">mdi-format-list-bulleted</v-icon></v-tab
        >
        <v-tab value="false" @click="createGraph"
          ><v-icon class="custom-icon">mdi-chart-bar</v-icon></v-tab
        >
      </v-tabs>

      <v-card-item>
        <v-window v-model="showList">
          <v-window-item value="true">
            <!-- リスト表示 -->
            <dxWgList :tableHeight="tableHeight" />
          </v-window-item>

          <!-- 登録画面表示 -->
          <v-dialog v-model="store.showDxWgRegisterDialog" width="1100">
            <v-card class="no-box-shadow">
              <v-card-text>
                <dxWgRegister />
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-window-item value="false">
            <v-row>
              <v-col>
                <div class="table-wrap">
                  <div class="text-center text-h6">{{ store.chartTitle }}</div>
                  <canvas
                    id="chart"
                    :width="tableWidth"
                    :height="tableHeight * 1.35"
                    :style="
                      'min-width:' + String(tableWidth) + 'px; margin: 0 auto'
                    "
                  ></canvas>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-item>
    </v-card>
  </div>
</template>

<style scoped>
.custom-icon {
  font-size: 1.5rem;
}
</style>
