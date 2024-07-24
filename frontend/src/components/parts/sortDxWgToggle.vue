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
      v-if="store.sortDxWgValue == props.column && store.dxWgSequence == '昇順'"
    ></span>
    <span
      class="mdi mdi-triangle-down"
      v-else-if="
        store.sortDxWgValue == props.column && store.dxWgSequence == '降順'
      "
    ></span>
  </span>
</template>
