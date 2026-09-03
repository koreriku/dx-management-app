<script setup>
import { ref, onBeforeMount, defineProps } from "vue";
import { useRouter,useRoute } from "vue-router";
import Button from "../button.vue";
import sortDxWgToggle from "../sortDxWgToggle.vue";
import dxWgDetail from "./dxWgDetail.vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();

const props = defineProps({
  tableHeight: Number,
});
const router = useRouter();
const route = useRoute();

const showSearchDialog = ref(false);

onBeforeMount(async () => {
  if (store.departments.length === 0) {
    await store.getDepartments();
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
  if(route.query.id){
    store.dxWg = store.dxWgs.find(item => item.id == route.query.id);
    if(!store.dxWg){
      await store.getDxWgWithId(route.query.id);
    }
    if(store.dxWg){
      store.showDxWgDetailDialog = true;
    }else{
      store.displaySnackbar("該当する課題が見つかりません。","error");
    }
  }
});

let showAllWord = ref(false);
let showQuarter = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value && text) {
    // 改行は削除ではなくスペースに置き換え、段落同士が連結しないようにする
    const oneLineText = String(text).replace(/\r?\n/g, " ");
    return oneLineText.length > max_length
      ? oneLineText.slice(0, max_length) + "…"
      : oneLineText;
  } else {
    return text;
  }
};
// クリックのたびに 昇順 → 降順 → 元の並び順 の3段階で切り替える
const defaultSortDxWgValue = "update_date";
const defaultDxWgSequence = "降順";
let sortingDxWgColumn = null;
let sortDxWgPhase = 0; // 1: 昇順, 2: 降順, 0: 元に戻す

const sortDxWgByColumn = (column) => {
  if (sortingDxWgColumn !== column) {
    sortingDxWgColumn = column;
    sortDxWgPhase = 1;
  } else if (sortDxWgPhase === 1) {
    sortDxWgPhase = 2;
  } else {
    sortDxWgPhase = 0;
  }

  if (sortDxWgPhase === 0) {
    sortingDxWgColumn = null;
    store.sortDxWgValue = defaultSortDxWgValue;
    store.dxWgSequence = defaultDxWgSequence;
  } else {
    store.sortDxWgValue = column;
    store.dxWgSequence = sortDxWgPhase === 1 ? "昇順" : "降順";
  }
  store.sortDxWg(false);
};

const displayQuarter = () => {
  if (showQuarter.value) {
    showQuarter.value = false;
    tableWidth.value = 3500;
  } else {
    showQuarter.value = true;
    tableWidth.value = 4500;
  }
};
const windowWidth = window.innerWidth;
const tableWidth = ref(3000);
</script>

