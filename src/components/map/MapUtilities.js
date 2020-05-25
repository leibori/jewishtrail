import L from 'leaflet';
import { setPosition } from '../../actions'
import site_marker_icon from '../../assets/img/site_marker_icon.png'
import user_marker_icon from '../../assets/img/user_marker_icon.png'


let maxZoom = 20
let minZoom = 1.5

// Basic map url
let mapUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

// Map attributes
let mbAttr = 'Map data © OpenStreetMap contributors, CC-BY-SA, Imagery © Mapbox'

// Layer of map named "streets" to see streets and places of interest clearly.
const streets = L.tileLayer(mapUrl, {id: 'mapbox/streets-v11', maxZoom: maxZoom,
        minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Layer of map named "satellite" to see the map with sattelite imaging.
const satellite = L.tileLayer(mapUrl, {id: 'mapbox/satellite-v9', maxZoom: maxZoom,
    minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Layer of map named "satellite-streets" that combines the "streets" layer and the "satelltie" layer.
const satelliteStreets = L.tileLayer(mapUrl, {id: 'mapbox/satellite-streets-v11', maxZoom: maxZoom,
    minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Site marker.
var siteMarker = L.icon({
    iconUrl: site_marker_icon,
    iconSize: [30, 41],
    iconAnchor: [15, 43],
    popupAnchor: [0, -25]
});


// User marker.
var userMarker = L.icon({
    iconUrl: user_marker_icon,
    iconSize: [30, 41],
    iconAnchor: [15, 43],
    popupAnchor: [0, -25]
});


/**
 * This function receives an array of sites and returns a layer of markers according to specific info in the site object.
 * @param {site[]} sites 
 */
function getSiteMarkerLayer(sites) {
    var markerLayer = L.layerGroup();
    sites.forEach(site => {
        var marker = L.marker([site.latitude, site.longitude], {icon: siteMarker}).addTo(markerLayer)
        var link = "<a href='/site/" + site.id + "'>More info</a>"
        marker.bindPopup("<b>"+site.name+"</b><br/>"+
                        site.address+"<br/>"+
                        site.partialInfo+"<br/>"+
                        link)
    })
    return markerLayer
}


/**
 * This function creates a map for the "Around You" page using the map id, latitude, longitude, zoom and sites given.
 * @param {string} mapId 
 * @param {double} centerLat 
 * @param {double} centerLng 
 * @param {int} zoom 
 * @param {site[]} sites 
 */
export function getAroundYouMap(mapId, centerLat, centerLng, zoom, sites) {
    var sitesMarkers = getSiteMarkerLayer(sites)

    var map = L.map(mapId, {
        center: [centerLat, centerLng],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, sitesMarkers] 
    })

    L.marker([centerLat, centerLng], {icon: userMarker}).addTo(map)

    var baseLayers = {
            "Streets": streets,
            "Sattelite": satellite,
            "Sattelite and streets": satelliteStreets };
    var overlays = { "Sites": sitesMarkers };
    L.control.layers(baseLayers, overlays).addTo(map);
}


/**
 * This function creates a map for the "trail page" using the map id, latitude, longitude, zoom and sites given.
 * @param {string} mapId 
 * @param {double} centerLat 
 * @param {double} centerLng 
 * @param {int} zoom 
 * @param {site[]} sites 
 */
export function getTrailPageMap(mapId, centerLat, centerLng, zoom, sites, userLat, userLng) {
    var sitesMarkers = getSiteMarkerLayer(sites)

    var map = L.map(mapId, {
        center: [centerLat, centerLng],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, sitesMarkers] 
    })

    L.marker([userLat, userLng], {icon: userMarker}).addTo(map)

    var baseLayers = {
            "Streets": streets,
            "Sattelite": satellite,
            "Sattelite and streets": satelliteStreets };
    var overlays = { "Sites": sitesMarkers };
    L.control.layers(baseLayers, overlays).addTo(map);
}


/**
 * This function creates a map for a site's page using the map id, site and zoom given.
 * @param {string} mapId 
 * @param {site} site 
 * @param {int} zoom 
 */
export function getSitePageMap(mapId, site, zoom, latitude, longitude) {

    var markerLayer = L.layerGroup();
    L.marker([site.latitude, site.longitude], {icon: siteMarker}).addTo(markerLayer)

    var map = L.map(mapId, {
        center: [site.latitude, site.longitude],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, markerLayer] 
    })

    L.marker([latitude, longitude], {icon: userMarker}).addTo(map)

    var baseLayers = {
            "Streets": streets,
            "Sattelite": satellite,
            "Sattelite and streets": satelliteStreets };
    var overlays = { "Marker": markerLayer };
    L.control.layers(baseLayers, overlays).addTo(map);
    
}


export function findUserPosition(dispatch) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = await fetch('https://ipapi.co/json').then(res => res.json())
        dispatch(setPosition({
            type: 'FIND_POSITION',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            country: location.country_name
        }));
    },
    () => {
        fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
            dispatch(setPosition({
                type: 'FIND_POSITION',
                lat: location.latitude,
                lng: location.longitude,
                country: location.country_name
            }))
        })
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
}

export function calculateDistance(lat1, lat2, lng1, lng2) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
}
