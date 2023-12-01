"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image'
import styles from './page.module.css'
import SimMap from './components/simmap.js'
import Control from './components/control';
import Loading from './components/loading';

export default function Home() {
  const serverUrl = "http://127.0.0.1:5001";
  const [path, setPath] = useState([]);
  const [residentData, setResidentData] = useState(null);
  const [buildingData, setBuildingData] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [time, setTime] = useState(0);
  const [params, setParams] = useState({
    "building_file": 'data/kendall_buildings.json',
    "road_file": "data/kendall_roads.shp",
    "population": 1000,
    });
  const [loading, setLoading] = useState(false);
  const pharseResponse = (data) => {
      setBuildingData(data.building_data);
      setResidentData(data.resident_data);
      setPath(data.path);
      setTime(data.time);
  }
  const [cache, setCache] = useState([]);
  const [ duration, setDuration] = useState(1500);

  

  return (
    <>
    <Control
      serverUrl={serverUrl}
      pharseResponse={pharseResponse}
      setParams = {setParams}
      setLoading={setLoading}
      setStepCount = {setStepCount}
      setCache = {setCache}
      stepCount =  {stepCount}
      params = {params}
      time = {time}
      cache = {cache}
      duration = {duration} 
      >
    </Control>
    <SimMap 
      buildingData={buildingData}
      residentData={residentData}
      path = {path}
      stepCount ={stepCount}
      duration = {duration}
      >
    </SimMap>
    <Loading loading={loading}></Loading>
    </>
  )
}
