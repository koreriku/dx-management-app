<template>
  <v-dialog v-model="store.isCategoryRegistrationDialog" max-width="400px">
    <v-card>
      <v-card-title> 新しいカテゴリーを追加 </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="store.newCategory.name"
          label="カテゴリー名"
          @keyup.enter="
            store.postCategory();
            store.newCategory.name = '';
            store.isCategoryRegistrationDialog = false;
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
              v-for="(item, i) in store.dxWgCategories"
              :key="i"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
              @click="inputDepartment(item)"
            >
              <v-list-item-title
                :style="{
                  color: store.selectedItem.name === item.name ? '#2196F3' : '',
                }"
                >{{ item.name }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-else
              v-for="(item, i) in store.dxWgCategories"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <v-list-item-title
                ><v-text-field
                  variant="outlined"
                  v-model="item.name"
                  density="compact"
                  single-line
                  hide-details
                  @blur="store.putCategory(item)"
                ></v-text-field
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-table>
      </v-card-text>
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
store.selectedItem = {};
store.puttedItem = {};
const saveCategory = () => {
  store.postCategory();
  store.newCategory.name = "";
  store.isCategoryRegistrationDialog = false;
};

const inputDepartment = (item) => {
  if (isSelectedCategory.value) {
    store.selectedItem = item;
    isSelectedCategory.value = false;
  } else {
    store.puttedItem = item;
    isSelectedCategory.value = true;
  }
  if (store.selectedItem.id > 0 && store.puttedItem.id > 0) {
    store.sortCategory();
    store.selectedItem = {};
    store.puttedItem = {};
  }
};
</script>
