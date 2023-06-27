<script setup>
import { useDxStore } from "../../stores/dxManagement.js";
import { defineProps } from "vue";

const props = defineProps({
  height: String,
});

const store = useDxStore();
</script>

<template>
  <v-card>
    <v-card-item>
      <v-table fixed-header="true" :height="props.height">
        <thead>
          <tr>
            <th class="text-center">分類</th>
            <th
              class="text-center"
              v-for="item of [
                ...store.insideDxState.slice(1, store.insideDxState.length),
              ]"
            >
              {{ item.state }}
            </th>
            <th class="text-center font-weight-bold">集計値</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="state in store.calculationStateTotalization()">
            <td
              class="text-center"
              :class="{
                'text-medium-emphasis font-weight-bold':
                  Object.entries(state)[0][0] === '合計',
              }"
            >
              {{ Object.entries(state)[0][0] }}
            </td>
            <td
              class="text-center"
              v-for="index of store.insideDxState.length - 1"
            >
              {{ state[Object.entries(state)[0][0]][index + 1] }}
            </td>
            <td class="text-center font-weight-bold text-medium-emphasis">
              {{ state[Object.entries(state)[0][0]]["合計"] }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>
