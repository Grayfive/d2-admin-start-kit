
const app = {
  state: {
    havLoading: true
  },
  mutations: {
    SET_HAV_LOADING: (state, havLoading) => {
      state.havLoading = havLoading
    }
  },
  actions: {
    setHavLoading ({ commit }, havLoading) {
      commit('SET_HAV_LOADING', havLoading)
    }
  }
}

export default app
