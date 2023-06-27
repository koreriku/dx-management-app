import { createRouter, createWebHistory } from "vue-router";
import dxHome from "../components/dxHome.vue";
import insideDx from "../components/insideDx.vue";
import department from "../components/parts/gantt_chart.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: dxHome,
  },
  {
    path: "/insideDx",
    name: "insideDx",
    component: insideDx,
  },
  {
    path: "/department",
    name: "department",
    component: department,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
