<template>
  <head>
    <meta charset="UTF-8" />
    <title>DX管理ソフトマニュアル</title>
  </head>
  <body>
    <div align="center">
      <h1
        style="background-color: #4169e1; color: #fff; margin-bottom: 20px"
        id="top"
      >
        マニュアル
      </h1>
    </div>

    <div class="wrapper">
      <div style="margin-bottom: 50px">
        <ul style="width: 30rem">
          <li><a href="#new">新規登録</a></li>
          <li><a href="#edit">編集</a></li>
          <li><a href="#keyword">キーワード検索と詳細検索</a></li>
          <li><a href="#sort">並び替え</a></li>
          <li><a href="#table">表の切り替え</a></li>
          <li><a href="#month">基準月について</a></li>
        </ul>
      </div>

      <div class="margin">
        <p class="text-h5" id="new">・新規登録</p>
        <v-btn color="#ffa500" icon class="icon">
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
        <p class="text-h5" id="edit">・編集</p>
        <v-btn color="#19448e" icon class="icon">
          <v-icon color="#fff">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="right"
            >編集(サンプル)</v-tooltip
          >
        </v-btn>
        <p>登録した内容を変更するには、一覧で行を選択します</p>
        <p>詳細画面が表示されるので右上のペンマークで編集が行えます</p>
        <v-btn color="#ff7f50" icon class="icon">
          <v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="right"
            >削除(サンプル)</v-tooltip
          >
        </v-btn>
        <p>ごみ箱ボタンで削除が出来ます</p>
      </div>

      <div class="margin">
        <p class="text-h5" id="keyword">・キーワード検索と詳細検索</p>
        <v-btn color="#66cdaa" icon class="icon">
          <v-icon>mdi-magnify</v-icon>
          <v-tooltip activator="parent" location="right"
            >詳細検索(サンプル)</v-tooltip
          >
        </v-btn>
        <p>
          画面左に表示されている入力欄に検索したいワードを入力し、Enterキーを押下すると項目関係なく当てはまる列が表示されます
        </p>
        <p>
          より詳細に検索したい場合は、画面右の虫眼鏡のボタンをクリックすると詳細検索が行えます
        </p>
        <p>
          検索したい列名を選択しキーワードを入力、チェックボタンをクリックすると検索が行えます
        </p>
      </div>

      <div class="margin">
        <p class="text-h5" id="sort">・並び替え</p>
        <p>項目名をクリックすると昇順・降順で並び替えが行われます</p>
        <p></p>
      </div>

      <div class="margin">
        <p class="text-h5" id="table">・表の切り替え</p>
        <v-btn class="icon">
          <v-icon>mdi-chart-bar</v-icon>
        </v-btn>
        <p>
          新規登録ボタンの下に表示されているタグをクリックすると表が切り替わります
        </p>
        <p>
          表の切り替えを行うと、新規登録と詳細検索がグラフとエクセル出力ボタンに変化します
        </p>
        <p class="text-h6">グラフボタン</p>
        <v-btn color="#00ced1" icon class="icon">
          <v-icon>mdi-chart-bar</v-icon>
          <v-tooltip activator="parent" location="right"
            >グラフ作成(サンプル)</v-tooltip
          >
        </v-btn>
        <p>横軸と縦軸を元にグラフを作成、円グラフと棒グラフが作成出来ます</p>
        <p>元の集計表に戻したい場合、右上に表ボタンで戻ることが出来ます</p>
        <p class="text-h6">エクセル生成ボタン</p>
        <v-btn color="#c0c0c0" icon class="icon">
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="right"
            >excel作成(サンプル)</v-tooltip
          >
        </v-btn>
        <p>DX一覧をExcelに出力します</p>
      </div>

      <div class="margin">
        <p class="text-h5" id="month">・基準月について</p>
        <p>ヘッダー部分に表示されている基準月の欄にて設定が行えます</p>
        <p>基準にする月を選択し、Enterを押すと変更が適応されます</p>
        <p>選択した月を基に表示する部署名等を変えます</p>
        <p>※部署名が変わっている場合、選択した月に存在した部署名になります</p>
      </div>
      <p style="height: 500px"></p>
    </div>
  </body>
</template>

<!-- 文字、写真のデザインを指定するスタイルシート -->
<style>
ul,
ol {
  border: dotted 1px; /*ドット 色 太さ*/
  padding: 0.5em 0.5em 0.5em 2em;
}

ul li,
ol li {
  line-height: 1.5;
  padding: 0.5em 0;
}
.margin {
  margin-bottom: 5rem;
  margin-left: 10px;
}
.icon {
  margin: 10px;
}
.wrapper {
  width: 1000px;
  margin: 0 auto;
  line-height: 1.8rem;
}
</style>
