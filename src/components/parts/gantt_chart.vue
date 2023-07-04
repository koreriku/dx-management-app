<script setup>
import { ref, computed, onBeforeMount } from "vue";
// momentがメンテナンスモード二なったのでdayjs
import dayjs from "dayjs";
import { useDxStore } from "../../stores/dxManagement";
import { useTheme } from "vuetify";
import departmentDialog from "./dialog.vue";
import Button from "./button.vue";

const theme = useTheme();
const now = dayjs();
const start = ref("2021");
// 今年の12月まで
const end = ref(dayjs(`${now.year() + 1}-12-31`));
const year_end = ref(dayjs(`${now.add(1, "year").year()}-12-31`));
const block_size = ref(30);
const calendars = ref([]);
const store = useDxStore();

// 年ごとの月数を取得
const getMonths = (year, block_number) => {
  const months = ref([]);
  let date = dayjs(`${year}-01-01`);
  for (let i = 0; i < 12; i++) {
    months.value.push({
      month: date.month() + 1,
      block_number,
    });
    date = date.add(1, "month");
    block_number++;
  }
  return months;
};

// カレンダー領域展開用
const getCalender = () => {
  let block_number = 0;
  let months;
  let start_year = dayjs(start.value);
  let end_year = dayjs(year_end.value);
  // 差分を年単位で行う
  let between_year = end_year.diff(start_year, "years");

  // start_monthの年と月格納用
  const year = ref();

  // start・endの間の月数の格納
  for (let i = 0; i <= between_year; i++) {
    year.value = start_year.year();

    // 格納時はletなのでvalueはいらない
    months = getMonths(year.value, block_number);
    calendars.value.push({
      date: start_year.format("YYYY年"),
      start_block_number: block_number,
      days: months,
    });
    // 一年ずつ増やしていく
    start_year = start_year.add(1, "years");
    block_number = months.value[months.value.length - 1].block_number;
    block_number++;
  }
  return block_number;
};

