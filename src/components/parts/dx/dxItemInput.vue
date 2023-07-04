<script setup>
import { defineProps, onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();

const props = defineProps({
  fileNames: String,
});
onBeforeMount(() => {
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
                    disabled
                    v-model="store.editDxItem.registration_date"
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
                    disabled
                    v-model="store.editDxItem.update_date"
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
                    v-model="store.dxItem.department"
                  ></v-select>
                </td>
              </tr>
              <tr v-if="store.switchDx">
                <th>担当者</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.dxItem.staff"
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
                    v-model="store.dxItem.changer"
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
            <tbody v-if="store.switchDx">
              <tr>
                <th width="20%">業務</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.work"
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
                    v-model="store.dxItem.support_tool"
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
                    v-model="store.dxItem.expected_effect"
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
                    v-model="store.dxItem.effect"
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
                    v-model="store.dxItem.state"
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
                    }}」が添付されています。追加でファイルの添付が可能です。
                  </p>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <th width="20%">製品・サービス名</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.product"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>技術</th>
                <td class="text-left">
                  <v-combobox
                    v-model="store.dxItem.technology"
                    :items="
                      store.outsideDxTechnology.map((item) => item.technology)
                    "
                    variant="outlined"
                    density="compact"
                    hide-details
                    multiple
                  ></v-combobox>
                </td>
              </tr>
              <tr>
                <th>技術詳細</th>
                <td class="text-left">
                  <v-textarea
                    variant="outlined"
                    hide-details
                    class="my-2"
                    v-model="store.dxItem.technical_details"
                  ></v-textarea>
                </td>
              </tr>
              <tr>
                <th>業界</th>
                <td class="text-left">
                  <v-select
                    :items="
                      store.outsideDxIndustry.map((item) => item.industry)
                    "
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.industry"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>顧客</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.customer"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>連携先</th>
                <td class="text-left">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.cooperation_destination"
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>販売戦略</th>
                <td class="text-left">
                  <v-textarea
                    variant="outlined"
                    hide-details
                    class="my-2"
                    v-model="store.dxItem.sales_strategy"
                  ></v-textarea>
                </td>
              </tr>
              <tr>
                <th>状況</th>
                <td class="text-left">
                  <v-select
                    :items="store.outsideDxState.map((item) => item.state)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="store.dxItem.state"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>備考</th>
                <td class="text-left">
                  <v-textarea
                    variant="outlined"
                    hide-details
                    class="my-2"
                    v-model="store.dxItem.note"
                  ></v-textarea>
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
                    }}」が添付されています。追加でファイルの添付が可能です。
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
