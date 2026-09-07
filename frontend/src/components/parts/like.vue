<script setup>
import { ref, computed, defineProps } from "vue";
import Button from "./button.vue";
import employeeInfoDialog from "./employeeInfoDialog.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  type: String,
});
const store = useDxStore();

const showEmployeeInfoDialog = ref(false);

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
  if (!store.employeeNumber || !store.employeeName) {
    showEmployeeInfoDialog.value = true;
    return;
  }
  toggleLike();
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
  </div>

  <employeeInfoDialog v-model="showEmployeeInfoDialog" @submit="toggleLike" />
</template>
