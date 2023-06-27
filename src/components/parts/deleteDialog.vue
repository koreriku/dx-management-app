<script setup>
import { useDxStore } from "../../stores/dxManagement.js";
import { defineProps } from "vue";
import Button from "./button.vue";

const store = useDxStore();

const props = defineProps({
  fileName: String,
  id: Number,
  method: Function,
});
</script>

<template>
  <v-dialog
    v-model="store.showDeleteDialog"
    width="300"
    :style="{ fontSize: store.calculateFontSize() + 'rem' }"
  >
    <v-card>
      <v-card-text v-if="props.fileName" align="center"
        >{{ props.fileName }}を削除しますか？</v-card-text
      >
      <v-card-text align="center" v-else>本当に削除しますか？</v-card-text>

      <v-row no-gutters>
        <v-col class="ms-14 my-3">
          <Button
            color="primary"
            v-if="props.id >= 0"
            @click="
              props.method(props.id);
              store.showDeleteDialog = false;
            "
            >Yes</Button
          >
          <Button
            color="primary"
            v-else
            @click="
              props.method;
              store.showDeleteDialog = false;
            "
            >Yes</Button
          >
        </v-col>

        <v-col class="my-3">
          <Button color="red" @click="store.showDeleteDialog = false"
            >No</Button
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
