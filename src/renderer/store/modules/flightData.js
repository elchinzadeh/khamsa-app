import { getDistanceMeters } from '../../helpers';
let flyToHereTimeout;

const state = {
    droneInitialLocation: null,
    droneCurrentLocation: [],
    droneHomeLocation: [],
    dronePath: {
        id: 'live-data',
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [],
                },
            },
        ],
    },
    dronePattern: {
        geometry: {
            type: 'Point',
            coordinates: null,
        },
        type: 'Feature',
        properties: {},
    },
    initialCoordinates: [
        49.83846502960421,
        40.34346368003392,
    ],
    flightMode: null,
    flyToHereLocation: null,
};

const mutations = {
    SET_DRONE_INITIAL_LOCATION(state, coordinates) {
        state.droneInitialLocation = coordinates;
    },
    SET_DRONE_CURRENT_LOCATION(state, coordinates) {
        state.droneCurrentLocation = coordinates;
    },
    SET_DRONE_HOME_LOCATION(state, coordinates) {
        state.droneHomeLocation = coordinates;
    },
    ADD_DRONE_TRAJECTORY(state, coordinates) {
        state.dronePath.features[0].geometry.coordinates.push(
            coordinates,
        );
    },
    CLEAR_DRONE_TRAJECTORY(state) {
        state.dronePath.features[0].geometry.coordinates = [];
    },
    SET_DRONE_PATTERN_COORDINATES(state, coordinates) {
        state.dronePattern.geometry.coordinates = coordinates;
    },
    SET_MAP_INITIAL_COORDINATES(state) {
        state.dronePattern.geometry.coordinates = state.initialCoordinates;
    },
    SET_FLIGHT_MODE(state, value) {
        state.flightMode = value;
    },
    SET_FLY_TO_HERE_LOCATION(state, value) {
        state.flyToHereLocation = value;
    },
};

const actions = {
    setDroneInitialLocation({ commit }, payload) {
        commit('SET_DRONE_INITIAL_LOCATION', payload);
    },
    setDroneCurrentLocation({ state, dispatch, commit }, payload) {
        commit('SET_DRONE_CURRENT_LOCATION', payload);

        const [
            currentLng,
            currentLat,
        ] = payload;

        const meters = getDistanceMeters({
            latitude: currentLat,
            longitude: currentLng,
        }, state.flyToHereLocation);

        if (meters <= 5) {
            if (!flyToHereTimeout) {
                flyToHereTimeout = setTimeout(function() {
                    dispatch('setFlyToHereLocation', null);
                }, 5000);
            }
        } else {
            clearTimeout(flyToHereTimeout);
            flyToHereTimeout = null;
        }
    },
    setDroneHomeLocation({ state, commit }, payload) {
        if (state.droneHomeLocation !== payload) {
            commit('SET_DRONE_HOME_LOCATION', payload);
        }
    },
    addDroneTrajectory({ commit }, payload) {
        commit('ADD_DRONE_TRAJECTORY', payload);
        commit('SET_DRONE_PATTERN_COORDINATES', payload);
    },
    clearDroneTrajectory({ commit }) {
        commit('CLEAR_DRONE_TRAJECTORY');
    },
    setMapInitialCoordinates({ commit }) {
        commit('SET_MAP_INITIAL_COORDINATES');
    },
    setFlightMode({ commit }, payload) {
        commit('SET_FLIGHT_MODE', payload);
    },
    setFlyToHereLocation({ commit }, payload) {
        commit('SET_FLY_TO_HERE_LOCATION', payload);
        // if (payload) {
        //     clearTimeout(flyToHereTimeout);
        // }
    },
};

export default {
    state,
    mutations,
    actions,
};
