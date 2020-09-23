const { stat } = require('fs');

const state = { progress: 0 };

const mutations = {
    SET_MISSION_PROGRESS(state, value) {
        state.progress = value;
    },
};

const actions = {
    setMissionProgress({ commit }, payload) {
        commit('SET_MISSION_PROGRESS', payload);
    },
};

export default {
    state,
    mutations,
    actions,
};
