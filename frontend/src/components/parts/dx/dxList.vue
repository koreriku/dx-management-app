<script setup>
import { ref, onBeforeMount, defineProps } from "vue";
import { useRouter,useRoute } from "vue-router";
import Button from "../button.vue";
import sortToggle from "../sortToggle.vue";
import dxDetail from "./dxDetail.vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  tableHeight: Number,
});

const showSearchDialog = ref(false);

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

  if (store.dxCategories.length === 0) {
    await store.getDxCategory();
  }

  if (store.insideDxLists.length === 0 || store.outsideDxLists.length === 0) {
    await store.getSortInsideDxLists();
  }
  if(route.query.id){
    store.dxItem = store.showDxLists.find(item => item.id == route.query.id);
    if(!store.dxItem){
      await store.getDxWithId(route.query.id);
    }
    if(store.dxItem){
      store.showDetailDialog = true;
    }else{
      store.displaySnackbar("該当する課題が見つかりません。","error");
    }
  }
});

// クリックのたびに 昇順 → 降順 → 元の並び順 の3段階で切り替える
const defaultSortValue = "更新日";
const defaultSequence = "降順";
let sortingColumn = null;
let sortPhase = 0; // 1: 昇順, 2: 降順, 0: 元に戻す

const sort = (column) => {
  if (sortingColumn !== column) {
    sortingColumn = column;
    sortPhase = 1;
  } else if (sortPhase === 1) {
    sortPhase = 2;
  } else {
    sortPhase = 0;
  }

  if (sortPhase === 0) {
    sortingColumn = null;
    store.sortValue = defaultSortValue;
    store.sequence = defaultSequence;
  } else {
    store.sortValue = column;
    store.sequence = sortPhase === 1 ? "昇順" : "降順";
  }
  store.getSortInsideDxLists();
};

let showAllWord = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value) {
    // 改行は削除ではなくスペースに置き換え、段落同士が連結しないようにする
    const oneLineText = String(text).replace(/\r?\n/g, " ");
    return oneLineText.length > max_length
      ? oneLineText.slice(0, max_length) + "…"
      : oneLineText;
  } else {
    return text;
  }
};
const windowWidth = window.innerWidth;
</script>

<template>
  <div class="table-wrap">
    <v-table :height="props.tableHeight" class="table" fixed-header="true">
      <thead>
        <tr v-if="store.switchDx">
          <th class="a" @click="sort('部門')">
            部門
            <sortToggle column="部門" />
          </th>
          <th class="a" @click="sort('タイトル・業務')">
            タイトル・業務<sortToggle column="タイトル・業務" />
          </th>
          <th class="a" @click="sort('支援ツール')">
            支援ツール<sortToggle column="支援ツール" />
          </th>
          <th class="e">
            <div class="d-flex justify-space-between">
              <span @click="sort('内容・結果')"
                >内容・結果<sortToggle column="内容・結果"
              /></span>
              <v-badge
                :color="showAllWord ? 'red' : 'grey-lighten-2'"
                content="全表示"
                class="mr-2"
                @click="showAllWord = !showAllWord"
                inline
              ></v-badge>
            </div>
          </th>
          <th class="b" @click="sort('効果')">
            効果<sortToggle column="効果" />
          </th>
          <th class="c" @click="sort('状況')">
            状況<sortToggle column="状況" />
          </th>
          <th class="a" @click="sort('カテゴリー')">
            カテゴリー<sortToggle column="カテゴリー" />
          </th>
          <th class="b" @click="sort('いいね数')">
            いいね数<sortToggle column="いいね数" />
          </th>
          <th class="c" @click="sort('登録日')">
            登録日
            <sortToggle column="登録日" />
          </th>
        </tr>

        <tr v-else>
          <th class="a" @click="sort('部門')">
            部門
            <sortToggle column="部門" />
          </th>
          <th class="a" @click="sort('業界')">
            業界<sortToggle column="業界" />
          </th>
          <th class="a" @click="sort('製品・サービス名')">
            製品・サービス名<sortToggle column="製品・サービス名" />
          </th>

          <th class="c" @click="sort('技術')">
            技術<sortToggle column="技術" />
          </th>
          <th class="e">
            <div class="d-flex justify-space-between">
              <span @click="sort('技術詳細')"
                >技術詳細<sortToggle column="技術詳細"
              /></span>
              <v-badge
                :color="showAllWord ? 'red' : 'grey-lighten-2'"
                content="全表示"
                class="mr-2"
                @click="showAllWord = !showAllWord"
                inline
              ></v-badge>
            </div>
          </th>
          <th class="c" @click="sort('状況')">
            状況<sortToggle column="状況" />
          </th>
          <th class="a" @click="sort('顧客')">
            顧客<sortToggle column="顧客" />
          </th>
          <th class="b" @click="sort('いいね数')">
            いいね数<sortToggle column="いいね数" />
          </th>
          <th class="c" @click="sort('登録日')">
            登録日
            <sortToggle column="登録日" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-if="store.switchDx"
          v-for="item in store.showDxLists"
          class="tr-data"
          @click="
            store.dxItem = item;
            router.push({ path: '/dx', query: { id: item.id } });
            store.showDetailDialog = true;
          "
        >
          <td class="text-left">
            {{ item.department }}
          </td>
          <td class="text-left wrap">
            {{ omittedText(item.work, 16) }}
          </td>
          <td class="text-left wrap">
            {{ omittedText(item.support_tool, 25) }}
          </td>
          <td class="text-left wrap py-2">
            {{
              omittedText(
                store.stripHtml(item.expected_effect),
                windowWidth * 0.03
              )
            }}
          </td>
          <td class="text-left">
            {{ item.effect }}
          </td>
          <td class="text-left">
            {{ item.state }}
          </td>
          <td class="text-left wrap">
            <v-chip
              v-for="cat in item.category_name"
              :key="cat"
              size="small"
              class="mr-1 mb-1"
              >{{ cat }}</v-chip
            >
          </td>
          <td class="text-left">
            {{ item.likes ? item.likes.length : 0 }}
          </td>
          <td class="text-left">
            {{ item.registration_date }}
          </td>
        </tr>

        <tr
          v-else
          v-for="item in store.showDxLists"
          class="tr-data"
          @click="
            store.dxItem = item;
            router.push({ path: '/dx', query: { id: item.id } });
            store.showDetailDialog = true;
          "
        >
          <td class="text-left">
            {{ item.department }}
          </td>
          <td class="text-left wrap">
            {{ item.industry }}
          </td>
          <td class="text-left wrap">
            {{ omittedText(item.product, 16) }}
          </td>
          <td class="text-left wrap">
            {{
              omittedText(store.showOutsideDxTechnology(item.technology), 12)
            }}
          </td>
          <td class="text-left wrap py-2">
            {{ omittedText(store.stripHtml(item.technical_details), 54) }}
          </td>
          <td class="text-left">
            {{ item.state }}
          </td>
          <td class="text-left">
            {{ item.customer }}
          </td>
          <td class="text-left">
            {{ item.likes ? item.likes.length : 0 }}
          </td>
          <td class="text-left">
            {{ item.registration_date }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- 詳細画面表示 -->
  <v-dialog v-model="store.showDetailDialog" width="1100">
    <v-card border flat>
      <v-card-text>
        <dxDetail />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* tableの列幅固定 */
/* .table {
  min-width: 700px;
} */

.tr-data {
  white-space: pre-line;
}

.a {
  width: 24rem;
}
.b {
  width: 7rem;
}
.c {
  width: 16rem;
}
.e {
  width: 70rem;
}
</style>
