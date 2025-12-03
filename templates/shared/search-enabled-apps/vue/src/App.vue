<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapboxSearchBox } from '@mapbox/search-js-web';

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default {
  mounted() {

    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      accessToken: accessToken,
      style: "mapbox://styles/mapbox/standard",
      center:  [-71.05953, 42.36290],
      zoom: 13,
    });

    // assign the map instance to this component's map property
    this.map = map;

    map.on('load', () => {
      const searchBox = new MapboxSearchBox();
      searchBox.accessToken = accessToken;
      searchBox.options = {
        proximity: [-71.05953, 42.36290]
      };
      searchBox.marker = true;
      searchBox.mapboxgl = mapboxgl;
      searchBox.componentOptions = { 
        allowReverse: true, 
        flipCoordinates: true 
      };
      
      this.map.addControl(searchBox);
    });
  },

  // clean up the map instance when the component is unmounted
  unmounted() {
    this.map.remove();
    this.map = null;
  }
};
</script>

<style>
/* make the map container fill its parent */
.map-container {
  width: 100%;
  height: 100%;
}
</style>