import L from 'leaflet';


let maxZoom = 18
let minZoom = 1.5

let iconUrl = 'http://www.clker.com/cliparts/k/a/2/B/c/u/map-marker-red-th.png'
let mapUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
let mbAttr = 'Map data © OpenStreetMap contributors, ' + 'CC-BY-SA, ' + 'Imagery © Mapbox'


export var myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [24.8, 39.6],
    iconAnchor: [12.4, 39.6],
    popupAnchor: [0, -30]
});


function getSiteMarkerLayer(markers) {
    var sites = L.layerGroup();
    markers.forEach(site => {
        var marker = L.marker([site.latitude, site.longitude], {icon: myIcon}).addTo(sites)
        var link = "<a href='/site/" + site.id + "'>More info</a>"
        marker.bindPopup("<b>"+site.name+"</b><br/>"+
                        site.address+"<br/>"+
                        site.partialInfo+"<br/>"+
                        link)
    })
    return sites
}


export function getMenuMap(mapId, latitude, longitude, zoom, markers) {
    var sites = getSiteMarkerLayer(markers)

    var streets = L.tileLayer(mapUrl, {id: 'mapbox/streets-v11', maxZoom: maxZoom,
        minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var satellite = L.tileLayer(mapUrl, {id: 'mapbox/satellite-v9', maxZoom: maxZoom,
        minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var satelliteStreets = L.tileLayer(mapUrl, {id: 'mapbox/satellite-streets-v11', maxZoom: maxZoom,
        minZoom: minZoom, tileSize: 512, zoomOffset: -1, attribution: mbAttr});

    var map = L.map(mapId, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: false,
        layers: [streets, sites] 
    })

    var baseLayers = {
            "Streets": streets,
            "Sattelite": satellite,
            "Sattelite and streets": satelliteStreets };
    var overlays = { "Sites": sites };
    L.control.layers(baseLayers, overlays).addTo(map);
}