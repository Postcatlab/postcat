import { createRouter, createWebHistory } from "vue-router";

const PluginList = () => import("./components/PluginList.vue");
const PluginDetail = () => import("./components/PluginDetail.vue");

const routes = [
  { path: "/", name: "pluginList", component: PluginList },
  { path: "/plugin-detail", name: "pluginDetail", component: PluginDetail }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
