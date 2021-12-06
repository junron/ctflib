import Vue from "vue";
import VueRouter, {RouteConfig, Route as BaseRoute} from "vue-router";
import Home from "../views/Home.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});


export interface Route extends BaseRoute {
  requiresAuth?: boolean
}

export default router;
