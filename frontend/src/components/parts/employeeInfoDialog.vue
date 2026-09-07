<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import Button from "./button.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "submit"]);

const store = useDxStore();
const employeeNumberInput = ref("");
const employeeNameInput = ref("");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      employeeNumberInput.value = store.employeeNumber;
      employeeNameInput.value = store.employeeName;
    }
  }
);

const submit = () => {
  if (!employeeNumberInput.value.trim() || !employeeNameInput.value.trim()) {
    store.displaySnackbar("社員番号と社員名は必須です。", "error");
    return;
  }
  store.setEmployeeInfo(employeeNumberInput.value, employeeNameInput.value);
  emit("update:modelValue", false);
  emit("submit");
};
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="360"
  >
    <v-card>
      <v-card-title>社員情報を入力してください</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="employeeNumberInput"
          label="社員番号"
          variant="outlined"
          autofocus
          :rules="[(v) => !!v.trim() || '社員番号は必須です']"
          @keyup.enter="submit"
        ></v-text-field>
        <v-text-field
          v-model="employeeNameInput"
          label="社員名"
          variant="outlined"
          :rules="[(v) => !!v.trim() || '社員名は必須です']"
          @keyup.enter="submit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="primary" @click="submit">保存</Button>
        <Button color="gray" @click="$emit('update:modelValue', false)"
          >キャンセル</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
