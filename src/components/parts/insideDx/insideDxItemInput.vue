<script setup>
import { defineProps, onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();

const props = defineProps({
  registration_date: Date,
  update_date: Date,
  changer: String,
  department: String,
  work: String,
  support_tool: String,
  state: String,
  staff: String,
  expected_effect: String,
  effect: String,
  attached_file: String,
  fileNames: String,
});
for (let prop in props) {
  if (prop == "fileNames") {
    continue;
  }
  if (props[prop]) {
    store.insideDxItem[prop] = props[prop];
  }
}
onBeforeMount(() => {
  // if (store.departmentsForInput.length === 0) {
  //   store.getDepartmentsForInput();
  // }
  store.departmentsForInput = [];
  store.getDepartmentsForInput();
});
</script>

<template>
  <v-row>
    <v-col lg="8" md="9" sm="10">
      <v-card>
        <v-card-item>
          <v-table>
            <tbody>
              <tr>
                <th class="text-left" width="20%">登録日</th>
                <td class="text-left">
                  <v-text-field
                    type="date"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.insideDxItem.registration_date"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>更新日</th>
                <td class="text-left">
                  <v-text-field
                    type="date"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.insideDxItem.update_date"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>部門</th>
                <td class="text-left">
                  <v-select
                    :items="store.departmentsForInput"
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="store.insideDxItem.department"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>担当者</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.insideDxItem.staff"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>更新者</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.insideDxItem.changer"
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-item>
          <v-table>
            <tbody>
              <tr>
                <th width="20%">業務</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.insideDxItem.work"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>支援ツール</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.insideDxItem.support_tool"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>期待される効果</th>
                <td class="text-left">
                  <v-textarea
                    variant="outlined"
                    hide-details
                    class="my-2"
                    v-model="store.insideDxItem.expected_effect"
                  ></v-textarea>
                </td>
              </tr>
              <tr>
                <th>効果</th>
                <td class="text-left">
                  <v-select
                    :items="store.insideDxEffect.map((item) => item.effect)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.insideDxItem.effect"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>状況</th>
                <td class="text-left">
                  <v-select
                    :items="store.insideDxState.map((item) => item.state)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.insideDxItem.state"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>添付ファイル</th>
                <td class="text-left">
                  <v-file-input
                    variant="outlined"
                    density="compact"
                    hide-details
                    multiple
                    v-model="store.newAttachedFiles"
                    :class="{ 'my-2': props.fileNames }"
                  ></v-file-input>
                  <p class="text-medium-emphasis" v-if="props.fileNames">
                    「{{
                      props.fileNames
                    }}」が添付されています。新たにファイルを添付する場合、現在添付されているファイルが削除されます。
                  </p>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
