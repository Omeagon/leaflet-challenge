function createMarkerSize(magnitude) {
    return magnitude * 3;
}

function createColor(depth) {
    if (depth <= 10) return "#69fa02";
    else if (depth <= 30) return "#b0fa02";
    else if (depth <= 50) return "#facd02";
    else if (depth <= 70) return "#fa9f02";
    else if (depth <= 90) return "#fa7602";
    else return "#fa2b02"
}

function createMap(earthquake) {

    // Create the tile layer that will be the background of the map.
    let USmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object to hold the map layer
    let baseMaps = {
        "Map": USmap
    };

    // Create an overlayMaps object to hold the earthquake Layer
    let overlayMaps = {
        "Earthquakes": earthquake
    };

    // Create the map object with options
    let map = L.map("map", {
        center: [40, -105],
        zoom: 5,
        layers: [USmap, earthquake]
    });
    
    // Create a layer control and pass it baseMaps and overlayMaps.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    let legend = L.control({position: "bottomright"});
    
    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<div><span style="background: rgb(105, 250, 2);"></span> -10–10</div>';
        div.innerHTML += '<div><span style="background: rgb(176,250,2);"></span> 10–30</div>';
        div.innerHTML += '<div><span style="background: rgb(250,205,2);"></span> 30–50</div>';
        div.innerHTML += '<div><span style="background: rgb(250,159,2);"></span> 50–70</div>';
        div.innerHTML += '<div><span style="background: rgb(250,118,2);"></span> 70–90</div>';
        div.innerHTML += '<div><span style="background: rgb(250,43,2);"></span> 90+</div>';
        return div;
    };

    legend.addTo(map);
}

function createMarkers(response) {
    let features = response.features;
    let earthquakes = [];
    for (let index = 0; index < features.length; index++) {
        let feature = features[index];
        
        let earthquakeMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
            radius: createMarkerSize(feature.properties.mag),
            fillColor: createColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
    ).bindPopup("<h3>Location:" + feature.properties.place + "<h3>Magnitude: " + feature.properties.mag + "   Depth: " + feature.geometry.coordinates[2] + "</h3>");

        earthquakes.push(earthquakeMarker);
    }

    createMap(L.layerGroup(earthquakes));

};



// Perform a call to the USGS website to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);