export default `
    // Add SearchBox
    <SearchBoxComponent
        proximity={mapRef.current.getCenter()}
        accessToken={mapboxgl.accessToken}
        />
`