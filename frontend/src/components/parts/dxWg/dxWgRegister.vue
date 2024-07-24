<script setup>
import { onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import dxWgItemInput from "./dxWgItemInput.vue";

const store = useDxStore();

onBeforeMount(async () => {
  await store.resetDxItem();
  store.newAttachedFiles = [];
  store.editDxItem.registration_date = store.date;
  store.editDxItem.update_date = store.date;
});

const addDxWg = async () => {
  await store.addDxWg();
  // store.getSortInsideDxLists();
  store.showDxWgRegisterDialog = false;
};
</script>

<template>
  <v-container :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <div class="d-flex mb-5 justify-space-between">
      <h1 class="text-h5">登録</h1>

      <Button
        color="gray"
        class="mr-2 mb-5"
        @click="store.showDxWgRegisterDialog = false"
        icon
        ><v-icon>mdi-arrow-u-left-bottom</v-icon>
        <v-tooltip activator="parent" location="right">戻る</v-tooltip></Button
      >
    </div>
    <dxWgItemInput :isEdit="false" />
    <v-row>
      <v-col class="text-center">
        <Button color="yellow" @click="addDxWg" icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="right"
            >登録</v-tooltip
          ></Button
        >
      </v-col>
    </v-row>
  </v-container>
</template>
