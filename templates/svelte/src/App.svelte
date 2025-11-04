<script>
  import { Map } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { onMount, onDestroy } from 'svelte';

  let map;
  let mapContainer;


  onMount(() => {
    map = new Map({
      container: mapContainer,
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      center: [-71.05953, 42.36290],
      zoom: 13
    });
    
  });

  onDestroy(() => {
    map.remove();
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