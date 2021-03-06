import React, {
  useRef,
  useEffect
} from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxDraw from 'mapbox-gl-draw';
import * as turf from '@turf/turf';

import './App.css';
import './D.css';

//https://dev.to/laney/react-mapbox-beginner-tutorial-2e35

mapboxgl.accessToken = 'pk.eyJ1IjoiYnVydHdhbHNoIiwiYSI6ImNrY3FkZWw0ajB1bzAycW9iYjZ2M2UxbzMifQ.LYs2nL6S-ppbkeVRRu8Qkg';

const App = () => {
  const mapContainerRef = useRef(null);

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-77.04, 38.907],
      zoom: 11.15
    });

    //https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
//https://github.com/Turfjs/turf-inside
//MARKERS https://docs.mapbox.com/mapbox-gl-js/example/geojson-markers/

//https://dev.to/laney/react-mapbox-beginner-tutorial-2e35  (STARTER REACT)

    map.on('load', function () {
      // Add an image to use as a custom marker
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        function (error, image) {
          if (error) throw error;
          map.addImage('custom-marker', image);
          // Add a GeoJSON source with 2 points
          map.addSource('points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [{
                  // feature for Mapbox DC
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [
                      -77.03238901390978,
                      38.913188059745586
                    ]
                  },
                  'properties': {
                    'title': 'Mapbox DC',
                    'value': 213000
                  }
                },
                {
                  // feature for Mapbox SF
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.04, 38.88]
                  },
                  'properties': {
                    'title': 'Mapbox LOWER DC',
                    'value': 1000000
                  }
                }
              ]
            }
          });

/*
id,type,minzoom,maxzoom,tileSize,isTileClipped,reparseOverscaled,_removed,_loaded,actor,_eventedParent,_eventedParentData,_data,_options,_collectResourceTiming,_resourceTiming,promoteId,workerOptions,load,serialize,_listeners,map
alert(Object.keys(map.getSource('points')));
*/

          // Add a symbol layer
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'custom-marker',
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });
        }
      );
    });



    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
    map.addControl(draw);
    map.on('draw.create', updateArea);
//    map.on('draw.delete', updateArea);
 //   map.on('draw.update', updateArea);

const poly = {
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

    function updateArea(e) {
      var data = draw.getAll();
let value = 0;
      map.getSource('points')._data.features.forEach(function(x) {

//alert(JSON.stringify(data));
try {
//	alert(x.geometry);
//alert(turf.inside(x,data.features[0]));
if (turf.inside(x,data.features[0])) {
	value = value + parseInt(x.properties.value,0);
}
}
catch(e) { alert(e); }
      });

alert('value of prop: ' + value);
/*
{"type":"FeatureCollection","features":[{"id":"88d9354a2b5d01fbcffffabaf267587d","type":"Feature","properties":{},"geometry":{"coordinates":[[[-77.11704552790565,38.93420293598044],[-76.99822832824515,38.930833226749996],[-76.98554211682276,38.877136990556494],[-77.03535870313902,38.87882313998284],[-77.11704552790565,38.93420293598044]]],"type":"Polygon"}}]}
alert(JSON.stringify(data));
*/
      if (data.features.length > 0) {
        var area = turf.area(data);
        // restrict to area to 2 decimal points
        var rounded_area = Math.round(area * 100) / 100;
       // alert(rounded_area);
      }
    }
/*
    map.on('click', function (e) {
      //alert(e.lngLat.lat + "::::" + e.lngLat.lng);
    });
*/
    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <div className="map-container" ref={mapContainerRef}>
  };

export default P;
