import L from 'leaflet';

let maxZoom = 20
let minZoom = 1.5

// Marker icon url
let iconUrl = 'http://www.clker.com/cliparts/k/a/2/B/c/u/map-marker-red-th.png'

// Basic map url
let mapUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

// Map attributes
let mbAttr = 'Map data © OpenStreetMap contributors, ' + 'CC-BY-SA, ' + 'Imagery © Mapbox'

// Layer of map named "streets" to see streets and places of interest clearly.
const streets = L.tileLayer(mapUrl, {id: 'mapbox/streets-v11', maxZoom: maxZoom,
        minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Layer of map named "satellite" to see the map with sattelite imaging.
const satellite = L.tileLayer(mapUrl, {id: 'mapbox/satellite-v9', maxZoom: maxZoom,
    minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Layer of map named "satellite-streets" that combines the "streets" layer and the "satelltie" layer.
const satelliteStreets = L.tileLayer(mapUrl, {id: 'mapbox/satellite-streets-v11', maxZoom: maxZoom,
    minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

// Basic icon for marker.
var myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [24.8, 39.6],
    iconAnchor: [12.4, 39.6],
    popupAnchor: [0, -30]
});


/**
 * This function receives an array of sites and returns a layer of markers according to specific info in the site object.
 * @param {site[]} sites 
 */
function getSiteMarkerLayer(sites) {
    var markerLayer = L.layerGroup();
    sites.forEach(site => {
        var marker = L.marker([site.latitude, site.longitude], {icon: myIcon}).addTo(markerLayer)
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
 * It is also used for a trail's page for now.
 * @param {string} mapId 
 * @param {double} latitude 
 * @param {double} longitude 
 * @param {int} zoom 
 * @param {site[]} sites 
 */
export function getAroundYouMap(mapId, latitude, longitude, zoom, sites) {
    var sitesMarkers = getSiteMarkerLayer(sites)

    var map = L.map(mapId, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, sitesMarkers] 
    })

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
export function getSitePageMap(mapId, site, zoom) {

    var markerLayer = L.layerGroup();
    var marker = L.marker([site.latitude, site.longitude], {icon: myIcon}).addTo(markerLayer)
    var link = "https://www.google.com/maps/dir/?api=1&destination="+site.latitude+"%2C"+site.longitude+"&dir_action=navigate"
    var linkElement = "<a href="+link+">Navigate to site</a>"

    marker.bindPopup(linkElement)

    var map = L.map(mapId, {
        center: [site.latitude, site.longitude],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, markerLayer] 
    })

    var baseLayers = {
            "Streets": streets,
            "Sattelite": satellite,
            "Sattelite and streets": satelliteStreets };
    var overlays = { "Marker": markerLayer };
    L.control.layers(baseLayers, overlays).addTo(map);
    
}
