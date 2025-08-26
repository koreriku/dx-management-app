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
  <v-row>
    <v-col lg="8" md="9" sm="10">
      <v-card border flat>
        <v-card-item>
          <v-table>
            <tbody>
              <tr>
                <th class="text-left" width="30%">登録日</th>
                <td class="text-left">
                  {{ store.dxItem.registration_date }}
                </td>
              </tr>
              <tr>
                <th>更新日</th>
                <td class="text-left">
                  {{ store.dxItem.update_date }}
                </td>
              </tr>
              <tr>
                <th>部門</th>
                <td class="text-left">
                  {{ store.dxItem.department }}
                </td>
              </tr>
              <tr v-if="store.switchDx">
                <th>担当者</th>
                <td class="text-left">
                  {{ store.dxItem.staff }}
                </td>
              </tr>
              <tr>
                <th>更新者</th>
                <td class="text-left">
                  {{ store.dxItem.changer }}
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
      <v-card border flat>
        <v-card-item>
          <v-table>
            <tbody v-if="store.switchDx">
              <tr>
                <th width="20%">業務</th>
                <td class="text-left">
                  {{ store.dxItem.work }}
                </td>
              </tr>
              <tr>
                <th>支援ツール</th>
                <td class="text-left">
                  {{ store.dxItem.support_tool }}
                </td>
              </tr>
              <tr>
                <th>期待される効果</th>
                <td class="text-left py-3">
                  {{ store.dxItem.expected_effect }}
                </td>
              </tr>
              <tr>
                <th>効果</th>
                <td class="text-left">
                  {{ store.dxItem.effect }}
                </td>
              </tr>
              <tr>
                <th>状況</th>
                <td class="text-left">
                  {{ store.dxItem.state }}
                </td>
              </tr>
              <tr>
                <th>添付ファイル</th>
                <td class="text-left">
                  <div
                    class="mt-2"
                    v-if="store.dxItem.attached_file.length > 0"
                  >
                    <p v-for="(file, index) in store.dxItem.attached_file">
                      <a
                        :href="
                          baseURL +
                          '/public/uploads/insideDx/' +
                          toObject(file).name
                        "
                        target="_blank"
                        >{{ toObject(file).name.replace(/^(\d+)_/, "") }}</a
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

            <tbody v-else>
              <tr>
                <th width="20%">製品・サービス名</th>
                <td class="text-left">
                  {{ store.dxItem.product }}
                </td>
              </tr>
              <tr>
                <th>技術</th>
                <td class="text-left py-3">
                  {{ store.showOutsideDxTechnology(store.dxItem.technology) }}
                </td>
              </tr>
              <tr>
                <th>技術詳細</th>
                <td class="text-left">
                  {{ store.dxItem.technical_details }}
                </td>
              </tr>
              <tr>
                <th>業界</th>
                <td class="text-left">
                  {{ store.dxItem.industry }}
                </td>
              </tr>
              <tr>
                <th>顧客</th>
                <td class="text-left">
                  {{ store.dxItem.customer }}
                </td>
              </tr>
              <tr>
                <th>連携先</th>
                <td class="text-left">
                  {{ store.dxItem.cooperation_destination }}
                </td>
              </tr>
              <tr>
                <th>販売戦略</th>
                <td class="text-left">
                  {{ store.dxItem.sales_strategy }}
                </td>
              </tr>
              <tr>
                <th>状況</th>
                <td class="text-left">
                  {{ store.dxItem.state }}
                </td>
              </tr>
              <tr>
                <th>備考</th>
                <td class="text-left">
                  {{ store.dxItem.note }}
                </td>
              </tr>
              <tr>
                <th>添付ファイル</th>
                <td class="text-left">
                  <div
                    class="mt-2"
                    v-if="store.dxItem.attached_file.length > 0"
                  >
                    <p v-for="(file, index) in store.dxItem.attached_file">
                      <a
                        :href="
                          baseURL +
                          '/public/uploads/insideDx/' +
                          toObject(file).name
                        "
                        target="_blank"
                        >{{ toObject(file).name.replace(/^(\d+)_/, "") }}</a
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

  <DeleteDialog :fileName="fileName" :id="fileIndex" />
</template>

<style scoped>
tr {
  white-space: pre-line;
}
td {
  line-height: 1.8rem;
}
</style>
