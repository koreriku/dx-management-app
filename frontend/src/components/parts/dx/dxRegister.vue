<script setup>
import { onBeforeMount, ref } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import dxTitle from "./dxTitle.vue";
import dxItemInput from "./dxItemInput.vue";
import employeeInfoDialog from "../employeeInfoDialog.vue";

const store = useDxStore();

onBeforeMount(async () => {
  if (store.isDuplicatingDx) {
    // 複製ボタンから開かれた場合は、複製済みのdxItemをリセットしない
    store.isDuplicatingDx = false;
  } else {
    await store.resetDxItem();
  }
  store.newAttachedFiles = [];
  store.editDxItem.registration_date = store.date;
  store.editDxItem.update_date = store.date;
  // 社員情報が既に登録済みなら、フォームへの入力が始まる前に更新者欄へ反映しておく
  store.applyEmployeeNameToChanger();
  // 社員番号・社員名が未入力の場合、登録ダイアログを開いたタイミングで入力を促す
  if (!store.employeeNumber || !store.employeeName) {
    isRegisterPending.value = false;
    showEmployeeInfoDialog.value = true;
  }
});

const showEmployeeInfoDialog = ref(false);
// true: 社員情報入力後に登録まで実行する / false: 更新者欄への反映のみ行う
const isRegisterPending = ref(false);

const addInsideDxList = async () => {
  if (!store.employeeNumber || !store.employeeName) {
    isRegisterPending.value = true;
    showEmployeeInfoDialog.value = true;
    return;
  }
  await registerInsideDxList();
};

const onEmployeeInfoSubmit = async () => {
  if (isRegisterPending.value) {
    isRegisterPending.value = false;
    await registerInsideDxList();
  }
};

const registerInsideDxList = async () => {
  await store.addInsideDxList();
  await store.getSortInsideDxLists();
  store.showRegisterDialog = false;
};
</script>

<template>
  <v-container :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <div class="d-flex mb-5 justify-space-between">
      <h1 class="text-h5">登録</h1>

      <Button
        color="gray"
        class="mr-2 mb-5"
        @click="store.showRegisterDialog = false"
        icon
        ><v-icon>mdi-arrow-u-left-bottom</v-icon>
        <v-tooltip activator="parent" location="right">戻る</v-tooltip></Button
      >
    </div>
    <dxItemInput />
    <v-row>
      <v-col class="text-center">
        <Button color="yellow" @click="addInsideDxList" icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >登録</v-tooltip
          ></Button
        >
      </v-col>
    </v-row>

    <employeeInfoDialog
      v-model="showEmployeeInfoDialog"
      @submit="onEmployeeInfoSubmit"
    />
  </v-container>
</template>
