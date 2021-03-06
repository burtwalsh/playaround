import React, {
  useRef,
  useEffect,
  useState,
} from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxDraw from 'mapbox-gl-draw';
import * as turf from '@turf/turf';
import * as _ from 'lodash';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import './App.css';

//https://dev.to/laney/react-mapbox-beginner-tutorial-2e35
// https://github.com/mapbox/mapbox-gl-draw  [ base library ]
// DRAW POLY https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-draw/

mapboxgl.accessToken = 'pk.eyJ1IjoiYnVydHdhbHNoIiwiYSI6ImNrY3FkZWw0ajB1bzAycW9iYjZ2M2UxbzMifQ.LYs2nL6S-ppbkeVRRu8Qkg';


const App = () => {
  const mapContainerRef = useRef(null);

  const [value, setValue] = useState(0);
  const [propList, setPropList] = useState("Start");
  let map;
  
    function getList() {
	    let props = new Map();
	      map.getSource('points')._data.features.forEach(function (x) {
	        Object.keys(x.properties).forEach(d=>props[d] = 1);
	    });
	    setPropList(Object.keys(props).reduce((acc,key) => { return acc + "," + key },""));
    }

  function addFeatures() {
   
 
    if (!map) { alert('no map'); return; }

let feat = 
      {
        // feature for Mapbox SF
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-77.04,
            38.84]
        },
        'properties': {
          'title': 'NewOne',
          'value': 50000000
        }
      };
alert(JSON.stringify(feat));
    let dat = _.cloneDeep(map.getSource('points')._data);
     dat.features.push(feat);

    map.getSource('points').setData(dat);

    

    //alert(map.getSource('points')._data.features);
    
  // alert(Object.keys(map.getSource('points')));
  
  }
  
  // initialize map when component mounts
  useEffect(() => {

    map = new mapboxgl.Map({
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

      setValue(0);
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
                    'value': 98000
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
                },
                {
                  // feature for 
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [
                      -77.03238901390978,
                      38.94
                    ]
                  },
                  'properties': {
                    'title': 'O1',
                    'value': 213000
                  }
                },
                {
                  // feature for Mapbox SF
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.04, 38.98]
                  },
                  'properties': {
                    'title': 'O2',
                    'value': 50000
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
        map.on('draw.delete', clearVal);
    //   map.on('draw.update', updateArea);

    const poly = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-112.074279, 40.52215],
            [-112.074279, 40.853293],
            [-111.610107, 40.853293],
            [-111.610107, 40.52215],
            [-112.074279, 40.52215]
          ]
        ]
      }
    };

    function clearVal(e) {
       setValue(0);
    }
    function updateArea(e) {
      var data = draw.getAll();
      let val = 0;
      map.getSource('points')._data.features.forEach(function (x) {

        //alert(JSON.stringify(data));
        try {
          //	alert(x.geometry);
          //alert(turf.inside(x,data.features[0]));
          if (turf.inside(x, data.features[0])) {
            val = val + parseInt(x.properties.value, 0);
          }
        } catch (e) {
          
        }
      });
      setValue(new Intl.NumberFormat().format(val));
    

     // alert('value of prop: ' + val);
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

  
  return <div className="map-container"><div ref={mapContainerRef}></div><button onClick={addFeatures}>Add Features</button><div style={{fontSize: '40px'}}>Total Building Value: {value}</div><button onClick={getList}>Props: {propList}</button></div>
};

export default App;
