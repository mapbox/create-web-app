import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    mapRef.current = new mapboxgl.Map({
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      style: 'mapbox://styles/mapbox/standard',
      container: mapContainerRef.current!,
      center: [-71.05953, 42.36290],
      zoom: 13,
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return <div id='map-container' ref={mapContainerRef} />
}

export default App