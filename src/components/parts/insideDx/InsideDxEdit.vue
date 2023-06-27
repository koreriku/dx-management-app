<script setup>
import Button from "../button.vue";
import InsideDxItemInput from "./insideDxItemInput.vue";
import { useDxStore } from "../../../stores/dxManagement";
import { onBeforeMount } from "vue";

const store = useDxStore();
const changeInsideDxList = async () => {
  store.showEditDialog = false;
  await store.changeInsideDxList();
};
let fileNames = "";
onBeforeMount(async () => {
  if (store.insideDxItem.attached_file.length > 0) {
    store.insideDxItem.attached_file.map((file) => {
      if (fileNames.length) {
        fileNames = fileNames + ", " + JSON.parse(file).name;
      } else {
        fileNames = JSON.parse(file).name;
      }
    });
  }
  store.newAttachedFiles = [];
});
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

    <InsideDxItemInput
      :registration_date="store.insideDxItem.registration_date"
      :update_date="store.date"
      :department="store.insideDxItem.department"
      :changer="store.insideDxItem.changer"
      :work="store.insideDxItem.work"
      :support_tool="store.insideDxItem.support_tool"
      :state="store.insideDxItem.state"
      :staff="store.insideDxItem.staff"
      :expected_effect="store.insideDxItem.expected_effect"
      :effect="store.insideDxItem.effect"
      :fileNames="fileNames"
    />
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
