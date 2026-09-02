<template>
  <v-dialog v-model="store.isDxCategoryRegistrationDialog" max-width="400px">
    <v-card>
      <v-card-title> 新しいカテゴリーを追加 </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="store.newDxCategory.name"
          label="カテゴリー名"
          @keyup.enter="
            store.postDxCategory();
            store.newDxCategory.name = '';
            store.isDxCategoryRegistrationDialog = false;
          "
          required
        ></v-text-field>

        <div class="text-center mb-1">
          <Button icon color="yellow" @click="saveCategory">
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom">登録</v-tooltip>
          </Button>
        </div>

        <v-table>
          <v-list>
            <v-list-subheader
              ><v-chip
                v-if="!isEdited"
                prepend-icon="mdi-sort"
                @click="isEdited = !isEdited"
                >並べ替え</v-chip
              ><v-chip
                v-else
                prepend-icon="mdi-pencil"
                @click="isEdited = !isEdited"
                >編集</v-chip
              ></v-list-subheader
            >
            <v-list-item
              v-if="!isEdited"
              v-for="(item, i) in store.dxCategories"
              :key="i"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
              @click="inputDepartment(item)"
            >
              <v-list-item-title
                :style="{
                  color:
                    store.selectedDxCategoryItem.name === item.name
                      ? '#2196F3'
                      : '',
                }"
                >{{ item.name }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-else
              v-for="(item, i) in store.dxCategories"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <v-list-item-title class="d-flex align-center"
                ><v-text-field
                  variant="outlined"
                  v-model="item.name"
                  density="compact"
                  single-line
                  hide-details
                  @blur="store.putDxCategory(item)"
                ></v-text-field
                ><Button
                  icon
                  variant="text"
                  color="red"
                  class="ml-1"
                  @click="confirmDeleteDxCategory(item)"
                  ><v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >削除</v-tooltip
                  ></Button
                ></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="store.isDeleteDxCategoryDialog" max-width="320px">
    <v-card>
      <v-card-text align="center"
        >「{{ store.dxCategoryToDelete.name }}」を削除しますか？</v-card-text
      >
      <v-row no-gutters>
        <v-col class="ms-14 my-3">
          <Button color="primary" @click="executeDeleteDxCategory"
            >はい</Button
          >
        </v-col>
        <v-col class="my-3">
          <Button
            color="red"
            @click="store.isDeleteDxCategoryDialog = false"
            >いいえ</Button
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useDxStore } from "../../stores/dxManagement";
import Button from "./button.vue";

const store = useDxStore();

const isSelectedCategory = ref(true);

const isEdited = ref(false);
store.selectedDxCategoryItem = {};
store.puttedDxCategoryItem = {};
const saveCategory = () => {
  store.postDxCategory();
  store.newDxCategory.name = "";
  store.isDxCategoryRegistrationDialog = false;
};

const inputDepartment = (item) => {
  if (isSelectedCategory.value) {
    store.selectedDxCategoryItem = item;
    isSelectedCategory.value = false;
  } else {
    store.puttedDxCategoryItem = item;
    isSelectedCategory.value = true;
  }
  if (
    store.selectedDxCategoryItem.id > 0 &&
    store.puttedDxCategoryItem.id > 0
  ) {
    store.sortDxCategory();
    store.selectedDxCategoryItem = {};
    store.puttedDxCategoryItem = {};
  }
};

const confirmDeleteDxCategory = (item) => {
  store.dxCategoryToDelete = item;
  store.isDeleteDxCategoryDialog = true;
};
const executeDeleteDxCategory = async () => {
  await store.deleteDxCategory(store.dxCategoryToDelete);
  store.isDeleteDxCategoryDialog = false;
};
</script>
