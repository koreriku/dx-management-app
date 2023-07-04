import { createRouter, createWebHistory } from "vue-router";
import dxHome from "../components/dxHome.vue";
import dx from "../components/dx.vue";
import department from "../components/parts/gantt_chart.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: dxHome,
  },
  {
    path: "/dx",
    name: "dx",
    component: dx,
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