// bar表示幅設定
const departmentBars = () => {
  let start_date = dayjs(start.value);
  let top = 10;
  let left;
  let between;
  let start_point;
  let style;

  let newList = [];
  for (let list of store.departmentsForGanttChart) {
    if (!list.isShowed) {
      continue;
    }
    style = {};
    let date_from = dayjs(list.from);
    let date_to;
    if (list.to === "9999-12-31") {
      if (dayjs(list.from) > dayjs(end.value)) {
        date_to = dayjs(year_end.value);
      } else {
        date_to = dayjs(end.value);
      }
    } else {
      date_to = dayjs(list.to);
    }
    between = date_to.diff(date_from, "months");
    between++;
    start_point = date_from.diff(start_date, "months");
    left = start_point * block_size.value;
    style = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${block_size.value * between}px`,
    };
    top = top + 40;
    newList.push({
      style,
      list,
    });
  }

  return newList;
};

// アイコン逆三角時の動作
const showHiddenDepartments = (division) => {
  for (const department of store.departmentsForGanttChart) {
    if (department.division === division) {
      if (department.isLatestDepartment) {
        department.isOpened = true;
      } else {
        if (!department.isShowed) {
          department.isShowed = true;
          store.isShowedDepartmentLength += 1;
        }
      }
    }
  }
};

// アイコン三角時の動作
const hideHiddenDepartments = (division) => {
  for (const department of store.departmentsForGanttChart) {
    if (department.division === division) {
      if (department.isLatestDepartment) {
        department.isOpened = false;
      } else {
        department.isShowed = false;
        store.isShowedDepartmentLength -= 1;
      }
    }
  }
};

// 初期化設定
const resetSelectedDepartment = () => {
  store.selectedDepartment = {
    id: null,
    name: null,
    division: null,
    form: null,
    to: "9999-12-31",
    isShowed: false,
    isOpened: false,
    isLatestDepartment: false,
    count: 1,
    parentDepartment: "New",
    cat: "department",
  };
};

onBeforeMount(() => {
  store.loadDepartmentsForGanttChart();
  getCalender();
});
const tableHeight = Math.floor(Number(window.innerHeight) * 0.82);

const searchDepartmentName = ref(null);
const searchDepartment = () => {
  if (searchDepartmentName.value) {
    store.isShowedDepartmentLength = 0;
    store.departmentsForGanttChart.map((department) => {
      if (
        String(department.name)
          .toLowerCase()
          .includes(String(searchDepartmentName.value).toLowerCase())
      ) {
        department.isShowed = true;
        store.isShowedDepartmentLength += 1;
      } else {
        department.isShowed = false;
      }
    });
  } else {
    store.loadDepartmentsForGanttChart();
  }
};
const showAllDepartment = () => {
  store.isShowedDepartmentLength = 0;
  store.departmentsForGanttChart.map((department) => {
    department.isShowed = true;
    department.isOpened = true;
    store.isShowedDepartmentLength += 1;
  });
};
</script>

<template>
  <div class="gantt-header">
    <h1 class="text-h5 mr-6">部門一覧</h1>
    <Button
      color="yellow"
      @click="
        store.showDepartmentDialog = true;
        resetSelectedDepartment();
        store.isEditedDepartment = false;
      "
      class="mr-4"
      icon
      ><v-icon>mdi-plus</v-icon>
      <v-tooltip activator="parent" location="bottom">新規登録</v-tooltip>
    </Button>
    <div style="width: 500px">
      <v-text-field
        label="部門検索"
        variant="outlined"
        density="compact"
        class="pt-5"
        v-model="searchDepartmentName"
        append-inner-icon="mdi-magnify"
        @keyup.enter="searchDepartment"
      ></v-text-field>
    </div>
  </div>
  <v-card>
    <v-card-item class="mb-n3">
      <v-table :height="tableHeight">
        <div
          class="gantt-content"
          :style="`width:${calendars.length * (block_size * 12)}px`"
        >
          <div class="gantt-task">
            <div class="gantt-task-title">
              <div class="department-title">
                部署名
                <v-badge
                  inline
                  v-if="!store.isShowedAllDepartment"
                  color="grey-lighten-2"
                  content="全表示"
                  style="cursor: pointer"
                  @click="
                    showAllDepartment();
                    store.isShowedAllDepartment = true;
                  "
                >
                </v-badge>
                <v-badge
                  inline
                  v-else
                  color="red"
                  style="cursor: pointer"
                  content="全表示"
                  @click="
                    store.loadDepartmentsForGanttChart();
                    store.isShowedAllDepartment = false;
                  "
                >
                </v-badge>
              </div>
            </div>
            <div id="gantt-task-list">
              <div
                v-for="(list, index) in store.departmentsForGanttChart"
                :key="index"
                class="gantt-task-list"
                :class="{
                  'bg-black': theme.global.name.value === 'dark',
                  'bg-white': theme.global.name.value === 'light',
                }"
                v-show="list.isShowed"
              >
                <div class="department-data">
                  <span v-if="list.name !== list.parentDepartment">　</span>
                  <span
                    @click="
                      store.showDepartmentDialog = true;
                      store.selectedDepartment = list;
                      store.previousDepartmentDivision = list.division;
                      store.isEditedDepartment = true;
                    "
                    class="tr-data"
                    >{{ list.name }}</span
                  >
                  <span
                    class="icon"
                    v-if="list.count > 1 && !list.isOpened"
                    @click="showHiddenDepartments(list.division)"
                    ><v-icon size="small" class="ml-2"
                      >mdi-triangle-down</v-icon
                    ></span
                  >
                  <span
                    v-else-if="list.count > 1 && list.isOpened"
                    @click="hideHiddenDepartments(list.division)"
                    ><v-icon size="small" class="ml-2"
                      >mdi-triangle</v-icon
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>

          <div id="gantt-calendar " ref="calendar">
            <div class="gantt-date">
              <div class="gantt-year">
                <div v-for="(calendar, index) in calendars" :key="index">
                  <div
                    class="year"
                    :style="`width:${12 * block_size}px;left:${
                      calendar.start_block_number * block_size
                    }px`"
                  >
                    {{ calendar.date }}
                  </div>
                </div>
              </div>
              <div class="gantt-month">
                <div v-for="(calendar, index) in calendars" :key="index">
                  <div v-for="(day, index) in calendar.days" :key="index">
                    <div
                      class="month"
                      :class="{
                        'bg-black': theme.global.name.value === 'dark',
                        'bg-white': theme.global.name.value === 'light',
                      }"
                      :style="`width:${block_size}px;left:${
                        day.block_number * block_size
                      }px`"
                    >
                      <span>{{ day.month }}</span>
                      <span>月</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="gantt-height">
                <div v-for="(calendar, index) in calendars" :key="index">
                  <div v-for="(day, index) in calendar.days" :key="index">
                    <div
                      class="height"
                      :style="`width:${block_size}px;left:${
                        day.block_number * block_size
                      }px;height:${store.isShowedDepartmentLength * 40}px`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="gantt-bar-area"
              :style="`width:${calendarViewWidth}px;`"
            >
              <div
                v-for="(bar, index) in departmentBars()"
                :key="index"
                v-show="bar.list.isShowed"
              >
                <div
                  :style="bar.style"
                  class="bar"
                  v-if="
                    bar.list.cat === 'department' &&
                    new Date(bar.list.to) >= new Date(store.referenceDate)
                  "
                >
                  <div class="bar-width"></div>
                </div>

                <div
                  :style="bar.style"
                  class="old-bar"
                  v-else-if="bar.list.cat === 'department'"
                >
                  <div class="bar-width"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-table>
    </v-card-item>
  </v-card>

  <departmentDialog></departmentDialog>
</template>

<style scoped>
.gantt-header {
  display: flex;
  padding: 1rem 1rem 0rem;
  align-items: center;
}
.gantt-content {
  display: flex;
  height: 100%;
}
.gantt-task {
  position: sticky;
  left: 0px;
  z-index: 50;
}
/* <div
          id="gantt-task-title"
          class="flex items-center bg-green-600 text-white h-20 sticky top-0"
          ref="department"
          style="width: 300px"
        > */
.gantt-task-title {
  display: flex;
  align-items: center;
  background-color: #3f51b5;
  color: #ffffff;
  position: sticky;
  top: 0px;
  height: 5rem;
  width: 300px;
  z-index: 50;
}
/* class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-3/4 h-full" */
.department-title {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #d3d3d3;
  line-height: 1rem;
  width: 100%;
  height: 100%;
}

/* class="flex h-10 border-b tr-data" */
.gantt-task-list {
  display: flex;
  height: 2.5rem;
  border-bottom: solid 1px #d3d3d3;
  border-left: solid 1px #d3d3d3;
}
/* class="border-r flex items-center justify-center w-3/4 text-sm" */
.department-data {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 1rem;
  border-right: solid 1px #d3d3d3;
  width: 100%;
  line-height: 1.25rem;
}
/* class="h-20 sticky top-0 z-40" */
.gantt-date {
  position: sticky;
  top: 0px;
  height: 5rem;
  z-index: 40;
}
/* class="relative h-8" */
.gantt-year {
  position: relative;
  height: 2rem;
}
/* <div
                class="bg-indigo-700 text-white border-b border-r border-t h-8 absolute font-bold text-sm flex items-center justify-center"
                :style="`width:${12 * block_size}px;left:${
                  calendar.start_block_number * block_size
                }px`"
              > */
.year {
  background-color: #808080;
  color: #ffffff;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  border-color: #d3d3d3;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-right: solid 1px;
  height: 100%;
  line-height: 1.25rem;
}
.gantt-month {
  position: relative;
  height: 3rem;
}
/* class="border-r border-b h-12 absolute flex items-center justify-center flex-col font-bold text-xs" */
.month {
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  justify-content: center;
  line-height: 1rem;
  height: 3rem;
  border-right: solid 1px #d3d3d3;
}
.gantt-height {
  position: relative;
}
/* class="border-r border-b absolute" */
.height {
  position: absolute;
  border-right: solid 1px #d3d3d3;
  border-bottom: solid 1px #d3d3d3;
  height: 100%;
}
/* class="relative z-20" */
.gantt-bar-area {
  position: relative;
}
/* class="rounded-lg absolute h-5 bg-indigo-300 bg-opacity-50 border-t z-30" */

.bar {
  position: absolute;
  background-color: #00bfff;
  opacity: 0.6;
  border-top-width: 1px;
  border-radius: 0.5rem;
  height: 1.25rem;
}
/* class="rounded-lg absolute h-5 bg-pink-300 bg-opacity-50 border-t z-30" */
.old-bar {
  position: absolute;
  background-color: #dc143c;
  opacity: 0.6;
  border-top-width: 1px;
  border-radius: 0.5rem;
  height: 1.25rem;
}
.bar-width {
  width: 100%;
  height: 100%;
}
.bg-black {
  background-color: black;
}
.bg-white {
  background-color: white;
}

.tr-data:hover {
  opacity: 0.7;
}
</style>
