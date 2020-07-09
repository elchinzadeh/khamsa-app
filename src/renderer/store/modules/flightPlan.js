import { Stats } from "fs";

const state = {
    points: [],
    selectedPointIndex: null,
    dronePath: {
        geoJsonSource: {
            type: "geojson",
            data: {
                id: "waypoints",
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            },
        },
        geoJsonLayer: {
            // More info: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
            type: "line",
            paint: {
                "line-color": "#0000ff",
                "line-width": 2,
            },
        },
    },
    missionUploaded: false,
    returnToLand: false
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
        const data = [...state.points];
        const point = data[payload.index];

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

        data[payload.index] = point;
        state.points = data;
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
    SET_DRONE_PATH_COORDINATES(state, coordinates) {
        state.dronePath.geoJsonSource.data.geometry.coordinates = coordinates;
    },
    SET_MISSION_UPLOADED(state, status) {
        state.missionUploaded = status;
    },
    SET_RETURN_TO_LAND(state, status) {
        state.returnToLand = status;
    }
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
    setDronePathCoordinates({ commit }, payload) {
        commit('SET_DRONE_PATH_COORDINATES', payload)
    },
    setMissionUploaded({ commit }, payload) {
        commit('SET_MISSION_UPLOADED', payload)
    },
    setReturnToLand({ commit }, payload) {
        commit('SET_RETURN_TO_LAND', payload)
    }
};

export default {
    state,
    mutations,
    actions,
};
