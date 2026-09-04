<script setup>
import { defineProps, onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import dxCategoryRegistration from "../dxCategoryRegistration.vue";
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
  <v-card class="mb-6" border flat>
    <v-card-title>基本情報</v-card-title>
    <v-card-text>
      <template v-if="store.switchDx">
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              label="部門"
              :items="store.departmentsForInput"
              variant="outlined"
              v-model="store.editDxItem.department"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="更新者"
              variant="outlined"
              v-model="store.editDxItem.changer"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              label="部門"
              :items="store.departmentsForInput"
              variant="outlined"
              v-model="store.editDxItem.department"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="更新者"
              variant="outlined"
              v-model="store.editDxItem.changer"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>

  <v-card class="mb-6" border flat v-if="store.switchDx">
    <v-card-title>内容</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="タイトル・業務"
            variant="outlined"
            v-model="store.editDxItem.work"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="支援ツール"
            variant="outlined"
            v-model="store.editDxItem.support_tool"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis mb-1">内容・結果</div>
          <QuillEditor
            v-model:content="store.editDxItem.expected_effect"
            content-type="html"
            theme="snow"
            :toolbar="richTextToolbar"
            class="mb-2"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
            label="状況"
            :items="store.insideDxState.map((item) => item.state)"
            variant="outlined"
            v-model="store.editDxItem.state"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            label="効果"
            :items="store.insideDxEffect.map((item) => item.effect)"
            variant="outlined"
            v-model="store.editDxItem.effect"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="d-flex align-center">
            <v-select
              label="カテゴリー"
              :items="store.dxCategories.map((item) => item.name)"
              variant="outlined"
              v-model="store.editDxItem.category_name"
              multiple
              chips
              class="flex-grow-1"
              density="compact"
            hide-details
            ></v-select>
            <Button
              icon
              variant="outlined"
              color="grey-darken-1"
              class="ml-2"
              size="small"
              @click="store.judgeShowDxCategoryRegistrationDialog()"
            >
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >カテゴリー追加</v-tooltip
              >
            </Button>
            <dxCategoryRegistration />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-6" border flat v-else>
    <v-card-title>内容</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="製品・サービス名"
            variant="outlined"
            v-model="store.editDxItem.product"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-combobox
            label="技術"
            v-model="store.editDxItem.technology"
            :items="store.outsideDxTechnology.map((item) => item.technology)"
            variant="outlined"
            multiple
            density="compact"
            hide-details
          ></v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis mb-1">技術詳細</div>
          <QuillEditor
            v-model:content="store.editDxItem.technical_details"
            content-type="html"
            theme="snow"
            :toolbar="richTextToolbar"
            class="mb-2"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-select
            label="業界"
            :items="store.outsideDxIndustry.map((item) => item.industry)"
            variant="outlined"
            v-model="store.editDxItem.industry"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="顧客"
            variant="outlined"
            v-model="store.editDxItem.customer"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="連携先"
            variant="outlined"
            v-model="store.editDxItem.cooperation_destination"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis mb-1">販売戦略</div>
          <QuillEditor
            v-model:content="store.editDxItem.sales_strategy"
            content-type="html"
            theme="snow"
            :toolbar="richTextToolbar"
            class="mb-2"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-select
            label="状況"
            :items="store.outsideDxState.map((item) => item.state)"
            variant="outlined"
            v-model="store.editDxItem.state"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis mb-1">備考</div>
          <QuillEditor
            v-model:content="store.editDxItem.note"
            content-type="html"
            theme="snow"
            :toolbar="richTextToolbar"
            class="mb-2"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-6" border flat>
    <v-card-title>添付ファイル</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-file-input
            label="添付ファイル"
            variant="outlined"
            multiple
            v-model="store.newAttachedFiles"
            density="compact"
            hide-details
          ></v-file-input>
          <p class="text-medium-emphasis" v-if="props.fileNames">
            「{{
              props.fileNames
            }}」が添付されています。追加でファイルの添付が可能です。
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="store.showDxCategoryUnlockModal"
    width="400"
    :style="{ fontSize: store.calculateFontSize() * 0.95 + 'rem' }"
    style="line-height: 2rem"
  >
    <v-card class="card">
      <v-row>
        <v-col>
          <v-card-text class="text-medium-emphasis"
            >カテゴリー追加・編集権限解除</v-card-text
          >
        </v-col>
        <v-col>
          <div class="mt-2 me-2" align="end">
            <Button
              color="gray"
              class="mr-3"
              @click="store.showDxCategoryUnlockModal = false"
              icon
              ><v-icon>mdi-arrow-u-left-bottom</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >戻る</v-tooltip
              ></Button
            >
          </div>
        </v-col>
      </v-row>
      <v-card-item>
        <v-text-field
          type="password"
          variant="outlined"
          label="パスワード"
          class="mt-2"
          @keyup.enter="store.unlockDxCategoryRegisterAuthority"
          v-model="store.password"
        ></v-text-field>
      </v-card-item>
      <div v-if="store.message" class="message">{{ store.message }}</div>
      <div class="mb-4" style="align-self: center">
        <Button
          type="submit"
          color="yellow"
          @click="store.unlockDxCategoryRegisterAuthority"
          icon
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom">OK</v-tooltip></Button
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.ql-toolbar) {
  margin-top: 8px;
}
:deep(.ql-container) {
  height: auto !important;
}
:deep(.ql-editor) {
  min-height: 150px;
}
</style>
