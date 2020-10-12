export function getDistanceMeters(a, b) {
    if (a && b) {
        const dLat = b.latitude - a.latitude;
        const dLng = b.longitude - a.longitude;
        return Math.sqrt((dLat ** 2) + (dLng ** 2)) * 1.113195e5;
    }

    return;
}
