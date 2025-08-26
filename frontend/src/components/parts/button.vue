<script setup>
import { defineProps } from "vue";

const props = defineProps({
  color: String,
});
</script>

<template>
  <v-btn :color="props.color" variant="flat" border><slot>ボタン</slot></v-btn>
</template>
