<script setup>
import { useDxStore } from "../../stores/dxManagement.js";
import { defineProps } from "vue";

const store = useDxStore();

const props = defineProps({
  column: String,
});
</script>

<template>
  <span class="ml-2">
    <span
      class="mdi mdi-triangle"
      v-if="store.sortValue == props.column && store.sequence == '昇順'"
    ></span>
    <span
      class="mdi mdi-triangle-down"
      v-else-if="store.sortValue == props.column && store.sequence == '降順'"
    ></span>
  </span>
</template>
