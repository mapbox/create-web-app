import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './main.css';

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

let map;

/**
 * Initialize the map
 */
function initMap() {
    map = new mapboxgl.Map({
        container: 'map-container',
        center: [-71.05953, 42.36290],
        zoom: 13,
    });

    map.on('load', () => {
        console.log("Map is loaded")
    });
}

initMap();