<script setup>
import { ref, defineProps } from "vue";
import Button from "./button.vue";
import { useDxStore } from "../../stores/dxManagement";

const props = defineProps({
  type: String,
});
const store = useDxStore();
const comment = ref("");

const addComment = () => {
  if (props.type == "dx") {
    store.addComment(comment.value);
  } else if (props.type == "dxWg") {
    store.addDxWgComment(comment.value);
  }
  comment.value = "";
};
</script>

<template>
  <v-row>
    <v-col lg="8" md="9" sm="10">
      <v-textarea
        label="コメント"
        variant="outlined"
        v-model="comment"
      ></v-textarea>
    </v-col>
    <v-col class="d-flex align-end mb-5" cols="2">
      <Button icon @click="addComment"
        ><v-icon>mdi-comment-plus-outline</v-icon>
        <v-tooltip activator="parent" location="end">コメント挿入</v-tooltip>
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
      <v-card>
        <v-card-text>コメント一覧</v-card-text>
        <v-card-item>
          <v-list class="wrap-text" lines="two">
            <v-list-item
              v-if="props.type == 'dx'"
              v-for="(comment, index) in store.dxItem.comment"
            >
              <div class="d-flex justify-space-between">
                <span class="pre">{{ comment }}</span>
                <Button
                  @click="store.deleteComment(index)"
                  variant="flat"
                  class="text-disabled d-inline text-right mt-auto"
                  >削除</Button
                >
              </div>
              <v-divider></v-divider>
            </v-list-item>
            <v-list-item
              v-if="props.type == 'dxWg'"
              v-for="(comment, index) in store.dxWg.comment"
            >
              <div class="d-flex justify-space-between">
                <span class="pre">{{ comment }}</span>
                <Button
                  @click="store.deleteDxWgComment(index)"
                  variant="flat"
                  class="text-disabled d-inline text-right mt-auto"
                  >削除</Button
                >
              </div>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.pre {
  white-space: pre-line;
  line-height: 1.5rem;
}
</style>
