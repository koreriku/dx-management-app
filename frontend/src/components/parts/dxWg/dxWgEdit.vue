<script setup>
import Button from "../button.vue";
import dxWgItemInput from "./dxWgItemInput.vue";
import { useDxStore } from "../../../stores/dxManagement";
import { onBeforeMount } from "vue";

const store = useDxStore();
const changeDxWg = async () => {
  await store.changeDxWg();
  store.showEditDialog = false;
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
//store.editDxWg = Object.assign({}, store.dxWg);
store.editDxWg.update_date = store.date;
</script>
<template>
  <v-container :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <div class="d-flex mb-5 justify-space-between">
      <h1 class="text-h5">編集</h1>
      <div>
        <Button
          color="yellow"
          class="mr-2 mb-5"
          v-if="!store.isDxWgRegisterAuthority"
          @click="store.showDxWgRegisterUnlockModal = true"
          icon
          ><v-icon>mdi-key</v-icon>
          <v-tooltip activator="parent" location="right">ロック解除</v-tooltip>
        </Button>
        <Button
          color="gray"
          class="mr-2 mb-5"
          @click="store.showEditDialog = false"
          icon
          ><v-icon>mdi-arrow-u-left-bottom</v-icon>
          <v-tooltip activator="parent" location="right">戻る</v-tooltip>
        </Button>
      </div>
    </div>

    <dxWgItemInput :fileNames="fileNames" :isEdit="true" />
    <v-row>
      <v-col class="text-center">
        <Button color="primary" @click="changeDxWg" icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >編集完了</v-tooltip
          ></Button
        >
      </v-col>
    </v-row>
  </v-container>
</template>
