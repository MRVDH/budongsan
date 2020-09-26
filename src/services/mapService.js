import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { accessToken } from './accessToken';

const defaultBuildingColor = '#aaa';
const buildingNotEnoughtLevel = '#a00'
const buildingNotEnoughtMoney = '#e00'
const buildingNotEnoughtMoneyBuy = '#f90'
const buildingOwnedColor = 'dodgerblue';
const buildingRentingColor = 'darkslateblue';

export function newMap() {
    mapboxgl.accessToken = accessToken;

    let map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [4.89327, 52.37304],
        zoom: 17,
        pitch: 48,
        bearing: 0,
        container: 'map',
        antialias: true,
        hash: true
    });

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });
         
    document.getElementById('search-col').appendChild(geocoder.onAdd(map));

    return map;
}

export function defineLayerId(map) {
    var layers = map.getStyle().layers;

    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            return layers[i].id;
        }
    }
}

export function addBaseLayersToMap(map, labelLayerId) {
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 13,
        'paint': {
            'fill-extrusion-color': defaultBuildingColor,
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-opacity': 0.6
        }
    }, labelLayerId);

    map.addSource('buildings-not-enought-level', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-buildings-not-enought-level",
        "source": "buildings-not-enought-level",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-color': buildingNotEnoughtLevel,
            'fill-opacity': 0.6,
            'fill-outline-color': 'gray'
        }
    }, labelLayerId);

    map.addSource('buildings-not-enought-money', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-buildings-not-enought-money",
        "source": "buildings-not-enought-money",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-color': buildingNotEnoughtMoney,
            'fill-opacity': 0.6,
            'fill-outline-color': 'gray'
        }
    }, labelLayerId);

    map.addSource('buildings-not-enought-money-buy', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-buildings-not-enought-money-buy",
        "source": "buildings-not-enought-money-buy",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-color': buildingNotEnoughtMoneyBuy,
            'fill-opacity': 0.6,
            'fill-outline-color': 'gray'
        }
    }, labelLayerId);

    map.addSource('building-selected', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-building",
        "source": "building-selected",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-opacity': 0.5
        }
    }, labelLayerId);

    map.addSource('buildings-owned', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-buildings-owned",
        "source": "buildings-owned",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-color': buildingOwnedColor,
            'fill-opacity': 0.6,
            'fill-outline-color': 'gray'
        }
    }, labelLayerId);

    map.addSource('buildings-renting', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "highlight-buildings-renting",
        "source": "buildings-renting",
        'type': 'fill',
        'minzoom': 13,
        'paint': {
            'fill-color': buildingRentingColor,
            'fill-opacity': 0.6,
            'fill-outline-color': 'gray'
        }
    }, labelLayerId);
}