<script setup>
import { ref, onBeforeMount } from "vue";
import Button from "./parts/button.vue";
import dxTitle from "./parts/dx/dxTitle.vue";
import { useDxStore } from "../stores/dxManagement.js";
import dxList from "./parts/dx/dxList.vue";
import DepartmentStateTable from "./totalization/DepartmentStateTable.vue";
import dxRegister from "./parts/dx/dxRegister.vue";

const store = useDxStore();

let showList = ref("true");
const showGraphDialog = ref(false);

let tableHeight = 0;
onBeforeMount(async () => {
  tableHeight = store.tableHeightAdjustment();
});

let switchFigure = ref(true);
const createGraph = () => {
  switchFigure.value = false;
  store.createGraph(1, "chart", "top");
};

const detailedSearchDialog = ref(false);
store.resetDxItem();
</script>

<template>
  <div class="container">
    <dxTitle v-if="store.switchDx" title="社内DX" sub-title="進捗状況" />
    <dxTitle v-else title="社外DX" sub-title="進捗状況" />
    <div class="d-flex justify-space-between mb-5">
      <div class="d-flex">
        <Button
          color="yellow"
          @click="store.showRegisterDialog = true"
          class="mr-3"
          v-if="showList === 'true'"
          icon
          ><v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">新規登録</v-tooltip>
        </Button>
        <Button
          color="primary"
          @click="detailedSearchDialog = true"
          class="mr-3"
          v-if="showList === 'true'"
          icon
          ><v-icon>mdi-magnify</v-icon>
          <v-tooltip activator="parent" location="bottom">詳細検索</v-tooltip>
        </Button>
        <div v-if="showList === 'false'">
          <Button
            color="gray"
            @click="switchFigure = !switchFigure"
            class="mr-3 mb-2"
            v-show="!switchFigure"
            icon
            ><v-icon>mdi-table</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >表</v-tooltip
            ></Button
          >

          <Button
            color="primary"
            @click="showGraphDialog = !showGraphDialog"
            class="mr-3 mb-2"
            icon
          >
            <v-icon>mdi-chart-bar</v-icon>
            <v-tooltip activator="parent" location="bottom">グラフ</v-tooltip>
          </Button>
          <Button color="green" @click="store.createExcel" class="mr-2" icon>
            <v-icon>mdi-microsoft-excel</v-icon>

            <v-tooltip activator="parent" location="bottom"
              >エクセル出力</v-tooltip
            >
          </Button>
        </div>
      </div>

      <div style="width: 500px">
        <v-text-field
          label="キーワード検索"
          variant="outlined"
          density="compact"
          class="mx-2"
          v-model="store.searchWord"
          append-inner-icon="mdi-magnify"
          @keyup.enter="
            store.isDetailedFilter = false;
            store.startDate = null;
            store.endDate = null;
            store.filteringWord = null;
            store.search();
          "
        ></v-text-field>
      </div>
    </div>

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
          v-if="store.switchDx"
          v-model="store.dxVertical"
          :items="store.insideDxVerticalList"
          label="横軸"
          class="ma-5 mb-0"
          variant="outlined"
        ></v-select>
        <v-select
          v-else
          v-model="store.dxVertical"
          :items="store.outsideDxVerticalList"
          label="横軸"
          class="ma-5 mb-0"
          variant="outlined"
        ></v-select>
        <v-select
          v-model="store.insideDxHorizontal"
          :items="store.insideDxHorizontalList"
          label="縦軸"
          class="ma-5 my-0"
          variant="outlined"
        ></v-select>
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
              >絞り込み</v-tooltip
            ></Button
          >
        </div>
      </v-card>
    </v-dialog>

    <v-card>
      <v-tabs v-model="showList" bg-color="grey-lighten-4">
        <v-tab value="true"
          ><v-icon class="custom-icon">mdi-format-list-bulleted</v-icon></v-tab
        >
        <v-tab value="false"
          ><v-icon class="custom-icon">mdi-chart-bar</v-icon></v-tab
        >
      </v-tabs>

      <v-card-item>
        <v-window v-model="showList">
          <v-window-item value="true">
            <!-- リスト表示 -->
            <dxList :tableHeight="tableHeight" />
          </v-window-item>

          <!-- 登録画面表示 -->
          <v-dialog v-model="store.showRegisterDialog" width="1100">
            <v-card class="no-box-shadow">
              <v-card-text>
                <dxRegister />
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-window-item value="false">
            <DepartmentStateTable v-if="switchFigure" :height="tableHeight" />
            <v-row v-show="!switchFigure">
              <v-col>
                <div class="table-wrap">
                  <canvas
                    id="chart"
                    :width="tableHeight * 1.35"
                    :height="tableHeight * 1.35"
                    :style="
                      'min-width:' +
                      String(tableHeight * 1.35) +
                      'px; margin: 0 auto'
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

  <v-dialog
    v-model="detailedSearchDialog"
    width="400"
    :style="{ fontSize: store.calculateFontSize() + 'rem' }"
  >
    <v-card>
      <v-row>
        <v-col>
          <v-card-text>詳細絞り込み</v-card-text>
        </v-col>
        <v-col>
          <div class="mt-2 me-2" align="end">
            <Button
              color="gray"
              @click="detailedSearchDialog = !detailedSearchDialog"
              icon
              class="mr-3"
              ><v-icon>mdi-arrow-u-left-bottom</v-icon>
              <v-tooltip activator="parent" location="left"
                >戻る</v-tooltip
              ></Button
            >
            <Button
              color="grey"
              @click="
                store.resetSearchValue();
                store.search();
                detailedSearchDialog = !detailedSearchDialog;
              "
              icon
              ><v-icon>mdi-restore</v-icon>
              <v-tooltip activator="parent" location="right"
                >リセット</v-tooltip
              ></Button
            >
          </div>
        </v-col>
      </v-row>
      <v-card-item>
        <div
          class="d-flex justify-end mr-15 mt-4"
          style="cursor: pointer"
          @click="store.switchSearchMethod = !store.switchSearchMethod"
        >
          <v-badge
            v-if="store.switchSearchMethod"
            content="部分一致"
            floating
            color="grey-lighten-2"
          ></v-badge>
          <v-badge v-else content="完全一致" floating color="yellow"></v-badge>
        </div>
        <v-select
          v-if="store.switchDx"
          label="列名"
          :items="Object.keys(store.insideDxColumnList)"
          variant="outlined"
          class="mt-2"
          v-model="store.filteringTargetColumn"
        ></v-select>
        <v-select
          v-else
          label="列名"
          :items="Object.keys(store.outsideDxColumnList)"
          variant="outlined"
          class="mt-2"
          v-model="store.filteringTargetColumn"
        ></v-select>
        <v-text-field
          label="キーワード"
          variant="outlined"
          v-model="store.filteringWord"
          v-if="store.filteringTargetColumn !== '登録日'"
        >
        </v-text-field>
        <div v-else>
          <v-text-field
            type="date"
            variant="outlined"
            label="開始日"
            class="mt-3 mb-5"
            v-model="store.startDate"
          ></v-text-field>

          <v-text-field
            type="date"
            variant="outlined"
            label="終了日"
            class="mb-5"
            v-model="store.endDate"
          ></v-text-field>
        </div>
      </v-card-item>

      <div class="mb-4" style="align-self: center">
        <Button
          color="primary"
          @click="
            store.isDetailedFilter = true;
            store.searchWord = null;
            store.startDate = null;
            store.endDate = null;
            store.search();
            detailedSearchDialog = false;
          "
          v-if="store.filteringTargetColumn !== '登録日'"
          icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >絞り込み</v-tooltip
          ></Button
        >
        <Button
          color="primary"
          @click="
            store.isDetailedFilter = false;
            store.searchWord = null;
            store.search();
            detailedSearchDialog = false;
          "
          icon
          v-else
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >絞り込み</v-tooltip
          ></Button
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.custom-icon {
  font-size: 1.5rem;
}
</style>
