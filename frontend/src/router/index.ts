import Vue from "vue";
import VueRouter, {Route as BaseRoute, RouteConfig} from "vue-router";
import MainContent from "@/views/MainContent.vue";
import Login from "@/views/Login.vue";
import CTFListing from "@/views/CTFListing.vue";
import Contact from "@/views/Contact.vue";
import NewPost from "@/views/NewPost.vue";
import ChallengeListing from "@/views/ChallengeListing.vue";
import WriteupDisplay from "@/views/WriteupDisplay.vue";
import NewChallenge from "@/views/NewChallenge.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: MainContent,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/ctfs",
    name: "CTFs",
    component: CTFListing,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/new-post",
    name: "New Post",
    component: NewPost,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/ctfs/:id",
    name: "CTF",
    component: ChallengeListing,
    meta: {
      show: false,
    },
  },
  // TODO: Refactor path?
  {
    path: "/writeups/:eventID/:challengeID/:writeupID",
    name: "View writeup",
    component: WriteupDisplay,
    meta: {
      show: false,
    },
  },
  {
    path: "/ctfs/:eventID/challenges/:challengeID/writeup/new",
    name: "Create writeup",
    component: WriteupDisplay,
    meta: {
      show: false,
    },
  },
  {
    path: "/ctfs/:eventID/challenges/new",
    name: "Create challenge",
    component: NewChallenge,
    meta: {
      show: false,
    },
  },
];

const router = new VueRouter({
  routes,
});


export interface Route extends BaseRoute {
  requiresAuth?: boolean
}

export default router;
