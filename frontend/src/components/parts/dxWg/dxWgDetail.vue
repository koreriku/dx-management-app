<script setup>
import Button from "../button.vue";
import dxWgItemRead from "./dxWgItemRead.vue";
import dxWgEdit from "./dxWgEdit.vue";
import Comment from "../comment.vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import { ref, watch } from "vue";

const store = useDxStore();
const showDelete = ref(false);
const deleteDxWg = async () => {
  await store.deleteDxWg();
  showDelete.value = false;
  store.showDxWgDetailDialog = false;
};
const showDetailDialog = () => {
  store.editDxWg = Object.assign({}, store.dxWg);
  store.showEditDialog = true;
};

// const convertURLtoLink = () => {
//   let urlPattern = /https?:\/\/\S+/g;
//   let urls = store.dxItem.expected_effect.match(urlPattern);
//   console.log(store.dxItem.expected_effect);
//   console.log(urls);
//   for (let i = 0; i < urls.length; i++) {
//     let url = urls[i];
//     let link = document.createElement("a");
//     link.href = url;
//     link.textContent = url;
//     store.dxItem.expected_effect =
//       store.dxItem.expected_effect.replace(url, link.outerHTML);
//   }
// };
// convertURLtoLink();
</script>

<template>
  <v-container :style="{ fontSize: store.calculateFontSize() + 'rem' }">
    <div class="d-flex mb-5 justify-space-between">
      <div class="d-flex">
        <h1 class="text-h5 mr-3">詳細</h1>
        <v-icon v-if="store.dxWg.priority" color="red" size="x-large"
          >mdi-check-decagram</v-icon
        >
      </div>

      <div>
        <Button
          color="gray"
          class="mr-3"
          @click="store.showDxWgDetailDialog = false"
          icon
          ><v-icon>mdi-arrow-u-left-bottom</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >戻る</v-tooltip
          ></Button
        >

        <Button color="primary" class="mr-3" @click="showDetailDialog" icon
          ><v-icon>mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >編集</v-tooltip
          ></Button
        >

        <Button color="red" @click="showDelete = true" icon
          ><v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >削除</v-tooltip
          ></Button
        >
      </div>
    </div>

    <v-dialog
      v-model="showDelete"
      width="300"
      :style="{ fontSize: store.calculateFontSize() + 'rem' }"
    >
      <v-card>
        <v-card-text class="red--text" align="center"
          >本当に削除しますか？</v-card-text
        >
        <v-row no-gutters>
          <v-col class="ms-14 my-3">
            <Button color="primary" @click="deleteDxWg">Yes</Button>
          </v-col>
          <v-col class="my-3">
            <Button color="red" @click="showDelete = false">No</Button>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <dxWgItemRead />

    <!-- 編集画面表示 -->
    <v-dialog v-model="store.showEditDialog" width="1100">
      <v-card class="no-box-shadow">
        <v-card-text>
          <dxWgEdit />
        </v-card-text>
      </v-card>
    </v-dialog>

    <Comment type="dxWg" />
  </v-container>
</template>
