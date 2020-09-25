import { MissionStatus } from '../../core/enums';

const state = {
    progress: 0,
    uploaded: false,
    status: MissionStatus.NOT_UPLOADED,
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
    setMissionProgress({ state, commit }, payload) {
        if ([
            MissionStatus.STARTED,
            MissionStatus.PAUSED,
        ].includes(state.status) && payload < 100) {
            commit('SET_MISSION_PROGRESS', payload);
        }

        if (Math.round(payload) === 100) {
            commit('SET_MISSION_STATUS', MissionStatus.COMPLETED);
        }
    },
    setMissionUploaded({ commit }, payload) {
        commit('SET_MISSION_UPLOADED', payload);
    },
    setMissionStatus({ commit }, payload) {
        commit('SET_MISSION_STATUS', payload);

        if (payload === MissionStatus.ABORTED) {
            commit('SET_MISSION_PROGRESS', 0);
        }
    },
};

export default {
    state,
    mutations,
    actions,
};
