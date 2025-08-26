<script setup>
import { ref } from "vue";
import Button from "./button.vue";
import { useDxStore } from "../../stores/dxManagement.js";
import dayjs from "dayjs";

const store = useDxStore();
const now = dayjs();
const maxDate = ref(dayjs(`${now.add(1, "year").year()}-12-31`));
const bol = ref(false);
const message = ref("");

const updateDepartment = async () => {
  if (validateCheck()) {
    await store.updateDepartment();
    await store.getDepartments();
    store.loadDepartmentsForGanttChart();
    store.showDepartmentDialog = false;
    message.value = "";
  }
};

const registerDepartment = async () => {
  if (validateCheck()) {
    await store.registerDepartment();
    await store.getDepartments();
    store.loadDepartmentsForGanttChart();
    store.showDepartmentDialog = false;
    message.value = "";
  }
};

// 項目チェック
const validateCheck = () => {
  if (!targetNullCheck()) {
    message.value = "未入力項目または存在しない日付があります";
    return false;
  } else if (!nameCheck()) {
    message.value = "この名前すでに存在しています";
    return false;
  } else if (!fromCheck()) {
    message.value = "開始日は表に存在する年のみです";
    return false;
  } else if (!toCheck()) {
    message.value = "期限は9999/12/31か表に存在する年のみです";
    return false;
  } else if (!betweenCheck()) {
    message.value = "期限は開始日より後日に設定して下さい";
  } else {
    return true;
  }
};

// nullチェック
const nullCheck = (value) => {
  if (value) return true;
  return false;
};

// 項目ごとのnullチェック
const targetNullCheck = () => {
  if (!nullCheck(store.selectedDepartment.name)) {
    return false;
  } else if (!nullCheck(store.selectedDepartment.from)) {
    return false;
  } else if (!nullCheck(store.selectedDepartment.to)) {
    return false;
  } else {
    return true;
  }
};

// 開始日正当性チェック
const fromCheck = () => {
  let fromDate = dayjs(store.selectedDepartment.from);
  if (fromDate > maxDate.value || fromDate < dayjs("2021-01-01")) return false;
  return true;
};

// 期限正当性チェック
const toCheck = () => {
  let toDate = dayjs(store.selectedDepartment.to);
  if (store.selectedDepartment.to === "9999-12-31") return true;
  else if (toDate <= maxDate.value && toDate >= dayjs("2021-01-01"))
    return true;
  return false;
};

// 期限が開始日より後かのチェック
const betweenCheck = () => {
  let start = dayjs(store.selectedDepartment.from);
  let end = dayjs(store.selectedDepartment.to);
  if (start < end) return true;
  return false;
};

// 名前重複チェック
const nameCheck = () => {
  for (let department of store.departments) {
    if (store.selectedDepartment.name === department.name) {
      if (store.selectedDepartment.id === department.id) {
        continue;
      }
      return false;
    }
  }

  return true;
};
</script>

<template>
  <v-dialog
    v-model="store.showDepartmentDialog"
    width="400"
    :style="{ fontSize: store.calculateFontSize() + 'rem' }"
  >
    <v-card class="card" border flat>
      <v-row>
        <v-col>
          <v-card-text v-if="store.isEditedDepartment">部署更新</v-card-text>
          <v-card-text v-else>部署登録</v-card-text>
        </v-col>
        <v-col>
          <div class="mt-2 me-2" align="end">
            <Button
              color="gray"
              class="mr-3"
              @click="
                store.showDepartmentDialog = false;
                message = '';
              "
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
          type="text"
          variant="outlined"
          label="部署名"
          class="mt-2"
          v-model="store.selectedDepartment.name"
        ></v-text-field>

        <v-select
          label="区分"
          :items="store.departmentsForInput"
          variant="outlined"
          v-model="store.selectedDepartment.parentDepartment"
        ></v-select>

        <v-text-field
          type="date"
          variant="outlined"
          label="開始日"
          v-model="store.selectedDepartment.from"
        ></v-text-field>

        <v-text-field
          label="期限"
          type="date"
          variant="outlined"
          v-model="store.selectedDepartment.to"
        >
        </v-text-field>

        <div class="message" v-if="message">{{ message }}</div>
      </v-card-item>

      <div class="mb-4" style="align-self: center">
        <Button
          v-if="store.isEditedDepartment"
          type="submit"
          color="primary"
          @click="updateDepartment"
          icon
          style="margin: 0 auto"
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >編集完了</v-tooltip
          ></Button
        >
        <Button
          v-else
          type="submit"
          color="yellow"
          @click="registerDepartment"
          icon
          style="margin: 0 auto"
          ><v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >登録</v-tooltip
          ></Button
        >
      </div>
    </v-card>
  </v-dialog>
</template>
