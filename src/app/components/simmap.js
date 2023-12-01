"use client";
import React, { useEffect, useState } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer,ScatterplotLayer,PointCloudLayer} from "@deck.gl/layers";
import {TripsLayer} from '@deck.gl/geo-layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import * as THREE from 'three';


export default function SimMap({
  buildingData,
  residentData,
  path,
  stepCount,
 duration}) {

  const accessToken = "pk.eyJ1Ijoia2VrZWh1cnJ5IiwiYSI6ImNsbzdncTlqaDA0aDEya3BiaWZuc3Q2dnAifQ.ln2R45SGy6_MTakR8XWnsw";
  const viewState = {
    latitude: 42.36299487835801,
    longitude: -71.08780013311475,
    zoom: 15.2,
    minZoom: 14.5,
    maxZoom: 22,
    pitch: 30,
    bearing: -36,
  };
  const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

//Tooltip
const getTooltip = ({ object }) => {
  let tip = "";
  if (object) {
    for(let key in object.properties) {
      tip += `<div><b>${key}:  </b>${object.properties[key]}</div>`
    }
  } 
  return (
    object && {
      html: tip,
      style: {
        background: "#121212",
        border: "1px solid #2C2C2C",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "12px",
        color: "#FFFFFF",
      },
    }
  );
  };
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const newLayers = [
      // new TripsLayer({
      //   id: 'resident_trips',
      //   data: path,
      //   getPath: d => d.path,
      //   getTimestamps: d => d.timestamps,
      //   getColor: d => [253, 128, 93],
      //   opacity: 0.5,
      //   widthMinPixels: 1,
      //   getLineWidth: 1,
      //   fadeTrail: true,
      //   trailLength: 5,
      //   currentTime: stepCount-3,
      //   transitions: {
      //     currentTime: duration,
      //   },
      // }),
      new ScatterplotLayer({
        id: "resident",
        data: residentData,
        material: false,
        stroked: false,
        opacity: 1,
        filled: true,
        getFillColor: d => [253, 128, 93],
        getPosition: d => d.coordinates,
        getRadius: 3,
        pickable: true,
        autoHighlight: true,
        highlightColor: [242, 0, 117, 120],
        transitions: {
          getPosition: duration,
        },
        updateTriggers: {
          getPosition: residentData,
        },
      }),
      new GeoJsonLayer({
        id: "building",
        data: buildingData,
        material: false,
        opacity: 0.1,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 0.5,
        getLineWidth: 0.1,
        lineWidthUnits: "meters",
        getFillColor: d => [110, 113, 117, 100],
        pickable: true,
        autoHighlight: true,
        highlightColor: [242, 0, 117, 120],
      }),
    ];

    setLayers(newLayers);
  }, [buildingData, residentData, duration]);
  
  return (
    <DeckGL
      initialViewState={viewState}
      controller={true}
      layers={layers}
      getTooltip={getTooltip}>
      <Map
        mapboxAccessToken={accessToken}
        mapStyle={mapStyle}>
      </Map>
    </DeckGL>
  );
}
