<script>
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { onMount, onDestroy } from 'svelte';
  import { MapboxSearchBox } from '@mapbox/search-js-web';

  let map;
  let mapContainer;
  let accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  onMount(() => {
    map = new mapboxgl.Map({
      container: mapContainer,
      accessToken,
      center: [-71.05953, 42.36290],
      zoom: 13
    });

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
      
      map.addControl(searchBox);
    });
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

</script>
<div class="map" bind:this={mapContainer}></div> 


<style>
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>