const state = {
    points: [],
};

const mutations = {
    ADD_POINT(state, payload) {
        state.points.push({
            altitude: 0,
            command: "waypoint",
            delay: 0,
            ...payload,
        });
    },
    UPDATE_POINT(state, payload) {
        let point = state.points[payload.index];

        if (payload.altitude) {
            point.altitude = payload.altitude;
        }
        if (payload.coordinates) {
            point.coordinates = {
                ...point.coordinates,
                ...payload.coordinates,
            };
        }
        if (payload.delay) {
            point.delay = payload.delay;
        }
        if (payload.command) {
            point.command = payload.command;
        }

        state.points[payload.index] = point;
    },
    DELETE_POINT(state, index) {
        state.points.splice(index, 1);
    },
    DELETE_ALL_POINT(state) {
        state.points = [];
    },
};

const actions = {
    addPoint({ commit }, payload) {
        commit("ADD_POINT", payload);
    },
    updatePoint({ commit }, payload) {
        commit("UPDATE_POINT", payload);
    },
    deletePoint({ commit }, payload) {
        commit("DELETE_POINT", payload);
    },
    deleteAllPoints({ commit }) {
        commit("DELETE_ALL_POINT");
    },
};

export default {
    state,
    mutations,
    actions,
};
