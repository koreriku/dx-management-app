<script setup>
import { onBeforeMount } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";

const store = useDxStore();

onBeforeMount(() => {
  store.departmentsForInput = [];
  store.getDepartmentsForInput();
  store.departmentsForInput = store.departmentsForInput.filter(
    (department) => department != "--"
  );
});
</script>

<template>
  <v-card class="mb-2" border flat>
    <v-card-title class="ma-2">課題</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            label="カテゴリ"
            :items="store.dxWgCategories.map((item) => item.name)"
            variant="outlined"
            v-model="store.dxWgFilteringWord.category_name"
            multiple
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="事業部"
            variant="outlined"
            v-model="store.dxWgFilteringWord.draft_business_sector"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="部門"
            :items="store.departmentsForInput"
            variant="outlined"
            v-model="store.dxWgFilteringWord.draft_department_name"
            multiple
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="内容"
            variant="outlined"
            v-model="store.dxWgFilteringWord.draft_content"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-checkbox
    label="優先"
    v-model="store.dxWgFilteringWord.priority"
    color="red"
  ></v-checkbox>

  <v-card class="mb-6" border flat>
    <v-card-title class="ma-2">対応</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="部門"
            :items="store.departmentsForInput"
            variant="outlined"
            v-model="store.dxWgFilteringWord.support_department_name"
            multiple
            chips
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="担当"
            variant="outlined"
            v-model="store.dxWgFilteringWord.staff"
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="!store.dxWgFilteringWord.priority">
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="内容"
              variant="outlined"
              v-model="store.dxWgFilteringWord.support_content"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="1Q"
              variant="outlined"
              v-model="store.dxWgFilteringWord.one_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="2Q"
              variant="outlined"
              v-model="store.dxWgFilteringWord.two_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="3Q"
              variant="outlined"
              v-model="store.dxWgFilteringWord.three_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="4Q"
              variant="outlined"
              v-model="store.dxWgFilteringWord.four_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="結果"
              variant="outlined"
              v-model="store.dxWgFilteringWord.result"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="期限"
            variant="outlined"
            v-model="store.dxWgFilteringWord.deadline"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="状況"
            :items="
              [{ state: '' }, ...store.dxWgStates].map((item) => item.state)
            "
            variant="outlined"
            v-model="store.dxWgFilteringWord.state_name"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-6" border flat>
    <v-card-title class="ma-2">効果</v-card-title>
    <v-card-text
      ><v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="効果（業務効率化に繋がったか）"
            :items="
              [{ effect: '' }, ...store.dxWgEffects].map((item) => item.effect)
            "
            variant="outlined"
            v-model="store.dxWgFilteringWord.effect_name"
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="効果コメント"
            variant="outlined"
            v-model="store.dxWgFilteringWord.effect_comment"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card border flat>
    <v-card-title class="ma-2">その他</v-card-title>
    <v-card-item>
      <v-row>
        <v-col cols="12">
          <v-text-field
            class="mt-2"
            label="NO"
            variant="outlined"
            type="number"
            v-model="store.dxWgFilteringWord.id"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="開始日（登録日）"
            variant="outlined"
            type="date"
            clearable
            v-model="store.startDate"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="終了日（登録日）"
            variant="outlined"
            type="date"
            clearable
            v-model="store.endDate"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
