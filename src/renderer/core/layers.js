export const $buildings = {
    id: "3d-buildings",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    type: "fill-extrusion",
    minzoom: 15,
    paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"]
        ],
        "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"]
        ],
        "fill-extrusion-opacity": 0.6
    }
}

// export const $points_extrusion = (sourceId) => {
//     return {
//         "id": "points-extrusion",
//         "type": "fill-extrusion",
//         "source": sourceId,
//         "paint": {
//             "fill-extrusion-color": ["get", "color"],
//             "fill-extrusion-height": ["get", "height"],
//             "fill-extrusion-base": 0,
//             "fill-extrusion-opacity": 0.9
//         }
//     }
// };

export const $points_extrusion = (sourceId) => {
    return {
        "id": "points-extrusion",
        "type": "line",
        "source": sourceId,
        'paint': {
            'line-color': 'yellow',
            'line-opacity': 0.75,
            'line-width': 5
        }
    }
};

export const $drone = {
    'id': 'drone',
    'type': 'symbol',
    'source': 'drone',
    'layout': {
        'icon-image': 'drone',
        'icon-size': 0.1
    }
}