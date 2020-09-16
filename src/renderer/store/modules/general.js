const state = { isLive: false };

const mutations = {
    SET_IS_LIVE(state, value) {
        state.isLive = Boolean(value);
    },
};

const actions = {
    setIsLive({ commit }, payload) {
        commit('SET_IS_LIVE', payload);
    },
};

export default {
    state,
    mutations,
    actions,
};
