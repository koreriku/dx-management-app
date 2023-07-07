<script setup>
import { ref } from "vue";
import { useDxStore } from "../stores/dxManagement.js";
import dxDetail from "./parts/dx/dxDetail.vue";
import { useTheme } from "vuetify";

const store = useDxStore();
const theme = useTheme();

let showAllWord = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value) {
    return String(text).replace(/\r?\n/g, "").length > max_length
      ? String(text).replace(/\r?\n/g, "").slice(0, max_length) + "…"
      : String(text).replace(/\r?\n/g, "");
  } else {
    return text;
  }
};

const item = {
  id: null,
  registration_date: "2021/7/20",
  update_date: "2021/9/22",
  changer: "佐藤亜紀",
  department: "総務部",
  work: "名刺作成",
  support_tool: "Excel",
  state: "運用中",
  staff: "伊藤理事",
  expected_effect:
    "人事奉行からのデータ取り込みにより、所属部署、役職等、データの一括変更が行えるようになった。入力ミスが減り、工数も減る事となった。",
  effect: "中",
  attached_file: "",
  comment: [],
};

const showDxContents = ref(false);
const dxContents = [
  {
    id: "#new",
    title: "新規登録",
  },
];
const departmentsContent = [
  {
    id: "#newD",
    title: "部署登録",
  },
];
const headerContents = [
  {
    id: "#newD",
    title: "基準月",
  },
];
const open = ref(["Users"]);
</script>

