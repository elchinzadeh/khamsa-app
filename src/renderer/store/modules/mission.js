const state = {
    progress: 0,
    uploaded: false,
    status: false,
};

const mutations = {
    SET_MISSION_PROGRESS(state, value) {
        state.progress = Number(value);
    },
    SET_MISSION_UPLOADED(state, value) {
        state.uploaded = Boolean(value);
    },
    SET_MISSION_STATUS(state, value) {
        state.status = value;
    },
};

const actions = {
    setMissionProgress({ commit }, payload) {
        commit('SET_MISSION_PROGRESS', payload);
    },
    setMissionUploaded({ commit }, payload) {
        commit('SET_MISSION_UPLOADED', payload);
    },
};

export default {
    state,
    mutations,
    actions,
};