<template>
  <div class="table-wrap">
    <v-table
      :height="props.tableHeight"
      :style="'min-width:' + tableWidth + 'px;'"
      fixed-header
    >
      <thead style="position: sticky; top: 0; z-index: 100">
        <tr>
          <th colspan="6">
            <div class="d-flex justify-space-between">
              <div>課題</div>
              <v-badge
                :color="showAllWord ? 'red' : 'grey-lighten-2'"
                content="全表示"
                class="mr-2"
                @click="showAllWord = !showAllWord"
                inline
              ></v-badge>
            </div>
          </th>

          <th colspan="6">
            <div class="d-flex justify-space-between">
              <div>対応</div>
              <div>
                <v-badge
                  :color="showQuarter ? 'red' : 'grey-lighten-2'"
                  content="Q表示"
                  class="mr-2"
                  @click="displayQuarter"
                  inline
                ></v-badge>
              </div>
            </div>
          </th>
          <th v-if="showQuarter" colspan="5">優先課題の進捗</th>
          <th colspan="2">効果</th>
          <th></th>
          <th colspan="2">更新日</th>
        </tr>
        <tr>
          <th class="c" @click="sortDxWgByColumn('draft_business_sector')">
            事業部<sortDxWgToggle column="draft_business_sector" />
          </th>
          <th class="c" @click="sortDxWgByColumn('draft_department_name')">
            部門<sortDxWgToggle column="draft_department_name" />
          </th>
          <th class="c" @click="sortDxWgByColumn('category_name')">
            カテゴリ
            <sortDxWgToggle column="category_name" />
          </th>
          <th class="e" @click="sortDxWgByColumn('draft_content')">
            内容<sortDxWgToggle column="draft_content" />
          </th>
          <th class="a" @click="sortDxWgByColumn('registration_date')">
            登録日<sortDxWgToggle column="registration_date" />
          </th>
          <th class="a" @click="sortDxWgByColumn('id')">
            NO<sortDxWgToggle column="id" />
          </th>
          <th class="a" @click="sortDxWgByColumn('priority')">
            優先<sortDxWgToggle column="priority" />
          </th>
          <th class="b" @click="sortDxWgByColumn('state_name')">
            状況<sortDxWgToggle column="state_name" />
          </th>
          <th class="b" @click="sortDxWgByColumn('deadline')">
            期限<sortDxWgToggle column="deadline" />
          </th>
          <th class="c" @click="sortDxWgByColumn('support_department_name')">
            部門<sortDxWgToggle column="support_department_name" />
          </th>
          <th class="b" @click="sortDxWgByColumn('staff')">
            担当者<sortDxWgToggle column="staff" />
          </th>
          <th class="e" @click="sortDxWgByColumn('support_content')">
            内容<sortDxWgToggle column="support_content" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="sortDxWgByColumn('one_q_progress')"
          >
            1Q<sortDxWgToggle column="one_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="sortDxWgByColumn('two_q_progress')"
          >
            2Q<sortDxWgToggle column="two_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="sortDxWgByColumn('three_q_progress')"
          >
            3Q<sortDxWgToggle column="three_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="sortDxWgByColumn('four_q_progress')"
          >
            4Q<sortDxWgToggle column="four_q_progress" />
          </th>
          <th v-if="showQuarter" class="e" @click="sortDxWgByColumn('result')">
            結果<sortDxWgToggle column="result" />
          </th>
          <th class="b" @click="sortDxWgByColumn('effect_name')">
            効果（業務効率化に繋がったか）<sortDxWgToggle
              column="effect_name"
            />
          </th>
          <th class="b" @click="sortDxWgByColumn('effect_comment')">
            コメント<sortDxWgToggle column="effect_comment" />
          </th>
          <th class="a">いいね数</th>
          <th class="a" @click="sortDxWgByColumn('support_update_date')">
            対応
            <sortDxWgToggle column="support_update_date" />
          </th>
          <th class="a" @click="sortDxWgByColumn('effect_update_date')">
            効果
            <sortDxWgToggle column="effect_update_date" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in store.showDxWgs"
          class="tr-data"
          :class="{
            'complete-tr':
              item.state == 6 || item.state == 7 || item.state == 8,
          }"
          @click="
            store.dxWg = item;
            router.push({ path: '/dxWg', query: { id: item.id } });
            store.showDxWgDetailDialog = true;
          "
        >
          <td class="text-left">
            {{ omittedText(item.draft_business_sector, 20) }}
          </td>
          <td class="text-left">
            {{ omittedText(item.draft_department_name, 20) }}
          </td>
          <td class="text-left">
            {{ omittedText(store.convertArrayToText(item.category_name), 15) }}
          </td>
          <td class="text-left py-2">
            {{
              omittedText(
                store.stripHtml(item.draft_content),
                windowWidth * 0.025
              )
            }}
          </td>
          <td class="text-left py-2">
            {{ item.registration_date }}
          </td>
          <td class="text-left py-2">
            {{ item.id }}
          </td>
          <td class="text-left">
            <v-icon v-if="item.priority" color="red">mdi-check-decagram</v-icon>
          </td>
          <td class="text-left py-2">
            {{ item.state_name }}
          </td>
          <td class="text-left py-2">
            {{ omittedText(item.deadline, 15) }}
          </td>
          <td class="text-left py-2">
            {{
              omittedText(
                store.convertArrayToText(item.support_department_name),
                20
              )
            }}
          </td>
          <td class="text-left">
            {{ omittedText(item.staff, 10) }}
          </td>
          <td class="text-left">
            {{
              omittedText(
                store.stripHtml(item.support_content),
                windowWidth * 0.025
              )
            }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{
              omittedText(
                store.stripHtml(item.one_q_progress),
                windowWidth * 0.025
              )
            }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{
              omittedText(
                store.stripHtml(item.two_q_progress),
                windowWidth * 0.025
              )
            }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{
              omittedText(
                store.stripHtml(item.three_q_progress),
                windowWidth * 0.025
              )
            }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{
              omittedText(
                store.stripHtml(item.four_q_progress),
                windowWidth * 0.025
              )
            }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{
              omittedText(store.stripHtml(item.result), windowWidth * 0.025)
            }}
          </td>
          <td class="text-left">
            {{ item.effect_name }}
          </td>
          <td class="text-left">
            {{ omittedText(item.effect_comment, 12) }}
          </td>
          <td class="text-left">
            {{ item.likes ? item.likes.length : 0 }}
          </td>
          <td class="text-left">
            {{ item.support_update_date }}
          </td>
          <td class="text-left">
            {{ item.effect_update_date }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- 詳細画面表示 -->
  <v-dialog
    v-model="store.showDxWgDetailDialog"
    width="1100"
    :style="{ fontSize: store.calculateFontSize() + 'rem' }"
  >
    <v-card border flat>
      <v-card-text>
        <dxWgDetail />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.tr-data {
  white-space: pre-line;
}
.complete-tr {
  background-color: rgba(251, 140, 0, 0.15);
}
.complete-tr:hover {
  color: #0b8fca;
  cursor: pointer;
}
.table {
  overflow-y: scroll;
}

.a {
  width: 7rem;
}
.b {
  width: 16rem;
}
.c {
  width: 24rem;
}
.d {
  width: 36rem;
}
.e {
  width: 60rem;
}
</style>
