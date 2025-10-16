import { useRef, useEffect, useState } from 'react'
import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

const accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

function App() {

  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [inputValue, setInputValue] = useState("") 


  const INITIAL_CENTER = [
    -74.0242,
    40.6941
  ]
  const INITIAL_ZOOM = 10.12

  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  useEffect(() => {
    mapboxgl.accessToken = accessToken

     mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
    });

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      // update state
      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current.remove()
    }
  }, [])

const handleButtonClick = () => {
  mapRef.current.flyTo({
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM
  })
}


return (
  <>
  {/* Sidebar */ }
    <div className="sidebar">
      Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
    </div>
    <button className='reset-button' onClick={handleButtonClick}>
      Reset
    </button>
    {/* SearchBox */ }
     <div style={{
        margin: '10px 10px 0 0',
        width: 300,
        right: 0,
        top: 0,
        position: 'absolute',
        zIndex: 10 }}>
        <SearchBox
            accessToken={accessToken}
            map={mapRef.current}
            mapboxgl={mapboxgl}
            value={inputValue}
            onChange={(d) => {
            setInputValue(d);
            }}
            marker
        />
    </div>
    <div id='map-container' ref={mapContainerRef} />
  </>
  )
}

export default App

