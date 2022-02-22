import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {Category} from "@/types/posts/category";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});


export interface State {
  name: string | null,
  darkMode: boolean,
  categories: Category[]
}


export default new Vuex.Store<State>({
  state: {
    name: null,
    darkMode: false,
    categories: [],
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
  },
  actions: {
    login({commit}, name: string) {
      commit("setName", name);
    },
    toggleDarkMode({commit}) {
      commit("setDarkMode", !this.state.darkMode);
    },
    setCategories({commit}, categories: Category[]) {
      commit("setCategories", categories);
    },
    logout({commit}) {
      commit("setName", null);
    },
  },
  getters: {
    name(state) {
      return state.name;
    },
    loggedIn(state) {
      return state.name !== null;
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
