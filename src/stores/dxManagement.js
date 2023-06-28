import { ref } from "vue";
import { defineStore } from "pinia";
import chartjsPluginColorschemes from "chartjs-plugin-colorschemes";
import axios from "axios";
import ExcelJS from "exceljs";
import { useTheme } from "vuetify";

axios.create({
  baseURL: "http://172.16.16.134:8000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

export const useDxStore = defineStore("dxManagement", () => {
  // 現在の日付を取得
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;
  // 基準月を格納
  const referenceMonth = ref(`${year}-${month}`);
  // 基準日を格納
  const referenceDate = ref(null);
  // 基準月の最終日を取得
  const getLastDayOfMonth = () => {
    let yearAndMonth = referenceMonth.value.split("-");
    referenceDate.value = new Date(
      Number(yearAndMonth[0]),
      Number(yearAndMonth[1])
    );
    referenceDate.value.setDate(referenceDate.value.getDate() - 1);
    let year = referenceDate.value.getFullYear();
    let month = String(referenceDate.value.getMonth() + 1).padStart(2, "0");
    let day = String(referenceDate.value.getDate()).padStart(2, "0");
    referenceDate.value = `${year}-${month}-${day}`;
  };
  getLastDayOfMonth();

  // trueの時に社内DX表示、falseの時に社外DX表示
  const switchDx = ref(true);

  // appBarで選択されたフォントサイズを格納
  const fontSizeNum = ref(40);
  if (localStorage.getItem("fontSizeNum")) {
    fontSizeNum.value = localStorage.getItem("fontSizeNum");
  }
  // 0~100の値が入るfontSizeNumをremに変換
  const calculateFontSize = () => {
    return 0.8 + fontSizeNum.value / 300;
  };

  // ダイアログ表示有無の設定 -----------------------------------------
  // Dx詳細画面
  const showDetailDialog = ref(false);
  // Dx編集画面
  const showEditDialog = ref(false);
  // Dx登録画面
  const showRegisterDialog = ref(false);
  // Dx削除画面
  const showDeleteDialog = ref(false);
  // 部署の登録・編集画面
  const showDepartmentDialog = ref(false);

  // バックエンドのURL -----------------------------------------
  // 社内DX
  const insideDxBASE_URL = "http://172.16.16.134:8000/insideDx";
  // 部署
  const departmentsBASE_URL = "http://172.16.16.134:8000/departments";

  // Dx系の変数 -----------------------------------------
  // 単一の社内DXを格納
  const insideDxItem = ref({
    id: null,
    registration_date: null,
    update_date: null,
    changer: null,
    department: null,
    work: null,
    support_tool: null,
    state: null,
    staff: null,
    expected_effect: null,
    effect: null,
    attached_file: [],
    comment: [],
  });
  // レコード更新時に部署名と状況と効果は値が数字に切り替わるため、数字の切り替えを画面に描写
  // しないようにレコード更新前に別の変数に格納する
  const editInsideDxItem = ref({});
  // 画面に表示させるDxを格納
  const showInsideDxLists = ref([]);
  // 全てのDxを格納
  const insideDxLists = ref([]);
  // 全ての効果を格納
  const insideDxEffect = ref([]);
  // 全ての状況を格納
  const insideDxState = ref([]);

  // 部門系の変数 ---------------------------------------
  // 全ての部門を格納
  const departments = ref([]);
  // ガントチャートの表示設定を加えた部門を格納
  const departmentsForGanttChart = ref([]);
  // 表示させる部門の数をカウント。行の幅を計算するため
  const isShowedDepartmentLength = ref(0);

  // 編集・登録時に入力可能な部門一覧格納
  const departmentsForInput = ref([]);
  // 選択された部門を1つ格納
  const selectedDepartment = ref({});
  // 部門の登録と編集のダイアログが共通のため、登録か編集かを判断する変数
  // trueの時、編集、falseの時、登録
  const isEditedDepartment = ref(null);
  // 部門を全表示するか有無
  const isShowedAllDepartment = ref(false);

  // 部門系の関数 ----------------------------------------------------
  // 部門一覧を全て取得
  const getDepartments = async () => {
    await axios.get(departmentsBASE_URL).then((res) => {
      departments.value = res.data;
    });
  };
  // 登録と編集時に入力可能な部門一覧取得
  const getDepartmentsForInput = () => {
    for (let department of departments.value) {
      if (new Date(department.to) >= new Date(referenceDate.value)) {
        departmentsForInput.value.push(department.name);
      }
    }
  };
  // 部門名から区分コードを取得し、変数に格納
  const getDepartmentDivisionFromDepartmentName = () => {
    for (let department of departments.value) {
      if (selectedDepartment.value.parentDepartment === department.name) {
        selectedDepartment.value.division = department.division;
        break;
      }
    }
  };

  // 部署一覧のデータ準備
  // DBから取得した部門にガントチャートの表示設定を追加し、配列にpush
  const pushDepartments = (
    data,
    isShowed,
    isLatestDepartment,
    parentDepartment
  ) => {
    departmentsForGanttChart.value.push({
      id: data.id,
      name: data.name,
      division: data.division,
      from: data.from,
      to: data.to,
      isShowed: isShowed,
      isOpened: false,
      isLatestDepartment: isLatestDepartment,
      count: 1,
      parentDepartment: parentDepartment,
      cat: "department",
    });
  };
  // DBから取得した部門にガントチャートの表示設定を追加
  const loadDepartmentsForGanttChart = async () => {
    await getDepartments();
    departmentsForGanttChart.value = [];
    departmentsForInput.value = [];
    isShowedDepartmentLength.value = 0;
    isShowedAllDepartment.value = false;
    for (let data of departments.value.concat()) {
      let isLatestDepartment = true;
      let isShowedDepartment = false;
      let parentDepartment = null;
      parentDepartment = data.name;
      if (new Date(data.to) >= new Date(referenceDate.value)) {
        isShowedDepartment = true;
        for (let department of departmentsForGanttChart.value.concat()) {
          if (data.division === department.division) {
            department.count += 1;
            parentDepartment = department.name;
            break;
          }
        }
        if (parentDepartment === data.name) {
          departmentsForInput.value.push(data.name);
        }
      } else {
        // departmentsForGanttChartは新しい部門のindexが小さい
        for (let department of departmentsForGanttChart.value.concat()) {
          if (data.division === department.division) {
            isLatestDepartment = false;
            department.count += 1;
            parentDepartment = department.name;
            break;
          }
        }
      }
      if (isLatestDepartment) {
        pushDepartments(data, isShowedDepartment, true, parentDepartment);
        isShowedDepartmentLength.value += 1;
      } else {
        pushDepartments(data, isShowedDepartment, false, parentDepartment);
      }
    }
    departmentsForInput.value.unshift("New");
  };

  // 選択された部門の変更前の区分コードを格納。選択された部門の子も変更後の区分コードにする際に使用
  const previousDepartmentDivision = ref(null);
  // 部署更新
  const updateDepartment = async () => {
    previousDepartmentDivision.value = selectedDepartment.value.division;
    console.log(previousDepartmentDivision.value);
    if (selectedDepartment.value.parentDepartment === "New") {
      await axios.get(departmentsBASE_URL + "/maxDivision").then((res) => {
        selectedDepartment.value.division = Number(res.data[0].maxdivision) + 1;
      });
      await axios.put(departmentsBASE_URL, selectedDepartment.value);
    } else {
      getDepartmentDivisionFromDepartmentName();
      await axios.put(departmentsBASE_URL, selectedDepartment.value);
    }
    // departments.value.concat().map(async (department) => {
    //   if (
    //     Number(department.division) ===
    //       Number(previousDepartmentDivision.value) &&
    //     selectedDepartment.value.id !== department.id &&
    //     new Date(selectedDepartment.value.to) > new Date(department.to)
    //   ) {
    //     department.division = selectedDepartment.value.division;
    //     await axios.put(departmentsBASE_URL, department);
    //   }
    // });
    await axios.put(
      departmentsBASE_URL +
        `/changeDivision?previousDivision=${previousDepartmentDivision.value}`,
      selectedDepartment.value
    );
  };

  // 部署作成
  const registerDepartment = async () => {
    // 新規登録時、NEW(区分)を選択
    if (selectedDepartment.value.parentDepartment === "New") {
      await axios.get(departmentsBASE_URL + "/maxDivision").then((res) => {
        selectedDepartment.value.division = Number(res.data[0].maxdivision) + 1;
      });
      await axios.post(departmentsBASE_URL, selectedDepartment.value);
    } else {
      getDepartmentDivisionFromDepartmentName();
      await axios.post(departmentsBASE_URL, selectedDepartment.value);
      departments.value.concat().map((department) => {
        if (
          selectedDepartment.value.division === department.division &&
          department.to === "9999-12-31"
        ) {
          let dateObject = new Date(selectedDepartment.value.from);
          dateObject.setDate(dateObject.getDate() - 1);
          let year = dateObject.getFullYear();
          let month = String(dateObject.getMonth() + 1).padStart(2, "0");
          let day = String(dateObject.getDate()).padStart(2, "0");
          let dateString = `${year}-${month}-${day}`;
          department.to = dateString;
          axios.put(departmentsBASE_URL, department);
        }
      });
    }
  };

  // 効果一覧取得
  const getInsideDxEffect = async () => {
    await axios.get("/json/insideDxEffect.json").then((res) => {
      insideDxEffect.value = res.data;
    });
  };

  // 状況一覧取得
  const getInsideDxState = async () => {
    await axios.get("/json/insideDxState.json").then((res) => {
      insideDxState.value = res.data;
    });
  };

  // 部門Idを部門名に変換
  const changeDepartment = (departmentId) => {
    departmentId = Number(departmentId);
    if (departmentId) {
      let changedDepartment = {};
      const foundDepartment = departments.value
        .concat()
        .find((item) => Number(item.id) === departmentId);
      if (new Date(foundDepartment.to) >= new Date(referenceDate.value)) {
        changedDepartment = foundDepartment;
      } else {
        let latestDepartment = { ...foundDepartment };
        for (const item of departments.value.concat().reverse()) {
          if (
            foundDepartment.division === item.division &&
            new Date(latestDepartment.to) < new Date(item.to)
          ) {
            latestDepartment = item;
            break;
          }
        }
        changedDepartment = latestDepartment;
      }
      return changedDepartment ? changedDepartment.name : "";
    } else {
      return "";
    }
  };

  // 効果Idを効果名に変換
  const changeEffect = (effect) => {
    effect = Number(effect);
    if (effect) {
      const changedEffect = insideDxEffect.value.find(
        (item) => Number(item.id) === effect
      );
      return changedEffect ? changedEffect.effect : "";
    } else {
      return "";
    }
  };

  // 状況Idを状況名に変換
  const changeState = (state) => {
    state = Number(state);
    if (state) {
      const changedState = insideDxState.value.find(
        (item) => Number(item.id) === state
      );
      return changedState ? changedState.state : "";
    } else {
      return "";
    }
  };

  // グラフの縦軸の要素
  const insideDxHorizontal = ref("レコード数");
  const insideDxHorizontalList = ref(["レコード数"]);

  // グラフの横軸の要素
  const insideDxVertical = ref("部門");
  const insideDxVerticalList = ref(["部門", "支援ツール", "状況", "効果"]);

  // グラフ種類
  const insideDxChart = ref("棒グラフ");
  const insideDxChartList = ref(["円グラフ", "棒グラフ"]);

  // 単一の社内DXの初期値を設定
  const resetInsideDxItem = () => {
    insideDxItem.value = Object.assign({}, insideDxItem.value);
    for (let item in insideDxItem.value) {
      if (item === "comment") {
        insideDxItem.value[item] = [];
      } else if (item === "attached_file") {
        insideDxItem.value[item] = [];
      } else {
        insideDxItem.value[item] = null;
      }
    }
  };

  // 前回の添付ファイルを格納
  const newAttachedFiles = ref([]);
  //　添付ファイルをバックエンドでアップロード
  const postFiles = async () => {
    const attachedFiles = [];
    if (newAttachedFiles.value.length > 0) {
      for (const file of newAttachedFiles.value) {
        const formData = new FormData();
        const timeStamp = Date.now();
        const uniqueFileName = timeStamp + "_" + file.name;
        formData.append("file", file, uniqueFileName);
        await axios
          .post(insideDxBASE_URL + `/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("ファイルのアップロードが成功しました");
          })
          .catch((error) => {
            console.error(
              "ファイルのアップロード中にエラーが発生しました",
              error
            );
          });
        attachedFiles.push({
          name: uniqueFileName,
          size: file.size,
          type: file.type,
        });
      }
      if (insideDxItem.value.attached_file.length > 0) {
        let files = insideDxItem.value.attached_file.concat();
        for (const file of files) {
          axios.put(insideDxBASE_URL + "/deleteFile", {
            file: file,
          });
        }
      }
      editInsideDxItem.value.attached_file = attachedFiles;
      insideDxItem.value.attached_file = attachedFiles;
    } else {
      editInsideDxItem.value.attached_file = insideDxItem.value.attached_file;
    }
  };

  // 添付ファイルを削除
  const deleteFile = async (fileIndex) => {
    const file = insideDxItem.value.attached_file.splice(fileIndex, 1);
    await axios.put(insideDxBASE_URL + "/deleteFile", {
      item: insideDxItem.value,
      file: file[0],
    });
  };

  // 部署名、状況名、効果名をidに変換
  const itemNumberConversion = async () => {
    for (let item of await departments.value) {
      if (item.name === editInsideDxItem.value.department) {
        editInsideDxItem.value.department = item.id;
        break;
      }
    }

    for (let item of await insideDxEffect.value) {
      if (item.effect === editInsideDxItem.value.effect) {
        editInsideDxItem.value.effect = item.id;
        break;
      }
    }
    for (let item of await insideDxState.value) {
      if (item.state === editInsideDxItem.value.state) {
        editInsideDxItem.value.state = item.id;
        break;
      }
    }
  };

  // 新しい社内DXをデータベースに格納
  const addInsideDxList = async () => {
    editInsideDxItem.value = Object.assign({}, insideDxItem.value);
    await itemNumberConversion();
    await postFiles();
    await axios.post(insideDxBASE_URL, editInsideDxItem.value);
  };
  // 変更した社内DXをデータベースに格納
  const changeInsideDxList = async () => {
    editInsideDxItem.value = Object.assign({}, insideDxItem.value);
    await itemNumberConversion();
    await postFiles();
    axios.put(insideDxBASE_URL, editInsideDxItem.value);
  };
  // 指定した社内DXを削除
  const deleteInsideDxList = (id) => {
    let data = [];
    for (let [index, item] of showInsideDxLists.value.entries()) {
      if (item.id === Number(id)) {
        data = showInsideDxLists.value.splice(index, 1);
        break;
      }
    }
    axios.delete(`${insideDxBASE_URL}/${id}`);
    if (data[0].attached_file.length > 0) {
      for (const file of data[0].attached_file) {
        axios.put(insideDxBASE_URL + "/deleteFile", {
          file: file,
        });
      }
    }
  };

  // コメントを追加
  const addComment = async (comment) => {
    if (comment == "") {
      return;
    }
    let commentArr = comment.split("");
    for (let i = 0; i < commentArr.length; i++) {
      if (commentArr[i] !== " " && commentArr[i] !== "　") {
        console.log("コメント挿入");
        insideDxItem.value.comment.unshift(comment);
        await axios.put(
          insideDxBASE_URL + "/changeComment",
          insideDxItem.value
        );
        break;
      }
    }
  };
  // コメントを削除
  const deleteComment = async (commentIndex) => {
    insideDxItem.value.comment.splice(commentIndex, 1);
    await axios.put(insideDxBASE_URL + "/changeComment", insideDxItem.value);
  };

  // エクセル化--------------------------------------------
  const createExcel = async () => {
    let lists = [];
    await axios.get(`${insideDxBASE_URL}?key=id&sequence=asc`).then((res) => {
      lists = res.data;
    });

    // Excelの作成
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("一覧");
    const worksheet = workbook.getWorksheet("一覧");

    // 列の定義
    worksheet.columns = [
      { header: "部門", key: "department" },
      { header: "担当", key: "staff" },
      { header: "業務", key: "work" },
      { header: "支援ツール", key: "tool" },
      { header: "期待される効果", key: "expected_effect" },
      { header: "効果", key: "effect" },
      { header: "状況", key: "state" },
      { header: "登録日", key: "date" },
    ];

    // 行の定義
    for (let list of lists) {
      worksheet.addRow({
        department: changeDepartment(list.department),
        staff: list.staff,
        work: list.work,
        tool: list.support_tool,
        expected_effect: list.expected_effect,
        effect: changeEffect(list.effect),
        state: changeState(list.state),
        date: list.registration_date,
      });
    }

    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "社内DX一覧.xlsx";
    a.click();
    a.remove();
  };

  // 画面の高さに応じてテーブルの高さ変更
  const tableHeightAdjustment = () => {
    let windowHeight = window.innerHeight;
    let tableHeight = Math.round(windowHeight / 1.6);
    return tableHeight;
  };

  // 詳細検索
  const filteringTargetColumn = ref("部門");
  const filteringWord = ref("");
  const columnList = {
    部門: "department",
    担当: "staff",
    業務: "work",
    支援ツール: "support_tool",
    期待される効果: "expected_effect",
    効果: "effect",
    状況: "state",
    登録日: "registration_date",
  };
  const isDetailedFilter = ref(false);

  // 検索 --------------------------------------------------
  const searchWord = ref("");
  const search = () => {
    showInsideDxLists.value = [];
    if (searchWord.value) {
      for (let list of insideDxLists.value.concat()) {
        if (new Date(list.registration_date) > new Date(referenceDate.value)) {
          continue;
        }
        for (let item in list) {
          if (
            String(list[item])
              .toLowerCase()
              .includes(String(searchWord.value).toLowerCase())
          ) {
            showInsideDxLists.value.push(list);
            break;
          }
        }
      }
    } else {
      if (isDetailedFilter.value) {
        if (!filteringWord.value) {
          isDetailedFilter.value = false;
          search();
        }
        for (const list of insideDxLists.value.concat()) {
          if (
            new Date(list.registration_date) > new Date(referenceDate.value)
          ) {
            continue;
          }
          if (
            list[columnList[filteringTargetColumn.value]].includes(
              filteringWord.value
            )
          ) {
            showInsideDxLists.value.push(list);
          }
        }
      } else if (startDate.value && endDate.value) {
        for (const list of insideDxLists.value.concat()) {
          if (
            new Date(list.registration_date) > new Date(referenceDate.value)
          ) {
            continue;
          }
          if (
            new Date(startDate.value) <= new Date(list.registration_date) &&
            new Date(endDate.value) >= new Date(list.registration_date)
          ) {
            showInsideDxLists.value.push(list);
          }
        }
      } else {
        for (let list of insideDxLists.value.concat()) {
          if (
            new Date(list.registration_date) > new Date(referenceDate.value)
          ) {
            continue;
          }
          showInsideDxLists.value.push(list);
        }
      }
    }
  };

  // ソート -----------------------------------------------
  const sortValue = ref("更新日");
  const keyTranslationTable = {
    ID: "id",
    登録日: "cast(registration_date as date)",
    更新日: "cast(update_date as date)",
    部門: "department",
    更新者: "changer",
    担当: "staff",
    業務: "work",
    支援ツール: "support_tool",
    期待される効果: "expected_effect",
    効果: "effect",
    状況: "state",
  };
  const sequence = ref("降順");
  const sequenceTable = {
    昇順: "asc",
    降順: "desc",
  };

  // 年度絞り込みの開始日
  const startDate = ref("");
  // 年度絞り込みの終了日
  const endDate = ref("");
  // 年度絞り込みの実施の有無
  const isSearchDate = ref(false);

  // 指定した条件で値を取得
  const getSortInsideDxLists = async () => {
    let url = "";
    insideDxLists.value = [];
    url = `${insideDxBASE_URL}?key=${
      keyTranslationTable[sortValue.value]
    }&sequence=${sequenceTable[sequence.value]}`;
    isSearchDate.value = false;
    await axios.get(url).then((res) => {
      for (const data of res.data) {
        data.department = changeDepartment(data.department);
        data.effect = changeEffect(data.effect);
        data.state = changeState(data.state);
        insideDxLists.value.push(data);
      }
      search();
    });
  };

  // 集計 --------------------------------------------------
  // 集計用の状況一覧のオブジェクトを作成
  const createInsideDxStateObject = () => {
    let dxStateObject = {};
    for (let item of insideDxState.value) {
      if (Number(item.id) === 1) {
        continue;
      }
      dxStateObject[Number(item.id)] = 0;
    }
    return dxStateObject;
  };
  // 状況・部署別の集計表を作成
  const getStateId = (state) => {
    for (let item of insideDxState.value) {
      if (item.state === state) {
        return item.id;
      }
    }
  };
  const calculationStateTotalization = () => {
    let beDepartment = false;
    let stateId = "";
    const stateTotalizationLists = [];
    stateTotalizationLists.push({
      合計: createInsideDxStateObject(),
    });
    stateTotalizationLists[0]["合計"]["合計"] = 0;
    for (const insideDxList of showInsideDxLists.value) {
      beDepartment = false;
      stateId = getStateId(insideDxList.state);
      for (const stateTotalizationList of stateTotalizationLists) {
        if (stateTotalizationList[insideDxList.department]) {
          beDepartment = true;
          break;
        }
      }
      if (beDepartment) {
        for (let stateTotalizationList of stateTotalizationLists) {
          if (stateTotalizationList[insideDxList.department]) {
            stateTotalizationList[insideDxList.department][stateId] += 1;
            stateTotalizationList[insideDxList.department]["合計"] += 1;

            stateTotalizationLists[0]["合計"][stateId] += 1;
            stateTotalizationLists[0]["合計"]["合計"] += 1;
          }
        }
      } else {
        let department = insideDxList.department;
        stateTotalizationLists.push({
          [department]: createInsideDxStateObject(),
        });
        for (let stateTotalizationList of stateTotalizationLists) {
          if (stateTotalizationList[department]) {
            stateTotalizationList[department][stateId] += 1;
            stateTotalizationList[department]["合計"] = 1;

            stateTotalizationLists[0]["合計"][stateId] += 1;
            stateTotalizationLists[0]["合計"]["合計"] += 1;
          }
        }
      }
    }
    return stateTotalizationLists;
  };

  // グラフ -----------------------------------------------------
  // テーマをインスタンス
  const theme = useTheme();

  // 文字を縦文字にする。未使用
  const stringToVertically = (word) => {
    let wordLength = word.length;
    let verticallyWord = "";
    for (let i = 0; i < wordLength; i++) {
      verticallyWord = verticallyWord + word.charAt(i) + "\n";
    }
    console.log(verticallyWord);
    return verticallyWord;
  };

  const getGraphData = (keyName) => {
    let lists = [];
    let beList = false;
    for (const insideDxList of showInsideDxLists.value) {
      beList = false;
      for (const list of lists) {
        if (list[insideDxList[keyName]]) {
          list[insideDxList[keyName]] += 1;
          beList = true;
          continue;
        }
      }
      if (!beList) {
        lists.push({ [insideDxList[keyName]]: 1 });
      }
    }
    return lists;
  };

  let chart1Instance;
  let chart2Instance;
  let chart3Instance;

  // グラフを作成
  const createGraph = (chartId, tagId, legendPosition) => {
    // グラフに使用するデータ格納
    let datasets = null;
    // グラフの種類格納
    let chart = null;
    // ラベルの値を格納
    let labels = [];
    // ラベルごとのデータを格納
    let datas = [];
    // ラベルの色を格納
    let labelColor;

    // 選択された横軸ごとにグラフで使用するdatasetを作成
    if (insideDxVertical.value === "部門") {
      datasets = getGraphData("department");
    } else if (insideDxVertical.value === "支援ツール") {
      datasets = getGraphData("support_tool");
    } else if (insideDxVertical.value === "状況") {
      datasets = getGraphData("state");
    } else if (insideDxVertical.value === "効果") {
      datasets = getGraphData("effect");
    }

    // データセットをラベルとデータに分ける
    for (const dataset of datasets) {
      for (const [key, value] of Object.entries(dataset)) {
        labels.push(key);
        datas.push(value);
      }
    }
    // テーマカラーによってラベルカラーを設定
    if (theme.global.name.value === "light") {
      labelColor = "grey";
    } else if (theme.global.name.value === "dark") {
      labelColor = "white";
    }
    // ラベルの傾きをデータ量によって変更
    let minLabelRotation = 0;
    if (labels.length > 10) {
      minLabelRotation = Math.round(60 * calculateFontSize());
    }
    // グラフのオプションのスケール値設定
    let scales = {
      r: {
        //グラフの最小値・最大値
        min: 0,
        max: 100,
        //背景色
        backgroundColor: "snow",
        //グリッドライン
        grid: {
          color: "pink",
        },
        //アングルライン
        angleLines: {
          color: "green",
        },
        //各項目のラベル
        pointLabels: {
          color: "blue",
        },
      },
      xAxes: [
        // Ｘ軸設定
        {
          display: true,
          scaleLabel: {
            // 軸ラベル
            display: false, // 表示設定
            // labelString: "横軸ラベル", // ラベル
            fontColor: labelColor, // 文字の色
            // fontSize: 16, // フォントサイズ
          },

          ticks: {
            // callback: (tick) => {
            //   return stringToVertically(String(tick));
            // },
            // 目盛り
            fontColor: labelColor, // 目盛りの色
            fontSize: Math.round(14 * calculateFontSize()), // フォントサイズ
            maxRotation: 90, // 最大回転角度
            minRotation: minLabelRotation, // 最小回転角度
          },
        },
      ],
      yAxes: [
        {
          display: false,
          scaleLabel: {
            // 軸ラベル
            display: false, // 表示設定
            // labelString: "横軸ラベル", // ラベル
            fontColor: labelColor, // 文字の色
            // fontSize: 16, // フォントサイズ
          },

          ticks: {
            min: 0,
            fontColor: labelColor,
            fontSize: Math.round(14 * calculateFontSize()),
          },
        },
      ],
    };

    // 選択されたグラフの種類ごとに値を設定
    if (insideDxChart.value === "棒グラフ") {
      chart = "bar";
      scales.yAxes[0].display = true;
    } else if (insideDxChart.value === "円グラフ") {
      chart = "doughnut";
      scales.xAxes[0].display = false;
    } else if (insideDxChart.value === "レーダーチャート") {
      chart = "radar";
      scales.xAxes[0].display = false;
      scales["gridLines"] = {
        // 補助線（目盛の線）
        display: true,
        color: "lime",
      };
    }

    // グラフを作成するhtmlタグ指定
    let ctx = document.getElementById(String(tagId));
    // グラフの内容設定
    const chartConfig = {
      type: chart,
      data: {
        labels: labels,
        datasets: [
          {
            label: "レコード数",
            data: datas,
          },
        ],
      },
      options: {
        responsive: false, // canvasサイズ自動設定機能を使わない。HTMLで指定したサイズに固定
        scales: scales,
        legend: {
          position: legendPosition,
          labels: {
            fontColor: labelColor,
            fontSize: Math.round(14 * calculateFontSize()),
          },
        },
        plugins: {
          colorschemes: {
            scheme: "tableau.Classic20",
            // reverse: true,
          },
        },
      },
    };
    // チャートが存在すれば破壊
    if (chartId === 1 && chart1Instance) {
      chart1Instance.destroy();
    }
    if (chartId === 2 && chart2Instance) {
      chart2Instance.destroy();
    }
    if (chartId === 3 && chart3Instance) {
      chart3Instance.destroy();
    }
    // チャートを作成
    if (chartId === 1) {
      chart1Instance = new Chart(ctx, chartConfig);
    } else if (chartId === 2) {
      chart2Instance = new Chart(ctx, chartConfig);
    } else if (chartId === 3) {
      chart3Instance = new Chart(ctx, chartConfig);
    }
  };

  // ホーム画面で仕様するチャートを作成
  const dxHomeUseGraph = () => {
    insideDxVertical.value = "部門";
    insideDxChart.value = "棒グラフ";
    createGraph(1, "departmentChart", "top");
    insideDxVertical.value = "効果";
    insideDxChart.value = "円グラフ";
    createGraph(2, "effectChart", "top");
    insideDxVertical.value = "状況";
    insideDxChart.value = "円グラフ";
    createGraph(3, "stateChart", "top");
  };

  return {
    switchDx,
    date,
    year,
    referenceDate,
    referenceMonth,
    insideDxItem,
    showInsideDxLists,
    insideDxLists,
    departmentsForInput,
    departments,
    departmentsForGanttChart,
    isShowedDepartmentLength,
    insideDxEffect,
    insideDxState,
    insideDxHorizontal,
    insideDxHorizontalList,
    insideDxVertical,
    insideDxVerticalList,
    insideDxChart,
    insideDxChartList,
    searchWord,
    sortValue,
    keyTranslationTable,
    sequence,
    sequenceTable,
    startDate,
    endDate,
    isSearchDate,
    showDetailDialog,
    showEditDialog,
    showRegisterDialog,
    showDeleteDialog,
    newAttachedFiles,
    showDepartmentDialog,
    selectedDepartment,
    isEditedDepartment,
    previousDepartmentDivision,
    fontSizeNum,
    filteringTargetColumn,
    filteringWord,
    columnList,
    isDetailedFilter,
    isShowedAllDepartment,
    resetInsideDxItem,
    addInsideDxList,
    changeInsideDxList,
    deleteInsideDxList,
    addComment,
    deleteComment,
    deleteFile,
    search,
    getSortInsideDxLists,
    calculationStateTotalization,
    createGraph,
    createExcel,
    tableHeightAdjustment,
    getDepartmentsForInput,
    getDepartments,
    loadDepartmentsForGanttChart,
    updateDepartment,
    registerDepartment,
    getInsideDxEffect,
    getInsideDxState,
    changeDepartment,
    changeEffect,
    changeState,
    dxHomeUseGraph,
    itemNumberConversion,
    calculateFontSize,
    getLastDayOfMonth,
  };
});
