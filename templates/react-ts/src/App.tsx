import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

function App() {

  const mapRef = useRef<mapboxgl.Map>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center:  [-71.05953, 42.36290],
      zoom: 13,
    });

    return () => {
      mapRef.current?.remove()
    }
  }, [])


return (
    <div id='map-container' ref={mapContainerRef} />
  )
}

export default App