<template>
  <div align="center" style="padding: 1rem; margin-bottom: 1rem">
    <h1
      :style="{ backgroundColor: theme.themes.value.light.colors.primary }"
      style="padding: 10px; color: white"
      id="top"
    >
      マニュアル
    </h1>
  </div>

  <div class="wrapper">
    <v-row justify="center">
      <v-col md="3" sm="12">
        <div class="list">
          <v-card class="mr-10">
            <v-card-title class="text-medium-emphasis">目次</v-card-title>
            <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
            <!-- <a href="#new">新規登録</a>
                <a href="#edit">編集</a>
                <a href="#keyword">キーワード検索と詳細検索</a>
                <a href="#sort">並び替え</a>
                <a href="#display">全表示について</a>
                <a href="#table">表の切り替え</a> -->

            <!-- <ul style="max-width: 450px">
              <li><a href="#month">基準月について</a></li>

              <v-divider class="border-opacity-75"></v-divider>

              <li><a href="#department">部署一覧について</a></li>
              <li><a href="#newD">部署登録</a></li>
              <li><a href="#editD">部署変更</a></li>
              <li><a href="#displayD">部署全表示</a></li>
              <li><a href="#searchD">部署検索</a></li>
            </ul> -->

            <v-list v-model:opened="open">
              <v-list-group value="dx">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-alpha-d-box"
                    title="社内DX・社外DX"
                  ></v-list-item>
                </template>

                <v-list-item v-for="item in dxContents" :key="item.id">
                  <v-list-item-title
                    ><a :href="item.id">{{ item.title }}</a></v-list-item-title
                  >
                </v-list-item>
              </v-list-group>

              <v-list-group value="department">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-office-building-cog"
                    title="部署一覧"
                  ></v-list-item>
                </template>

                <v-list-item v-for="item in departmentsContent" :key="item.id">
                  <v-list-item-title
                    ><a :href="item.id">{{ item.title }}</a></v-list-item-title
                  >
                </v-list-item>
              </v-list-group>

              <v-list-group value="header">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-format-header-pound"
                    title="ヘッダー"
                  ></v-list-item>
                </template>

                <v-list-item v-for="item in headerContents" :key="item.id">
                  <v-list-item-title
                    ><a :href="item.id">{{ item.title }}</a></v-list-item-title
                  >
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </div>
      </v-col>
      <v-col md="9" xs="12">
        <section id="insideDx">
          <h2 class="mb-10 text-h4">社内DX・社外DX</h2>

          <div class="mb-10">
            <p class="text-h5 anchor" id="new">・新規登録</p>
            <v-btn color="yellow" icon class="icon">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="right"
                >新規登録(サンプル)</v-tooltip
              >
            </v-btn>
            <p>
              DX一覧に表示されているプラスボタンをクリックすると登録画面が表示されます。
            </p>
            <p>各項目を入力し、チェックボタンをクリックすると登録完了です</p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="new">・詳細</p>
            <v-table class="icon">
              <thead>
                <tr>
                  <th class="a">部門</th>
                  <th>担当</th>
                  <th>業務</th>
                  <th>支援ツール</th>
                  <th class="e">
                    <div class="d-flex justify-space-between">
                      <span
                        @click="
                          store.sortValue = '期待される効果';
                          sort();
                        "
                        >期待される効果<sortToggle column="期待される効果"
                      /></span>
                      <v-badge
                        :color="showAllWord ? 'red' : 'grey-lighten-2'"
                        content="全表示"
                        class="mr-2"
                        @click="showAllWord = !showAllWord"
                        inline
                      ></v-badge>
                    </div>
                  </th>
                  <th>効果</th>
                  <th>状況</th>
                  <th>登録日</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="tr-data"
                  @click="
                    store.dxItem = item;
                    store.showDetailDialog = true;
                  "
                >
                  <td class="text-left">
                    {{ item.department }}
                  </td>
                  <td class="text-left">
                    {{ item.staff }}
                  </td>
                  <td class="text-left wrap">
                    {{ omittedText(item.work, 10) }}
                  </td>
                  <td class="text-left wrap">
                    {{ omittedText(item.support_tool, 10) }}
                  </td>
                  <td class="text-left wrap py-2">
                    {{ omittedText(item.expected_effect, 20) }}
                  </td>
                  <td class="text-left">
                    {{ item.effect }}
                  </td>
                  <td class="text-left">
                    {{ item.state }}
                  </td>
                  <td class="text-left">
                    {{ item.registration_date }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-dialog v-model="store.showDetailDialog" width="1100">
              <v-card bg-color="black" class="no-box-shadow transparent">
                <v-card-text>
                  <dxDetail />
                </v-card-text>
              </v-card>
            </v-dialog>

            <p>テーブルの行を選択すると、詳細画面が表示されます。</p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="sort">・並び替え</p>
            <p>
              テーブルの列名をクリックすると昇順・降順で並び替えが行われます
            </p>
            <p></p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="display">・全表示について</p>
            <v-badge
              style="cursor: pointer"
              :color="showAllWord ? 'red' : 'grey-lighten-2'"
              content="全表示"
              class="mr-2 icon"
              @click="showAllWord = !showAllWord"
              inline
            ></v-badge>
            <p>テーブルの行が大体二行に収まるように表示されていますが</p>
            <p>
              期待される効果の欄に表示されている全表示をクリックすると、全ての文字が表示されます。
            </p>
          </div>

          <div class="mb-10">
            <a class="text-h5 anchor" id="edit">・編集</a>
            <v-btn color="primary" icon class="icon">
              <v-icon color="#fff">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="right"
                >編集(サンプル)</v-tooltip
              >
            </v-btn>
            <p>詳細画面の右上のペンマークで編集が行えます</p>
          </div>
          <div class="mb-10">
            <p class="text-h5 anchor" id="delete">・削除</p>
            <v-btn color="red" icon class="icon">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="right"
                >削除(サンプル)</v-tooltip
              >
            </v-btn>
            <p>詳細画面の右上のごみ箱で削除が出来ます</p>
          </div>

          <div class="mb-10">
            <a class="text-h5 anchor" id="keyword"
              >・キーワード検索と詳細検索</a
            >

            <v-text-field
              label="キーワード検索"
              variant="outlined"
              density="compact"
              class="icon"
              append-inner-icon="mdi-magnify"
              hide-details="auto"
              style="width: 300px"
            ></v-text-field>
            <p>
              キーワード検索では、画面右上に表示されている入力欄に検索したいワードを入力し、Enterキーを押下するとワードが含まれている行が表示されます。
            </p>

            <v-btn color="primary" icon class="icon">
              <v-icon>mdi-magnify</v-icon>
              <v-tooltip activator="parent" location="right"
                >詳細検索(サンプル)</v-tooltip
              >
            </v-btn>
            <p>
              より詳細に検索したい場合は、画面右の虫眼鏡のボタンをクリックすると詳細検索が行えます
            </p>
            <p>
              検索したい列名とキーワードを入力し、チェックボタンをクリックすると検索が行えます
            </p>
          </div>

          <div class="mb-10">
            <p class="text-h5" id="table">・表の切り替え</p>
            <v-btn class="icon" color="gray">
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
            <p>
              テーブルの左上に表示されているタグをクリックすると表が切り替わります
            </p>
            <p>
              表の切り替えを行うと、新規登録と詳細検索がグラフとエクセル出力ボタンに変化します
            </p>
          </div>
          <div class="mb-10">
            <p class="text-h6">・グラフボタン</p>
            <v-btn color="primary" icon class="icon">
              <v-icon>mdi-chart-bar</v-icon>
              <v-tooltip activator="parent" location="right"
                >グラフ作成(サンプル)</v-tooltip
              >
            </v-btn>
            <p>データを元に円グラフと棒グラフが作成出来ます</p>
            <p>
              グラフを出力中は左上に表ボタンが表示され、クリックすると集計表が作成されます。
            </p>
          </div>
          <div class="mb-10">
            <p class="text-h6">・エクセル生成ボタン</p>
            <v-btn color="green" icon class="icon">
              <v-icon>mdi-microsoft-excel</v-icon>
              <v-tooltip activator="parent" location="right"
                >excel作成(サンプル)</v-tooltip
              >
            </v-btn>
            <p>DX一覧をExcelに出力します</p>
          </div>
        </section>

        <section id="header" class="mt-15">
          <h2 class="mb-10 text-h4">ヘッダー</h2>

          <div class="mb-10">
            <a class="text-h5 anchor" id="month">・基準月について</a>
            <p>
              ヘッダーに表示されている基準月の欄にて月を選択し、Enterを押すと、その月時点の部署名でレコードが表示されます。
            </p>
            <v-text-field
              type="month"
              label="基準月"
              variant="outlined"
              density="compact"
              class="mx-2 mt-3"
              style="width: 200px"
            ></v-text-field>
          </div>
        </section>

        <section id="department" class="mt-15">
          <div class="mb-10">
            <h2 class="text-h4 anchor mb-2" id="department">部署一覧</h2>
            <p>管理者向けのページです</p>
            <p>過去・現在の部署を一覧で見ることが出来ます</p>
            <p>
              部署は基準月を元に表示されており、月を変えると部署の表示も変化します
            </p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="newD">・部署登録</p>
            <v-btn color="yellow" icon class="icon">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="right"
                >新規登録(サンプル)</v-tooltip
              >
            </v-btn>
            <p>DX一覧と同様にプラスボタンで新規追加が行えます</p>
            <p>各項目を入力後登録が出来ます</p>
            <p>特に制限がなければ区分と期限はそのままをおすすめします</p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="editD">・部署変更</p>
            <p>部署名をクリックすると変更が行えます</p>
            <p class="text-subtitle-1">変更の仕方</p>
            <ol>
              <li>
                <p>部署名と開始日の変更はおすすめしません、</p>
                <p>部署名が変わった場合は新規追加を行ってください</p>
              </li>
              <li>
                <p>部署名変更を行った過去の部署は区分を現在の部署に変更し</p>
                <p>期限を変更してください</p>
              </li>
              <li>
                <p>
                  部署が他部署に吸収された場合は、部署の区分を他部署に変更して下さい
                </p>
                <p>こちらでも期限を変更してください</p>
              </li>
              <li>
                <p>部署が二つ以上に分裂する場合、登録を二回行い</p>
                <p>どちらかに過去の部署を入れてください</p>
              </li>
              <li>
                <p>部署を元の区分に戻すときはNEWを選択してください</p>
                <p>この場合、部署名は最後に移ります</p>
              </li>
            </ol>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="displayD">・部署全表示</p>
            <v-badge color="red" content="全表示" class="mr-2" inline></v-badge>
            <p>
              過去の部署を見たいときは、部署名の隣にある三角マークを押すと見ることが出来ます
            </p>
            <p>
              全表示ボタンを押すと過去の部署も含めて表示されるようになります
            </p>
          </div>

          <div class="mb-10">
            <p class="text-h5 anchor" id="searchD">・部署検索</p>
            <v-text-field
              label="部門検索"
              variant="outlined"
              density="compact"
              class="mx-2 my-3"
              append-inner-icon="mdi-magnify"
              hide-details="auto"
              style="width: 200px"
            ></v-text-field>
            <p>部署検索を使用することで部署を捜さずに表示することが出来ます</p>
          </div>
        </section>
      </v-col>
    </v-row>
  </div>
</template>

<!-- 文字、写真のデザインを指定するスタイルシート -->
<style>
a {
  list-style: none;
  opacity: 0.8;
  text-decoration: none;
}
section {
  margin-bottom: 12rem;
}
ul {
  padding: 0.5em 0.5em 0.5em 2em;
}

ul li {
  line-height: 1.5;
  padding: 0.5em 0;
}

ol {
  padding: 0.5em 0.5em 0.5em 2em;
}

ol li {
  padding: 0.5em 0;
}
.icon {
  margin: 1.2rem 0.2rem;
}
.wrapper {
  max-width: 1500px;
  margin: 0 auto;
  line-height: 1.8rem;
  padding: 1rem;
}
a.anchor {
  display: block;
  padding-top: 100px;
  margin-top: -100px;
}

.list {
  margin-bottom: 50px;
  position: sticky;
  top: 5rem;
}

@media (max-width: 960px) {
  .list {
    position: static;
  }
}
</style>
