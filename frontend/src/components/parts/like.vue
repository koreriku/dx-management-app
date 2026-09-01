<script setup>
import { ref, computed, defineProps } from "vue";
import Button from "./button.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  type: String,
});
const store = useDxStore();

const showEmployeeNumberDialog = ref(false);
const employeeNumberInput = ref("");
// true: 入力後にいいねを実行する / false: 社員番号の保存のみ行う
const toggleAfterSubmit = ref(true);

const likes = computed(() =>
  props.type == "dx" ? store.dxItem.likes || [] : store.dxWg.likes || []
);
const likedByMe = computed(() => likes.value.includes(store.employeeNumber));

const toggleLike = () => {
  if (props.type == "dx") {
    store.toggleLike();
  } else {
    store.toggleDxWgLike();
  }
};

const onClickLike = () => {
  if (!store.employeeNumber) {
    employeeNumberInput.value = "";
    toggleAfterSubmit.value = true;
    showEmployeeNumberDialog.value = true;
    return;
  }
  toggleLike();
};

const openChangeEmployeeNumber = () => {
  employeeNumberInput.value = store.employeeNumber;
  toggleAfterSubmit.value = false;
  showEmployeeNumberDialog.value = true;
};

const submitEmployeeNumber = () => {
  if (!employeeNumberInput.value.trim()) {
    return;
  }
  store.setEmployeeNumber(employeeNumberInput.value);
  showEmployeeNumberDialog.value = false;
  if (toggleAfterSubmit.value) {
    toggleLike();
  }
};
</script>

<template>
  <div class="d-flex align-center my-2">
    <Button
      icon
      :color="likedByMe ? 'primary' : 'gray'"
      @click="onClickLike"
      ><v-icon>{{
        likedByMe ? "mdi-thumb-up" : "mdi-thumb-up-outline"
      }}</v-icon>
      <v-tooltip activator="parent" location="bottom">いいね</v-tooltip>
    </Button>
    <span class="ml-2">{{ likes.length }}</span>
    <v-btn
      variant="text"
      size="small"
      density="compact"
      class="ml-2"
      @click="openChangeEmployeeNumber"
      >社員番号を変更</v-btn
    >
  </div>

  <v-dialog v-model="showEmployeeNumberDialog" width="360">
    <v-card>
      <v-card-title>社員番号を入力してください</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="employeeNumberInput"
          label="社員番号"
          variant="outlined"
          autofocus
          @keyup.enter="submitEmployeeNumber"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="primary" @click="submitEmployeeNumber">保存</Button>
        <Button color="gray" @click="showEmployeeNumberDialog = false"
          >キャンセル</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
