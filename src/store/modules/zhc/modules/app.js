
export default {
  namespaced: true,
  state: {
    hasBuild: false // 是否已经初始化
  },
  mutations: {
    BUILD (state, val) {
      state.hasBuild = val
    }
  },
  actions: {
    build (context) {
      context.commit('BUILD', true)
    }
  }
}
