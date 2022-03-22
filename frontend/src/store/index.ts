import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {Category} from "@/types/category";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});


export interface State {
  name: string | null,
  darkMode: boolean,
  categories: Category[]
  anonymous: boolean
}


export default new Vuex.Store<State>({
  state: {
    name: null,
    darkMode: false,
    categories: [],
    anonymous: false,
  },
  mutations: {
    setName(state, name: string) {
      state.name = name;
    },
    setDarkMode(state, darkMode: boolean) {
      state.darkMode = darkMode;
    },
    setCategories(state, categories: Category[]) {
      state.categories = categories;
    },
    setAnonymous(state, anonymous: boolean) {
      state.anonymous = anonymous;
    },
  },
  actions: {
    login({commit}, name: string) {
      commit("setName", name);
      commit("setAnonymous", false);
    },
    loginAnonymously({commit}) {
      commit("setAnonymous", true);
      commit("setName", "Anonymous");
    },
    toggleDarkMode({commit}) {
      commit("setDarkMode", !this.state.darkMode);
    },
    setCategories({commit}, categories: Category[]) {
      commit("setCategories", categories);
    },
    logout({commit}) {
      commit("setName", null);
      commit("setAnonymous", false);
    },
  },
  getters: {
    name(state) {
      return state.name;
    },
    loggedIn(state) {
      return state.name !== null && !state.anonymous;
    },
    anonymous(state) {
      return state.anonymous;
    },
    loggedInOrAnonymous(state) {
      return state.name !== null || state.anonymous;
    },
    darkMode(state) {
      return state.darkMode;
    },
    categories(state) {
      return state.categories;
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
