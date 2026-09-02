<script setup>
import { ref, defineProps } from "vue";
import Button from "./button.vue";
import employeeNumberDialog from "./employeeNumberDialog.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  type: String,
});
const store = useDxStore();
const comment = ref("");
const showEmployeeNumberDialog = ref(false);

const submitComment = () => {
  if (props.type == "dx") {
    store.addComment(comment.value);
  } else if (props.type == "dxWg") {
    store.addDxWgComment(comment.value);
  }
  comment.value = "";
};

const addComment = () => {
  if (!store.employeeNumber) {
    showEmployeeNumberDialog.value = true;
    return;
  }
  submitComment();
};
</script>

<template>
  <v-row>
    <v-col lg="8" md="9" sm="10">
      <v-textarea variant="outlined" v-model="comment"
        ><template v-slot:label>
          <span v-if="props.type == 'dx'">コメント</span
          ><span v-else>リセット理由</span>
        </template></v-textarea
      >
    </v-col>
    <v-col class="d-flex align-end mb-5" cols="2">
      <Button icon @click="addComment"
        ><v-icon>mdi-comment-plus-outline</v-icon>
        <v-tooltip activator="parent" location="end"
          ><span v-if="props.type == 'dx'">コメント</span
          ><span v-else>リセット理由</span>挿入</v-tooltip
        >
      </Button>
    </v-col>
  </v-row>
  <v-row
    v-if="
      (props.type == 'dx' && store.dxItem.comment.length > 0) ||
      (props.type == 'dxWg' && store.dxWg.comment.length > 0)
    "
  >
    <v-col>
      <v-card border flat>
        <v-card-text v-if="props.type == 'dx'">コメント一覧</v-card-text>
        <v-card-text v-else>リセット理由</v-card-text>
        <v-card-item>
          <v-list class="wrap-text" lines="two">
            <v-list-item
              v-if="props.type == 'dx'"
              v-for="(comment, index) in store.dxItem.comment"
            >
              <div class="d-flex justify-space-between">
                <span class="pre">{{ store.parseComment(comment).text }}</span>
                <Button
                  v-if="store.canDelete(store.parseComment(comment).employee_no)"
                  @click="store.deleteComment(index)"
                  variant="text"
                  class="text-disabled d-inline text-right mt-auto"
                  >削除</Button
                >
                <Button
                  v-else
                  icon
                  variant="text"
                  class="text-disabled d-inline text-right mt-auto"
                  @click="store.showDeleteAuthorityUnlockModal = true"
                  ><v-icon size="small">mdi-lock</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >削除するにはパスワードが必要です</v-tooltip
                  ></Button
                >
              </div>
              <v-divider></v-divider>
            </v-list-item>
            <v-list-item
              v-if="props.type == 'dxWg'"
              v-for="(comment, index) in store.dxWg.comment"
            >
              <div class="d-flex justify-space-between">
                <span class="pre">{{ store.parseComment(comment).text }}</span>
                <Button
                  v-if="store.canDelete(store.parseComment(comment).employee_no)"
                  @click="store.deleteDxWgComment(index)"
                  variant="text"
                  class="text-disabled d-inline text-right mt-auto"
                  >削除</Button
                >
                <Button
                  v-else
                  icon
                  variant="text"
                  class="text-disabled d-inline text-right mt-auto"
                  @click="store.showDeleteAuthorityUnlockModal = true"
                  ><v-icon size="small">mdi-lock</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >削除するにはパスワードが必要です</v-tooltip
                  ></Button
                >
              </div>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <employeeNumberDialog
    v-model="showEmployeeNumberDialog"
    @submit="submitComment"
  />
</template>

<style scoped>
.pre {
  white-space: pre-line;
  line-height: 1.5rem;
}
</style>
