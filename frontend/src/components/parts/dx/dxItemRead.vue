<script setup>
import { ref, computed } from "vue";
import { useDxStore } from "../../../stores/dxManagement.js";
import Button from "../button.vue";
import DeleteDialog from "../deleteDialog.vue";
import DOMPurify from "dompurify";

const store = useDxStore();

const sanitizedExpectedEffect = computed(() =>
  DOMPurify.sanitize(store.dxItem.expected_effect ?? "")
);
const sanitizedTechnicalDetails = computed(() =>
  DOMPurify.sanitize(store.dxItem.technical_details ?? "")
);
const sanitizedSalesStrategy = computed(() =>
  DOMPurify.sanitize(store.dxItem.sales_strategy ?? "")
);
const sanitizedNote = computed(() => DOMPurify.sanitize(store.dxItem.note ?? ""));

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
    <v-col cols="12">
      <v-card border flat>
        <v-card-item v-if="store.switchDx">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-medium-emphasis mb-1">登録日</div>
              <div>{{ store.dxItem.registration_date }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-medium-emphasis mb-1">更新日</div>
              <div>{{ store.dxItem.update_date }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-medium-emphasis mb-1">部門</div>
              <div>{{ store.dxItem.department }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-medium-emphasis mb-1">
                カテゴリー
              </div>
              <div>
                <v-chip
                  v-for="cat in store.dxItem.category_name"
                  :key="cat"
                  size="small"
                  class="mr-1 mb-1"
                  >{{ cat }}</v-chip
                >
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <div class="text-caption text-medium-emphasis mb-1">担当者</div>
              <div>{{ store.dxItem.staff }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <div class="text-caption text-medium-emphasis mb-1">更新者</div>
              <div>{{ store.dxItem.changer }}</div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-item v-else>
          <v-row>
            <v-col cols="12" sm="6" md="2">
              <div class="text-caption text-medium-emphasis mb-1">登録日</div>
              <div>{{ store.dxItem.registration_date }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <div class="text-caption text-medium-emphasis mb-1">更新日</div>
              <div>{{ store.dxItem.update_date }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="text-caption text-medium-emphasis mb-1">部門</div>
              <div>{{ store.dxItem.department }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <div class="text-caption text-medium-emphasis mb-1">更新者</div>
              <div>{{ store.dxItem.changer }}</div>
            </v-col>
          </v-row>
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
                <th width="20%">タイトル・業務</th>
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
                <th>内容・結果</th>
                <td class="text-left py-3 rich-text-cell">
                  <div class="ql-snow">
                    <div class="ql-editor" v-html="sanitizedExpectedEffect"></div>
                  </div>
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
                        v-if="store.canDelete(toObject(file).employee_no)"
                        variant="text"
                        class="text-disabled ml-2"
                        @click="
                          store.showDeleteDialog = true;
                          fileName = toObject(file).name;
                          fileIndex = Number(index);
                        "
                        >削除</Button
                      >
                      <Button
                        v-else
                        icon
                        variant="text"
                        class="text-disabled ml-2"
                        @click="store.showDeleteAuthorityUnlockModal = true"
                        ><v-icon size="small">mdi-lock</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >削除するにはパスワードが必要です</v-tooltip
                        ></Button
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
                <td class="text-left py-3 rich-text-cell">
                  <div class="ql-snow">
                    <div class="ql-editor" v-html="sanitizedTechnicalDetails"></div>
                  </div>
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
                <td class="text-left py-3 rich-text-cell">
                  <div class="ql-snow">
                    <div class="ql-editor" v-html="sanitizedSalesStrategy"></div>
                  </div>
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
                <td class="text-left py-3 rich-text-cell">
                  <div class="ql-snow">
                    <div class="ql-editor" v-html="sanitizedNote"></div>
                  </div>
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
                        v-if="store.canDelete(toObject(file).employee_no)"
                        variant="text"
                        class="text-disabled ml-2"
                        @click="
                          store.showDeleteDialog = true;
                          fileName = toObject(file).name;
                          fileIndex = Number(index);
                        "
                        >削除</Button
                      >
                      <Button
                        v-else
                        icon
                        variant="text"
                        class="text-disabled ml-2"
                        @click="store.showDeleteAuthorityUnlockModal = true"
                        ><v-icon size="small">mdi-lock</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >削除するにはパスワードが必要です</v-tooltip
                        ></Button
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
:deep(.rich-text-cell) {
  height: auto !important;
}
:deep(.ql-editor) {
  height: auto;
  overflow: visible;
  padding: 0;
}
</style>
