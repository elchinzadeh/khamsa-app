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
            MissionStatus.CONTINUED,
        ].includes(state.status)) {
            if (payload <= 100) {
                commit('SET_MISSION_PROGRESS', payload);
            } else {
                commit('SET_MISSION_PROGRESS', 100);
            }
        }

        if (Math.round(payload) === 100) {
            commit('SET_MISSION_STATUS', MissionStatus.COMPLETED);
        }

        if ([
            MissionStatus.NOT_UPLOADED,
            MissionStatus.UPLOADED,
            MissionStatus.ABORTED,
        ].includes(state.status)) {
            commit('SET_MISSION_PROGRESS', 0);
        }
    },
    setMissionStatus({ commit }, payload) {
        console.log(payload);
        commit('SET_MISSION_STATUS', payload);

        if ([
            MissionStatus.NOT_UPLOADED,
            MissionStatus.UPLOADED,
            MissionStatus.ABORTED,
        ].includes(payload)) {
            commit('SET_MISSION_PROGRESS', 0);
        }

        if (MissionStatus.UPLOADED === payload) {
            commit('SET_MISSION_UPLOADED', true);
        }
    },
};

export default {
    state,
    mutations,
    actions,
};
