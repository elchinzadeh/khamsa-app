const state = {
	droneInitialLocation: null,
};

const mutations = {
	SET_DRONE_INITIAL_LOCATION(state, coordinates) {
		state.droneInitialLocation = coordinates;
	},
};

const actions = {
	setDroneInitialLocation({ commit }, payload) {
		commit("SET_DRONE_INITIAL_LOCATION", payload);
	},
};

export default {
	state,
	mutations,
	actions,
};
