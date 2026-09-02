<script setup>
import { ref, defineProps, defineEmits } from "vue";
import Button from "./button.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "submit"]);

const store = useDxStore();
const employeeNumberInput = ref("");

const submit = () => {
  if (!employeeNumberInput.value.trim()) {
    return;
  }
  store.setEmployeeNumber(employeeNumberInput.value);
  employeeNumberInput.value = "";
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
      <v-card-title>社員番号を入力してください</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="employeeNumberInput"
          label="社員番号"
          variant="outlined"
          autofocus
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
