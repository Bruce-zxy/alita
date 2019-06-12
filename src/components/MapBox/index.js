import React, { Component } from 'react';
import * as turf from '@turf/turf';
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import './index.scss'


class MapBox extends Component {
    state = {
        current: 0,
        map_center: null,
        map_zoom: 15
    }

    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkZXN6IiwiYSI6ImNqd3N6MHB2ejJjN3o0OHFtcHppdDVvNjYifQ.rBS7iYLVlmWXYQBt3wCQuA';
        var map = new mapboxgl.Map({
            container: 'react-mapbox-container',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [-74.0066, 40.7135],
            zoom: 15.5,
            pitch: 45,
            bearing: -17.6,
        });
        map.on('load', function () {
            // Insert the layer beneath any symbol layer.
            var layers = map.getStyle().layers;

            var labelLayerId;
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        "interpolate", ["linear"], ["zoom"],
                        15, 0,
                        15.05, ["get", "height"]
                    ],
                    'fill-extrusion-base': [
                        "interpolate", ["linear"], ["zoom"],
                        15, 0,
                        15.05, ["get", "min_height"]
                    ],
                    'fill-extrusion-opacity': .6
                }
            }, labelLayerId);
        });
    }

    render() {
        const { current, map_center, map_zoom } = this.state;

        return (
            <div style={{ width: "100vw", height: "100vh" }}>
                <div id="react-mapbox-container"></div>
            </div>
        )
    }
}

export default MapBox;