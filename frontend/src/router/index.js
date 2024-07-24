import { createRouter, createWebHistory } from "vue-router";
import dxHome from "../components/dxHome.vue";
import dx from "../components/dx.vue";
import department from "../components/department.vue";
import manual from "../components/manual.vue";
import dxWg from "../components/dxWg.vue";

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
    path: "/dxWg",
    name: "dxWg",
    component: dxWg,
  },
  {
    path: "/department",
    name: "department",
    component: department,
  },
  {
    path: "/manual",
    name: "manual",
    component: manual,
  },
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHistory("DXHubTest"),
  routes,
});

export default router;
