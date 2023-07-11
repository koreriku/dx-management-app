<script setup>
import { ref, onMounted } from "vue";
import { useDxStore } from "../stores/dxManagement.js";
import dxDetail from "./parts/dx/dxDetail.vue";
import { useTheme } from "vuetify";
import Button from "./parts/button.vue";

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

const showTop = ref(false);
const scr = ref(0);

const scroll = () => {
  const top = 100;
  scr.value = window.scrollY;
  if (top <= scr.value) {
    showTop.value = true;
  } else {
    showTop.value = false;
  }
};

const jump = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// 目次項目
const showDxContents = ref(false);
const dxContents = [
  {
    id: "#new",
    title: "新規登録",
  },
  {
    id: "#detail",
    title: "詳細",
  },
  {
    id: "#sort",
    title: "並び替え",
  },
  {
    id: "#display",
    title: "全表示について",
  },
  {
    id: "#edit",
    title: "編集",
  },
  {
    id: "#delete",
    title: "削除",
  },
  {
    id: "#table",
    title: "表の切り替え",
  },
  {
    id: "#graph",
    title: "グラフ",
  },
  {
    id: "#excel",
    title: "エクセル生成",
  },
  {
    id: "#keyword",
    title: "キーワード検索と詳細検索",
  },
];
const departmentsContent = [
  {
    id: "#newD",
    title: "部署登録",
  },
  {
    id: "#editD",
    title: "部署訂正",
  },
  {
    id: "#displayD",
    title: "過去の部署表示",
  },
  {
    id: "#searchD",
    title: "部署検索",
  },
  {
    id: "#orderD",
    title: "部署順序変更",
  },
];
const headerContents = [
  {
    id: "#month",
    title: "基準月",
  },
  {
    id: "#theme",
    title: "テーマカラー",
  },
  {
    id: "#fontsize",
    title: "文字サイズ",
  },
];
const open = ref(["Users"]);

onMounted(() => {
  window.addEventListener("scroll", scroll);
});

const contentsHeight = window.innerHeight * 0.8;
store.switchDx = true;
store.changeSwitchDx();
</script>

