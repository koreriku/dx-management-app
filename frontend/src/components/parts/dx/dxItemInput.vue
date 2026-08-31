<script setup>
import { defineProps, onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const store = useDxStore();

const richTextToolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike", { align: [] }, "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }],
  ["link", "image"],
];

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
    <v-col cols="12">
      <v-card border flat>
        <v-card-item>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <div class="text-caption text-medium-emphasis mb-1">部門</div>
              <v-select
                :items="store.departmentsForInput"
                variant="outlined"
                density="compact"
                hide-details
                v-model="store.dxItem.department"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="store.switchDx">
              <div class="text-caption text-medium-emphasis mb-1">担当者</div>
              <v-text-field
                variant="outlined"
                density="compact"
                hide-details
                v-model="store.dxItem.staff"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="text-caption text-medium-emphasis mb-1">更新者</div>
              <v-text-field
                variant="outlined"
                density="compact"
                hide-details
                v-model="store.dxItem.changer"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card border flat>
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
                <th>内容・結果</th>
                <td class="text-left rich-text-cell">
                  <QuillEditor
                    v-model:content="store.dxItem.expected_effect"
                    content-type="html"
                    theme="snow"
                    :toolbar="richTextToolbar"
                    class="mb-2"
                  />
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
                <td class="text-left rich-text-cell">
                  <QuillEditor
                    v-model:content="store.dxItem.technical_details"
                    content-type="html"
                    theme="snow"
                    :toolbar="richTextToolbar"
                    class="mb-2"
                  />
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
                <td class="text-left rich-text-cell">
                  <QuillEditor
                    v-model:content="store.dxItem.sales_strategy"
                    content-type="html"
                    theme="snow"
                    :toolbar="richTextToolbar"
                    class="mb-2"
                  />
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
                <td class="text-left rich-text-cell">
                  <QuillEditor
                    v-model:content="store.dxItem.note"
                    content-type="html"
                    theme="snow"
                    :toolbar="richTextToolbar"
                    class="mb-2"
                  />
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

<style scoped>
:deep(.rich-text-cell) {
  height: auto !important;
}
:deep(.ql-toolbar) {
  margin-top: 8px;
}
:deep(.ql-editor) {
  min-height: 150px;
}
</style>
