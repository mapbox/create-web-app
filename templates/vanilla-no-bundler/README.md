# use-mapbox-gl-js-with-vanilla-js-no-bundler

A simple Mapbox GL JS web map using Vanilla JavaScript with no bundler or build step required. Mapbox GL JS is loaded directly from CDN.

## Overview

This template provides a minimal setup for using [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) with pure HTML, CSS, and JavaScript. No build tools, bundlers, or complex setup required.

You'll learn how to:
- Load Mapbox GL JS directly from CDN
- Create a full-screen interactive map
- Use Mapbox GL JS without any build process
- Set up a simple development server

## Prerequisites

- Node v18.20 or higher
- npm

## How to run

1. Install dependencies: `npm install`
2. Replace `your_mapbox_access_token_here` in `index.html` with your actual Mapbox access token from your [Mapbox account](https://console.mapbox.com/)
3. Run the development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

## Features

- ✅ No build step or bundler required
- ✅ Mapbox GL JS loaded from CDN (v3.15.0)
- ✅ Self-contained HTML file with inline styles and JavaScript
- ✅ Uses live-server for local development with hot reload
- ✅ Runs on port 5173 to match other templates
- ✅ Perfect for quick prototyping and learning

## Template Structure

```
vanilla-no-bundler/
├── index.html          # Main HTML file with inline CSS/JS
├── package.json        # Basic package file with dev server
└── README.md          # This file
```

This template is perfect for:
- Quick prototyping
- Learning Mapbox GL JS
- Simple map applications
- Avoiding the complexity of build systems
- Sharing code snippets and examples