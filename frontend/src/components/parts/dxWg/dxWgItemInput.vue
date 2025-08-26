<script setup>
import { defineProps, onBeforeMount, ref } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import categoryRegistration from "../categoryRegistration.vue";
import Button from "../button.vue";

const store = useDxStore();

const props = defineProps({
  fileNames: String,
  isEdit: Boolean,
});
onBeforeMount(() => {
  store.departmentsForInput = [];
  store.getDepartmentsForInput();
  store.departmentsForInput = store.departmentsForInput.filter(
    (department) => department != "--"
  );
  enableSelectYear()
});

const years = ref([]);
const enableSelectYear = () => {
  years.value = store.dxWgYears.concat();
  const thisYear = new Date().getFullYear();
  const nextYear = thisYear + 1;
  if (!years.value.includes(thisYear)) {
    years.value.unshift(thisYear);
  }
  if (!years.value.includes(nextYear)) {
    years.value.unshift(nextYear);
  }
}
</script>

<template>
  <v-card class="mb-2" border flat>
    <v-card-title>課題</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="年度"
            :items="years"
            variant="outlined"
            v-model="store.editDxWg.year"
          ></v-select>
        </v-col>
        <v-col cols="10" xs="10" sm="10" md="5" lg="5" xl="5" xxl="5">
          <v-select
            label="カテゴリ"
            :items="store.dxWgCategories.map((item) => item.name)"
            variant="outlined"
            v-model="store.editDxWg.category_name"
            multiple
            chips
          ></v-select>
        </v-col>
        <v-col cols="2" xs="2" sm="2" md="1" lg="1" xl="1" xxl="1">
          <Button
            icon
            variant="outlined"
            color="grey-darken-1"
            @click="store.isCategoryRegistrationDialog = true"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >カテゴリー追加</v-tooltip
            >
          </Button>
          <categoryRegistration />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="事業部"
            variant="outlined"
            v-model="store.editDxWg.draft_business_sector"
            :disabled="props.isEdit && !store.isDxWgRegisterAuthority"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="部門"
            :items="store.departmentsForInput"
            variant="outlined"
            v-model="store.editDxWg.draft_department_name"
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
            v-model="store.editDxWg.draft_content"
            :disabled="props.isEdit && !store.isDxWgRegisterAuthority"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-checkbox
    label="優先"
    v-model="store.editDxWg.priority"
    color="red"
    :disabled="props.isEdit && !store.isDxWgRegisterAuthority"
  ></v-checkbox>

  <v-card class="mb-6" border flat>
    <v-card-title>対応</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="部門"
            :items="store.departmentsForInput"
            variant="outlined"
            v-model="store.editDxWg.support_department_name"
            multiple
            chips
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="担当"
            variant="outlined"
            v-model="store.editDxWg.staff"
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="!store.editDxWg.priority">
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="内容"
              variant="outlined"
              v-model="store.editDxWg.support_content"
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
              v-model="store.editDxWg.one_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="2Q"
              variant="outlined"
              v-model="store.editDxWg.two_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="3Q"
              variant="outlined"
              v-model="store.editDxWg.three_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="4Q"
              variant="outlined"
              v-model="store.editDxWg.four_q_progress"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="結果"
              variant="outlined"
              v-model="store.editDxWg.result"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="期限"
            variant="outlined"
            v-model="store.editDxWg.deadline"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="状況"
            :items="store.dxWgStates.map((item) => item.state)"
            variant="outlined"
            v-model="store.editDxWg.state_name"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mb-6" border flat>
    <v-card-title>効果（課題提案部署入力）</v-card-title>
    <v-card-text
      ><v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-select
            label="効果（業務効率化に繋がったか）"
            :items="store.dxWgEffects.map((item) => item.effect)"
            variant="outlined"
            v-model="store.editDxWg.effect_name"
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-text-field
            label="効果コメント"
            variant="outlined"
            v-model="store.editDxWg.effect_comment"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