<template>
  <button @click="jump()" class="scroll-top" v-if="showTop">
    <v-icon>mdi-chevron-double-up</v-icon>
  </button>

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
      <v-col lg="3" md="4" sm="12">
        <div class="list">
          <div
            class="mr-10 contentsBar"
            :style="{ 'max-height': contentsHeight + 'px' }"
          >
            <v-card>
              <v-card-title class="text-medium-emphasis">目次</v-card-title>
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
                      ><a
                        class="contents"
                        :href="item.id"
                        :style="{
                          color:
                            theme.global.name.value === 'light'
                              ? '#212121'
                              : '#FAFAFA',
                        }"
                        >{{ item.title }}</a
                      ></v-list-item-title
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
                      ><a
                        class="contents"
                        :href="item.id"
                        :style="{
                          color:
                            theme.global.name.value === 'light'
                              ? '#212121'
                              : '#FAFAFA',
                        }"
                        >{{ item.title }}</a
                      ></v-list-item-title
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

                  <v-list-item
                    v-for="item in departmentsContent"
                    :key="item.id"
                  >
                    <v-list-item-title
                      ><a
                        class="contents"
                        :href="item.id"
                        :style="{
                          color:
                            theme.global.name.value === 'light'
                              ? '#212121'
                              : '#FAFAFA',
                        }"
                        >{{ item.title }}</a
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-card>
          </div>
        </div>
      </v-col>
      <v-col lg="9" md="8" xs="12">
        <section id="insideDx">
          <h2
            class="mb-16 text-h4 title"
            :style="{
              'border-color':
                theme.global.name.value === 'light' ? 'black' : 'white',
            }"
          >
            <v-icon>mdi-alpha-d-box</v-icon> 社内DX・社外DX
          </h2>

          <div class="mb-16">
            <a class="text-h5 anchor" id="new">新規登録</a>
            <Button color="yellow" icon class="icon">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="right"
                >新規登録(サンプル)</v-tooltip
              >
            </Button>
            <p>
              DX一覧に表示されているプラスボタンをクリックすると登録画面が表示されます。
            </p>
            <p>各項目を入力し、チェックボタンをクリックすると登録完了です。</p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="detail">詳細</a>
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

          <div class="mb-16">
            <a class="text-h5 anchor" id="sort">並び替え</a>
            <p>
              テーブルの列名をクリックすると昇順降順で並び替えが行われます。
            </p>
            <p></p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="display">全表示について</a>
            <v-badge
              style="cursor: pointer"
              :color="showAllWord ? 'red' : 'grey-lighten-2'"
              content="全表示"
              class="mr-2 icon"
              @click="showAllWord = !showAllWord"
              inline
            ></v-badge>
            <p>テーブルの行が大体二行に収まるように表示されていますが、</p>
            <p>
              期待される効果の欄に表示されている全表示をクリックすると、全ての文字が表示されます。
            </p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="edit">編集</a>
            <Button color="primary" icon class="icon">
              <v-icon color="#fff">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="right"
                >編集(サンプル)</v-tooltip
              >
            </Button>
            <p>詳細画面の右上のペンマークで編集が行えます。</p>
          </div>
          <div class="mb-16">
            <a class="text-h5 anchor" id="delete">削除</a>
            <Button color="red" icon class="icon">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="right"
                >削除(サンプル)</v-tooltip
              >
            </Button>
            <p>詳細画面の右上のごみ箱で削除が出来ます。</p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="table">表の切り替え</a>
            <Button class="icon" color="gray">
              <v-icon>mdi-chart-bar</v-icon>
            </Button>
            <p>
              テーブルの左上に表示されているタグをクリックすると集計画面に切り替わります。
            </p>
            <p>
              集計画面に切り替えを行うと、新規登録と詳細検索がグラフとエクセル出力ボタンに変化します。
            </p>
          </div>

          <div class="mb-16" id="graph">
            <a class="text-h5 anchor">グラフ</a>

            <Button color="primary" icon class="icon">
              <v-icon>mdi-chart-bar</v-icon>
              <v-tooltip activator="parent" location="right"
                >グラフ作成(サンプル)</v-tooltip
              >
            </Button>
            <p>データを元に円グラフと棒グラフが作成出来ます。</p>
            <p>
              グラフを出力中は左上に表ボタンが表示され、クリックすると集計表が作成されます。
            </p>
          </div>

          <div class="mb-16" id="excel">
            <a class="text-h5 anchor">エクセル生成</a>
            <Button color="green" icon class="icon">
              <v-icon>mdi-microsoft-excel</v-icon>
              <v-tooltip activator="parent" location="right"
                >excel作成(サンプル)</v-tooltip
              >
            </Button>
            <p>DX一覧をExcelに出力します。</p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor mb-5" id="keyword"
              >キーワード検索と詳細検索</a
            >
            <p>検索中は、検索結果に応じた集計表やグラフを出力できます。</p>
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

            <Button color="primary" icon class="icon">
              <v-icon>mdi-magnify</v-icon>
              <v-tooltip activator="parent" location="right"
                >詳細検索(サンプル)</v-tooltip
              >
            </Button>
            <p>
              より詳細に検索したい場合は、画面右の虫眼鏡のボタンをクリックすると詳細検索が行えます。
            </p>
            <p class="mb-5">
              検索したい列名とキーワードを入力し、Enterキーを押下 or
              チェックボタンをクリックすると検索が行えます。
            </p>
            <div
              class="icon"
              @click="store.switchSearchMethod = !store.switchSearchMethod"
            >
              <v-badge
                v-if="store.switchSearchMethod"
                content="部分一致"
                floating
                color="grey-lighten-2"
                style="cursor: pointer"
              ></v-badge>
              <v-badge
                v-else
                content="完全一致"
                floating
                color="yellow"
                style="cursor: pointer"
              ></v-badge>
            </div>
            <p>
              バッジをクリックすると、部分一致と完全一致を切り替えることができます。
            </p>
            <Button color="grey" class="mr-2 icon" icon
              ><v-icon>mdi-restore</v-icon>
              <v-tooltip activator="parent" location="right"
                >リセット</v-tooltip
              ></Button
            >
            <p>
              キーワード検索 or
              詳細検索中はリセットボタンが画面左上に表示されます。
            </p>
          </div>
        </section>

        <section id="header" class="mt-15">
          <h2
            class="mb-16 text-h4 title"
            :style="{
              'border-color':
                theme.global.name.value === 'light' ? 'black' : 'white',
            }"
          >
            <v-icon>mdi-format-header-pound</v-icon> ヘッダー
          </h2>

          <div class="mb-16">
            <a class="text-h5 anchor" id="month">基準月について</a>
            <p>
              ヘッダーに表示されている基準月の欄にて月を入力し、Enterを押すと、その月時点の部署名のデータが表示されます。
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

          <div class="mb-16">
            <a class="text-h5 anchor" id="theme">テーマカラー </a>
            <p class="my-5">
              <v-icon>mdi-weather-sunny </v-icon>
              <v-icon class="mx-5">mdi-swap-horizontal</v-icon>
              <v-icon>mdi-weather-night</v-icon>
            </p>
            <p>
              ライトモードとダークモードの二種類を切り替えることが出来ます。
            </p>
            <p>
              ローカルストレージに設定が保存されるので、サイトを更新してもテーマは保持されます。
            </p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="fontsize">文字サイズ</a>
            <v-icon size="large">mdi-format-font-size-increase</v-icon>
            <v-slider
              class="mb-2"
              style="width: 500px"
              @mouseup="setFontSize"
            ></v-slider>
            <p>バーを使って文字サイズの変更が出来ます。</p>
            <p>
              ローカルストレージに設定が保存されるので、サイトを更新してもサイズは保持されます。
            </p>
          </div>
        </section>

        <section id="department" class="mt-15">
          <div class="mb-16">
            <h2
              class="mb-16 text-h4 title"
              :style="{
                'border-color':
                  theme.global.name.value === 'light' ? 'black' : 'white',
              }"
            >
              <v-icon>mdi-office-building-cog</v-icon> 部署一覧
            </h2>
            <p>管理者向けのページです。</p>
            <p>過去現在の部署を一覧で見ることが出来ます。</p>
            <p>
              部署は基準月を元に表示されており、月を変えると部署の表示も変化します。
            </p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="newD">部署登録</a>
            <Button color="yellow" icon class="icon">
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="right"
                >新規登録(サンプル)</v-tooltip
              >
            </Button>
            <p>プラスボタンで部署の新規登録、部署名変更が行えます。</p>
            <p>各項目を全て入力後、登録が出来ます。</p>
            <ol>
              <p class="text-subtitle-1">用途</p>
              <li><p>新規登録の場合は、区分を「New」にします。</p></li>
              <li><p>部署名変更の場合は、区分を対象の部署名にします。</p></li>
              <li>
                <p>部署が二つ以上に分裂する場合、新規登録を二度行います。</p>
                <p>
                  一度目は区分を分裂する部署にし、二度目は区分をNewにし登録します。
                </p>
              </li>
            </ol>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="editD">部署訂正</a>
            <p class="mb-3">部署名をクリックすると訂正が行えます</p>
            <ol>
              <p class="text-subtitle-1">用途</p>
              <li>
                <p>部署名に誤りがある場合は、部署名を訂正可能です。</p>
                <p>
                  ※部署名変更の場合は、過去の部署名を残すために新規追加を行ってください。
                </p>
              </li>
              <li>
                <p>
                  部署が吸収される場合は、吸収される部署の区分を吸収する部署の区分にし、期限を吸収日の前日に設定して下さい。
                </p>
              </li>
              <li>
                <p>部署の区分を独立させたいときはNewを選択してください。</p>
              </li>
            </ol>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="displayD">過去の部署表示</a>
            <p>
              過去の部署を見たいときは、部署名の隣にある三角マークを押すと見ることが出来ます。
            </p>
            <v-badge
              color="grey-lighten-2"
              content="全表示"
              class="mr-2 icon"
              inline
            ></v-badge>
            <p>
              全表示ボタンを押すと過去の部署も含めて表示されるようになります。
            </p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="searchD">部署検索</a>
            <v-text-field
              label="部門検索"
              variant="outlined"
              density="compact"
              class="icon"
              append-inner-icon="mdi-magnify"
              hide-details="auto"
              style="width: 200px"
            ></v-text-field>
            <p>
              部署検索を使用することで部署を捜さずに表示することが出来ます。
            </p>
          </div>

          <div class="mb-16">
            <a class="text-h5 anchor" id="orderD">部署順序変更</a>
            <Button color="primary" class="icon" icon
              ><v-icon>mdi-order-alphabetical-ascending</v-icon>
              <v-tooltip activator="parent" location="right"
                >順序変更(サンプル)</v-tooltip
              >
            </Button>
            <p>順序変更ボタンを押すと部署の順序を変更することができます。</p>
          </div>
        </section>
      </v-col>
    </v-row>
  </div>
</template>

<!-- 文字、写真のデザインを指定するスタイルシート -->
<style scoped>
.contentsBar {
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.title {
  border-bottom: solid 1px;
  border-top: solid 1px;
  padding: 1rem;
}
a.contents {
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
  position: relative; /*相対位置*/
  padding-left: 2.5rem; /*アイコン分のスペース*/
}
a.anchor:before {
  content: "";
  position: absolute; /*絶対位置*/
  left: 12px;
  bottom: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #1565c0;
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

  .scroll-top {
    width: 50px;
    height: 50px;
    border-radius: 30px;
    border: none;
    background-color: #396ddd;
    color: #fff;
    opacity: 75%;
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 2;
  }
}
</style>
