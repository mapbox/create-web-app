<script>
  import { Map } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { onMount, onDestroy } from 'svelte';

  let map;
  let mapContainer;


  onMount(() => {
    map = new Map({
      container: mapContainer,
      accessToken: 'pk.eyJ1IjoiYW5kcmV3c2VwaWMxIiwiYSI6ImNsbzV0NzQwNTAzYjQyd3MwbHVjaXR1cWUifQ.1Puj3xOeBUWw0cITO38elg',
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