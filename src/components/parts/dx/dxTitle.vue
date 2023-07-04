<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: String,
  subTitle: String,
});
</script>

<template>
  <div class="title mb-5">
    <!-- <v-icon class="mr-2">mdi-laptop</v-icon> -->
    <h1 class="text-h5 mr-3">{{ props.title }}</h1>
    <h1 class="text-subtitle-1 text-medium-emphasis">
      {{ props.subTitle }}
    </h1>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
}
</style>
