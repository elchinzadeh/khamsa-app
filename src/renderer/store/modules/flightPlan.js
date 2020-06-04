const state = {
    points: [],
    selectedPointIndex: null,
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
    DELETE_ALL_POINTS(state) {
        state.points = [];
    },
    SELECT_POINT(state, index) {
        state.selectedPointIndex = index;
    },
    REMOVE_SELECTED_POINT(state) {
        state.selectedPointIndex = null;
    },
};

const actions = {
    addPoint({ commit }, payload) {
        commit("ADD_POINT", payload);
        commit("REMOVE_SELECTED_POINT");
    },
    updatePoint({ commit }, payload) {
        commit("UPDATE_POINT", payload);
    },
    deletePoint({ commit }, payload) {
        commit("DELETE_POINT", payload);
        if (state.selectedPointIndex === payload) {
            commit("REMOVE_SELECTED_POINT");
        }
    },
    deleteAllPoints({ commit }) {
        commit("DELETE_ALL_POINTS");
        commit("REMOVE_SELECTED_POINT");
    },
    selectPoint({ commit }, payload) {
        commit("SELECT_POINT", payload);
    },
    removeSelectedPoint({ commit }) {
        commit("REMOVE_SELECTED_POINT");
    },
};

export default {
    state,
    mutations,
    actions,
};
