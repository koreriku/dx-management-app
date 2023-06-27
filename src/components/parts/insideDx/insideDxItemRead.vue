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
      console.log("OK");
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
  <v-row>
    <v-col lg="8" md="9" sm="10">
      <v-card>
        <v-card-item>
          <v-table>
            <tbody>
              <tr>
                <th class="text-left" width="30%">登録日</th>
                <td class="text-left">
                  {{ store.insideDxItem.registration_date }}
                </td>
              </tr>
              <tr>
                <th>更新日</th>
                <td class="text-left">
                  {{ store.insideDxItem.update_date }}
                </td>
              </tr>
              <tr>
                <th>部門</th>
                <td class="text-left">
                  {{ store.insideDxItem.department }}
                </td>
              </tr>
              <tr>
                <th>担当者</th>
                <td class="text-left">
                  {{ store.insideDxItem.staff }}
                </td>
              </tr>
              <tr>
                <th>更新者</th>
                <td class="text-left">
                  {{ store.insideDxItem.changer }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-item>
          <v-table>
            <tbody>
              <tr>
                <th width="20%">業務</th>
                <td class="text-left">
                  {{ store.insideDxItem.work }}
                </td>
              </tr>
              <tr>
                <th>支援ツール</th>
                <td class="text-left">
                  {{ store.insideDxItem.support_tool }}
                </td>
              </tr>
              <tr>
                <th>期待される効果</th>
                <td class="text-left py-3">
                  {{ store.insideDxItem.expected_effect }}
                </td>
              </tr>
              <tr>
                <th>効果</th>
                <td class="text-left">
                  {{ store.insideDxItem.effect }}
                </td>
              </tr>
              <tr>
                <th>状況</th>
                <td class="text-left">
                  {{ store.insideDxItem.state }}
                </td>
              </tr>
              <tr>
                <th>添付ファイル</th>
                <td class="text-left">
                  <div
                    class="mt-2"
                    v-if="store.insideDxItem.attached_file.length > 0"
                  >
                    <p
                      v-for="(file, index) in store.insideDxItem.attached_file"
                    >
                      <a
                        :href="
                          baseURL +
                          '/public/uploads/insideDx/' +
                          toObject(file).name
                        "
                        target="_blank"
                        >{{ toObject(file).name }}</a
                      >
                      <Button
                        variant="flat"
                        class="text-disabled"
                        @click="
                          store.showDeleteDialog = true;
                          fileName = toObject(file).name;
                          fileIndex = Number(index);
                        "
                        >削除</Button
                      >
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <DeleteDialog
    :method="store.deleteFile"
    :fileName="fileName"
    :id="fileIndex"
  />
</template>

<style scoped>
tr {
  white-space: pre-line;
}
td {
  line-height: 1.8rem;
}
</style>
