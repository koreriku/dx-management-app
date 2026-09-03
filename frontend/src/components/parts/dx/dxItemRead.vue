<script setup>
import { ref, computed } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import DeleteDialog from "../deleteDialog.vue";
import DOMPurify from "dompurify";

const store = useDxStore();

const sanitizedExpectedEffect = computed(() =>
  DOMPurify.sanitize(store.dxItem.expected_effect ?? "")
);
const sanitizedTechnicalDetails = computed(() =>
  DOMPurify.sanitize(store.dxItem.technical_details ?? "")
);
const sanitizedSalesStrategy = computed(() =>
  DOMPurify.sanitize(store.dxItem.sales_strategy ?? "")
);
const sanitizedNote = computed(() => DOMPurify.sanitize(store.dxItem.note ?? ""));

const toObject = (object) => {
  let unescapedFile = null;
  if (typeof object === "string") {
    if (object.includes("\\")) {
      unescapedFile = object.replace(/\\(.)/g, "$1");
      return JSON.parse(unescapedFile);
    } else {
      return JSON.parse(object);
    }
  }
  return object;
};

const baseURL = new URL(window.location.href).origin;
let fileName = ref("");
let fileIndex = ref();
</script>

<template>
  <v-card class="mb-5" border flat>
    <v-card-title>基本情報</v-card-title>
    <v-card-text>
      <div  class="d-flex flex-wrap ga-6">
        <div class="basic-info-item">
          <v-list-item
            ><v-list-item-subtitle>登録日</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.registration_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </div>
        <div class="basic-info-item">
          <v-list-item
            ><v-list-item-subtitle>更新日</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.update_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </div>
        <div class="basic-info-item">
          <v-list-item
            ><v-list-item-subtitle>部門</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.department
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </div>
        <div class="basic-info-item" v-if="store.switchDx">
          <v-list-item
            ><v-list-item-subtitle>担当者</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.staff
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </div>
        <div class="basic-info-item">
          <v-list-item
            ><v-list-item-subtitle>更新者</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.changer
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat v-if="store.switchDx">
    <v-card-title>内容</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>タイトル・業務</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.work
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>支援ツール</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.support_tool
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>内容・結果</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap"
              ><div class="ql-snow">
                <div
                  class="ql-editor"
                  v-html="sanitizedExpectedEffect"
                ></div></div
            ></v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-list-item
            ><v-list-item-subtitle>カテゴリー</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">
              <v-chip
                v-for="cat in store.dxItem.category_name"
                :key="cat"
                size="small"
                class="mr-1 mb-1"
                >{{ cat }}</v-chip
              >
            </v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" sm="4">
          <v-list-item
            ><v-list-item-subtitle>状況</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.state
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" sm="4">
          <v-list-item
            ><v-list-item-subtitle>効果</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.effect
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat v-else>
    <v-card-title>内容</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>製品・サービス名</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.product
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>技術</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.showOutsideDxTechnology(store.dxItem.technology)
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>技術詳細</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap"
              ><div class="ql-snow">
                <div
                  class="ql-editor"
                  v-html="sanitizedTechnicalDetails"
                ></div></div
            ></v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>業界</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.industry
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" sm="6">
          <v-list-item
            ><v-list-item-subtitle>顧客</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.customer
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" sm="6">
          <v-list-item
            ><v-list-item-subtitle>連携先</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxItem.cooperation_destination
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>販売戦略</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap"
              ><div class="ql-snow">
                <div
                  class="ql-editor"
                  v-html="sanitizedSalesStrategy"
                ></div></div
            ></v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>状況</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxItem.state
              }}</v-list-item-title></v-list-item
            >
            <v-divider inset></v-divider>
          </v-col>
        <v-col cols="12">
          <v-list-item
            ><v-list-item-subtitle>備考</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap"
              ><div class="ql-snow">
                <div class="ql-editor" v-html="sanitizedNote"></div></div
            ></v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat>
    <v-card-title>添付ファイル</v-card-title>
    <v-card-text>
      <div v-if="store.dxItem.attached_file.length > 0">
        <v-chip
          v-for="(file, index) in store.dxItem.attached_file"
          :key="index"
          class="mr-2 mb-2"
        >
          <v-icon start>mdi-paperclip</v-icon>
          <a
            :href="baseURL + '/public/uploads/insideDx/' + toObject(file).name"
            target="_blank"
            class="file-link"
            >{{ toObject(file).name.replace(/^(\d+)_/, "") }}</a
          >
          <template v-slot:append>
            <v-icon
              v-if="store.canDelete(toObject(file).employee_no)"
              size="small"
              class="ml-2"
              @click="
                store.showDeleteDialog = true;
                fileName = toObject(file).name;
                fileIndex = Number(index);
              "
              >mdi-close</v-icon
            >
            <v-icon
              v-else
              size="small"
              class="ml-2"
              @click="store.showDeleteAuthorityUnlockModal = true"
              >mdi-lock</v-icon
            >
          </template>
        </v-chip>
      </div>
      <div v-else class="text-medium-emphasis">添付ファイルはありません</div>
    </v-card-text>
  </v-card>

  <DeleteDialog :fileName="fileName" :id="fileIndex" />
</template>

<style scoped>
:deep(.v-list-item-subtitle) {
  opacity: 1;
  font-weight: 600;
}
:deep(.v-list-item-title) {
  margin-top: 6px;
}
.basic-info-item {
  flex: 1 1 180px;
  min-width: 0;
}
.pre-wrap {
  white-space: pre-wrap;
  line-height: 1.6rem;
  overflow: visible;
}
.file-link {
  color: inherit;
  text-decoration: underline;
}
:deep(.ql-editor) {
  height: auto;
  overflow: visible;
  padding: 0;
}
</style>
