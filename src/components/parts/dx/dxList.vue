<script setup>
import { ref, onBeforeMount, defineProps } from "vue";
import Button from "../button.vue";
import sortToggle from "../sortToggle.vue";
import dxDetail from "./dxDetail.vue";
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
  }
});

const sort = () => {
  if (store.sequence == "昇順") {
    store.sequence = "降順";
  } else {
    store.sequence = "昇順";
  }
  store.getSortInsideDxLists();
};

let showAllWord = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value) {
    return String(text).replace(/\r?\n/g, "").length > max_length
      ? String(text).replace(/\r?\n/g, "").slice(0, max_length) + "…"
      : String(text).replace(/\r?\n/g, "");
  } else {
    return text;
  }
};
</script>

<template>
  <div class="table-wrap">
    <v-table :height="props.tableHeight" class="table" fixed-header="true">
      <thead>
        <tr v-if="store.switchDx">
          <th
            class="a"
            @click="
              store.sortValue = '部門';
              sort();
            "
          >
            部門
            <sortToggle column="部門" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '担当';
              sort();
            "
          >
            担当<sortToggle column="担当" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '業務';
              sort();
            "
          >
            業務<sortToggle column="業務" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '支援ツール';
              sort();
            "
          >
            支援ツール<sortToggle column="支援ツール" />
          </th>
          <th class="e">
            <div class="d-flex justify-space-between">
              <span
                @click="
                  store.sortValue = '期待される効果';
                  sort();
                "
                >期待される効果<sortToggle column="期待される効果"
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
          <th
            class="b"
            @click="
              store.sortValue = '効果';
              sort();
            "
          >
            効果<sortToggle column="効果" />
          </th>
          <th
            class="c"
            @click="
              store.sortValue = '状況';
              sort();
            "
          >
            状況<sortToggle column="状況" />
          </th>
          <th
            class="c"
            @click="
              store.sortValue = '登録日';
              sort();
            "
          >
            登録日
            <sortToggle column="登録日" />
          </th>
        </tr>

        <tr v-else>
          <th
            class="a"
            @click="
              store.sortValue = '部門';
              sort();
            "
          >
            部門
            <sortToggle column="部門" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '業界';
              sort();
            "
          >
            業界<sortToggle column="業界" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '製品・サービス名';
              sort();
            "
          >
            製品・サービス名<sortToggle column="製品・サービス名" />
          </th>

          <th
            class="b"
            @click="
              store.sortValue = '技術';
              sort();
            "
          >
            技術<sortToggle column="技術" />
          </th>
          <th class="e">
            <div class="d-flex justify-space-between">
              <span
                @click="
                  store.sortValue = '技術詳細';
                  sort();
                "
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
          <th
            class="c"
            @click="
              store.sortValue = '状況';
              sort();
            "
          >
            状況<sortToggle column="状況" />
          </th>
          <th
            class="a"
            @click="
              store.sortValue = '顧客';
              sort();
            "
          >
            顧客<sortToggle column="顧客" />
          </th>
          <th
            class="c"
            @click="
              store.sortValue = '登録日';
              sort();
            "
          >
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
            store.showDetailDialog = true;
          "
        >
          <td class="text-left">
            {{ item.department }}
          </td>
          <td class="text-left">
            {{ item.staff }}
          </td>
          <td class="text-left wrap">
            {{ omittedText(item.work, 16) }}
          </td>
          <td class="text-left wrap">
            {{ omittedText(item.support_tool, 25) }}
          </td>
          <td class="text-left wrap py-2">
            {{ omittedText(item.expected_effect, 58) }}
          </td>
          <td class="text-left">
            {{ item.effect }}
          </td>
          <td class="text-left">
            {{ item.state }}
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
            {{ store.showOutsideDxTechnology(item.technology) }}
          </td>
          <td class="text-left wrap py-2">
            {{ omittedText(item.technical_details, 58) }}
          </td>
          <td class="text-left">
            {{ item.state }}
          </td>
          <td class="text-left">
            {{ item.customer }}
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
    <v-card class="no-box-shadow">
      <v-card-text>
        <dxDetail />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* tableの列幅固定 */
.table {
  min-width: 1450px;
}

.tr-data {
  white-space: pre-line;
}

.a {
  width: 20rem;
}
.b {
  width: 7rem;
}
.c {
  width: 12rem;
}

/*期待できる効果 */
.e {
  width: 70rem;
}
</style>
