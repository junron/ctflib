import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
})


export interface State {
  name: string | null,
  darkMode: boolean
}


export default new Vuex.Store<State>({
  state: {
    name: null,
    darkMode: false,
  },
  mutations: {
    setName(state, name: string) {
      state.name = name
    },
    setDarkMode(state, darkMode: boolean) {
      state.darkMode = darkMode
    },
  },
  actions: {
    login({commit}, name: string) {
      commit('setName', name)
    },
    toggleDarkMode({commit}) {
      commit('setDarkMode', !this.state.darkMode)
    },
    logout({commit}) {
      commit('setName', null)
    }
  },
  getters: {
    name(state) {
      return state.name
    },
    loggedIn(state) {
      return state.name !== null
    },
    darkMode(state) {
      return state.darkMode
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin]
})
