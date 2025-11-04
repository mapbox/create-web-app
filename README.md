# create @mapbox-web-app

This package is a command line tool which allows developers to quickly scaffold a [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) map into a popular front end framework and get a map loading in a browser in a matter of seconds.  The goal is to enable developers to quickly start building with Mapbox GL JS. 

## Supported Frameworks
Currently supported frameworks:
- No Framework (HTML, CSS, Vanilla JavaScript)
- React
- Vue
- Svelte
- Angular

## Mapbox Search JS
This tool also contains templates to add a [Mapbox Search JS](https://docs.mapbox.com/mapbox-search-js/) search box to the map as well - handling needs for users who wish to integrate interactive search with their map. 

## Access Tokens are required
To use any Mapbox services you must have an access token which you can get from your [Mapbox Console](https://console.mapbox.com) after creating an account.  This CLI tool asks for your token and creates a local `.env` file with the token passed to the cli. This value is then parsed by [Vite](https://vite.dev) and passed to your map for the request to Mapbox. 

```js    
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
```

If you'd prefer to add your own `.env` file and manually set your token, you can do so by using the `.env.example` as a template.




