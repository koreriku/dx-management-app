<script setup>
import { ref } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import DeleteDialog from "../deleteDialog.vue";

const store = useDxStore();

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
    <v-card-title>課題</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-list-item prepend-icon="mdi-alpha-y"
            ><v-list-item-subtitle>年度</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.year
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="6">
          <v-list-item prepend-icon="mdi-shape-plus-outline"
            ><v-list-item-subtitle>カテゴリ</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.convertArrayToText(store.dxWg.category_name)
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-home-outline"
            ><v-list-item-subtitle>事業部</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.draft_business_sector
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-account-group-outline"
            ><v-list-item-subtitle>部門</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.convertArrayToText(store.dxWg.draft_department_name)
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list-item prepend-icon="mdi-text-box-outline"
            ><v-list-item-subtitle>内容</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.draft_content
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat>
    <v-card-title>対応</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-account-group-outline"
            ><v-list-item-subtitle>部門</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.convertArrayToText(store.dxWg.support_department_name)
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-account-outline"
            ><v-list-item-subtitle>担当者</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.staff
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <div v-if="!store.dxWg.priority">
        <v-row>
          <v-col cols="12">
            <v-list-item prepend-icon="mdi-text-box-outline"
              ><v-list-item-subtitle>内容</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.support_content
              }}</v-list-item-title></v-list-item
            >
            <v-divider inset></v-divider>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>1Q</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.one_q_progress
              }}</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>2Q</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.two_q_progress
              }}</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>3Q</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.three_q_progress
              }}</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>4Q</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.four_q_progress
              }}</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list-item
              ><v-list-item-subtitle>結果</v-list-item-subtitle>
              <v-list-item-title class="pre-wrap">{{
                store.dxWg.result
              }}</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-clock-time-eleven-outline"
            ><v-list-item-subtitle>期限</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.deadline
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-head-snowflake-outline"
            ><v-list-item-subtitle>状況</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.state_name
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat>
    <v-card-title>効果</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon=" mdi-creation-outline"
            ><v-list-item-subtitle
              >効果（業務効率化に繋がったか）</v-list-item-subtitle
            >
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.effect_name
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-comment-outline"
            ><v-list-item-subtitle>効果コメント</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.effect_comment
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-5" border flat>
    <v-card-title>その他</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-list-item prepend-icon="mdi-numeric"
            ><v-list-item-subtitle>NO</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.id
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-calendar-range"
            ><v-list-item-subtitle>登録日</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.registration_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-update"
            ><v-list-item-subtitle>更新日</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.update_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-update"
            ><v-list-item-subtitle>更新日（対応）</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.support_update_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-list-item prepend-icon="mdi-update"
            ><v-list-item-subtitle>更新日（効果）</v-list-item-subtitle>
            <v-list-item-title class="pre-wrap">{{
              store.dxWg.effect_update_date
            }}</v-list-item-title></v-list-item
          >
          <v-divider inset></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <DeleteDialog :fileName="fileName" :id="fileIndex" />
</template>

<style scoped>
tr {
  white-space: pre-line;
}
td {
  line-height: 1.8rem;
}
.pre-wrap {
  white-space: pre-wrap;
  line-height: 1.6rem;
}
</style>
