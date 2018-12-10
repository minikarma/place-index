var params = {
  vegetation: 34,
  air: 33,
  transport: 33
};

mapboxgl.accessToken =
  "pk.eyJ1IjoidXJiaWNhIiwiYSI6ImNpbnlvMXl4bDAwc293ZGtsZjc3cmV1MWYifQ.ejYUpie2LkrVs_dmQct1jA";

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/urbica/cirlzq8g90016gxlz0kijgiwf",
    center: [37.63019,55.756389],
    zoom: 12
  }),

canvas = map.getCanvasContainer();

setParamValue = (param,value) => {
  var v = +value
  if(param === "vegetation") { pa = "air"; pb = "transport"; }
  if(param === "air") { pa = "vegetation"; pb = "transport"; }
  if(param === "transport") { pa = "air"; pb = "vegetation"; }

  var ratio_a = params[pa]/(params[pa]+params[pb]);
  var ratio_b = params[pb]/(params[pa]+params[pb]);

//  var sum = params[param] + params[pa] + params[pb];
  console.log(ratio_a,ratio_b);
  params[pa] = (100-v)*ratio_a+1;
  params[pb] = (100-v)*ratio_b+1;
  params[param] = v;

  d3.select("#slider-"+pa).property("value", params[pa]);
  d3.select("#slider-"+pb).property("value", params[pb]);
  d3.select("#slider-"+param).property("value", v);

  d3.select("#slider-value-"+pa).text(Math.floor(params[pa]-1));
  d3.select("#slider-value-"+pb).text(Math.floor(params[pb]-1));
  d3.select("#slider-value-"+param).text(Math.floor(v));

  console.log(params); // а вот тут можно делать всё что угодно играться с параметрами типа


}

//set event handlers for sliders
  d3.select("#slider-vegetation").on("input", ()=>{ setParamValue("vegetation",document.getElementById("slider-vegetation").value); });
  d3.select("#slider-air").on("input", ()=>{ setParamValue("air",document.getElementById("slider-air").value); });
  d3.select("#slider-transport").on("input", ()=>{ setParamValue("transport",document.getElementById("slider-transport").value); });

  //initial
  setParamValue("transport",document.getElementById("slider-transport").value);
