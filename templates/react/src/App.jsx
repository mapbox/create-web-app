import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

function App() {

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3c2VwaWMxIiwiYSI6ImNsbzV0NzQwNTAzYjQyd3MwbHVjaXR1cWUifQ.1Puj3xOeBUWw0cITO38elg'

     mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center:  [-71.05953, 42.36290],
      zoom: 13,
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])


return (
  <>
    <div id='map-container' ref={mapContainerRef} />
  </>
  )
}

export default App

