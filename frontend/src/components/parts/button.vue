<script setup>
import { defineProps } from "vue";

const props = defineProps({
  color: String,
});
</script>

<template>
  <v-btn :color="props.color"><slot>ボタン</slot></v-btn>
</template>
