import mapboxgl from 'mapbox-gl';
import { MapboxSearchBox } from '@mapbox/search-js-web';

import 'mapbox-gl/dist/mapbox-gl.css';
import './main.css';
// Mapbox access token
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

let map;
let center = [-71.05953, 42.36290]; // Boston, MA

/**
 * Initialize the map
 */
function initMap() {
    map = new mapboxgl.Map({
        container: 'map-container',
        accessToken: accessToken,
        center,
        zoom: 13,
    });

    map.on('load', () => {
        const searchBox = new MapboxSearchBox();
        searchBox.accessToken = accessToken;
        searchBox.options = {
            types: 'address,poi',
            proximity: center
        };
        searchBox.marker = true;
        searchBox.mapboxgl = mapboxgl;
        searchBox.componentOptions = { allowReverse: true, flipCoordinates: true };
        map.addControl(searchBox);
    });
}

initMap();