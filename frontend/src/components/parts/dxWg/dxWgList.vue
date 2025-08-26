<script setup>
import { ref, onBeforeMount, defineProps } from "vue";
import Button from "../button.vue";
import sortDxWgToggle from "../sortDxWgToggle.vue";
import dxWgDetail from "./dxWgDetail.vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();

const props = defineProps({
  tableHeight: Number,
});

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
});

let showAllWord = ref(false);
let showQuarter = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value && text) {
    return String(text).replace(/\r?\n/g, "").length > max_length
      ? String(text).replace(/\r?\n/g, "").slice(0, max_length) + "…"
      : String(text).replace(/\r?\n/g, "");
  } else {
    return text;
  }
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
          <th colspan="2">更新日</th>
        </tr>
        <tr>
          <th
            class="c"
            @click="
              store.sortDxWgValue = 'draft_business_sector';
              store.sortDxWg();
            "
          >
            事業部<sortDxWgToggle column="draft_business_sector" />
          </th>
          <th
            class="c"
            @click="
              store.sortDxWgValue = 'draft_department_name';
              store.sortDxWg();
            "
          >
            部門<sortDxWgToggle column="draft_department_name" />
          </th>
          <th
            class="c"
            @click="
              store.sortDxWgValue = 'category_name';
              store.sortDxWg();
            "
          >
            カテゴリ
            <sortDxWgToggle column="category_name" />
          </th>
          <th
            class="e"
            @click="
              store.sortDxWgValue = 'draft_content';
              store.sortDxWg();
            "
          >
            内容<sortDxWgToggle column="draft_content" />
          </th>
          <th
            class="a"
            @click="
              store.sortDxWgValue = 'registration_date';
              store.sortDxWg();
            "
          >
            登録日<sortDxWgToggle column="registration_date" />
          </th>
          <th
            class="a"
            @click="
              store.sortDxWgValue = 'id';
              store.sortDxWg();
            "
          >
            NO<sortDxWgToggle column="id" />
          </th>
          <th
            class="a"
            @click="
              store.sortDxWgValue = 'priority';
              store.sortDxWg();
            "
          >
            優先<sortDxWgToggle column="priority" />
          </th>
          <th
            class="b"
            @click="
              store.sortDxWgValue = 'state_name';
              store.sortDxWg();
            "
          >
            状況<sortDxWgToggle column="state_name" />
          </th>
          <th
            class="b"
            @click="
              store.sortDxWgValue = 'deadline';
              store.sortDxWg();
            "
          >
            期限<sortDxWgToggle column="deadline" />
          </th>
          <th
            class="c"
            @click="
              store.sortDxWgValue = 'support_department_name';
              store.sortDxWg();
            "
          >
            部門<sortDxWgToggle column="support_department_name" />
          </th>
          <th
            class="b"
            @click="
              store.sortDxWgValue = 'staff';
              store.sortDxWg();
            "
          >
            担当者<sortDxWgToggle column="staff" />
          </th>
          <th
            class="e"
            @click="
              store.sortDxWgValue = 'support_content';
              store.sortDxWg();
            "
          >
            内容<sortDxWgToggle column="support_content" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="
              store.sortDxWgValue = 'one_q_progress';
              store.sortDxWg();
            "
          >
            1Q<sortDxWgToggle column="one_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="
              store.sortDxWgValue = 'two_q_progress';
              store.sortDxWg();
            "
          >
            2Q<sortDxWgToggle column="two_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="
              store.sortDxWgValue = 'three_q_progress';
              store.sortDxWg();
            "
          >
            3Q<sortDxWgToggle column="three_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="
              store.sortDxWgValue = 'four_q_progress';
              store.sortDxWg();
            "
          >
            4Q<sortDxWgToggle column="four_q_progress" />
          </th>
          <th
            v-if="showQuarter"
            class="e"
            @click="
              store.sortDxWgValue = 'result';
              store.sortDxWg();
            "
          >
            結果<sortDxWgToggle column="result" />
          </th>
          <th
            class="b"
            @click="
              store.sortDxWgValue = 'effect_name';
              store.sortDxWg();
            "
          >
            効果（業務効率化に繋がったか）<sortDxWgToggle
              column="effect_name"
            />
          </th>
          <th
            class="b"
            @click="
              store.sortDxWgValue = 'effect_comment';
              store.sortDxWg();
            "
          >
            コメント<sortDxWgToggle column="effect_comment" />
          </th>
          <th
            class="a"
            @click="
              store.sortDxWgValue = 'support_update_date';
              store.sortDxWg();
            "
          >
            対応
            <sortDxWgToggle column="support_update_date" />
          </th>
          <th
            class="a"
            @click="
              store.sortDxWgValue = 'effect_update_date';
              store.sortDxWg();
            "
          >
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
            {{ omittedText(item.draft_content, windowWidth * 0.025) }}
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
            {{ omittedText(item.support_content, windowWidth * 0.025) }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{ omittedText(item.one_q_progress, windowWidth * 0.025) }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{ omittedText(item.two_q_progress, windowWidth * 0.025) }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{ omittedText(item.three_q_progress, windowWidth * 0.025) }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{ omittedText(item.four_q_progress, windowWidth * 0.025) }}
          </td>
          <td v-if="showQuarter" class="text-left">
            {{ omittedText(item.result, windowWidth * 0.025) }}
          </td>
          <td class="text-left">
            {{ item.effect_name }}
          </td>
          <td class="text-left">
            {{ omittedText(item.effect_comment, 12) }}
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
