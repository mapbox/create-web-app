<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW5kcmV3c2VwaWMxIiwiYSI6ImNsbzV0NzQwNTAzYjQyd3MwbHVjaXR1cWUifQ.1Puj3xOeBUWw0cITO38elg";

export default {
  mounted() {

    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: "mapbox://styles/mapbox/standard",
      center:  [-71.05953, 42.36290],
      zoom: 13,
    });

    // assign the map instance to this component's map property
    this.map = map;
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