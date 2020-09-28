const state = {
    points: [],
    selectedPointIndex: null,
    dronePath: {
        geoJsonSource: {
            type: 'geojson',
            data: {
                id: 'waypoints',
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [],
                },
            },
        },
        geoJsonLayer: {
            // More info: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
            type: 'line',
            paint: {
                'line-color': '#0000ff',
                'line-width': 2,
            },
        },
    },
    returnToLaunch: false,
};

const mutations = {
    ADD_POINT(state, payload) {
        state.points.push({
            altitude: 0,
            command: 'waypoint',
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
    SET_RETURN_TO_LAND(state, status) {
        state.returnToLaunch = status;
    },
};

const actions = {
    addPoint({ commit, dispatch, rootState }, payload) {
        if (state.points.length === 0) {
            if (payload.command === 'takeoff') {
                const droneCurrentLocation = rootState.flightData.droneCurrentLocation;
                payload.coordinates.longitude = droneCurrentLocation[0];
                payload.coordinates.latitude = droneCurrentLocation[1];
            }
        }

        commit('ADD_POINT', payload);
        commit('REMOVE_SELECTED_POINT');

        dispatch('setDronePathCoordinates');
    },
    updatePoint({ commit, dispatch, rootState }, payload) {
        if (payload.index === 0) {
            if (payload.command === 'takeoff') {
                const droneCurrentLocation = rootState.flightData.droneCurrentLocation;
                payload.coordinates = {};
                payload.coordinates.longitude = droneCurrentLocation[0];
                payload.coordinates.latitude = droneCurrentLocation[1];
            }
        }

        commit('UPDATE_POINT', payload);

        dispatch('setDronePathCoordinates');
    },
    deletePoint({ commit, dispatch }, payload) {
        commit('DELETE_POINT', payload);
        if (state.selectedPointIndex === payload) {
            commit('REMOVE_SELECTED_POINT');
        }

        dispatch('setDronePathCoordinates');
    },
    deleteAllPoints({ commit, dispatch }) {
        commit('DELETE_ALL_POINTS');
        commit('REMOVE_SELECTED_POINT');
        dispatch('setDronePathCoordinates');
    },
    selectPoint({ commit }, payload) {
        commit('SELECT_POINT', payload);
    },
    removeSelectedPoint({ commit, dispatch }) {
        commit('REMOVE_SELECTED_POINT');
        dispatch('setDronePathCoordinates');
    },
    setDronePathCoordinates({ state, commit, rootState }) {
        let data = [];

        state.points.forEach((point, index) => {
            if (index === 0) {
                data.push(point);
            } else {
                if (point.command !== 'takeoff') {
                    data.push(point);
                };
            }
        });

        data = data.map(({ coordinates }) => {
            return [
                coordinates.longitude,
                coordinates.latitude,
            ];
        });

        if (state.returnToLaunch) {
            data.push(rootState.flightData.droneHomeLocation);
        }

        commit('SET_DRONE_PATH_COORDINATES', data);
    },
    setReturnToLaunch({ commit, dispatch }, payload) {
        commit('SET_RETURN_TO_LAND', payload);
        dispatch('setDronePathCoordinates');
    },
};

export default {
    state,
    mutations,
    actions,
};
