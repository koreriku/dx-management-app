<script setup>
import { ref, onBeforeMount } from "vue";
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
    store.loadDepartmentsForGanttChart();
    store.showDepartmentDialog = false;
    message.value = "";
  }
};

const registerDepartment = async () => {
  if (validateCheck()) {
    await store.registerDepartment();
    store.loadDepartmentsForGanttChart();
    store.showDepartmentDialog = false;
    message.value = "";
  }
};

// 項目チェック
const validateCheck = () => {
  if (!targetNullCheck()) {
    message.value = "入力されてない項目があります";
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
</script>

<template>
  <v-dialog
    v-model="store.showDepartmentDialog"
    width="500px"
    height="400px"
    :style="{ fontSize: store.calculateFontSize() + 'rem' }"
  >
    <v-card class="card">
      <v-card-item>
        <div align="right">
          <Button
            color="gray"
            class="mr-3"
            @click="store.showDepartmentDialog = false"
            icon
            ><v-icon>mdi-arrow-u-left-bottom</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >戻る</v-tooltip
            ></Button
          >
        </div>
        <div>
          <v-table>
            <tbody>
              <tr>
                <th class="text-left">部署名</th>
                <td>
                  <v-text-field
                    type="text"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.selectedDepartment.name"
                  ></v-text-field>
                </td>
              </tr>

              <tr>
                <th class="text-left">区分</th>
                <td>
                  <v-select
                    :items="store.departmentsForInput"
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="store.selectedDepartment.parentDepartment"
                  ></v-select>
                </td>
              </tr>

              <tr>
                <th class="text-left">開始日</th>
                <td>
                  <v-text-field
                    type="date"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.selectedDepartment.from"
                  ></v-text-field>
                </td>
              </tr>

              <tr>
                <th class="text-left">期限</th>
                <td>
                  <v-text-field
                    type="date"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details
                    v-model="store.selectedDepartment.to"
                  >
                  </v-text-field>
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="message">{{ message }}</div>
        </div>

        <div align="center">
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
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.card {
  height: 500px;
}
.message {
  margin: 5px;
  text-align: center;
  color: #ff0000;
  font-size: 1rem;
}
</style>
