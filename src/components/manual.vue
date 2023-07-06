<template>
  <div align="center">
    <h1
      style="background-color: #4169e1; color: #fff; margin-bottom: 20px"
      id="top"
    >
      マニュアル
    </h1>
  </div>

  <div class="wrapper">
    <v-row justify="center" width="1000">
      <v-col lg="6" md="12" xs="12" sm="12">
        <div class="list">
          <ul style="width: 30rem">
            <li><a href="#new">新規登録</a></li>
            <li><a href="#edit">編集</a></li>
            <li><a href="#keyword">キーワード検索と詳細検索</a></li>
            <li><a href="#sort">並び替え</a></li>
            <li><a href="#display">全表示について</a></li>
            <li><a href="#table">表の切り替え</a></li>
            <li><a href="#month">基準月について</a></li>

            <v-divider class="border-opacity-75"></v-divider>

            <li><a href="#department">部署一覧について</a></li>
            <li><a href="#newD">部署登録</a></li>
            <li><a href="#editD">部署変更</a></li>
            <li><a href="displayD">部署全表示</a></li>
            <li><a href="searchD">部署検索</a></li>
          </ul>
        </div>
      </v-col>

      <v-col lg="6" md="12" xs="12" sm="12">
        <div class="margin">
          <a class="text-h5 anchor" id="new">・新規登録</a>
          <v-btn color="yellow" icon class="icon">
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="right"
              >新規登録(サンプル)</v-tooltip
            >
          </v-btn>
          <p>
            新規登録を行う際には、DX一覧に表示されているプラスボタンをクリックすると登録画面が表示されます。
          </p>
          <p>各項目を入力し、チェックボタンをクリックすると登録完了です</p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="edit">・編集</a>
          <v-btn color="primary" icon class="icon">
            <v-icon color="#fff">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="right"
              >編集(サンプル)</v-tooltip
            >
          </v-btn>
          <p>登録した内容を変更するには、一覧で行を選択します</p>
          <p>詳細画面が表示されるので右上のペンマークで編集が行えます</p>
          <v-btn color="red" icon class="icon">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="right"
              >削除(サンプル)</v-tooltip
            >
          </v-btn>
          <p>ごみ箱ボタンで削除が出来ます</p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="keyword">・キーワード検索と詳細検索</a>

          <v-text-field
            label="キーワード検索"
            variant="outlined"
            density="compact"
            class="mx-2 my-2"
            append-inner-icon="mdi-magnify"
            hide-details="auto"
            style="width: 300px"
          ></v-text-field>
          <p>
            画面右に表示されている入力欄に検索したいワードを入力し、Enterキーを押下すると項目関係なく当てはまる列が表示されます
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
            検索したい列名を選択しキーワードを入力、チェックボタンをクリックすると検索が行えます
          </p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="sort">・並び替え</a>
          <p>項目名をクリックすると昇順・降順で並び替えが行われます</p>
          <p></p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="display">・全表示について</a>
          <v-badge color="red" content="全表示" class="mr-2" inline></v-badge>
          <p>デフォルトでは二行に収まるように表示されていますが</p>
          <p>期待される効果の欄に表示されている全表示をクリックすることで</p>
          <p>一覧で詳細が確認出来るようになります</p>
        </div>

        <div class="margin">
          <p class="text-h5" id="table">・表の切り替え</p>
          <v-btn class="icon" color="gray">
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
          <p>
            新規登録ボタンの下に表示されているタグをクリックすると表が切り替わります
          </p>
          <p>
            表の切り替えを行うと、新規登録と詳細検索がグラフとエクセル出力ボタンに変化します
          </p>
          <p class="text-h6">グラフボタン</p>
          <v-btn color="primary" icon class="icon">
            <v-icon>mdi-chart-bar</v-icon>
            <v-tooltip activator="parent" location="right"
              >グラフ作成(サンプル)</v-tooltip
            >
          </v-btn>
          <p>横軸と縦軸を元にグラフを作成、円グラフと棒グラフが作成出来ます</p>
          <p>元の集計表に戻したい場合、右上に表ボタンで戻ることが出来ます</p>
          <p class="text-h6">エクセル生成ボタン</p>
          <v-btn color="green" icon class="icon">
            <v-icon>mdi-microsoft-excel</v-icon>
            <v-tooltip activator="parent" location="right"
              >excel作成(サンプル)</v-tooltip
            >
          </v-btn>
          <p>DX一覧をExcelに出力します</p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="month">・基準月について</a>
          <p>ヘッダー部分に表示されている基準月の欄にて設定が行えます</p>
          <p>基準にする月を選択し、Enterを押すと変更が適応されます</p>
          <p>選択した月を基に表示する部署名等を変えます</p>
          <p>※部署名が変わっている場合、選択した月に存在した部署名になります</p>
          <v-text-field
            type="month"
            label="基準月"
            variant="outlined"
            density="compact"
            class="mx-2 mt-3"
            style="width: 200px"
          ></v-text-field>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="department">・部署一覧について</a>
          <p>管理者向けのページです</p>
          <p>過去・現在の部署を一覧で見ることが出来ます</p>
          <p>
            部署は基準月を元に表示されており、月を変えると部署の表示も変化します
          </p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="newD">・部署登録</a>
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

        <div class="margin">
          <a class="text-h5 anchor" id="editD">・部署変更</a>
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

        <div class="margin">
          <a class="text-h5 anchor" id="displayD">・部署全表示</a>
          <v-badge color="red" content="全表示" class="mr-2" inline></v-badge>
          <p>
            過去の部署を見たいときは、部署名の隣にある三角マークを押すと見ることが出来ます
          </p>
          <p>全表示ボタンを押すと過去の部署も含めて表示されるようになります</p>
        </div>

        <div class="margin">
          <a class="text-h5 anchor" id="searchD">・部署検索</a>
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
        <p style="height: 500px"></p>
      </v-col>
    </v-row>
  </div>
</template>

<!-- 文字、写真のデザインを指定するスタイルシート -->
<style>
ul {
  border: dotted 1px; /*ドット 色 太さ*/
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
.margin {
  margin-bottom: 6rem;
  margin-left: 10px;
}
.icon {
  margin: 10px;
}
.wrapper {
  width: 1000px;
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
</style>
