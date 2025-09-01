<template>
  <div>
    <v-snackbar
      v-for="(item, i) of store.snackbar"
      :key="item.id"
      v-model="item.isDisplayed"
      :color="item.color"
      location="bottom"
      :timeout="item.time"
      :style="{
        whiteSpace: 'pre-line',
        bottom: `${i * 75}px`, // 👈 index に応じてずらす
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }"
    >
      {{ item.message }}

      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="item.isDisplayed = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { useDxStore } from "../stores/dxManagement.js";
const store = useDxStore();
</script>
