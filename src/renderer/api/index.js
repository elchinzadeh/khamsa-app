import _ from "./_";

// Arm
export function arm() {
	return _.get("/arm");
}

// Disarm
export function disarm() {
	return _.get("/disarm");
}

// Takeoff
export function takeoff() {
	return _.get("/takeoff");
}

// Fly to here
export function flyToHere(data) {
	return _.post("/flyToHere", data);
}

// Upload mission
export function uploadMission(data) {
	return _.post("/mission/upload", data);
}

// Start mission
export function startMission(data) {
	return _.post("/mission/start", data);
}

export default {
	arm,
	disarm,
	takeoff,
	flyToHere,
	uploadMission,
	startMission,
};
