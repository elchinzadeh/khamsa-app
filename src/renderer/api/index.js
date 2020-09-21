import _ from './_';

// Arm
export function arm() {
    return _.get('/arm');
}

// Disarm
export function disarm() {
    return _.get('/disarm');
}

// Takeoff
export function takeoff(data) {
    return _.post('/takeoff', data);
}

// Change altitude
export function changeAltitude(data) {
    return _.post('/takeoff/changeAlt', data);
}

// Fly to here
export function flyToHere(data) {
    return _.post('/flyToHere', data);
}

// Upload mission
export function uploadMission(data) {
    return _.post('/mission/upload', data);
}

// Start mission
export function startMission() {
    return _.get('/mission/start');
}

// Pause mission
export function pauseMission() {
    return _.get('/mission/pause');
}

// Abort mission
export function abortMission() {
    return _.get('/mission/abort');
}

// Continue mission
export function continueMission() {
    return _.get('/mission/continue');
}

// Continue mission
export function setMode(data) {
    return _.post('/mode', data);
}

export default {
    arm,
    disarm,
    takeoff,
    changeAltitude,
    flyToHere,
    uploadMission,
    startMission,
    pauseMission,
    abortMission,
    continueMission,
    setMode,
};
