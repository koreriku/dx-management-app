import { ref } from "vue";
import { defineStore } from "pinia";
import chartjsPluginColorschemes from "chartjs-plugin-colorschemes";
import axios from "axios";
import ExcelJS from "exceljs";
import { useTheme } from "vuetify";
import { useRouter } from "vue-router";

axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

export const useDxStore = defineStore("dxManagement", () => {
  const router = useRouter();
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

  const convertArrayToText = (array) => {
    let text = "";
    if (!array) {
      return "";
    }
    for (const data of array) {
      if (text === "") {
        text = data;
      } else {
        text = text + "、" + data;
      }
    }
    return text;
  };

  // trueの時に社内DX表示、falseの時に社外DX表示
  const switchDx = ref(true);
  // テーマをインスタンス
  const theme = useTheme();
  const changeThemeColor = () => {
    let light = theme.themes.value.light.colors;
    let dark = theme.themes.value.dark.colors;
    if (switchDx.value) {
      light.primary = "#1565C0";
      light.yellow = "#FB8C00";
      dark.primary = "#1565C0";
      dark.yellow = "#FB8C00";
    } else {
      light.primary = "#00B8D4";
      light.yellow = "#CDDC39";
      dark.primary = "#00B8D4";
      dark.yellow = "#CDDC39";
    }
  };

  if (localStorage.getItem("switchDx")) {
    switchDx.value = JSON.parse(localStorage.getItem("switchDx").toLowerCase());
    changeThemeColor();
  }
  const dxTitle = ref(0);

  if (localStorage.getItem("dxTitle")) {
    dxTitle.value = JSON.parse(localStorage.getItem("dxTitle").toLowerCase());
  }

  const changeSwitchDx = () => {
    localStorage.setItem("switchDx", switchDx.value);
    localStorage.setItem("dxTitle", dxTitle.value);
    changeThemeColor();
  };

  // appBarで選択されたフォントサイズを格納
  const fontSizeNum = ref(40);

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

  // DXWGの新規登録パスワード入力モーダルの開閉
  const showDxWgRegisterUnlockModal = ref(false);

  // バックエンドのURL -----------------------------------------
  // DX
  const dxBASE_URL = "http://localhost:8000/dx";
  // 部署
  const departmentsBASE_URL = "http://localhost:8000/departments";
  // dxWg
  const dxWgBASE_URL = "http://localhost:8000/dxWg";
  // dxWgカテゴリー
  const dxWgCategoryBASE_URL = "http://localhost:8000/dxWgCategory";
  // Dx系の変数 -----------------------------------------
  // 単一の社内DXを格納
  const dxItem = ref({});
  // レコード更新時に部署名と状況と効果は値が数字に切り替わるため、数字の切り替えを画面に描写
  // しないようにレコード更新前に別の変数に格納する
  const editDxItem = ref({});
  // 画面に表示させるDxを格納
  const showDxLists = ref([]);
  // 全てのDxを格納
  const insideDxLists = ref([]);
  // 全ての効果を格納
  const insideDxEffect = ref([]);
  // 全ての状況を格納
  const insideDxState = ref([]);

  // 画面に表示させる社外Dxを格納
  const showOutsideDxLists = ref([]);
  // 全てのDxを格納
  const outsideDxLists = ref([]);
  // 全ての社外DX状況を格納
  const outsideDxState = ref([]);
  // 全ての社外DX状況を格納
  const outsideDxIndustry = ref([]);
  // 全ての社外DX状況を格納
  const outsideDxTechnology = ref([]);

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
  // 部門の順番変更時に選択した部署名
  const startingDepartment = ref("");
  const destinationDepartment = ref("");

  // trueの時に部署変更
  const departmentsPermission = ref(false);

  // DXWGの関数 -----------------------------------------------------
  // dxWgの登録ダイアログを開く
  const showDxWgRegisterDialog = ref(false);
  // dxWgの詳細ダイアログを開く
  const showDxWgDetailDialog = ref(false);
  // dxWgの新規登録画面を開けるかどうか
  const isDxWgRegisterAuthority = ref(false);
  // 単一のdxWg
  const dxWg = ref();
  // 編集用のdxWg
  const editDxWg = ref({
    id: null,
    category: [],
    category_name: [],
    draft_content: null,
    draft_business_sector: null,
    draft_department: [],
    draft_department_name: [],
    priority: false,
    state: null,
    state_name: "--",
    support_department: [],
    support_department_name: [],
    staff: null,
    support_content: null,
    deadline: null,
    one_q_progress: null,
    two_q_progress: null,
    three_q_progress: null,
    four_q_progress: null,
    result: null,
    effect: null,
    effect_name: "--",
    effect_comment: null,
    registration_date: null,
    update_date: null,
    support_update_date: null,
    effect_update_date: null,
    attached_file: [],
    comment: [],
  });
  const dxWgFilteringWord = ref({
    id: null,
    category: [],
    category_name: [],
    draft_content: null,
    draft_business_sector: null,
    draft_department: [],
    draft_department_name: [],
    priority: false,
    state: null,
    state_name: "--",
    support_department: [],
    support_department_name: [],
    staff: null,
    support_content: null,
    deadline: null,
    one_q_progress: null,
    two_q_progress: null,
    three_q_progress: null,
    four_q_progress: null,
    result: null,
    effect: null,
    effect_name: "--",
    effect_comment: null,
    registration_date: null,
    update_date: null,
    support_update_date: null,
    effect_update_date: null,
    attached_file: [],
    comment: [],
  });

  // 全てのdxWg
  const dxWgs = ref([]);
  // 検索後のdxWgs
  const showDxWgs = ref([]);
  // 効果
  const dxWgEffects = ref([]);
  // 状況
  const dxWgStates = ref([]);
  // 単一のDXの初期値を設定
  const resetDxWgItem = () => {
    dxWg.value = {
      id: null,
      category: [],
      category_name: [],
      draft_content: null,
      draft_business_sector: null,
      draft_department: [],
      draft_department_name: [],
      priority: false,
      state: null,
      state_name: "--",
      support_department: [],
      support_department_name: [],
      staff: null,
      support_content: null,
      deadline: null,
      one_q_progress: null,
      two_q_progress: null,
      three_q_progress: null,
      four_q_progress: null,
      result: null,
      effect: null,
      effect_name: "--",
      effect_comment: null,
      registration_date: null,
      update_date: null,
      support_update_date: null,
      effect_update_date: null,
      attached_file: [],
      comment: [],
    };
    editDxWg.value = {
      id: null,
      category: [],
      category_name: [],
      draft_content: null,
      draft_business_sector: null,
      draft_department: [],
      draft_department_name: [],
      priority: false,
      state: null,
      state_name: "--",
      support_department: [],
      support_department_name: [],
      staff: null,
      support_content: null,
      deadline: null,
      one_q_progress: null,
      two_q_progress: null,
      three_q_progress: null,
      four_q_progress: null,
      result: null,
      effect: null,
      effect_name: "--",
      effect_comment: null,
      registration_date: null,
      update_date: null,
      support_update_date: null,
      effect_update_date: null,
      attached_file: [],
      comment: [],
    };
    dxWgFilteringWord.value = {
      id: null,
      category: [],
      category_name: [],
      draft_content: null,
      draft_business_sector: null,
      draft_department: [],
      draft_department_name: [],
      priority: false,
      state: null,
      state_name: "--",
      support_department: [],
      support_department_name: [],
      staff: null,
      support_content: null,
      deadline: null,
      one_q_progress: null,
      two_q_progress: null,
      three_q_progress: null,
      four_q_progress: null,
      result: null,
      effect: null,
      effect_name: "--",
      effect_comment: null,
      registration_date: null,
      update_date: null,
      support_update_date: null,
      effect_update_date: null,
      attached_file: [],
      comment: [],
    };
  };
  const isCategoryRegistrationDialog = ref(false);

  const newCategory = ref({
    id: 0,
    name: "",
    sort_key: 0,
  });
  const dxWgCategories = ref([]);

  const postCategory = async () => {
    newCategory.value.sort_key = dxWgCategories.value.length + 1;
    await axios.post(dxWgCategoryBASE_URL, newCategory.value);
    await getCategory();
  };

  const getCategory = async () => {
    await axios.get(dxWgCategoryBASE_URL).then((res) => {
      dxWgCategories.value = res.data;
    });
  };
  const putCategory = async (category) => {
    await axios.put(dxWgCategoryBASE_URL, category);
  };

  const sortCategory = async () => {
    const usedCategory = sortItems(dxWgCategories.value);

    if (usedCategory) await putMultiCategory(usedCategory);
  };

  const putMultiCategory = async (items) => {
    await axios.put(dxWgCategoryBASE_URL + "/multi", items).then((res) => {
      dxWgCategories.value = res.data;
    });
  };

  const selectedItem = ref({});
  const puttedItem = ref({});

  const sortItems = (targets) => {
    if (selectedItem.value.sort_key == puttedItem.value.sort_key) {
      return;
    }

    const usedItems = [];

    if (selectedItem.value.sort_key > puttedItem.value.sort_key) {
      for (const target of targets) {
        if (
          target.sort_key <= selectedItem.value.sort_key &&
          target.sort_key >= puttedItem.value.sort_key
        ) {
          usedItems.push(target);
        }
      }
      for (const [index, item] of Object.entries(usedItems)) {
        if (usedItems.length - 1 == Number(index)) {
          item.new_id = usedItems[0].sort_key;
          break;
        }
        item.new_id = usedItems[Number(index) + 1].sort_key;
      }
      usedItems.unshift(usedItems.pop());
    } else {
      for (const target of targets) {
        if (
          target.sort_key >= selectedItem.value.sort_key &&
          target.sort_key <= puttedItem.value.sort_key
        ) {
          usedItems.push(target);
        }
      }

      for (const [index, item] of Object.entries(usedItems)) {
        if (usedItems.length - 1 == Number(index)) {
          usedItems[0].new_id = item.sort_key;
          break;
        }
        usedItems[Number(index) + 1].new_id = item.sort_key;
      }
      usedItems.push(usedItems.shift());
    }
    return usedItems;
  };

  const changeThemeColorForDxWg = () => {
    let light = theme.themes.value.light.colors;
    let dark = theme.themes.value.dark.colors;
    light.primary = "#424242";
    light.yellow = "#9E9E9E";
    dark.primary = "#424242";
    dark.yellow = "#9E9E9E";
  };

  const unlockDxWgRegisterAuthority = () => {
    axios.get("/json/dxWgAdministratorInfo.json").then((res) => {
      if (res.data.password === password.value) {
        message.value = "";
        isDxWgRegisterAuthority.value = true;
        showDxWgRegisterUnlockModal.value = false;
        if (!showEditDialog.value) {
          resetDxWgItem();
          showDxWgRegisterDialog.value = true;
        }
      } else {
        message.value = "パスワードが違います。";
      }
    });
  };
  const preDxWgUpdate = () => {
    editDxWg.value.update_date = date;

    if (editDxWg.value.four_q_progress) {
      editDxWg.value.support_content = editDxWg.value.four_q_progress;
    } else if (editDxWg.value.three_q_progress) {
      editDxWg.value.support_content = editDxWg.value.three_q_progress;
    } else if (editDxWg.value.two_q_progress) {
      editDxWg.value.support_content = editDxWg.value.two_q_progress;
    } else if (editDxWg.value.one_q_progress) {
      editDxWg.value.support_content = editDxWg.value.one_q_progress;
    }
    if (editDxWg.value.support_content != dxWg.value.support_content) {
      editDxWg.value.support_update_date = date;
    }
    if (editDxWg.value.draft_department_name.length > 0) {
      editDxWg.value.draft_department = changeDepartmentNames(
        editDxWg.value.draft_department_name
      );
    } else {
      editDxWg.value.draft_department = [];
    }
    if (editDxWg.value.support_department_name.length > 0) {
      editDxWg.value.support_department = changeDepartmentNames(
        editDxWg.value.support_department_name
      );
    } else {
      editDxWg.value.support_department = [];
    }
    if (editDxWg.value.category_name.length > 0) {
      editDxWg.value.category = changeDxWgCategoryNames(
        editDxWg.value.category_name
      );
    } else {
      editDxWg.value.category = [];
    }
    if (editDxWg.value.state_name) {
      editDxWg.value.state = changeDxWgStateName(editDxWg.value.state_name);
    } else {
      editDxWg.value.state = null;
    }
    if (editDxWg.value.effect_name) {
      editDxWg.value.effect_update_date = date;
      editDxWg.value.effect = changeDxWgEffectName(editDxWg.value.effect_name);
    } else {
      editDxWg.value.effect = null;
    }
  };
  const getDxWg = async () => {
    await axios.get(dxWgBASE_URL).then((res) => {
      for (const data of res.data) {
        if (data.draft_department.length > 0) {
          data.draft_department_name = changeDepartmentIds(
            data.draft_department
          );
        } else {
          data.draft_department_name = [];
        }
        if (data.support_department.length > 0) {
          data.support_department_name = changeDepartmentIds(
            data.support_department
          );
        } else {
          data.support_department_name = [];
        }
        if (data.category.length > 0) {
          data.category_name = changeDxWgCategoryIds(data.category);
        } else {
          data.category_name = [];
        }
        if (data.state) {
          data.state_name = changeDxWgState(data.state);
        }
        if (data.effect) {
          data.effect_name = changeDxWgEffect(data.effect);
        }
      }
      dxWgs.value = res.data;
    });
    searchDxWg();
    sortDxWg(false);
  };
  // 新しいDXをデータベースに格納
  const addDxWg = async () => {
    editDxWg.value.registration_date = date;
    preDxWgUpdate();
    await axios.post(dxWgBASE_URL, editDxWg.value);
    await getDxWg();
  };
  // 変更したDXをデータベースに格納
  const changeDxWg = async () => {
    preDxWgUpdate();
    // 後に削除
    for (let item of dxWgs.value) {
      if (item.id == editDxWg.value.id) {
        for (const key of Object.keys(editDxWg.value)) {
          item[key] = editDxWg.value[key];
        }
      }
    }
    dxWg.value = Object.assign({}, editDxWg.value);
    await axios.put(dxWgBASE_URL, editDxWg.value);
    searchDxWg();
    sortDxWg(false);
  };
  const deleteDxWg = () => {
    const result = dxWgs.value.filter(function (item) {
      return item.id != dxWg.value.id;
    });
    dxWgs.value = result;
    axios.delete(`${dxWgBASE_URL}/${dxWg.value.id}`);
    searchDxWg();
    sortDxWg(false);
  };

  const sortDxWgValue = ref("update_date");
  const dxWgSequence = ref("降順");
  const sortDxWg = (switchSequence = true) => {
    if (switchSequence) {
      if (dxWgSequence.value == "昇順") {
        dxWgSequence.value = "降順";
      } else {
        dxWgSequence.value = "昇順";
      }
    }
    if (dxWgSequence.value == "昇順") {
      showDxWgs.value.sort(function (a, b) {
        // null または 空文字を最後に移動
        if (a === null || a === "") return 1;
        if (b === null || b === "") return -1;
        if (a[sortDxWgValue.value] > b[sortDxWgValue.value]) {
          return 1;
        } else {
          return -1;
        }
      });
    } else {
      showDxWgs.value.sort(function (a, b) {
        if (a === null || a === "") return 1;
        if (b === null || b === "") return -1;
        if (a[sortDxWgValue.value] > b[sortDxWgValue.value]) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  };

  // DXWGの効果一覧取得
  const getDxWgEffect = async () => {
    await axios.get("/json/dxWgEffect.json").then((res) => {
      dxWgEffects.value = res.data;
    });
  };

  // DXWGの効果Idを効果名に変換
  const changeDxWgEffect = (effect) => {
    effect = Number(effect);
    if (effect) {
      const changedEffect = dxWgEffects.value.find(
        (item) => Number(item.id) === effect
      );
      return changedEffect ? changedEffect.effect : "";
    } else {
      return "";
    }
  };
  // DXWGの効果名を効果IDに変換
  const changeDxWgEffectName = (effectName) => {
    if (effectName) {
      const changedEffect = dxWgEffects.value.find(
        (item) => item.effect === effectName
      );
      return changedEffect ? changedEffect.id : "";
    } else {
      return "";
    }
  };

  // DXWGの効果一覧取得
  const getDxWgState = async () => {
    await axios.get("/json/dxWgState.json").then((res) => {
      dxWgStates.value = res.data;
    });
  };

  // DXWGの状況Idを状況名に変換
  const changeDxWgState = (state) => {
    state = Number(state);
    if (state) {
      const changedState = dxWgStates.value.find(
        (item) => Number(item.id) === state
      );
      return changedState ? changedState.state : "";
    } else {
      return "";
    }
  };
  // DXWGの状況名を状況IDに変換
  const changeDxWgStateName = (stateName) => {
    if (stateName) {
      const changedState = dxWgStates.value.find(
        (item) => item.state === stateName
      );
      return changedState ? changedState.id : "";
    } else {
      return "";
    }
  };

  const changeDepartmentNames = (departmentNames) => {
    let departmentIds = [];
    for (const departmentName of departmentNames) {
      for (const department of departments.value) {
        if (department.name == departmentName) {
          departmentIds.push(department.id);
          break;
        }
      }
    }
    return departmentIds;
  };
  const changeDepartmentIds = (departmentIds) => {
    let departmentNames = [];
    for (const departmentId of departmentIds) {
      for (const department of departments.value) {
        if (department.id == departmentId) {
          departmentNames.push(department.name);
          break;
        }
      }
    }
    return departmentNames;
  };

  const changeDxWgCategoryNames = (itemNames) => {
    let ids = [];
    for (const itemName of itemNames) {
      for (const category of dxWgCategories.value) {
        if (category.name == itemName) {
          ids.push(category.id);
          break;
        }
      }
    }
    return ids;
  };
  const changeDxWgCategoryIds = (itemIds) => {
    let names = [];
    for (const itemId of itemIds) {
      for (const category of dxWgCategories.value) {
        if (category.id == itemId) {
          names.push(category.name);
          break;
        }
      }
    }
    return names;
  };

  const isDxWgDetailedFilter = ref(false);
  const isDxWgSearched = ref(false);
  const searchDxWgWord = ref(null);

  const searchDxWg = () => {
    showDxWgs.value = [];
    if (!searchDxWgWord.value && !isDxWgDetailedFilter.value) {
      for (const item of dxWgs.value) {
        if (new Date(item.registration_date) > new Date(referenceDate.value)) {
          continue;
        }
        showDxWgs.value.push(item);
      }
      return;
    } else {
      isDxWgSearched.value = true;
    }
    let isJudge = true;
    if (isDxWgDetailedFilter.value) {
      for (const item of dxWgs.value) {
        isJudge = true;
        if (new Date(item.registration_date) > new Date(referenceDate.value)) {
          continue;
        }
        for (const key of Object.keys(dxWgFilteringWord.value)) {
          if (key == "priority" && dxWgFilteringWord.value[key]) {
            if (item[key] != dxWgFilteringWord.value[key]) {
              isJudge = false;
            }
          } else if (
            (key == "category_name" ||
              key == "draft_department_name" ||
              key == "support_department_name") &&
            dxWgFilteringWord.value[key].length > 0
          ) {
            for (const value of dxWgFilteringWord.value[key]) {
              if (item[key].includes(value)) {
                isJudge = true;
                break;
              }
              isJudge = false;
            }
          } else if (key == "id" && dxWgFilteringWord.value[key]) {
            if (Number(dxWgFilteringWord.value[key]) != Number(item[key])) {
              isJudge = false;
            }
          } else if (
            key == "registration_date" &&
            (startDate.value || endDate.value)
          ) {
            if (startDate.value && item[key] && endDate.value && item[key]) {
              if (
                Number(startDate.value.replaceAll("-", "")) >
                  Number(item[key].replaceAll("-", "")) ||
                Number(endDate.value.replaceAll("-", "")) <
                  Number(item[key].replaceAll("-", ""))
              ) {
                isJudge = false;
              }
            } else if (startDate.value && item[key]) {
              if (
                Number(startDate.value.replaceAll("-", "")) >
                Number(item[key].replaceAll("-", ""))
              ) {
                isJudge = false;
              }
            } else if (endDate.value && item[key]) {
              if (
                Number(endDate.value.replaceAll("-", "")) <
                Number(item[key].replaceAll("-", ""))
              ) {
                isJudge = false;
              }
            }
          } else if (
            dxWgFilteringWord.value[key] &&
            dxWgFilteringWord.value[key] != "--"
          ) {
            if (!item[key]) {
              isJudge = false;
              continue;
            }
            if (
              typeof dxWgFilteringWord.value[key] == "string" &&
              !item[key].includes(dxWgFilteringWord.value[key])
            ) {
              isJudge = false;
            }
          }
          if (!isJudge) {
            break;
          }
        }
        if (isJudge) {
          showDxWgs.value.push(item);
        }
      }
    } else {
      for (const item of dxWgs.value) {
        isJudge = false;
        if (new Date(item.registration_date) > new Date(referenceDate.value)) {
          continue;
        }
        for (const key of Object.keys(item)) {
          if (
            typeof item[key] === "string" &&
            item[key].includes(searchDxWgWord.value)
          ) {
            showDxWgs.value.push(item);
            break;
          } else if (
            key == "category_name" ||
            key == "draft_department_name" ||
            key == "support_department_name"
          ) {
            for (const value of item[key]) {
              if (value.includes(searchDxWgWord.value)) {
                showDxWgs.value.push(item);
                isJudge = true;
                break;
              }
            }
            if (isJudge) {
              break;
            }
          } else if (key == "id" && item[key] == searchDxWgWord.value) {
            showDxWgs.value.push(item);
            continue;
          }
        }
      }
    }
  };

  // コメントを追加
  const addDxWgComment = async (comment) => {
    if (comment == "") {
      return;
    }
    let commentArr = comment.split("");
    for (let i = 0; i < commentArr.length; i++) {
      if (commentArr[i] !== " " && commentArr[i] !== "　") {
        dxWg.value.comment.unshift(comment);
        if (!dxWg.value.id) {
          return;
        }
        await axios.put(dxWgBASE_URL + "/changeComment", dxWg.value);
        break;
      }
    }
  };
  // コメントを削除
  const deleteDxWgComment = async (commentIndex) => {
    dxWg.value.comment.splice(commentIndex, 1);
    if (!dxWg.value.id) {
      return;
    }
    await axios.put(dxWgBASE_URL + "/changeComment", dxWg.value);
  };

  // DxWgExcel出力
  const createDxWgExcel = async () => {
    // Excelの作成
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("一覧");
    const worksheet = workbook.getWorksheet("一覧");
    // 列の定義
    worksheet.columns = [
      { header: "NO", key: "id" },
      { header: "カテゴリー", key: "category_name" },
      { header: "課題内容", key: "draft_content" },
      { header: "課題提起事業部", key: "draft_business_sector" },
      { header: "課題提起部署", key: "draft_department_name" },
      { header: "優先", key: "priority" },
      { header: "状況", key: "state_name" },
      { header: "課題対応部署", key: "support_department_name" },
      { header: "課題対応者", key: "staff" },
      { header: "対応内容", key: "support_content" },
      { header: "対応期限", key: "deadline" },
      { header: "1Q", key: "one_q_progress" },
      { header: "2Q", key: "two_q_progress" },
      { header: "3Q", key: "three_q_progress" },
      { header: "4Q", key: "four_q_progress" },
      { header: "結果", key: "result" },
      { header: "効果", key: "effect_name" },
      { header: "効果コメント", key: "effect_comment" },
      { header: "更新日", key: "update_date" },
      { header: "更新日（対応）", key: "support_update_date" },
      { header: "更新日（効果）", key: "effect_update_date" },
      { header: "登録日", key: "registration_date" },
    ];
    // 行の定義
    for (let list of dxWgs.value) {
      worksheet.addRow({
        id: list.id,
        category_name: convertArrayToText(list.category_name),
        draft_content: list.draft_content,
        draft_business_sector_name: list.draft_business_sector,
        draft_department_name: convertArrayToText(list.draft_department_name),
        priority: list.priority,
        state_name: list.state_name,
        support_department_name: convertArrayToText(
          list.support_department_name
        ),
        staff: list.staff,
        support_content: list.support_content,
        deadline: list.deadline,
        one_q_progress: list.one_q_progress,
        two_q_progress: list.two_q_progress,
        three_q_progress: list.three_q_progress,
        four_q_progress: list.four_q_progress,
        result: list.result,
        effect_name: list.effect_name,
        effect_comment: list.effect_comment,
        update_date: list.update_date,
        support_update_date: list.support_update_date,
        effect_update_date: list.effect_update_date,
        registration_date: list.registration_date,
      });
    }

    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DXWG一覧.xlsx";
    a.click();
    a.remove();
  };
  // グラフを作成
  const createDxWgGraph = (chartId, tagId, legendPosition) => {
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
    // ラベルの色の流れを逆順に表示有無
    let reverseColor;

    // 選択された横軸ごとにグラフで使用するdatasetを作成
    if (dxVertical.value === "部門") {
      datasets = getGraphData("department");
    } else if (dxVertical.value === "支援ツール") {
      datasets = getGraphData("support_tool");
    } else if (dxVertical.value === "状況") {
      datasets = getGraphData("state");
    } else if (dxVertical.value === "効果") {
      datasets = getGraphData("effect");
    } else if (dxVertical.value === "業界") {
      datasets = getGraphData("industry");
    } else if (dxVertical.value === "技術") {
      datasets = getTechnologyGraphData("technology");
    }
    chartTitle.value = dxVertical.value;

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
    if (dxChart.value === "棒グラフ") {
      chart = "bar";
      scales.yAxes[0].display = true;
    } else if (dxChart.value === "円グラフ") {
      chart = "doughnut";
      scales.xAxes[0].display = false;
    } else if (dxChart.value === "レーダーチャート") {
      chart = "radar";
      scales.xAxes[0].display = false;
      scales["gridLines"] = {
        // 補助線（目盛の線）
        display: true,
        color: "lime",
      };
    }

    if (switchDx.value) {
      reverseColor = false;
    } else {
      reverseColor = true;
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
            reverse: reverseColor,
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
  const getDepartmentDivisionFromDepartmentName = (departmentName) => {
    let division = null;
    for (let department of departments.value) {
      if (departmentName === department.name) {
        division = department.division;
        break;
      }
    }
    return division;
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
  const loadDepartmentsForGanttChart = () => {
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
        isShowedDepartmentLength.value -= 1;
      }
    }
    departmentsForInput.value.unshift("New");
  };
  // 部署一覧のパスワード格納
  const password = ref("");
  // パスワード入力間違いのメッセージを格納
  const message = ref("");
  // パスワード入力モーダルの開閉
  const showUnlockModal = ref(false);
  // パスワードが正しいか確認
  const unlockDepartmentChangeAuthority = () => {
    axios.get("./json/administratorInfo.json").then((res) => {
      if (res.data.password === password.value) {
        departmentsPermission.value = true;
        router.push("/department");
        showUnlockModal.value = false;
      } else {
        message.value = "パスワードが違います。";
      }
    });
  };
  // 選択された部門の変更前の区分コードを格納。選択された部門の子も変更後の区分コードにする際に使用
  const previousDepartmentDivision = ref(null);
  // 部署更新
  const updateDepartment = async () => {
    previousDepartmentDivision.value = selectedDepartment.value.division;
    if (selectedDepartment.value.parentDepartment === "New") {
      await axios.get(departmentsBASE_URL + "/maxDivision").then((res) => {
        selectedDepartment.value.division = Number(res.data[0].maxdivision) + 1;
      });
      await axios.put(departmentsBASE_URL, selectedDepartment.value);
    } else {
      selectedDepartment.value.division =
        getDepartmentDivisionFromDepartmentName(
          selectedDepartment.value.parentDepartment
        );
      await axios.put(departmentsBASE_URL, selectedDepartment.value);
    }
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
      selectedDepartment.value.division =
        getDepartmentDivisionFromDepartmentName(
          selectedDepartment.value.parentDepartment
        );
      await axios.post(departmentsBASE_URL, selectedDepartment.value);
      for (let department of departments.value.concat()) {
        if (
          selectedDepartment.value.division === department.division &&
          new Date(department.to) >= new Date(selectedDepartment.value.to)
        ) {
          let dateObject = new Date(selectedDepartment.value.from);
          dateObject.setDate(dateObject.getDate() - 1);
          let year = dateObject.getFullYear();
          let month = String(dateObject.getMonth() + 1).padStart(2, "0");
          let day = String(dateObject.getDate()).padStart(2, "0");
          let dateString = `${year}-${month}-${day}`;
          department.to = dateString;
          axios.put(departmentsBASE_URL, department);
          break;
        }
      }
    }
  };

  // 部門区分を変更（順序変更）
  const changeDepartmentDivision = () => {
    if (startingDepartment.value === destinationDepartment.value) {
      return;
    }
    let startingDivision = Number(
      getDepartmentDivisionFromDepartmentName(startingDepartment.value)
    );
    let destinationDivision = Number(
      getDepartmentDivisionFromDepartmentName(destinationDepartment.value)
    );

    const sortedDepartment = [];

    if (startingDivision > destinationDivision) {
      for (const department of departments.value) {
        if (Number(department.division) === Number(startingDivision)) {
          department.division = Number(destinationDivision);

          for (let i = 0; i < sortedDepartment.length; ++i) {
            if (Number(sortedDepartment[i].division) > department.division) {
              sortedDepartment.splice(i, 0, department);
              break;
            }
          }
        } else if (Number(department.division) >= Number(destinationDivision)) {
          department.division = Number(department.division) + 1;
          sortedDepartment.push(department);
        } else {
          sortedDepartment.push(department);
        }
      }
    } else {
      for (const department of departments.value) {
        if (Number(department.division) === startingDivision) {
          department.division = destinationDivision;
          sortedDepartment.push(department);
        } else if (
          Number(department.division) >= startingDivision &&
          Number(department.division) <= destinationDivision
        ) {
          department.division = Number(department.division) - 1;
          for (let i = 0; i < sortedDepartment.length; ++i) {
            if (Number(sortedDepartment[i].division) > department.division) {
              sortedDepartment.splice(i, 0, department);
              break;
            }
          }
        } else {
          sortedDepartment.push(department);
        }
      }
    }

    departments.value = sortedDepartment;

    loadDepartmentsForGanttChart();
  };
  // 全ての部署を更新
  const confirmDepartmentDivision = () => {
    for (const department of departments.value) {
      axios.put(departmentsBASE_URL, department);
    }
  };

  // 社内DXの効果一覧取得
  const getInsideDxEffect = async () => {
    await axios.get("./json/insideDxEffect.json").then((res) => {
      insideDxEffect.value = res.data;
    });
  };

  // 社外DXの状況一覧取得
  const getOutsideDxIndustry = async () => {
    await axios.get("./json/outsideDxIndustry.json").then((res) => {
      outsideDxIndustry.value = res.data;
    });
  };

  // 社内DXの状況一覧取得
  const getInsideDxState = async () => {
    await axios.get("./json/insideDxState.json").then((res) => {
      insideDxState.value = res.data;
    });
  };

  // 社外DXの状況一覧取得
  const getOutsideDxState = async () => {
    await axios.get("/json/outsideDxState.json").then((res) => {
      outsideDxState.value = res.data;
    });
  };

  // 社外DXの技術一覧取得
  const getOutsideDxTechnology = async () => {
    await axios.get("./json/outsideDxTechnology.json").then((res) => {
      outsideDxTechnology.value = res.data;
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
            new Date(latestDepartment.to) < new Date(item.to) &&
            new Date(item.to) >= new Date(referenceDate.value)
          ) {
            latestDepartment = item;
            break;
          } else if (
            foundDepartment.division === item.division &&
            new Date(latestDepartment.to) < new Date(item.to)
          ) {
            latestDepartment = item;
          }
        }
        changedDepartment = latestDepartment;
      }
      return changedDepartment ? changedDepartment.name : "";
    } else {
      return "";
    }
  };

  // 社内DXの効果Idを効果名に変換
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

  // 社内DXの状況Idを状況名に変換
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

  // 社外DXの状況IDを状況名に変換
  const changeOutsideDxState = (state) => {
    state = Number(state);
    if (state) {
      const changedState = outsideDxState.value.find(
        (item) => Number(item.id) === state
      );
      return changedState ? changedState.state : "";
    } else {
      return "";
    }
  };

  // 社外DXの業界IDを行解明に変換
  const changeOutsideDxIndustry = (industry) => {
    industry = Number(industry);
    if (industry) {
      const changedIndustry = outsideDxIndustry.value.find(
        (item) => Number(item.id) === industry
      );
      return changedIndustry ? changedIndustry.industry : "";
    } else {
      return "";
    }
  };

  // 社外DXの技術IDを技術名に変換
  const changeOutsideDxTechnology = (technology) => {
    technology = Number(technology);
    if (technology) {
      const changedTechnology = outsideDxTechnology.value.find(
        (item) => Number(item.id) === technology
      );
      return changedTechnology ? changedTechnology.technology : "";
    } else {
      return "";
    }
  };

  // 社外DXの技術を配列形式から文字列に変換
  const showOutsideDxTechnology = (Technologies) => {
    let changedTechnology = null;
    if (Technologies) {
      for (const technology of Technologies) {
        if (changedTechnology) {
          changedTechnology = changedTechnology + "、" + technology;
        } else {
          changedTechnology = technology;
        }
      }
    }
    return changedTechnology;
  };

  // グラフの縦軸の要素
  const insideDxHorizontal = ref("レコード数");
  const insideDxHorizontalList = ref(["レコード数"]);

  // グラフの横軸の要素
  const dxVertical = ref("部門");
  const insideDxVerticalList = ref(["部門", "支援ツール", "状況", "効果"]);
  const outsideDxVerticalList = ref(["部門", "業界", "状況", "技術"]);
  const dxWgVerticalList = ref([
    "課題提案部門",
    "課題対応部門",
    "カテゴリ",
    "DXWG状況",
    "DXWG効果",
  ]);

  // グラフ種類
  const dxChart = ref("棒グラフ");
  const dxChartList = ref(["円グラフ", "棒グラフ"]);

  // 単一のDXの初期値を設定
  const resetDxItem = () => {
    dxItem.value = {
      id: null,
      division: null,
      registration_date: null,
      update_date: null,
      changer: null,
      department: "--",
      work: null,
      support_tool: null,
      state: "--",
      staff: null,
      expected_effect: null,
      effect: "--",
      product: null,
      industry: "--",
      technology: [],
      technical_details: null,
      customer: null,
      cooperation_destination: null,
      sales_strategy: null,
      note: null,
      attached_file: [],
      comment: [],
    };
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
          .post(dxBASE_URL + `/upload`, formData, {
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
      editDxItem.value.attached_file.push(...attachedFiles);
    }
  };

  // 添付ファイルを削除
  const deleteFile = async (fileIndex) => {
    const file = dxItem.value.attached_file.splice(fileIndex, 1);
    await axios.put(dxBASE_URL + "/deleteFile", {
      item: dxItem.value,
      file: file[0],
    });
  };

  // 部署名、状況名、効果名をidに変換
  const itemNumberConversion = async () => {
    editDxItem.value.division = switchDx.value ? true : false;
    for (let item of await departments.value) {
      if (item.name === editDxItem.value.department) {
        editDxItem.value.department = item.id;
        break;
      }
    }
    if (editDxItem.value.effect) {
      for (let item of await insideDxEffect.value) {
        if (item.effect === editDxItem.value.effect) {
          editDxItem.value.effect = item.id;
          break;
        }
      }
    }
    const selectedStateList = switchDx.value
      ? insideDxState.value
      : outsideDxState.value;
    for (let item of await selectedStateList) {
      if (item.state === editDxItem.value.state) {
        editDxItem.value.state = item.id;
        break;
      }
    }

    if (editDxItem.value.technology.length > 0) {
      editDxItem.value.technology = editDxItem.value.technology.concat();
      for (let i = 0; i < editDxItem.value.technology.length; i++) {
        for (let item of await outsideDxTechnology.value) {
          if (item.technology === editDxItem.value.technology[i]) {
            editDxItem.value.technology[i] = item.id;
            break;
          }
        }
      }
    }

    if (editDxItem.value.industry) {
      for (let item of await outsideDxIndustry.value) {
        if (item.industry === editDxItem.value.industry) {
          editDxItem.value.industry = item.id;
          break;
        }
      }
    }
  };

  // 新しいDXをデータベースに格納
  const addInsideDxList = async () => {
    dxItem.value.registration_date = date;
    dxItem.value.update_date = date;
    editDxItem.value = Object.assign({}, dxItem.value);
    await itemNumberConversion();
    await postFiles();
    await axios.post(dxBASE_URL, editDxItem.value);
  };
  // 変更したDXをデータベースに格納
  const changeInsideDxList = async () => {
    if (!dxItem.value.id) {
      return;
    }
    dxItem.value.update_date = date;
    editDxItem.value = Object.assign({}, dxItem.value);
    await itemNumberConversion();
    await postFiles();
    axios.put(dxBASE_URL, editDxItem.value);
  };
  // 指定したDXを削除
  const deleteInsideDxList = (id) => {
    if (!dxItem.value.id) {
      return;
    }
    let data = [];
    for (let [index, item] of showDxLists.value.entries()) {
      if (item.id === Number(id)) {
        data = showDxLists.value.splice(index, 1);
        break;
      }
    }
    for (let [index, item] of insideDxLists.value.entries()) {
      if (item.id === Number(id)) {
        data = insideDxLists.value.splice(index, 1);
        break;
      }
    }
    for (let [index, item] of outsideDxLists.value.entries()) {
      if (item.id === Number(id)) {
        data = outsideDxLists.value.splice(index, 1);
        break;
      }
    }
    axios.delete(`${dxBASE_URL}/${id}`);
    if (data[0].attached_file.length > 0) {
      for (const file of data[0].attached_file) {
        axios.put(dxBASE_URL + "/deleteFile", {
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
        dxItem.value.comment.unshift(comment);
        if (!dxItem.value.id) {
          return;
        }
        await axios.put(dxBASE_URL + "/changeComment", dxItem.value);
        break;
      }
    }
  };
  // コメントを削除
  const deleteComment = async (commentIndex) => {
    dxItem.value.comment.splice(commentIndex, 1);
    if (!dxItem.value.id) {
      return;
    }
    await axios.put(dxBASE_URL + "/changeComment", dxItem.value);
  };

  // エクセル化--------------------------------------------
  const createExcel = async () => {
    let lists = [];
    await axios.get(`${dxBASE_URL}?key=id&sequence=asc`).then((res) => {
      lists = res.data;
    });

    // Excelの作成
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("一覧");
    const worksheet = workbook.getWorksheet("一覧");

    // 列の定義
    if (switchDx.value) {
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
        if (list.division) {
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
      }
    } else {
      worksheet.columns = [
        { header: "部門", key: "department" },
        { header: "更新者", key: "changer" },
        { header: "製品・サービス名", key: "product" },
        { header: "技術", key: "technology" },
        { header: "技術詳細", key: "technical_details" },
        { header: "業界", key: "industry" },
        { header: "顧客", key: "customer" },
        { header: "連携先", key: "cooperation_destination" },
        { header: "販売戦略", key: "sales_strategy" },
        { header: "状況", key: "state" },
        { header: "備考", key: "note" },
        { header: "登録日", key: "date" },
      ];
      for (let list of lists) {
        if (!list.division) {
          for (let i = 0; i < list.technology.length; i++) {
            list.technology[i] = changeOutsideDxTechnology(list.technology[i]);
          }
          worksheet.addRow({
            department: changeDepartment(list.department),
            changer: list.changer,
            product: list.product,
            technology: showOutsideDxTechnology(list.technology),
            technical_details: list.technical_details,
            industry: changeOutsideDxIndustry(list.industry),
            customer: list.customer,
            cooperation_destination: list.cooperation_destination,
            sales_strategy: list.sales_strategy,
            state: changeOutsideDxState(list.state),
            note: list.note,
            date: list.registration_date,
          });
        }
      }
    }

    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = switchDx.value ? "社内DX一覧.xlsx" : "社外DX一覧.xlsx";
    a.click();
    a.remove();
  };

  // 画面の高さに応じてテーブルの高さ変更
  const tableHeightAdjustment = () => {
    let windowHeight = window.innerHeight;
    let tableHeight = Math.round(windowHeight / 1.6);
    return tableHeight;
  };

  // 画面の幅に応じてテーブルの幅変更
  const tableWidthAdjustment = () => {
    let windowWidth = window.innerWidth;
    let tableWidth = Math.round(windowWidth * 0.8);
    return tableWidth;
  };

  // 詳細検索
  const filteringTargetColumn = ref("部門");
  const filteringWord = ref("");
  // tureの時に部分一致、falseの時に完全一致
  const switchSearchMethod = ref(true);
  const insideDxColumnList = {
    部門: "department",
    担当: "staff",
    業務: "work",
    支援ツール: "support_tool",
    期待される効果: "expected_effect",
    効果: "effect",
    状況: "state",
    登録日: "registration_date",
  };
  const outsideDxColumnList = {
    部門: "department",
    業界: "industry",
    "製品・サービス名": "product",
    技術: "technology",
    技術詳細: "technical_details",
    状況: "state",
    顧客: "customer",
    登録日: "registration_date",
  };
  // 詳細検索がされているか有無
  const isDetailedFilter = ref(false);
  // 詳細検索かキーワード検索がされているか有無
  const isSearched = ref(false);

  // 検索 --------------------------------------------------
  // キーワード検索の変数
  const searchWord = ref("");
  const resetSearchValue = () => {
    isDetailedFilter.value = false;
    isSearched.value = false;
    startDate.value = null;
    endDate.value = null;
    filteringWord.value = null;
    searchWord.value = null;
  };
  const search = () => {
    showDxLists.value = [];
    let selectedDxLists = [];
    let selectedColumnList = {};
    if (switchDx.value) {
      selectedDxLists = insideDxLists.value.concat();
      selectedColumnList = insideDxColumnList;
    } else {
      selectedDxLists = outsideDxLists.value.concat();
      selectedColumnList = outsideDxColumnList;
    }
    if (isSearched.value) {
      if (searchWord.value) {
        for (let list of selectedDxLists) {
          if (
            new Date(list.registration_date) > new Date(referenceDate.value)
          ) {
            continue;
          }
          for (let item in list) {
            if (
              String(list[item])
                .toLowerCase()
                .includes(String(searchWord.value).toLowerCase())
            ) {
              showDxLists.value.push(list);
              break;
            }
          }
        }
      } else {
        if (isDetailedFilter.value) {
          if (!filteringWord.value) {
            isDetailedFilter.value = false;
            return search();
          }
          for (const list of selectedDxLists) {
            if (
              new Date(list.registration_date) > new Date(referenceDate.value)
            ) {
              continue;
            }
            // 部分一致の時
            if (switchSearchMethod.value) {
              if (
                String(list[selectedColumnList[filteringTargetColumn.value]])
                  .toLowerCase()
                  .includes(String(filteringWord.value).toLowerCase())
              ) {
                showDxLists.value.push(list);
              }
              // 完全一致の時
            } else {
              if (
                list[selectedColumnList[filteringTargetColumn.value]] ===
                filteringWord.value
              ) {
                showDxLists.value.push(list);
              }
            }
          }
        } else if (startDate.value && endDate.value) {
          for (const list of selectedDxLists) {
            if (
              new Date(list.registration_date) > new Date(referenceDate.value)
            ) {
              continue;
            }
            if (
              new Date(startDate.value) <= new Date(list.registration_date) &&
              new Date(endDate.value) >= new Date(list.registration_date)
            ) {
              showDxLists.value.push(list);
            }
          }
        }
      }
    } else {
      for (let list of selectedDxLists) {
        if (new Date(list.registration_date) > new Date(referenceDate.value)) {
          continue;
        }
        showDxLists.value.push(list);
      }
    }
    if (document.getElementById("chart")) {
      createGraph(1, "chart", "top");
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
    業界: "industry",
    "製品・サービス名": "product",
    技術: "technology",
    技術詳細: "technical_details",
    顧客: "customer",
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

  // 指定した条件で値をDBから取得
  const getSortInsideDxLists = async () => {
    let url = "";
    insideDxLists.value = [];
    outsideDxLists.value = [];
    url = `${dxBASE_URL}?key=${keyTranslationTable[sortValue.value]}&sequence=${
      sequenceTable[sequence.value]
    }`;
    isSearchDate.value = false;
    await axios.get(url).then((res) => {
      for (const data of res.data) {
        data.department = changeDepartment(data.department);
        if (data.division) {
          data.effect = changeEffect(data.effect);
          data.state = changeState(data.state);
          insideDxLists.value.push(data);
        } else {
          data.industry = changeOutsideDxIndustry(data.industry);
          data.state = changeOutsideDxState(data.state);
          for (let i = 0; i < data.technology.length; i++) {
            data.technology[i] = changeOutsideDxTechnology(data.technology[i]);
          }
          outsideDxLists.value.push(data);
        }
      }
      search();
    });
  };

  // 集計 --------------------------------------------------
  // 集計用の状況一覧のオブジェクトを作成
  const createInsideDxStateObject = () => {
    let dxStateObject = {};
    let selectedDxState = [];
    if (switchDx.value) {
      selectedDxState = insideDxState.value;
    } else {
      selectedDxState = outsideDxState.value;
    }
    for (let item of selectedDxState) {
      if (Number(item.id) === 1) {
        continue;
      }
      dxStateObject[Number(item.id)] = 0;
    }
    return dxStateObject;
  };
  // 状況・部署別の集計表を作成
  const getStateId = (state) => {
    let selectedDxState = [];
    if (switchDx.value) {
      selectedDxState = insideDxState.value;
    } else {
      selectedDxState = outsideDxState.value;
    }
    for (let item of selectedDxState) {
      if (item.state === state) {
        return item.id;
      }
    }
  };
  // 集計表を作成
  const calculationStateTotalization = () => {
    let beDepartment = false;
    let stateId = "";
    const stateTotalizationLists = [];
    stateTotalizationLists.push({
      合計: createInsideDxStateObject(),
    });
    stateTotalizationLists[0]["合計"]["合計"] = 0;
    for (const dxList of showDxLists.value) {
      beDepartment = false;
      stateId = getStateId(dxList.state);
      for (const stateTotalizationList of stateTotalizationLists) {
        if (stateTotalizationList[dxList.department]) {
          beDepartment = true;
          break;
        }
      }
      if (beDepartment) {
        for (let stateTotalizationList of stateTotalizationLists) {
          if (stateTotalizationList[dxList.department]) {
            stateTotalizationList[dxList.department][stateId] += 1;
            stateTotalizationList[dxList.department]["合計"] += 1;

            stateTotalizationLists[0]["合計"][stateId] += 1;
            stateTotalizationLists[0]["合計"]["合計"] += 1;
          }
        }
      } else {
        let department = dxList.department;
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
  // 文字を縦文字にする。未使用
  const stringToVertically = (word) => {
    let wordLength = word.length;
    let verticallyWord = "";
    for (let i = 0; i < wordLength; i++) {
      verticallyWord = verticallyWord + word.charAt(i) + "\n";
    }
    return verticallyWord;
  };

  // グラフデータを作成
  const getGraphData = (dxLists, keyName) => {
    let lists = [];
    let beList = false;
    for (const dxList of dxLists) {
      beList = false;
      for (const list of lists) {
        if (list[dxList[keyName]]) {
          list[dxList[keyName]] += 1;
          beList = true;
          continue;
        }
      }
      if (!beList) {
        lists.push({ [dxList[keyName]]: 1 });
      }
    }
    return lists;
  };

  // 技術のグラフデータを作成
  const getGraphSomeData = (dxLists, keyName) => {
    let lists = [];
    let beList = false;
    for (const dxList of dxLists) {
      for (const item of dxList[keyName]) {
        beList = false;
        for (const list of lists) {
          if (list[item]) {
            list[item] += 1;
            beList = true;
            break;
          }
        }
        if (!beList) {
          lists.push({ [item]: 1 });
        }
      }
    }
    return lists;
  };

  let chart1Instance;
  let chart2Instance;
  let chart3Instance;

  // グラフのタイトル
  let chartTitle = ref("");

  // グラフを作成
  const createGraph = (
    chartId,
    tagId,
    legendPosition,
    graphColor = "tableau.Classic20"
  ) => {
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
    // ラベルの色の流れを逆順に表示有無
    let reverseColor;

    // 選択された横軸ごとにグラフで使用するdatasetを作成
    if (dxVertical.value === "部門") {
      datasets = getGraphData(showDxLists.value, "department");
    } else if (dxVertical.value === "支援ツール") {
      datasets = getGraphData(showDxLists.value, "support_tool");
    } else if (dxVertical.value === "状況") {
      datasets = getGraphData(showDxLists.value, "state");
    } else if (dxVertical.value === "効果") {
      datasets = getGraphData(showDxLists.value, "effect");
    } else if (dxVertical.value === "業界") {
      datasets = getGraphData(showDxLists.value, "industry");
    } else if (dxVertical.value === "技術") {
      datasets = getGraphSomeData(showDxLists.value, "technology");
    } else if (dxVertical.value === "課題提案事業部") {
      datasets = getGraphData(showDxWgs.value, "draft_business_sector");
    } else if (dxVertical.value === "課題提案部門") {
      datasets = getGraphSomeData(showDxWgs.value, "draft_department_name");
    } else if (dxVertical.value === "課題対応部門") {
      datasets = getGraphSomeData(showDxWgs.value, "support_department_name");
    } else if (dxVertical.value === "カテゴリ") {
      datasets = getGraphSomeData(showDxWgs.value, "category_name");
    } else if (dxVertical.value === "DXWG状況") {
      datasets = getGraphData(showDxWgs.value, "state_name");
    } else if (dxVertical.value === "DXWG効果") {
      datasets = getGraphData(showDxWgs.value, "effect_name");
    }

    chartTitle.value = dxVertical.value;

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
    if (dxChart.value === "棒グラフ") {
      chart = "bar";
      scales.yAxes[0].display = true;
    } else if (dxChart.value === "円グラフ") {
      chart = "doughnut";
      scales.xAxes[0].display = false;
    } else if (dxChart.value === "レーダーチャート") {
      chart = "radar";
      scales.xAxes[0].display = false;
      scales["gridLines"] = {
        // 補助線（目盛の線）
        display: true,
        color: "lime",
      };
    }

    if (switchDx.value) {
      reverseColor = false;
    } else {
      reverseColor = true;
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
            borderColor: "white", // 棒の枠線の色
            borderWidth: 2, // 枠線の太さ
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
            scheme: graphColor,
            reverse: reverseColor,
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
    dxVertical.value = "部門";
    dxChart.value = "棒グラフ";
    createGraph(1, "departmentChart", "top");
    dxVertical.value = "状況";
    dxChart.value = "円グラフ";
    createGraph(3, "stateChart", "top");
    if (switchDx.value) {
      dxVertical.value = "効果";
      dxChart.value = "円グラフ";
      createGraph(2, "effectChart", "top");
    } else {
      dxVertical.value = "業界";
      dxChart.value = "円グラフ";
      createGraph(2, "effectChart", "top");
    }
  };

  // DXWGホーム画面で仕様するチャートを作成
  const dxWgHomeUseGraph = () => {
    dxVertical.value = "課題対応部門";
    dxChart.value = "棒グラフ";
    createGraph(1, "departmentChart", "top", "brewer.RdBu11");
    dxVertical.value = "DXWG状況";
    dxChart.value = "円グラフ";
    createGraph(2, "stateChart", "top", "brewer.RdBu11");
    dxVertical.value = "DXWG効果";
    dxChart.value = "円グラフ";
    createGraph(3, "effectChart", "top", "brewer.RdBu11");
  };

  return {
    switchDx,
    date,
    year,
    referenceDate,
    referenceMonth,
    dxItem,
    editDxItem,
    showDxLists,
    insideDxLists,
    departmentsForInput,
    departments,
    departmentsForGanttChart,
    departmentsPermission,
    showUnlockModal,
    password,
    message,
    startingDepartment,
    destinationDepartment,
    isShowedDepartmentLength,
    insideDxEffect,
    insideDxState,
    insideDxHorizontal,
    insideDxHorizontalList,
    dxVertical,
    insideDxVerticalList,
    outsideDxVerticalList,
    dxChart,
    dxChartList,
    searchWord,
    searchDxWgWord,
    sortValue,
    keyTranslationTable,
    sequence,
    sequenceTable,
    startDate,
    endDate,
    isSearchDate,
    isSearched,
    isDxWgSearched,
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
    switchSearchMethod,
    insideDxColumnList,
    outsideDxColumnList,
    isDetailedFilter,
    isDxWgDetailedFilter,
    isShowedAllDepartment,
    outsideDxLists,
    outsideDxIndustry,
    outsideDxState,
    outsideDxTechnology,
    showDxWgRegisterUnlockModal,
    dxWg,
    editDxWg,
    dxWgs,
    showDxWgs,
    showDxWgRegisterDialog,
    showDxWgDetailDialog,
    isDxWgRegisterAuthority,
    chartTitle,
    dxWgEffects,
    isCategoryRegistrationDialog,
    newCategory,
    dxWgCategories,
    selectedItem,
    puttedItem,
    dxWgStates,
    dxWgVerticalList,
    dxTitle,
    sortDxWgValue,
    dxWgSequence,
    dxWgFilteringWord,
    postCategory,
    getCategory,
    putCategory,
    sortCategory,
    getDxWg,
    searchDxWg,
    addDxWg,
    changeDxWg,
    deleteDxWg,
    resetDxWgItem,
    unlockDxWgRegisterAuthority,
    resetDxItem,
    addInsideDxList,
    changeInsideDxList,
    deleteInsideDxList,
    addComment,
    deleteComment,
    deleteFile,
    search,
    resetSearchValue,
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
    changeDepartmentDivision,
    confirmDepartmentDivision,
    unlockDepartmentChangeAuthority,
    getInsideDxEffect,
    getInsideDxState,
    changeDepartment,
    changeEffect,
    changeState,
    dxHomeUseGraph,
    itemNumberConversion,
    calculateFontSize,
    getLastDayOfMonth,
    getOutsideDxIndustry,
    getOutsideDxState,
    getOutsideDxTechnology,
    showOutsideDxTechnology,
    changeThemeColor,
    changeSwitchDx,
    createDxWgExcel,
    changeThemeColorForDxWg,
    getDxWgEffect,
    changeDxWgEffect,
    changeDxWgEffectName,
    changeDepartmentNames,
    getDxWgState,
    convertArrayToText,
    dxWgHomeUseGraph,
    addDxWgComment,
    deleteDxWgComment,
    sortDxWg,
    tableWidthAdjustment,
  };
});
