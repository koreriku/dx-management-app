<script setup>
import Button from "../button.vue";
import dxItemInput from "./dxItemInput.vue";
import { useDxStore } from "../../../stores/dxManagement";
import { onBeforeMount } from "vue";

const store = useDxStore();
const changeInsideDxList = async () => {
  store.showEditDialog = false;
  await store.changeInsideDxList();
};
let fileNames = "";
onBeforeMount(async () => {
  if (store.dxItem.attached_file.length > 0) {
    store.dxItem.attached_file.map((file) => {
      if (fileNames.length) {
        if (typeof file === "object" && file !== null) {
          fileNames = fileNames + ", " + file.name.replace(/^(\d+)_/, "");
        } else {
          fileNames =
            fileNames + ", " + JSON.parse(file).name.replace(/^(\d+)_/, "");
        }
      } else {
        if (typeof file === "object" && file !== null) {
          fileNames = file.name.replace(/^(\d+)_/, "");
        } else {
          fileNames = JSON.parse(file).name.replace(/^(\d+)_/, "");
        }
      }
    });
  }
  store.newAttachedFiles = [];
});
// 編集中の変更が閲覧中のdxItemに影響しないよう、配列プロパティも複製してeditDxItemを独立させる
store.editDxItem = {
  ...store.dxItem,
  category: [...(store.dxItem.category || [])],
  category_name: [...(store.dxItem.category_name || [])],
  technology: [...(store.dxItem.technology || [])],
  attached_file: [...(store.dxItem.attached_file || [])],
  comment: [...(store.dxItem.comment || [])],
};
store.editDxItem.update_date = store.date;
</script>
<template>
  <v-container :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <div class="d-flex mb-5 justify-space-between">
      <h1 class="text-h5">編集</h1>
      <Button
        color="gray"
        class="mr-2 mb-5"
        @click="store.showEditDialog = false"
        icon
        ><v-icon>mdi-arrow-u-left-bottom</v-icon>
        <v-tooltip activator="parent" location="right">戻る</v-tooltip>
      </Button>
    </div>

    <dxItemInput :fileNames="fileNames" />
    <v-row>
      <v-col class="text-center">
        <Button color="primary" @click="changeInsideDxList" icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >編集完了</v-tooltip
          ></Button
        >
      </v-col>
    </v-row>
  </v-container>
</template>
