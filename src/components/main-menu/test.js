var mapboxAttribution = 'Map data © OpenStreetMap contributors, ' + 'CC-BY-SA, ' + 'Imagery © Mapbox'
var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]);

var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution}),
    streets   = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [grayscale, cities]
});

var baseMaps = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlayMaps = {
    "Cities": cities
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

var baseMaps = {
    "<span style='color: gray'>Grayscale</span>": grayscale,
    "Streets": streets
};

<script> 
    var cities = L.layerGroup();
    L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
    L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
    L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
    L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);
    var mbAttr = 'Map data © OpenStreetMap contributors, ' + 'CC-BY-SA, ' + 'Imagery © Mapbox',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
    streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var map = L.map('map', { center: [39.73, -104.99], zoom: 10, layers: [grayscale, cities] });
    var baseLayers = { "Grayscale": grayscale, "Streets": streets };
    var overlays = { "Cities": cities };
    L.control.layers(baseLayers, overlays).addTo(map);
</script>