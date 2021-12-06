import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  name: string | null
}

export default new Vuex.Store<State>({
  state: {
    name: null
  },
  mutations: {
    setName(state, name: string) {
      state.name = name
    }
  },
  actions: {
    login({commit}, name: string) {
      commit('setName', name)
    }
  },
  getters: {
    name(state) {
      return state.name
    },
    loggedIn(state) {
      return state.name !== null
    }
  },
  modules: {}
})
