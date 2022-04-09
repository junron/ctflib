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
import NewCTF from "@/views/NewCTF.vue";
import GuideDisplay from "@/views/GuideDisplay.vue";
import GuideEditor from "@/views/GuideEditor.vue";

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
      show: false,
    },
  },
  {
    path: "/edit-post",
    name: "Edit Post",
    component: NewPost,
    props: true,
    meta: {
      requiresAuth: true,
      show: false,
    },
  },
  {
    path: "/ctfs/new",
    name: "Create CTF",
    component: NewCTF,
    meta: {
      show: false,
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
  {
    path: "/ctfs/:eventID/challenges/edit",
    name: "Edit challenge",
    component: NewChallenge,
    props: true,
    meta: {
      show: false,
    },
  },
  {
    path: "/guides/new",
    name: "Create guide",
    component: GuideEditor,
    meta: {
      show: false,
    },
  },
  {
    path: "/guides/:id",
    name: "View guide",
    component: GuideDisplay,
    meta: {
      show: false,
    },
  },
  {
    path: "/guides/:id/edit",
    name: "Edit guide",
    component: GuideEditor,
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
