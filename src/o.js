import * as turf from '@turf/turf';

var pt1 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#f00"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.467285, 40.75766]
  }
};
var pt2 = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-111.873779, 40.647303]
  }
};
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-112.074279, 40.52215],
      [-112.074279, 40.853293],
      [-111.610107, 40.853293],
      [-111.610107, 40.52215],
      [-112.074279, 40.52215]
    ]]
  }
};

var features = {
  "type": "FeatureCollection",
  "features": [pt1, pt2, poly]
};

//=features

var isInside1 = turf.inside(pt1, poly);
//=isInside1

var isInside2 = turf.inside(pt2, poly);
//=isInside2

console.log(isInside1 + " " + isInside2);
