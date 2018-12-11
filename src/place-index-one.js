mapboxgl.accessToken =
  "pk.eyJ1IjoidXJiaWNhIiwiYSI6ImNpbnlvMXl4bDAwc293ZGtsZjc3cmV1MWYifQ.ejYUpie2LkrVs_dmQct1jA";

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/urbica/cirlzq8g90016gxlz0kijgiwf",
    center: [37.554967,55.717137],
    zoom: 12
  }),

canvas = map.getCanvasContainer();

var slider = document.getElementById('slider-area');

noUiSlider.create(slider, {
    start: [25, 75],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});


map.on("load", ()=>{
  map.addSource("bld",{type: "geojson", data: "./data/bld_index.geojson"});
  map.addLayer({
    id: "bld",
    source: "bld",
    type: "fill",
    paint: {
      "fill-color": {
        property: "index_sum",
        type: "exponential",
        stops: [
          [0,"#004466"],
          [100,"#00AADD"]
        ]
      },
      "fill-opacity": 0.5
    }
  });


  //bind events to slider
  slider.noUiSlider.on('change', function (e) { calculateParams(e); });


  calculateParams = (values) => {
    console.log(values);
    var green_ratio = Math.round(+values[0]),
        transport_ratio = Math.round(+values[1] - +values[0]),
        air_ratio = Math.round(100 - (+values[1]));

    //map.setFilter("bld", ["<=","index_sum",value]);
    map.setFilter("bld", ["all", ["<=","green_ratio", green_ratio],["<=","transport_ratio", transport_ratio],["<=","air_ratio", air_ratio]]);

    d3.select("#slider-value-green").text(green_ratio);
    d3.select("#slider-value-transport").text(transport_ratio);
    d3.select("#slider-value-air").text(air_ratio);
  }


  // Create a popup, but don't add it to the map yet.
   var popup = new mapboxgl.Popup({
       closeButton: false,
       closeOnClick: false
   });

   map.on('mousemove', 'bld', function(e) {
       // Change the cursor style as a UI indicator.
       if(e.features.length>0) {
         map.getCanvas().style.cursor = 'pointer';
         var coordinates = {lng: e.lngLat.lng, lat: e.lngLat.lat};
         var description = "green_ratio: " + e.features[0].properties["green_ratio"] + "<br/>" +
                           "transport_ratio: " + e.features[0].properties["transport_ratio"] + "<br/>" +
                           "air_ratio: " + e.features[0].properties["air_ratio"];

         popup.setLngLat(coordinates)
             .setHTML(description)
             .addTo(map);
       } else {
         map.getCanvas().style.cursor = '';
         popup.remove();
       }

   });

   map.on('mouseleave', 'bld', function() {
       map.getCanvas().style.cursor = '';
       popup.remove();
   });

   //start
   calculateParams(["25.00", "75.00"]);


});
